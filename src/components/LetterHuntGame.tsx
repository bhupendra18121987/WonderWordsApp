import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { buildChoices, pickOne, ROUNDS_PER_SESSION } from '../core/miniGames';
import { CHOICE_COUNT_BY_AGE, letterPool } from '../core/data/letterHunt';
import MiniConfetti from './MiniConfetti';
import Celebration from './Celebration';
import { starsFromScore } from '../core/gameLogic';

interface LetterHuntGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  /** Speaks arbitrary text in the current language. */
  speakText: (text: string) => void;
}

export default function LetterHuntGame({ ageGroup, language, onExit, speakText }: LetterHuntGameProps) {
  const strings = t(language);
  const pool = useMemo(() => letterPool(language, ageGroup), [language, ageGroup]);
  const choiceCount = CHOICE_COUNT_BY_AGE[ageGroup];

  const [target, setTarget] = useState<string>(() => pickOne(pool) ?? pool[0]!);
  const [choices, setChoices] = useState<string[]>(() => buildChoices(target, pool, choiceCount));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [burstCount, setBurstCount] = useState(0);
  const [done, setDone] = useState(false);

  // Speak the prompt for the current target whenever it changes.
  useEffect(() => {
    speakText(strings.letterHuntPrompt(target));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    const nextTarget = pickOne(pool) ?? pool[0]!;
    setTarget(nextTarget);
    setChoices(buildChoices(nextTarget, pool, choiceCount));
    setRound((r) => r + 1);
    setWrongId(null);
  };

  const handleTap = (letter: string) => {
    if (letter === target) {
      setScore((s) => s + 1);
      setCorrectId(letter);
      setBurstCount((b) => b + 1);
      speakText(strings.correctFeedback);
      setTimeout(() => {
        setCorrectId(null);
        nextRound();
      }, 1400);
    } else {
      setWrongId(letter);
      speakText(letter);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const restart = () => {
    setScore(0);
    setRound(1);
    setDone(false);
    const t0 = pickOne(pool) ?? pool[0]!;
    setTarget(t0);
    setChoices(buildChoices(t0, pool, choiceCount));
  };

  if (done) {
    return (
      <Celebration
        visible
        praise={strings.correctFeedback}
        stars={starsFromScore(score, ROUNDS_PER_SESSION)}
        nextLabel={strings.playAgain}
        onNext={restart}
        onHome={onExit}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.letterHuntName}</Text>
        <Text style={styles.headerRight}>{strings.roundLabel(round, ROUNDS_PER_SESSION)}   {strings.scoreLabel(score)}</Text>
      </View>

      <Pressable
        style={styles.promptCard}
        onPress={() => speakText(strings.letterHuntPrompt(target))}
        accessibilityRole="button"
        accessibilityLabel={strings.letterHuntPrompt(target)}
      >
        <Text style={styles.promptText}>{strings.letterHuntPrompt(target)}</Text>
        <Text style={styles.promptHint}>🔊</Text>
      </Pressable>

      <View style={styles.grid}>
        {choices.map((letter) => {
          const isWrong = wrongId === letter;
          const isRight = correctId === letter;
          return (
            <Pressable
              key={letter}
              style={({ pressed }) => [
                styles.card,
                isWrong && styles.cardWrong,
                isRight && styles.cardRight,
                pressed && styles.cardPressed
              ]}
              onPress={() => handleTap(letter)}
              accessibilityRole="button"
              accessibilityLabel={letter}
            >
              <Text style={styles.cardLetter}>{letter}</Text>
              {isRight && <Text style={styles.cardCheck}>✓</Text>}
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
  promptCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  promptText: { fontSize: 22, fontWeight: '800', color: '#1e1b4b', textAlign: 'center' },
  promptHint: { fontSize: 20 },
  grid: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center'
  },
  card: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#ffd6e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent'
  },
  cardWrong: { borderColor: '#ef4b6b', backgroundColor: '#ffe0e6' },
  cardRight: { borderColor: '#4ec37a', backgroundColor: '#e0f6e8' },
  cardPressed: { transform: [{ scale: 0.93 }], opacity: 0.9 },
  cardLetter: { fontSize: 46, fontWeight: '900', color: '#1e1b4b' },
  cardCheck: { position: 'absolute', top: 6, right: 10, fontSize: 20, color: '#4ec37a', fontWeight: '900' },
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
