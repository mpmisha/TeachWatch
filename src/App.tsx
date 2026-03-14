import { useState } from 'react';
import LevelSelect from './components/LevelSelect/LevelSelect';
import LevelIntro from './components/LevelIntro/LevelIntro';
import GameSession from './components/GameSession/GameSession';
import Summary from './components/Summary/Summary';
import HighScores from './components/HighScores/HighScores';
import Settings from './components/Settings/Settings';
import { useHighScores } from './hooks/useHighScores';
import { useTranslation } from './i18n';
import { getLevelConfig } from './logic/levelConfig';
import type { SessionResult, View } from './types/game';
import './App.css';

function App() {
  const { dir, t } = useTranslation();
  const { highScores, updateHighScore, resetHighScores } = useHighScores();
  const [currentView, setCurrentView] = useState<View>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [gameSessionKey, setGameSessionKey] = useState(0);

  const startGameForLevel = (level: number) => {
    setSelectedLevel(level);
    setCurrentView('levelIntro');
  };

  const startGameFromIntro = () => {
    setGameSessionKey((prev) => prev + 1);
    setCurrentView('game');
  };

  const handleSessionComplete = (result: SessionResult) => {
    updateHighScore(selectedLevel, result);
    setLastResult(result);
    setCurrentView('summary');
  };

  const handleTryAgain = () => {
    setGameSessionKey((prev) => prev + 1);
    setCurrentView('game');
  };

  const clockFeatures = getLevelConfig(selectedLevel).clockFeatures;

  let content: React.ReactNode;

  switch (currentView) {
    case 'levelSelect':
      content = (
        <LevelSelect
          highScores={highScores}
          onSelectLevel={startGameForLevel}
          onViewHighScores={() => setCurrentView('highScores')}
        />
      );
      break;
    case 'levelIntro':
      content = (
        <LevelIntro
          level={selectedLevel}
          onStart={startGameFromIntro}
          onBack={() => setCurrentView('levelSelect')}
        />
      );
      break;
    case 'game':
      content = (
        <GameSession
          key={gameSessionKey}
          level={selectedLevel}
          onComplete={handleSessionComplete}
          onQuit={() => setCurrentView('levelSelect')}
        />
      );
      break;
    case 'summary':
      content = lastResult ? (
        <Summary
          result={lastResult}
          clockFeatures={clockFeatures}
          onTryAgain={handleTryAgain}
          onLevelSelect={() => setCurrentView('levelSelect')}
        />
      ) : (
        <LevelSelect
          highScores={highScores}
          onSelectLevel={startGameForLevel}
          onViewHighScores={() => setCurrentView('highScores')}
        />
      );
      break;
    case 'highScores':
      content = <HighScores highScores={highScores} onBack={() => setCurrentView('levelSelect')} />;
      break;
    case 'settings':
      content = (
        <Settings
          onBack={() => setCurrentView('levelSelect')}
          onResetScores={resetHighScores}
        />
      );
      break;
    default:
      content = (
        <LevelSelect
          highScores={highScores}
          onSelectLevel={startGameForLevel}
          onViewHighScores={() => setCurrentView('highScores')}
        />
      );
      break;
  }

  return (
    <div className="app" dir={dir}>
      <button
        type="button"
        className="app__settings-button"
        onClick={() => setCurrentView('settings')}
        aria-label={t.settings}
        title={t.settings}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      {content}
    </div>
  );
}

export default App;