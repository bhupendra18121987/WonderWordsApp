// Per-language alphabet with example words + emojis, plus Hindi-specific
// barahkhadi (matra) data. Shared with the future mobile app.

import type { Language } from '../types';

export interface LetterExample {
  /** The letter or akshara itself, e.g. "A" or "क". */
  letter: string;
  /** Roman transliteration, e.g. "ka" — optional helper for parents. */
  transliteration?: string;
  /** Example word starting with this letter, e.g. "कबूतर". */
  exampleWord?: string;
  /** Roman spelling of the example word, e.g. "kabootar". */
  exampleTrans?: string;
  /** Emoji illustrating the example word. */
  emoji?: string;
}

export interface Matra {
  /** Display name for the matra (its independent-vowel form). */
  label: string;
  /** Roman transliteration for parents ("a", "aa", ...). */
  transliteration: string;
  /** The Unicode combining sign appended to the consonant. Empty for "a". */
  sign: string;
}

export interface AlphabetEntry {
  vowels: LetterExample[];
  consonants: LetterExample[];
  /** True when a barahkhadi (consonant × vowel) chart makes sense. */
  hasBarahkhadi: boolean;
  matras?: Matra[];
}

// Twelve barahkhadi matras in the traditional order:
// अ आ इ ई उ ऊ ए ऐ ओ औ अं अः
const HI_MATRAS: Matra[] = [
  { label: 'अ',  transliteration: 'a',  sign: '' },
  { label: 'आ',  transliteration: 'aa', sign: '\u093E' },  // ा
  { label: 'इ',  transliteration: 'i',  sign: '\u093F' },  // ि
  { label: 'ई',  transliteration: 'ee', sign: '\u0940' },  // ी
  { label: 'उ',  transliteration: 'u',  sign: '\u0941' },  // ु
  { label: 'ऊ',  transliteration: 'oo', sign: '\u0942' },  // ू
  { label: 'ए',  transliteration: 'e',  sign: '\u0947' },  // े
  { label: 'ऐ',  transliteration: 'ai', sign: '\u0948' },  // ै
  { label: 'ओ',  transliteration: 'o',  sign: '\u094B' },  // ो
  { label: 'औ',  transliteration: 'au', sign: '\u094C' },  // ौ
  { label: 'अं', transliteration: 'an', sign: '\u0902' },  // ं (anusvara)
  { label: 'अः', transliteration: 'ah', sign: '\u0903' }   // ः (visarga)
];

export const LETTER_EXAMPLES: Record<Language, AlphabetEntry> = {
  en: {
    hasBarahkhadi: false,
    vowels: [
      { letter: 'A', exampleWord: 'Apple',      emoji: '🍎' },
      { letter: 'E', exampleWord: 'Egg',        emoji: '🥚' },
      { letter: 'I', exampleWord: 'Ice-cream',  emoji: '🍦' },
      { letter: 'O', exampleWord: 'Orange',     emoji: '🍊' },
      { letter: 'U', exampleWord: 'Umbrella',   emoji: '☂️' }
    ],
    consonants: [
      { letter: 'B', exampleWord: 'Ball',    emoji: '⚽' },
      { letter: 'C', exampleWord: 'Cat',     emoji: '🐱' },
      { letter: 'D', exampleWord: 'Dog',     emoji: '🐶' },
      { letter: 'F', exampleWord: 'Fish',    emoji: '🐟' },
      { letter: 'G', exampleWord: 'Grapes',  emoji: '🍇' },
      { letter: 'H', exampleWord: 'Hat',     emoji: '🎩' },
      { letter: 'J', exampleWord: 'Jug',     emoji: '🫗' },
      { letter: 'K', exampleWord: 'Kite',    emoji: '🪁' },
      { letter: 'L', exampleWord: 'Lion',    emoji: '🦁' },
      { letter: 'M', exampleWord: 'Moon',    emoji: '🌙' },
      { letter: 'N', exampleWord: 'Nest',    emoji: '🪺' },
      { letter: 'P', exampleWord: 'Pig',     emoji: '🐷' },
      { letter: 'Q', exampleWord: 'Queen',   emoji: '👸' },
      { letter: 'R', exampleWord: 'Rabbit',  emoji: '🐇' },
      { letter: 'S', exampleWord: 'Sun',     emoji: '☀️' },
      { letter: 'T', exampleWord: 'Tree',    emoji: '🌳' },
      { letter: 'V', exampleWord: 'Van',     emoji: '🚐' },
      { letter: 'W', exampleWord: 'Whale',   emoji: '🐳' },
      { letter: 'X', exampleWord: 'X-ray',   emoji: '🩻' },
      { letter: 'Y', exampleWord: 'Yak',     emoji: '🐃' },
      { letter: 'Z', exampleWord: 'Zebra',   emoji: '🦓' }
    ]
  },
  hi: {
    hasBarahkhadi: true,
    matras: HI_MATRAS,
    vowels: [
      { letter: 'अ',  transliteration: 'a',  exampleWord: 'अनार',   exampleTrans: 'anaar',  emoji: '🍎' },
      { letter: 'आ',  transliteration: 'aa', exampleWord: 'आम',     exampleTrans: 'aam',    emoji: '🥭' },
      { letter: 'इ',  transliteration: 'i',  exampleWord: 'इमली',   exampleTrans: 'imli',   emoji: '🌿' },
      { letter: 'ई',  transliteration: 'ee', exampleWord: 'ईख',     exampleTrans: 'eekh',   emoji: '🎋' },
      { letter: 'उ',  transliteration: 'u',  exampleWord: 'उल्लू',  exampleTrans: 'ullu',   emoji: '🦉' },
      { letter: 'ऊ',  transliteration: 'oo', exampleWord: 'ऊँट',    exampleTrans: 'oont',   emoji: '🐫' },
      { letter: 'ऋ',  transliteration: 'ri', exampleWord: 'ऋषि',    exampleTrans: 'rishi',  emoji: '🧘' },
      { letter: 'ए',  transliteration: 'e',  exampleWord: 'एड़ी',   exampleTrans: 'edi',    emoji: '🦶' },
      { letter: 'ऐ',  transliteration: 'ai', exampleWord: 'ऐनक',    exampleTrans: 'ainak',  emoji: '👓' },
      { letter: 'ओ',  transliteration: 'o',  exampleWord: 'ओखली',   exampleTrans: 'okhli',  emoji: '🥣' },
      { letter: 'औ',  transliteration: 'au', exampleWord: 'औरत',    exampleTrans: 'aurat',  emoji: '👩' }
    ],
    consonants: [
      { letter: 'क',  transliteration: 'ka',   exampleWord: 'कबूतर',  exampleTrans: 'kabootar', emoji: '🕊️' },
      { letter: 'ख',  transliteration: 'kha',  exampleWord: 'खरगोश',  exampleTrans: 'khargosh', emoji: '🐇' },
      { letter: 'ग',  transliteration: 'ga',   exampleWord: 'गाय',    exampleTrans: 'gaay',     emoji: '🐄' },
      { letter: 'घ',  transliteration: 'gha',  exampleWord: 'घर',     exampleTrans: 'ghar',     emoji: '🏠' },
      { letter: 'ङ',  transliteration: 'nga' },
      { letter: 'च',  transliteration: 'cha',  exampleWord: 'चम्मच',  exampleTrans: 'chammach', emoji: '🥄' },
      { letter: 'छ',  transliteration: 'chha', exampleWord: 'छाता',   exampleTrans: 'chaata',   emoji: '☂️' },
      { letter: 'ज',  transliteration: 'ja',   exampleWord: 'जहाज',   exampleTrans: 'jahaaz',   emoji: '🚢' },
      { letter: 'झ',  transliteration: 'jha',  exampleWord: 'झंडा',   exampleTrans: 'jhanda',   emoji: '🚩' },
      { letter: 'ञ',  transliteration: 'nya' },
      { letter: 'ट',  transliteration: 'ta',   exampleWord: 'टमाटर',  exampleTrans: 'tamatar',  emoji: '🍅' },
      { letter: 'ठ',  transliteration: 'tha',  exampleWord: 'ठेला',   exampleTrans: 'thela',    emoji: '🛒' },
      { letter: 'ड',  transliteration: 'da',   exampleWord: 'डमरू',   exampleTrans: 'damroo',   emoji: '🪘' },
      { letter: 'ढ',  transliteration: 'dha',  exampleWord: 'ढोल',    exampleTrans: 'dhol',     emoji: '🥁' },
      { letter: 'ण',  transliteration: 'na' },
      { letter: 'त',  transliteration: 'ta',   exampleWord: 'तितली',  exampleTrans: 'titli',    emoji: '🦋' },
      { letter: 'थ',  transliteration: 'tha',  exampleWord: 'थाली',   exampleTrans: 'thaali',   emoji: '🍽️' },
      { letter: 'द',  transliteration: 'da',   exampleWord: 'दरवाजा', exampleTrans: 'darwaza',  emoji: '🚪' },
      { letter: 'ध',  transliteration: 'dha',  exampleWord: 'धनुष',   exampleTrans: 'dhanush',  emoji: '🏹' },
      { letter: 'न',  transliteration: 'na',   exampleWord: 'नाव',    exampleTrans: 'naav',     emoji: '⛵' },
      { letter: 'प',  transliteration: 'pa',   exampleWord: 'पतंग',   exampleTrans: 'patang',   emoji: '🪁' },
      { letter: 'फ',  transliteration: 'pha',  exampleWord: 'फूल',    exampleTrans: 'phool',    emoji: '🌸' },
      { letter: 'ब',  transliteration: 'ba',   exampleWord: 'बकरी',   exampleTrans: 'bakri',    emoji: '🐐' },
      { letter: 'भ',  transliteration: 'bha',  exampleWord: 'भालू',   exampleTrans: 'bhaalu',   emoji: '🐻' },
      { letter: 'म',  transliteration: 'ma',   exampleWord: 'मछली',   exampleTrans: 'machhli',  emoji: '🐟' },
      { letter: 'य',  transliteration: 'ya',   exampleWord: 'यज्ञ',   exampleTrans: 'yagya',    emoji: '🔥' },
      { letter: 'र',  transliteration: 'ra',   exampleWord: 'रथ',     exampleTrans: 'rath',     emoji: '🛞' },
      { letter: 'ल',  transliteration: 'la',   exampleWord: 'लट्टू',  exampleTrans: 'lattu',    emoji: '🎡' },
      { letter: 'व',  transliteration: 'va',   exampleWord: 'वन',     exampleTrans: 'van',      emoji: '🌳' },
      { letter: 'श',  transliteration: 'sha',  exampleWord: 'शेर',    exampleTrans: 'sher',     emoji: '🦁' },
      { letter: 'ष',  transliteration: 'sha',  exampleWord: 'षटकोण',  exampleTrans: 'shatkon',  emoji: '🔷' },
      { letter: 'स',  transliteration: 'sa',   exampleWord: 'सांप',   exampleTrans: 'saanp',    emoji: '🐍' },
      { letter: 'ह',  transliteration: 'ha',   exampleWord: 'हाथी',   exampleTrans: 'haathi',   emoji: '🐘' },
      { letter: 'क्ष', transliteration: 'ksha', exampleWord: 'क्षत्रिय', exampleTrans: 'kshatriya', emoji: '⚔️' },
      { letter: 'त्र', transliteration: 'tra',  exampleWord: 'त्रिकोण',  exampleTrans: 'trikon',    emoji: '🔺' },
      { letter: 'ज्ञ', transliteration: 'gnya', exampleWord: 'ज्ञान',    exampleTrans: 'gyaan',     emoji: '📚' }
    ]
  }
};

/**
 * Combine a consonant with each of the language's matras. Returns the 12
 * aksharas in traditional barahkhadi order.
 */
export function buildBarahkhadi(consonant: string, matras: Matra[]): string[] {
  return matras.map((m) => consonant + m.sign);
}
