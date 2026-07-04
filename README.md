# FluentRoom

**Comprends l'anglais réel. Réponds sans bloquer.**

FluentRoom est une app web premium pour francophones qui transforme des
mini-scènes d'anglais parlé en entraînement quotidien : écouter, comprendre,
décoder, répéter, répondre, retenir.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

Build de production :

```bash
npm run build && npm start
```

Aucune clé d'API n'est nécessaire : la V1 fonctionne entièrement avec des
données seed locales et `localStorage`.

## Stack

- **Next.js 16** (App Router) + **TypeScript strict**
- **Tailwind CSS v4** (design tokens custom dans `app/globals.css`)
- **Framer Motion** (animations, transitions, completion screen)
- **Web Speech API** — synthèse vocale pour les dialogues, reconnaissance
  vocale pour le shadowing/speak back, avec fallbacks propres
- **localStorage** pour la progression (couche `lib/storage.ts`, remplaçable
  par Supabase sans toucher aux écrans)

## Architecture

```
app/
  page.tsx                  → landing page
  onboarding/               → onboarding en 4 étapes
  app/
    (tabs)/                 → shell app (header + bottom nav)
      today/ listen/ speak/ phrases/ progress/ settings/
    room/[id]/              → flow de room immersif (8 étapes)
components/
  ui/ layout/ room/ phrase/
data/
  rooms.ts                  → 11 rooms complètes (dialogues, quiz, décodage…)
  phrases.ts badges.ts levels.ts videoRooms.ts
lib/
  progress.ts               → logique streak/XP/badges/spaced repetition
  useProgress.ts            → store React (useSyncExternalStore + localStorage)
  speech.ts scoring.ts storage.ts utils.ts brand.ts
types/
  learning.ts               → modèle de données complet
```

Le nom du produit est centralisé dans `lib/brand.ts`.

## Méthode pédagogique

Chaque room suit le cycle : **Listen → Understand → Quick Check → Decode →
Shadowing → Speak Back → Phrase Unlock → Completed**. Les phrases débloquées
alimentent la Phrase Bank avec une révision espacée simple
(New → Seen → To review → Mastered).
