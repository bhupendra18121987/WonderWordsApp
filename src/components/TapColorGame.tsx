import { useEffect, useMemo, useState } from 'react';
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
  const [burstCount, setBurstCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speakText(strings.tapColorPrompt(target.labels[language]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const nextRound = () => {
    if (round >= ROUNDS_PER_SESSION) {
      setDone(true);
      return;
    }
    const next = pickOne(pool) ?? pool[0]!;
    setTarget(next);
    setChoices(buildChoices(next, pool, choiceCount));
    setRound((r) => r + 1);
    setWrongId(null);
  };

  const handleTap = (c: ColorEntry) => {
    if (c.id === target.id) {
      setScore((s) => s + 1);
      setCorrectId(c.id);
      setBurstCount((b) => b + 1);
      // Speak the color name first so the child hears confirmation of
      // WHICH color they got right, then the celebratory word. Using two
      // sequential (interrupt=false) speaks so neither cuts the other off.
      speakText(c.labels[language]);
      setTimeout(() => speakText(strings.correctFeedback), 500);
      setTimeout(() => {
        setCorrectId(null);
        nextRound();
      }, 1600);
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
      title={strings.tapColorName}
      onBack={onExit}
      headerRight={<Text style={styles.headerRight}>{strings.roundLabel(round, ROUNDS_PER_SESSION)}   {strings.scoreLabel(score)}</Text>}
    >
      <Pressable
        style={styles.promptCard}
        onPress={() => speakText(strings.tapColorPrompt(target.labels[language]))}
      >
        <Text style={styles.promptText}>{strings.tapColorPrompt(target.labels[language])}</Text>
        <Text style={styles.promptHint}>🔊</Text>
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
    gap: 14,
    justifyContent: 'center'
  },
  swatch: {
    width: 110,
    height: 110,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  swatchWrong: { borderColor: '#1e1b4b' },
  swatchRight: { borderColor: '#4ec37a', borderWidth: 6 },
  swatchPressed: { transform: [{ scale: 0.9 }], opacity: 0.85 },
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
