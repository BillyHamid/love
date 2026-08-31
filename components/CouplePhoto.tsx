"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CouplePhotoProps {
  src: string;
  delay?: number;
}

/**
 * Carte photo optionnelle.
 * Tant que `public/couple.jpg` n'existe pas, le bloc se retire proprement :
 * l'application ne montre jamais d'image cassée. La page étant pré-rendue,
 * le 404 peut précéder l'hydratation — d'où la double vérification, par
 * `onError` et par relecture de l'état de l'image au montage.
 *
 * Balise `<img>` native et non `next/image` : c'est le seul moyen simple de
 * détecter l'absence du fichier, et l'export statique ne fait de toute façon
 * aucune optimisation d'image.
 */
export default function CouplePhoto({ src, delay = 0 }: CouplePhotoProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    // `complete` sans dimension = chargement terminé en échec.
    if (img?.complete && img.naturalWidth === 0) setHasFailed(true);
  }, []);

  if (hasFailed) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-line bg-white p-2 shadow-lift"
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt="Nous deux"
        loading="lazy"
        decoding="async"
        onError={() => setHasFailed(true)}
        className="h-auto w-full rounded-2xl object-cover"
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, delay, ease: "easeOut" }}
      />
    </motion.figure>
  );
}
