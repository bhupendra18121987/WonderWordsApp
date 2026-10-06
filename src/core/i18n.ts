// UI strings shared by every screen so the selected language applies throughout the app.

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
  navLevels: string;
  navRewards: string;
  navProfile: string;
  navAge: string;
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
  // Settings panel
  settingsTitle: string;
  settingsLangGroup: string;
  toggleSound: string;
  toggleLetterSpeech: string;
  toggleAnnounceLetterType: (vowel: string, consonant: string) => string;
  toggleHighlightVowels: string;
  toggleHighContrast: string;
  badgeOn: string;
  badgeOff: string;
  settingsDone: string;
  settingsResetScores: string;
  settingsResetAll: string;
  settingsHint: string;
  // Reset confirm dialogs
  resetAllTitle: string;
  resetAllMessage: string;
  resetAllConfirm: string;
  resetScoresTitle: string;
  resetScoresMessage: string;
  resetScoresConfirm: string;
  restartLevelTitle: string;
  restartLevelMessage: string;
  restartLevelConfirm: string;
  confirmCancel: string;
  // Mini-games hub
  miniGamesTile: string;
  miniGamesTileSub: string;
  miniGamesTitle: string;
  miniGamesSubtitle: string;
  comingSoon: string;
  // Letter Hunt
  letterHuntName: string;
  letterHuntSub: string;
  letterHuntPrompt: (letter: string) => string;
  // Tap the Color
  tapColorName: string;
  tapColorSub: string;
  tapColorPrompt: (colorLabel: string) => string;
  // Missing Letter
  missingLetterName: string;
  missingLetterSub: string;
  missingLetterPrompt: string;
  // Antonym Pairs
  antonymName: string;
  antonymSub: string;
  antonymPrompt: string;
  // Shared feedback
  correctFeedback: string;
  tryAgainFeedback: string;
  scoreLabel: (n: number) => string;
  roundLabel: (n: number, total: number) => string;
  // Alphabet Karaoke
  karaokeName: string;
  karaokeSub: string;
  karaokePlay: string;
  karaokePause: string;
  karaokeRestart: string;
  // Two-Player
  twoPlayerName: string;
  twoPlayerSub: string;
  player1: string;
  player2: string;
  playerTurn: (name: string) => string;
  winnerAnnounce: (name: string) => string;
  winnerTie: string;
  // Trace a Letter
  traceName: string;
  traceSub: string;
  traceClear: string;
  tracePrev: string;
  traceNext: string;
  traceModeCaps: string;
  traceModeSmall: string;
  traceModeCursive: string;
  traceModeHiLetters: string;
  traceModeHiWords: string;
  traceCheck: string;
  traceNeedMore: string;
  tracePassed: string;
  // Misc labels
  badgesTitle: string;
  worldTitle: string;
  activityCount: string;
  lastPlayed: string;
  parentArea: string;
  parentPrompt: string;
  parentTryAgain: string;
  parentContinue: string;
  parentSummary: string;
  languageHeading: string;
  languageDescription: string;
  next: string;
  splashTagline: string;
  letsPlay: string;
  forParents: string;
  homeGreeting: string;
  homeSub: string;
  chooseAdventure: string;
  exploreActivities: string;
  readingName: string;
  profileTitle: string;
  changeAvatar: string;
  chooseAvatar: string;
  levels: string;
  totalStars: string;
  points: string;
  wordsFound: string;
  rewardsTitle: string;
  stickers: string;
  playForRewards: string;
  stickerComingSoon: string;
  barahkhadiUnavailable: string;
  earned: string;
  levelComplete: string;
  wordMeaning: string;
  noWordsYet: string;
  backHome: string;
  previous: string;
  speakWord: (word: string) => string;
  versus: string;
  tour: string;
  close: string;
  back: string;
  backAgainToExit: string;
  toggleMusic: string;
  settings: string;
  hiddenCard: string;
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
  navLevels: 'Levels',
  navRewards: 'Rewards',
  navProfile: 'Profile',
  navAge: 'Age',
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
  onboardStart: "Let's go! 🚀",
  settingsTitle: 'Settings',
  settingsLangGroup: '🌐 Language',
  toggleSound: 'Voice & sound effects',
  toggleLetterSpeech: 'Say letters when I drag',
  toggleAnnounceLetterType: (v, c) => `Announce "${v}" / "${c}"`,
  toggleHighlightVowels: 'Highlight vowels in the puzzle',
  toggleHighContrast: 'High-contrast colors',
  badgeOn: '✓ ON',
  badgeOff: 'OFF',
  settingsDone: 'Done',
  settingsResetScores: 'Reset scores',
  settingsResetAll: 'Reset all',
  settingsHint: '"Reset scores" keeps learned words & badges. "Reset all" clears everything.',
  resetAllTitle: 'Start completely fresh?',
  resetAllMessage: 'This will erase your stars, badges, learned words — everything.',
  resetAllConfirm: 'Yes, reset all',
  resetScoresTitle: 'Reset your scores?',
  resetScoresMessage: 'Your stars and level will go back to 0. Learned words and badges stay safe!',
  resetScoresConfirm: 'Yes, reset scores',
  restartLevelTitle: 'Start again from Level 1?',
  restartLevelMessage: 'Stars, badges and learned words will stay — only the level goes back to 1.',
  restartLevelConfirm: 'Yes, restart',
  confirmCancel: 'No',
  miniGamesTile: 'Mini games',
  miniGamesTileSub: 'More fun!',
  miniGamesTitle: '🎮 Mini games',
  miniGamesSubtitle: 'Pick a game to play',
  comingSoon: 'Coming soon',
  letterHuntName: 'Letter Hunt',
  letterHuntSub: 'Find the letter!',
  letterHuntPrompt: (l) => `Tap the letter ${l}`,
  tapColorName: 'Tap the Color',
  tapColorSub: 'Find the color!',
  tapColorPrompt: (c) => `Tap the ${c} circle`,
  missingLetterName: 'Missing Letter',
  missingLetterSub: 'Fill the blank',
  missingLetterPrompt: 'Which letter is missing?',
  antonymName: 'Antonym Pairs',
  antonymSub: 'Match the opposites',
  antonymPrompt: 'Find the matching pairs',
  correctFeedback: 'Great!',
  tryAgainFeedback: 'Try again',
  scoreLabel: (n) => `⭐ ${n}`,
  roundLabel: (n, total) => `${n} / ${total}`,
  karaokeName: 'Alphabet Karaoke',
  karaokeSub: 'Sing the alphabet!',
  karaokePlay: '▶️ Play',
  karaokePause: '⏸ Pause',
  karaokeRestart: '🔄 Restart',
  twoPlayerName: 'Two-player',
  twoPlayerSub: 'Take turns!',
  player1: 'Player 1',
  player2: 'Player 2',
  playerTurn: (name) => `${name}'s turn`,
  winnerAnnounce: (name) => `${name} wins! 🏆`,
  winnerTie: "It's a tie!",
  traceName: 'Trace a Letter',
  traceSub: 'Draw with your finger!',
  traceClear: '🧽 Clear',
  tracePrev: '←',
  traceNext: '→',
  traceModeCaps: 'A B C',
  traceModeSmall: 'a b c',
  traceModeCursive: '𝒜 𝒷 𝒬',
  traceModeHiLetters: 'अ आ इ',
  traceModeHiWords: 'आम',
  traceCheck: '✓ Check letter',
  traceNeedMore: 'Trace more of the letter, then check again.',
  tracePassed: 'Great!',
  badgesTitle: '🏅 Badges',
  worldTitle: 'My Learning World',
  activityCount: 'Adventure activities',
  lastPlayed: 'LAST',
  parentArea: 'Parents',
  parentPrompt: 'Grown-ups only: what is 14 + 7?',
  parentTryAgain: 'Try once more with a grown-up.',
  parentContinue: 'Continue',
  parentSummary: 'Learning snapshot',
  languageHeading: 'Pick your language!',
  languageDescription: 'Choose a language for your child.',
  next: 'Next →',
  splashTagline: 'Learn Words. Discover Worlds.',
  letsPlay: "Let's Play",
  forParents: 'For Parents',
  homeGreeting: 'Hello, Little Explorer!',
  homeSub: "Let's start your word adventure!",
  chooseAdventure: 'Choose an adventure',
  exploreActivities: 'Explore all games',
  readingName: 'Read & discover',
  profileTitle: 'My Profile',
  changeAvatar: 'Change avatar',
  chooseAvatar: 'Choose your avatar',
  levels: 'Levels',
  totalStars: 'Total Stars',
  points: 'Points',
  wordsFound: 'Words Found',
  rewardsTitle: 'My Rewards 🎁',
  stickers: 'Stickers',
  playForRewards: 'Play puzzles and mini-games to collect more!',
  stickerComingSoon: 'Sticker collection coming soon.',
  barahkhadiUnavailable: 'Barahkhadi is only available in Hindi mode.',
  earned: 'You earned',
  levelComplete: 'Level Complete!',
  wordMeaning: 'Word Meaning',
  noWordsYet: 'No words yet — go find some!',
  backHome: '← Back home',
  previous: 'Previous',
  speakWord: (word) => `Speak ${word}`,
  versus: 'VS',
  tour: 'Tour',
  close: 'Close',
  back: 'Back',
  backAgainToExit: 'Press back again to exit',
  toggleMusic: 'Toggle music',
  settings: 'Settings',
  hiddenCard: 'Hidden card'
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
  navLevels: 'स्तर',
  navRewards: 'पुरस्कार',
  navProfile: 'प्रोफ़ाइल',
  navAge: 'उम्र',
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
  youWon: 'You won! 🎉',
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
  onboardStart: 'चलो शुरू करें! 🚀',
  settingsTitle: 'सेटिंग',
  settingsLangGroup: '🌐 भाषा',
  toggleSound: 'आवाज़ और ध्वनि प्रभाव',
  toggleLetterSpeech: 'उंगली फिराने पर अक्षर बोलो',
  toggleAnnounceLetterType: (v, c) => `"${v}" / "${c}" बोलो`,
  toggleHighlightVowels: 'पहेली में स्वर उभारो',
  toggleHighContrast: 'गहरे रंग',
  badgeOn: '✓ चालू',
  badgeOff: 'बंद',
  settingsDone: 'हो गया',
  settingsResetScores: 'अंक शून्य करो',
  settingsResetAll: 'सब मिटाओ',
  settingsHint: '"अंक शून्य करो" से सीखे शब्द और बैज बचे रहेंगे। "सब मिटाओ" से सब कुछ मिट जाएगा।',
  resetAllTitle: 'क्या पूरी तरह नई शुरुआत करें?',
  resetAllMessage: 'इससे तुम्हारे सितारे, बैज, सीखे शब्द — सब कुछ मिट जाएगा।',
  resetAllConfirm: 'हाँ, सब मिटाओ',
  resetScoresTitle: 'क्या अंक शून्य करें?',
  resetScoresMessage: 'तुम्हारे सितारे और स्तर 0 हो जाएंगे। सीखे शब्द और बैज सुरक्षित रहेंगे!',
  resetScoresConfirm: 'हाँ, अंक शून्य करो',
  restartLevelTitle: 'क्या स्तर 1 से फिर शुरू करें?',
  restartLevelMessage: 'सितारे, बैज और सीखे शब्द बने रहेंगे — केवल स्तर 1 हो जाएगा।',
  restartLevelConfirm: 'हाँ, शुरू करो',
  confirmCancel: 'नहीं',
  miniGamesTile: 'खेल',
  miniGamesTileSub: 'और मज़ा!',
  miniGamesTitle: '🎮 छोटे खेल',
  miniGamesSubtitle: 'खेलने के लिए एक चुनो',
  comingSoon: 'जल्द ही',
  letterHuntName: 'अक्षर ढूंढो',
  letterHuntSub: 'अक्षर खोजो!',
  letterHuntPrompt: (l) => `अक्षर ${l} छूओ`,
  tapColorName: 'रंग छूओ',
  tapColorSub: 'रंग खोजो!',
  tapColorPrompt: (c) => `${c} गोला छूओ`,
  missingLetterName: 'गायब अक्षर',
  missingLetterSub: 'खाली भरो',
  missingLetterPrompt: 'कौन सा अक्षर गायब है?',
  antonymName: 'विपरीत जोड़ी',
  antonymSub: 'उल्टे शब्द मिलाओ',
  antonymPrompt: 'मिलती जोड़ी ढूंढो',
  correctFeedback: 'Great!',
  tryAgainFeedback: 'फिर से कोशिश करो',
  scoreLabel: (n) => `⭐ ${n}`,
  roundLabel: (n, total) => `${n} / ${total}`,
  karaokeName: 'अक्षर गाना',
  karaokeSub: 'वर्णमाला गाओ!',
  karaokePlay: '▶️ चलाओ',
  karaokePause: '⏸ रोको',
  karaokeRestart: '🔄 फिर से',
  twoPlayerName: 'दो खिलाड़ी',
  twoPlayerSub: 'बारी-बारी से खेलो!',
  player1: 'खिलाड़ी 1',
  player2: 'खिलाड़ी 2',
  playerTurn: (name) => `${name} की बारी`,
  winnerAnnounce: (name) => `${name} जीता! 🏆`,
  winnerTie: 'बराबरी है!',
  traceName: 'अक्षर लिखो',
  traceSub: 'उंगली से बनाओ!',
  traceClear: '🧽 मिटाओ',
  tracePrev: '←',
  traceNext: '→',
  traceModeCaps: 'A B C',
  traceModeSmall: 'a b c',
  traceModeCursive: '𝒜 𝒷 𝒬',
  traceModeHiLetters: 'अ आ इ',
  traceModeHiWords: 'आम',
  traceCheck: '✓ अक्षर जांचो',
  traceNeedMore: 'अक्षर को थोड़ा और बनाओ, फिर जांचो।',
  tracePassed: 'Great!',
  badgesTitle: '🏅 बैज',
  worldTitle: 'मेरी सीखने की दुनिया',
  activityCount: 'रोमांचक गतिविधियां',
  lastPlayed: 'आखिरी खेल',
  parentArea: 'माता-पिता',
  parentPrompt: 'केवल बड़ों के लिए: 14 + 7 कितना है?',
  parentTryAgain: 'किसी बड़े के साथ फिर कोशिश करें।',
  parentContinue: 'आगे बढ़ें',
  parentSummary: 'सीखने की झलक',
  languageHeading: 'अपनी भाषा चुनें',
  languageDescription: 'अपने बच्चे के लिए भाषा चुनें।',
  next: 'आगे →',
  splashTagline: 'शब्द सीखो। नई दुनिया खोजो।',
  letsPlay: 'चलो खेलें',
  forParents: 'माता-पिता के लिए',
  homeGreeting: 'नमस्ते, छोटे खोजी!',
  homeSub: 'चलो शब्दों का रोमांच शुरू करें!',
  chooseAdventure: 'अपना रोमांच चुनो',
  exploreActivities: 'सभी खेल देखें',
  readingName: 'पढ़ो और खोजो',
  profileTitle: 'मेरी प्रोफ़ाइल',
  changeAvatar: 'अवतार बदलें',
  chooseAvatar: 'अपना अवतार चुनें',
  levels: 'स्तर',
  totalStars: 'कुल सितारे',
  points: 'अंक',
  wordsFound: 'मिले हुए शब्द',
  rewardsTitle: 'मेरे पुरस्कार 🎁',
  stickers: 'स्टिकर',
  playForRewards: 'और पाने के लिए पहेलियां और छोटे खेल खेलो!',
  stickerComingSoon: 'स्टिकर संग्रह जल्द आएगा।',
  barahkhadiUnavailable: 'बारहखड़ी केवल हिंदी भाषा में उपलब्ध है।',
  earned: 'तुमने कमाए',
  levelComplete: 'स्तर पूरा!',
  wordMeaning: 'शब्द का अर्थ',
  noWordsYet: 'अभी कोई शब्द नहीं — जाओ ढूंढो!',
  backHome: '← घर चलो',
  previous: 'पिछला',
  speakWord: (word) => `${word} बोलो`,
  versus: 'बनाम',
  tour: 'परिचय',
  close: 'बंद करो',
  back: 'पीछे',
  backAgainToExit: 'बाहर जाने के लिए फिर से बैक दबाएँ',
  toggleMusic: 'संगीत चालू या बंद करें',
  settings: 'सेटिंग',
  hiddenCard: 'छुपा हुआ कार्ड'
};

const DICT: Record<Language, UIStrings> = { en, hi };

export function t(lang: Language): UIStrings {
  return DICT[lang] ?? DICT.en;
}
