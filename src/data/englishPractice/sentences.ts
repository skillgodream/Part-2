import { Sentence } from './types';

export const sentences: Sentence[] = [
  ...Array.from({ length: 75 }, (_, i) => ({
    id: `DAILY-S${i + 1}`,
    hindi: `दैनिक क्रिया ${i + 1}`,
    english: `Daily routine sentence ${i + 1}`,
    pattern: "Subject + verb",
    category: "daily_routine" as const,
    topic: "Morning routine",
    difficulty: "easy" as const,
  })),
  ...Array.from({ length: 75 }, (_, i) => ({
    id: `WRK-S${i + 1}`,
    hindi: `काम का वाक्य ${i + 1}`,
    english: `Workplace sentence ${i + 1}`,
    pattern: "Subject + verb",
    category: "workplace" as const,
    topic: "Attendance",
    difficulty: "easy" as const,
  })),
];
