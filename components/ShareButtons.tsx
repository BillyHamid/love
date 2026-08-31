"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Link2, Send } from "lucide-react";
import { buildWhatsAppUrl, getShareUrl } from "@/lib/quiz";

export default function ShareButtons() {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // `window` n'existe qu'au montage : l'URL est lue côté client uniquement.
  useEffect(() => setShareUrl(getShareUrl()), []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Contexte non sécurisé ou permission refusée : on repasse par une
      // sélection manuelle plutôt que d'échouer en silence.
      window.prompt("Copie le lien :", shareUrl);
    }
  };

  return (
    <div className="w-full">
      <p className="mb-3.5 text-center text-[0.9rem] text-muted">
        Tu veux partager ton résultat&nbsp;? ❤️
      </p>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        {/* Un vrai lien : WhatsApp s'ouvre nativement sur mobile, en web sinon. */}
        <motion.a
          href={buildWhatsAppUrl(shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.97 }}
          className="flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose to-rose-deep px-5 text-[0.95rem] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(217,72,107,0.6)]"
        >
          <Send className="size-4" aria-hidden="true" />
          Partager sur WhatsApp
        </motion.a>

        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.97 }}
          className="flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-white/80 px-5 text-[0.95rem] font-semibold text-ink"
        >
          {copied ? (
            <Check className="size-4 text-rose" aria-hidden="true" />
          ) : (
            <Link2 className="size-4 text-rose" aria-hidden="true" />
          )}
          {copied ? "Lien copié" : "Copier le lien"}
        </motion.button>
      </div>
    </div>
  );
}
