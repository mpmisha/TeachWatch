export type Language = 'en' | 'he';

export interface LevelTranslation {
  name: string;
  description: string;
  learningGoal: string;
  tips: string[];
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
  levelIntroTitle: string;
  levelIntroGoalLabel: string;
  levelIntroTipsLabel: string;
  levelIntroStart: string;

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
  hintButton: string;
  hintClose: string;
  hintsEnabled: string;
  hintLevelMessages: string[];
  language: string;
  resetScores: string;
  resetScoresConfirm: string;
  resetScoresDone: string;

  levels: LevelTranslation[];
}

export interface RawTranslationStrings {
  chooseYourAdventure: string;
  appTitle: string;
  trophyRoom: string;
  availableLevels: string;

  startLevel: string;
  topScore: string;
  best: string;
  readyToPlay: string;
  notPlayedYet: string;
  levelIntroTitle: string;
  levelIntroGoalLabel: string;
  levelIntroTipsLabel: string;
  levelIntroStart: string;

  levelGameSession: string;
  quit: string;
  preparingQuestions: string;
  questionProgress: string;
  currentQuestion: string;
  nextQuestion: string;
  answerChoices: string;

  correct: string;
  notQuite: string;

  clockAriaLabel: string;

  sessionComplete: string;
  greatEffort: string;
  scoreOutOf10: string;
  completedIn: string;
  perfectRound: string;
  tryAgain: string;
  levelSelect: string;
  starsAriaLabel: string;

  trickyTimes: string;
  questionsToRetry: string;
  correctLabel: string;
  youPicked: string;

  progressTracker: string;
  back: string;
  scoresByLevel: string;
  levelLabel: string;
  levelAriaLabel: string;
  bestScore: string;
  fastestTime: string;
  lastPlayed: string;
  unknownDate: string;
  scoreOf10: string;

  goldMedal: string;
  silverMedal: string;
  bronzeMedal: string;
  noMedal: string;

  settings: string;
  settingsTitle: string;
  hintButton: string;
  hintClose: string;
  hintsEnabled: string;
  hintLevelMessages: string[];
  language: string;
  resetScores: string;
  resetScoresConfirm: string;
  resetScoresDone: string;

  levels: LevelTranslation[];
}