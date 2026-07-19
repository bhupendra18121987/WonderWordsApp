import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

interface PandaIllustrationProps {
  size?: number;
}

/**
 * Reusable panda mascot used across splash/hero screens.
 * Drawn in-code so we can keep mobile/web visuals aligned.
 */
export default function PandaIllustration({ size = 140 }: PandaIllustrationProps) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 220 220" accessibilityLabel="Panda illustration">
      <Ellipse cx="110" cy="206" rx="62" ry="11" fill="rgba(76,29,149,0.18)" />

      <Rect x="74" y="118" width="72" height="78" rx="28" fill="#7c3aed" />
      <Rect x="78" y="122" width="64" height="46" rx="22" fill="#8b5cf6" />
      <Path d="M102 122 h16 v20 h-16 z" fill="#f9fafb" />
      <Circle cx="110" cy="132" r="4" fill="#1f2937" />

      <Ellipse cx="62" cy="148" rx="16" ry="20" fill="#1f2937" />
      <Ellipse cx="158" cy="148" rx="16" ry="20" fill="#1f2937" />
      <Ellipse cx="47" cy="120" rx="15" ry="20" fill="#1f2937" transform="rotate(-24 47 120)" />
      <Ellipse cx="173" cy="128" rx="16" ry="20" fill="#1f2937" transform="rotate(24 173 128)" />

      <Circle cx="75" cy="64" r="23" fill="#1f2937" />
      <Circle cx="145" cy="64" r="23" fill="#1f2937" />
      <Circle cx="110" cy="86" r="58" fill="#ffffff" />

      <Ellipse cx="84" cy="88" rx="19" ry="24" fill="#1f2937" />
      <Ellipse cx="136" cy="88" rx="19" ry="24" fill="#1f2937" />
      <Circle cx="87" cy="90" r="7" fill="#ffffff" />
      <Circle cx="133" cy="90" r="7" fill="#ffffff" />

      <Ellipse cx="110" cy="112" rx="15" ry="11" fill="#111827" />
      <Path d="M95 126 C99 140, 121 140, 125 126" stroke="#111827" strokeWidth="6" strokeLinecap="round" fill="none" />

      <Ellipse cx="95" cy="182" rx="10" ry="8" fill="#111827" />
      <Ellipse cx="125" cy="182" rx="10" ry="8" fill="#111827" />
    </Svg>
  );
}