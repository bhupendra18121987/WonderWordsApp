import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import { getWordsData } from '../core/data';
import { t } from '../core/i18n';
import { PROFILE_AVATAR_OPTIONS } from '../core/constants';
import { colors, radii, shadow } from '../core/theme';
import type { AgeGroupKey, Language, Progress } from '../core/types';

interface ProfileScreenProps {
  ageGroup: AgeGroupKey | null;
  language: Language;
  progress: Progress;
  profileName: string;
  profileAvatar: string;
  onProfileNameChange: (name: string) => void;
  onProfileAvatarChange: (avatar: string) => void;
  onBack: () => void;
  onChangeAge: () => void;
}

export default function ProfileScreen({
  ageGroup,
  language,
  progress,
  profileName,
  profileAvatar,
  onProfileNameChange,
  onProfileAvatarChange,
  onBack,
  onChangeAge
}: ProfileScreenProps) {
  const strings = t(language);
  const insets = useSafeAreaInsets();
  const wordsData = getWordsData(language);
  const group = ageGroup ? wordsData.ageGroups[ageGroup] : null;
  const points = progress.stars * 10 + progress.puzzlesCompleted * 20;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profileName);
  const [picking, setPicking] = useState(false);

  const commitName = () => {
    const val = draft.trim() || profileName;
    onProfileNameChange(val);
    setDraft(val);
    setEditing(false);
  };

  return (
    <LinearGradient
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: 130 + insets.bottom }]}
    >
      <View style={styles.topbar}>
        <BackButton onPress={onBack} variant="light" />
        <Text style={styles.topTitle}>My Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{profileAvatar}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setPicking(true)}
            style={({ pressed }) => [styles.cameraBtn, pressed && { transform: [{ scale: 0.94 }] }]}
            accessibilityRole="button"
            accessibilityLabel="Change avatar"
          >
            <Text style={styles.cameraIcon}>📷</Text>
          </Pressable>
        </View>

        {editing ? (
          <View style={styles.nameEditor}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onBlur={commitName}
              onSubmitEditing={commitName}
              autoFocus
              style={styles.nameInput}
              placeholderTextColor="rgba(255,255,255,0.55)"
              maxLength={24}
            />
            <Pressable onPress={commitName} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>✓</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => { setDraft(profileName); setEditing(true); }}
            style={({ pressed }) => [styles.nameRow, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.name}>{profileName}</Text>
            <Text style={styles.pencil}>✎</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onChangeAge}
          style={({ pressed }) => [styles.ageChip, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.ageChipText}>
            {strings.navAge} · {group?.label ?? '—'}   ✎
          </Text>
        </Pressable>

        <View style={styles.statsGrid}>
          <StatCard icon="🎯" label="Levels" value={String(progress.level)} tint="#c9b4ff" />
          <StatCard icon="⭐" label="Total Stars" value={String(progress.stars)} tint="#ffe58a" />
          <StatCard icon="💎" label="Points" value={String(points)} tint="#8ed2ff" />
          <StatCard icon="📚" label="Words Found" value={String(progress.learnedWords.length)} tint="#b8f597" />
        </View>
      </ScrollView>

      <Modal transparent visible={picking} animationType="fade" onRequestClose={() => setPicking(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPicking(false)}>
          <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.pickerTitle}>Choose your avatar</Text>
            <View style={styles.pickerGrid}>
              {PROFILE_AVATAR_OPTIONS.map((emoji) => {
                const selected = emoji === profileAvatar;
                return (
                  <Pressable
                    key={emoji}
                    onPress={() => { onProfileAvatarChange(emoji); setPicking(false); }}
                    style={[styles.pickerCell, selected && styles.pickerCellSelected]}
                  >
                    <Text style={styles.pickerEmoji}>{emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

interface StatCardProps { icon: string; label: string; value: string; tint: string }

function StatCard({ icon, label, value, tint }: StatCardProps) {
  return (
    <View style={[styles.stat, { backgroundColor: tint }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statRow}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topTitle: {
    color: '#fff', fontSize: 20, fontWeight: '900',
    textShadowColor: 'rgba(30,15,110,0.35)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0
  },
  body: { alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 20 },
  avatarWrap: { position: 'relative' },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 3,
    borderColor: '#fff'
  },
  avatar: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    ...shadow.soft
  },
  avatarEmoji: { fontSize: 72 },
  cameraBtn: {
    position: 'absolute',
    bottom: 4, right: 4,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#ffd23c',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
    ...shadow.soft
  },
  cameraIcon: { fontSize: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  name: { fontSize: 22, fontWeight: '900', color: '#fff' },
  pencil: { fontSize: 16, color: 'rgba(255,255,255,0.85)' },
  nameEditor: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  nameInput: {
    minWidth: 180,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.pill,
    paddingHorizontal: 16, paddingVertical: 8,
    color: '#fff', fontSize: 20, fontWeight: '900',
    borderWidth: 2, borderColor: '#fff'
  },
  saveBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#3ecf5c', alignItems: 'center', justifyContent: 'center'
  },
  saveBtnText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  ageChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.pill,
    paddingHorizontal: 16, paddingVertical: 8,
    marginTop: 4
  },
  ageChipText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  statsGrid: {
    marginTop: 8,
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    width: '100%'
  },
  stat: {
    width: '47%',
    borderRadius: radii.md,
    padding: 14,
    gap: 6,
    ...shadow.soft
  },
  statLabel: { fontSize: 12, fontWeight: '800', color: '#1e1b4b', opacity: 0.75 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#1e1b4b' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(30,15,110,0.55)',
    alignItems: 'center', justifyContent: 'center', padding: 20
  },
  pickerCard: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    padding: 18,
    width: '100%',
    maxWidth: 360,
    ...shadow.card
  },
  pickerTitle: { fontSize: 16, fontWeight: '900', color: '#1e1b4b', textAlign: 'center', marginBottom: 12 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  pickerCell: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#f5f0ff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent'
  },
  pickerCellSelected: { borderColor: '#7c3aed', backgroundColor: '#e9e2ff' },
  pickerEmoji: { fontSize: 30 }
});

void colors;
