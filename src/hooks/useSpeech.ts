import { useCallback } from 'react';
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
 * React Native adapter using `expo-speech`, which wraps the OS TTS
 * engine directly. Android bundles Google TTS with excellent Hindi
 * support, so we don't need a network fallback like we do on web.
 */
export default function useSpeech({
  enabled = true,
  rate = 0.95,
  pitch = 1.15,
  lang = 'en-US'
}: UseSpeechOptions = {}): UseSpeechResult {
  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!enabled || !text) return;
      if (opts.interrupt !== false) Speech.stop();
      Speech.speak(text, {
        language: opts.lang ?? lang,
        rate: opts.rate ?? rate,
        pitch: opts.pitch ?? pitch
      });
    },
    [enabled, rate, pitch, lang]
  );

  const cancel = useCallback(() => {
    Speech.stop();
  }, []);

  return { speak, cancel, supported: true };
}
