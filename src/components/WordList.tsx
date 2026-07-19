import { StyleSheet, Text, View } from 'react-native';
import type { WordEntry } from '../core/types';

interface WordListProps {
  items: WordEntry[];
  foundWords: string[];
}

export default function WordList({ items, foundWords }: WordListProps) {
  const foundSet = new Set(foundWords);
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const found = foundSet.has(item.word);
        return (
          <View
            key={item.word}
            style={[styles.chip, found && styles.chipFound]}
          >
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.chipText,
                found && styles.chipTextFound
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
    color: '#2b2b3d'
  },
  chipTextFound: {
    color: '#fff',
    textDecorationLine: 'line-through'
  }
});
