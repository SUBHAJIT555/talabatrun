# Talabat Run

Portrait event kiosk game. A participant registers, plays a 60-second runner, and can appear on a leaderboard. The game is 2D/2.5D so it can stay smooth on an old low-end Windows PC with no dedicated GPU.

Read [`requirement.md`](requirement.md) before implementing features. That file is the product and technical specification. If an implementation choice conflicts with it, follow `requirement.md`.

## Tech stack

- Next.js 16 (App Router), React, TypeScript
- Tailwind CSS 4
- Phaser 4 for the future game loop
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Zustand for later application-level state only
- ESLint
- Vercel

## Installation

```bash
npm install
```

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`requirement.md` also lists `SUPABASE_SERVICE_ROLE_KEY` for a later secure score-submission step. That key is server-only. Do not prefix it with `NEXT_PUBLIC_` and do not import it into client code. It is not required for this foundation.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Architecture

Next.js owns routes and application UI:

- `/` start
- `/register` registration
- `/game` Phaser host
- `/result` result
- `/leaderboard` leaderboard

These routes are placeholders. Phaser is not started yet.

Phaser must run only in the browser. The game route is a Client Component and loads `GameCanvas` with `ssr: false`, which Next.js 16 requires. `GameCanvas` is the later mount point for `Phaser.Game`. React must not own the game loop, and gameplay must not depend on network calls.

Zustand is installed for future application state such as the current participant, session id, and final result. Do not store runner position, food positions, collisions, animations, or per-frame timer updates in Zustand or React.

Joystick support will live in `src/game/input/`. The Gamepad API is not polled yet.

Browser and server Supabase clients live in `src/lib/supabase/`. Registration, score submission, and leaderboard queries are not implemented yet.
