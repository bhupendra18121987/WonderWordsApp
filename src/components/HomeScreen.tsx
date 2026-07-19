import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import type { AgeGroupKey, Language, Progress } from '../core/types';
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
  purple: { bg: '#a26bff', dark: '#5b21b6' }
};

export default function HomeScreen({
  language,
  progress,
  onPlay,
  onReview,
  onAlphabet,
  onMiniGames,
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
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 20, paddingBottom: 130 + insets.bottom }]}
    >
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>Hello, Little Explorer!</Text>
          <Text style={styles.heroSub}>Let's start your word adventure!</Text>
        </View>
        <PandaMascot size={80} />
      </View>

      <View style={[styles.mapCard, { width: mapWidth, height: mapHeight }]}>
        <View style={StyleSheet.absoluteFill}>
          <LevelMapScene width={mapWidth} height={mapHeight} />
        </View>
        <View style={StyleSheet.absoluteFill}>
          {LEVEL_POSITIONS.map((pos, idx) => {
            const level = idx + 1;
            const unlocked = progress.level >= level;
            const earned = Math.max(0, Math.min(3, progress.stars - (level - 1) * 3));
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
                <Text style={styles.tileText}>Level {level}</Text>
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
        <Pressable style={[styles.shortcut, { backgroundColor: '#ffd23c' }]} onPress={onMiniGames}>
          <Text style={styles.shortcutIcon}>🎮</Text>
          <Text style={styles.shortcutText}>{strings.miniGamesTile}</Text>
        </Pressable>
        <Pressable style={[styles.shortcut, { backgroundColor: '#8ed2ff' }]} onPress={onReview}>
          <Text style={styles.shortcutIcon}>📚</Text>
          <Text style={styles.shortcutText}>{strings.learned(learnedCount)}</Text>
        </Pressable>
        <Pressable style={[styles.shortcut, { backgroundColor: '#ffb0d1' }]} onPress={onAlphabet}>
          <Text style={styles.shortcutIcon}>🔤</Text>
          <Text style={styles.shortcutText}>{strings.navLetters}</Text>
        </Pressable>
      </View>

      {progress.level > 1 ? (
        <Pressable style={styles.restartBtn} onPress={onRestartLevel}>
          <Text style={styles.restartText}>{strings.restartLevel}</Text>
        </Pressable>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    marginTop: 44
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 30,
    textShadowColor: 'rgba(30,15,110,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0
  },
  heroSub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)'
  },
  mapCard: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#d8c7ff',
    backgroundColor: '#b8f0ff',
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
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 3,
    ...shadow.soft
  },
  shortcutIcon: { fontSize: 22 },
  shortcutText: { fontSize: 12, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  restartBtn: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  restartText: { fontSize: 13, fontWeight: '800', color: colors.ink }
});
