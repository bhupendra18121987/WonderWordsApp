import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop
} from 'react-native-svg';

/** Speaker icon used inside the purple word audio button. */
export function AudioIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path d="M6 12 L12 12 L18 7 L18 25 L12 20 L6 20 Z" fill="#fff" />
      <Path d="M22 12 Q26 16 22 20" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Left/right chevron icon for prev/next pager buttons. */
export function ChevronIcon({ dir = 'right', size = 20 }: { dir?: 'left' | 'right'; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={dir === 'right' ? 'M9 6 L15 12 L9 18' : 'M15 6 L9 12 L15 18'}
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Garden backdrop scene wrapping a character. */
export function GardenScene({ children, width, height }: { children?: ReactNode; width: number; height: number }) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 320 240">
        <Defs>
          <LinearGradient id="wm-sky" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#e7f3ff" />
            <Stop offset="100%" stopColor="#f8fbff" />
          </LinearGradient>
          <LinearGradient id="wm-hill-back" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#c5ea8b" />
            <Stop offset="100%" stopColor="#a5da5a" />
          </LinearGradient>
          <LinearGradient id="wm-hill-front" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#b6ea63" />
            <Stop offset="100%" stopColor="#7ec53a" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={320} height={240} fill="url(#wm-sky)" />
        <G>
          <Circle cx={30} cy={130} r={26} fill="#8fcf5c" />
          <Circle cx={52} cy={118} r={30} fill="#7fc846" />
          <Rect x={35} y={150} width={6} height={24} fill="#7a4626" />
        </G>
        <G>
          <Circle cx={292} cy={128} r={28} fill="#8fcf5c" />
          <Circle cx={270} cy={118} r={24} fill="#7fc846" />
          <Rect x={288} y={150} width={6} height={24} fill="#7a4626" />
        </G>
        <Path
          d="M-10 200 C40 160 100 160 160 200 C210 168 280 168 330 200 L330 240 L-10 240 Z"
          fill="url(#wm-hill-back)"
        />
        <Path
          d="M-10 224 C50 190 110 190 160 220 C210 194 270 194 330 224 L330 240 L-10 240 Z"
          fill="url(#wm-hill-front)"
        />
      </Svg>
      {children ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

/** Cute apple character sitting on the grass. */
export function AppleScene({ size = 200 }: { size?: number }) {
  const h = Math.round((size * 3) / 4);
  return (
    <GardenScene width={size} height={h}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size * 0.5} height={h * 0.7} viewBox="0 0 100 100">
          <Ellipse cx={50} cy={92} rx={30} ry={5} fill="rgba(60,40,20,0.15)" />
          <Path
            d="M50 20 C 20 20 14 50 20 70 C 26 90 44 92 50 92 C 56 92 74 90 80 70 C 86 50 80 20 50 20 Z"
            fill="#e73535"
            stroke="#a71212"
            strokeWidth={2}
          />
          <Path d="M50 20 Q52 10 56 6" stroke="#6b3d13" strokeWidth={4} strokeLinecap="round" fill="none" />
          <Path d="M56 6 Q72 4 74 18 Q60 20 56 6 Z" fill="#58c53a" stroke="#3b8f1f" strokeWidth={1.5} />
          <Ellipse cx={40} cy={56} rx={4} ry={5} fill="#1c1330" />
          <Ellipse cx={60} cy={56} rx={4} ry={5} fill="#1c1330" />
          <Path d="M42 66 Q50 74 58 66" stroke="#1c1330" strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </Svg>
      </View>
    </GardenScene>
  );
}

/** Fallback: emoji sitting on the grass. */
export function EmojiScene({ emoji, size = 200 }: { emoji: string; size?: number }) {
  const h = Math.round((size * 3) / 4);
  return (
    <GardenScene width={size} height={h}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
    </GardenScene>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 80 }
});
