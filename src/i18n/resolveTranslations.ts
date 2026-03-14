import type { RawTranslationStrings, TranslationStrings } from './types';

export function interpolate(template: string, params: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      return String(params[key]);
    }

    return match;
  });
}

export function resolveTranslations(raw: RawTranslationStrings): TranslationStrings {
  const {
    startLevel,
    levelGameSession,
    clockAriaLabel,
    scoreOutOf10,
    completedIn,
    starsAriaLabel,
    levelLabel,
    levelAriaLabel,
    scoreOf10,
    ...rest
  } = raw;

  return {
    ...rest,
    startLevel: (level, name) => interpolate(startLevel, { level, name }),
    levelGameSession: (level) => interpolate(levelGameSession, { level }),
    clockAriaLabel: (hours, minutes) => interpolate(clockAriaLabel, { hours, minutes }),
    scoreOutOf10: (score) => interpolate(scoreOutOf10, { score }),
    completedIn: (duration) => interpolate(completedIn, { duration }),
    starsAriaLabel: (stars, max) => interpolate(starsAriaLabel, { stars, max }),
    levelLabel: (level) => interpolate(levelLabel, { level }),
    levelAriaLabel: (level, name) => interpolate(levelAriaLabel, { level, name }),
    scoreOf10: (score) => interpolate(scoreOf10, { score }),
  };
}