import { StyleSheet, Text, View } from 'react-native';
import type { WordEntry } from '../core/types';
import { colorForWordIndex } from './GameAssets';

interface WordListProps {
  items: WordEntry[];
  foundWords: string[];
  /** When true, chip backgrounds use the WORD_COLORS palette by index. */
  colored?: boolean;
}

export default function WordList({ items, foundWords, colored = false }: WordListProps) {
  const foundSet = new Set(foundWords);
  return (
    <View style={styles.container}>
      {items.map((item, idx) => {
        const found = foundSet.has(item.word);
        const palette = colored ? colorForWordIndex(idx) : null;
        return (
          <View
            key={item.word}
            style={[
              styles.chip,
              palette && { backgroundColor: palette.bg, borderColor: palette.dark },
              found && !palette && styles.chipFound,
              found && palette && { opacity: 0.55 }
            ]}
          >
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.chipText,
                palette && { color: '#1e1b4b' },
                found && !palette && styles.chipTextFound,
                found && palette && { textDecorationLine: 'line-through' }
              ]}
            >
              {item.word}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center'
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#fff8ee',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)'
  },
  chipFound: {
    backgroundColor: '#58c896',
    borderColor: '#3ea877'
  },
  chipEmoji: { fontSize: 14 },
  chipText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e1b4b'
  },
  chipTextFound: {
    color: '#fff',
    textDecorationLine: 'line-through'
  }
});
