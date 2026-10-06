import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { buildChoices, pickOne, ROUNDS_PER_SESSION } from '../core/miniGames';
import { pickColorsForAge, type ColorEntry } from '../core/data/colors';
import MiniConfetti from './MiniConfetti';
import Celebration from './Celebration';
import ThemedScreen from './ThemedScreen';
import { starsFromScore } from '../core/gameLogic';

interface TapColorGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

export default function TapColorGame({ ageGroup, language, onExit, speakText }: TapColorGameProps) {
  const strings = t(language);
  const pool = useMemo(() => pickColorsForAge(ageGroup), [ageGroup]);
  const choiceCount = pool.length;

  const [target, setTarget] = useState<ColorEntry>(() => pickOne(pool) ?? pool[0]!);
  const [choices, setChoices] = useState<ColorEntry[]>(() => buildChoices(target, pool, choiceCount));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const answeredRef = useRef(false);
  const [burstCount, setBurstCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speakText(strings.tapColorPrompt(target.labels[language]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, round, language]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    const next = pickOne(pool.filter((color) => color.id !== target.id)) ?? pickOne(pool) ?? pool[0]!;
    setTarget(next);
    setChoices(buildChoices(next, pool, choiceCount));
    setRound((r) => r + 1);
    setWrongId(null);
    answeredRef.current = false;
    setLocked(false);
  };

  const handleTap = (c: ColorEntry) => {
    if (answeredRef.current || done) return;
    if (c.id === target.id) {
      answeredRef.current = true;
      setLocked(true);
      setScore((s) => s + 1);
      setCorrectId(c.id);
      setBurstCount((b) => b + 1);
      // Confirm the color, then queue praise so neither utterance is cut off.
      speakText(strings.correctFeedback);
      setTimeout(() => {
        setCorrectId(null);
        nextRound();
      }, 900);
    } else {
      setWrongId(c.id);
      speakText(c.labels[language]);
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
    const freshPool = pickColorsForAge(ageGroup);
    const t0 = pickOne(freshPool) ?? freshPool[0]!;
    setTarget(t0);
    setChoices(buildChoices(t0, freshPool, freshPool.length));
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
      title={strings.tapColorName}
      language={language}
      onBack={onExit}
      headerRight={<Text style={styles.headerRight}>{strings.roundLabel(round, ROUNDS_PER_SESSION)}   {strings.scoreLabel(score)}</Text>}
    >
      <Pressable
        style={styles.promptCard}
        onPress={() => speakText(strings.tapColorPrompt(target.labels[language]))}
        accessibilityRole="button"
        accessibilityLabel={strings.tapColorPrompt(target.labels[language])}
      >
        <Text style={styles.promptText}>{strings.tapColorPrompt(target.labels[language])}</Text>
        <View style={styles.speakerPill}>
          <Text style={styles.speakerIcon}>🔊</Text>
          <Text style={styles.speakerText}>{language === 'hi' ? 'सुनो' : 'Listen'}</Text>
        </View>
      </Pressable>

      <View style={styles.grid}>
        {choices.map((c) => {
          const isWrong = wrongId === c.id;
          const isRight = correctId === c.id;
          return (
            <Pressable
              key={c.id}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: c.hex },
                isWrong && styles.swatchWrong,
                isRight && styles.swatchRight,
                pressed && styles.swatchPressed
              ]}
              onPress={() => handleTap(c)}
              disabled={locked}
              accessibilityRole="button"
              accessibilityLabel={c.labels[language]}
            />
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
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#0c615d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#e6f4f2'
  },
  promptText: { fontSize: 22, fontWeight: '800', color: '#1e1b4b', textAlign: 'center' },
  speakerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  speakerIcon: { fontSize: 13 },
  speakerText: { fontSize: 13, fontWeight: '800', color: '#059669' },
  grid: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center'
  },
  swatch: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  swatchWrong: { borderColor: '#ef4444', borderWidth: 4.5 },
  swatchRight: { borderColor: '#10b981', borderWidth: 5 },
  swatchPressed: { transform: [{ scale: 0.9 }], opacity: 0.85 }
});
