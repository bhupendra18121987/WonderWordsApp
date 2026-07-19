// Token pairs for the tic-tac-toe game. Each pair provides one token
// for the child and a visually-distinct token for the mascot, so the
// board never looks confusing. Words are bilingual so speech works in
// either language.

import type { Language } from '../types';

export interface Token {
  emoji: string;
  labels: Record<Language, string>;
}

export const TOKEN_PAIRS: readonly [Token, Token][] = [
  [
    { emoji: '🐱', labels: { en: 'Cat',    hi: 'बिल्ली' } },
    { emoji: '🦉', labels: { en: 'Owl',    hi: 'उल्लू' } }
  ],
  [
    { emoji: '🐰', labels: { en: 'Rabbit', hi: 'खरगोश' } },
    { emoji: '🐢', labels: { en: 'Turtle', hi: 'कछुआ' } }
  ],
  [
    { emoji: '🌸', labels: { en: 'Flower', hi: 'फूल'   } },
    { emoji: '⭐', labels: { en: 'Star',   hi: 'तारा' } }
  ],
  [
    { emoji: '⚽', labels: { en: 'Ball',   hi: 'गेंद'  } },
    { emoji: '🎈', labels: { en: 'Balloon',hi: 'गुब्बारा' } }
  ],
  [
    { emoji: '🍎', labels: { en: 'Apple',  hi: 'सेब'   } },
    { emoji: '🍌', labels: { en: 'Banana', hi: 'केला'  } }
  ],
  [
    { emoji: '🌞', labels: { en: 'Sun',    hi: 'सूरज'  } },
    { emoji: '🌙', labels: { en: 'Moon',   hi: 'चांद'  } }
  ]
];

export function randomTokenPairIndex(exclude?: number): number {
  if (TOKEN_PAIRS.length <= 1) return 0;
  let idx = Math.floor(Math.random() * TOKEN_PAIRS.length);
  if (exclude !== undefined && idx === exclude) {
    idx = (idx + 1) % TOKEN_PAIRS.length;
  }
  return idx;
}
