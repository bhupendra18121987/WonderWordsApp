import type { Progress, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  music: false,
  letterSpeech: true,
  highContrast: false,
  announceLetterType: false,
  highlightVowels: true,
  language: 'en'
};

export const DEFAULT_PROGRESS: Progress = {
  level: 1,
  stars: 0,
  puzzlesCompleted: 0,
  learnedWords: [],
  badges: [],
  lastPlayedLevel: 0
};

export const STORAGE_KEYS = {
  settings: 'ww:settings',
  ageGroup: 'ww:ageGroup',
  progress: 'ww:progress',
  seenOnboarding: 'ww:seenOnboarding',
  /** True once the user has completed the splash → language → age wizard. */
  setupComplete: 'ww:setupComplete'
} as const;
