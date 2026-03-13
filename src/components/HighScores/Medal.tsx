interface MedalProps {
  score: number;
}

function getMedal(score: number): { icon: string; label: string; tone: 'gold' | 'silver' | 'bronze' | 'none' } {
  if (score >= 10) {
    return { icon: '🥇', label: 'Gold medal', tone: 'gold' };
  }

  if (score >= 8) {
    return { icon: '🥈', label: 'Silver medal', tone: 'silver' };
  }

  if (score >= 6) {
    return { icon: '🥉', label: 'Bronze medal', tone: 'bronze' };
  }

  return { icon: '—', label: 'No medal', tone: 'none' };
}

export default function Medal({ score }: MedalProps) {
  const medal = getMedal(score);

  return (
    <span className={`medal medal--${medal.tone}`} role="img" aria-label={medal.label} title={medal.label}>
      {medal.icon}
    </span>
  );
}
