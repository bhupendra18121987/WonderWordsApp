import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/** Full-scene backdrop for the splash: sky, clouds, rainbow, hills, trees, house. */
export function SplashBackdrop({ width, height }: { width: number; height: number }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice">
            <Defs>
                <LinearGradient id="sp-sky" x1="50%" y1="0%" x2="50%" y2="100%">
                    <Stop offset="0%" stopColor="#8ed6ff" />
                    <Stop offset="55%" stopColor="#bfe6ff" />
                    <Stop offset="100%" stopColor="#eaf7ff" />
                </LinearGradient>
                <LinearGradient id="sp-hill-back" x1="50%" y1="0%" x2="50%" y2="100%">
                    <Stop offset="0%" stopColor="#8fda56" />
                    <Stop offset="100%" stopColor="#5ea82c" />
                </LinearGradient>
                <LinearGradient id="sp-hill-front" x1="50%" y1="0%" x2="50%" y2="100%">
                    <Stop offset="0%" stopColor="#7ecf3d" />
                    <Stop offset="100%" stopColor="#4e952a" />
                </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={360} height={640} fill="url(#sp-sky)" />
            {/* clouds */}
            <G fill="#fff" opacity={0.95}>
                <Ellipse cx={60} cy={110} rx={34} ry={12} />
                <Ellipse cx={86} cy={102} rx={22} ry={10} />
                <Ellipse cx={290} cy={80} rx={30} ry={11} />
                <Ellipse cx={270} cy={72} rx={18} ry={8} />
                <Ellipse cx={184} cy={60} rx={24} ry={9} />
            </G>
            {/* rainbow */}
            <G fill="none" strokeLinecap="round" opacity={0.85}>
                <Path d="M40 220 A 140 140 0 0 1 320 220" stroke="#ff5c5c" strokeWidth={10} />
                <Path d="M52 220 A 128 128 0 0 1 308 220" stroke="#ff9a3c" strokeWidth={10} />
                <Path d="M64 220 A 116 116 0 0 1 296 220" stroke="#ffd23c" strokeWidth={10} />
                <Path d="M76 220 A 104 104 0 0 1 284 220" stroke="#4ecb46" strokeWidth={10} />
                <Path d="M88 220 A 92 92 0 0 1 272 220" stroke="#4a9df1" strokeWidth={10} />
                <Path d="M100 220 A 80 80 0 0 1 260 220" stroke="#9c5cff" strokeWidth={10} />
            </G>
            {/* hills */}
            <Path
                d="M-10 470 C40 420 100 420 160 460 C220 420 280 420 370 460 L370 640 L-10 640 Z"
                fill="url(#sp-hill-back)"
            />
            <Path
                d="M-10 520 C60 470 130 470 200 510 C260 480 320 480 370 510 L370 640 L-10 640 Z"
                fill="url(#sp-hill-front)"
            />
            {/* left trees */}
            <G>
                <Rect x={22} y={470} width={12} height={36} fill="#7a4626" />
                <Circle cx={28} cy={438} r={38} fill="#67b530" />
                <Circle cx={0} cy={450} r={26} fill="#4f9925" />
                <Circle cx={52} cy={452} r={28} fill="#8fdc55" />
            </G>
            {/* small house right */}
            <G>
                <Rect x={280} y={470} width={52} height={46} fill="#f4e0b5" stroke="#a97b3d" strokeWidth={1.5} />
                <Path d="M274 472 L306 444 L338 472 Z" fill="#e04835" stroke="#a71c1c" strokeWidth={1.5} />
                <Rect x={296} y={482} width={14} height={14} rx={2} fill="#7ecafc" stroke="#3d94d6" strokeWidth={1.5} />
                <Rect x={316} y={496} width={10} height={20} rx={2} fill="#7a4626" />
            </G>
        </Svg>
    );
}

/** Panda mascot in a purple hoodie holding a book and waving. */
export function SplashPanda({ size = 220 }: { size?: number }) {
    return (
        <Svg width={size} height={(size * 260) / 220} viewBox="0 0 260 300">
            {/* backpack strap */}
            <Path d="M100 130 Q98 168 112 200" stroke="#f2a63a" strokeWidth={7} strokeLinecap="round" fill="none" />
            {/* hoodie body */}
            <Path
                d="M70 160 Q60 220 90 260 L170 260 Q200 220 190 160 Q170 148 130 148 Q90 148 70 160 Z"
                fill="#7a3ee8"
                stroke="#4a1eae"
                strokeWidth={2}
            />
            <Path d="M92 156 Q130 176 168 156 Q170 168 168 174 Q130 190 92 174 Q90 168 92 156 Z" fill="#5a24bd" />
            {/* pants */}
            <Path
                d="M90 260 L110 300 L128 300 L128 262 Z M170 260 L150 300 L132 300 L132 262 Z"
                fill="#2e4173"
                stroke="#1c2851"
                strokeWidth={2}
            />
            <Ellipse cx={115} cy={298} rx={12} ry={6} fill="#1c1330" />
            <Ellipse cx={145} cy={298} rx={12} ry={6} fill="#1c1330" />
            {/* book */}
            <Ellipse cx={76} cy={196} rx={14} ry={20} fill="#fff" stroke="#d0d0d8" strokeWidth={1} />
            <G>
                <Rect x={56} y={196} width={46} height={34} rx={3} fill="#3d7dd6" stroke="#26568f" strokeWidth={1.5} />
                <Rect x={60} y={200} width={18} height={26} rx={2} fill="#f5e08a" />
                <Rect x={80} y={200} width={18} height={26} rx={2} fill="#fff" stroke="#d0d0d8" strokeWidth={0.8} />
            </G>
            {/* right arm waving */}
            <G>
                <Ellipse cx={200} cy={170} rx={10} ry={18} fill="#7a3ee8" stroke="#4a1eae" strokeWidth={2} transform="rotate(20 200 170)" />
                <Circle cx={200} cy={156} r={10} fill="#fff" stroke="#d0d0d8" strokeWidth={1} />
            </G>
            {/* ears */}
            <Circle cx={82} cy={52} r={20} fill="#1e1b3a" />
            <Circle cx={178} cy={52} r={20} fill="#1e1b3a" />
            {/* head */}
            <Circle cx={130} cy={92} r={60} fill="#fff" stroke="#d0d0d8" strokeWidth={1} />
            <Ellipse cx={106} cy={90} rx={18} ry={22} fill="#1e1b3a" transform="rotate(-10 106 90)" />
            <Ellipse cx={154} cy={90} rx={18} ry={22} fill="#1e1b3a" transform="rotate(10 154 90)" />
            <Circle cx={107} cy={94} r={8} fill="#fff" />
            <Circle cx={153} cy={94} r={8} fill="#fff" />
            <Circle cx={107} cy={94} r={4} fill="#111" />
            <Circle cx={153} cy={94} r={4} fill="#111" />
            <Ellipse cx={130} cy={114} rx={6} ry={4} fill="#1e1b3a" />
            <Path
                d="M120 124 Q130 140 140 124 Q136 132 130 132 Q124 132 120 124 Z"
                fill="#c93f5f"
                stroke="#1e1b3a"
                strokeWidth={1.5}
            />
            <Circle cx={94} cy={120} r={6} fill="#ffc0d3" opacity={0.85} />
            <Circle cx={166} cy={120} r={6} fill="#ffc0d3" opacity={0.85} />
        </Svg>
    );
}

/** Music-note icon used in the top-right splash button. */
export function MusicNoteIcon({ size = 20 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                d="M9 18 V6 L18 4 V16"
                stroke="#fff"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <Ellipse cx={7} cy={18} rx={3} ry={2.4} fill="#fff" />
            <Ellipse cx={16} cy={16} rx={3} ry={2.4} fill="#fff" />
        </Svg>
    );
}

/** Small right-arrow used inside the Let's Play button. */
export function PlayArrowIcon({ size = 14 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M9 6 L15 12 L9 18" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
    );
}
