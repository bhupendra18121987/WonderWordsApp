import type { AgeGroupKey, Language } from './types';
import { shuffleInPlace } from './miniGames';

export type AdventureId = 'counting' | 'numbers' | 'patterns' | 'memory' | 'animals' | 'story' | 'drawing';
export interface ActivityChoice { id: string; label: string; emoji: string }
export interface ActivityQuestion {
  prompt: string;
  visual: string;
  answer: string;
  choices: ActivityChoice[];
  success: string;
  retry: string;
}

const labels = {
  en: {
    count: (_n: number) => 'How many apples?',
    number: (n: number) => `Find number ${n}`,
    pattern: 'What comes next?',
    shape: 'Find the circle',
    animal: 'Which animal makes this sound?',
    story: 'The bunny is hungry. What should it eat?',
    carrot: 'Carrot', apple: 'Apple', banana: 'Banana', leaf: 'Leaf', berry: 'Berry', car: 'Car',
    yes: 'Great!', retry: 'Try again!',
    countingName: 'Apple Count', numbersName: 'Number Search', patternsName: 'Shapes & Patterns',
    memoryName: 'Memory Match', animalsName: 'Animal Sounds', storyName: 'Bunny Story', drawingName: 'Art Studio',
    countingSub: 'Count the yummy apples', numbersSub: 'Find a number', patternsSub: 'Finish a pattern',
    memorySub: 'Find matching friends', animalsSub: 'Listen and pick an animal', storySub: 'Help the hungry bunny', drawingSub: 'Make your own picture',
    finish: 'Adventure complete!', next: 'Play again', memoryPrompt: 'Find two matching friends',
    drawClear: 'Clear', drawSave: 'Save picture', drawSaved: 'Picture saved on this device',
    noLives: 'No lives or timers—take your time!'
  },
  hi: {
    count: (_n: number) => 'सेब कितने हैं?',
    number: (n: number) => `संख्या ${n} ढूंढो`,
    pattern: 'आगे क्या आएगा?',
    shape: 'गोला ढूंढो',
    animal: 'यह आवाज़ किस जानवर की है?',
    story: 'खरगोश भूखा है। उसे क्या खाना चाहिए?',
    carrot: 'गाजर', apple: 'सेब', banana: 'केला', leaf: 'पत्ता', berry: 'जामुन', car: 'कार',
    yes: 'Great!', retry: 'फिर कोशिश!',
    countingName: 'सेब गिनो', numbersName: 'संख्या खोजो', patternsName: 'आकार और पैटर्न',
    memoryName: 'जोड़ी मिलाओ', animalsName: 'जानवरों की आवाज़', storyName: 'खरगोश की कहानी', drawingName: 'कला कोना',
    countingSub: 'सेब गिनो', numbersSub: 'संख्या ढूंढो', patternsSub: 'पैटर्न पूरा करो',
    memorySub: 'एक जैसे दोस्त मिलाओ', animalsSub: 'आवाज़ सुनो और जानवर चुनो', storySub: 'भूखे खरगोश की मदद करो', drawingSub: 'अपनी तस्वीर बनाओ',
    finish: 'रोमांच पूरा हुआ!', next: 'फिर खेलो', memoryPrompt: 'दो एक जैसे दोस्त ढूंढो',
    drawClear: 'मिटाओ', drawSave: 'तस्वीर सहेजो', drawSaved: 'तस्वीर इस डिवाइस में सहेजी गई',
    noLives: 'कोई समय-सीमा नहीं—आराम से खेलो!'
  }
} as const;

export function adventureInfo(id: AdventureId, language: Language) {
  const copy = labels[language];
  const items: Record<AdventureId, { name: string; subtitle: string; emoji: string }> = {
    counting: { name: copy.countingName, subtitle: copy.countingSub, emoji: '🍎' },
    numbers: { name: copy.numbersName, subtitle: copy.numbersSub, emoji: '🔢' },
    patterns: { name: copy.patternsName, subtitle: copy.patternsSub, emoji: '🧩' },
    memory: { name: copy.memoryName, subtitle: copy.memorySub, emoji: '🧠' },
    animals: { name: copy.animalsName, subtitle: copy.animalsSub, emoji: '🐾' },
    story: { name: copy.storyName, subtitle: copy.storySub, emoji: '📖' },
    drawing: { name: copy.drawingName, subtitle: copy.drawingSub, emoji: '🎨' }
  };
  return items[id];
}

export function adventureUI(language: Language) {
  const copy = labels[language];
  return {
    finish: copy.finish,
    next: copy.next,
    memoryPrompt: copy.memoryPrompt,
    success: copy.yes,
    drawClear: copy.drawClear,
    drawSave: copy.drawSave,
    drawSaved: copy.drawSaved,
    noLives: copy.noLives
  };
}

const ANIMALS = [
  { id: 'lion', emoji: '🦁', sound: { en: 'ROAR!', hi: 'दहाड़!' }, label: { en: 'Lion', hi: 'शेर' } },
  { id: 'dog', emoji: '🐶', sound: { en: 'WOOF!', hi: 'भौं-भौं!' }, label: { en: 'Dog', hi: 'कुत्ता' } },
  { id: 'cow', emoji: '🐮', sound: { en: 'MOO!', hi: 'माँऽऽ!' }, label: { en: 'Cow', hi: 'गाय' } },
  { id: 'cat', emoji: '🐱', sound: { en: 'MEOW!', hi: 'म्याऊँ!' }, label: { en: 'Cat', hi: 'बिल्ली' } },
  { id: 'duck', emoji: '🦆', sound: { en: 'QUACK!', hi: 'क्वैक!' }, label: { en: 'Duck', hi: 'बत्तख' } },
  { id: 'sheep', emoji: '🐑', sound: { en: 'BAA!', hi: 'मेंऽऽ!' }, label: { en: 'Sheep', hi: 'भेड़' } },
  { id: 'elephant', emoji: '🐘', sound: { en: 'TRUMPET!', hi: 'चिंघाड़!' }, label: { en: 'Elephant', hi: 'हाथी' } },
  { id: 'frog', emoji: '🐸', sound: { en: 'RIBBIT!', hi: 'टर्र-टर्र!' }, label: { en: 'Frog', hi: 'मेंढक' } },
  { id: 'monkey', emoji: '🐵', sound: { en: 'OO-OO!', hi: 'खी-खी!' }, label: { en: 'Monkey', hi: 'बंदर' } },
  { id: 'horse', emoji: '🐴', sound: { en: 'NEIGH!', hi: 'हिनहिनाना!' }, label: { en: 'Horse', hi: 'घोड़ा' } }
];

function options(answer: number, maximum: number, count = 6): ActivityChoice[] {
  const values = new Set([answer]);
  const cap = Math.max(maximum, count + 1);
  while (values.size < Math.min(count, cap)) {
    values.add(1 + Math.floor(Math.random() * cap));
  }
  return shuffleInPlace([...values]).map((value) => ({
    id: String(value), label: String(value), emoji: '🔢'
  }));
}

export function createActivityQuestion(
  id: Exclude<AdventureId, 'memory' | 'drawing'>,
  age: AgeGroupKey,
  language: Language,
  round: number,
  animalOffset = 0
): ActivityQuestion {
  const copy = labels[language];
  const max = age === '2-3' || age === '3-4' ? 6 : age === '5-6' ? 10 : 20;
  if (id === 'counting') {
    const count = Math.min(max, 2 + (round % Math.max(2, max - 1)));
    return {
      prompt: copy.count(count), visual: '🍎 '.repeat(count).trim(), answer: String(count),
      choices: options(count, max, 6), success: copy.yes, retry: copy.retry
    };
  }
  if (id === 'numbers') {
    const target = 1 + ((round * 3 + 1) % max);
    return {
      prompt: copy.number(target), visual: '🔎', answer: String(target),
      choices: options(target, max, 6), success: copy.yes, retry: copy.retry
    };
  }
  if (id === 'patterns') {
    const isShapes = round % 2 === 1;
    const shapeChoices = [
      { id: 'circle', label: language === 'hi' ? 'गोला' : 'Circle', emoji: '⚪' },
      { id: 'square', label: language === 'hi' ? 'वर्ग' : 'Square', emoji: '🟦' },
      { id: 'star', label: language === 'hi' ? 'तारा' : 'Star', emoji: '⭐' },
      { id: 'triangle', label: language === 'hi' ? 'त्रिकोण' : 'Triangle', emoji: '🔺' },
      { id: 'heart', label: language === 'hi' ? 'दिल' : 'Heart', emoji: '❤️' },
      { id: 'diamond', label: language === 'hi' ? 'हीरा' : 'Diamond', emoji: '🔷' }
    ];
    const colorChoices = [
      { id: 'red', label: language === 'hi' ? 'लाल' : 'Red', emoji: '🔴' },
      { id: 'blue', label: language === 'hi' ? 'नीला' : 'Blue', emoji: '🔵' },
      { id: 'green', label: language === 'hi' ? 'हरा' : 'Green', emoji: '🟢' },
      { id: 'yellow', label: language === 'hi' ? 'पीला' : 'Yellow', emoji: '🟡' },
      { id: 'orange', label: language === 'hi' ? 'नारंगी' : 'Orange', emoji: '🟠' },
      { id: 'purple', label: language === 'hi' ? 'बैंगनी' : 'Purple', emoji: '🟣' }
    ];
    return {
      prompt: isShapes ? copy.shape : copy.pattern,
      visual: isShapes ? '⬜ 🔵 ⭐' : '🔴 🔵 🔴 🔵 ❔',
      answer: isShapes ? 'circle' : 'red',
      choices: shuffleInPlace(isShapes ? [...shapeChoices] : [...colorChoices]),
      success: copy.yes, retry: copy.retry
    };
  }
  if (id === 'animals') {
    const animalIndex = ((round + animalOffset) % ANIMALS.length + ANIMALS.length) % ANIMALS.length;
    const targetAnimal = ANIMALS[animalIndex]!;
    // Pick target plus 5 random distractors for 6 options
    const otherAnimals = shuffleInPlace(ANIMALS.filter((a) => a.id !== targetAnimal.id)).slice(0, 5);
    const chosen = shuffleInPlace([targetAnimal, ...otherAnimals]).map((item) => ({
      id: item.id,
      label: item.label[language],
      emoji: item.emoji
    }));
    return {
      prompt: copy.animal, visual: targetAnimal.sound[language], answer: targetAnimal.id,
      choices: chosen,
      success: copy.yes, retry: copy.retry
    };
  }
  return {
    prompt: copy.story, visual: '🐰 💭', answer: 'carrot',
    choices: shuffleInPlace([
      { id: 'carrot', label: copy.carrot, emoji: '🥕' },
      { id: 'apple', label: copy.apple, emoji: '🍎' },
      { id: 'banana', label: copy.banana, emoji: '🍌' },
      { id: 'leaf', label: copy.leaf, emoji: '🍃' },
      { id: 'berry', label: copy.berry, emoji: '🍓' },
      { id: 'car', label: copy.car, emoji: '🚗' }
    ]),
    success: language === 'hi' ? 'खरगोश खुश!' : 'Happy bunny!',
    retry: copy.retry
  };
}

export function memoryPairs(age: AgeGroupKey) {
  const pool = [
    { id: 'cat', emoji: '🐱', label: { en: 'Cat', hi: 'बिल्ली' } },
    { id: 'dog', emoji: '🐶', label: { en: 'Dog', hi: 'कुत्ता' } },
    { id: 'sun', emoji: '☀️', label: { en: 'Sun', hi: 'सूरज' } },
    { id: 'fish', emoji: '🐟', label: { en: 'Fish', hi: 'मछली' } },
    { id: 'apple', emoji: '🍎', label: { en: 'Apple', hi: 'सेब' } },
    { id: 'star', emoji: '⭐', label: { en: 'Star', hi: 'तारा' } },
    { id: 'lion', emoji: '🦁', label: { en: 'Lion', hi: 'शेर' } },
    { id: 'tree', emoji: '🌳', label: { en: 'Tree', hi: 'पेड़' } }
  ];
  // 3 pairs = 6 cards, 4 pairs = 8 cards (giving at least 6-8 options per session)
  const pairCount = age === '2-3' || age === '3-4' ? 3 : 4;
  return shuffleInPlace([...pool]).slice(0, pairCount);
}
