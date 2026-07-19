// Shared design tokens for the WonderWords mobile app.
// Kept in one place so the whole UI shifts together when we tune the theme.
// Matches the "violet + cream + yellow" kid-friendly design language.

export const colors = {
  // Primary — playful violet, used for buttons, banners, headers.
  primary: '#7c3aed',       // violet-600
  primaryDark: '#6d28d9',   // violet-700
  primaryLight: '#a78bfa',  // violet-400
  primarySoft: '#ede9fe',   // violet-100 (backgrounds)

  // Accents.
  accent: '#fbbf24',        // yellow-400 — CTA / stars
  accentDark: '#f59e0b',    // yellow-500
  accentSoft: '#fef3c7',    // yellow-100
  coin: '#fcd34d',          // slightly deeper for coin chips

  // Semantic.
  success: '#10b981',
  danger: '#ef4b6b',
  info: '#38bdf8',

  // Surfaces.
  bg: '#f3f0ff',            // page background (lavender-cream)
  bgSoft: '#faf7ff',        // elevated surface tint
  paper: '#ffffff',         // card body
  border: '#e5e5f0',        // hairline card border

  // Text.
  ink: '#1e1b4b',           // primary body text (indigo-950)
  inkSoft: '#6b7280',       // secondary text
  inkMuted: '#9ca3af',      // hint text
  onPrimary: '#ffffff',     // text sitting on primary color
  onAccent: '#1e1b4b',      // dark text on yellow

  // Palette used for age-select / animal tiles + word-search cells.
  tileGreen: '#a7f3d0',
  tileYellow: '#fde68a',
  tileBlue: '#bfdbfe',
  tilePink: '#fbcfe8',
  tilePurple: '#ddd6fe',
  tileOrange: '#fed7aa'
} as const;

export const radii = {
  xs: 8,
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

export const shadow = {
  // Consistent purple-tinted shadow so it doesn't fight the theme.
  soft: {
    shadowColor: '#4c1d95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3
  },
  card: {
    shadowColor: '#4c1d95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6
  },
  cta: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6
  }
} as const;

export const typography = {
  h1: { fontSize: 30, fontWeight: '900' as const, color: colors.ink },
  h2: { fontSize: 22, fontWeight: '900' as const, color: colors.ink },
  h3: { fontSize: 17, fontWeight: '800' as const, color: colors.ink },
  body: { fontSize: 15, fontWeight: '600' as const, color: colors.ink },
  small: { fontSize: 12, fontWeight: '700' as const, color: colors.inkSoft }
} as const;
