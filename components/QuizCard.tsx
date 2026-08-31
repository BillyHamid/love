"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import ReactionMessage from "@/components/ReactionMessage";
import FloatingHearts from "@/components/FloatingHearts";
import { useQuiz } from "@/lib/quiz-store";
import { getQuestion, getReaction, TOTAL_QUESTIONS } from "@/lib/quiz";
import type { Answer } from "@/data/questions";

/** Temps de lecture d'une réaction, puis passage à la suite. */
const REACTION_MS = 1400;
const NO_REACTION_MS = 480;
/** La dernière question mérite une sortie plus longue. */
const FINALE_MS = 2200;

export default function QuizCard() {
  const router = useRouter();
  const { currentIndex, answers, hydrated, answer, next } = useQuiz();
  const prefersReducedMotion = useReducedMotion();
  const cardControls = useAnimationControls();

  const [reaction, setReaction] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isFinale, setIsFinale] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = getQuestion(currentIndex);
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  // Le quiz est terminé (ou l'URL a été ouverte trop loin) : direction résultat.
  useEffect(() => {
    if (hydrated && currentIndex >= TOTAL_QUESTIONS) router.replace("/result/");
  }, [hydrated, currentIndex, router]);

  // Un minuteur en cours ne doit jamais survivre au démontage.
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleSelect = useCallback(
    (chosen: Answer) => {
      if (!question || isLocked) return;

      setIsLocked(true);
      answer(question.id, chosen.id);

      // 2. la petite vibration visuelle de la carte
      if (!prefersReducedMotion) {
        void cardControls.start({
          x: [0, -4, 4, -2, 2, 0],
          transition: { duration: 0.32, ease: "easeInOut" },
        });
      }

      // 3. la réaction, quand cette réponse en a une
      const message = getReaction(question, chosen);
      setReaction(message);

      if (isLastQuestion) setIsFinale(true);

      // 4. la transition vers la suite
      const delay = isLastQuestion
        ? FINALE_MS
        : message
          ? REACTION_MS
          : NO_REACTION_MS;

      timeoutRef.current = setTimeout(() => {
        setReaction(null);
        next();
        if (isLastQuestion) {
          router.push("/result/");
        } else {
          setIsLocked(false);
        }
      }, delay);
    },
    [question, isLocked, isLastQuestion, answer, next, router, cardControls, prefersReducedMotion],
  );

  if (!question) return null;

  const selectedAnswerId = answers[question.id] ?? null;

  return (
    <div className="relative flex flex-1 flex-col justify-center py-4">
      {isFinale ? <FloatingHearts count={22} variant="burst" zClass="z-30" /> : null}

      {/* Voile lumineux qui recouvre la carte à la toute dernière réponse. */}
      <AnimatePresence>
        {isFinale ? (
          <motion.div
            key="finale-veil"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-20 bg-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0.95] }}
            transition={{ duration: FINALE_MS / 1000, times: [0, 0.4, 1], ease: "easeIn" }}
          />
        ) : null}
      </AnimatePresence>

      <motion.section
        animate={cardControls}
        className="card-surface relative z-10 px-5 py-6 sm:px-6"
        aria-label={`Question ${currentIndex + 1} sur ${TOTAL_QUESTIONS}`}
      >
        <ProgressBar currentIndex={currentIndex} />

        <div className="mt-6 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 28, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -28, scale: 0.985 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuestionCard
                question={question}
                selectedAnswerId={selectedAnswerId}
                isLocked={isLocked}
                onSelect={handleSelect}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <ReactionMessage message={reaction} />
        </div>
      </motion.section>
    </div>
  );
}
