import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { buildChoices, pickOne, ROUNDS_PER_SESSION } from '../core/miniGames';
import { CHOICE_COUNT_BY_AGE, letterPool } from '../core/data/letterHunt';
import MiniConfetti from './MiniConfetti';
import Celebration from './Celebration';
import ThemedScreen from './ThemedScreen';
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
  const [locked, setLocked] = useState(false);
  const answeredRef = useRef(false);
  const [burstCount, setBurstCount] = useState(0);
  const [done, setDone] = useState(false);

  // Speak the prompt for the current target whenever it changes.
  useEffect(() => {
    speakText(strings.letterHuntPrompt(target));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, round, language]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    const nextTarget = pickOne(pool.filter((letter) => letter !== target)) ?? pickOne(pool) ?? pool[0]!;
    setTarget(nextTarget);
    setChoices(buildChoices(nextTarget, pool, choiceCount));
    setRound((r) => r + 1);
    setWrongId(null);
    answeredRef.current = false;
    setLocked(false);
  };

  const handleTap = (letter: string) => {
    if (answeredRef.current || done) return;
    if (letter === target) {
      answeredRef.current = true;
      setLocked(true);
      setScore((s) => s + 1);
      setCorrectId(letter);
      setBurstCount((b) => b + 1);
      speakText(strings.correctFeedback);
      setTimeout(() => {
        setCorrectId(null);
        nextRound();
      }, 900);
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
    answeredRef.current = false;
    setLocked(false);
    setWrongId(null);
    setCorrectId(null);
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
    <ThemedScreen
      title={strings.letterHuntName}
      language={language}
      onBack={onExit}
      headerRight={<Text style={styles.headerRight}>{strings.roundLabel(round, ROUNDS_PER_SESSION)}   {strings.scoreLabel(score)}</Text>}
    >
      {/* Prominent visual hunt card */}
      <Pressable
        style={styles.promptCard}
        onPress={() => speakText(strings.letterHuntPrompt(target))}
        accessibilityRole="button"
        accessibilityLabel={strings.letterHuntPrompt(target)}
      >
        <View style={styles.promptHeader}>
          <Text style={styles.promptSubText}>
            {language === 'hi' ? 'यह अक्षर ढूंढो:' : 'Find this letter:'}
          </Text>
          <View style={styles.speakerPill}>
            <Text style={styles.speakerIcon}>🔊</Text>
            <Text style={styles.speakerText}>
              {language === 'hi' ? 'सुनो' : 'Listen'}
            </Text>
          </View>
        </View>

        {/* Visually prominent target letter badge */}
        <View style={styles.targetLetterBadge}>
          <Text style={styles.targetLetterText}>{target}</Text>
        </View>

        <Text style={styles.promptFooterText}>
          {strings.letterHuntPrompt(target)}
        </Text>
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
              disabled={locked}
              accessibilityRole="button"
              accessibilityLabel={letter}
            >
              <Text style={styles.cardLetter}>{letter}</Text>
              {isRight && <Text style={styles.cardCheck}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <MiniConfetti trigger={burstCount} />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  headerRight: { fontSize: 14, fontWeight: '800', color: '#6b7280' },
  promptCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#0c615d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e6f4f2'
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4
  },
  promptSubText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569'
  },
  speakerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  speakerIcon: {
    fontSize: 13
  },
  speakerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669'
  },
  targetLetterBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fef08a',
    borderWidth: 4,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4
  },
  targetLetterText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#1e1b4b',
    textAlign: 'center'
  },
  promptFooterText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0c615d',
    textAlign: 'center'
  },
  grid: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center'
  },
  card: {
    width: 94,
    height: 94,
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
  cardLetter: { fontSize: 42, fontWeight: '900', color: '#1e1b4b' },
  cardCheck: { position: 'absolute', top: 6, right: 8, fontSize: 20, color: '#4ec37a', fontWeight: '900' }
});
