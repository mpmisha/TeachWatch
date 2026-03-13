import { LEVELS } from '../../logic/levelConfig';
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

function formatLastPlayed(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function HighScores({ highScores, onBack }: HighScoresProps) {
  return (
    <section className="high-scores" aria-labelledby="high-scores-title">
      <header className="high-scores__header">
        <div>
          <p className="high-scores__eyebrow">Progress Tracker</p>
          <h1 id="high-scores-title" className="high-scores__title">
            Trophy Room
          </h1>
        </div>

        <button type="button" className="high-scores__back" onClick={onBack}>
          Back
        </button>
      </header>

      <div className="high-scores__grid" role="list" aria-label="Scores by level">
        {LEVELS.map((level) => {
          const record = highScores[level.level];
          const isPlayed = Boolean(record);

          return (
            <article
              key={level.level}
              className={`high-scores__card ${isPlayed ? '' : 'high-scores__card--empty'}`}
              role="listitem"
              aria-label={`Level ${level.level}: ${level.name}`}
            >
              <div className="high-scores__card-head">
                <p className="high-scores__level">Level {level.level}</p>
                <Medal score={record?.bestScore ?? 0} />
              </div>

              <h2 className="high-scores__name">{level.name}</h2>

              {isPlayed && record ? (
                <dl className="high-scores__stats">
                  <div className="high-scores__stat-row">
                    <dt>Best Score</dt>
                    <dd>{record.bestScore}/10</dd>
                  </div>
                  <div className="high-scores__stat-row">
                    <dt>Fastest Time</dt>
                    <dd>{formatDuration(record.fastestTime)}</dd>
                  </div>
                  <div className="high-scores__stat-row">
                    <dt>Last Played</dt>
                    <dd>
                      <time dateTime={record.lastPlayed}>{formatLastPlayed(record.lastPlayed)}</time>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="high-scores__empty" aria-label="Not played yet">
                  Not played yet
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
