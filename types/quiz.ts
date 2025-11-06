/**
 * TypeScript types voor de quiz applicatie
 */

export type QuizState = "not-started" | "in-progress" | "finished" | "vocab-manager";

export type QuizItem = {
  latin: string;
  translations: string[];
};

export type WrongAnswer = {
  latin: string;
  translations: string[];
  userAnswer?: string;
};

export type QuizSession = {
  items: QuizItem[];
  currentIndex: number;
  score: number;
  wrongAnswers: WrongAnswer[];
  hintUsed: boolean;
};

export type CheckAnswerResult = {
  correct: boolean;
  points?: number;
  hint?: string;
  eersteLettera?: string;
  length?: number;
  answer?: string;
  next: boolean;
};

export type QuizResults = {
  score: number;
  total: number;
  percentage: number;
  cijfer: number;
  wrongAnswers: WrongAnswer[];
  playerName?: string;
  targetGrade?: number;
};
