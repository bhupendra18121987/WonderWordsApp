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

/** Bear character used in the AgeSelect "3-4" tile. */
export function BearAvatar({ size = 82 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx={34} cy={34} r={14} fill="#a76a3a" />
      <Circle cx={86} cy={34} r={14} fill="#a76a3a" />
      <Circle cx={34} cy={34} r={7} fill="#e6b58a" />
      <Circle cx={86} cy={34} r={7} fill="#e6b58a" />
      <Circle cx={60} cy={64} r={36} fill="#c17e46" />
      <Ellipse cx={60} cy={78} rx={22} ry={17} fill="#f2d3af" />
      <Ellipse cx={49} cy={60} rx={4} ry={5} fill="#1c1330" />
      <Ellipse cx={71} cy={60} rx={4} ry={5} fill="#1c1330" />
      <Ellipse cx={60} cy={74} rx={4} ry={3} fill="#1c1330" />
      <Path d="M55 82 Q60 87 65 82" stroke="#1c1330" strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Path d="M46 100 L58 92 L58 108 Z M74 100 L62 92 L62 108 Z" fill="#3d9dfa" />
      <Rect x={57} y={94} width={6} height={12} rx={1.5} fill="#2b7dd1" />
    </Svg>
  );
}

/** Bunny character used in the AgeSelect "5-6" tile. */
export function BunnyAvatar({ size = 82 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Ellipse cx={44} cy={26} rx={9} ry={20} fill="#f4f0f2" stroke="#d9c9d0" strokeWidth={1.5} />
      <Ellipse cx={76} cy={26} rx={9} ry={20} fill="#f4f0f2" stroke="#d9c9d0" strokeWidth={1.5} />
      <Ellipse cx={44} cy={30} rx={4} ry={12} fill="#f7b8c7" />
      <Ellipse cx={76} cy={30} rx={4} ry={12} fill="#f7b8c7" />
      <Circle cx={60} cy={66} r={34} fill="#fbf5f7" stroke="#d9c9d0" strokeWidth={1.5} />
      <Circle cx={42} cy={76} r={6} fill="#f7b8c7" opacity={0.8} />
      <Circle cx={78} cy={76} r={6} fill="#f7b8c7" opacity={0.8} />
      <Ellipse cx={50} cy={66} rx={4} ry={5} fill="#1c1330" />
      <Ellipse cx={70} cy={66} rx={4} ry={5} fill="#1c1330" />
      <Path d="M57 74 Q60 78 63 74 Q60 76 57 74" fill="#f47a99" stroke="#c4506e" strokeWidth={1} />
      <Path d="M60 76 L60 80" stroke="#1c1330" strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Lion character used in the AgeSelect "7-8" tile. */
export function LionAvatar({ size = 82 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <G fill="#c65f22">
        <Circle cx={24} cy={52} r={12} />
        <Circle cx={34} cy={30} r={12} />
        <Circle cx={60} cy={20} r={13} />
        <Circle cx={86} cy={30} r={12} />
        <Circle cx={96} cy={52} r={12} />
        <Circle cx={90} cy={78} r={12} />
        <Circle cx={60} cy={94} r={14} />
        <Circle cx={30} cy={78} r={12} />
      </G>
      <Circle cx={36} cy={44} r={8} fill="#c65f22" />
      <Circle cx={84} cy={44} r={8} fill="#c65f22" />
      <Circle cx={60} cy={62} r={30} fill="#f7c04a" />
      <Ellipse cx={60} cy={76} rx={18} ry={14} fill="#fbe6ba" />
      <Ellipse cx={50} cy={60} rx={3.6} ry={4.6} fill="#1c1330" />
      <Ellipse cx={70} cy={60} rx={3.6} ry={4.6} fill="#1c1330" />
      <Path d="M56 70 Q60 76 64 70 Z" fill="#1c1330" />
    </Svg>
  );
}

/** Star-with-face mascot used at the top of the AgeSelect screen. */
export function StarMascot({ size = 72 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="age-star-fill" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#ffe268" />
          <Stop offset="100%" stopColor="#f5b820" />
        </LinearGradient>
      </Defs>
      <Path
        d="M60 8 L74 42 L110 46 L82 68 L92 104 L60 84 L28 104 L38 68 L10 46 L46 42 Z"
        fill="url(#age-star-fill)"
        stroke="#c98816"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <Ellipse cx={50} cy={58} rx={3.4} ry={4.4} fill="#1e1b3a" />
      <Ellipse cx={70} cy={58} rx={3.4} ry={4.4} fill="#1e1b3a" />
      <Path d="M52 70 Q60 78 68 70" stroke="#1e1b3a" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Decorative rolling hills scene that anchors the bottom of the AgeSelect. */
export function HillsScene({ width, height = 160 }: { width: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 200" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="hill-back" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#c3ee8a" />
          <Stop offset="100%" stopColor="#a7de5f" />
        </LinearGradient>
        <LinearGradient id="hill-front" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#b9ec52" />
          <Stop offset="100%" stopColor="#7ecb32" />
        </LinearGradient>
        <LinearGradient id="cloud-fill" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#ffe3f5" />
          <Stop offset="100%" stopColor="#f9c5e6" />
        </LinearGradient>
      </Defs>
      <Path
        d="M-20 90 C 20 60, 60 60, 100 88 C 130 60, 180 60, 210 88 C 240 62, 290 60, 320 86 C 350 62, 400 66, 420 92 L 420 130 L -20 130 Z"
        fill="url(#cloud-fill)"
      />
      <Path
        d="M-20 150 C 40 110, 100 110, 160 150 C 200 118, 260 118, 310 150 C 350 122, 400 128, 420 150 L 420 200 L -20 200 Z"
        fill="url(#hill-back)"
      />
      <Path
        d="M-20 172 C 40 140, 90 140, 140 172 C 190 146, 250 146, 300 172 C 340 150, 400 154, 420 172 L 420 200 L -20 200 Z"
        fill="url(#hill-front)"
      />
      <G fill="#5faa26" opacity={0.9}>
        <Path d="M40 170 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <Path d="M120 176 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <Path d="M220 168 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <Path d="M310 174 l-3 -6 l3 2 l3 -2 l-3 6z" />
        <Path d="M360 170 l-3 -6 l3 2 l3 -2 l-3 6z" />
      </G>
      <G>
        <Circle cx={60} cy={182} r={2} fill="#ffffff" />
        <Circle cx={60} cy={182} r={0.9} fill="#ffcf3f" />
        <Circle cx={180} cy={188} r={2} fill="#ffffff" />
        <Circle cx={180} cy={188} r={0.9} fill="#ffcf3f" />
        <Circle cx={330} cy={184} r={2} fill="#ffffff" />
        <Circle cx={330} cy={184} r={0.9} fill="#ffcf3f" />
      </G>
    </Svg>
  );
}
