import type { LevelConfig, LevelRecord } from '../../types/game';

interface LevelCardProps {
  config: LevelConfig;
  record?: LevelRecord;
  onClick: () => void;
}

export default function LevelCard({ config, record, onClick }: LevelCardProps) {
  return (
    <button
      type="button"
      className="level-card"
      onClick={onClick}
      aria-label={`Start level ${config.level}: ${config.name}`}
    >
      <div className="level-card__top-row">
        <span className="level-card__number">{config.level}</span>
        {record ? <span className="level-card__medal">Top Score</span> : null}
      </div>

      <h2 className="level-card__name">{config.name}</h2>
      <p className="level-card__goal">{config.learningGoal}</p>

      {record ? (
        <div className="level-card__record" aria-label="Best score">
          <span className="level-card__record-label">Best</span>
          <strong className="level-card__record-value">{record.bestScore}/10</strong>
        </div>
      ) : (
        <div className="level-card__record level-card__record--new" aria-label="Not played yet">
          Ready to play
        </div>
      )}
    </button>
  );
}