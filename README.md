# WonderWords — Mobile (React Native)

The **React Native / Expo** version of WonderWords. Sits alongside the web app but is a completely independent project with its own `node_modules`, its own build tooling, and its own runtime.

## What's in here so far

- ✅ Expo SDK 57 project (TypeScript, blank template)
- ✅ `src/core/` — the shared, platform-agnostic logic from the web app: types, word bank, puzzle generator, tic-tac-toe logic, i18n, alphabet examples, scenes, grapheme splitter, game rules
- ✅ Minimal `App.tsx` that proves the core is wired: pick language, pick age, see a real generated puzzle grid
- ✅ App metadata (`app.json`) branded as **WonderWords** with `com.wonderwords.app` bundle id
- ⏳ Everything else — UI components need porting from web

## Running it

From this folder:

```powershell
npm run android      # build & run on connected Android phone / emulator
npm run ios          # macOS only
npm run web          # runs in a browser (uses react-native-web)
npm start            # opens the Expo dev server; scan the QR with Expo Go for quick testing
```

The very first Android/iOS build takes a while (downloads native SDKs). Subsequent builds are fast.

## Architecture

The whole idea is that **`src/core/` is a mirror of the web app's `src/core/`**. Both apps generate puzzles, run tic-tac-toe, look up alphabet examples, and translate strings using exactly the same code. Only the UI layer differs.

```
src/
├── core/            ← identical to ../src/core/ in the web repo
│   ├── types.ts
│   ├── constants.ts
│   ├── data.ts
│   ├── puzzleGenerator.ts
│   ├── gameLogic.ts
│   ├── letters.ts
│   ├── languages.ts
│   ├── grapheme.ts
│   ├── i18n.ts
│   ├── scenes.ts
│   ├── ticTacToe.ts
│   └── data/
│       ├── words.json
│       ├── words.hi.json
│       ├── rewards.json
│       ├── rewards.hi.json
│       ├── tokens.ts
│       └── alphabetExamples.ts
└── App.tsx          ← RN UI (to be built)
```

## Keeping core in sync with the web app

For now, when we change `../src/core/` in the web workspace, we manually copy it here:

```powershell
# Run from the parent folder (children-learning)
Copy-Item -Path src\core -Destination wonderwords-app\src\core -Recurse -Force
```

Once the mobile UI matures, we'll factor `core` into a shared npm workspace or a git submodule so this copy step disappears.

## What still needs to be ported from the web app

The whole web app's UI layer (`../src/components/`) needs an RN equivalent. Rough plan:

| Web component | RN replacement using | Notes |
|---|---|---|
| `SplashScreen` | `View`, `Text`, `Animated` | fade in/out |
| `LanguageSelect` | `View`, `Pressable` | big flag cards |
| `AgeSelect` | `View`, `Pressable` | same |
| `HomeScreen` | `View`, `Pressable`, `LinearGradient` | hero card + tiles |
| `Grid` (drag-select) | `PanResponder` or `react-native-gesture-handler` | the trickiest part |
| `WordList` | `View`, `Text` | chips |
| `WordSearchGame` | uses all the above | reuse `core/puzzleGenerator` |
| `AlphabetScreen` | `View`, `ScrollView`, `Pressable` | letter cards + barahkhadi |
| `BarahkhadiView` | `View`, horizontal `ScrollView` | consonant picker |
| `TicTacToeGame` | `View`, `Pressable` | reuse `core/ticTacToe` |
| `Celebration` | `react-native-confetti-cannon` + `Animated` | fireworks |
| `AnimatedScene` | `react-native-reanimated` or `moti` | scene animations |
| `Onboarding` | `View`, `Pressable` | modal steps |
| `SettingsPanel` | `View`, `Pressable` | toggle rows |
| `ConfirmDialog` | `Modal` | native modal |
| `BottomNav` | `View`, `Pressable` | or use `react-navigation` |
| `Mascot` | `View`, `Animated` | floating owl |

Platform adapters (hooks) to replace:

| Web hook | RN replacement |
|---|---|
| `useSpeech` | `expo-speech` |
| `useSound` | `expo-av` (Audio.Sound) or `expo-audio` |
| `useLocalStorage` | `@react-native-async-storage/async-storage` |

## Setup TODOs before shipping

1. Add proper app icon: replace `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash-icon.png` with WonderWords branding
2. Install `expo-speech`, `expo-av`, `@react-native-async-storage/async-storage`, `react-native-reanimated`, `react-native-confetti-cannon`
3. Build the UI screens one at a time (start with Splash → Language → Age wizard)
4. Set up Expo EAS Build (`npx eas build --platform android`) — produces a real APK/AAB using Expo's cloud, no Android Studio needed

## Package identity

- **App name:** WonderWords
- **Bundle id / Android package:** `com.wonderwords.app`
- **Slug:** `wonderwords-app`
- **Locked orientation:** portrait (kids' apps almost always are)
- **Splash background:** `#ffcf5c` (matches our web hero card)
"# WonderWordsApp" 
