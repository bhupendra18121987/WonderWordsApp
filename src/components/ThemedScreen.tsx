import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';
import BackButton from './BackButton';
import { colors, radii } from '../core/theme';

interface ThemedScreenProps {
  title?: string;
  titleIcon?: ReactNode;
  headerRight?: ReactNode;
  onBack?: () => void;
  showGrass?: boolean;
  /** Reserve space at the bottom for the app's fixed BottomNav. */
  bottomNavSpacing?: boolean;
  /** Toggle ScrollView so long content is scrollable inside the card. */
  scrollable?: boolean;
  children: ReactNode;
}

/**
 * Reusable purple-gradient shell that gives every secondary screen the same
 * look: back button + centered title + white content card + green grass strip.
 * Mirrors the web `ThemedScreen` component.
 */
export default function ThemedScreen({
  title,
  titleIcon,
  headerRight,
  onBack,
  showGrass = true,
  bottomNavSpacing = true,
  scrollable = true,
  children
}: ThemedScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <View style={[styles.topbar, { paddingTop: insets.top + 12 }]}>
        {onBack ? (
          <BackButton onPress={onBack} variant="light" />
        ) : (
          <View style={styles.spacer} />
        )}

        <View style={styles.titleWrap}>
          {titleIcon ? <View style={styles.titleIcon}>{titleIcon}</View> : null}
          {title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>

        <View style={styles.right}>{headerRight}</View>
      </View>

      <View
        style={[
          styles.card,
          { marginBottom: bottomNavSpacing ? insets.bottom + 96 : insets.bottom + 12 }
        ]}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.cardScroll}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.cardScroll}>{children}</View>
        )}
      </View>

      {showGrass && (
        <View
          style={[
            styles.grass,
            { bottom: bottomNavSpacing ? insets.bottom + 86 : insets.bottom + 2 }
          ]}
          pointerEvents="none"
        >
          <Svg width="100%" height="100%" viewBox="0 0 400 40" preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="gg-fill" x1="50%" y1="0%" x2="50%" y2="100%">
                <Stop offset="0%" stopColor="#c7f85f" />
                <Stop offset="100%" stopColor="#7ecb32" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M-10 20 C60 0 140 0 200 16 C260 0 340 0 410 20 L410 40 L-10 40 Z"
              fill="url(#gg-fill)"
            />
          </Svg>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8
  },
  spacer: { width: 42, height: 42 },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 0
  },
  titleIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
    flexShrink: 1
  },
  right: {
    minWidth: 42,
    minHeight: 42,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  card: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: 26,
    marginHorizontal: 12,
    marginTop: 0,
    overflow: 'hidden',
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 8
  },
  cardScroll: {
    padding: 16,
    paddingBottom: 24,
    gap: 12
  },
  grass: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40,
    zIndex: 0
  }
});

export const themedTopbarMetaChip = StyleSheet.create({
  meta: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  metaText: { color: '#fff', fontWeight: '800', fontSize: 12 }
});
