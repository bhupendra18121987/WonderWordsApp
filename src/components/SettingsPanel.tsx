import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import type { Language, Settings } from '../core/types';
import { LANGUAGE_CONFIG } from '../core/languages';

interface SettingsPanelProps {
  open: boolean;
  settings: Settings;
  onChange: (next: Settings) => void;
  onClose: () => void;
  onReset: () => void;
  onResetScores: () => void;
}

interface ToggleRowProps {
  emoji: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function ToggleRow({ emoji, label, checked, onChange }: ToggleRowProps) {
  return (
    <Pressable
      style={[styles.toggle, checked ? styles.toggleOn : styles.toggleOff]}
      onPress={() => onChange(!checked)}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
    >
      <View style={styles.toggleLabel}>
        <Text style={styles.toggleEmoji}>{emoji}</Text>
        <Text style={[styles.toggleText, !checked && styles.toggleTextOff]} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <View style={[styles.badge, checked ? styles.badgeOn : styles.badgeOff]}>
        <Text style={[styles.badgeText, checked ? styles.badgeTextOn : styles.badgeTextOff]}>
          {checked ? '✓ ON' : 'OFF'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SettingsPanel({
  open,
  settings,
  onChange,
  onClose,
  onReset,
  onResetScores
}: SettingsPanelProps) {
  const update = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });
  const languages = Object.entries(LANGUAGE_CONFIG) as [Language, typeof LANGUAGE_CONFIG[Language]][];

  if (!open) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>×</Text>
            </Pressable>
          </View>

          {/* Scrollable content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            {/* Language */}
            <View style={styles.group}>
              <Text style={styles.groupTitle}>🌐 Language</Text>
              <View style={styles.langRow}>
                {languages.map(([key, cfg]) => (
                  <Pressable
                    key={key}
                    style={[
                      styles.langBtn,
                      settings.language === key && styles.langBtnActive
                    ]}
                    onPress={() => update({ language: key })}
                  >
                    <Text
                      style={[
                        styles.langBtnText,
                        settings.language === key && styles.langBtnTextActive
                      ]}
                    >
                      {cfg.displayName}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.group}>
              <ToggleRow
                emoji="🔊"
                label="Voice & sound effects"
                checked={settings.sound}
                onChange={(v) => update({ sound: v })}
              />
              <ToggleRow
                emoji="🗣️"
                label="Say letters when I drag"
                checked={settings.letterSpeech}
                onChange={(v) => update({ letterSpeech: v })}
              />
              <ToggleRow
                emoji="🔤"
                label={'Announce "vowel" / "consonant"'}
                checked={settings.announceLetterType}
                onChange={(v) => update({ announceLetterType: v })}
              />
              <ToggleRow
                emoji="🌸"
                label="Highlight vowels in the puzzle"
                checked={settings.highlightVowels}
                onChange={(v) => update({ highlightVowels: v })}
              />
              <ToggleRow
                emoji="🌈"
                label="High-contrast colors"
                checked={settings.highContrast}
                onChange={(v) => update({ highContrast: v })}
              />
            </View>
          </ScrollView>

          {/* Sticky footer */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Pressable style={[styles.footerBtn, styles.footerBtnPrimary]} onPress={onClose}>
                <Text style={styles.footerBtnPrimaryText}>Done</Text>
              </Pressable>
              <Pressable style={[styles.footerBtn, styles.footerBtnGhost]} onPress={onResetScores}>
                <Text style={styles.footerBtnGhostText}>Reset scores</Text>
              </Pressable>
              <Pressable style={[styles.footerBtn, styles.footerBtnGhost]} onPress={onReset}>
                <Text style={styles.footerBtnGhostText}>Reset all</Text>
              </Pressable>
            </View>
            <Text style={styles.hint}>
              "Reset scores" keeps learned words &amp; badges. "Reset all" clears everything.
            </Text>
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
    padding: 16
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 28,
    maxWidth: 460,
    width: '100%',
    maxHeight: '92%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60,40,90,0.08)'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e26a89'
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(60,40,90,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: { fontSize: 20, color: '#2b2b3d', fontWeight: '800' },

  content: { flex: 1 },
  contentInner: { padding: 16, gap: 14 },

  group: { gap: 8 },
  groupTitle: { fontSize: 15, fontWeight: '800', color: '#e26a89' },

  langRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  langBtn: {
    flex: 1,
    minWidth: 110,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#f0f0f5',
    alignItems: 'center'
  },
  langBtnActive: {
    backgroundColor: '#ff8fab'
  },
  langBtnText: { fontWeight: '800', color: '#2b2b3d', fontSize: 15 },
  langBtnTextActive: { color: '#fff' },

  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  toggleOn: {
    backgroundColor: '#fff2f6',
    borderColor: '#ff8fab88'
  },
  toggleOff: {
    backgroundColor: '#ececf1',
    opacity: 0.9
  },
  toggleLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8
  },
  toggleEmoji: { fontSize: 20 },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2b2b3d',
    flexShrink: 1
  },
  toggleTextOff: { color: '#7a7a8a' },
  badge: {
    minWidth: 56,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: 'center'
  },
  badgeOn: { backgroundColor: '#58c896' },
  badgeOff: { backgroundColor: '#d5d5e0' },
  badgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  badgeTextOn: { color: '#fff' },
  badgeTextOff: { color: '#6a6a80' },

  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,40,90,0.08)',
    gap: 6
  },
  footerRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  footerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    minHeight: 40
  },
  footerBtnPrimary: { backgroundColor: '#ff8fab' },
  footerBtnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  footerBtnGhost: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#e0e0e8' },
  footerBtnGhostText: { color: '#2b2b3d', fontWeight: '800', fontSize: 12 },
  hint: {
    fontSize: 11,
    color: '#55556d',
    textAlign: 'center',
    lineHeight: 15
  }
});
