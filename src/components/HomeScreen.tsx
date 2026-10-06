import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import type { AgeGroupKey, Language, Progress } from '../core/types';
import { adventureInfo, type AdventureId } from '../core/adventures';
import {
  LevelMapScene,
  LevelStar,
  LockIcon,
  PandaMascot,
  UnlockedIcon
} from './HomeMapAssets';

interface HomeScreenProps {
  ageGroup: AgeGroupKey;
  language: Language;
  progress: Progress;
  onPlay: (level?: number) => void;
  onReview: () => void;
  onAlphabet: () => void;
  onMiniGames: () => void;
  onAdventure: (id: AdventureId) => void;
  onRestartLevel: () => void;
}

type LevelPos = { top: string; left: string; color: 'orange' | 'green' | 'blue' | 'purple' };
const LEVEL_POSITIONS: readonly LevelPos[] = [
  { top: '86%', left: '78%', color: 'orange' },
  { top: '66%', left: '18%', color: 'green' },
  { top: '46%', left: '68%', color: 'blue' },
  { top: '20%', left: '30%', color: 'purple' }
];

const TILE_COLORS: Record<LevelPos['color'], { bg: string; dark: string }> = {
  orange: { bg: '#ff9a3c', dark: '#c25f0a' },
  green: { bg: '#3ecf5c', dark: '#2b8a3e' },
  blue: { bg: '#4aaaf1', dark: '#1f6ebd' },
  purple: { bg: '#a26bff', dark: '#0c615d' }
};

export default function HomeScreen({
  language,
  progress,
  onPlay,
  onReview,
  onAlphabet,
  onMiniGames,
  onAdventure,
  onRestartLevel
}: HomeScreenProps) {
  const strings = t(language);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const learnedCount = progress.learnedWords.length;
  const mapWidth = width - 32;
  const mapHeight = Math.min(460, mapWidth * 1.05);

  return (
    <LinearGradient
      colors={['#dff3e9', '#f8f5e9']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: 112 + insets.bottom }]}>
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>{strings.homeGreeting}</Text>
          <Text style={styles.heroSub}>{strings.homeSub}</Text>
        </View>
        <PandaMascot size={80} />
      </View>

      <View style={styles.quickSection}>
        <Text style={styles.quickHeading}>{strings.chooseAdventure}</Text>
        <View style={styles.quickGrid}>
          <Pressable style={[styles.quickCard, { backgroundColor: '#ffe49a' }]} onPress={onAlphabet} accessibilityRole="button">
            <Text style={styles.quickEmoji}>📖</Text><Text style={styles.quickTitle}>{strings.readingName}</Text><Text style={styles.quickSub}>{strings.navLetters}</Text>
          </Pressable>
          {(['counting', 'memory', 'drawing'] as const).map((id) => {
            const info = adventureInfo(id, language);
            const bg = id === 'counting' ? '#ffd4e2' : id === 'memory' ? '#cef0d5' : '#ccecff';
            return <Pressable key={id} style={[styles.quickCard, { backgroundColor: bg }]} onPress={() => onAdventure(id)} accessibilityRole="button" accessibilityLabel={info.name}>
              <Text style={styles.quickEmoji}>{info.emoji}</Text><Text style={styles.quickTitle} numberOfLines={1}>{info.name}</Text><Text style={styles.quickSub} numberOfLines={1}>{info.subtitle}</Text>
            </Pressable>;
          })}
        </View>
        <Pressable style={styles.exploreButton} onPress={onMiniGames} accessibilityRole="button">
          <Text style={styles.exploreText}>{strings.exploreActivities}  →</Text>
        </Pressable>
      </View>

      <View style={[styles.mapCard, { width: mapWidth, height: mapHeight }]}>
        <View style={StyleSheet.absoluteFill}>
          <LevelMapScene width={mapWidth} height={mapHeight} />
        </View>
        <View style={StyleSheet.absoluteFill}>
          {LEVEL_POSITIONS.map((pos, idx) => {
            const level = idx + 1;
            const unlocked = progress.level >= level;
            const earned = level < progress.level
              ? Math.max(1, Math.min(3, Math.floor((progress.stars - (progress.activityStars ?? 0)) / Math.max(1, progress.puzzlesCompleted))))
              : 0;
            const tint = TILE_COLORS[pos.color];
            const topPct = parseFloat(pos.top) / 100;
            const leftPct = parseFloat(pos.left) / 100;
            const tileW = 100;
            const tileH = 88;
            return (
              <Pressable
                key={level}
                onPress={unlocked ? () => onPlay(level) : undefined}
                disabled={!unlocked}
                style={({ pressed }) => [
                  styles.tile,
                  {
                    top: topPct * mapHeight - tileH / 2,
                    left: leftPct * mapWidth - tileW / 2,
                    width: tileW,
                    backgroundColor: tint.bg,
                    borderColor: tint.dark
                  },
                  !unlocked && { opacity: 0.75 },
                  pressed && { transform: [{ scale: 0.96 }] }
                ]}
              >
                <View style={styles.tileIcon}>
                  {unlocked ? <UnlockedIcon size={20} /> : <LockIcon size={20} />}
                </View>
                <Text style={styles.tileText}>{strings.level} {level}</Text>
                <View style={styles.tileStars}>
                  <LevelStar filled={earned >= 1} size={14} />
                  <LevelStar filled={earned >= 2} size={14} />
                  <LevelStar filled={earned >= 3} size={14} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.shortcutRow}>
        <Pressable style={[styles.shortcut, { backgroundColor: '#ffe38b' }]} onPress={onMiniGames}>
          <Text style={styles.shortcutIcon}>🎮</Text>
          <Text style={styles.shortcutText}>{strings.miniGamesTile}</Text>
        </Pressable>
        <Pressable style={[styles.shortcut, { backgroundColor: '#bfdbfe' }]} onPress={onReview}>
          <Text style={styles.shortcutIcon}>📚</Text>
          <Text style={styles.shortcutText}>{strings.learned(learnedCount)}</Text>
        </Pressable>
        <Pressable style={[styles.shortcut, { backgroundColor: '#ffc4dd' }]} onPress={onAlphabet}>
          <Text style={styles.shortcutIcon}>🔤</Text>
          <Text style={styles.shortcutText}>{strings.navLetters}</Text>
        </Pressable>
      </View>

      {progress.level > 1 ? (
        <Pressable style={styles.restartBtn} onPress={onRestartLevel}>
          <Text style={styles.restartText}>{strings.restartLevel}</Text>
        </Pressable>
      ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 14,
    alignItems: 'center'
  },
  hero: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 6,
    // Match the web `.home-hero { margin: 44px 0 auto }` — push the card
    // down so it clears the absolutely-positioned TopBar chrome.
    marginTop: 26
  },
  quickSection: { width: '100%', gap: 8 },
  quickHeading: { color: '#155e59', fontSize: 16, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickCard: { width: '48%', minHeight: 91, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', gap: 2, borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)', ...shadow.soft },
  quickEmoji: { fontSize: 27, lineHeight: 31 },
  quickTitle: { color: colors.ink, fontSize: 12, fontWeight: '900', textAlign: 'center', marginTop: 5 },
  quickSub: { color: '#615679', fontSize: 9, fontWeight: '700', textAlign: 'center' },
  exploreButton: { alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center', paddingHorizontal: 15, borderRadius: radii.pill, backgroundColor: '#fff', ...shadow.soft },
  exploreText: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#174e50',
    lineHeight: 30,
    textShadowColor: 'rgba(255,255,255,0.65)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0
  },
  heroSub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: '#426d68'
  },
  mapCard: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fffefa',
    backgroundColor: '#e4f4e6',
    ...shadow.card
  },
  tile: {
    position: 'absolute',
    height: 88,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 3,
    justifyContent: 'center',
    ...shadow.card
  },
  tileIcon: { marginBottom: 2 },
  tileText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0
  },
  tileStars: {
    marginTop: 3,
    flexDirection: 'row',
    gap: 2
  },
  shortcutRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8
  },
  shortcut: {
    flex: 1,
    minHeight: 76,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
    ...shadow.soft
  },
  shortcutIcon: { fontSize: 23 },
  shortcutText: { fontSize: 12, lineHeight: 18, fontWeight: '900', color: colors.ink, textAlign: 'center', marginTop: 5 },
  restartBtn: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  restartText: { fontSize: 13, fontWeight: '800', color: colors.ink }
});
