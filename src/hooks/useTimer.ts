import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(): {
  elapsed: number;
  start: () => void;
  stop: () => number;
  reset: () => void;
} {
  const [elapsed, setElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) {
      return;
    }

    // Resume from current elapsed value if previously stopped.
    startTimeRef.current = Date.now() - elapsedRef.current * 1000;

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      const nextElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      elapsedRef.current = nextElapsed;
      setElapsed(nextElapsed);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (startTimeRef.current === null) {
      return elapsedRef.current;
    }

    const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    elapsedRef.current = finalElapsed;
    setElapsed(finalElapsed);

    clearTimer();
    startTimeRef.current = null;

    return finalElapsed;
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    startTimeRef.current = null;
    elapsedRef.current = 0;
    setElapsed(0);
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return { elapsed, start, stop, reset };
}