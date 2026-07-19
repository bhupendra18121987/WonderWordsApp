import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LANGUAGE_CONFIG } from '../core/languages';
import type { Language } from '../core/types';

interface LanguageSelectProps {
  selected: Language | null;
  step?: { current: number; total: number };
  onSelect: (lang: Language) => void;
  onNext: () => void;
}

const FLAG: Record<Language, string> = { en: '🇺🇸', hi: '🇮🇳' };
const SAMPLE: Record<Language, string> = { en: 'A B C', hi: 'क ख ग' };

export default function LanguageSelect({
  selected,
  step,
  onSelect,
  onNext
}: LanguageSelectProps) {
  const languages = Object.entries(LANGUAGE_CONFIG) as [
    Language,
    typeof LANGUAGE_CONFIG[Language]
  ][];

  return (
    <View style={styles.container}>
      {step && (
        <View style={styles.progress}>
          {Array.from({ length: step.total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < step.current - 1 && styles.dotDone,
                i === step.current - 1 && styles.dotActive
              ]}
            />
          ))}
        </View>
      )}

      <Text style={styles.title}>Pick your language!</Text>
      <Text style={styles.titleHi}>अपनी भाषा चुनें</Text>

      <View style={styles.grid}>
        {languages.map(([key, cfg]) => (
          <Pressable
            key={key}
            style={[styles.card, selected === key && styles.cardSelected]}
            onPress={() => onSelect(key)}
            accessibilityRole="button"
            accessibilityLabel={cfg.displayName}
          >
            <Text style={styles.flag}>{FLAG[key]}</Text>
            <Text style={styles.name}>{cfg.displayName}</Text>
            <Text style={styles.sample}>{SAMPLE[key]}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
        onPress={onNext}
        disabled={!selected}
      >
        <Text style={styles.nextBtnText}>Next →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff7d6',
    alignItems: 'center',
    gap: 16
  },
  progress: {
    flexDirection: 'row',
    gap: 10,
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e0e0e8'
  },
  dotDone: { backgroundColor: '#58c896' },
  dotActive: { backgroundColor: '#ff8fab', transform: [{ scale: 1.35 }] },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e26a89',
    marginTop: 8
  },
  titleHi: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e26a89',
    marginTop: -6
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  card: {
    width: 150,
    minHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 4,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4
  },
  cardSelected: {
    borderColor: '#ffcf5c',
    backgroundColor: '#fff8e1'
  },
  flag: { fontSize: 56 },
  name: { fontSize: 22, fontWeight: '800', color: '#e26a89' },
  sample: {
    fontSize: 18,
    fontWeight: '800',
    color: '#55556d',
    letterSpacing: 3
  },
  nextBtn: {
    marginTop: 20,
    backgroundColor: '#ff8fab',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 999
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff'
  }
});
