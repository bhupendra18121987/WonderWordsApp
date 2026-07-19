// Pure mapping from a word to the "scene" that should play behind it.
// Shared with the future mobile app — both platforms decide *what* scene to
// show here; each platform renders it with its own animation library.

export type SceneKey =
  | 'road'          // vehicle drives horizontally on a road
  | 'sky-flying'    // object glides across the sky (birds, planes, rockets)
  | 'water'         // object bobs on gentle waves
  | 'ground'        // object stands on grass under a sun (animals, trees)
  | 'weather-rain'  // raindrops falling from a cloud
  | 'weather-snow'  // snowflakes drifting down
  | 'rainbow'       // rainbow arc with sparkles
  | 'celestial'     // shining star / sun / moon in the sky
  | 'sparkles';     // default: gentle bounce with sparkles floating around

/**
 * A tiny extra hint the renderer can use to vary a scene without changing
 * the whole layout — e.g. hop vs. sway vs. spin within the "ground" scene.
 */
export type SceneMotion = 'hop' | 'sway' | 'spin' | 'bounce' | 'drift';

export interface SceneDescriptor {
  key: SceneKey;
  motion: SceneMotion;
}

// Words that don't fit their category's default scene get pinned here.
const WORD_OVERRIDES: Record<string, SceneDescriptor> = {
  // Nature — special sub-scenes
  SUN:     { key: 'celestial', motion: 'spin' },
  MOON:    { key: 'celestial', motion: 'drift' },
  STAR:    { key: 'celestial', motion: 'bounce' },
  SKY:     { key: 'celestial', motion: 'drift' },
  CLOUD:   { key: 'celestial', motion: 'drift' },
  RAIN:    { key: 'weather-rain', motion: 'drift' },
  SNOW:    { key: 'weather-snow', motion: 'drift' },
  RAINBOW: { key: 'rainbow', motion: 'bounce' },
  TREE:    { key: 'ground', motion: 'sway' },
  FLOWER:  { key: 'ground', motion: 'sway' },
  FOREST:  { key: 'ground', motion: 'sway' },
  SEA:     { key: 'water', motion: 'drift' },
  RIVER:   { key: 'water', motion: 'drift' },

  // Vehicles — pick the medium
  BOAT:    { key: 'water', motion: 'bounce' },
  SHIP:    { key: 'water', motion: 'bounce' },
  PLANE:   { key: 'sky-flying', motion: 'drift' },
  ROCKET:  { key: 'sky-flying', motion: 'drift' },

  // Animals that fly / swim
  BEE:     { key: 'sky-flying', motion: 'drift' },
  BAT:     { key: 'sky-flying', motion: 'drift' },
  FISH:    { key: 'water', motion: 'drift' },
  FROG:    { key: 'ground', motion: 'hop' }
};

export function getScene(entry: { word: string; category?: string }): SceneDescriptor {
  const key = entry.word.toUpperCase();
  if (WORD_OVERRIDES[key]) return WORD_OVERRIDES[key]!;
  switch (entry.category) {
    case 'Vehicles':   return { key: 'road', motion: 'drift' };
    case 'Animals':    return { key: 'ground', motion: 'hop' };
    case 'Birds':      return { key: 'sky-flying', motion: 'drift' };
    case 'Nature':     return { key: 'ground', motion: 'sway' };
    default:           return { key: 'sparkles', motion: 'bounce' };
  }
}
