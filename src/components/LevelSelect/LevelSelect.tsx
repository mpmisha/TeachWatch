import { LEVELS } from '../../logic/levelConfig';
import type { HighScores } from '../../types/game';
import LevelCard from './LevelCard';
import './LevelSelect.css';

interface LevelSelectProps {
  highScores: HighScores;
  onSelectLevel: (level: number) => void;
  onViewHighScores: () => void;
}

export default function LevelSelect({ highScores, onSelectLevel, onViewHighScores }: LevelSelectProps) {
  return (
    <section className="level-select" aria-labelledby="level-select-title">
      <header className="level-select__header">
        <div>
          <p className="level-select__eyebrow">Choose Your Adventure</p>
          <h1 id="level-select-title" className="level-select__title">
            TeachWatch
          </h1>
        </div>

        <button type="button" className="level-select__scores" onClick={onViewHighScores}>
          Trophy Room
        </button>
      </header>

      <div className="level-select__grid" role="list" aria-label="Available levels">
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