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
girlfriendName: "Audrey",     // son prénom
boyfriendName:  "Billy",      // le tien
finalMessage:   "…",          // ton mot personnel, révélé mot après mot
shareMessage:   "…",          // le texte pré-rempli du partage WhatsApp
```

**Les questions : [`data/questions.ts`](data/questions.ts).**
Tout y est centralisé — texte, emoji, réactions. Rien n'est écrit en dur
dans les composants : ajouter ou retirer une question suffit, la barre de
progression et l'écran final s'ajustent seuls.

Une question peut prendre deux formes :

```ts
// forme normale : 3 ou 4 réponses au choix
{ id: 2, theme: "Sourire", question: "…", answers: [ /* 3-4 */ ] }

// forme OUI / NON, où le NON se dérobe
{
  id: 8,
  theme: "Émotions",
  mode: "yes-no",
  question: "…tu dirais oui ?",
  yesFinalText: "OUI, ÉVIDEMMENT",   // libellé du OUI une fois le NON parti
  answers: [
    { id: "yes", emoji: "❤️", text: "OUI", reaction: "…" },
    { id: "no",  emoji: "😏", text: "NON" },   // celui qui fuit
  ],
}
```

Les questions **2, 4, 6, 8 et 10** utilisent ce mode : une question sur
deux, en alternance avec les questions à choix. Pour l'appliquer ailleurs,
il suffit d'ajouter `mode: "yes-no"` et de ramener `answers` à deux
entrées, le OUI en premier.

Trois réglages facultatifs empêchent la plaisanterie de se répéter à
l'identique cinq fois de suite :

```ts
evasiveAttempts: 5,          // esquives avant qu'il renonce (défaut : 7)
taunts: ["…", "…"],          // piques propres à la question
surrenderMessage: "…",       // son mot de la fin
```

Le nombre d'esquives monte au fil du quiz — 3, 4, 5, 6 puis 7 — et chaque
question a ses propres piques, si bien que le bouton devient un gag
récurrent qui s'étire au lieu de lasser. Sans ces champs, les valeurs
communes du même fichier servent (`evasiveTaunts`, `evasiveSurrender`).

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
├── YesNoAnswers.tsx    le duo OUI / NON et ses piques
├── EvasiveButton.tsx   le bouton qui se dérobe (souris, doigt, stylet)
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

### Le bouton NON qui s'échappe

`EvasiveButton` est autonome et réutilisable :

```tsx
<EvasiveButton
  label="😏 NON"
  evasive
  maxAttempts={7}
  playAreaRef={areaRef}   // la zone où il a le droit de fuir
  avoidRef={yesRef}       // ce qu'il ne doit jamais recouvrir
  onEscape={setAttempts}
  onSurrender={() => setHasSurrendered(true)}
  onClick={() => onSelect(no)}
/>
```

- **Un seul code pour la souris, le doigt et le stylet** : tout passe par les
  Pointer Events. À la souris il fuit *avant* le survol, par détection de
  proximité ; au doigt il fuit sur `pointerdown`, donc avant que le clic
  ne parte.
- **Il ne s'active jamais au pointeur.** On ne peut pas distinguer un clic
  tactile d'une activation clavier — Chrome met `event.detail` à `0` dans les
  deux cas — donc le clic est toujours bloqué et le clavier est traité à part,
  dans `onKeyDown`. Tab puis Entrée fonctionnent : le quiz ne bloque personne.
- **Il ne peut pas casser la page.** Il est en position absolue dans sa zone
  de jeu et n'est déplacé que par des transformations : jamais de scroll
  horizontal, jamais de barre de défilement, jamais de hauteur qui change.
  Le bloc des piques a une hauteur fixe pour la même raison.
- **Les destinations sont calculées, jamais codées en dur** : à chaque
  esquive il tire des positions au hasard dans sa zone, écarte celles qui
  sont trop proches du doigt, celles qui recouvriraient le OUI et celles
  qui sont hors bornes, puis en choisit une. Si aucune ne passe, les
  contraintes sont relâchées une à une — il reste toujours une issue.
- **La difficulté monte puis retombe** : il accélère jusqu'aux trois quarts
  des tentatives, puis s'essouffle et se laisse approcher. Une fois son
  quota d'esquives épuisé il renonce, s'évapore, et le OUI devient
  « OUI, ÉVIDEMMENT ».

---

## 5. Notes

- Le bouton WhatsApp passe par `https://wa.me/?text=…` : il ouvre
  l'application native sur téléphone, WhatsApp Web sur ordinateur.
- « Copier le lien » utilise l'API presse-papiers, avec une invite de
  secours si le navigateur la refuse (contexte non sécurisé).
- L'aperçu du lien dans WhatsApp (titre et description) se règle dans
  `metadata`, en haut de `app/layout.tsx`.
