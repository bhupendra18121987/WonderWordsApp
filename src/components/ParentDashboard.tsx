import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import { t } from '../core/i18n';
import type { AgeGroupKey, Language, Progress } from '../core/types';

export default function ParentDashboard({
  language, ageGroup, profileName, progress, onBack, onSettings
}: {
  language: Language; ageGroup: AgeGroupKey | null; profileName: string; progress: Progress;
  onBack: () => void; onSettings: () => void;
}) {
  const strings = t(language);
  const insets = useSafeAreaInsets();
  const stats = [
    { icon: '🌟', label: strings.navRewards, value: progress.stars },
    { icon: '🗺️', label: strings.activityCount, value: progress.activitiesCompleted ?? 0 },
    { icon: '📚', label: strings.learned(progress.learnedWords.length), value: progress.learnedWords.length },
    { icon: '🧩', label: strings.navLevels, value: progress.puzzlesCompleted }
  ];
  return (
    <LinearGradient colors={['#f7f4ff', '#eaf8ff']} style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.header}>
        <BackButton onPress={onBack} variant="dark" label={strings.back} />
        <Text style={styles.title}>{strings.parentArea}</Text>
        <View style={{ width: 42 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🧑‍🧒</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{strings.parentSummary}</Text>
            <Text style={styles.heroSubtitle}>{profileName} · {ageGroup ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.stats}>{stats.map((stat) => <View key={stat.label} style={styles.stat}>
          <Text style={styles.statIcon}>{stat.icon}</Text><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text>
        </View>)}</View>
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>{language === 'hi' ? 'सीखने की प्रगति' : 'Learning progress'}</Text>
          <Text style={styles.note}>{language === 'hi' ? `इस डिवाइस पर ${progress.activitiesCompleted ?? 0} रोमांचक गतिविधियां पूरी हुईं।` : `${progress.activitiesCompleted ?? 0} adventure activities completed on this device.`}</Text>
          <Text style={styles.note}>{language === 'hi' ? 'कोई विज्ञापन, सार्वजनिक प्रोफ़ाइल या रिकॉर्ड की गई आवाज़ नहीं।' : 'No ads, public profiles, or stored voice recordings.'}</Text>
        </View>
        <Pressable style={styles.settingsButton} onPress={onSettings} accessibilityRole="button">
          <Text style={styles.settingsText}>⚙️  {strings.settingsTitle}</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { color: '#3c2d5c', fontSize: 22, fontWeight: '900' },
  content: { gap: 16, paddingBottom: 24 },
  hero: { borderRadius: 26, backgroundColor: '#fff', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroIcon: { fontSize: 46 },
  heroTitle: { color: '#3c2d5c', fontSize: 21, fontWeight: '900' },
  heroSubtitle: { color: '#706887', fontSize: 15, fontWeight: '700', marginTop: 4 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  stat: { width: '48%', minHeight: 120, borderRadius: 23, backgroundColor: '#fff', padding: 14, alignItems: 'center', justifyContent: 'center', gap: 3 },
  statIcon: { fontSize: 25 }, statValue: { color: '#4c3679', fontSize: 24, fontWeight: '900' }, statLabel: { color: '#746b88', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  noteCard: { borderRadius: 24, padding: 18, backgroundColor: '#e2f7eb', gap: 8 },
  noteTitle: { color: '#266749', fontSize: 18, fontWeight: '900' },
  note: { color: '#365d4b', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  settingsButton: { backgroundColor: '#147d78', minHeight: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  settingsText: { color: '#fff', fontSize: 17, fontWeight: '900' }
});
