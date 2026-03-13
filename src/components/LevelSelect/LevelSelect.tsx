import { LEVELS } from '../../logic/levelConfig';
import { useTranslation } from '../../i18n';
import type { HighScores } from '../../types/game';
import LevelCard from './LevelCard';
import './LevelSelect.css';

interface LevelSelectProps {
  highScores: HighScores;
  onSelectLevel: (level: number) => void;
  onViewHighScores: () => void;
}

export default function LevelSelect({ highScores, onSelectLevel, onViewHighScores }: LevelSelectProps) {
  const { t } = useTranslation();

  return (
    <section className="level-select" aria-labelledby="level-select-title">
      <header className="level-select__header">
        <div>
          <p className="level-select__eyebrow">{t.chooseYourAdventure}</p>
          <h1 id="level-select-title" className="level-select__title">
            {t.appTitle}
          </h1>
        </div>

        <button type="button" className="level-select__scores" onClick={onViewHighScores}>
          {t.trophyRoom}
        </button>
      </header>

      <div className="level-select__grid" role="list" aria-label={t.availableLevels}>
        {LEVELS.map((config) => (
          <div key={config.level} role="listitem">
            <LevelCard
              config={config}
              record={highScores[config.level]}
              onClick={() => onSelectLevel(config.level)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}