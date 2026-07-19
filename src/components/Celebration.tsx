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
import {
  BigStar,
  Bunting,
  CheerPanda,
  HomeIcon,
  RefreshIcon,
  RewardCoin,
  RewardStar
} from './CelebrationAssets';
import { radii, shadow } from '../core/theme';

interface CelebrationProps {
  visible: boolean;
  praise: string;
  wordsFound?: number;
  subtitle?: string;
  stars?: number;
  showStars?: boolean;
  nextLabel?: string;
  homeLabel?: string;
  pointsEarned?: number;
  coinsEarned?: number;
  onNext: () => void;
  onHome: () => void;
}

const PARTY_COLORS = ['#ff8fab', '#ffcf5c', '#7fe25a', '#6ec5ff', '#c088ff', '#ff9754'];

export default function Celebration({
  visible,
  praise,
  wordsFound,
  subtitle,
  stars = 3,
  showStars = true,
  nextLabel = 'Awesome!',
  homeLabel = 'Home',
  pointsEarned,
  coinsEarned,
  onNext,
  onHome
}: CelebrationProps) {
  const { width, height } = useWindowDimensions();
  const pandaBounce = useRef(new Animated.Value(0)).current;
  void praise; void wordsFound; void homeLabel; void subtitle;

  const earnedPoints = pointsEarned ?? Math.max(10, stars * 20);
  const earnedCoins = coinsEarned ?? Math.max(4, Math.round(stars * 8));

  useEffect(() => {
    if (!visible) return;
    pandaBounce.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pandaBounce, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pandaBounce, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();
  }, [visible, pandaBounce]);

  if (!visible) return null;

  const pandaTranslate = pandaBounce.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onHome}>
      <View style={styles.overlay}>
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

        <View style={styles.bunting} pointerEvents="none">
          <Bunting width={Math.min(width - 20, 380)} height={70} />
        </View>

        <View style={styles.modal}>
          <Text style={styles.title}>Level{'\n'}Complete!</Text>

          <Animated.View style={{ transform: [{ translateY: pandaTranslate }] }}>
            <CheerPanda size={160} />
          </Animated.View>

          {showStars ? (
            <View style={styles.starsRow}>
              {[0, 1, 2].map((i) => (
                <BigStar key={i} filled={i < stars} size={54} />
              ))}
            </View>
          ) : null}

          <View style={styles.earnedChip}>
            <Text style={styles.earnedChipText}>You earned</Text>
          </View>

          <View style={styles.rewardsRow}>
            <View style={styles.reward}>
              <RewardStar size={22} />
              <Text style={styles.rewardText}>+{earnedPoints}</Text>
            </View>
            <View style={styles.reward}>
              <RewardCoin size={22} />
              <Text style={styles.rewardText}>+{earnedCoins}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onHome} style={({ pressed }) => [styles.iconBtn, pressed && { transform: [{ scale: 0.95 }] }]}>
              <HomeIcon size={22} />
            </Pressable>
            <Pressable onPress={onNext} style={({ pressed }) => [styles.primaryBtn, pressed && { transform: [{ translateY: 2 }] }]}>
              <Text style={styles.primaryBtnText}>{nextLabel}</Text>
            </Pressable>
            <Pressable onPress={onNext} style={({ pressed }) => [styles.iconBtn, pressed && { transform: [{ scale: 0.95 }] }]}>
              <RefreshIcon size={22} />
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
    backgroundColor: 'rgba(30,15,110,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  bunting: { position: 'absolute', top: 40, alignItems: 'center' },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 10,
    maxWidth: 360,
    width: '100%',
    ...shadow.card
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#5b21b6',
    textAlign: 'center',
    lineHeight: 34
  },
  starsRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  earnedChip: {
    backgroundColor: '#ffe58a',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginTop: 4
  },
  earnedChipText: { fontSize: 13, fontWeight: '900', color: '#1e1b4b' },
  rewardsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f0ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill
  },
  rewardText: { fontSize: 15, fontWeight: '900', color: '#1e1b4b' },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#f5f0ff',
    alignItems: 'center', justifyContent: 'center',
    ...shadow.soft
  },
  primaryBtn: {
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: '#3ecf5c',
    ...shadow.card
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900' }
});
