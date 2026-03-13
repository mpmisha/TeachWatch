import { useTranslation } from '../../i18n';

interface MedalProps {
  score: number;
}

function getMedal(
  score: number,
  labels: { gold: string; silver: string; bronze: string; none: string },
): { icon: string; label: string; tone: 'gold' | 'silver' | 'bronze' | 'none' } {
  if (score >= 10) {
    return { icon: '🥇', label: labels.gold, tone: 'gold' };
  }

  if (score >= 8) {
    return { icon: '🥈', label: labels.silver, tone: 'silver' };
  }

  if (score >= 6) {
    return { icon: '🥉', label: labels.bronze, tone: 'bronze' };
  }

  return { icon: '—', label: labels.none, tone: 'none' };
}

export default function Medal({ score }: MedalProps) {
  const { t } = useTranslation();
  const medal = getMedal(score, {
    gold: t.goldMedal,
    silver: t.silverMedal,
    bronze: t.bronzeMedal,
    none: t.noMedal,
  });

  return (
    <span className={`medal medal--${medal.tone}`} role="img" aria-label={medal.label} title={medal.label}>
      {medal.icon}
    </span>
  );
}
