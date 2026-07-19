import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SetValue<T> = T | ((prev: T) => T);

/**
 * React Native equivalent of the web app's useLocalStorage. Backed by
 * `AsyncStorage` — reads and writes are async, so we expose a `loaded`
 * flag so callers can wait for the persisted value before making
 * routing decisions.
 *
 * Signature: `[value, setValue, reset, loaded]`
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (v: SetValue<T>) => void, () => void, boolean] {
  const [value, setValueState] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);
  const initialRef = useRef(initialValue);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!mounted) return;
        if (raw != null) {
          try {
            setValueState(JSON.parse(raw) as T);
          } catch {
            // corrupted entry — fall back to initial
          }
        }
        setLoaded(true);
      })
      .catch(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    (next: SetValue<T>) => {
      setValueState((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        AsyncStorage.setItem(key, JSON.stringify(resolved)).catch(() => {});
        return resolved;
      });
    },
    [key]
  );

  const reset = useCallback(() => {
    setValueState(initialRef.current);
    AsyncStorage.removeItem(key).catch(() => {});
  }, [key]);

  return [value, setValue, reset, loaded];
}
