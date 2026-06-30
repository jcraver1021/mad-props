export type Op = "+" | "−" | "×" | "÷";
export type DisplayFormat = "horizontal" | "vertical";

export interface Problem {
  a: number;
  b: number;
  op: Op;
  answer: number;
}

export interface ProblemHistoryEntry {
  problem: Problem;
  userAnswer: number;
  ok: boolean;
}

export interface GameSettings {
  ops: Op[];
  maxOperand: number;
  /** When true, subtraction results may be negative (introduced ~Grade 6). */
  allowNegative: boolean;
}

export const DURATION_SECONDS = 60;

export const DEFAULT_SETTINGS: GameSettings = {
  ops: ["+", "−"],
  maxOperand: 10,
  allowNegative: false,
};
