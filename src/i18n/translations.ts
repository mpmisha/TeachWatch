export type Language = 'en' | 'he';

export interface LevelTranslation {
  name: string;
  description: string;
  learningGoal: string;
}

export interface TranslationStrings {
  chooseYourAdventure: string;
  appTitle: string;
  trophyRoom: string;
  availableLevels: string;

  startLevel: (level: number, name: string) => string;
  topScore: string;
  best: string;
  readyToPlay: string;
  notPlayedYet: string;

  levelGameSession: (level: number) => string;
  quit: string;
  preparingQuestions: string;
  questionProgress: string;
  currentQuestion: string;
  nextQuestion: string;
  answerChoices: string;

  correct: string;
  notQuite: string;

  clockAriaLabel: (hours: number, minutes: string) => string;

  sessionComplete: string;
  greatEffort: string;
  scoreOutOf10: (score: number) => string;
  completedIn: (duration: string) => string;
  perfectRound: string;
  tryAgain: string;
  levelSelect: string;
  starsAriaLabel: (stars: number, max: number) => string;

  trickyTimes: string;
  questionsToRetry: string;
  correctLabel: string;
  youPicked: string;

  progressTracker: string;
  back: string;
  scoresByLevel: string;
  levelLabel: (level: number) => string;
  levelAriaLabel: (level: number, name: string) => string;
  bestScore: string;
  fastestTime: string;
  lastPlayed: string;
  unknownDate: string;
  scoreOf10: (score: number) => string;

  goldMedal: string;
  silverMedal: string;
  bronzeMedal: string;
  noMedal: string;

  settings: string;
  settingsTitle: string;
  language: string;
  resetScores: string;
  resetScoresConfirm: string;
  resetScoresDone: string;

  levels: LevelTranslation[];
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    chooseYourAdventure: 'Choose Your Adventure',
    appTitle: 'TeachWatch',
    trophyRoom: 'Trophy Room',
    availableLevels: 'Available levels',

    startLevel: (level, name) => `Start level ${level}: ${name}`,
    topScore: 'Top Score',
    best: 'Best',
    readyToPlay: 'Ready to play',
    notPlayedYet: 'Not played yet',

    levelGameSession: (level) => `Level ${level} game session`,
    quit: 'Quit',
    preparingQuestions: 'Preparing questions...',
    questionProgress: 'Question progress',
    currentQuestion: 'Current question',
    nextQuestion: 'Next question...',
    answerChoices: 'Answer choices',

    correct: 'Correct! \u2713',
    notQuite: 'Not quite!',

    clockAriaLabel: (hours, minutes) => `Analog clock showing ${hours}:${minutes}`,

    sessionComplete: 'Session Complete',
    greatEffort: 'Great effort!',
    scoreOutOf10: (score) => `${score} out of 10`,
    completedIn: (duration) => `Completed in ${duration}`,
    perfectRound: 'Perfect round. Every clock was right on time!',
    tryAgain: 'Try Again',
    levelSelect: 'Level Select',
    starsAriaLabel: (stars, max) => `${stars} out of ${max} stars`,

    trickyTimes: 'Tricky Times',
    questionsToRetry: 'Questions to practice again',
    correctLabel: 'Correct:',
    youPicked: 'You picked:',

    progressTracker: 'Progress Tracker',
    back: 'Back',
    scoresByLevel: 'Scores by level',
    levelLabel: (level) => `Level ${level}`,
    levelAriaLabel: (level, name) => `Level ${level}: ${name}`,
    bestScore: 'Best Score',
    fastestTime: 'Fastest Time',
    lastPlayed: 'Last Played',
    unknownDate: 'Unknown date',
    scoreOf10: (score) => `${score}/10`,

    goldMedal: 'Gold medal',
    silverMedal: 'Silver medal',
    bronzeMedal: 'Bronze medal',
    noMedal: 'No medal',

    settings: 'Settings',
    settingsTitle: 'Settings',
    language: 'Language',
    resetScores: 'Reset All Scores',
    resetScoresConfirm: 'Are you sure? This will erase all your high scores.',
    resetScoresDone: 'Scores have been reset!',

    levels: [
      {
        name: 'Hours Only',
        description: 'Read the hour hand on a friendly clock.',
        learningGoal: 'Understanding the "Little Hand" and its position.',
      },
      {
        name: 'The Half-Hour',
        description: 'Learn what happens when the big hand points down.',
        learningGoal: 'Introduction of the "Big Hand" and its 180-degree flip.',
      },
      {
        name: 'Five-Minute Jumps',
        description: 'Count by fives around the clock.',
        learningGoal: 'Learning the "Secret Identity" of numbers (e.g., 4 = 20).',
      },
      {
        name: 'The Minute Tracker',
        description: 'Read any minute on the clock.',
        learningGoal: 'Counting individual ticks between 5-minute labels.',
      },
      {
        name: 'Standard Clock',
        description: 'A real clock - no helper labels.',
        learningGoal: 'Removing the 5-minute helper labels; relying on memory.',
      },
      {
        name: 'The Expert',
        description: 'No numbers at all - just the hands and ticks.',
        learningGoal: 'Removing all numbers; relying on spatial orientation only.',
      },
    ],
  },
  he: {
    chooseYourAdventure: 'בחרו את ההרפתקה שלכם',
    appTitle: 'TeachWatch',
    trophyRoom: 'חדר הגביעים',
    availableLevels: 'שלבים זמינים',

    startLevel: (level, name) => `התחל שלב ${level}: ${name}`,
    topScore: 'שיא',
    best: 'הכי טוב',
    readyToPlay: 'מוכן לשחק',
    notPlayedYet: 'עדיין לא שוחק',

    levelGameSession: (level) => `סשן משחק שלב ${level}`,
    quit: 'יציאה',
    preparingQuestions: 'מכין שאלות...',
    questionProgress: 'התקדמות שאלות',
    currentQuestion: 'שאלה נוכחית',
    nextQuestion: 'שאלה הבאה...',
    answerChoices: 'אפשרויות תשובה',

    correct: '!נכון \u2713',
    notQuite: '!לא בדיוק',

    clockAriaLabel: (hours, minutes) => `שעון אנלוגי שמציג ${hours}:${minutes}`,

    sessionComplete: 'המשחק הסתיים',
    greatEffort: '!מאמץ מעולה',
    scoreOutOf10: (score) => `${score} מתוך 10`,
    completedIn: (duration) => `הושלם תוך ${duration}`,
    perfectRound: '!סיבוב מושלם! כל השעונים היו נכונים',
    tryAgain: 'נסה שוב',
    levelSelect: 'בחירת שלב',
    starsAriaLabel: (stars, max) => `${stars} מתוך ${max} כוכבים`,

    trickyTimes: 'זמנים מסובכים',
    questionsToRetry: 'שאלות לתרגול חוזר',
    correctLabel: ':נכון',
    youPicked: ':בחרת',

    progressTracker: 'מעקב התקדמות',
    back: 'חזרה',
    scoresByLevel: 'ציונים לפי שלב',
    levelLabel: (level) => `שלב ${level}`,
    levelAriaLabel: (level, name) => `שלב ${level}: ${name}`,
    bestScore: 'ציון הכי טוב',
    fastestTime: 'הזמן הכי מהיר',
    lastPlayed: 'שוחק לאחרונה',
    unknownDate: 'תאריך לא ידוע',
    scoreOf10: (score) => `${score}/10`,

    goldMedal: 'מדליית זהב',
    silverMedal: 'מדליית כסף',
    bronzeMedal: 'מדליית ארד',
    noMedal: 'ללא מדליה',

    settings: 'הגדרות',
    settingsTitle: 'הגדרות',
    language: 'שפה',
    resetScores: 'איפוס כל הציונים',
    resetScoresConfirm: 'בטוח? זה ימחק את כל השיאים שלך.',
    resetScoresDone: 'הציונים אופסו!',

    levels: [
      {
        name: 'שעות בלבד',
        description: 'קראו את מחוג השעות על שעון ידידותי.',
        learningGoal: 'הבנת "המחוג הקטן" ומיקומו.',
      },
      {
        name: 'חצי שעה',
        description: 'למדו מה קורה כשהמחוג הגדול מצביע למטה.',
        learningGoal: 'היכרות עם "המחוג הגדול" והסיבוב של 180 מעלות.',
      },
      {
        name: 'קפיצות של חמש',
        description: 'ספרו בחמישיות סביב השעון.',
        learningGoal: 'לימוד "הזהות הסודית" של מספרים (למשל, 4 = 20).',
      },
      {
        name: 'עוקב הדקות',
        description: 'קראו כל דקה על השעון.',
        learningGoal: 'ספירת סימונים בודדים בין תוויות של 5 דקות.',
      },
      {
        name: 'שעון רגיל',
        description: 'שעון אמיתי - בלי תוויות עזר.',
        learningGoal: 'הסרת תוויות חמש הדקות; הסתמכות על הזיכרון.',
      },
      {
        name: 'המומחה',
        description: 'בלי מספרים בכלל - רק מחוגים וסימונים.',
        learningGoal: 'הסרת כל המספרים; הסתמכות על אוריינטציה מרחבית בלבד.',
      },
    ],
  },
};