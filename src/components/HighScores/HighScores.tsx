import { LEVELS } from '../../logic/levelConfig';
import { useTranslation } from '../../i18n';
import type { HighScores as HighScoresMap } from '../../types/game';
import Medal from './Medal';
import './HighScores.css';

interface HighScoresProps {
  highScores: HighScoresMap;
  onBack: () => void;
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatLastPlayed(isoDate: string, locale: string, fallback: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function HighScores({ highScores, onBack }: HighScoresProps) {
  const { t, language } = useTranslation();

  return (
    <section className="high-scores" aria-labelledby="high-scores-title">
      <header className="high-scores__header">
        <div>
          <p className="high-scores__eyebrow">{t.progressTracker}</p>
          <h1 id="high-scores-title" className="high-scores__title">
            {t.trophyRoom}
          </h1>
        </div>

        <button type="button" className="high-scores__back" onClick={onBack}>
          {t.back}
        </button>
      </header>

      <div className="high-scores__grid" role="list" aria-label={t.scoresByLevel}>
        {LEVELS.map((level) => {
          const levelText = t.levels[level.level - 1] ?? {
            name: level.name,
            description: level.description,
            learningGoal: level.learningGoal,
          };
          const record = highScores[level.level];
          const isPlayed = Boolean(record);

          return (
            <article
              key={level.level}
              className={`high-scores__card ${isPlayed ? '' : 'high-scores__card--empty'}`}
              role="listitem"
              aria-label={t.levelAriaLabel(level.level, levelText.name)}
            >
              <div className="high-scores__card-head">
                <p className="high-scores__level">{t.levelLabel(level.level)}</p>
                <Medal score={record?.bestScore ?? 0} />
              </div>

              <h2 className="high-scores__name">{levelText.name}</h2>

              {isPlayed && record ? (
                <dl className="high-scores__stats">
                  <div className="high-scores__stat-row">
                    <dt>{t.bestScore}</dt>
                    <dd>{t.scoreOf10(record.bestScore)}</dd>
                  </div>
                  <div className="high-scores__stat-row">
                    <dt>{t.fastestTime}</dt>
                    <dd>{formatDuration(record.fastestTime)}</dd>
                  </div>
                  <div className="high-scores__stat-row">
                    <dt>{t.lastPlayed}</dt>
                    <dd>
                      <time dateTime={record.lastPlayed}>
                        {formatLastPlayed(record.lastPlayed, language, t.unknownDate)}
                      </time>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="high-scores__empty" aria-label={t.notPlayedYet}>
                  {t.notPlayedYet}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
