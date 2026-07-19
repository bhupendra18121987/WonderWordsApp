// Typed re-exports of the JSON data bundles. Both web and mobile import
// from here. `wordsData` / `rewardsData` return English by default (used for
// bootstrap). Use `getWordsData(lang)` / `getRewardsData(lang)` when the
// active language is known.
import wordsEn from './data/words.json';
import wordsHi from './data/words.hi.json';
import rewardsEn from './data/rewards.json';
import rewardsHi from './data/rewards.hi.json';
import type {
  AgeGroupKey,
  Language,
  RewardsData,
  WordEntry,
  WordsData
} from './types';

export const wordsData: WordsData = wordsEn as WordsData;
export const rewardsData: RewardsData = rewardsEn as RewardsData;

const WORDS_BY_LANG: Record<Language, WordsData> = {
  en: wordsEn as WordsData,
  hi: wordsHi as WordsData
};

const REWARDS_BY_LANG: Record<Language, RewardsData> = {
  en: rewardsEn as RewardsData,
  hi: rewardsHi as RewardsData
};

export function getWordsData(lang: Language): WordsData {
  return WORDS_BY_LANG[lang] ?? WORDS_BY_LANG.en;
}

export function getRewardsData(lang: Language): RewardsData {
  return REWARDS_BY_LANG[lang] ?? REWARDS_BY_LANG.en;
}

export const ageGroupKeys: AgeGroupKey[] = Object.keys(
  wordsData.ageGroups
) as AgeGroupKey[];

export const allWords: WordEntry[] = wordsData.words;

export function getAllWords(lang: Language): WordEntry[] {
  return getWordsData(lang).words;
}
