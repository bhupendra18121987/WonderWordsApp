import { useEffect, useRef, useState } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useWindowDimensions, View } from 'react-native';

const PARTY_COLORS = ['#7c3aed', '#ffcf5c', '#58c896', '#6ec9ff', '#d19cff', '#ff9f43', '#ffffff'];

interface MiniConfettiProps {
  /** Increment this number to trigger a burst. */
  trigger: number;
}

/**
 * Lightweight confetti burst. Rendered above other content via an
 * absolutely-positioned overlay so it doesn't affect layout.
 *
 * Usage: keep a counter in your parent state (`burstCount`), bump it
 * on each correct answer. This component listens on the counter and
 * mounts a fresh cannon each time so the animation replays.
 */
export default function MiniConfetti({ trigger }: MiniConfettiProps) {
  const { width, height } = useWindowDimensions();
  const [key, setKey] = useState(0);
  const lastTrigger = useRef(0);

  useEffect(() => {
    if (trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    setKey((k) => k + 1);
  }, [trigger]);

  if (key === 0) return null;

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <ConfettiCannon
        key={key}
        count={80}
        origin={{ x: width / 2, y: height / 3 }}
        fadeOut
        fallSpeed={2500}
        explosionSpeed={350}
        colors={PARTY_COLORS}
      />
    </View>
  );
}
