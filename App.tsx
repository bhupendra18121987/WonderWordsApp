import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, Platform, StyleSheet, ToastAndroid, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens & components
import SplashScreen from './src/components/SplashScreen';
import LanguageSelect from './src/components/LanguageSelect';
import AgeSelect from './src/components/AgeSelect';
import HomeScreen from './src/components/HomeScreen';
import WordSearchGame from './src/components/WordSearchGame';
import WordReview from './src/components/WordReview';
import AlphabetScreen from './src/components/AlphabetScreen';
import TicTacToeGame from './src/components/TicTacToeGame';
import MiniGamesHub, { type MiniGameId } from './src/components/MiniGamesHub';
import LetterHuntGame from './src/components/LetterHuntGame';
import TapColorGame from './src/components/TapColorGame';
import MissingLetterGame from './src/components/MissingLetterGame';
import AntonymPairsGame from './src/components/AntonymPairsGame';
import AlphabetKaraoke from './src/components/AlphabetKaraoke';
import TwoPlayerGame from './src/components/TwoPlayerGame';
import TraceLetterGame from './src/components/TraceLetterGame';
import Onboarding from './src/components/Onboarding';
import SettingsPanel from './src/components/SettingsPanel';
import ConfirmDialog from './src/components/ConfirmDialog';
import BottomNav, { type NavScreen } from './src/components/BottomNav';
import TopBar from './src/components/TopBar';
import RewardsScreen from './src/components/RewardsScreen';
import ProfileScreen from './src/components/ProfileScreen';
import AdventureActivity from './src/components/AdventureActivity';
import type { AdventureId } from './src/core/adventures';
import ParentGate from './src/components/ParentGate';
import ParentDashboard from './src/components/ParentDashboard';

// Hooks
import useLocalStorage from './src/hooks/useLocalStorage';
import useSpeech from './src/hooks/useSpeech';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Core (shared with web)
import {
  DEFAULT_PROFILE_AVATAR,
  DEFAULT_PROFILE_NAME,
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS
} from './src/core/constants';
import { getLanguageConfig } from './src/core/languages';
import {
  resetScoresOnly,
  restartAtLevelOne,
  sanitizeProgress
} from './src/core/gameLogic';
import { t } from './src/core/i18n';
import type {
  AgeGroupKey,
  Language,
  LearnedWord,
  Progress,
  Settings
} from './src/core/types';

type Screen =
  | 'splash'
  | 'languageSelect'
  | 'ageSelect'
  | 'home'
  | 'game'
  | 'review'
  | 'alphabet'
  | 'tictactoe'
  | 'miniGames'
  | 'letterHunt'
  | 'tapColor'
  | 'missingLetter'
  | 'antonymPairs'
  | 'karaoke'
  | 'twoPlayer'
  | 'trace'
  | 'rewards'
  | 'profile'
  | 'adventure'
  | 'parents';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

function AppInner() {
  // ─────────── Persistent state ───────────
  const [rawSettings, setRawSettings, , settingsLoaded] =
    useLocalStorage<Partial<Settings>>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const settings = useMemo<Settings>(
    () => ({ ...DEFAULT_SETTINGS, ...rawSettings }),
    [rawSettings]
  );
  const setSettings = useCallback(
    (next: Settings | ((prev: Settings) => Settings)) => {
      setRawSettings((prev) => {
        const merged: Settings = { ...DEFAULT_SETTINGS, ...prev };
        return typeof next === 'function'
          ? (next as (p: Settings) => Settings)(merged)
          : next;
      });
    },
    [setRawSettings]
  );

  const [ageGroup, setAgeGroup, , ageGroupLoaded] =
    useLocalStorage<AgeGroupKey | null>(STORAGE_KEYS.ageGroup, null);
  const [progress, setProgress, resetProgress] =
    useLocalStorage<Progress>(STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const [setupComplete, setSetupComplete, , setupLoaded] =
    useLocalStorage<boolean>(STORAGE_KEYS.setupComplete, false);
  const [seenOnboarding, setSeenOnboarding] =
    useLocalStorage<boolean>(STORAGE_KEYS.seenOnboarding, false);
  // Remember which mini-game the child last opened so we can highlight
  // it in the hub — kids form spatial memory quickly and love picking
  // up where they left off.
  const [lastMiniGame, setLastMiniGame] =
    useLocalStorage<MiniGameId | null>('ww:lastMiniGame', null);
  const [profileName, setProfileName] =
    useLocalStorage<string>(STORAGE_KEYS.profileName, DEFAULT_PROFILE_NAME);
  const [profileAvatar, setProfileAvatar] =
    useLocalStorage<string>(STORAGE_KEYS.profileAvatar, DEFAULT_PROFILE_AVATAR);

  const persistenceLoaded = settingsLoaded && ageGroupLoaded && setupLoaded;

  // Auto-heal impossibly-inflated stored values (from earlier release bug).
  useEffect(() => {
    if (!persistenceLoaded) return;
    const clean = sanitizeProgress(progress);
    if (clean !== progress) setProgress(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistenceLoaded]);

  // One-time migration: older builds had sound OFF by default. Flip it ON
  // for any existing user who never explicitly toggled sound themselves.
  useEffect(() => {
    if (!persistenceLoaded) return;
    const MIGR_KEY = 'ww:migr:soundOn';
    AsyncStorage.getItem(MIGR_KEY).then((done) => {
      if (done) return; // migration already ran
      // If sound is currently false (stored as false from old default), turn it on.
      setRawSettings((prev) => {
        if ((prev as Partial<Settings>).sound === false) {
          return { ...prev, sound: true } as Partial<Settings>;
        }
        return prev;
      });
      AsyncStorage.setItem(MIGR_KEY, '1').catch(() => {});
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistenceLoaded]);

  // ─────────── Ephemeral state ───────────
  const [screen, setScreenState] = useState<Screen>('splash');
  const navigationHistory = useRef<Screen[]>([]);
  const lastRootBackPress = useRef(0);
  const setScreen = useCallback((nextScreen: Screen) => {
    if (nextScreen === screen) return;
    const history = navigationHistory.current;
    const previousVisit = history.lastIndexOf(nextScreen);
    if (previousVisit >= 0) {
      history.splice(previousVisit);
    } else if (nextScreen === 'home' && (screen === 'splash' || (screen === 'ageSelect' && !setupComplete))) {
      history.length = 0;
    } else {
      history.push(screen);
    }
    setScreenState(nextScreen);
  }, [screen, setupComplete]);
  const [pendingLang, setPendingLang] = useState<Language | null>(null);
  const [pendingAge, setPendingAge] = useState<AgeGroupKey | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('Hi! Ready to play?');

  type ConfirmAction = 'resetAll' | 'resetScores' | 'restartLevel';
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const exitPrompt = t(settings.language).backAgainToExit;

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (confirmAction) {
        setConfirmAction(null);
        return true;
      }
      if (showSettings) {
        setShowSettings(false);
        return true;
      }
      if (showParentGate) {
        setShowParentGate(false);
        return true;
      }
      if (showOnboarding) {
        setShowOnboarding(false);
        return true;
      }
      const previousScreen = navigationHistory.current.pop();
      if (previousScreen) {
        lastRootBackPress.current = 0;
        setScreenState(previousScreen);
        return true;
      }
      if (screen === 'splash') return false;
      if (screen !== 'home') {
        lastRootBackPress.current = 0;
        setScreenState('home');
        return true;
      }
      const now = Date.now();
      if (now - lastRootBackPress.current <= 2000) {
        lastRootBackPress.current = 0;
        BackHandler.exitApp();
        return true;
      }
      lastRootBackPress.current = now;
      ToastAndroid.show(exitPrompt, ToastAndroid.SHORT);
      return true;
    });
    return () => subscription.remove();
  }, [confirmAction, showSettings, showParentGate, showOnboarding, screen, exitPrompt]);

  // ─────────── Derived ───────────
  const langCfg = getLanguageConfig(settings.language);
  const strings = t(settings.language);
  const { speak, cancel: cancelSpeech } = useSpeech({
    enabled: settings.sound,
    lang: langCfg.bcp47
  });

  const speakLetter = useCallback(
    (letter: string) => {
      if (!letter) return;
      if (!settings.letterSpeech) return;
      speak(letter, { rate: 0.98, pitch: 1.38, interrupt: true });
    },
    [speak, settings.letterSpeech]
  );

  const speakText = useCallback(
    (text: string, languageOverride?: string, options?: { rate?: number; interrupt?: boolean }) => {
      if (!text) return;
      speak(text, { rate: options?.rate ?? 0.98, pitch: 1.38, lang: languageOverride, interrupt: options?.interrupt ?? true });
    },
    [speak]
  );

  useLayoutEffect(() => {
    cancelSpeech();
  }, [screen, cancelSpeech]);

  const speakLearned = useCallback(
    (w: LearnedWord) => speakText(`${w.word}. ${w.meaning}`),
    [speakText]
  );

  // ─────────── Onboarding trigger ───────────
  useEffect(() => {
    if (!seenOnboarding && ageGroup && setupComplete && screen === 'home') {
      setShowOnboarding(true);
    }
  }, [seenOnboarding, ageGroup, setupComplete, screen]);

  // ─────────── Navigation handlers ───────────
  const handleSplashStart = () => {
    if (!setupComplete) {
      setPendingLang(settings.language);
      setScreen('languageSelect');
    } else {
      setScreen('home');
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    setPendingLang(lang);
    setSettings((s) => ({ ...s, language: lang }));
    speak(lang === 'hi' ? 'नमस्ते' : 'Hello', {
      lang: lang === 'hi' ? 'hi-IN' : 'en-US'
    });
  };

  const handleLanguageNext = () => {
    if (!setupComplete) setScreen('ageSelect');
    else setScreen('home');
  };

  const handleSelectAge = (key: AgeGroupKey) => setPendingAge(key);

  const handleAgeStart = () => {
    if (!pendingAge) return;
    setAgeGroup(pendingAge);
    setSetupComplete(true);
    setScreen('home');
  };

  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined);
  const [selectedAdventure, setSelectedAdventure] = useState<AdventureId>('counting');
  const handlePlay = (level?: number) => {
    setSelectedLevel(level);
    setScreen('game');
    setMascotMessage(strings.letsFind);
  };

  const handleAdventureComplete = (earnedStars: number) => {
    setProgress((current) => ({
      ...current,
      stars: current.stars + earnedStars,
      activityStars: (current.activityStars ?? 0) + earnedStars,
      activitiesCompleted: (current.activitiesCompleted ?? 0) + 1
    }));
  };

  // ─────────── Reset actions ───────────
  const confirmActionConfig: Record<ConfirmAction, {
    emoji: string;
    title: string;
    message: string;
    confirmLabel: string;
    tone: 'primary' | 'danger';
    run: () => void;
  }> = {
    resetAll: {
      emoji: '🧹',
      title: strings.resetAllTitle,
      message: strings.resetAllMessage,
      confirmLabel: strings.resetAllConfirm,
      tone: 'danger',
      run: () => {
        resetProgress();
        setSetupComplete(false);
        setSeenOnboarding(false);
        setAgeGroup(null);
        setShowSettings(false);
        navigationHistory.current.length = 0;
        setScreenState('splash');
      }
    },
    resetScores: {
      emoji: '⭐',
      title: strings.resetScoresTitle,
      message: strings.resetScoresMessage,
      confirmLabel: strings.resetScoresConfirm,
      tone: 'primary',
      run: () => {
        setProgress((p) => resetScoresOnly(p));
        setShowSettings(false);
      }
    },
    restartLevel: {
      emoji: '🔄',
      title: strings.restartLevelTitle,
      message: strings.restartLevelMessage,
      confirmLabel: strings.restartLevelConfirm,
      tone: 'primary',
      run: () => setProgress((p) => restartAtLevelOne(p))
    }
  };

  // ─────────── Chrome visibility ───────────
  // Fully-immersive screens hide both the app TopBar AND the BottomNav.
  // Themed screens hide only the TopBar (they render their own purple
  // header) but keep the BottomNav for tab-switching.
  const isFullImmersive =
    screen === 'splash' ||
    screen === 'review' ||
    screen === 'game' ||
    screen === 'letterHunt' ||
    screen === 'tapColor' ||
    screen === 'missingLetter' ||
    screen === 'antonymPairs' ||
    screen === 'karaoke' ||
    screen === 'twoPlayer' ||
    screen === 'trace' ||
    screen === 'adventure' ||
    screen === 'parents' ||
    screen === 'tictactoe' ||
    (screen === 'languageSelect' && !setupComplete) ||
    (screen === 'ageSelect' && !setupComplete);

  const hasThemedHeader =
    screen === 'alphabet' ||
    screen === 'miniGames' ||
    screen === 'rewards' ||
    screen === 'profile' ||
    (screen === 'ageSelect' && setupComplete);

  const hideTopBar = isFullImmersive || hasThemedHeader;
  const hideBottomNav = isFullImmersive;

  // Map current screen to BottomNav active tab.
  const navActive: NavScreen | null =
    screen === 'home' ? 'home' :
    screen === 'miniGames' || screen === 'game' || screen === 'alphabet' ? 'levels' :
    screen === 'rewards' ? 'rewards' :
    screen === 'ageSelect' ? 'age' :
    screen === 'profile' ? 'profile' :
    null;

  // ─────────── Render ───────────
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {screen === 'splash' && (
        <SplashScreen onStart={handleSplashStart} ready={persistenceLoaded} language={settings.language} />
      )}

      {screen === 'languageSelect' && (
        <LanguageSelect
          selected={pendingLang}
          step={!setupComplete ? { current: 1, total: 2 } : undefined}
          onSelect={handleSelectLanguage}
          onNext={handleLanguageNext}
        />
      )}

      {screen === 'ageSelect' && (
        <AgeSelect
          selected={pendingAge}
          language={settings.language}
          step={!setupComplete ? { current: 2, total: 2 } : undefined}
          onSelect={handleSelectAge}
          onStart={handleAgeStart}
          onBack={setupComplete ? () => setScreen('home') : undefined}
        />
      )}

      {screen === 'home' && ageGroup && (
        <HomeScreen
          ageGroup={ageGroup}
          language={settings.language}
          progress={progress}
          onPlay={handlePlay}
          onReview={() => setScreen('review')}
          onAlphabet={() => setScreen('alphabet')}
          onMiniGames={() => setScreen('miniGames')}
          onAdventure={(id) => { setSelectedAdventure(id); setScreen('adventure'); }}
          onRestartLevel={() => setConfirmAction('restartLevel')}
        />
      )}

      {screen === 'game' && ageGroup && (
        <WordSearchGame
          key={`${ageGroup}-${settings.language}-${selectedLevel ?? 'current'}`}
          ageGroup={ageGroup}
          level={selectedLevel ?? progress.level}
          language={settings.language}
          sound={settings.sound}
          progress={progress}
          onProgressUpdate={setProgress}
          onExit={() => setScreen('home')}
          speakLetter={speakLetter}
          speakText={speakText}
        />
      )}

      {screen === 'review' && (
        <WordReview
          learnedWords={progress.learnedWords}
          language={settings.language}
          onBack={() => setScreen('home')}
          onSpeak={speakLearned}
        />
      )}

      {screen === 'alphabet' && (
        <AlphabetScreen
          language={settings.language}
          onBack={() => setScreen(ageGroup ? 'home' : 'ageSelect')}
          onSpeak={(letter, type) => {
            speak(letter, { rate: 0.9, pitch: 1.2, interrupt: true });
            if (settings.announceLetterType && type) {
              setTimeout(() => speak(type, { rate: 0.9, pitch: 1.15, interrupt: false }), 250);
            }
          }}
        />
      )}

      {screen === 'tictactoe' && ageGroup && (
        <TicTacToeGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
          onSetMascotMessage={setMascotMessage}
        />
      )}

      {screen === 'miniGames' && (
        <MiniGamesHub
          language={settings.language}
          lastPlayed={lastMiniGame}
          enabled={{
            letterHunt: true,
            tapColor: true,
            missingLetter: true,
            antonymPairs: true,
            karaoke: true,
            twoPlayer: true,
            trace: true,
            tictactoe: true,
            counting: true,
            numbers: true,
            patterns: true,
            memory: true,
            animals: true,
            story: true,
            drawing: true
          }}
          onBack={() => setScreen('home')}
          onPick={(id: MiniGameId) => {
            setLastMiniGame(id);
            if (id === 'letterHunt') setScreen('letterHunt');
            else if (id === 'tapColor') setScreen('tapColor');
            else if (id === 'missingLetter') setScreen('missingLetter');
            else if (id === 'antonymPairs') setScreen('antonymPairs');
            else if (id === 'karaoke') setScreen('karaoke');
            else if (id === 'twoPlayer') setScreen('twoPlayer');
            else if (id === 'trace') setScreen('trace');
            else if (id === 'tictactoe') setScreen('tictactoe');
            else {
              setSelectedAdventure(id);
              setScreen('adventure');
            }
          }}
        />
      )}

      {screen === 'letterHunt' && ageGroup && (
        <LetterHuntGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'tapColor' && ageGroup && (
        <TapColorGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'missingLetter' && ageGroup && (
        <MissingLetterGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'antonymPairs' && ageGroup && (
        <AntonymPairsGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'karaoke' && (
        <AlphabetKaraoke
          key={settings.language}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
          cancelSpeech={cancelSpeech}
        />
      )}

      {screen === 'twoPlayer' && ageGroup && (
        <TwoPlayerGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakLetter={speakLetter}
          speakText={speakText}
        />
      )}

      {screen === 'trace' && ageGroup && (
        <TraceLetterGame
          key={`${ageGroup}-${settings.language}`}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'adventure' && ageGroup && (
        <AdventureActivity
          key={`${selectedAdventure}-${ageGroup}-${settings.language}`}
          id={selectedAdventure}
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          onComplete={handleAdventureComplete}
          speakText={speakText}
        />
      )}

      {screen === 'parents' && (
        <ParentDashboard
          language={settings.language}
          ageGroup={ageGroup}
          profileName={profileName}
          progress={progress}
          onBack={() => setScreen('home')}
          onSettings={() => setShowSettings(true)}
        />
      )}

      <ParentGate
        visible={showParentGate}
        language={settings.language}
        onCancel={() => setShowParentGate(false)}
        onUnlock={() => { setShowParentGate(false); setScreen('parents'); }}
      />

      {screen === 'rewards' && (
        <RewardsScreen
          language={settings.language}
          progress={progress}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          ageGroup={ageGroup}
          language={settings.language}
          progress={progress}
          profileName={profileName}
          profileAvatar={profileAvatar}
          onProfileNameChange={setProfileName}
          onProfileAvatarChange={setProfileAvatar}
          onBack={() => setScreen('home')}
          onChangeAge={() => setScreen('ageSelect')}
        />
      )}

      {/* Modals */}
      <Onboarding
        visible={showOnboarding}
        language={settings.language}
        onDone={() => {
          setShowOnboarding(false);
          setSeenOnboarding(true);
        }}
      />

      <SettingsPanel
        open={showSettings}
        settings={settings}
        onChange={setSettings}
        onClose={() => setShowSettings(false)}
        onReset={() => setConfirmAction('resetAll')}
        onResetScores={() => setConfirmAction('resetScores')}
      />

      {confirmAction && (
        <ConfirmDialog
          open
          emoji={confirmActionConfig[confirmAction].emoji}
          title={confirmActionConfig[confirmAction].title}
          message={confirmActionConfig[confirmAction].message}
          confirmLabel={confirmActionConfig[confirmAction].confirmLabel}
          cancelLabel={strings.confirmCancel}
          tone={confirmActionConfig[confirmAction].tone}
          onConfirm={() => {
            confirmActionConfig[confirmAction].run();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Chrome (only after wizard) */}
      {!hideTopBar && (
        <TopBar
          stars={progress.stars}
          language={settings.language}
          onStarsPress={() => setScreen('rewards')}
          onOpenSettings={() => setShowParentGate(true)}
          onOpenParents={() => setShowParentGate(true)}
          onOpenTour={() => setShowOnboarding(true)}
        />
      )}
      {ageGroup && !hideBottomNav && navActive && (
        <BottomNav
          active={navActive}
          language={settings.language}
          onNavigate={(target) => {
            if (target === 'home') setScreen('home');
            else if (target === 'levels') setScreen('miniGames');
            else if (target === 'rewards') setScreen('rewards');
            else if (target === 'age') setScreen('ageSelect');
            else if (target === 'profile') setScreen('profile');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f0ff'
  }
});
