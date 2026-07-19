import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRewardsData } from '../core/data';
import { colors, radii, shadow } from '../core/theme';
import type { Language, Progress } from '../core/types';
import BackButton from './BackButton';

interface RewardsScreenProps {
  language: Language;
  progress: Progress;
  onBack: () => void;
}

type Tab = 'badges' | 'stars' | 'stickers';

export default function RewardsScreen({ language, progress, onBack }: RewardsScreenProps) {
  const insets = useSafeAreaInsets();
  const rewards = getRewardsData(language);
  const [tab, setTab] = useState<Tab>('badges');
  const earned = new Set(progress.badges);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'badges',   label: 'Badges',   emoji: '🏅' },
    { id: 'stars',    label: 'Stars',    emoji: '⭐' },
    { id: 'stickers', label: 'Stickers', emoji: '🎨' }
  ];

  return (
    <LinearGradient
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: 130 + insets.bottom }]}
    >
      <View style={styles.topbar}>
        <BackButton onPress={onBack} variant="light" />
        <Text style={styles.topTitle}>My Rewards 🎁</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.tabs}>
          {tabs.map((tt) => {
            const active = tab === tt.id;
            return (
              <Pressable
                key={tt.id}
                style={({ pressed }) => [
                  styles.tab,
                  active && styles.tabActive,
                  pressed && !active && { opacity: 0.75 }
                ]}
                onPress={() => setTab(tt.id)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tt.emoji}  {tt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'badges' && (
          <View style={styles.grid}>
            {rewards.badges.map((b) => {
              const gotIt = earned.has(b.id);
              return (
                <View key={b.id} style={[styles.tile, !gotIt && styles.tileLocked]}>
                  <Text style={[styles.tileIcon, !gotIt && styles.tileIconLocked]}>
                    {gotIt ? b.emoji : '🔒'}
                  </Text>
                  <Text style={[styles.tileLabel, !gotIt && styles.tileLabelLocked]} numberOfLines={2}>
                    {b.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {tab === 'stars' && (
          <View style={styles.centered}>
            <Text style={styles.bigStat}>⭐  {progress.stars}</Text>
            <Text style={styles.bigStatLabel}>Total Stars</Text>
            <Text style={styles.hint}>Play puzzles and mini-games to collect more!</Text>
          </View>
        )}

        {tab === 'stickers' && (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🎨</Text>
            <Text style={styles.hint}>Sticker collection coming soon.</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  topTitle: {
    color: '#fff', fontSize: 20, fontWeight: '900',
    textShadowColor: 'rgba(30,15,110,0.35)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0
  },
  container: { paddingBottom: 20, alignItems: 'center', gap: 14 },
  tabs: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.paper,
    padding: 4,
    borderRadius: radii.pill,
    ...shadow.soft,
    width: '100%',
    maxWidth: 460
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabActive: { backgroundColor: colors.primarySoft },
  tabText: { fontSize: 13, fontWeight: '800', color: colors.inkSoft },
  tabTextActive: { color: colors.primary },
  grid: {
    width: '100%',
    maxWidth: 460,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center'
  },
  tile: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: radii.md,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
    ...shadow.soft
  },
  tileLocked: { backgroundColor: colors.bgSoft, opacity: 0.75 },
  tileIcon: { fontSize: 32 },
  tileIconLocked: { fontSize: 24 },
  tileLabel: { fontSize: 11, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  tileLabelLocked: { color: colors.inkMuted },
  centered: { marginTop: 30, alignItems: 'center', gap: 8 },
  bigStat: { fontSize: 56, fontWeight: '900', color: '#fff' },
  bigStatLabel: { fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  emptyEmoji: { fontSize: 64 },
  hint: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    maxWidth: 260
  }
});
