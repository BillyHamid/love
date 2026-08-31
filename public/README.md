# Fichiers optionnels

Dépose ici tes deux fichiers personnels. Les deux sont **facultatifs** :
l'application fonctionne parfaitement sans eux.

| Fichier      | Effet                                                              |
| ------------ | ------------------------------------------------------------------ |
| `couple.jpg` | Affiche votre photo dans une carte élégante sur l'écran final.      |
| `music.mp3`  | Active le bouton 🎵 « Musique » (lecture uniquement sur clic).       |

Si un fichier est absent, l'élément correspondant disparaît tout seul —
aucune image cassée, aucune erreur.

Les chemins se changent dans `lib/config.ts` (`photoSrc`, `musicSrc`).
Mettre `musicSrc: null` retire complètement le bouton musique.
