// Small UI-string dictionary. Only visible/audible labels that a child sees
// during the actual game are translated — parent-facing screens (settings,
// onboarding) stay in English for now.

import type { Language } from './types';

export interface UIStrings {
  wordsToFind: string;
  findWordsMsg: (n: number) => string;
  hint: string;
  newBtn: string;
  home: string;
  nextPuzzle: string;
  keepPlaying: string;
  level: string;
  found: string;
  letsFind: string;
  welcomeBack: string;
  readyMsg: string;
  playPuzzle: string;
  wordReview: string;
  learned: (n: number) => string;
  alphabetTile: string;
  howToPlay: string;
  quickTour: string;
  changeAge: string;
  restartLevel: string;
  vowelsAndConsonants: string;
  starsFmt: (n: number) => string;
  puzzlesFmt: (n: number) => string;
  wordsFmt: (n: number) => string;
  youFound: (n: number) => string;
  wordsSuffix: string;
  wordSuffix: string;
  // Bottom-nav labels
  navHome: string;
  navPlay: string;
  navWords: string;
  navLetters: string;
  navSettings: string;
  // Hero-card CTA
  playNow: string;
  // Alphabet screen modes
  alphabetMode: string;
  barahkhadiMode: string;
  chooseLetter: string;
  vowelsLabel: (n: number) => string;
  consonantsLabel: (n: number) => string;
  // Tic-Tac-Toe game
  ticTacToeName: string;
  ticTacToeSub: string;
  yourTurn: string;
  owlTurn: string;
  youWon: string;
  owlWon: string;
  itsATie: string;
  playAgain: string;
  newGame: string;
  you: string;
  owl: string;
  // Onboarding steps
  onboardStep1Title: string;
  onboardStep1Text: string;
  onboardStep2Title: string;
  onboardStep2Text: string;
  onboardStep3Title: string;
  onboardStep3Text: string;
  onboardStep4Title: string;
  onboardStep4Text: string;
  onboardNext: string;
  onboardBack: string;
  onboardSkip: string;
  onboardStart: string;
}

const en: UIStrings = {
  wordsToFind: 'Words to find',
  findWordsMsg: (n) => `Find ${n} words!`,
  hint: '💡 Hint',
  newBtn: '🔄 New',
  home: '🏠 Home',
  nextPuzzle: 'Next puzzle →',
  keepPlaying: 'Keep playing',
  level: 'Level',
  found: 'found',
  letsFind: "Let's find some words!",
  welcomeBack: 'Welcome back',
  readyMsg: 'Ready to find some new words today?',
  playPuzzle: 'Play a puzzle',
  wordReview: 'Word review',
  learned: (n) => `${n} learned`,
  alphabetTile: 'Vowels & Consonants',
  howToPlay: 'How to play',
  quickTour: 'Quick tour',
  changeAge: 'Change age',
  restartLevel: '🔄 Restart from Level 1',
  vowelsAndConsonants: 'Vowels & Consonants',
  starsFmt: (n) => `⭐ ${n}`,
  puzzlesFmt: (n) => `🏆 ${n}`,
  wordsFmt: (n) => `📚 ${n}`,
  youFound: (n) => `You found ${n}`,
  wordsSuffix: 'words',
  wordSuffix: 'word',
  navHome: 'Home',
  navPlay: 'Play',
  navWords: 'Words',
  navLetters: 'Letters',
  navSettings: 'Settings',
  playNow: '🎮 Play now',
  alphabetMode: 'Letters',
  barahkhadiMode: 'Barahkhadi',
  chooseLetter: 'Choose a letter',
  vowelsLabel: (n) => `${n} Vowels`,
  consonantsLabel: (n) => `${n} Consonants`,
  ticTacToeName: 'Word Match',
  ticTacToeSub: 'Three in a row!',
  yourTurn: 'Your turn',
  owlTurn: "Ollie's turn",
  youWon: 'You won! 🎉',
  owlWon: 'Ollie won!',
  itsATie: "It's a tie!",
  playAgain: 'Play again',
  newGame: '🔄 New game',
  you: 'You',
  owl: 'Ollie',
  onboardStep1Title: 'Hi there!',
  onboardStep1Text: "I'm Ollie the Owl. I'll help you find words in the puzzle!",
  onboardStep2Title: 'Drag to pick letters',
  onboardStep2Text: 'Press and drag across letters to spell a word. Words can go across or down.',
  onboardStep3Title: 'Listen to letters and words',
  onboardStep3Text: "I'll say each letter you touch, and cheer when you find a word!",
  onboardStep4Title: 'Earn stars',
  onboardStep4Text: 'Finish puzzles to collect stars, badges, and unlock new levels.',
  onboardNext: 'Next →',
  onboardBack: 'Back',
  onboardSkip: 'Skip',
  onboardStart: "Let's go! 🚀"
};

const hi: UIStrings = {
  wordsToFind: 'शब्द ढूंढो',
  findWordsMsg: (n) => `${n} शब्द ढूंढो!`,
  hint: '💡 संकेत',
  newBtn: '🔄 नई',
  home: '🏠 घर',
  nextPuzzle: 'अगली पहेली →',
  keepPlaying: 'खेलते रहो',
  level: 'स्तर',
  found: 'मिले',
  letsFind: 'चलो शब्द ढूंढें!',
  welcomeBack: 'वापसी पर स्वागत है',
  readyMsg: 'आज नए शब्द ढूंढने के लिए तैयार हो?',
  playPuzzle: 'पहेली खेलो',
  wordReview: 'शब्द याद करो',
  learned: (n) => `${n} सीखे`,
  alphabetTile: 'स्वर और व्यंजन',
  howToPlay: 'खेलना कैसे है',
  quickTour: 'छोटी सी सैर',
  changeAge: 'उम्र बदलो',
  restartLevel: '🔄 स्तर 1 से शुरू करो',
  vowelsAndConsonants: 'स्वर और व्यंजन',
  starsFmt: (n) => `⭐ ${n}`,
  puzzlesFmt: (n) => `🏆 ${n}`,
  wordsFmt: (n) => `📚 ${n}`,
  youFound: (n) => `तुमने ${n}`,
  wordsSuffix: 'शब्द ढूंढे',
  wordSuffix: 'शब्द ढूंढा',
  navHome: 'घर',
  navPlay: 'खेलो',
  navWords: 'शब्द',
  navLetters: 'अक्षर',
  navSettings: 'सेटिंग',
  playNow: '🎮 अभी खेलो',
  alphabetMode: 'अक्षर',
  barahkhadiMode: 'बारहखड़ी',
  chooseLetter: 'एक व्यंजन चुनो',
  vowelsLabel: (n) => `${n} स्वर`,
  consonantsLabel: (n) => `${n} व्यंजन`,
  ticTacToeName: 'शब्द जोड़ी',
  ticTacToeSub: 'तीन एक लाइन में!',
  yourTurn: 'तुम्हारी बारी',
  owlTurn: 'ओली की बारी',
  youWon: 'तुम जीत गए! 🎉',
  owlWon: 'ओली जीत गया!',
  itsATie: 'बराबरी है!',
  playAgain: 'फिर से खेलो',
  newGame: '🔄 नया खेल',
  you: 'तुम',
  owl: 'ओली',
  onboardStep1Title: 'नमस्ते!',
  onboardStep1Text: 'मैं ओली उल्लू हूं। मैं तुम्हें पहेली में शब्द ढूंढने में मदद करूंगा!',
  onboardStep2Title: 'अक्षरों पर उंगली फिराओ',
  onboardStep2Text: 'शब्द बनाने के लिए अक्षरों पर उंगली चलाओ। शब्द आडे या खड़े हो सकते हैं।',
  onboardStep3Title: 'अक्षर और शब्द सुनो',
  onboardStep3Text: 'मैं हर अक्षर बोलूंगा जिसे तुम छूओगे, और जब तुम शब्द मिलाओगे तो खुश होऊंगा!',
  onboardStep4Title: 'सितारे कमाओ',
  onboardStep4Text: 'पहेलियां पूरी करो, सितारे और बैज इकट्ठा करो, नए स्तर खोलो!',
  onboardNext: 'आगे →',
  onboardBack: 'पीछे',
  onboardSkip: 'छोड़ो',
  onboardStart: 'चलो शुरू करें! 🚀'
};

const DICT: Record<Language, UIStrings> = { en, hi };

export function t(lang: Language): UIStrings {
  return DICT[lang] ?? DICT.en;
}
