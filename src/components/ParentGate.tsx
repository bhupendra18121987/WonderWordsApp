import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Language } from '../core/types';
import { t } from '../core/i18n';

export default function ParentGate({ visible, language, onCancel, onUnlock }: {
  visible: boolean; language: Language; onCancel: () => void; onUnlock: () => void;
}) {
  const strings = t(language);
  const [showHint, setShowHint] = useState(false);
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>{strings.parentArea}</Text>
          <Text style={styles.prompt}>{strings.parentPrompt}</Text>
          <View style={styles.answers}>{[18, 21, 24].map((answer) => <Pressable key={answer} onPress={answer === 21 ? onUnlock : () => setShowHint(true)} style={styles.answer}><Text style={styles.answerText}>{answer}</Text></Pressable>)}</View>
          {showHint && <Text style={styles.hint}>{strings.parentTryAgain}</Text>}
          <Pressable onPress={onCancel} accessibilityRole="button"><Text style={styles.cancel}>{strings.confirmCancel}</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,12,46,0.72)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 390, borderRadius: 30, padding: 24, backgroundColor: '#fff', alignItems: 'center', gap: 14 },
  icon: { fontSize: 42 },
  title: { color: '#4c3679', fontSize: 25, fontWeight: '900' },
  prompt: { color: '#342554', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  answers: { flexDirection: 'row', gap: 12 },
  answer: { width: 74, height: 58, borderRadius: 18, backgroundColor: '#f0eaff', alignItems: 'center', justifyContent: 'center' },
  hint: { color: '#956329', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  answerText: { fontSize: 23, fontWeight: '900', color: '#342554' },
  cancel: { color: '#706887', fontSize: 15, fontWeight: '800', padding: 8 }
});
