"use client";

import { useCallback, useMemo, useSyncExternalStore, type SetStateAction } from "react";

const SHOP_STORAGE_EVENT = "demutz-shop-storage";

function subscribeToKey(key: string, onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === key) onChange();
  }

  function handleShopStorage(event: Event) {
    if ((event as CustomEvent<string>).detail === key) onChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SHOP_STORAGE_EVENT, handleShopStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SHOP_STORAGE_EVENT, handleShopStorage);
  };
}

function notifyKey(key: string) {
  window.dispatchEvent(new CustomEvent(SHOP_STORAGE_EVENT, { detail: key }));
}

export function usePersistentStringState<T extends string>(
  key: string,
  fallback: T,
  isValid: (value: string) => value is T,
) {
  const subscribe = useCallback((onChange: () => void) => subscribeToKey(key, onChange), [key]);
  const getSnapshot = useCallback(() => window.localStorage.getItem(key) ?? fallback, [fallback, key]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);
  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = isValid(rawValue) ? rawValue : fallback;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const currentRaw = window.localStorage.getItem(key) ?? fallback;
      const current = isValid(currentRaw) ? currentRaw : fallback;
      const resolved = typeof next === "function" ? (next as (value: T) => T)(current) : next;
      window.localStorage.setItem(key, resolved);
      notifyKey(key);
    },
    [fallback, isValid, key],
  );

  return [value, setValue] as const;
}

export function usePersistentJsonState<T>(key: string, fallback: T) {
  const fallbackRaw = useMemo(() => JSON.stringify(fallback), [fallback]);
  const subscribe = useCallback((onChange: () => void) => subscribeToKey(key, onChange), [key]);
  const getSnapshot = useCallback(() => window.localStorage.getItem(key) ?? fallbackRaw, [fallbackRaw, key]);
  const getServerSnapshot = useCallback(() => fallbackRaw, [fallbackRaw]);
  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => {
    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return fallback;
    }
  }, [fallback, rawValue]);

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      let current = fallback;
      try {
        current = JSON.parse(window.localStorage.getItem(key) ?? fallbackRaw) as T;
      } catch {
        current = fallback;
      }
      const resolved = typeof next === "function" ? (next as (value: T) => T)(current) : next;
      window.localStorage.setItem(key, JSON.stringify(resolved));
      notifyKey(key);
    },
    [fallback, fallbackRaw, key],
  );

  return [value, setValue] as const;
}
