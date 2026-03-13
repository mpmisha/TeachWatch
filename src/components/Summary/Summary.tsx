import Button from '../common/Button';
import type { ClockFeatures, SessionResult } from '../../types/game';
import StarRating from './StarRating';
import TrickyTimes from './TrickyTimes';
import './Summary.css';

interface SummaryProps {
  result: SessionResult;
  clockFeatures: ClockFeatures;
  onTryAgain: () => void;
  onLevelSelect: () => void;
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export default function Summary({
  result,
  clockFeatures,
  onTryAgain,
  onLevelSelect,
}: SummaryProps) {
  const incorrectCount = result.answers.filter((answer) => !answer.correct).length;
  const isPerfect = incorrectCount === 0;

  return (
    <section className="summary" aria-labelledby="summary-title">
      <div className="summary__card">
        <p className="summary__eyebrow">Session Complete</p>
        <h2 id="summary-title" className="summary__title">
          Great effort!
        </h2>

        <StarRating stars={result.stars} />

        <p className="summary__score">{result.score} out of 10</p>
        <p className="summary__time">Completed in {formatDuration(result.totalTime)}</p>

        {isPerfect ? (
          <p className="summary__perfect">Perfect round. Every clock was right on time!</p>
        ) : (
          <TrickyTimes
            questions={result.questions}
            answers={result.answers}
            clockFeatures={clockFeatures}
          />
        )}

        <div className="summary__actions">
          <Button onClick={onTryAgain} variant="primary" className="summary__button">
            Try Again
          </Button>
          <Button onClick={onLevelSelect} variant="secondary" className="summary__button">
            Level Select
          </Button>
        </div>
      </div>
    </section>
  );
}
