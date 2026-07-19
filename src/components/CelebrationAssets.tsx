import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/** Colorful triangular bunting strung across the top of the Level Complete screen. */
export function Bunting({ width = 360, height = 74 }: { width?: number; height?: number }) {
  const flags = ['#ff8fab', '#ffcf5c', '#7fe25a', '#6ec5ff', '#c088ff', '#ff9754', '#ff8fab', '#ffcf5c', '#7fe25a', '#6ec5ff'];
  return (
    <Svg width={width} height={height} viewBox="0 0 360 80" preserveAspectRatio="none">
      <Path d="M0 26 Q90 6 180 26 Q270 46 360 26" stroke="#fff8ec" strokeWidth={1.5} opacity={0.7} fill="none" />
      {flags.map((c, i) => {
        const x = 8 + i * 34;
        const y = 14 + Math.sin((i / flags.length) * Math.PI) * -12 + i * 1.6;
        return (
          <G key={i} transform={`translate(${x},${y}) rotate(${(i - 4) * 4})`}>
            <Path d="M0 0 L18 0 L9 22 Z" fill={c} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
          </G>
        );
      })}
    </Svg>
  );
}

/** Scattered confetti bits (SVG background). */
export function ConfettiBits({ width, height }: { width: number; height: number }) {
  const bits = [
    { x: 30, y: 120, c: '#ff8fab', r: -20 },
    { x: 70, y: 200, c: '#ffcf5c', r: 15 },
    { x: 40, y: 320, c: '#7fe25a', r: -8 },
    { x: 60, y: 420, c: '#6ec5ff', r: 25 },
    { x: width - 40, y: 160, c: '#ffcf5c', r: 12 },
    { x: width - 20, y: 240, c: '#ff8fab', r: -22 },
    { x: width - 50, y: 340, c: '#7fe25a', r: 18 },
    { x: width - 30, y: 440, c: '#6ec5ff', r: -14 }
  ];
  return (
    <Svg width={width} height={height}>
      {bits.map((b, i) => (
        <G key={i} transform={`translate(${b.x},${b.y}) rotate(${b.r})`}>
          <Rect x={-6} y={-2} width={12} height={4} rx={1.5} fill={b.c} />
        </G>
      ))}
    </Svg>
  );
}

/** Big yellow star badge (filled or empty). */
export function BigStar({ filled = true, size = 72 }: { filled?: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id={`bg-star-${filled ? 'on' : 'off'}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor={filled ? '#ffe268' : '#dcd6ec'} />
          <Stop offset="100%" stopColor={filled ? '#f5a91e' : '#a89ec4'} />
        </LinearGradient>
      </Defs>
      <Path
        d="M60 8 L74 42 L110 46 L82 68 L92 104 L60 84 L28 104 L38 68 L10 46 L46 42 Z"
        fill={`url(#bg-star-${filled ? 'on' : 'off'})`}
        stroke={filled ? '#c98816' : '#7f7796'}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Kawaii panda with arms raised in celebration. */
export function CheerPanda({ size = 180 }: { size?: number }) {
  const w = size;
  const h = Math.round((size * 300) / 240);
  return (
    <Svg width={w} height={h} viewBox="0 0 240 300">
      {/* body */}
      <Path
        d="M72 180 Q60 240 92 282 L148 282 Q180 240 168 180 Q152 168 120 168 Q88 168 72 180 Z"
        fill="#7a3ee8"
        stroke="#4a1eae"
        strokeWidth={2}
      />
      <Path d="M84 176 Q120 196 156 176 Q158 188 156 194 Q120 210 84 194 Q82 188 84 176 Z" fill="#5a24bd" />
      {/* ears + head */}
      <Circle cx={72} cy={62} r={22} fill="#1e1b3a" />
      <Circle cx={168} cy={62} r={22} fill="#1e1b3a" />
      <Circle cx={120} cy={110} r={62} fill="#fff" stroke="#d0d0d8" strokeWidth={1} />
      <Ellipse cx={94} cy={110} rx={18} ry={22} fill="#1e1b3a" transform="rotate(-8 94 110)" />
      <Ellipse cx={146} cy={110} rx={18} ry={22} fill="#1e1b3a" transform="rotate(8 146 110)" />
      <Circle cx={95} cy={112} r={8} fill="#fff" />
      <Circle cx={145} cy={112} r={8} fill="#fff" />
      <Circle cx={95} cy={112} r={4} fill="#111" />
      <Circle cx={145} cy={112} r={4} fill="#111" />
      <Ellipse cx={120} cy={130} rx={6} ry={4} fill="#1e1b3a" />
      <Path
        d="M108 142 Q120 160 132 142 Q128 152 120 152 Q112 152 108 142 Z"
        fill="#c93f5f"
        stroke="#1e1b3a"
        strokeWidth={1.5}
      />
      <Circle cx={82} cy={138} r={6} fill="#ffc0d3" opacity={0.85} />
      <Circle cx={158} cy={138} r={6} fill="#ffc0d3" opacity={0.85} />
      {/* raised arms */}
      <G transform="translate(38,70) rotate(-30)">
        <Ellipse cx={0} cy={20} rx={13} ry={30} fill="#7a3ee8" stroke="#4a1eae" strokeWidth={2} />
        <Circle cx={0} cy={-8} r={16} fill="#1e1b3a" stroke="#4a1eae" strokeWidth={1.5} />
      </G>
      <G transform="translate(202,70) rotate(30)">
        <Ellipse cx={0} cy={20} rx={13} ry={30} fill="#7a3ee8" stroke="#4a1eae" strokeWidth={2} />
        <Circle cx={0} cy={-8} r={16} fill="#1e1b3a" stroke="#4a1eae" strokeWidth={1.5} />
      </G>
    </Svg>
  );
}

export function HomeIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 11 L12 4 L20 11 L20 20 L14 20 L14 14 L10 14 L10 20 L4 20 Z"
        stroke="#7a3ee8"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function RefreshIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M20 12 a8 8 0 1 1 -3 -6" stroke="#7a3ee8" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Path d="M20 4 L20 10 L14 10" stroke="#7a3ee8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/** Small star icon used inside the "+50" reward chip. */
export function RewardStar({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3 L14.2 9.2 L20.8 9.6 L15.6 13.6 L17.4 20.2 L12 16.4 L6.6 20.2 L8.4 13.6 L3.2 9.6 L9.8 9.2 Z"
        fill="#ffcf3f"
        stroke="#c98816"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Small coin icon used inside the "+20" reward chip. */
export function RewardCoin({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill="#f5b820" stroke="#c98816" strokeWidth={1.5} />
      <Path
        d="M12 6 L13.4 10.2 L18 10.4 L14.4 13 L15.7 17.4 L12 15 L8.3 17.4 L9.6 13 L6 10.4 L10.6 10.2 Z"
        fill="#fff8ec"
        stroke="#c98816"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
