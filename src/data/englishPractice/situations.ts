import { Situation } from './types';

export const situations: Situation[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `DAILY-SIT${i + 1}`,
    category: "daily_routine" as const,
    title: `Daily Situation ${i + 1}`,
    description: "Daily routine situation",
    difficulty: "easy" as const,
    objectives: ["Goal 1", "Goal 2"],
    recommendedSentenceIds: ["DAILY-S1"],
    recommendedQuestionIds: ["DAILY-Q1"],
    turns: [{ speaker: 'Manager', text: 'Hi!' }, { speaker: 'You', text: 'Hello!' }]
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `WRK-SIT${i + 1}`,
    category: "workplace" as const,
    title: `Workplace Situation ${i + 1}`,
    description: "Workplace situation",
    difficulty: "easy" as const,
    objectives: ["Goal 1", "Goal 2"],
    recommendedSentenceIds: ["WRK-S1"],
    recommendedQuestionIds: ["WRK-Q1"],
    turns: [{ speaker: 'Manager', text: 'Hi!' }, { speaker: 'You', text: 'Hello!' }]
  })),
];
