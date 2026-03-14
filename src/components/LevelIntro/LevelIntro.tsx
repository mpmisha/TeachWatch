import { LEVELS } from '../../logic/levelConfig';
import { useTranslation } from '../../i18n';
import './LevelIntro.css';

interface LevelIntroProps {
  level: number;
  onStart: () => void;
  onBack: () => void;
}

export default function LevelIntro({ level, onStart, onBack }: LevelIntroProps) {
  const { t } = useTranslation();
  const levelConfig = LEVELS[level - 1] ?? LEVELS[0];
  const translatedLevel = t.levels[level - 1] ?? {
    name: levelConfig.name,
    description: levelConfig.description,
    learningGoal: levelConfig.learningGoal,
    tips: [],
  };

  return (
    <section className="level-intro" aria-labelledby="level-intro-title">
      <article className="level-intro__card">
        <span className="level-intro__badge">{t.levelLabel(level)}</span>

        <header className="level-intro__header">
          <p className="level-intro__kicker">{t.levelIntroTitle}</p>
          <h1 id="level-intro-title" className="level-intro__title">
            {translatedLevel.name}
          </h1>
        </header>

        <p className="level-intro__description">{translatedLevel.description}</p>

        <div className="level-intro__goal">
          <strong>{t.levelIntroGoalLabel}</strong>
          <p>{translatedLevel.learningGoal}</p>
        </div>

        <div className="level-intro__tips" aria-labelledby="level-intro-tips-title">
          <strong id="level-intro-tips-title">{t.levelIntroTipsLabel}</strong>
          <ul className="level-intro__tips-list">
            {translatedLevel.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        <button type="button" className="level-intro__start-btn" onClick={onStart}>
          {t.levelIntroStart}
        </button>

        <button type="button" className="level-intro__back-btn" onClick={onBack}>
          {t.back}
        </button>
      </article>
    </section>
  );
}