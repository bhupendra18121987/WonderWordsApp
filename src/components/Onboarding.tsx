import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface OnboardingProps {
  visible: boolean;
  language?: Language;
  onDone: () => void;
}

/** 4-step first-run tutorial, bilingual. */
export default function Onboarding({ visible, language = 'en', onDone }: OnboardingProps) {
  const strings = t(language);
  const STEPS = [
    { emoji: '👋', title: strings.onboardStep1Title, text: strings.onboardStep1Text },
    { emoji: '🖱️', title: strings.onboardStep2Title, text: strings.onboardStep2Text },
    { emoji: '🔊', title: strings.onboardStep3Title, text: strings.onboardStep3Text },
    { emoji: '⭐', title: strings.onboardStep4Title, text: strings.onboardStep4Text }
  ];
  const [i, setI] = useState(0);

  if (!visible) return null;

  const step = STEPS[i]!;
  const last = i === STEPS.length - 1;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onDone}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.emoji}>{step.emoji}</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.text}>{step.text}</Text>

          <View style={styles.dots}>
            {STEPS.map((_, j) => (
              <View
                key={j}
                style={[styles.dot, j === i && styles.dotActive]}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            {i > 0 && (
              <Pressable
                style={[styles.btn, styles.btnGhost]}
                onPress={() => setI((v) => v - 1)}
              >
                <Text style={styles.btnGhostText}>{strings.onboardBack}</Text>
              </Pressable>
            )}
            {!last ? (
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => setI((v) => v + 1)}
              >
                <Text style={styles.btnPrimaryText}>{strings.onboardNext}</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => { setI(0); onDone(); }}
              >
                <Text style={styles.btnPrimaryText}>{strings.onboardStart}</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => { setI(0); onDone(); }}
            >
              <Text style={styles.btnGhostText}>{strings.onboardSkip}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,20,55,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 26,
    alignItems: 'center',
    gap: 12,
    maxWidth: 440,
    width: '100%'
  },
  emoji: { fontSize: 76, lineHeight: 88 },
  title: { fontSize: 24, fontWeight: '800', color: '#e26a89', textAlign: 'center' },
  text: {
    fontSize: 15,
    color: '#55556d',
    textAlign: 'center',
    lineHeight: 22
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.15)'
  },
  dotActive: {
    backgroundColor: '#ff8fab'
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    minHeight: 44
  },
  btnPrimary: { backgroundColor: '#ff8fab' },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#e0e0e8' },
  btnGhostText: { color: '#2b2b3d', fontWeight: '800', fontSize: 14 }
});
