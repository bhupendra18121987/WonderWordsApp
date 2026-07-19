import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import Grid from './Grid';
import WordList from './WordList';
import WordReveal from './WordReveal';
import Celebration from './Celebration';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllWords, getWordsData } from '../core/data';
import { buildPuzzleForLevel } from '../core/puzzleGenerator';
import { splitGraphemes } from '../core/grapheme';
import { getLanguageConfig } from '../core/languages';
import { t } from '../core/i18n';
import {
  computeStars,
  pickEncouragement,
  pickPraise,
  progressAfterPuzzle
} from '../core/gameLogic';
import { colors, radii, shadow } from '../core/theme';
import type {
  AgeGroupKey,
  Cell,
  FoundWord,
  Language,
  Progress,
  Puzzle,
  WordEntry
} from '../core/types';

interface WordSearchGameProps {
  ageGroup: AgeGroupKey;
  level: number;
  language: Language;
  progress: Progress;
  onProgressUpdate: (next: Progress) => void;
  onExit: () => void;
  speakLetter: (letter: string) => void;
  speakText: (text: string) => void;
}

const REVEAL_HOLD_MS = 10000;

/**
 * Main puzzle screen for React Native. Structurally mirrors the web
 * version, using the same shared `core/*` logic and the same completion
 * flow (delayed celebration with fast-forward on reveal dismiss).
 */
export default function WordSearchGame({
  ageGroup,
  level,
  language,
  progress,
  onProgressUpdate,
  onExit,
  speakLetter,
  speakText
}: WordSearchGameProps) {
  const strings = t(language);
  const langCfg = getLanguageConfig(language);
  const wordsData = getWordsData(language);
  const group = wordsData.ageGroups[ageGroup];
  const bank = getAllWords(language);
  const { width } = useWindowDimensions();
  const gridWidth = Math.min(width - 24, 400);

  const [activeLevel, setActiveLevel] = useState(level);
  const [seed, setSeed] = useState(0);

  const puzzle: Puzzle = useMemo(() => {
    const learned = progress.learnedWords.map((w) => w.word);
    const gridSize = Math.min(
      group.gridSize + Math.floor((activeLevel - 1) / 3),
      Math.max(group.gridSize + 2, 10)
    );
    return buildPuzzleForLevel({
      bank,
      ageGroup,
      gridSize,
      wordsPerPuzzle: group.wordsPerPuzzle,
      minLength: group.minLength,
      maxLength: group.maxLength,
      directions: group.directions,
      excludeWords: learned,
      fillChars: langCfg.fillChars
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageGroup, activeLevel, seed, language]);

  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [wrongCells, setWrongCells] = useState<Cell[]>([]);
  const [hintCells, setHintCells] = useState<Cell[]>([]);
  const [reveal, setReveal] = useState<{
    word: string;
    emoji: string;
    meaning: string;
  } | null>(null);
  const [completion, setCompletion] = useState<{
    wordsFound: number;
    stars: 1 | 2 | 3;
    praise: string;
  } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const streakRef = useRef(0);
  const completingRef = useRef(false);
  const completionPraiseRef = useRef('');
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset per-puzzle state on new puzzle
  useEffect(() => {
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setFoundWords([]);
    setWrongCells([]);
    setHintCells([]);
    setReveal(null);
    setCompletion(null);
    setMistakes(0);
    setHintsUsed(0);
    streakRef.current = 0;
    completingRef.current = false;
    completionPraiseRef.current = '';
  }, [puzzle]);

  useEffect(() => () => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
  }, []);

  const allFoundCells = useMemo(
    () => foundWords.flatMap((f) => f.cells),
    [foundWords]
  );
  const foundWordStrings = useMemo(
    () => foundWords.map((f) => f.word),
    [foundWords]
  );

  const handleLetterEnter = useCallback(
    (letter: string) => {
      speakLetter(letter);
    },
    [speakLetter]
  );

  const handleSelectionAttempt = useCallback(
    ({ word, cells, isStraight }: { word: string; cells: Cell[]; isStraight: boolean }) => {
      if (!isStraight || !word) return;
      const dragged = splitGraphemes(word);
      const target = puzzle.placements.find((p) => {
        if (foundWordStrings.includes(p.word)) return false;
        const placed = splitGraphemes(p.word);
        if (placed.length !== dragged.length) return false;
        const forward = placed.every((g, i) => g === dragged[i]);
        if (forward) return true;
        return placed.every((g, i) => g === dragged[placed.length - 1 - i]);
      });

      if (target) {
        const item = puzzle.items.find((w) => w.word === target.word);
        streakRef.current += 1;
        speakText(target.word);
        setFoundWords((prev) => [
          ...prev,
          { word: target.word, cells: target.cells, meta: item }
        ]);
        if (item) setReveal({ word: item.word, emoji: item.emoji, meaning: item.meaning });
      } else {
        streakRef.current = 0;
        setMistakes((m) => m + 1);
        setWrongCells(cells);
        // Not saying the wrong word — just visual shake.
        // Let it disappear after a moment.
        setTimeout(() => setWrongCells([]), 500);
      }
    },
    [puzzle, foundWordStrings, speakText]
  );

  // Detect puzzle completion
  useEffect(() => {
    if (
      completingRef.current ||
      puzzle.items.length === 0 ||
      foundWords.length !== puzzle.items.length ||
      completion !== null
    ) {
      return;
    }
    completingRef.current = true;
    const stars = computeStars(mistakes, hintsUsed);
    const wordsFound = foundWords.length;
    const praise = pickPraise(language);
    completionPraiseRef.current = praise;
    const foundMeta: WordEntry[] = foundWords
      .map((f) => f.meta)
      .filter((m): m is WordEntry => Boolean(m));
    const next = progressAfterPuzzle({
      current: progress,
      level: activeLevel,
      stars,
      foundWords: foundMeta,
      currentStreak: streakRef.current
    });
    onProgressUpdate(next);
    completionTimerRef.current = setTimeout(() => {
      completionTimerRef.current = null;
      setReveal(null);
      speakText(praise);
      setCompletion({ wordsFound, stars, praise });
    }, REVEAL_HOLD_MS);
  }, [
    foundWords,
    puzzle.items.length,
    completion,
    mistakes,
    hintsUsed,
    progress,
    activeLevel,
    language,
    onProgressUpdate,
    speakText
  ]);

  const useHint = useCallback(() => {
    const remaining = puzzle.placements.filter(
      (p) => !foundWordStrings.includes(p.word)
    );
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(Math.random() * remaining.length)]!;
    setHintCells([target.cells[0]!]);
    setHintsUsed((n) => n + 1);
    speakText(target.word);
    setTimeout(() => setHintCells([]), 2400);
  }, [puzzle.placements, foundWordStrings, speakText]);

  const newPuzzle = () => setSeed((s) => s + 1);
  const nextLevel = () => {
    setActiveLevel((l) => l + 1);
    setSeed((s) => s + 1);
  };

  const progressPct = puzzle.items.length === 0
    ? 0
    : Math.round((foundWords.length / puzzle.items.length) * 100);

  const finishRevealEarly = () => {
    setReveal(null);
    if (completingRef.current && completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
      const stars = computeStars(mistakes, hintsUsed);
      speakText(completionPraiseRef.current);
      setCompletion({
        wordsFound: foundWords.length,
        stars,
        praise: completionPraiseRef.current
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🧩 {strings.level} {activeLevel}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {foundWords.length}/{puzzle.items.length} {strings.found}
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </LinearGradient>

      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Grid
          grid={puzzle.grid}
          foundCells={allFoundCells}
          hintCells={hintCells}
          wrongCells={wrongCells}
          highlightVowels
          language={language}
          onLetterEnter={handleLetterEnter}
          onSelectionAttempt={handleSelectionAttempt}
          gridWidth={gridWidth}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{strings.wordsToFind}</Text>
        <WordList items={puzzle.items} foundWords={foundWordStrings} />
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionBtn, styles.actionAccent]} onPress={useHint}>
          <Text style={styles.actionText}>{strings.hint}</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.actionGhost]} onPress={newPuzzle}>
          <Text style={styles.actionGhostText}>{strings.newBtn}</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.actionGhost]} onPress={onExit}>
          <Text style={styles.actionGhostText}>{strings.home}</Text>
        </Pressable>
      </View>

      <WordReveal
        word={reveal}
        language={language}
        onClose={finishRevealEarly}
      />

      <Celebration
        visible={!!completion}
        praise={completion?.praise ?? ''}
        wordsFound={completion?.wordsFound}
        stars={completion?.stars ?? 3}
        nextLabel={strings.nextPuzzle}
        homeLabel={strings.home}
        onNext={() => { setCompletion(null); nextLevel(); }}
        onHome={() => { setCompletion(null); onExit(); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 84,
    paddingBottom: 120,
    backgroundColor: colors.bg,
    gap: 12
  },
  hero: {
    borderRadius: radii.lg,
    padding: 12,
    gap: 10,
    ...shadow.card
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  pill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)'
  },
  pillText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '800',
    color: colors.ink
  },
  progressBar: {
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.34)'
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 999
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionAccent: {
    backgroundColor: colors.accent
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.onAccent
  },
  actionGhost: {
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.border
  },
  actionGhostText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink
  }
});
