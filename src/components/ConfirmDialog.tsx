import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface ConfirmDialogProps {
  open: boolean;
  emoji?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Kid-friendly modal that replaces `Alert.alert` for reset actions.
 * Big bouncing emoji + two colored buttons.
 */
export default function ConfirmDialog({
  open,
  emoji = '🤔',
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  tone = 'primary',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!open) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();
  }, [open, wiggle]);

  if (!open) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Animated.Text
            style={[
              styles.emoji,
              {
                transform: [
                  {
                    rotate: wiggle.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-8deg', '8deg']
                    })
                  }
                ]
              }
            ]}
          >
            {emoji}
          </Animated.Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <Pressable
              style={[
                styles.btn,
                tone === 'danger' ? styles.btnDanger : styles.btnPrimary
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.btnPrimaryText}>✅ {confirmLabel}</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
              <Text style={styles.btnGhostText}>❌ {cancelLabel}</Text>
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
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10
  },
  emoji: { fontSize: 72, lineHeight: 84 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e26a89',
    textAlign: 'center'
  },
  message: {
    fontSize: 15,
    color: '#55556d',
    textAlign: 'center',
    lineHeight: 22
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
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
  btnDanger: { backgroundColor: '#ffcf5c' },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#e0e0e8' },
  btnGhostText: { color: '#2b2b3d', fontWeight: '800', fontSize: 14 }
});
