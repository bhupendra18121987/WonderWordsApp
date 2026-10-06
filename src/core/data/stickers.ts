/** One sticker in the collection. */
export interface StickerDef {
  id: string;
  emoji: string;
  nameEn: string;
  nameHi: string;
  /** How many learned words unlock this sticker. */
  unlockAt: number;
}

export const STICKERS: StickerDef[] = [
  { id: 's1',  emoji: '🐼', nameEn: 'Panda',       nameHi: 'पांडा',        unlockAt: 1  },
  { id: 's2',  emoji: '🌟', nameEn: 'Star',         nameHi: 'तारा',         unlockAt: 3  },
  { id: 's3',  emoji: '🦁', nameEn: 'Lion',         nameHi: 'शेर',          unlockAt: 5  },
  { id: 's4',  emoji: '🍎', nameEn: 'Apple',        nameHi: 'सेब',          unlockAt: 8  },
  { id: 's5',  emoji: '🌈', nameEn: 'Rainbow',      nameHi: 'इंद्रधनुष',    unlockAt: 10 },
  { id: 's6',  emoji: '🐬', nameEn: 'Dolphin',      nameHi: 'डॉल्फिन',      unlockAt: 12 },
  { id: 's7',  emoji: '🦋', nameEn: 'Butterfly',    nameHi: 'तितली',        unlockAt: 15 },
  { id: 's8',  emoji: '🍕', nameEn: 'Pizza',        nameHi: 'पिज्जा',       unlockAt: 18 },
  { id: 's9',  emoji: '🚀', nameEn: 'Rocket',       nameHi: 'राकेट',        unlockAt: 20 },
  { id: 's10', emoji: '🦄', nameEn: 'Unicorn',      nameHi: 'यूनिकॉर्न',    unlockAt: 22 },
  { id: 's11', emoji: '🌺', nameEn: 'Flower',       nameHi: 'फूल',          unlockAt: 25 },
  { id: 's12', emoji: '🐸', nameEn: 'Frog',         nameHi: 'मेंढक',        unlockAt: 28 },
  { id: 's13', emoji: '🎨', nameEn: 'Palette',      nameHi: 'रंग',          unlockAt: 30 },
  { id: 's14', emoji: '🦊', nameEn: 'Fox',          nameHi: 'लोमड़ी',       unlockAt: 33 },
  { id: 's15', emoji: '🍦', nameEn: 'Ice Cream',    nameHi: 'आइसक्रीम',     unlockAt: 36 },
  { id: 's16', emoji: '🐳', nameEn: 'Whale',        nameHi: 'व्हेल',        unlockAt: 40 },
  { id: 's17', emoji: '⚡',  nameEn: 'Lightning',   nameHi: 'बिजली',        unlockAt: 45 },
  { id: 's18', emoji: '🦚', nameEn: 'Peacock',      nameHi: 'मोर',          unlockAt: 48 },
  { id: 's19', emoji: '🍓', nameEn: 'Strawberry',   nameHi: 'स्ट्रॉबेरी',   unlockAt: 50 },
  { id: 's20', emoji: '🐉', nameEn: 'Dragon',       nameHi: 'ड्रैगन',       unlockAt: 55 },
  { id: 's21', emoji: '🌙', nameEn: 'Moon',         nameHi: 'चाँद',         unlockAt: 60 },
  { id: 's22', emoji: '🦅', nameEn: 'Eagle',        nameHi: 'चील',          unlockAt: 65 },
  { id: 's23', emoji: '🎭', nameEn: 'Drama',        nameHi: 'नाटक',         unlockAt: 70 },
  { id: 's24', emoji: '👑', nameEn: 'Crown',        nameHi: 'मुकुट',        unlockAt: 75 },
];

/** Return sticker IDs that have been unlocked by word count. */
export function computeEarnedStickers(learnedWordCount: number): string[] {
  return STICKERS.filter((s) => learnedWordCount >= s.unlockAt).map((s) => s.id);
}
