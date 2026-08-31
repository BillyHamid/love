# 💌 Le petit quiz

Une petite web app romantique à envoyer par un simple lien WhatsApp.
10 questions, aucune bonne ou mauvaise réponse — juste une montée
progressive de complicité, puis un écran final qui dit l'essentiel.

Pas de backend, pas de base de données, pas de compte. Tout tient dans
un export statique : un dossier `out/` qu'on dépose où on veut.

---

## 1. Ce qu'il faut personnaliser

**Un seul fichier : [`lib/config.ts`](lib/config.ts).**

```ts
girlfriendName: "Delphine",   // son prénom
boyfriendName:  "Billy",      // le tien
finalMessage:   "…",          // ton mot personnel, révélé mot après mot
shareMessage:   "…",          // le texte pré-rempli du partage WhatsApp
```

**Les questions : [`data/questions.ts`](data/questions.ts).**
Tout y est centralisé — texte, emoji, réactions. Rien n'est écrit en dur
dans les composants : ajouter ou retirer une question suffit, la barre de
progression et l'écran final s'ajustent seuls.

Dans n'importe quel texte, deux jetons sont remplacés automatiquement :

| Jeton    | Devient             |
| -------- | ------------------- |
| `{elle}` | `girlfriendName`    |
| `{moi}`  | `boyfriendName`     |

**Photo et musique (facultatives) : dossier `public/`.**

| Fichier             | Effet                                                   |
| ------------------- | ------------------------------------------------------- |
| `public/couple.jpg` | Votre photo, dans une carte, sur l'écran final.         |
| `public/music.mp3`  | Active le bouton 🎵 (lecture **uniquement** sur clic).   |

Si un fichier est absent, l'élément correspondant disparaît tout seul —
aucune image cassée, aucun bouton mort. Mets `musicSrc: null` dans
`lib/config.ts` pour retirer complètement le bouton musique.

---

## 2. Les commandes

```bash
# installer les dépendances
npm install

# lancer en local  →  http://localhost:3000
npm run dev

# vérifier le typage TypeScript
npm run typecheck

# construire la version de production  →  dossier out/
npm run build
```

`npm run build` produit un site statique complet dans `out/`.
Pour le prévisualiser exactement comme en production :

```bash
npx serve out
```

---

## 3. Le déploiement

### Netlify

Le fichier [`netlify.toml`](netlify.toml) est déjà configuré
(`command = "npm run build"`, `publish = "out"`).

```bash
npm i -g netlify-cli
netlify login
netlify deploy --build --prod
```

Par l'interface web : connecte le dépôt sur
[app.netlify.com](https://app.netlify.com/start), Netlify lit `netlify.toml`
et il n'y a rien d'autre à régler.

Sans dépôt Git, le plus rapide reste `npm run build` puis un glisser-déposer
du dossier `out/` sur [app.netlify.com/drop](https://app.netlify.com/drop).

### Vercel

```bash
npm i -g vercel
vercel          # aperçu
vercel --prod   # production
```

Vercel détecte Next.js et l'export statique automatiquement, sans
configuration.

---

## 4. L'architecture

```
app/
├── layout.tsx          police, métadonnées WhatsApp, état global, bouton musique
├── page.tsx            écran d'accueil
├── quiz/page.tsx       le quiz
├── result/page.tsx     l'écran final
└── globals.css         palette et styles de base (Tailwind v4)

components/
├── WelcomeScreen.tsx   l'accueil et son animation d'apparition
├── QuizCard.tsx        l'orchestrateur : enchaînement, réactions, finale
├── QuestionCard.tsx    une question et ses réponses
├── AnswerButton.tsx    un bouton de réponse
├── ProgressBar.tsx     « Question 4 sur 10 » + barre animée
├── ReactionMessage.tsx la petite pique après un choix
├── ResultScreen.tsx    le verdict, révélé au fil du scroll
├── MusicPlayer.tsx     le bouton 🎵 (jamais de lecture automatique)
├── ShareButtons.tsx    WhatsApp + copier le lien
├── TypewriterText.tsx  le message final, mot après mot
├── CouplePhoto.tsx     la photo, si elle existe
└── FloatingHearts.tsx  les particules

data/questions.ts       les 10 questions — le seul endroit où les écrire
lib/config.ts           prénoms, message final, chemins des médias
lib/quiz.ts             progression, réactions, lien de partage
lib/quiz-store.tsx      l'état de la partie, partagé entre les trois écrans
```

### Quelques choix

- **L'état vit dans un contexte React**, pas dans l'URL : les trois écrans se
  partagent la même partie, et une copie du lien ne divulgue aucune réponse.
- **Il survit à un rafraîchissement** via `sessionStorage` — utile dans le
  navigateur intégré de WhatsApp, qui recharge volontiers les pages. Il est
  relu après le montage, jamais pendant le rendu, pour éviter tout écart
  d'hydratation. Rien ne quitte le téléphone.
- **Export statique** (`output: "export"`) : aucun serveur à faire tourner,
  donc rien à payer et rien qui tombe en panne.
- **Photo et musique se retirent d'elles-mêmes** si le fichier manque. La page
  étant pré-rendue, l'erreur de chargement peut précéder l'hydratation : les
  deux composants vérifient donc aussi l'état réel de l'élément au montage,
  et pas seulement l'événement `onError`.
- **`prefers-reduced-motion` est respecté** : les particules disparaissent et
  les transitions se réduisent pour qui a désactivé les animations.

---

## 5. Notes

- Le bouton WhatsApp passe par `https://wa.me/?text=…` : il ouvre
  l'application native sur téléphone, WhatsApp Web sur ordinateur.
- « Copier le lien » utilise l'API presse-papiers, avec une invite de
  secours si le navigateur la refuse (contexte non sécurisé).
- L'aperçu du lien dans WhatsApp (titre et description) se règle dans
  `metadata`, en haut de `app/layout.tsx`.
