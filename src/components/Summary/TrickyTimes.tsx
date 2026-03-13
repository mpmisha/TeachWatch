import { Clock } from '../Clock/Clock';
import { useTranslation } from '../../i18n';
import { formatTime } from '../../logic/timeUtils';
import type { Answer, ClockFeatures, Question } from '../../types/game';

interface TrickyTimesProps {
  questions: Question[];
  answers: Answer[];
  clockFeatures: ClockFeatures;
}

interface MistakeEntry {
  questionIndex: number;
  selectedText: string;
  correctText: string;
}

function buildMistakeEntries(questions: Question[], answers: Answer[]): MistakeEntry[] {
  return answers
    .filter((answer) => !answer.correct)
    .map((answer) => {
      const question = questions[answer.questionIndex];
      const selectedText = question?.options[answer.selectedIndex] ?? 'No answer';
      const correctText = question?.options[question.correctIndex] ?? (question ? formatTime(question.time) : 'Unknown');

      return {
        questionIndex: answer.questionIndex,
        selectedText,
        correctText,
      };
    })
    .filter((entry) => Number.isFinite(entry.questionIndex) && entry.questionIndex >= 0);
}

export default function TrickyTimes({ questions, answers, clockFeatures }: TrickyTimesProps) {
  const { t } = useTranslation();
  const mistakes = buildMistakeEntries(questions, answers);

  return (
    <section className="tricky-times" aria-labelledby="tricky-times-title">
      <h3 id="tricky-times-title" className="tricky-times__title">
        {t.trickyTimes}
      </h3>

      <div className="tricky-times__grid" role="list" aria-label={t.questionsToRetry}>
        {mistakes.map((mistake) => {
          const question = questions[mistake.questionIndex];

          if (!question) {
            return null;
          }

          return (
            <article key={mistake.questionIndex} className="tricky-times__item" role="listitem">
              <Clock
                time={question.time}
                features={clockFeatures}
                animationState="idle"
                size="86px"
                className="tricky-times__clock"
              />

              <p className="tricky-times__line">
                <span className="tricky-times__label">{t.correctLabel}</span> {mistake.correctText}
              </p>
              <p className="tricky-times__line tricky-times__line--wrong">
                <span className="tricky-times__label">{t.youPicked}</span> {mistake.selectedText}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
