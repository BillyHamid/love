import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Export statique : l'application est 100 % côté client (aucun backend,
   * aucune base de données). Le dossier `out/` généré se déploie tel quel
   * sur Netlify, Vercel, GitHub Pages ou n'importe quel hébergeur statique.
   */
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
