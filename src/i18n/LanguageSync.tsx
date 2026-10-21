'use client';

import React, { useEffect } from 'react';
import { useI18nStore } from './index';

/**
 * Client component to sync html lang attribute with the selected locale
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
