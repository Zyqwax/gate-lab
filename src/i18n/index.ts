'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { translations, Locale, TranslationKey } from './translations';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = 'gatelab_locale';

// Default is 'en' as requested: "varsayılan dili algılamaya gerek yok varsayılan ingilizce olsun"
const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'tr' || saved === 'en') {
      document.documentElement.lang = saved;
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  document.documentElement.lang = 'en';
  return 'en';
};

export const useI18nStore = create<I18nState>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale: Locale) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, locale);
        document.documentElement.lang = locale;
      } catch {
        // Ignore storage errors
      }
    }
    set({ locale });
  },
}));

/**
 * Format string with parameter interpolation e.g. "{name}" -> "Full Adder"
 */
export function formatString(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return Object.entries(params).reduce((acc, [k, v]) => {
    return acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }, str);
}

/**
 * Component to sync html lang attribute on the client side
 */
export const LanguageSync: React.FC = () => {
  const locale = useI18nStore((state) => state.locale);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
};

/**
 * Hook to use translations in components
 */
export function useTranslation() {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[locale] || translations.en;
    const raw = (dict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
    return formatString(raw, params);
  };

  return { t, locale, setLocale };
}

/**
 * Helper to fetch translation outside of React components
 */
export function getTranslation(key: TranslationKey, params?: Record<string, string | number>): string {
  const locale = useI18nStore.getState().locale;
  const dict = translations[locale] || translations.en;
  const raw = (dict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
  return formatString(raw, params);
}

export type { Locale, TranslationKey };
