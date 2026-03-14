import { useEffect, useState } from 'react';

import type { HighScores, SessionResult } from '../types/game';

const STORAGE_KEY = 'teachwatch-highscores';

export function useHighScores(): {
  highScores: HighScores;
  updateHighScore: (level: number, result: SessionResult) => void;
  resetHighScores: () => void;
} {
  const [highScores, setHighScores] = useState<HighScores>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHighScores({});
        return;
      }

      const parsed = JSON.parse(raw) as HighScores;
      if (parsed && typeof parsed === 'object') {
        setHighScores(parsed);
        return;
      }

      setHighScores({});
    } catch {
      setHighScores({});
    }
  }, []);

  const updateHighScore = (level: number, result: SessionResult) => {
    setHighScores((prev) => {
      const existing = prev[level];
      const shouldUpdateRecord =
        !existing ||
        result.score > existing.bestScore ||
        (result.score === existing.bestScore && result.totalTime < existing.fastestTime);

      const nextRecord = {
        bestScore: shouldUpdateRecord ? result.score : existing.bestScore,
        fastestTime: shouldUpdateRecord ? result.totalTime : existing.fastestTime,
        lastPlayed: new Date().toISOString(),
      };

      const next: HighScores = {
        ...prev,
        [level]: nextRecord,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore persistence errors and keep in-memory state.
      }

      return next;
    });
  };

  const resetHighScores = () => {
    setHighScores({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore persistence errors.
    }
  };

  return { highScores, updateHighScore, resetHighScores };
}