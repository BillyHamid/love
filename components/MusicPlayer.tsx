"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";

interface MusicPlayerProps {
  src: string;
}

/**
 * Bouton musique flottant.
 * Rien ne démarre tout seul : la lecture exige un clic, comme il se doit
 * (et comme l'exigent de toute façon les navigateurs mobiles).
 *
 * Si `public/music.mp3` n'existe pas, le bouton disparaît silencieusement.
 * Deux garde-fous sont nécessaires : la page étant pré-rendue, le 404 peut
 * survenir *avant* l'hydratation — auquel cas `onError` n'est jamais appelé
 * et seul l'état de l'élément, relu au montage, révèle l'échec.
 */
export default function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Fichier absent ou format non supporté : on s'efface proprement.
      setIsAvailable(false);
    }
  };

  const unavailable = () => {
    setIsAvailable(false);
    setIsPlaying(false);
  };

  // Échec survenu avant l'hydratation : l'événement est passé, pas l'état.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio?.error) unavailable();
  }, []);

  if (!isAvailable) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="metadata"
        onError={unavailable}
        onEnded={() => setIsPlaying(false)}
      />

      <motion.button
        type="button"
        onClick={toggle}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        whileTap={{ scale: 0.94 }}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Mettre la musique en pause" : "Lancer la musique"}
        className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-40 flex min-h-11 items-center gap-2 rounded-full border border-line bg-white/85 px-3.5 py-2 text-[0.8rem] font-medium text-muted shadow-soft backdrop-blur-md"
      >
        {isPlaying ? (
          <Pause className="size-3.5 fill-current text-rose" aria-hidden="true" />
        ) : (
          <Music className="size-3.5 text-rose" aria-hidden="true" />
        )}
        Musique
      </motion.button>
    </>
  );
}
