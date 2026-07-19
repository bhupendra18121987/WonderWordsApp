import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getWordsData } from '../core/data';
import type { AgeGroupKey, Language } from '../core/types';

interface AgeSelectProps {
  selected: AgeGroupKey | null;
  language: Language;
  step?: { current: number; total: number };
  onSelect: (key: AgeGroupKey) => void;
  onStart: () => void;
}

export default function AgeSelect({
  selected,
  language,
  step,
  onSelect,
  onStart
}: AgeSelectProps) {
  const wordsData = getWordsData(language);
  const groups = Object.entries(wordsData.ageGroups) as [
    AgeGroupKey,
    typeof wordsData.ageGroups[AgeGroupKey]
  ][];
  const isHi = language === 'hi';

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

      <Text style={styles.title}>
        {isHi ? 'अपनी उम्र चुनो, स्टार!' : 'Pick your age, superstar!'}
      </Text>
      <Text style={styles.lead}>
        {isHi
          ? 'हम तुम्हारे लिए बिलकुल सही पहेलियाँ बनाएँगे।'
          : "We'll make puzzles just right for you."}
      </Text>

      <View style={styles.grid}>
        {groups.map(([key, g]) => (
          <Pressable
            key={key}
            style={[styles.card, selected === key && styles.cardSelected]}
            onPress={() => onSelect(key)}
          >
            <Text style={styles.emoji}>{g.emoji}</Text>
            <Text style={styles.label}>{g.label}</Text>
            <Text style={styles.desc}>
              {g.gridSize}×{g.gridSize} · {g.wordsPerPuzzle} {isHi ? 'शब्द' : 'words'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.startBtn, !selected && styles.startBtnDisabled]}
        onPress={onStart}
        disabled={!selected}
      >
        <Text style={styles.startBtnText}>
          {isHi ? 'चलो खेलें! 🎈' : "Let's play! 🎈"}
        </Text>
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
    gap: 12
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
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#e0e0e8' },
  dotDone: { backgroundColor: '#58c896' },
  dotActive: { backgroundColor: '#ff8fab', transform: [{ scale: 1.35 }] },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#e26a89',
    textAlign: 'center',
    marginTop: 8
  },
  lead: {
    fontSize: 15,
    color: '#55556d',
    textAlign: 'center',
    maxWidth: 320
  },
  grid: {
    marginTop: 16,
    gap: 14,
    width: '100%',
    maxWidth: 400
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    gap: 6,
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
  emoji: { fontSize: 52 },
  label: { fontSize: 22, fontWeight: '800', color: '#e26a89' },
  desc: { fontSize: 14, color: '#55556d', fontWeight: '700' },
  startBtn: {
    marginTop: 12,
    backgroundColor: '#ff8fab',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 999
  },
  startBtnDisabled: { opacity: 0.5 },
  startBtnText: { fontSize: 20, fontWeight: '800', color: '#fff' }
});
