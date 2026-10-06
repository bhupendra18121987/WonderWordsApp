import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Language } from '../core/types';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import ThemedScreen from './ThemedScreen';
import PandaIllustration from './PandaIllustration';
import { adventureInfo, type AdventureId } from '../core/adventures';

export type MiniGameId =
  | 'letterHunt'
  | 'tapColor'
  | 'missingLetter'
  | 'antonymPairs'
  | 'karaoke'
  | 'twoPlayer'
  | 'trace'
  | 'tictactoe'
  | AdventureId;

interface MiniGamesHubProps {
  language: Language;
  onBack: () => void;
  onPick: (id: MiniGameId) => void;
  enabled: Record<MiniGameId, boolean>;
  lastPlayed?: MiniGameId | null;
}

type Tint = 'coral' | 'teal' | 'mint' | 'lavender' | 'yellow';

interface TileDef {
  id: MiniGameId;
  emoji: string;
  tint: Tint;
  nameKey?:
    | 'letterHuntName' | 'tapColorName' | 'missingLetterName' | 'antonymName'
    | 'karaokeName' | 'twoPlayerName' | 'traceName' | 'ticTacToeName';
  adventureId?: AdventureId;
}

const TILES: TileDef[] = [
  { id: 'letterHunt',    emoji: '🔤', tint: 'coral',    nameKey: 'letterHuntName' },
  { id: 'tapColor',      emoji: '🎨', tint: 'teal',     nameKey: 'tapColorName' },
  { id: 'missingLetter', emoji: '✏️', tint: 'mint',     nameKey: 'missingLetterName' },
  { id: 'antonymPairs',  emoji: '🔁', tint: 'lavender', nameKey: 'antonymName' },
  { id: 'karaoke',       emoji: '🎤', tint: 'yellow',   nameKey: 'karaokeName' },
  { id: 'twoPlayer',     emoji: '🤝', tint: 'yellow',   nameKey: 'twoPlayerName' },
  { id: 'trace',         emoji: '✍️', tint: 'mint',     nameKey: 'traceName' },
  { id: 'tictactoe',     emoji: '⭕', tint: 'coral',    nameKey: 'ticTacToeName' },
  { id: 'counting',      emoji: '🍎', tint: 'coral',    adventureId: 'counting' },
  { id: 'numbers',       emoji: '🔢', tint: 'teal',     adventureId: 'numbers' },
  { id: 'patterns',      emoji: '🧩', tint: 'lavender', adventureId: 'patterns' },
  { id: 'memory',        emoji: '🧠', tint: 'yellow',   adventureId: 'memory' },
  { id: 'animals',       emoji: '🐾', tint: 'mint',     adventureId: 'animals' },
  { id: 'story',         emoji: '📖', tint: 'coral',    adventureId: 'story' },
  { id: 'drawing',       emoji: '🎨', tint: 'teal',     adventureId: 'drawing' }
];

const TINTS: Record<Tint, { bg: [string, string]; border: string }> = {
  coral:    { bg: ['#ffe4ec', '#ffc2d1'], border: 'rgba(217, 90, 131, 0.35)' },
  teal:     { bg: ['#d5f3f1', '#a0e7e5'], border: 'rgba(47, 122, 118, 0.35)' },
  mint:     { bg: ['#d5f0d8', '#a8ecc1'], border: 'rgba(61, 122, 83, 0.35)' },
  lavender: { bg: ['#ece1ff', '#d1b8ff'], border: 'rgba(92, 66, 144, 0.35)' },
  yellow:   { bg: ['#fff2c8', '#ffe38b'], border: 'rgba(197, 148, 20, 0.35)' }
};

export default function MiniGamesHub({ language, onBack, onPick, enabled, lastPlayed }: MiniGamesHubProps) {
  const strings = t(language);

  return (
    <ThemedScreen
      title={strings.worldTitle}
      language={language}
      titleIcon={<PandaIllustration size={28} />}
      onBack={onBack}
    >
      <View style={styles.grid}>
        {TILES.map((tile) => {
          const isOn = enabled[tile.id];
          const isLast = lastPlayed === tile.id;
          const tint = TINTS[tile.tint];
          const info = tile.adventureId ? adventureInfo(tile.adventureId, language) : null;
          const name = info?.name ?? strings[tile.nameKey!];
          return (
            <Pressable
              key={tile.id}
              onPress={() => isOn && onPick(tile.id)}
              disabled={!isOn}
              style={({ pressed }) => [
                styles.card,
                { borderColor: tint.border },
                !isOn && styles.cardOff,
                isLast && styles.cardLast,
                pressed && isOn && { transform: [{ translateY: -2 }] }
              ]}
              accessibilityRole="button"
              accessibilityLabel={name}
            >
              <LinearGradient
                colors={tint.bg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.dot, isOn ? styles.dotOn : styles.dotOff]} />
              {isLast ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{strings.lastPlayed}</Text>
                </View>
              ) : null}
              {!isOn ? (
                <View style={[styles.badge, styles.badgeMuted]}>
                  <Text style={styles.badgeText}>{strings.comingSoon}</Text>
                </View>
              ) : null}
              <Text style={styles.emoji}>{tile.emoji}</Text>
              <Text style={styles.name} numberOfLines={2}>
                {name}
              </Text>
              {info && <Text style={styles.subtitle} numberOfLines={2}>{info.subtitle}</Text>}
            </Pressable>
          );
        })}
      </View>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    minHeight: 108,
    borderRadius: 16,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    ...shadow.soft
  },
  cardOff: { opacity: 0.56 },
  cardLast: {
    borderColor: colors.accentDark,
    shadowColor: colors.accentDark,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  emoji: { fontSize: 30, lineHeight: 34 },
  name: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 19,
    textAlign: 'center'
  },
  subtitle: { fontSize: 10.5, fontWeight: '700', color: '#655c7d', textAlign: 'center' },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2
  },
  dotOn: { backgroundColor: colors.success },
  dotOff: { backgroundColor: '#d6d6df' },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.accentDark,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radii.pill,
    zIndex: 2
  },
  badgeMuted: { backgroundColor: '#8b7ea8' },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.4
  }
});
