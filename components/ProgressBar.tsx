"use client";

import { motion } from "framer-motion";
import { personalize, progressPercent, TOTAL_BEATS } from "@/lib/quiz";

interface ProgressBarProps {
  /** Index du moment courant dans le récit, 0-indexé. */
  currentIndex: number;
  /** Acte en cours, affiché à gauche. */
  label: string;
}

export default function ProgressBar({ currentIndex, label }: ProgressBarProps) {
  const current = currentIndex + 1;
  const percent = progressPercent(currentIndex);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted uppercase">
          {personalize(label)}
        </p>
        <p className="font-display text-[0.95rem] text-rose tabular-nums lining-nums">{percent}%</p>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-blush"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={TOTAL_BEATS}
        aria-valuenow={current}
        aria-valuetext={`${personalize(label)} — étape ${current} sur ${TOTAL_BEATS}`}
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
