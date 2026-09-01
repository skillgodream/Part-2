export interface Sentence {
  id: string;
  hindi: string;
  english: string;
  pattern: string;
  category: "daily_routine" | "workplace";
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
}

export interface Question {
  id: string;
  question: string;
  hindiMeaning: string;
  category: "daily_routine" | "workplace";
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  expectedIntent: string;
  acceptableAnswerExamples: string[];
}

export interface Situation {
  id: string;
  category: "daily_routine" | "workplace";
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "advanced";
  objectives: string[];
  recommendedSentenceIds: string[];
  recommendedQuestionIds: string[];
  turns: { speaker: string; text: string }[];
}

export interface PracticeProgress {
  sessionsStarted: number;
  sessionsCompleted: number;
  itemsPracticed: number;
  itemsCompleted: number;
  activeSession: {
    route: string;
    topic: string;
    index: number;
    category: "daily_routine" | "workplace";
  } | null;
  streak: number;
}
