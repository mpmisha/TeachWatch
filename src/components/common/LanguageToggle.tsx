import { useTranslation } from '../../i18n';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const nextLanguage = language === 'en' ? 'he' : 'en';
  const label = language === 'en' ? 'עב' : 'EN';

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={() => setLanguage(nextLanguage)}
      aria-label={`Switch language to ${nextLanguage === 'he' ? 'Hebrew' : 'English'}`}
      title={nextLanguage === 'he' ? 'Hebrew' : 'English'}
    >
      {label}
    </button>
  );
}