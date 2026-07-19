import { Pressable, StyleSheet, Text, View } from 'react-native';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

export type NavScreen = 'home' | 'game' | 'review' | 'alphabet';

interface BottomNavProps {
  active: NavScreen | null;
  language: Language;
  learnedCount: number;
  onNavigate: (screen: NavScreen) => void;
  onOpenSettings: () => void;
}

/**
 * Fixed bottom nav bar. Positioned absolutely at the bottom of the App
 * shell so it's always thumb-reachable.
 */
export default function BottomNav({
  active,
  language,
  learnedCount,
  onNavigate,
  onOpenSettings
}: BottomNavProps) {
  const strings = t(language);

  const items = [
    { key: 'home' as const,     icon: '🏠', label: strings.navHome,     disabled: false,               onPress: () => onNavigate('home') },
    { key: 'game' as const,     icon: '🧩', label: strings.navPlay,     disabled: false,               onPress: () => onNavigate('game') },
    { key: 'review' as const,   icon: '📖', label: strings.navWords,    disabled: learnedCount === 0,  onPress: () => onNavigate('review') },
    { key: 'alphabet' as const, icon: '🔤', label: strings.navLetters,  disabled: false,               onPress: () => onNavigate('alphabet') },
    { key: 'settings' as const, icon: '⚙️', label: strings.navSettings, disabled: false,               onPress: onOpenSettings }
  ];

  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <Pressable
            key={item.key}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={item.onPress}
            disabled={item.disabled}
          >
            <Text style={[styles.icon, item.disabled && styles.iconDisabled]}>
              {item.icon}
            </Text>
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
                item.disabled && styles.labelDisabled
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 25,
    flexDirection: 'row',
    gap: 4,
    padding: 8,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,40,90,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 18,
    backgroundColor: 'transparent'
  },
  itemActive: {
    backgroundColor: '#fff2f6'
  },
  icon: {
    fontSize: 24,
    lineHeight: 28
  },
  iconDisabled: { opacity: 0.35 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#55556d'
  },
  labelActive: { color: '#e26a89' },
  labelDisabled: { opacity: 0.35 }
});
