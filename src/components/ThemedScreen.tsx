import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import { radii, shadow } from '../core/theme';

interface ThemedScreenProps {
  title: string;
  titleIcon?: ReactNode;
  onBack?: () => void;
  headerRight?: ReactNode;
  children: ReactNode;
  /** When true, wraps content in a ScrollView. Default: true. */
  scroll?: boolean;
  /** Extra bottom padding for content so BottomNav doesn't cover it. */
  contentBottomPadding?: number;
}

/**
 * Mobile shell used by the themed inner screens (mini games, alphabet,
 * mini-games hub, rewards, profile). Matches the web `ThemedScreen`:
 * purple gradient full-bleed, back button + title bar, white content card.
 */
export default function ThemedScreen({
  title,
  titleIcon,
  onBack,
  headerRight,
  children,
  scroll = true,
  contentBottomPadding = 120
}: ThemedScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#8a4ff0', '#6b2fd5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.topbar}>
        <View style={styles.side}>
          {onBack ? <BackButton onPress={onBack} variant="light" /> : null}
        </View>
        <View style={styles.titleWrap}>
          {titleIcon}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={[styles.side, styles.sideRight]}>{headerRight}</View>
      </View>

      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.card, { paddingBottom: contentBottomPadding + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.card, styles.cardNoScroll, { paddingBottom: contentBottomPadding + insets.bottom }]}>
          {children}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8
  },
  side: { minWidth: 44, alignItems: 'flex-start' },
  sideRight: { alignItems: 'flex-end' },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(30,15,110,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    padding: 16,
    gap: 12,
    ...shadow.card
  },
  cardNoScroll: { flex: 1 }
});
