"use client";

import { motion } from "framer-motion";
import { progressPercent, TOTAL_QUESTIONS } from "@/lib/quiz";

interface ProgressBarProps {
  /** Index de la question courante, 0-indexé. */
  currentIndex: number;
}

export default function ProgressBar({ currentIndex }: ProgressBarProps) {
  const current = currentIndex + 1;
  const percent = progressPercent(currentIndex);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[0.8rem] font-medium tracking-wide text-muted">
          Question {current} sur {TOTAL_QUESTIONS}
        </p>
        <p className="font-display text-[0.95rem] text-rose tabular-nums lining-nums">{percent}%</p>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-blush"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-valuenow={current}
        aria-valuetext={`Question ${current} sur ${TOTAL_QUESTIONS}`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-soft via-rose to-plum"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
