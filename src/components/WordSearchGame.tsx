import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grid from './Grid';
import WordList from './WordList';
import WordReveal from './WordReveal';
import Celebration from './Celebration';
import MiniConfetti from './MiniConfetti';
import BackButton from './BackButton';
import {
  ClockIcon,
  CoinIcon,
  GameGrass,
  LightbulbIcon,
  colorForWordIndex
} from './GameAssets';
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
import { triggerHaptic } from '../core/haptics';
import { radii, shadow } from '../core/theme';
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
  sound: boolean;
  progress: Progress;
  onProgressUpdate: (next: Progress) => void;
  onExit: () => void;
  speakLetter: (letter: string) => void;
  speakText: (text: string) => void;
}

const MAX_HINTS = 3;

export default function WordSearchGame({
  ageGroup,
  level,
  language,
  sound,
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
  const insets = useSafeAreaInsets();

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
  const [burstCount, setBurstCount] = useState(0);
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
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const streakRef = useRef(0);
  const finalWordPendingRef = useRef(false);
  const celebrationShownRef = useRef(false);
  const completionSnapshotRef = useRef<{ wordsFound: number; stars: 1 | 2 | 3; praise: string } | null>(null);

  const gridWidth = Math.min(width - 32, 380);

  useEffect(() => {
    setFoundWords([]);
    setWrongCells([]);
    setHintCells([]);
    setReveal(null);
    setCompletion(null);
    setMistakes(0);
    setHintsUsed(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    streakRef.current = 0;
    finalWordPendingRef.current = false;
    celebrationShownRef.current = false;
    completionSnapshotRef.current = null;
  }, [puzzle]);

  useEffect(() => {
    if (completion) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [completion, puzzle]);

  const lastActiveTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    lastActiveTimeRef.current = Date.now();
  }, [foundWords, mistakes, hintsUsed]);

  // Idle Hint Pulse: if the child doesn't interact for 12s, gently pulse the first letter of an unfound word
  useEffect(() => {
    if (completion || reveal) return;
    const interval = setInterval(() => {
      const idle = (Date.now() - lastActiveTimeRef.current) / 1000;
      if (idle >= 12 && hintCells.length === 0) {
        const remaining = puzzle.placements.filter((p) => !foundWordStrings.includes(p.word));
        if (remaining.length > 0 && remaining[0]?.cells[0]) {
          setHintCells([remaining[0].cells[0]]);
          setTimeout(() => setHintCells([]), 3200);
          lastActiveTimeRef.current = Date.now();
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [completion, reveal, puzzle.placements, foundWordStrings, hintCells.length]);

  const allFoundCells = useMemo(
    () => foundWords.flatMap((f) => f.cells),
    [foundWords]
  );
  const foundWordStrings = useMemo(
    () => foundWords.map((f) => f.word),
    [foundWords]
  );

  const foundGroups = useMemo(
    () =>
      foundWords.map((f) => {
        const idx = puzzle.items.findIndex((it) => it.word === f.word);
        return {
          cells: f.cells,
          color: colorForWordIndex(idx >= 0 ? idx : 0)
        };
      }),
    [foundWords, puzzle.items]
  );

  const handleLetterEnter = useCallback(
    (letter: string) => { speakLetter(letter); },
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
        triggerHaptic('match');
        setBurstCount((count) => count + 1);
        const item = puzzle.items.find((w) => w.word === target.word);
        streakRef.current += 1;
        if (foundWordStrings.length + 1 === puzzle.items.length) finalWordPendingRef.current = true;
        // Note: don't speak the word here — the WordReveal modal that
        // opens next auto-speaks it, so speaking again would double up.
        setFoundWords((prev) => [
          ...prev,
          { word: target.word, cells: target.cells, meta: item }
        ]);
        if (item) setReveal({ word: item.word, emoji: item.emoji, meaning: item.meaning });
      } else {
        streakRef.current = 0;
        setMistakes((m) => m + 1);
        setWrongCells(cells);
        setTimeout(() => setWrongCells([]), 500);
      }
    },
    [puzzle, foundWordStrings, speakText]
  );

  useEffect(() => {
    if (
      !finalWordPendingRef.current ||
      puzzle.items.length === 0 ||
      foundWords.length !== puzzle.items.length ||
      completion !== null
    ) {
      return;
    }
    if (!completionSnapshotRef.current) {
      const snapshot = {
        wordsFound: foundWords.length,
        stars: computeStars(mistakes, hintsUsed),
        praise: pickPraise(language)
      } as const;
      completionSnapshotRef.current = snapshot;
      const foundMeta: WordEntry[] = foundWords
        .map((f) => f.meta)
        .filter((m): m is WordEntry => Boolean(m));
      onProgressUpdate(progressAfterPuzzle({
        current: progress,
        level: activeLevel,
        stars: snapshot.stars,
        foundWords: foundMeta,
        currentStreak: streakRef.current
      }));
    }
    if (!reveal && !celebrationShownRef.current && completionSnapshotRef.current) {
      celebrationShownRef.current = true;
      finalWordPendingRef.current = false;
      triggerHaptic('celebrate');
      speakText(completionSnapshotRef.current.praise);
      setCompletion(completionSnapshotRef.current);
    }
    void pickEncouragement;
  }, [
    foundWords,
    reveal,
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
    if (hintsUsed >= MAX_HINTS) return;
    const remaining = puzzle.placements.filter(
      (p) => !foundWordStrings.includes(p.word)
    );
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(Math.random() * remaining.length)]!;
    setHintCells([target.cells[0]!]);
    setHintsUsed((n) => n + 1);
    speakText(target.word);
    setTimeout(() => setHintCells([]), 2400);
  }, [puzzle.placements, foundWordStrings, speakText, hintsUsed]);

  const nextLevel = () => {
    setActiveLevel((l) => l + 1);
    setSeed((s) => s + 1);
  };

  const progressPct = puzzle.items.length === 0
    ? 0
    : Math.round((foundWords.length / puzzle.items.length) * 100);

  const timerLabel = useMemo(() => {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [elapsed]);

  const hintsRemaining = Math.max(0, MAX_HINTS - hintsUsed);
  const hintDisabled = hintsRemaining === 0;

  const finishRevealEarly = () => {
    setReveal(null);
  };

  return (
    <LinearGradient
      colors={['#147d78', '#0c615d']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: 120 + insets.bottom }]}
    >
      <View style={styles.topbar}>
        <BackButton onPress={onExit} variant="light" label={strings.back} />
        <View style={styles.chip}>
          <ClockIcon size={14} />
          <Text style={styles.chipText}>{timerLabel}</Text>
        </View>
        <View style={styles.chip}>
          <CoinIcon size={16} />
          <Text style={styles.chipText}>{progress.stars}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{strings.wordsToFind}</Text>
        <WordList items={puzzle.items} foundWords={foundWordStrings} colored />

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Grid
            grid={puzzle.grid}
            foundCells={allFoundCells}
            foundGroups={foundGroups}
            hintCells={hintCells}
            wrongCells={wrongCells}
            highlightVowels
            language={language}
            onLetterEnter={handleLetterEnter}
            onSelectionAttempt={handleSelectionAttempt}
            gridWidth={gridWidth}
          />
        </View>

        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={useHint}
            disabled={hintDisabled}
            style={({ pressed }) => [
              styles.hintBtn,
              hintDisabled && styles.hintBtnDisabled,
              pressed && !hintDisabled && { transform: [{ translateY: 2 }] }
            ]}
          >
            <View style={styles.hintIcon}>
              <LightbulbIcon size={16} />
            </View>
            <Text style={styles.hintLabel}>{strings.hint.replace(/^[💡\s]+/, '')}</Text>
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.grass} pointerEvents="none">
        <GameGrass width={width} height={44} />
      </View>

      <WordReveal
        word={reveal}
        language={language}
        sound={sound}
        onClose={finishRevealEarly}
      />

      <Celebration
        visible={!!completion}
        language={language}
        praise={completion?.praise ?? ''}
        wordsFound={completion?.wordsFound}
        stars={completion?.stars ?? 3}
        nextLabel={strings.nextPuzzle}
        homeLabel={strings.home}
        onNext={() => { setCompletion(null); nextLevel(); }}
        onHome={() => { setCompletion(null); onExit(); }}
      />
      <MiniConfetti trigger={burstCount} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.pill,
    ...shadow.soft
  },
  chipText: { fontSize: 13, fontWeight: '900', color: '#1e1b4b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 14,
    gap: 10,
    ...shadow.card
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#0c615d', textAlign: 'center' },
  progressBar: {
    height: 10,
    backgroundColor: '#efe6ff',
    borderRadius: 999,
    overflow: 'hidden'
  },
  progressFill: { height: '100%', backgroundColor: '#66c3b7', borderRadius: 999 },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  hintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffd23c',
    borderRadius: radii.pill,
    ...shadow.soft
  },
  hintBtnDisabled: { opacity: 0.5 },
  hintIcon: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center', justifyContent: 'center'
  },
  hintLabel: { fontSize: 13, fontWeight: '900', color: '#1e1b4b' },
  hintBadge: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: '#ef4444',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6
  },
  hintBadgeText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  grass: {
    position: 'absolute',
    left: 0, right: 0, bottom: 60,
    height: 44
  }
});
