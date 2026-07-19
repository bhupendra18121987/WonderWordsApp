import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Language } from '../core/types';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import PandaIllustration from './PandaIllustration';

export type MiniGameId =
  | 'letterHunt'
  | 'tapColor'
  | 'missingLetter'
  | 'antonymPairs'
  | 'karaoke'
  | 'twoPlayer'
  | 'trace';

interface MiniGamesHubProps {
  language: Language;
  onBack: () => void;
  onPick: (id: MiniGameId) => void;
  enabled: Record<MiniGameId, boolean>;
  lastPlayed?: MiniGameId | null;
}

interface TileDef {
  id: MiniGameId;
  emoji: string;
  color: string;
  nameKey: 'letterHuntName' | 'tapColorName' | 'missingLetterName' | 'antonymName' | 'karaokeName' | 'twoPlayerName' | 'traceName';
  subKey: 'letterHuntSub' | 'tapColorSub' | 'missingLetterSub' | 'antonymSub' | 'karaokeSub' | 'twoPlayerSub' | 'traceSub';
}

const TILES: TileDef[] = [
  { id: 'letterHunt', emoji: '🔤', color: '#ffd6e0', nameKey: 'letterHuntName', subKey: 'letterHuntSub' },
  { id: 'tapColor', emoji: '🎨', color: '#d6ecff', nameKey: 'tapColorName', subKey: 'tapColorSub' },
  { id: 'missingLetter', emoji: '✏️', color: '#d6ffe0', nameKey: 'missingLetterName', subKey: 'missingLetterSub' },
  { id: 'antonymPairs', emoji: '🔁', color: '#f0d6ff', nameKey: 'antonymName', subKey: 'antonymSub' },
  { id: 'karaoke', emoji: '🎤', color: '#fef3c7', nameKey: 'karaokeName', subKey: 'karaokeSub' },
  { id: 'twoPlayer', emoji: '🤝', color: '#fed7aa', nameKey: 'twoPlayerName', subKey: 'twoPlayerSub' },
  { id: 'trace', emoji: '✍️', color: '#a7f3d0', nameKey: 'traceName', subKey: 'traceSub' }
];

export default function MiniGamesHub({ language, onBack, onPick, enabled, lastPlayed }: MiniGamesHubProps) {
  const strings = t(language);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{strings.miniGamesTitle}</Text>
          <Text style={styles.subtitle}>{strings.miniGamesSubtitle}</Text>
        </View>
        <PandaIllustration size={90} />
      </LinearGradient>

      <View style={styles.pathWrap}>
        <View style={styles.pathLine} />
        {TILES.map((tile, idx) => {
          const isOn = enabled[tile.id];
          const isLast = lastPlayed === tile.id;
          const rightSide = idx % 2 === 1;
          return (
            <View key={tile.id} style={[styles.nodeRow, rightSide && styles.nodeRowRight]}>
              <View style={[styles.dot, isOn ? styles.dotOn : styles.dotOff]} />
              <Pressable
                style={({ pressed }) => [
                  styles.tile,
                  { backgroundColor: tile.color },
                  rightSide ? styles.tileRight : styles.tileLeft,
                  !isOn && styles.tileOff,
                  isLast && styles.tileLast,
                  pressed && isOn && { transform: [{ scale: 0.97 }] }
                ]}
                onPress={() => isOn && onPick(tile.id)}
                disabled={!isOn}
              >
                <Text style={styles.tileEmoji}>{tile.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tileName}>{strings[tile.nameKey]}</Text>
                  <Text style={styles.tileSub}>{isOn ? strings[tile.subKey] : strings.comingSoon}</Text>
                </View>
                {isLast && <Text style={styles.badge}>LAST</Text>}
                {!isOn && <Text style={styles.badgeMuted}>{strings.comingSoon}</Text>}
              </Pressable>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingTop: 80, paddingBottom: 130 },
  hero: {
    borderRadius: radii.lg,
    padding: 16,
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.card
  },
  title: { fontSize: 28, fontWeight: '900', color: colors.accent },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: '700', color: colors.onPrimary },

  pathWrap: {
    marginTop: 16,
    position: 'relative',
    gap: 8,
    paddingVertical: 8
  },
  pathLine: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 18,
    width: 4,
    borderRadius: 999,
    backgroundColor: '#d7cdf9'
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 88
  },
  nodeRowRight: {
    justifyContent: 'flex-end'
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 11,
    zIndex: 2
  },
  dotOn: { backgroundColor: colors.success },
  dotOff: { backgroundColor: colors.border },

  tile: {
    flex: 1,
    maxWidth: '88%',
    minHeight: 82,
    borderRadius: radii.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: 'rgba(124,58,237,0.12)',
    ...shadow.soft
  },
  tileLeft: { marginRight: 8 },
  tileRight: { marginLeft: 8 },
  tileOff: { opacity: 0.56 },
  tileLast: {
    borderColor: colors.accentDark,
    shadowColor: colors.accentDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8
  },
  tileEmoji: { fontSize: 30 },
  tileName: { fontSize: 15, fontWeight: '900', color: colors.ink },
  tileSub: { fontSize: 12, fontWeight: '700', color: colors.inkSoft, marginTop: 1 },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '900',
    color: colors.onAccent,
    backgroundColor: colors.accentDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    overflow: 'hidden'
  },
  badgeMuted: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '900',
    color: '#ffffff',
    backgroundColor: '#8b7ea8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    overflow: 'hidden'
  },
  back: {
    marginTop: 18,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.border
  },
  backText: { fontWeight: '900', color: colors.ink }
});
