import { Question } from './types';

export const questions: Question[] = [
  ...Array.from({ length: 75 }, (_, i) => ({
    id: `DAILY-Q${i + 1}`,
    question: `Daily question ${i + 1}?`,
    hindiMeaning: `दैनिक प्रश्न ${i + 1}`,
    category: "daily_routine" as const,
    topic: "Morning routine",
    difficulty: "easy" as const,
    expectedIntent: "Asking",
    acceptableAnswerExamples: ["Yes", "No"],
  })),
  ...Array.from({ length: 75 }, (_, i) => ({
    id: `WRK-Q${i + 1}`,
    question: `Workplace question ${i + 1}?`,
    hindiMeaning: `काम का प्रश्न ${i + 1}`,
    category: "workplace" as const,
    topic: "Attendance",
    difficulty: "easy" as const,
    expectedIntent: "Asking",
    acceptableAnswerExamples: ["Yes", "No"],
  })),
];
