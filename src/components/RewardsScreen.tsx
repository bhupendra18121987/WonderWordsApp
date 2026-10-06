import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRewardsData } from '../core/data';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import type { Language, Progress } from '../core/types';
import { STICKERS } from '../core/data/stickers';
import BackButton from './BackButton';

interface RewardsScreenProps {
  language: Language;
  progress: Progress;
  onBack: () => void;
}

type Tab = 'badges' | 'stars' | 'stickers';

export default function RewardsScreen({ language, progress, onBack }: RewardsScreenProps) {
  const strings = t(language);
  const insets = useSafeAreaInsets();
  const rewards = getRewardsData(language);
  const [tab, setTab] = useState<Tab>('badges');
  const earned = new Set(progress.badges);
  const learnedCount = progress.learnedWords.length;

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'badges',   label: strings.badgesTitle.replace(/^🏅\s*/, ''), emoji: '🏅' },
    { id: 'stars',    label: strings.totalStars, emoji: '⭐' },
    { id: 'stickers', label: strings.stickers, emoji: '🎨' }
  ];

  return (
    <LinearGradient
      colors={['#147d78', '#0c615d']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: 130 + insets.bottom }]}
    >
      <View style={styles.topbar}>
        <BackButton onPress={onBack} variant="light" label={strings.back} />
        <Text style={styles.topTitle}>{strings.rewardsTitle}</Text>
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
            <Text style={styles.bigStatLabel}>{strings.totalStars}</Text>
            <Text style={styles.hint}>{strings.playForRewards}</Text>
          </View>
        )}

        {tab === 'stickers' && (
          <View style={styles.stickerSection}>
            {/* Progress headline */}
            <View style={styles.stickerProgress}>
              <Text style={styles.stickerProgressText}>
                🎨 {STICKERS.filter((s) => learnedCount >= s.unlockAt).length} / {STICKERS.length}
              </Text>
              <Text style={styles.stickerHint}>
                {language === 'hi'
                  ? `${learnedCount} शब्द सीखे`
                  : `${learnedCount} words learned`}
              </Text>
            </View>

            <View style={styles.stickerGrid}>
              {STICKERS.map((s) => {
                const unlocked = learnedCount >= s.unlockAt;
                return (
                  <View key={s.id} style={[styles.stickerTile, !unlocked && styles.stickerLocked]}>
                    <Text style={[styles.stickerEmoji, !unlocked && { opacity: 0.25 }]}>
                      {unlocked ? s.emoji : '🔒'}
                    </Text>
                    <Text
                      style={[styles.stickerName, !unlocked && styles.stickerNameLocked]}
                      numberOfLines={1}
                    >
                      {language === 'hi' ? s.nameHi : s.nameEn}
                    </Text>
                    {!unlocked && (
                      <Text style={styles.stickerUnlockHint}>
                        {language === 'hi'
                          ? `${s.unlockAt} शब्द`
                          : `${s.unlockAt} words`}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
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
  hint: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    maxWidth: 260
  },

  // Sticker tab
  stickerSection: { width: '100%', maxWidth: 460, gap: 12 },
  stickerProgress: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4
  },
  stickerProgressText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  stickerHint: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center'
  },
  stickerTile: {
    width: '28%',
    backgroundColor: colors.paper,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#ffe38b',
    ...shadow.soft
  },
  stickerLocked: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  stickerEmoji: { fontSize: 30 },
  stickerName: { fontSize: 10, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  stickerNameLocked: { color: 'rgba(255,255,255,0.5)' },
  stickerUnlockHint: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }
});
