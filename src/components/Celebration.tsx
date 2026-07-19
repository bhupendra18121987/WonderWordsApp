import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import PandaIllustration from './PandaIllustration';
import { colors, radii, shadow } from '../core/theme';

interface CelebrationProps {
  visible: boolean;
  praise: string;
  wordsFound?: number;
  subtitle?: string;
  stars?: number;
  showStars?: boolean;
  nextLabel?: string;
  homeLabel?: string;
  onNext: () => void;
  onHome: () => void;
}

const PARTY_COLORS = ['#7c3aed', '#ffcf5c', '#58c896', '#6ec9ff', '#d19cff', '#ff9f43', '#ffffff'];

export default function Celebration({
  visible,
  praise,
  wordsFound,
  subtitle,
  stars = 3,
  showStars = true,
  nextLabel = 'Next puzzle →',
  homeLabel = '🏠 Home',
  onNext,
  onHome
}: CelebrationProps) {
  const { width, height } = useWindowDimensions();
  const trophyBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    trophyBounce.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyBounce, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(trophyBounce, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();
  }, [visible, trophyBounce]);

  const summary = subtitle ?? (typeof wordsFound === 'number'
    ? `${wordsFound} ${wordsFound === 1 ? 'word' : 'words'} found!`
    : undefined);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onHome}>
      <View style={styles.overlay}>
        {/* Two confetti cannons for a full-screen shower */}
        <ConfettiCannon
          count={140}
          origin={{ x: 0, y: height * 0.4 }}
          fadeOut
          autoStart
          fallSpeed={2600}
          colors={PARTY_COLORS}
        />
        <ConfettiCannon
          count={140}
          origin={{ x: width, y: height * 0.4 }}
          fadeOut
          autoStart
          fallSpeed={2600}
          colors={PARTY_COLORS}
        />

        <View style={styles.modal}>
          <Animated.View
            style={[
              styles.hero,
              {
                transform: [
                  { scale: trophyBounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) },
                  { rotate: trophyBounce.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '8deg'] }) }
                ]
              }
            ]}
          >
            <PandaIllustration size={108} />
          </Animated.View>
          <Text style={styles.praise}>{praise}</Text>
          {summary && <Text style={styles.subtitle}>{summary}</Text>}

          {showStars && (
            <View style={styles.starsRow}>
              {[0, 1, 2].map((i) => (
                <Text
                  key={i}
                  style={[
                    styles.star,
                    i < stars ? styles.starWon : styles.starMissed
                  ]}
                >
                  {i < stars ? '⭐' : '☆'}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.btnPressed]}
              onPress={onNext}
            >
              <Text style={styles.btnPrimaryText}>{nextLabel}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnPressed]}
              onPress={onHome}
            >
              <Text style={styles.btnGhostText}>{homeLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,20,55,0.68)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: '#fffaf0',
    borderRadius: radii.lg,
    padding: 26,
    alignItems: 'center',
    gap: 14,
    maxWidth: 460,
    width: '100%',
    borderWidth: 4,
    borderColor: colors.accent,
    ...shadow.card
  },
  hero: { marginTop: -8 },
  praise: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center'
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  star: { fontSize: 44, lineHeight: 50 },
  starWon: { opacity: 1 },
  starMissed: { opacity: 0.4 },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnPrimary: { backgroundColor: '#7c3aed' },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  btnGhost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.border },
  btnGhostText: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  btnPressed: { transform: [{ scale: 0.96 }], opacity: 0.92 }
});
