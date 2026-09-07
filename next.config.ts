import type { NextConfig } from "next";

/**
 * Configuration volontairement minimale.
 *
 * L'application est entièrement côté client (aucun backend, aucune base de
 * données) : `next build` pré-rend donc déjà chaque page en HTML statique.
 * Inutile de forcer `output: "export"` — cela sortait du chemin par défaut
 * de Vercel sans rien apporter ici.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
