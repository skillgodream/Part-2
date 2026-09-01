export interface Phrase {
  hi: string;
  en: string;
  pron: string;
  tense?: string;
}

export interface DrillItem {
  type: 'mcq' | 'blank' | 'builder';
  hi: string;
  correct?: string;
  correctWords?: string[];
  full?: string;
  promptEn?: string;
  target?: string;
  words?: string[];
  options?: string[];
}

export interface ApplyScenario {
  situation: string;
  hi: string;
  correct: string;
  options: string[];
}

export interface Unit {
  id: string;
  title: string;
  desc: string;
  phrases: Phrase[];
  drill: DrillItem[];
  apply: ApplyScenario[];
  unlockAfter: string | null;
  applyThreshold: number;
  unlockThreshold?: number;
}
