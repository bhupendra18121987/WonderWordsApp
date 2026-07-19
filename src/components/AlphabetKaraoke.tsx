import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Language } from '../core/types';
import { t } from '../core/i18n';
import { LANGUAGE_CONFIG } from '../core/languages';
import ThemedScreen from './ThemedScreen';

interface AlphabetKaraokeProps {
  language: Language;
  onExit: () => void;
  /** Speaks a single letter/token in the current language. */
  speakText: (text: string) => void;
}

/** How long each letter is "held" before advancing to the next. */
const LETTER_INTERVAL_MS = 900;

/**
 * Chants the alphabet with TTS at a steady rhythm, highlighting each
 * letter as it is spoken. Tapping a letter jumps to it and speaks it.
 */
export default function AlphabetKaraoke({ language, onExit, speakText }: AlphabetKaraokeProps) {
  const strings = t(language);
  const cfg = LANGUAGE_CONFIG[language];
  const letters = useMemo(() => [...cfg.vowels, ...cfg.consonants], [cfg]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Advance the karaoke by one step. If we hit the end, stop playback.
  useEffect(() => {
    if (!playing) return;
    const letter = letters[index];
    if (letter) speakText(letter);
    timerRef.current = setTimeout(() => {
      if (index + 1 >= letters.length) {
        setPlaying(false);
        // Loop back to start so the next Play resumes cleanly.
        setIndex(0);
      } else {
        setIndex((i) => i + 1);
      }
    }, LETTER_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  useEffect(() => {
    // Cleanup any pending timer on unmount.
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const togglePlay = () => setPlaying((p) => !p);
  const restart = () => {
    setIndex(0);
    setPlaying(true);
  };
  const jumpTo = (i: number) => {
    setIndex(i);
    const letter = letters[i];
    if (letter) speakText(letter);
  };

  return (
    <ThemedScreen
      title={strings.karaokeName}
      onBack={onExit}
      headerRight={<Text style={styles.headerRight}>{index + 1} / {letters.length}</Text>}
      scroll={false}
    >
      <ScrollView contentContainerStyle={styles.gridWrap} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {letters.map((letter, i) => {
            const isCurrent = i === index;
            const isDone = i < index;
            return (
              <Pressable
                key={`${i}-${letter}`}
                style={[
                  styles.card,
                  isDone && styles.cardDone,
                  isCurrent && styles.cardCurrent
                ]}
                onPress={() => jumpTo(i)}
                accessibilityRole="button"
                accessibilityLabel={letter}
              >
                <Text style={[styles.cardText, isCurrent && styles.cardTextCurrent]}>
                  {letter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.controls}>
        <Pressable style={[styles.controlBtn, styles.controlPrimary]} onPress={togglePlay}>
          <Text style={styles.controlPrimaryText}>
            {playing ? strings.karaokePause : strings.karaokePlay}
          </Text>
        </Pressable>
        <Pressable style={[styles.controlBtn, styles.controlGhost]} onPress={restart}>
          <Text style={styles.controlGhostText}>{strings.karaokeRestart}</Text>
        </Pressable>
      </View>
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
    marginBottom: 6
  },
  title: { fontSize: 20, fontWeight: '900', color: '#6d28d9' },
  headerRight: { fontSize: 14, fontWeight: '800', color: '#6b7280' },
  gridWrap: { alignItems: 'center', paddingBottom: 12 },
  grid: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center'
  },
  card: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent'
  },
  cardDone: { backgroundColor: '#a7f3d0', opacity: 0.7 },
  cardCurrent: {
    backgroundColor: '#7c3aed',
    borderColor: '#6d28d9',
    transform: [{ scale: 1.12 }]
  },
  cardText: { fontSize: 32, fontWeight: '900', color: '#1e1b4b' },
  cardTextCurrent: { color: '#fff' },
  controls: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  controlBtn: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 999 },
  controlPrimary: { backgroundColor: '#7c3aed' },
  controlPrimaryText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  controlGhost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  controlGhostText: { color: '#1e1b4b', fontWeight: '800', fontSize: 15 },
  back: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5f0'
  },
  backText: { fontWeight: '800', color: '#1e1b4b' }
});
