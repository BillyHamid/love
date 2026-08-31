import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { QuizProvider } from "@/lib/quiz-store";
import { quizConfig } from "@/lib/config";
import MusicPlayer from "@/components/MusicPlayer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

/**
 * Ces métadonnées sont ce que WhatsApp affiche dans l'aperçu du lien.
 * Volontairement mystérieuses : la surprise commence avant l'ouverture.
 */
export const metadata: Metadata = {
  title: "💌 J'ai préparé quelque chose pour toi…",
  description: `Un petit quiz. 10 questions. Une seule règle : sois honnête avec moi ❤️`,
  openGraph: {
    title: "💌 J'ai préparé quelque chose pour toi…",
    description: "Le petit quiz que tu n'aurais peut-être pas dû commencer 😏",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffaf8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <QuizProvider>
          {/* Zone sûre iOS + hauteur pleine, pour le plein écran WhatsApp. */}
          <main className="relative mx-auto flex min-h-[100svh] w-full max-w-lg flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {children}
          </main>
          {quizConfig.musicSrc ? <MusicPlayer src={quizConfig.musicSrc} /> : null}
        </QuizProvider>
      </body>
    </html>
  );
}
