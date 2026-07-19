import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getRewardsData, getWordsData } from '../core/data';
import { t } from '../core/i18n';
import type { AgeGroupKey, Language, Progress } from '../core/types';

interface HomeScreenProps {
  ageGroup: AgeGroupKey;
  language: Language;
  progress: Progress;
  onPlay: () => void;
  onReview: () => void;
  onAlphabet: () => void;
  onTicTacToe: () => void;
  onOnboarding: () => void;
  onChangeAge: () => void;
  onRestartLevel: () => void;
}

interface TileConfig {
  key: string;
  tint: readonly [string, string];
  icon: string;
}

const TILES: Record<string, TileConfig> = {
  play:      { key: 'play',      tint: ['#ffe4ec', '#ffc2d1'] as const, icon: '🧩' },
  review:    { key: 'review',    tint: ['#d5f3f1', '#a0e7e5'] as const, icon: '📖' },
  alphabet:  { key: 'alphabet',  tint: ['#ece1ff', '#d1b8ff'] as const, icon: '🔤' },
  ticTacToe: { key: 'ticTacToe', tint: ['#fff2c8', '#ffe38b'] as const, icon: '⭕' },
  tour:      { key: 'tour',      tint: ['#fff2c8', '#ffe38b'] as const, icon: '👋' },
  age:       { key: 'age',       tint: ['#d5f0d8', '#a8ecc1'] as const, icon: '🎂' }
};

export default function HomeScreen({
  ageGroup,
  language,
  progress,
  onPlay,
  onReview,
  onAlphabet,
  onTicTacToe,
  onOnboarding,
  onChangeAge,
  onRestartLevel
}: HomeScreenProps) {
  const wordsData = getWordsData(language);
  const rewardsData = getRewardsData(language);
  const strings = t(language);
  const group = wordsData.ageGroups[ageGroup];
  const learnedCount = progress.learnedWords.length;
  const earnedBadges = new Set(progress.badges);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero card */}
      <LinearGradient
        colors={['#ffd166', '#ff8fab']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>{strings.welcomeBack}!</Text>
          <Text style={styles.heroLead} numberOfLines={2}>
            {strings.readyMsg}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statText}>{strings.starsFmt(progress.stars)}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>{strings.puzzlesFmt(progress.puzzlesCompleted)}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>{strings.wordsFmt(learnedCount)}</Text>
            </View>
          </View>
          <Pressable style={styles.heroCta} onPress={onPlay}>
            <Text style={styles.heroCtaText}>{strings.playNow}</Text>
          </Pressable>
        </View>
        <Text style={styles.heroMascot}>{group?.emoji ?? '🦉'}</Text>
      </LinearGradient>

      {/* Tiles */}
      <View style={styles.tilesGrid}>
        <Tile config={TILES.play!}      name={strings.playPuzzle}    sub={`${strings.level} ${progress.level}`} onPress={onPlay} />
        <Tile
          config={TILES.review!}
          name={strings.wordReview}
          sub={strings.learned(learnedCount)}
          onPress={onReview}
          disabled={learnedCount === 0}
        />
        <Tile config={TILES.alphabet!}  name={strings.alphabetTile}  sub="A · अ" onPress={onAlphabet} />
        <Tile config={TILES.ticTacToe!} name={strings.ticTacToeName} sub={strings.ticTacToeSub} onPress={onTicTacToe} />
        <Tile config={TILES.tour!}      name={strings.howToPlay}     sub={strings.quickTour} onPress={onOnboarding} />
        <Tile config={TILES.age!}       name={strings.changeAge}     sub={group?.label ?? ''} onPress={onChangeAge} />
      </View>

      {/* Restart from Level 1 button (only when past level 1) */}
      {progress.level > 1 && (
        <Pressable style={styles.restart} onPress={onRestartLevel}>
          <Text style={styles.restartText}>{strings.restartLevel}</Text>
        </Pressable>
      )}

      {/* Badges */}
      <View style={styles.badgesCard}>
        <Text style={styles.badgesTitle}>Badges</Text>
        <View style={styles.badgesRow}>
          {rewardsData.badges.map((b) => {
            const earned = earnedBadges.has(b.id);
            return (
              <View
                key={b.id}
                style={[styles.badge, earned && styles.badgeEarned]}
              >
                <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                <Text
                  style={[
                    styles.badgeLabel,
                    earned && styles.badgeLabelEarned
                  ]}
                  numberOfLines={1}
                >
                  {b.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

interface TileProps {
  config: TileConfig;
  name: string;
  sub: string;
  onPress: () => void;
  disabled?: boolean;
}

function Tile({ config, name, sub, onPress, disabled = false }: TileProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{ flex: 1, flexBasis: '46%', minWidth: 140 }}
    >
      <LinearGradient
        colors={config.tint}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.tile, disabled && styles.tileDisabled]}
      >
        <Text style={styles.tileIcon}>{config.icon}</Text>
        <Text style={styles.tileName} numberOfLines={2}>{name}</Text>
        <Text style={styles.tileSub} numberOfLines={1}>{sub}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 120,
    backgroundColor: '#fff7d6',
    gap: 18
  },
  hero: {
    borderRadius: 28,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#ff8fab',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6
  },
  heroCopy: { flex: 1, gap: 6 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  heroLead: { fontSize: 13, color: '#fff', opacity: 0.95, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  statPill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  statText: { fontSize: 12, fontWeight: '800', color: '#2b2b3d' },
  heroCta: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: 'flex-start'
  },
  heroCtaText: { color: '#e26a89', fontWeight: '800', fontSize: 15 },
  heroMascot: { fontSize: 68, lineHeight: 76 },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  tile: {
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    gap: 6,
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3
  },
  tileDisabled: { opacity: 0.5 },
  tileIcon: { fontSize: 40, lineHeight: 44 },
  tileName: { fontSize: 14, fontWeight: '800', color: '#2b2b3d', textAlign: 'center' },
  tileSub: { fontSize: 12, color: '#55556d', fontWeight: '700', textAlign: 'center' },
  restart: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#e0e0e8'
  },
  restartText: { color: '#2b2b3d', fontWeight: '800', fontSize: 14 },
  badgesCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    gap: 8
  },
  badgesTitle: { fontSize: 15, fontWeight: '800', color: '#e26a89' },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff8ee',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  badgeEarned: {
    backgroundColor: '#ffcf5c',
    borderColor: '#f0b429'
  },
  badgeEmoji: { fontSize: 16 },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#55556d'
  },
  badgeLabelEarned: { color: '#2b2b3d' }
});
