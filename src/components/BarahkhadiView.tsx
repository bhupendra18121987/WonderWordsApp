import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LETTER_EXAMPLES, buildBarahkhadi } from '../core/data/alphabetExamples';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface BarahkhadiViewProps {
  language: Language;
  onSpeak: (akshara: string) => void;
}

/**
 * "Focused" barahkhadi — pick a consonant at the top (horizontal scroll),
 * see its 12 vowel combinations as tappable cards. Same UX as the web.
 */
export default function BarahkhadiView({ language, onSpeak }: BarahkhadiViewProps) {
  const entry = LETTER_EXAMPLES[language];
  const strings = t(language);
  const consonants = entry.consonants;
  const matras = entry.matras ?? [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!entry.hasBarahkhadi || matras.length === 0) {
    return (
      <Text style={styles.lead}>Barahkhadi is only available in Hindi mode.</Text>
    );
  }

  const selected = consonants[selectedIdx]!;
  const combos = buildBarahkhadi(selected.letter, matras);

  return (
    <View style={styles.wrap}>
      <Text style={styles.lead}>{strings.chooseLetter}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.picker}
      >
        {consonants.map((c, i) => (
          <Pressable
            key={c.letter}
            style={[styles.pickerBtn, i === selectedIdx && styles.pickerBtnActive]}
            onPress={() => {
              setSelectedIdx(i);
              onSpeak(c.letter);
            }}
          >
            <Text
              style={[
                styles.pickerBtnText,
                i === selectedIdx && styles.pickerBtnTextActive
              ]}
            >
              {c.letter}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.selected}>
        <Text style={styles.selectedLetter}>{selected.letter}</Text>
        {selected.transliteration && (
          <Text style={styles.selectedTrans}>{selected.transliteration}</Text>
        )}
      </View>

      <View style={styles.grid}>
        {combos.map((akshara, i) => {
          const m = matras[i]!;
          return (
            <Pressable
              key={m.label}
              style={styles.cell}
              onPress={() => onSpeak(akshara)}
            >
              <Text style={styles.cellAkshara}>{akshara}</Text>
              <Text style={styles.cellMatra}>{m.label}</Text>
              <Text style={styles.cellTrans}>
                {(selected.transliteration ?? '').replace(/a$/, '')}
                {m.transliteration}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, alignItems: 'stretch' },
  lead: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  picker: {
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 6
  },
  pickerBtn: {
    minWidth: 52,
    minHeight: 52,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent'
  },
  pickerBtnActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#ffcf5c',
    transform: [{ scale: 1.06 }]
  },
  pickerBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e1b4b'
  },
  pickerBtnTextActive: { color: '#fff' },
  selected: {
    backgroundColor: '#fff8e1',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  selectedLetter: { fontSize: 56, fontWeight: '800', color: '#6d28d9' },
  selectedTrans: { fontSize: 13, fontWeight: '700', color: '#6b7280' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cell: {
    flexGrow: 1,
    flexBasis: '28%',
    minWidth: 90,
    backgroundColor: '#fef1d6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 2
  },
  cellAkshara: { fontSize: 26, fontWeight: '800', color: '#1e1b4b' },
  cellMatra: { fontSize: 12, fontWeight: '700', color: '#6d28d9' },
  cellTrans: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'lowercase'
  }
});
