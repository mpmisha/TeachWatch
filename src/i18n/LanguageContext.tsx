import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationStrings } from './translations';

const LANGUAGE_STORAGE_KEY = 'teachwatch-language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function isLanguage(value: string): value is Language {
  return value === 'en' || value === 'he';
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('he');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && isLanguage(saved)) {
        setLanguage(saved);
      }
    } catch {
      // Ignore storage read issues and keep default language.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage write issues and keep in-memory language.
    }

    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dir = language === 'he' ? 'rtl' : 'ltr';
    return {
      language,
      setLanguage,
      t: translations[language],
      dir,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}