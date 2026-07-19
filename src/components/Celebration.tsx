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

interface CelebrationProps {
  visible: boolean;
  praise: string;
  subtitle?: string;
  stars?: number;
  showStars?: boolean;
  nextLabel?: string;
  onNext: () => void;
  onHome: () => void;
}

const PARTY_COLORS = ['#ff8fab', '#ffcf5c', '#58c896', '#6ec9ff', '#d19cff', '#ff9f43', '#ffffff'];

export default function Celebration({
  visible,
  praise,
  subtitle,
  stars = 3,
  showStars = true,
  nextLabel = 'Next puzzle →',
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
          <Animated.Text
            style={[
              styles.trophy,
              {
                transform: [
                  { scale: trophyBounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) },
                  { rotate: trophyBounce.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '8deg'] }) }
                ]
              }
            ]}
          >
            🏆
          </Animated.Text>
          <Text style={styles.praise}>{praise}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

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
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onNext}>
              <Text style={styles.btnPrimaryText}>{nextLabel}</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={onHome}>
              <Text style={styles.btnGhostText}>Home</Text>
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
    backgroundColor: 'rgba(30,20,55,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    gap: 14,
    maxWidth: 460,
    width: '100%',
    borderWidth: 4,
    borderColor: '#ffcf5c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10
  },
  trophy: { fontSize: 88, lineHeight: 100 },
  praise: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e26a89',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#55556d',
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
  btnPrimary: { backgroundColor: '#ff8fab' },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#e0e0e8' },
  btnGhostText: { color: '#2b2b3d', fontWeight: '800', fontSize: 15 }
});
