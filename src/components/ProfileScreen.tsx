import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { getWordsData } from '../core/data';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import type { AgeGroupKey, Language, Progress } from '../core/types';
import RibbonBanner from './RibbonBanner';

interface ProfileScreenProps {
  ageGroup: AgeGroupKey | null;
  language: Language;
  progress: Progress;
  onBack: () => void;
  onChangeAge: () => void;
}

/**
 * "My Profile" screen inspired by the reference.
 *   - Ribbon banner
 *   - Big circular avatar (emoji for the current age group)
 *   - Name + age group
 *   - 4 stats cards (levels / stars / points / words)
 */
export default function ProfileScreen({
  ageGroup,
  language,
  progress,
  onBack,
  onChangeAge
}: ProfileScreenProps) {
  const strings = t(language);
  const wordsData = getWordsData(language);
  const group = ageGroup ? wordsData.ageGroups[ageGroup] : null;
  const points = progress.stars * 10 + progress.puzzlesCompleted * 20;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RibbonBanner title="My Profile" topGarnish="👑" />

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{group?.emoji ?? '🐼'}</Text>
        </View>
      </View>

      <Text style={styles.name}>Little Explorer</Text>
      <Pressable
        style={({ pressed }) => [styles.ageChip, pressed && { opacity: 0.85 }]}
        onPress={onChangeAge}
        accessibilityRole="button"
      >
        <Text style={styles.ageChipText}>
          Age Group · {group?.label ?? '—'}   ✎
        </Text>
      </Pressable>

      <View style={styles.statsGrid}>
        <StatCard icon="🎯" label="Levels" value={String(progress.level)} tint={colors.tilePurple} />
        <StatCard icon="⭐" label="Total Stars" value={String(progress.stars)} tint={colors.tileYellow} />
        <StatCard icon="💎" label="Points" value={String(points)} tint={colors.tileBlue} />
        <StatCard icon="📚" label="Words Found" value={String(progress.learnedWords.length)} tint={colors.tileGreen} />
      </View>

      <Pressable
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.85 }]}
        onPress={onBack}
      >
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>
    </ScrollView>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  tint: string;
}

function StatCard({ icon, label, value, tint }: StatCardProps) {
  return (
    <View style={[styles.stat, { backgroundColor: tint }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 80,
    paddingBottom: 130,
    backgroundColor: colors.bg,
    alignItems: 'center',
    gap: 12
  },
  avatarWrap: {
    marginTop: 8,
    borderRadius: 999,
    padding: 4,
    backgroundColor: colors.primarySoft,
    borderWidth: 4,
    borderColor: colors.primary
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft
  },
  avatarEmoji: { fontSize: 72 },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 4
  },
  ageChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.paper,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border
  },
  ageChipText: { fontSize: 13, fontWeight: '700', color: colors.inkSoft },

  statsGrid: {
    marginTop: 12,
    width: '100%',
    maxWidth: 460,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center'
  },
  stat: {
    width: '46%',
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 2,
    ...shadow.soft
  },
  statIcon: { fontSize: 26 },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.ink },
  statLabel: { fontSize: 12, fontWeight: '700', color: colors.inkSoft },

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
