import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n';
import Button from '../common/Button';
import './Settings.css';

interface SettingsProps {
  onBack: () => void;
  onResetScores: () => void;
  hintsEnabled: boolean;
  onToggleHints: () => void;
}

type ResetState = 'idle' | 'confirm' | 'done';

export default function Settings({ onBack, onResetScores, hintsEnabled, onToggleHints }: SettingsProps) {
  const { t, language, setLanguage, dir } = useTranslation();
  const [resetState, setResetState] = useState<ResetState>('idle');
  const confirmTimeoutRef = useRef<number | null>(null);
  const doneTimeoutRef = useRef<number | null>(null);

  const clearConfirmTimeout = () => {
    if (confirmTimeoutRef.current !== null) {
      window.clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = null;
    }
  };

  const clearDoneTimeout = () => {
    if (doneTimeoutRef.current !== null) {
      window.clearTimeout(doneTimeoutRef.current);
      doneTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearConfirmTimeout();
      clearDoneTimeout();
    };
  }, []);

  const handleResetClick = () => {
    if (resetState === 'done') {
      return;
    }

    if (resetState === 'confirm') {
      clearConfirmTimeout();
      onResetScores();
      setResetState('done');

      clearDoneTimeout();
      doneTimeoutRef.current = window.setTimeout(() => {
        setResetState('idle');
        doneTimeoutRef.current = null;
      }, 1500);

      return;
    }

    setResetState('confirm');
    clearConfirmTimeout();
    confirmTimeoutRef.current = window.setTimeout(() => {
      setResetState('idle');
      confirmTimeoutRef.current = null;
    }, 3000);
  };

  const resetButtonText =
    resetState === 'confirm'
      ? t.resetScoresConfirm
      : resetState === 'done'
        ? t.resetScoresDone
        : t.resetScores;

  return (
    <section className="settings" dir={dir} aria-labelledby="settings-title">
      <header className="settings__header">
        <h1 id="settings-title" className="settings__title">
          {t.settingsTitle}
        </h1>

        <Button variant="secondary" className="settings__back" onClick={onBack}>
          {t.back}
        </Button>
      </header>

      <div className="settings__content">
        <article className="settings__card" aria-labelledby="settings-language-title">
          <h2 id="settings-language-title" className="settings__card-title">
            {t.language}
          </h2>

          <div className="settings__language-row">
            <span className="settings__language-label">{t.language}</span>

            <div className="settings__segment" role="group" aria-label={t.language}>
              <button
                type="button"
                className={`settings__segment-btn ${language === 'en' ? 'is-active' : ''}`}
                aria-pressed={language === 'en'}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`settings__segment-btn ${language === 'he' ? 'is-active' : ''}`}
                aria-pressed={language === 'he'}
                onClick={() => setLanguage('he')}
              >
                עב
              </button>
            </div>
          </div>
        </article>

        <article className="settings__card" aria-labelledby="settings-hints-title">
          <h2 id="settings-hints-title" className="settings__card-title">
            {t.hintsEnabled}
          </h2>

          <div className="settings__toggle-row">
            <span className="settings__toggle-label">{t.hintsEnabled}</span>

            <div className="settings__segment settings__toggle-segment" role="group" aria-label={t.hintsEnabled}>
              <button
                type="button"
                className={`settings__segment-btn settings__toggle-btn ${hintsEnabled ? 'is-active' : ''}`}
                aria-pressed={hintsEnabled}
                onClick={onToggleHints}
              >
                ON
              </button>
              <button
                type="button"
                className={`settings__segment-btn settings__toggle-btn ${hintsEnabled ? '' : 'is-active'}`}
                aria-pressed={!hintsEnabled}
                onClick={onToggleHints}
              >
                OFF
              </button>
            </div>
          </div>
        </article>

        <article className="settings__card" aria-labelledby="settings-reset-title">
          <h2 id="settings-reset-title" className="settings__card-title">
            {t.resetScores}
          </h2>

          <Button
            onClick={handleResetClick}
            className={`settings__reset ${resetState === 'done' ? 'is-done' : ''}`}
            disabled={resetState === 'done'}
          >
            {resetButtonText}
          </Button>
        </article>
      </div>
    </section>
  );
}