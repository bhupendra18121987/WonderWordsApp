import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
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

// Hooks
import useLocalStorage from './src/hooks/useLocalStorage';
import useSpeech from './src/hooks/useSpeech';

// Core (shared with web)
import {
  DEFAULT_PROFILE_AVATAR,
  DEFAULT_PROFILE_NAME,
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS
} from './src/core/constants';
import { getLanguageConfig, isVowelForLang } from './src/core/languages';
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
  | 'profile';

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

  // ─────────── Ephemeral state ───────────
  const [screen, setScreen] = useState<Screen>('splash');
  const [pendingLang, setPendingLang] = useState<Language | null>(null);
  const [pendingAge, setPendingAge] = useState<AgeGroupKey | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('Hi! Ready to play?');

  type ConfirmAction = 'resetAll' | 'resetScores' | 'restartLevel';
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  // ─────────── Derived ───────────
  const langCfg = getLanguageConfig(settings.language);
  const strings = t(settings.language);
  const { speak } = useSpeech({
    enabled: settings.sound,
    lang: langCfg.bcp47
  });

  const speakLetter = useCallback(
    (letter: string) => {
      if (!letter) return;
      if (!settings.letterSpeech) return;
      speak(letter, { rate: 0.9, pitch: 1.2, interrupt: true });
      if (settings.announceLetterType) {
        const label = isVowelForLang(letter, settings.language)
          ? langCfg.vowelLabel
          : langCfg.consonantLabel;
        // Small delay so the letter finishes speaking first.
        setTimeout(() => speak(label, { rate: 0.9, pitch: 1.15, interrupt: false }), 250);
      }
    },
    [speak, settings.letterSpeech, settings.announceLetterType, settings.language, langCfg]
  );

  const speakText = useCallback(
    (text: string) => {
      if (!text) return;
      speak(text, { rate: 0.9, pitch: 1.15 });
    },
    [speak]
  );

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
  const handlePlay = (level?: number) => {
    setSelectedLevel(level);
    setScreen('game');
    setMascotMessage(strings.letsFind);
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
        setScreen('splash');
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
  const isImmersive =
    screen === 'splash' ||
    (screen === 'languageSelect' && !setupComplete) ||
    (screen === 'ageSelect' && !setupComplete);

  // Map current screen to BottomNav active tab (only 4 primary tabs).
  const navActive: NavScreen | null =
    screen === 'home' ? 'home' :
    screen === 'miniGames' || screen === 'game' || screen === 'alphabet' ? 'levels' :
    screen === 'rewards' ? 'rewards' :
    screen === 'profile' ? 'profile' :
    null;

  // ─────────── Render ───────────
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {screen === 'splash' && (
        <SplashScreen onStart={handleSplashStart} ready={persistenceLoaded} />
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
          onRestartLevel={() => setConfirmAction('restartLevel')}
        />
      )}

      {screen === 'game' && ageGroup && (
        <WordSearchGame
          ageGroup={ageGroup}
          level={selectedLevel ?? progress.level}
          language={settings.language}
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
            tictactoe: true
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
          }}
        />
      )}

      {screen === 'letterHunt' && ageGroup && (
        <LetterHuntGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'tapColor' && ageGroup && (
        <TapColorGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'missingLetter' && ageGroup && (
        <MissingLetterGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'antonymPairs' && ageGroup && (
        <AntonymPairsGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'karaoke' && (
        <AlphabetKaraoke
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

      {screen === 'twoPlayer' && ageGroup && (
        <TwoPlayerGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakLetter={speakLetter}
          speakText={speakText}
        />
      )}

      {screen === 'trace' && ageGroup && (
        <TraceLetterGame
          ageGroup={ageGroup}
          language={settings.language}
          onExit={() => setScreen('miniGames')}
          speakText={speakText}
        />
      )}

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
      {!isImmersive && (
        <TopBar
          stars={progress.stars}
          onStarsPress={() => setScreen('rewards')}
          onOpenSettings={() => setShowSettings(true)}
          onOpenTour={() => setShowOnboarding(true)}
        />
      )}
      {ageGroup && !isImmersive && screen !== 'ageSelect' && navActive && (
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
