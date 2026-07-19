import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { ROUNDS_PER_SESSION } from '../core/miniGames';
import { CHOICE_COUNT_BY_AGE } from '../core/data/letterHunt';
import {
  generateMissingLetter,
  type MissingLetterPuzzle
} from '../core/data/missingLetter';
import MiniConfetti from './MiniConfetti';

interface MissingLetterGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

export default function MissingLetterGame({
  ageGroup,
  language,
  onExit,
  speakText
}: MissingLetterGameProps) {
  const strings = t(language);
  const choiceCount = CHOICE_COUNT_BY_AGE[ageGroup];

  const [puzzle, setPuzzle] = useState<MissingLetterPuzzle | null>(() =>
    generateMissingLetter(language, ageGroup, choiceCount)
  );
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [done, setDone] = useState(false);

  const displayGraphemes = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.graphemes.map((g, i) =>
      i === puzzle.blankIndex && !revealAnswer ? '_' : g
    );
  }, [puzzle, revealAnswer]);

  // Speak the full word on new puzzle so the child hears the target aloud.
  useEffect(() => {
    if (puzzle) speakText(puzzle.word.word);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    setPuzzle(generateMissingLetter(language, ageGroup, choiceCount));
    setRound((r) => r + 1);
    setRevealAnswer(false);
    setWrongId(null);
    setCorrectId(null);
  };

  const handleTap = (choice: string) => {
    if (!puzzle) return;
    if (choice === puzzle.answer) {
      setScore((s) => s + 1);
      setCorrectId(choice);
      setRevealAnswer(true);
      setBurstCount((b) => b + 1);
      // Speak the full word once completed so the child hears the shape.
      speakText(puzzle.word.word);
      setTimeout(() => speakText(strings.correctFeedback), 700);
      setTimeout(nextRound, 1800);
    } else {
      setWrongId(choice);
      speakText(choice);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const restart = () => {
    setScore(0);
    setRound(1);
    setDone(false);
    setRevealAnswer(false);
    setPuzzle(generateMissingLetter(language, ageGroup, choiceCount));
  };

  if (done) {
    return (
      <View style={styles.root}>
        <View style={styles.doneCard}>
          <Text style={styles.doneEmoji}>🏆</Text>
          <Text style={styles.doneTitle}>{strings.correctFeedback}</Text>
          <Text style={styles.doneScore}>{strings.scoreLabel(score)} / {ROUNDS_PER_SESSION}</Text>
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

  if (!puzzle) {
    // No suitable puzzle could be generated (very unlikely).
    return (
      <View style={styles.root}>
        <Text style={styles.title}>{strings.missingLetterName}</Text>
        <Pressable style={styles.back} onPress={onExit}>
          <Text style={styles.backText}>← {strings.home}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.missingLetterName}</Text>
        <Text style={styles.headerRight}>
          {strings.roundLabel(round, ROUNDS_PER_SESSION)}   {strings.scoreLabel(score)}
        </Text>
      </View>

      <View style={styles.wordCard}>
        <Text style={styles.emojiHint}>{puzzle.word.emoji ?? '❔'}</Text>
        <View style={styles.wordRow}>
          {displayGraphemes.map((g, i) => (
            <Text
              key={`${i}-${g}`}
              style={[
                styles.wordGlyph,
                i === puzzle.blankIndex && !revealAnswer && styles.wordBlank,
                i === puzzle.blankIndex && revealAnswer && styles.wordFilled
              ]}
            >
              {g}
            </Text>
          ))}
        </View>
        <Pressable
          style={styles.speakBtn}
          onPress={() => speakText(puzzle.word.word)}
        >
          <Text style={styles.speakBtnText}>🔊</Text>
        </Pressable>
      </View>

      <Text style={styles.prompt}>{strings.missingLetterPrompt}</Text>

      <View style={styles.choicesGrid}>
        {puzzle.choices.map((c) => {
          const isWrong = wrongId === c;
          const isRight = correctId === c;
          return (
            <Pressable
              key={c}
              style={({ pressed }) => [
                styles.choiceCard,
                isWrong && styles.choiceWrong,
                isRight && styles.choiceRight,
                pressed && styles.choicePressed
              ]}
              onPress={() => handleTap(c)}
              accessibilityRole="button"
              accessibilityLabel={c}
            >
              <Text style={styles.choiceGlyph}>{c}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.back} onPress={onExit}>
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>

      <MiniConfetti trigger={burstCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f3f0ff', padding: 16, alignItems: 'center' },
  header: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8
  },
  title: { fontSize: 20, fontWeight: '900', color: '#6d28d9' },
  headerRight: { fontSize: 14, fontWeight: '800', color: '#6b7280' },

  wordCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  emojiHint: { fontSize: 64 },
  wordRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  wordGlyph: { fontSize: 42, fontWeight: '900', color: '#1e1b4b' },
  wordBlank: { color: '#c8c1d8', backgroundColor: '#faf7ff', paddingHorizontal: 6, borderRadius: 8 },
  wordFilled: { color: '#4ec37a' },
  speakBtn: { paddingHorizontal: 14, paddingVertical: 6 },
  speakBtnText: { fontSize: 24 },

  prompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 10,
    textAlign: 'center'
  },

  choicesGrid: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center'
  },
  choiceCard: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#d6ecff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent'
  },
  choiceWrong: { borderColor: '#ef4b6b', backgroundColor: '#ffe0e6' },
  choiceRight: { borderColor: '#4ec37a', backgroundColor: '#e0f6e8' },
  choicePressed: { transform: [{ scale: 0.93 }], opacity: 0.9 },
  choiceGlyph: { fontSize: 36, fontWeight: '900', color: '#1e1b4b' },

  back: {
    marginTop: 24,
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
    gap: 10,
    marginTop: 40,
    width: '100%',
    maxWidth: 460
  },
  doneEmoji: { fontSize: 56 },
  doneTitle: { fontSize: 22, fontWeight: '900', color: '#6d28d9' },
  doneScore: { fontSize: 18, fontWeight: '800', color: '#1e1b4b' },
  doneRow: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  actionBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  primaryBtn: { backgroundColor: '#7c3aed' },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  ghostBtn: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  ghostBtnText: { color: '#1e1b4b', fontWeight: '800' }
});
