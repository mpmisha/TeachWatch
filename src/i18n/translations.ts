import enRaw from './locales/en.json';
import heRaw from './locales/he.json';
import { resolveTranslations } from './resolveTranslations';
import type { Language, RawTranslationStrings, TranslationStrings } from './types';

export type { Language, LevelTranslation, TranslationStrings } from './types';

export const translations: Record<Language, TranslationStrings> = {
  en: resolveTranslations(enRaw as RawTranslationStrings),
  he: resolveTranslations(heRaw as RawTranslationStrings),
};