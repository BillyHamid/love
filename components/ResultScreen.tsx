"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import TypewriterText from "@/components/TypewriterText";
import CouplePhoto from "@/components/CouplePhoto";
import ShareButtons from "@/components/ShareButtons";
import { useQuiz } from "@/lib/quiz-store";
import { personalize } from "@/lib/quiz";
import { quizConfig } from "@/lib/config";

/**
 * L'écran final est long : chaque carte se révèle quand elle entre à
 * l'écran, et ses lignes s'enchaînent à l'intérieur. Rien ne se joue
 * hors du champ de vision, la lecture guide le rythme.
 */
const card = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.45,
      delayChildren: 0.25,
    },
  },
} as const;

const line = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
} as const;

/** Réglages communs à toutes les cartes révélées au scroll. */
const inView = {
  variants: card,
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.25 },
} as const;

export default function ResultScreen() {
  const router = useRouter();
  const { hydrated, answeredCount, reset } = useQuiz();

  // Arriver ici sans avoir joué n'a aucun sens : retour à l'accueil.
  useEffect(() => {
    if (hydrated && answeredCount === 0) router.replace("/");
  }, [hydrated, answeredCount, router]);

  const replay = () => {
    reset();
    router.push("/");
  };

  if (!hydrated || answeredCount === 0) return null;

  return (
    <div className="relative flex flex-1 flex-col justify-center py-8">
      <FloatingHearts count={16} variant="ambient" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Le verdict */}
        <motion.section {...inView} className="card-surface px-7 py-9 text-center">
          <motion.p
            variants={line}
            className="text-[0.7rem] font-semibold tracking-[0.22em] text-rose uppercase"
          >
            ❤️ Résultat officiel ❤️
          </motion.p>

          <motion.h1
            variants={line}
            className="mt-5 font-display text-[1.85rem] leading-[1.22] text-ink text-balance"
          >
            Tu es officiellement coupable…
          </motion.h1>

          <motion.p
            variants={line}
            className="mt-3 font-display text-[1.3rem] leading-snug text-plum text-balance"
          >
            d’avoir pris une place beaucoup trop importante dans mon cœur.
          </motion.p>
        </motion.section>

        {/* Le « laboratoire » */}
        <motion.section {...inView} className="card-surface px-7 py-8 text-center">
          <motion.p
            variants={line}
            className="text-[0.95rem] leading-relaxed text-muted text-balance"
          >
            Après analyse de tes réponses, notre laboratoire scientifique très
            sérieux 🧪 a confirmé que…
          </motion.p>

          <motion.p
            variants={line}
            className="mt-5 font-display text-[1.75rem] leading-tight text-rose text-balance"
          >
            Tu me plais énormément. ❤️
          </motion.p>

          <motion.p variants={line} className="mt-6 text-[0.95rem] text-muted">
            Et malheureusement pour toi…
          </motion.p>

          <motion.p
            variants={line}
            className="mt-2 font-display text-[1.3rem] leading-snug text-ink text-balance"
          >
            Je n’ai absolument aucune intention de te laisser repartir. 😏❤️
          </motion.p>
        </motion.section>

        {/* La récompense */}
        <motion.section {...inView} className="card-surface px-7 py-8 text-center">
          <motion.p variants={line} className="font-display text-[1.2rem] text-ink">
            Merci d’avoir joué, mon amour.
          </motion.p>

          <motion.p variants={line} className="mt-4 text-[0.95rem] text-muted">
            Maintenant, tu as droit à ta récompense…
          </motion.p>

          <motion.p
            variants={line}
            className="mt-3 font-display text-[1.45rem] leading-snug text-rose text-balance"
          >
            Un énorme câlin de ton homme. 🥰
          </motion.p>
        </motion.section>

        {/* Le mot personnel, révélé mot après mot */}
        <motion.section {...inView} className="card-surface px-7 py-9">
          <motion.div variants={line} className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-line" />
            <Heart className="size-3.5 fill-rose-soft text-rose-soft" aria-hidden="true" />
            <span className="h-px w-8 bg-line" />
          </motion.div>

          <TypewriterText
            text={personalize(quizConfig.finalMessage)}
            delay={0.2}
            className="text-center font-display text-[1.22rem] leading-[1.55] text-ink text-pretty"
          />

          <motion.p
            variants={line}
            className="mt-6 text-center text-[0.85rem] tracking-wide text-muted"
          >
            — {quizConfig.boyfriendName}
          </motion.p>
        </motion.section>

        {/* Photo optionnelle : rien ne casse si `public/couple.jpg` est absent */}
        <CouplePhoto src={quizConfig.photoSrc} />

        {/* Partage + rejouer */}
        <motion.section {...inView} className="card-surface px-6 py-7">
          <motion.div variants={line}>
            <ShareButtons />
          </motion.div>

          <motion.button
            variants={line}
            type="button"
            onClick={replay}
            className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 text-[0.9rem] font-medium text-muted transition-colors hover:text-rose"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Rejouer ❤️
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
}
