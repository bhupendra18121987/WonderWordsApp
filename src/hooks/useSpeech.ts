import { useCallback, useRef } from 'react';
import * as Speech from 'expo-speech';

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  /** If false, don't stop currently queued utterances. */
  interrupt?: boolean;
  /** BCP-47 language override for this call. */
  lang?: string;
}

interface UseSpeechOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  /** BCP-47 tag, e.g. 'en-US' or 'hi-IN'. */
  lang?: string;
}

interface UseSpeechResult {
  speak: (text: string, opts?: SpeakOptions) => void;
  cancel: () => void;
  supported: true;
}

/**
 * React Native adapter using `expo-speech`.
 * Defaults to pitch 1.38 which transforms standard TTS engines into a
 * lively, high-frequency, friendly child narrator voice.
 */
export default function useSpeech({
  enabled = true,
  rate = 0.98,
  pitch = 1.38,
  lang = 'en-US'
}: UseSpeechOptions = {}): UseSpeechResult {
  // stop() is asynchronous on native platforms. Serialize stop/speak pairs
  // so a slow stop cannot cancel the utterance that immediately follows it.
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const generationRef = useRef(0);
  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!enabled || !text) return;
      if (opts.interrupt !== false) generationRef.current += 1;
      const requestGeneration = generationRef.current;
      const language = opts.lang ?? lang;
      // Keep the full BCP-47 tag so Android can resolve the intended regional
      // voice (for example en-US or hi-IN) instead of an ambiguous language.
      const speechLanguage = language;
      queueRef.current = queueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (requestGeneration !== generationRef.current) return;
          if (opts.interrupt !== false) await Speech.stop();
          // Let the platform resolve the requested BCP-47 locale itself. A
          // voice-list precheck can miss voices exposed by the native engine
          // and incorrectly switch Hindi speech to the phone's default voice.
          let retriedWithoutLocale = false;
          const speakOnDefaultVoice = () => Speech.speak(text, {
            rate: opts.rate ?? rate,
            pitch: opts.pitch ?? pitch,
            volume: 1.0,
            onStart: () => { if (__DEV__) console.info('[useSpeech] Default voice started'); },
            onDone: () => { if (__DEV__) console.info('[useSpeech] Default voice finished'); },
            onError: (err) => {
              if (__DEV__) console.warn('[useSpeech] Default Android TTS voice failed:', err);
            }
          });
          Speech.speak(text, {
            ...(speechLanguage ? { language: speechLanguage } : {}),
            rate: opts.rate ?? rate,
            pitch: opts.pitch ?? pitch,
            volume: 1.0,
            onStart: () => { if (__DEV__) console.info('[useSpeech] Voice started:', speechLanguage); },
            onDone: () => { if (__DEV__) console.info('[useSpeech] Voice finished:', speechLanguage); },
            onError: (err) => {
              if (__DEV__) console.warn('[useSpeech] TTS error:', err);
              // Some Android engines reject a locale that is not installed.
              // Retry once with the device's default voice so speech remains audible.
              if (speechLanguage && !retriedWithoutLocale && requestGeneration === generationRef.current) {
                retriedWithoutLocale = true;
                speakOnDefaultVoice();
              }
            }
          });
        })
        .catch((err: unknown) => {
          if (__DEV__) console.warn('[useSpeech] TTS request failed:', err);
        });
    },
    [enabled, rate, pitch, lang]
  );

  const cancel = useCallback(() => {
    generationRef.current += 1;
    queueRef.current = queueRef.current
      .catch(() => undefined)
      .then(() => Speech.stop())
      .catch((err: unknown) => {
        if (__DEV__) console.warn('[useSpeech] TTS stop failed:', err);
      });
  }, []);

  return { speak, cancel, supported: true };
}
