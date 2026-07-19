import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Grid from './Grid';
import { getAllWords, getWordsData } from '../core/data';
import { buildPuzzleForLevel } from '../core/puzzleGenerator';
import { splitGraphemes } from '../core/grapheme';
import { getLanguageConfig } from '../core/languages';
import { t } from '../core/i18n';
import type { AgeGroupKey, Cell, Language, Puzzle } from '../core/types';

interface TwoPlayerGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  /** Speaks a single letter (used as the child drags). */
  speakLetter: (letter: string) => void;
  /** Speaks arbitrary text (used for word announcement + turn changes). */
  speakText: (text: string) => void;
}

interface FoundEntry {
  word: string;
  cells: Cell[];
  /** Which player found it: 1 or 2. */
  player: 1 | 2;
}

const PLAYER_COLORS: Record<1 | 2, string> = {
  1: '#4b8bef',
  2: '#6d28d9'
};

export default function TwoPlayerGame({
  ageGroup,
  language,
  onExit,
  speakLetter,
  speakText
}: TwoPlayerGameProps) {
  const strings = t(language);
  const langCfg = getLanguageConfig(language);
  const wordsData = getWordsData(language);
  const group = wordsData.ageGroups[ageGroup];
  const bank = getAllWords(language);
  const { width } = useWindowDimensions();
  const gridWidth = Math.min(width - 24, 400);

  const [seed, setSeed] = useState(0);
  const puzzle: Puzzle = useMemo(() => {
    return buildPuzzleForLevel({
      bank,
      ageGroup,
      gridSize: group.gridSize,
      wordsPerPuzzle: group.wordsPerPuzzle,
      minLength: group.minLength,
      maxLength: group.maxLength,
      directions: group.directions,
      excludeWords: [],
      fillChars: langCfg.fillChars
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageGroup, seed, language]);

  const [found, setFound] = useState<FoundEntry[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  const foundWords = useMemo(() => found.map((f) => f.word), [found]);
  const allFoundCells = useMemo(() => found.flatMap((f) => f.cells), [found]);
  const p1Score = found.filter((f) => f.player === 1).length;
  const p2Score = found.filter((f) => f.player === 2).length;
  const totalWords = puzzle.placements.length;
  const gameOver = found.length >= totalWords && totalWords > 0;

  const winnerText = useMemo(() => {
    if (!gameOver) return null;
    if (p1Score > p2Score) return strings.winnerAnnounce(strings.player1);
    if (p2Score > p1Score) return strings.winnerAnnounce(strings.player2);
    return strings.winnerTie;
  }, [gameOver, p1Score, p2Score, strings]);

  const switchTurn = useCallback(() => {
    setCurrentPlayer((p) => (p === 1 ? 2 : 1));
  }, []);

  const handleSelectionAttempt = useCallback(
    ({ word, cells, isStraight }: { word: string; cells: Cell[]; isStraight: boolean }) => {
      if (!isStraight || !word || gameOver) return;
      const dragged = splitGraphemes(word);
      const target = puzzle.placements.find((p) => {
        if (foundWords.includes(p.word)) return false;
        const placed = splitGraphemes(p.word);
        if (placed.length !== dragged.length) return false;
        const forward = placed.every((g, i) => g === dragged[i]);
        if (forward) return true;
        return placed.every((g, i) => g === dragged[placed.length - 1 - i]);
      });

      if (target) {
        speakText(target.word);
        setFound((prev) => [
          ...prev,
          { word: target.word, cells: target.cells, player: currentPlayer }
        ]);
      }
      // Always switch turns after a completed attempt so both players
      // get equal time — regardless of correctness.
      switchTurn();
    },
    [gameOver, puzzle.placements, foundWords, currentPlayer, switchTurn, speakText]
  );

  const restart = () => {
    setSeed((s) => s + 1);
    setFound([]);
    setCurrentPlayer(1);
  };

  const currentName = currentPlayer === 1 ? strings.player1 : strings.player2;

  if (gameOver) {
    return (
      <View style={styles.root}>
        <View style={styles.doneCard}>
          <Text style={styles.doneEmoji}>🏆</Text>
          <Text style={styles.doneTitle}>{winnerText}</Text>
          <View style={styles.doneScores}>
            <View style={[styles.doneScoreBox, { borderColor: PLAYER_COLORS[1] }]}>
              <Text style={[styles.doneScoreLabel, { color: PLAYER_COLORS[1] }]}>{strings.player1}</Text>
              <Text style={styles.doneScoreValue}>⭐ {p1Score}</Text>
            </View>
            <View style={[styles.doneScoreBox, { borderColor: PLAYER_COLORS[2] }]}>
              <Text style={[styles.doneScoreLabel, { color: PLAYER_COLORS[2] }]}>{strings.player2}</Text>
              <Text style={styles.doneScoreValue}>⭐ {p2Score}</Text>
            </View>
          </View>
          <View style={styles.doneRow}>
            <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={restart}>
              <Text style={styles.primaryBtnText}>🔄 {strings.playAgain}</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.ghostBtn]} onPress={onExit}>
              <Text style={styles.ghostBtnText}>{strings.home}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.scoreRow}>
        <View
          style={[
            styles.scoreBox,
            { borderColor: PLAYER_COLORS[1] },
            currentPlayer === 1 && styles.scoreBoxActive
          ]}
        >
          <Text style={[styles.scoreLabel, { color: PLAYER_COLORS[1] }]}>{strings.player1}</Text>
          <Text style={styles.scoreValue}>⭐ {p1Score}</Text>
        </View>
        <View
          style={[
            styles.scoreBox,
            { borderColor: PLAYER_COLORS[2] },
            currentPlayer === 2 && styles.scoreBoxActive
          ]}
        >
          <Text style={[styles.scoreLabel, { color: PLAYER_COLORS[2] }]}>{strings.player2}</Text>
          <Text style={styles.scoreValue}>⭐ {p2Score}</Text>
        </View>
      </View>

      <Text style={[styles.turnText, { color: PLAYER_COLORS[currentPlayer] }]}>
        {strings.playerTurn(currentName)}
      </Text>

      <Grid
        grid={puzzle.grid}
        foundCells={allFoundCells}
        language={language}
        gridWidth={gridWidth}
        onLetterEnter={speakLetter}
        onSelectionAttempt={handleSelectionAttempt}
      />

      <View style={styles.wordsRow}>
        <Text style={styles.wordsHint}>
          {found.length} / {totalWords}
        </Text>
      </View>

      <Pressable style={styles.back} onPress={onExit}>
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f3f0ff', padding: 12, alignItems: 'center' },
  scoreRow: {
    width: '100%',
    maxWidth: 460,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  scoreBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 3,
    padding: 10,
    alignItems: 'center'
  },
  scoreBoxActive: { transform: [{ scale: 1.04 }], shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  scoreLabel: { fontSize: 13, fontWeight: '900' },
  scoreValue: { fontSize: 18, fontWeight: '900', color: '#1e1b4b', marginTop: 2 },
  turnText: { fontSize: 18, fontWeight: '900', marginVertical: 10 },
  wordsRow: { marginTop: 10, alignItems: 'center' },
  wordsHint: { fontSize: 14, fontWeight: '800', color: '#6b7280' },
  back: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5f0'
  },
  backText: { fontWeight: '800', color: '#1e1b4b' },

  doneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
    width: '100%',
    maxWidth: 460
  },
  doneEmoji: { fontSize: 56 },
  doneTitle: { fontSize: 22, fontWeight: '900', color: '#6d28d9', textAlign: 'center' },
  doneScores: { flexDirection: 'row', gap: 12, marginTop: 6 },
  doneScoreBox: {
    borderWidth: 3,
    borderRadius: 16,
    padding: 12,
    minWidth: 110,
    alignItems: 'center'
  },
  doneScoreLabel: { fontSize: 13, fontWeight: '900' },
  doneScoreValue: { fontSize: 20, fontWeight: '900', color: '#1e1b4b', marginTop: 2 },
  doneRow: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  actionBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  primaryBtn: { backgroundColor: '#7c3aed' },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  ghostBtn: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  ghostBtnText: { color: '#1e1b4b', fontWeight: '800' }
});
