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
import { t } from '../core/i18n';

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
  onLabel: string;
  offLabel: string;
  onChange: (next: boolean) => void;
}

function ToggleRow({ emoji, label, checked, onLabel, offLabel, onChange }: ToggleRowProps) {
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
          {checked ? onLabel : offLabel}
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
  const strings = t(settings.language);
  const activeCfg = LANGUAGE_CONFIG[settings.language];

  if (!open) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{strings.settingsTitle}</Text>
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
              <Text style={styles.groupTitle}>{strings.settingsLangGroup}</Text>
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
                label={strings.toggleSound}
                checked={settings.sound}
                onLabel={strings.badgeOn}
                offLabel={strings.badgeOff}
                onChange={(v) => update({ sound: v })}
              />
              <ToggleRow
                emoji="🗣️"
                label={strings.toggleLetterSpeech}
                checked={settings.letterSpeech}
                onLabel={strings.badgeOn}
                offLabel={strings.badgeOff}
                onChange={(v) => update({ letterSpeech: v })}
              />
              <ToggleRow
                emoji="🔤"
                label={strings.toggleAnnounceLetterType(activeCfg.vowelLabel, activeCfg.consonantLabel)}
                checked={settings.announceLetterType}
                onLabel={strings.badgeOn}
                offLabel={strings.badgeOff}
                onChange={(v) => update({ announceLetterType: v })}
              />
              <ToggleRow
                emoji="🌸"
                label={strings.toggleHighlightVowels}
                checked={settings.highlightVowels}
                onLabel={strings.badgeOn}
                offLabel={strings.badgeOff}
                onChange={(v) => update({ highlightVowels: v })}
              />
              <ToggleRow
                emoji="🌈"
                label={strings.toggleHighContrast}
                checked={settings.highContrast}
                onLabel={strings.badgeOn}
                offLabel={strings.badgeOff}
                onChange={(v) => update({ highContrast: v })}
              />
            </View>
          </ScrollView>

          {/* Sticky footer */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Pressable style={[styles.footerBtn, styles.footerBtnPrimary]} onPress={onClose}>
                <Text style={styles.footerBtnPrimaryText}>{strings.settingsDone}</Text>
              </Pressable>
              <Pressable style={[styles.footerBtn, styles.footerBtnGhost]} onPress={onResetScores}>
                <Text style={styles.footerBtnGhostText}>{strings.settingsResetScores}</Text>
              </Pressable>
              <Pressable style={[styles.footerBtn, styles.footerBtnGhost]} onPress={onReset}>
                <Text style={styles.footerBtnGhostText}>{strings.settingsResetAll}</Text>
              </Pressable>
            </View>
            <Text style={styles.hint}>{strings.settingsHint}</Text>
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
    backgroundColor: '#ffffff',
    borderRadius: 28,
    maxWidth: 460,
    width: '100%',
    maxHeight: '92%',
    // flexShrink lets the card cap at maxHeight while still
    // giving its children (the ScrollView) a bounded height to
    // measure against. Without this, Android release builds
    // render the ScrollView at height 0 and the modal looks blank.
    flexShrink: 1,
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
    color: '#6d28d9'
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(60,40,90,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: { fontSize: 20, color: '#1e1b4b', fontWeight: '800' },

  // flexShrink (not flex:1) so the ScrollView shrinks to the space
  // between header and footer within the modal's maxHeight cap.
  content: { flexShrink: 1 },
  contentInner: { padding: 16, gap: 14 },

  group: { gap: 8 },
  groupTitle: { fontSize: 15, fontWeight: '800', color: '#6d28d9' },

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
    backgroundColor: '#faf7ff',
    alignItems: 'center'
  },
  langBtnActive: {
    backgroundColor: '#7c3aed'
  },
  langBtnText: { fontWeight: '800', color: '#1e1b4b', fontSize: 15 },
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
    backgroundColor: '#ede9fe',
    borderColor: '#ff8fab88'
  },
  toggleOff: {
    backgroundColor: '#faf7ff',
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
    color: '#1e1b4b',
    flexShrink: 1
  },
  toggleTextOff: { color: '#8b7ea8' },
  badge: {
    minWidth: 56,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: 'center'
  },
  badgeOn: { backgroundColor: '#58c896' },
  badgeOff: { backgroundColor: '#e5e5f0' },
  badgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  badgeTextOn: { color: '#fff' },
  badgeTextOff: { color: '#8b7ea8' },

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
  footerBtnPrimary: { backgroundColor: '#7c3aed' },
  footerBtnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  footerBtnGhost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  footerBtnGhostText: { color: '#1e1b4b', fontWeight: '800', fontSize: 12 },
  hint: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 15
  }
});
