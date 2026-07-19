import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../core/i18n';
import { colors, radii, shadow } from '../core/theme';
import type { Language } from '../core/types';

export type NavScreen = 'home' | 'levels' | 'rewards' | 'age' | 'profile';

interface BottomNavProps {
  active: NavScreen | null;
  language: Language;
  onNavigate: (screen: NavScreen) => void;
  /** Settings gear opens the modal. Kept out of the tab bar for parity with the reference (gear lives in the TopBar). */
  onOpenSettings?: () => void;
}

/**
 * Reference-style bottom nav: white bar with a pill-shaped highlight on
 * the active tab. Four tabs: Home / Levels / Rewards / Profile.
 * A separate hidden control opens Settings from the TopBar gear.
 */
export default function BottomNav({ active, language, onNavigate }: BottomNavProps) {
  const strings = t(language);
  const insets = useSafeAreaInsets();

  const items: { key: NavScreen; icon: string; label: string }[] = [
    { key: 'home',    icon: '🏠', label: strings.navHome    },
    { key: 'levels',  icon: '🗺️', label: strings.navLevels  },
    { key: 'rewards', icon: '🏆', label: strings.navRewards },
    { key: 'age',     icon: '🎂', label: strings.navAge     },
    { key: 'profile', icon: '👤', label: strings.navProfile }
  ];

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(10, insets.bottom + 6) }]}>
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.item,
              isActive && styles.itemActive,
              pressed && styles.itemPressed
            ]}
            onPress={() => onNavigate(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {item.icon}
            </Text>
            <Text
              style={[styles.label, isActive && styles.labelActive]}
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
    left: 12,
    right: 12,
    bottom: 10,
    zIndex: 25,
    flexDirection: 'row',
    gap: 4,
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radii.md,
    backgroundColor: 'transparent'
  },
  itemActive: {
    backgroundColor: colors.primarySoft
  },
  itemPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85
  },
  icon: { fontSize: 22, lineHeight: 26 },
  iconActive: { transform: [{ scale: 1.15 }] },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.inkSoft
  },
  labelActive: {
    color: colors.primary
  }
});
