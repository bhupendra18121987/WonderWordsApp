import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, G } from 'react-native-svg';

/** Top mascot with a smiling star + two side stars. */
export function GreatJobStarCluster({ width = 220, height = 90 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 90">
      <Defs>
        <LinearGradient id="gj-star-main" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#ffe268" />
          <Stop offset="100%" stopColor="#f5a91e" />
        </LinearGradient>
        <LinearGradient id="gj-star-alt" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#ffcf5c" />
          <Stop offset="100%" stopColor="#f28a1e" />
        </LinearGradient>
      </Defs>
      <G transform="translate(48,52) rotate(-18)">
        <Path
          d="M0 -18 L6 -6 L20 -4 L10 6 L14 20 L0 12 L-14 20 L-10 6 L-20 -4 L-6 -6 Z"
          fill="url(#gj-star-alt)"
          stroke="#c86a10"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </G>
      <G transform="translate(172,50) rotate(20)">
        <Path
          d="M0 -18 L6 -6 L20 -4 L10 6 L14 20 L0 12 L-14 20 L-10 6 L-20 -4 L-6 -6 Z"
          fill="url(#gj-star-alt)"
          stroke="#c86a10"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </G>
      <G transform="translate(110,44)">
        <Path
          d="M0 -32 L10 -10 L34 -6 L16 8 L22 32 L0 20 L-22 32 L-16 8 L-34 -6 L-10 -10 Z"
          fill="url(#gj-star-main)"
          stroke="#c98816"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <Circle cx={-8} cy={-4} r={2.4} fill="#1e1b3a" />
        <Circle cx={8} cy={-4} r={2.4} fill="#1e1b3a" />
        <Path d="M-6 6 Q0 12 6 6" stroke="#1e1b3a" strokeWidth={2} strokeLinecap="round" fill="none" />
      </G>
    </Svg>
  );
}

/** Orange fabric banner used behind the "Great Job!" text. */
export function GreatJobBanner({ children, width = 300 }: { children: ReactNode; width?: number }) {
  return (
    <View style={[styles.banner, { width, height: 74 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 380 90" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="gj-banner-fill" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#ffb545" />
            <Stop offset="100%" stopColor="#ee7a10" />
          </LinearGradient>
        </Defs>
        <Path d="M0 30 L22 20 L46 34 L46 60 L22 74 L0 66 L14 48 Z" fill="#c95a0d" />
        <Path d="M380 30 L358 20 L334 34 L334 60 L358 74 L380 66 L366 48 Z" fill="#c95a0d" />
        <Path
          d="M32 14 Q80 8 130 16 Q200 26 260 16 Q310 10 348 14 L348 78 Q310 84 260 76 Q200 66 130 76 Q80 84 32 78 Z"
          fill="url(#gj-banner-fill)"
          stroke="#c95a0d"
          strokeWidth={1}
        />
      </Svg>
      <Text style={styles.bannerText}>{children}</Text>
    </View>
  );
}

/** Speaker/audio button icon (used inside a purple circle). */
export function SpeakerIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path d="M6 12 L12 12 L18 7 L18 25 L12 20 L6 20 Z" fill="#fff" />
      <Path d="M22 12 Q26 16 22 20" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Illustrated cat character for the CAT word reveal. */
export function CatCharacter({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220">
      <Path
        d="M172 168 Q198 150 200 122 Q200 98 176 108"
        stroke="#e07f2c"
        strokeWidth={18}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M172 168 Q198 150 200 122 Q200 98 176 108"
        stroke="#f2a44a"
        strokeWidth={10}
        strokeLinecap="round"
        fill="none"
      />
      <G>
        <Path
          d="M108 168 A 52 34 0 1 0 108 170"
          fill="#f2a44a"
        />
      </G>
      <Circle cx={108} cy={112} r={54} fill="#f2a44a" />
      <Path d="M60 82 L54 40 L92 74 Z" fill="#f2a44a" />
      <Path d="M156 82 L162 40 L124 74 Z" fill="#f2a44a" />
      <Path d="M66 76 L64 52 L86 72 Z" fill="#f7b8c7" />
      <Path d="M150 76 L152 52 L130 72 Z" fill="#f7b8c7" />
      <Circle cx={90} cy={108} r={9} fill="#1c1330" />
      <Circle cx={126} cy={108} r={9} fill="#1c1330" />
      <Circle cx={93} cy={104} r={2.5} fill="#fff" />
      <Circle cx={129} cy={104} r={2.5} fill="#fff" />
      <Path d="M100 124 Q108 132 116 124 Q112 128 108 128 Q104 128 100 124 Z" fill="#f47a99" stroke="#c4506e" strokeWidth={1.4} />
      <Path d="M108 128 L108 134 M108 134 Q102 140 98 138 M108 134 Q114 140 118 138" stroke="#1c1330" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerText: {
    position: 'absolute',
    color: '#fff',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(50,15,110,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1
  }
});
