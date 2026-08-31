"use client";

import { motion } from "framer-motion";
import AnswerButton from "@/components/AnswerButton";
import YesNoAnswers from "@/components/YesNoAnswers";
import type { Answer, Question } from "@/data/questions";
import { personalize } from "@/lib/quiz";

interface QuestionCardProps {
  question: Question;
  selectedAnswerId: string | null;
  isLocked: boolean;
  onSelect: (answer: Answer) => void;
}

export default function QuestionCard({
  question,
  selectedAnswerId,
  isLocked,
  onSelect,
}: QuestionCardProps) {
  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-5"
      >
        {question.intro ? (
          <p className="mb-1.5 font-display text-[1rem] text-plum">
            {personalize(question.intro)}
          </p>
        ) : null}

        <p className="mb-2.5 text-[0.7rem] font-semibold tracking-[0.18em] text-rose uppercase">
          {question.theme}
        </p>

        <h1 className="font-display text-[1.45rem] leading-[1.22] sm:text-[1.6rem] text-ink text-balance">
          {personalize(question.question)}
        </h1>
      </motion.header>

      {question.mode === "yes-no" && question.answers.length === 2 ? (
        <YesNoAnswers question={question} isLocked={isLocked} onSelect={onSelect} />
      ) : (
        <div className="flex flex-col gap-2">
          {question.answers.map((answer, index) => (
            <AnswerButton
              key={answer.id}
              answer={answer}
              index={index}
              isSelected={selectedAnswerId === answer.id}
              isLocked={isLocked}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
