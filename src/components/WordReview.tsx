import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { t } from '../core/i18n';
import type { Language, LearnedWord } from '../core/types';

interface WordReviewProps {
  learnedWords: LearnedWord[];
  language?: Language;
  onBack: () => void;
  onSpeak: (word: LearnedWord) => void;
}

/**
 * Simple gallery of every word the child has ever learned. Tap any card
 * to hear the word + its meaning spoken again.
 */
export default function WordReview({
  learnedWords,
  language = 'en',
  onBack,
  onSpeak
}: WordReviewProps) {
  const strings = t(language);
  const isHi = language === 'hi';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isHi ? 'तुम्हारे शब्द 💎' : 'Your word treasure! 💎'}
      </Text>
      <Text style={styles.lead}>
        {isHi
          ? 'किसी भी शब्द पर टैप करके फिर से सुनो।'
          : 'Tap any word to hear it again.'}
      </Text>

      {learnedWords.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyText}>
            {isHi ? 'अभी कोई शब्द नहीं — जाओ ढूंढो!' : 'No words yet — go find some!'}
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {learnedWords.map((w) => (
            <Pressable
              key={w.word}
              style={styles.tile}
              onPress={() => onSpeak(w)}
            >
              <Text style={styles.emoji}>{w.emoji}</Text>
              <Text style={styles.word}>{w.word}</Text>
              <Text style={styles.meaning} numberOfLines={3}>
                {w.meaning}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 120,
    backgroundColor: '#f3f0ff',
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6d28d9',
    textAlign: 'center'
  },
  lead: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  empty: { alignItems: 'center', gap: 12, marginTop: 40 },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6
  },
  tile: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 140,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  emoji: { fontSize: 40 },
  word: { fontSize: 16, fontWeight: '800', color: '#1e1b4b' },
  meaning: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16
  },
  back: {
    marginTop: 16,
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignSelf: 'center'
  },
  backText: { color: '#fff', fontWeight: '800', fontSize: 15 }
});
