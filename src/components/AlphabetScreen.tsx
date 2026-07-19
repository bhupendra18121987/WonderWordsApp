import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { getLanguageConfig } from '../core/languages';
import { LETTER_EXAMPLES, type LetterExample } from '../core/data/alphabetExamples';
import { t } from '../core/i18n';
import BarahkhadiView from './BarahkhadiView';
import type { Language } from '../core/types';

interface AlphabetScreenProps {
  language: Language;
  onBack: () => void;
  onSpeak: (letter: string, type?: string) => void;
}

type Mode = 'letters' | 'barahkhadi';

export default function AlphabetScreen({ language, onBack, onSpeak }: AlphabetScreenProps) {
  const cfg = getLanguageConfig(language);
  const strings = t(language);
  const entry = LETTER_EXAMPLES[language];
  const [mode, setMode] = useState<Mode>('letters');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{strings.vowelsAndConsonants} 🔤</Text>

      {entry.hasBarahkhadi && (
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === 'letters' && styles.tabActive]}
            onPress={() => setMode('letters')}
          >
            <Text style={[styles.tabText, mode === 'letters' && styles.tabTextActive]}>
              🔤 {strings.alphabetMode}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'barahkhadi' && styles.tabActive]}
            onPress={() => setMode('barahkhadi')}
          >
            <Text style={[styles.tabText, mode === 'barahkhadi' && styles.tabTextActive]}>
              📊 {strings.barahkhadiMode}
            </Text>
          </Pressable>
        </View>
      )}

      {mode === 'letters' ? (
        <>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statText}>🌸 {strings.vowelsLabel(entry.vowels.length)}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>🔵 {strings.consonantsLabel(entry.consonants.length)}</Text>
            </View>
          </View>

          <LetterSection
            title={cfg.vowelLabel === 'vowel' ? 'Vowels' : cfg.vowelLabel}
            letters={entry.vowels}
            tone="vowel"
            onSpeak={(l) => onSpeak(l.exampleWord ? `${l.letter}. ${l.exampleWord}` : l.letter, 'vowel')}
          />
          <LetterSection
            title={cfg.consonantLabel === 'consonant' ? 'Consonants' : cfg.consonantLabel}
            letters={entry.consonants}
            tone="consonant"
            onSpeak={(l) => onSpeak(l.exampleWord ? `${l.letter}. ${l.exampleWord}` : l.letter, 'consonant')}
          />
        </>
      ) : (
        <BarahkhadiView
          language={language}
          onSpeak={(akshara) => onSpeak(akshara, 'consonant')}
        />
      )}

      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>
    </ScrollView>
  );
}

interface LetterSectionProps {
  title: string;
  letters: LetterExample[];
  tone: 'vowel' | 'consonant';
  onSpeak: (letter: LetterExample) => void;
}

function LetterSection({ title, letters, tone, onSpeak }: LetterSectionProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.letterGrid}>
        {letters.map((l) => (
          <Pressable
            key={l.letter}
            style={[
              styles.letterCard,
              tone === 'vowel' ? styles.letterCardVowel : styles.letterCardConsonant
            ]}
            onPress={() => onSpeak(l)}
          >
            <Text
              style={[
                styles.letter,
                tone === 'vowel' ? styles.letterVowel : styles.letterConsonant
              ]}
            >
              {l.letter}
            </Text>
            {l.transliteration ? (
              <Text style={styles.transliteration}>{l.transliteration}</Text>
            ) : null}
            {l.exampleWord ? (
              <>
                <View style={styles.divider} />
                <Text style={styles.exampleEmoji}>{l.emoji}</Text>
                <Text style={styles.exampleWord} numberOfLines={1}>
                  {l.exampleWord}
                </Text>
              </>
            ) : (
              <Text style={styles.placeholder}>{tone === 'vowel' ? '🌸' : '🔵'}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 120,
    backgroundColor: '#fff7d6',
    gap: 14
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e26a89',
    textAlign: 'center'
  },
  tabs: {
    flexDirection: 'row',
    gap: 6,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 999,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999
  },
  tabActive: {
    backgroundColor: '#ff8fab'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#55556d'
  },
  tabTextActive: {
    color: '#fff'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center'
  },
  statPill: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14
  },
  statText: { fontSize: 13, fontWeight: '800', color: '#2b2b3d' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#e26a89',
    textAlign: 'center'
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  letterCard: {
    flexGrow: 1,
    flexBasis: '28%',
    minWidth: 96,
    minHeight: 130,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    borderWidth: 3
  },
  letterCardVowel: {
    backgroundColor: '#ffe4ec',
    borderColor: '#ff8fab55'
  },
  letterCardConsonant: {
    backgroundColor: '#e5f2ff',
    borderColor: '#6ec9ff55'
  },
  letter: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38
  },
  letterVowel: { color: '#e26a89' },
  letterConsonant: { color: '#3ba7ea' },
  transliteration: {
    fontSize: 11,
    fontWeight: '700',
    color: '#55556d',
    textTransform: 'lowercase'
  },
  divider: {
    height: 1,
    width: '80%',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.15)',
    marginVertical: 2
  },
  exampleEmoji: { fontSize: 26, lineHeight: 30 },
  exampleWord: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2b2b3d'
  },
  placeholder: {
    fontSize: 22,
    opacity: 0.4
  },
  back: {
    marginTop: 16,
    backgroundColor: '#ff8fab',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignSelf: 'center'
  },
  backText: { color: '#fff', fontWeight: '800', fontSize: 15 }
});
