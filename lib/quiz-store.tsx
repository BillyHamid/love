"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TOTAL_QUESTIONS } from "@/lib/quiz";

/** Réponses choisies, indexées par `question.id`. */
export type AnswerMap = Record<number, string>;

interface QuizState {
  currentIndex: number;
  answers: AnswerMap;
}

interface QuizContextValue extends QuizState {
  /** `false` tant que l'état n'a pas été relu depuis sessionStorage. */
  hydrated: boolean;
  answeredCount: number;
  isComplete: boolean;
  answer: (questionId: number, answerId: string) => void;
  next: () => void;
  reset: () => void;
}

const STORAGE_KEY = "love-quiz-state";
const EMPTY_STATE: QuizState = { currentIndex: 0, answers: {} };

const QuizContext = createContext<QuizContextValue | null>(null);

function readStoredState(): QuizState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { currentIndex, answers } = parsed as Partial<QuizState>;
    if (typeof currentIndex !== "number" || typeof answers !== "object" || !answers) {
      return null;
    }
    return {
      currentIndex: Math.min(Math.max(currentIndex, 0), TOTAL_QUESTIONS),
      answers,
    };
  } catch {
    return null;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Relecture après le montage : évite tout écart d'hydratation SSR/client.
  useEffect(() => {
    const stored = readStoredState();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  // Une simple survie au rafraîchissement de page. Aucun backend, aucun suivi.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Mode privé ou stockage refusé : le quiz fonctionne quand même.
    }
  }, [state, hydrated]);

  const answer = useCallback((questionId: number, answerId: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerId },
    }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, TOTAL_QUESTIONS),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY_STATE);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Rien à faire : l'état en mémoire est déjà réinitialisé.
    }
  }, []);

  const value = useMemo<QuizContextValue>(() => {
    const answeredCount = Object.keys(state.answers).length;
    return {
      ...state,
      hydrated,
      answeredCount,
      isComplete: answeredCount >= TOTAL_QUESTIONS,
      answer,
      next,
      reset,
    };
  }, [state, hydrated, answer, next, reset]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz doit être utilisé à l'intérieur de <QuizProvider>.");
  }
  return context;
}
