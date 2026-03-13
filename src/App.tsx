import { useState } from 'react';
import LevelSelect from './components/LevelSelect/LevelSelect';
import GameSession from './components/GameSession/GameSession';
import Summary from './components/Summary/Summary';
import HighScores from './components/HighScores/HighScores';
import LanguageToggle from './components/common/LanguageToggle';
import { useHighScores } from './hooks/useHighScores';
import { useTranslation } from './i18n';
import { getLevelConfig } from './logic/levelConfig';
import type { SessionResult, View } from './types/game';
import './App.css';

function App() {
  const { dir } = useTranslation();
  const { highScores, updateHighScore } = useHighScores();
  const [currentView, setCurrentView] = useState<View>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [gameSessionKey, setGameSessionKey] = useState(0);

  const startGameForLevel = (level: number) => {
    setSelectedLevel(level);
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
      <div className="app__language-toggle">
        <LanguageToggle />
      </div>
      {content}
    </div>
  );
}

export default App;