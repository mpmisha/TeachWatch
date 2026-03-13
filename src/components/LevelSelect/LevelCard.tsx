import { useTranslation } from '../../i18n';
import type { LevelConfig, LevelRecord } from '../../types/game';

interface LevelCardProps {
  config: LevelConfig;
  record?: LevelRecord;
  onClick: () => void;
}

export default function LevelCard({ config, record, onClick }: LevelCardProps) {
  const { t } = useTranslation();
  const translatedLevel = t.levels[config.level - 1] ?? {
    name: config.name,
    description: config.description,
    learningGoal: config.learningGoal,
  };

  return (
    <button
      type="button"
      className="level-card"
      onClick={onClick}
      aria-label={t.startLevel(config.level, translatedLevel.name)}
    >
      <div className="level-card__top-row">
        <span className="level-card__number">{config.level}</span>
        {record ? <span className="level-card__medal">{t.topScore}</span> : null}
      </div>

      <h2 className="level-card__name">{translatedLevel.name}</h2>
      <p className="level-card__goal">{translatedLevel.learningGoal}</p>

      {record ? (
        <div className="level-card__record" aria-label={t.bestScore}>
          <span className="level-card__record-label">{t.best}</span>
          <strong className="level-card__record-value">{record.bestScore}/10</strong>
        </div>
      ) : (
        <div className="level-card__record level-card__record--new" aria-label={t.notPlayedYet}>
          {t.readyToPlay}
        </div>
      )}
    </button>
  );
}