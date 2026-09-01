import { Unit } from './skillGoTypes';
import * as Content from './skillGoContent';

export const UNITS: Unit[] = [
  {
    id: "u1",
    title: "Warehouse Floor Basics",
    desc: "Everyday phrases you'll use in your first week",
    phrases: Content.U1_PHRASES,
    drill: Content.U1_DRILL,
    apply: Content.U1_APPLY,
    unlockAfter: null,
    applyThreshold: 6
  },
  {
    id: "u2",
    title: "Daily Work Sentences",
    desc: "Present, past & future — the mistakes that give away broken English",
    phrases: Content.U2_PHRASES,
    drill: Content.U2_DRILL,
    apply: Content.U2_APPLY,
    unlockAfter: "u1",
    applyThreshold: 6
  }
];
