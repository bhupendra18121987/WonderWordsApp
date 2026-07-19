import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getWordsData } from '../core/data';
import { colors, radii, shadow } from '../core/theme';
import type { AgeGroupKey, Language } from '../core/types';
import BackButton from './BackButton';
import {
  BearAvatar,
  BunnyAvatar,
  HillsScene,
  LionAvatar,
  StarMascot
} from './AgeAssets';

interface AgeSelectProps {
  selected: AgeGroupKey | null;
  language: Language;
  step?: { current: number; total: number };
  onSelect: (key: AgeGroupKey) => void;
  onStart: () => void;
  /** Optional back handler; shown as a small button when set (post-setup). */
  onBack?: () => void;
}

const AVATARS: ReactNode[] = [
  <BearAvatar size={72} />,
  <BunnyAvatar size={72} />,
  <LionAvatar size={72} />
];
const TINTS = [
  { bg: '#b8f597', dark: '#5fac3f' },
  { bg: '#ffe58a', dark: '#de961e' },
  { bg: '#8ed2ff', dark: '#2e84ca' }
];

export default function AgeSelect({
  selected,
  language,
  onSelect,
  onStart,
  onBack
}: AgeSelectProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wordsData = getWordsData(language);
  const groups = Object.entries(wordsData.ageGroups) as [
    AgeGroupKey,
    typeof wordsData.ageGroups[AgeGroupKey]
  ][];
  const isHi = language === 'hi';
  const [pendingStart, setPendingStart] = useState<AgeGroupKey | null>(null);

  const handlePick = (key: AgeGroupKey) => {
    setPendingStart(key);
    onSelect(key);
  };

  useEffect(() => {
    if (pendingStart && selected === pendingStart) {
      setPendingStart(null);
      onStart();
    }
  }, [pendingStart, selected, onStart]);

  return (
    <LinearGradient
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12 }]}
    >
      {onBack ? (
        <View style={styles.backWrap}>
          <BackButton onPress={onBack} variant="light" />
        </View>
      ) : null}

      <View style={styles.starWrap}>
        <StarMascot size={64} />
      </View>

      <View style={styles.ribbon}>
        <Text style={styles.ribbonText}>
          {isHi ? 'चलो शुरू करें!' : "Let's Get Started!"}
        </Text>
      </View>

      <Text style={styles.prompt}>
        {isHi ? 'अपनी उम्र चुनो' : 'Choose your age group'}
      </Text>

      <View style={styles.stack}>
        {groups.map(([key, g], idx) => {
          const tint = TINTS[idx % TINTS.length];
          const active = selected === key;
          return (
            <Pressable
              key={key}
              onPress={() => handlePick(key)}
              style={({ pressed }) => [
                styles.pill,
                { backgroundColor: tint.bg, borderColor: active ? colors.primaryDark : tint.dark },
                pressed && styles.pillPressed
              ]}
            >
              <View style={styles.avatar}>{AVATARS[idx % AVATARS.length]}</View>
              <View style={styles.meta}>
                <Text style={styles.ageLabel}>{g.label}</Text>
                <Text style={styles.ageYears}>{isHi ? 'साल' : 'Years'}</Text>
              </View>
              <Text style={[styles.chev, { color: tint.dark }]}>›</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotOff]} />
        <View style={[styles.dot, styles.dotOn]} />
        <View style={[styles.dot, styles.dotOff]} />
      </View>

      <View style={styles.hills} pointerEvents="none">
        <HillsScene width={width} height={160} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    // Leave room for the fixed BottomNav + hills decoration.
    paddingBottom: 140,
    alignItems: 'center'
  },
  backWrap: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 5
  },
  starWrap: { marginTop: 6, marginBottom: 4 },
  ribbon: {
    width: '92%',
    backgroundColor: '#7a3ee8',
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
    shadowColor: '#4a1eae',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6
  },
  ribbonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: 'rgba(30,15,110,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0
  },
  prompt: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 14,
    textShadowColor: 'rgba(30,15,110,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0
  },
  stack: { width: '92%', gap: 14 },
  pill: {
    minHeight: 90,
    borderRadius: 24,
    borderWidth: 2,
    paddingLeft: 74,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    ...shadow.soft
  },
  pillPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  avatar: {
    position: 'absolute',
    left: -14,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3
  },
  meta: { flex: 1 },
  ageLabel: { fontSize: 19, fontWeight: '900', color: '#1e1b4b' },
  ageYears: { marginTop: -2, fontSize: 15, fontWeight: '800', color: '#1e1b4b' },
  chev: { fontSize: 34, fontWeight: '900', lineHeight: 38 },
  dots: {
    marginTop: 'auto',
    marginBottom: 20,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOn: { backgroundColor: '#fff', width: 10, height: 10, borderRadius: 5 },
  dotOff: { backgroundColor: 'rgba(255,255,255,0.6)' },
  hills: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Sit above the fixed BottomNav (~76px tall + 10px bottom + safe area).
    bottom: 90,
    zIndex: 1
  }
});
