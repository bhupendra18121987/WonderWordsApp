import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/** Palette used to color the word chips + matched cells in the WordSearch grid. */
export const WORD_COLORS = [
  { bg: '#78d76c', dark: '#3d9c34' }, // green
  { bg: '#ff8fb5', dark: '#d95a83' }, // pink
  { bg: '#6ec5ff', dark: '#2f8ac9' }, // blue
  { bg: '#ffb648', dark: '#d1861b' }, // orange
  { bg: '#c088ff', dark: '#8342c9' }, // purple
  { bg: '#ffd66b', dark: '#c58e14' }, // yellow
  { bg: '#ff7a5c', dark: '#c94a2a' }  // coral
];

export function colorForWordIndex(index: number) {
  return WORD_COLORS[index % WORD_COLORS.length]!;
}

export function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={13} r={8} stroke="#7a3ee8" strokeWidth={2} fill="none" />
      <Path d="M12 9 V13 L15 15" stroke="#7a3ee8" strokeWidth={2} strokeLinecap="round" fill="none" />
      <Path d="M9 4 L15 4" stroke="#7a3ee8" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CoinIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} fill="#f5b820" stroke="#c98816" strokeWidth={1.5} />
      <Path
        d="M12 5 L13.6 10 L18.5 10 L14.6 13 L16.2 18 L12 15 L7.8 18 L9.4 13 L5.5 10 L10.4 10 Z"
        fill="#fff8ec"
        stroke="#c98816"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SpeakerIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path d="M6 12 L12 12 L18 7 L18 25 L12 20 L6 20 Z" fill="#fff" />
      <Path d="M22 12 Q26 16 22 20" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function LightbulbIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8 12 a4 4 0 1 1 8 0 c0 2 -1 3 -1.6 4 L9.6 16 C 9 15 8 14 8 12 Z"
        fill="#ffd66b"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Rect x={9.6} y={16} width={4.8} height={3} rx={0.8} fill="#fff" />
    </Svg>
  );
}

/** Grass strip used at the very bottom of the WordSearch game. */
export function GameGrass({ width = 400, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 40" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="gg-fill-2" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#c7f85f" />
          <Stop offset="100%" stopColor="#7ecb32" />
        </LinearGradient>
      </Defs>
      <Path
        d="M-10 20 C60 0 140 0 200 16 C260 0 340 0 410 20 L410 40 L-10 40 Z"
        fill="url(#gg-fill-2)"
      />
    </Svg>
  );
}
