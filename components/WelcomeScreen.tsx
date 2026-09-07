"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import { useQuiz } from "@/lib/quiz-store";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
} as const;

export default function WelcomeScreen() {
  const router = useRouter();
  const { reset } = useQuiz();

  // Une nouvelle partie repart toujours de zéro.
  const start = () => {
    reset();
    router.push("/quiz");
  };

  return (
    <div className="relative flex flex-1 flex-col justify-center py-10">
      <FloatingHearts count={7} variant="ambient" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="card-surface relative z-10 px-7 py-11 text-center"
      >
        <motion.p variants={item} className="text-[1.6rem] leading-none">
          💌
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 font-display text-[1.9rem] leading-[1.2] text-ink text-balance"
        >
          J’ai préparé quelque chose pour toi…
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 text-[1rem] leading-relaxed text-muted text-balance"
        >
          Le petit quiz que tu n’aurais peut-être pas dû commencer 😏
        </motion.p>

        <motion.div variants={item} className="my-7 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-line" />
          <Heart className="size-3.5 text-rose-soft" aria-hidden="true" />
          <span className="h-px w-10 bg-line" />
        </motion.div>

        <motion.p
          variants={item}
          className="font-display text-[1.15rem] leading-snug text-plum text-balance lining-nums"
        >
          10 questions. Une seule règle&nbsp;: sois honnête avec moi ❤️
        </motion.p>

        <motion.button
          variants={item}
          type="button"
          onClick={start}
          whileTap={{ scale: 0.97 }}
          className="mt-9 flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-rose-deep px-6 text-[1.02rem] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(217,72,107,0.65)] transition-transform"
        >
          Commencer le quiz
          <Heart className="size-4 fill-current" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </div>
  );
}
