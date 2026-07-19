import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/** Illustrated home level-map: sky, water, land, winding path, trees. */
export function LevelMapScene({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 320 460" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="hm-sky" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#dff1ff" />
          <Stop offset="100%" stopColor="#f5faff" />
        </LinearGradient>
        <LinearGradient id="hm-water" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#7bc4ff" />
          <Stop offset="100%" stopColor="#4ea3e8" />
        </LinearGradient>
        <LinearGradient id="hm-land" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#b9e77c" />
          <Stop offset="100%" stopColor="#7ec53a" />
        </LinearGradient>
      </Defs>

      <Rect x={0} y={0} width={320} height={460} fill="url(#hm-sky)" />
      <Path
        d="M0 380 L0 460 L320 460 L320 420 Q260 402 210 420 Q160 438 120 420 Q80 402 40 418 Q20 424 0 380 Z"
        fill="url(#hm-water)"
      />
      <Path
        d="M0 220 Q40 170 100 190 Q160 210 220 180 Q280 150 320 190 L320 420 Q260 402 210 420 Q160 438 120 420 Q80 402 40 418 Q20 424 0 380 Z"
        fill="url(#hm-land)"
      />

      {/* winding path */}
      <Path
        d="M60 90 Q140 150 90 210 Q40 260 130 300 Q220 330 180 380 Q160 405 260 420"
        stroke="#e0b57a"
        strokeWidth={26}
        strokeLinecap="round"
        fill="none"
      />

      {/* trees */}
      {[
        { cx: 40, cy: 230 },
        { cx: 280, cy: 200 },
        { cx: 250, cy: 260 },
        { cx: 20, cy: 300 }
      ].map((t, i) => (
        <Path
          key={i}
          d={`M${t.cx - 2} ${t.cy + 8} h4 v14 h-4z`}
          fill="#7a4626"
        />
      ))}
      <Circle cx={40} cy={230} r={18} fill="#7fc846" />
      <Circle cx={280} cy={200} r={18} fill="#7fc846" />
      <Circle cx={250} cy={260} r={18} fill="#7fc846" />
      <Circle cx={20} cy={300} r={18} fill="#7fc846" />
    </Svg>
  );
}

export function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 10 V7 a4 4 0 0 1 8 0 v3" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Rect x={6} y={10} width={12} height={10} rx={2.5} fill="#fff" />
      <Circle cx={12} cy={15} r={1.5} fill="#5a3ea1" />
    </Svg>
  );
}

export function UnlockedIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 10 V7 a4 4 0 0 1 8 0" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Rect x={6} y={10} width={12} height={10} rx={2.5} fill="#fff" />
      <Circle cx={12} cy={15} r={1.5} fill="#c96f1c" />
    </Svg>
  );
}

export function LevelStar({ filled = true, size = 12 }: { filled?: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3 L14.2 9.2 L20.8 9.6 L15.6 13.6 L17.4 20.2 L12 16.4 L6.6 20.2 L8.4 13.6 L3.2 9.6 L9.8 9.2 Z"
        fill={filled ? '#ffcf3f' : 'rgba(255,255,255,0.5)'}
        stroke={filled ? '#c98816' : 'rgba(255,255,255,0.35)'}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Small kawaii panda mascot for the hero card. */
export function PandaMascot({ size = 76 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx={34} cy={26} r={16} fill="#1e1b3a" />
      <Circle cx={86} cy={26} r={16} fill="#1e1b3a" />
      <Circle cx={60} cy={60} r={42} fill="#fff" />
      <Circle cx={46} cy={62} r={5} fill="#fff" />
      <Circle cx={74} cy={62} r={5} fill="#fff" />
      <Circle cx={46} cy={62} r={2.5} fill="#111" />
      <Circle cx={74} cy={62} r={2.5} fill="#111" />
      <Circle cx={60} cy={74} r={3} fill="#1e1b3a" />
      <Path d="M56 82 Q60 88 64 82" stroke="#1e1b3a" strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Circle cx={32} cy={76} r={4} fill="#ffc0d3" opacity={0.85} />
      <Circle cx={88} cy={76} r={4} fill="#ffc0d3" opacity={0.85} />
    </Svg>
  );
}
