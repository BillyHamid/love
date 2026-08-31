"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ConfettiProps {
  /** Nombre de morceaux. */
  count?: number;
  /** Secondes avant le lancer. */
  delay?: number;
}

/** Palette de la carte, plus une pointe dorée pour la fête. */
const COLORS = ["#d9486b", "#f4b6c6", "#7a5a88", "#e8b64c", "#ffffff"] as const;

interface Piece {
  id: number;
  color: string;
  /** Position de départ, en % de la largeur. */
  from: number;
  /** Dérive horizontale, en pixels. */
  drift: number;
  /** Hauteur du saut initial, en pixels (valeur négative = vers le haut). */
  lift: number;
  width: number;
  height: number;
  rotation: number;
  duration: number;
  delay: number;
  round: boolean;
}

/**
 * Une salve de confettis : les morceaux jaillissent du bas, montent, puis
 * retombent en tournant. Aucune dépendance, aucun canvas — de simples
 * éléments animés, retirés du DOM une fois la fête finie.
 *
 * `fixed` + `pointer-events-none` + `aria-hidden` : jamais dans le flux,
 * jamais dans le chemin d’un clic, jamais lu par un lecteur d’écran.
 */
export default function Confetti({ count = 70, delay = 0.2 }: ConfettiProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Généré après le montage : la page étant pré-rendue, tirer au sort
  // pendant le rendu provoquerait un écart d’hydratation.
  useEffect(() => setIsMounted(true), []);

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#d9486b",
        from: 15 + Math.random() * 70,
        drift: (Math.random() - 0.5) * 340,
        lift: -(45 + Math.random() * 45),
        width: 6 + Math.random() * 6,
        height: 9 + Math.random() * 8,
        rotation: (Math.random() - 0.5) * 900,
        duration: 2.6 + Math.random() * 1.8,
        delay: delay + Math.random() * 0.45,
        round: Math.random() > 0.7,
      })),
    [count, delay],
  );

  // La salve ne dure qu’un temps : on libère le DOM ensuite.
  useEffect(() => {
    if (!isMounted || prefersReducedMotion) return;
    const longest = pieces.reduce((max, p) => Math.max(max, p.delay + p.duration), 0);
    const timer = setTimeout(() => setIsOver(true), (longest + 0.3) * 1000);
    return () => clearTimeout(timer);
  }, [isMounted, prefersReducedMotion, pieces]);

  if (!isMounted || prefersReducedMotion || isOver) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute bottom-0 block"
          style={{
            left: `${piece.from}%`,
            width: piece.width,
            height: piece.round ? piece.width : piece.height,
            backgroundColor: piece.color,
            borderRadius: piece.round ? "9999px" : "1px",
          }}
          initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
          animate={{
            // Montée franche, puis chute plus lente : la courbe d’un vrai jet.
            opacity: [0, 1, 1, 0],
            y: [0, `${piece.lift}svh`, "12svh"],
            x: [0, piece.drift * 0.55, piece.drift],
            rotate: [0, piece.rotation * 0.4, piece.rotation],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.15, 0.6, 0.5, 1],
            opacity: { times: [0, 0.06, 0.75, 1], duration: piece.duration, delay: piece.delay },
          }}
        />
      ))}
    </div>
  );
}
