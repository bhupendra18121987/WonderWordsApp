import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import {
  AppleScene,
  AudioIcon,
  ChevronIcon,
  EmojiScene
} from './WordMeaningAssets';
import type { Language, LearnedWord } from '../core/types';
import { radii, shadow } from '../core/theme';

interface WordReviewProps {
  learnedWords: LearnedWord[];
  language?: Language;
  onBack: () => void;
  onSpeak: (word: LearnedWord) => void;
}

const WORD_COLORS = ['#e94b6b', '#f0863a', '#3faf46', '#4a8fd4', '#b34dc7'];

function sceneFor(word: LearnedWord) {
  if (word.word.trim().toLowerCase() === 'apple') return <AppleScene size={220} />;
  return <EmojiScene emoji={word.emoji} size={220} />;
}

export default function WordReview({
  learnedWords,
  language = 'en',
  onBack,
  onSpeak
}: WordReviewProps) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const items = useMemo(() => learnedWords, [learnedWords]);
  const count = items.length;
  const current = count > 0 ? items[index % count]! : null;
  const isHi = language === 'hi';

  useEffect(() => {
    if (current) onSpeak(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <LinearGradient
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: 24 + insets.bottom }]}
    >
      <View style={styles.topbar}>
        <BackButton onPress={onBack} variant="light" />
        <Text style={styles.topTitle}>{isHi ? 'शब्द का अर्थ' : 'Word Meaning'}</Text>
        <View style={{ width: 44 }} />
      </View>

      {!current ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyText}>
            {isHi ? 'अभी कोई शब्द नहीं — जाओ ढूंढो!' : 'No words yet — go find some!'}
          </Text>
          <Pressable onPress={onBack} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>{isHi ? '← घर' : '← Back home'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.wordRow}>
            <Text
              style={[styles.word, { color: WORD_COLORS[index % WORD_COLORS.length] }]}
            >
              {current.word.toUpperCase()}
            </Text>
            <Pressable
              onPress={() => onSpeak(current)}
              style={({ pressed }) => [styles.audioBtn, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityRole="button"
              accessibilityLabel={`Speak ${current.word}`}
            >
              <AudioIcon size={22} />
            </Pressable>
          </View>

          <View style={styles.scene}>{sceneFor(current)}</View>

          <View style={styles.meaningPanel}>
            <Text style={styles.meaning}>{current.meaning}</Text>
          </View>

          <View style={styles.pager}>
            <Pressable
              onPress={() => setIndex((i) => (i - 1 + count) % count)}
              style={({ pressed }) => [styles.navBtn, pressed && { transform: [{ scale: 0.94 }] }]}
              accessibilityRole="button"
              accessibilityLabel="Previous"
            >
              <ChevronIcon dir="left" size={22} />
            </Pressable>
            <View style={styles.dots}>
              {[0, 1, 2].map((i) => {
                const active = (index % count) % 3 === i;
                const color = i === 0 ? '#ff8fb5' : i === 1 ? '#ffd23c' : '#c9c3d8';
                return (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      { backgroundColor: active ? color : 'rgba(255,255,255,0.55)' },
                      active && { width: 22 }
                    ]}
                  />
                );
              })}
            </View>
            <Pressable
              onPress={() => setIndex((i) => (i + 1) % count)}
              style={({ pressed }) => [styles.navBtn, pressed && { transform: [{ scale: 0.94 }] }]}
              accessibilityRole="button"
              accessibilityLabel="Next"
            >
              <ChevronIcon dir="right" size={22} />
            </Pressable>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, gap: 14 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(30,15,110,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 18,
    gap: 12,
    ...shadow.card
  },
  wordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  word: { fontSize: 34, fontWeight: '900', letterSpacing: 1 },
  audioBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
    ...shadow.soft
  },
  scene: { alignItems: 'center', paddingVertical: 6 },
  meaningPanel: {
    backgroundColor: '#f5f0ff',
    borderRadius: radii.md,
    padding: 14
  },
  meaning: { fontSize: 15, fontWeight: '700', color: '#1e1b4b', textAlign: 'center' },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  navBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#f5f0ff',
    alignItems: 'center', justifyContent: 'center',
    ...shadow.soft
  },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  empty: { alignItems: 'center', gap: 12, marginTop: 40 },
  emptyEmoji: { fontSize: 56 },
  emptyText: { color: '#fff', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  emptyBtn: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: radii.pill,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  emptyBtnText: { color: '#1e1b4b', fontSize: 15, fontWeight: '900' }
});
