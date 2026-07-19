import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadow } from '../core/theme';

interface TopBarProps {
  /** Total stars/points displayed in the yellow chip on the left. */
  stars: number;
  /** Optional handler for the star chip (jump to Rewards). */
  onStarsPress?: () => void;
  /** Opens Settings modal. */
  onOpenSettings: () => void;
  /** Optional handler that opens the onboarding tour. */
  onOpenTour?: () => void;
}

/**
 * Reference-style header:
 *   - Yellow rounded pill on the left with a star icon + point count
 *   - Gear icon on the right in a violet circle
 * Absolutely positioned; safe-area aware.
 */
export default function TopBar({ stars, onStarsPress, onOpenSettings, onOpenTour }: TopBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
      <Pressable
        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        onPress={onStarsPress}
        accessibilityRole="button"
        accessibilityLabel={`${stars} stars`}
      >
        <Text style={styles.chipStar}>⭐</Text>
        <Text style={styles.chipText}>{stars}</Text>
      </Pressable>

      <View style={styles.actions}>
        {onOpenTour ? (
          <Pressable
            style={({ pressed }) => [styles.gear, styles.tour, pressed && styles.pressed]}
            onPress={onOpenTour}
            accessibilityRole="button"
            accessibilityLabel="Tour"
          >
            <Text style={styles.gearIcon}>🎬</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.gear, pressed && styles.pressed]}
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Text style={styles.gearIcon}>⚙️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    ...shadow.cta
  },
  actions: { flexDirection: 'row', gap: 8 },
  tour: { backgroundColor: '#ffd23c' },
  chipStar: { fontSize: 18 },
  chipText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.onAccent
  },
  gear: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card
  },
  gearIcon: { fontSize: 22, color: colors.onPrimary },
  pressed: { transform: [{ scale: 0.94 }], opacity: 0.9 }
});
