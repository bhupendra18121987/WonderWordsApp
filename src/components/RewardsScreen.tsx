import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRewardsData } from '../core/data';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import type { Language, Progress } from '../core/types';
import RibbonBanner from './RibbonBanner';

interface RewardsScreenProps {
  language: Language;
  progress: Progress;
  onBack: () => void;
}

type Tab = 'badges' | 'stars' | 'stickers';

/**
 * "My Rewards" screen inspired by the reference.
 *   - Ribbon banner at the top
 *   - 3-tab switcher (Badges / Stars / Stickers)
 *   - Grid of tiles for each collection, with locked-state for
 *     unearned items
 */
export default function RewardsScreen({ language, progress, onBack }: RewardsScreenProps) {
  const strings = t(language);
  const rewards = getRewardsData(language);
  const [tab, setTab] = useState<Tab>('badges');
  const earned = new Set(progress.badges);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'badges',   label: 'Badges',   emoji: '🏅' },
    { id: 'stars',    label: 'Stars',    emoji: '⭐' },
    { id: 'stickers', label: 'Stickers', emoji: '🎨' }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RibbonBanner title="My Rewards" topGarnish="🎁" />

      {/* Tab switcher */}
      <View style={styles.tabs}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && !active && { opacity: 0.75 }
              ]}
              onPress={() => setTab(t.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.emoji}  {t.label}
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
              <View
                key={b.id}
                style={[styles.tile, !gotIt && styles.tileLocked]}
              >
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

      <Pressable
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.85 }]}
        onPress={onBack}
      >
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 80,
    paddingBottom: 130,
    backgroundColor: colors.bg,
    alignItems: 'center',
    gap: 14
  },
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
  tabActive: {
    backgroundColor: colors.primarySoft
  },
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
  tileLocked: { backgroundColor: colors.bgSoft, opacity: 0.7 },
  tileIcon: { fontSize: 32 },
  tileIconLocked: { fontSize: 24 },
  tileLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center'
  },
  tileLabelLocked: { color: colors.inkMuted },

  centered: {
    marginTop: 30,
    alignItems: 'center',
    gap: 8
  },
  bigStat: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.primary
  },
  bigStatLabel: { fontSize: 16, fontWeight: '800', color: colors.ink },
  emptyEmoji: { fontSize: 64 },
  hint: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
    textAlign: 'center',
    maxWidth: 260
  },
  back: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.border
  },
  backText: { fontWeight: '800', color: colors.ink }
});
