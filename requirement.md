# Event Runner Game — Requirements & Technical Specification

> This file is the source of truth for Cursor/AI-assisted implementation.
> Build exactly around the constraints below. Performance and event reliability are higher priority than visual complexity.

---

## 1. Project Overview

Build a portrait-mode event kiosk game inspired by the **endless-runner feel** of games like Subway Surfers, but with much simpler controls and a health-focused collection mechanic.

The application has four primary screens:

1. **Start / Welcome page**
2. **Registration page**
3. **Game page**
4. **Leaderboard page**

The player gets **60 seconds** per game session.

During gameplay:

- The runner moves forward automatically visually.
- The player only controls **left/right movement**.
- There is **no jump**.
- There is **no slide/crawl**.
- The game contains **healthy food** and **junk food** obstacles/collectibles.
- The player should collect healthy food and avoid junk food.
- Input comes primarily from an **external joystick/game controller connected to the Windows PC**.
- Keyboard fallback must exist for testing and emergency use.

The visual style should feel **3D / premium / modern**, but the runtime must remain **2D / 2.5D** for performance.

---

# 2. Primary Goal

The #1 goal is:

> **Extremely smooth and reliable gameplay on a very old low-end Windows PC with no dedicated GPU.**

Visual quality is important, but it must never compromise frame rate or event reliability.

The game should feel visually rich by using:

- pre-rendered 3D-looking sprites
- perspective scaling
- parallax
- animated runner sprites
- fake shadows
- scrolling road/environment
- lightweight particles
- polished transitions

Do **not** use real-time 3D rendering.

---

# 3. Hardware / Display Constraints

## Physical screen

- Width: **60 cm**
- Height: **107 cm**
- Orientation: **Portrait**
- Approximate aspect ratio: **9:16**

The UI must be designed for a 9:16 portrait viewport.

## Target machine

Assume:

- old Windows PC
- low-end CPU
- integrated graphics or very weak GPU
- no dedicated GPU
- Chrome or Microsoft Edge
- Fullscreen kiosk usage

The game must remain usable even when WebGL performance is limited.

Use Phaser `AUTO` renderer so WebGL is preferred and Canvas remains available as fallback where possible.

---

# 4. Required Tech Stack

Use the following stack.

## Frontend application

- **Next.js 16.x — App Router**
  - Target current Active LTS release.
  - At project start, use the latest safe 16.x patch.
- **React** version supported by the selected Next.js release
- **TypeScript** with strict mode enabled
- **Tailwind CSS 4.x**

## Game engine

- **Phaser 4.x**
- Use standard Phaser sprites, tweens, animation manager and lightweight geometry/collision.
- Prefer current stable Phaser 4.x release.

## Backend / Database

- **Supabase**
  - PostgreSQL
  - Supabase JavaScript client
  - Supabase Realtime for leaderboard updates
  - Supabase Edge Functions or secure server-side endpoint for final score submission

## Hosting

- **Vercel**

## Controller input

- **Browser Gamepad API**
- `navigator.getGamepads()`
- `gamepadconnected`
- `gamepaddisconnected`

## Offline / reliability

- Native **Service Worker** for game asset caching
- **IndexedDB** for unsent score queue / recovery

## State management

- Use **Zustand only if necessary for application-level state**.
- Do not put frame-by-frame gameplay state in React or Zustand.

---

# 5. Explicitly Forbidden Technologies

Do **not** introduce any of the following unless requirements change later:

- Three.js
- React Three Fiber
- Unity WebGL
- Babylon.js
- Unreal Engine
- real-time 3D meshes
- GLTF/GLB runtime character models
- runtime skeletal 3D animation
- real-time dynamic lighting
- real-time shadows
- expensive shaders
- SSAO
- bloom/post-processing pipelines
- Matter.js
- unnecessary physics engines
- large animation libraries inside the Phaser game loop

Do not build gameplay using React DOM movement or React state updates.

---

# 6. Rendering Strategy

The game is a **2D / 2.5D endless runner**.

It should visually resemble a 3D runner through perspective tricks instead of true 3D.

## Core illusion

Objects originate near a vanishing point near the upper-middle part of the screen.

As objects move toward the player:

- `y` position increases
- scale increases
- horizontal lane spacing increases
- fake shadow scale increases
- z/depth ordering changes

This should create the feeling of objects traveling toward the camera/player.

## Player position

The runner should remain mostly fixed near the lower part of the screen.

Recommended:

- runner vertical position: roughly **72–82%** of game canvas height
- only horizontal lane movement is controlled by player

The world moves toward the player rather than the player physically traveling through a large world.

---

# 7. Internal Game Resolution

The game must **not** render at the physical display's native resolution if that hurts performance.

## Baseline profile

Use:

```ts
const GAME_WIDTH = 540;
const GAME_HEIGHT = 960;
```

Then scale to fit the full portrait screen.

Recommended Phaser scaling:

```ts
scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 540,
  height: 960,
}
```

## Optional performance profiles

### High

- 720 × 1280
- more particles
- richer environmental animation

### Normal — default target

- 540 × 960
- moderate/light particles
- full core visuals

### Safe

- 450 × 800
- minimal particles
- simplified environment

Do not switch profiles during a live game.

For event deployment, benchmark the exact machine beforehand and lock the appropriate profile.

---

# 8. Performance Requirements

## Target

- Target: **60 FPS**
- Gameplay should feel smooth even if actual FPS occasionally falls into the low/mid 50s.
- Avoid visible stutter and garbage-collection spikes.

## Performance budget

During gameplay:

- active gameplay objects should normally remain under **20–30**
- particles should normally remain under **30–50** active instances
- no backend API requests during the active 60-second game
- no lazy asset loading while the game is running
- no React rerenders for per-frame game data
- no runtime asset generation if it can be prepared ahead of time
- no expensive full-screen filters
- no continuous DOM measurements

## Object lifecycle

Use **object pooling**.

Do not continuously create/destroy food sprites during gameplay.

Create reusable pools for:

- healthy food
- junk food
- particles
- score popups if rendered inside Phaser

---

# 9. Application Flow

## 9.1 Start Page

Route:

```text
/
```

Responsibilities:

- event branding
- game title/logo
- attractive hero artwork
- primary CTA: `START`
- optional short instruction
- joystick connection status indicator if appropriate

Requirements:

- no Phaser game instance running in background
- light page
- optimized for portrait 9:16

---

## 9.2 Registration Page

Route:

```text
/register
```

Collect attendee information required by the event.

Initial fields should be configurable.

Suggested baseline:

- name — required
- phone — optional/configurable
- email — optional/configurable

Do not assume all fields are mandatory unless configured.

After successful registration:

1. create or identify player
2. prepare a game session
3. preload game assets
4. continue to game page

The app should not make the user wait for asset loading after pressing the final Play/Start button.

---

## 9.3 Game Page

Route:

```text
/game
```

This route hosts the Phaser canvas.

The Phaser component must be loaded client-side only.

Example architecture:

```tsx
'use client';

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
});
```

Do not instantiate Phaser on the server.

### Pre-game state

Before gameplay:

- verify assets loaded
- verify current player/session
- detect joystick
- show ready state
- show countdown

Countdown:

```text
3
2
1
GO
```

Then begin the 60-second session.

---

## 9.4 Leaderboard Page

Route:

```text
/leaderboard
```

Show:

- player rank
- player name
- score
- top players

Leaderboard should update from Supabase.

Supabase Realtime may be used so the leaderboard updates without manual refresh.

After an inactivity period, the experience may automatically return to the Start page.

Keep the timeout configurable.

---

# 10. Gameplay Rules

## Duration

Each game lasts exactly:

```text
60 seconds
```

The timer must be based on elapsed time, not frame count.

Do not implement the timer as `60 * FPS` frames.

## Lanes

Use **3 lanes** unless design later requires otherwise:

```text
LEFT
CENTER
RIGHT
```

Logical lane indexes:

```ts
0 = left
1 = center
2 = right
```

Player starts in center lane.

## Player controls

Allowed actions:

- move one lane left
- move one lane right

Not allowed:

- jump
- slide
- crouch
- vertical movement control

## Food categories

### Healthy food

Player should attempt to collect these.

Examples may include:

- apple
- banana
- avocado
- salad
- healthy drink
- other event-approved assets

### Junk food

Player should avoid these.

Examples may include:

- burger
- fries
- pizza
- soda
- donut
- other event-approved assets

## Scoring

Exact scoring values are **configurable** and must not be buried inside gameplay code.

Create central game configuration, for example:

```ts
export const GAME_RULES = {
  durationSeconds: 60,
  healthyFoodPoints: 10,
  junkFoodPenalty: 5,
};
```

The values above are initial placeholders only and can be changed without editing engine logic.

The score should never accidentally become invalid/NaN.

Whether negative scores are allowed should be configurable. Default preference: clamp score to `>= 0`.

---

# 11. Difficulty Progression

The first few seconds should be easy to understand.

Difficulty can gradually increase over the 60 seconds using:

- object travel speed
- spawn frequency
- combinations of healthy/junk food

Do not make difficulty rely on more and more active objects.

Prefer increasing object speed rather than dramatically increasing object count.

Keep all difficulty settings centralized in configuration.

Example conceptual stages:

```text
0–15 sec   easy
15–35 sec  medium
35–50 sec  faster
50–60 sec  highest intensity
```

These ranges must be configurable.

---

# 12. Runner Animation

The runner must **look 3D**, but runtime animation should be sprite-based.

## Production workflow

Recommended art pipeline:

```text
Blender / Cinema4D / other 3D tool
        ↓
Create character
        ↓
Animate character
        ↓
Render transparent frames
        ↓
Pack into texture atlas
        ↓
Phaser sprite animation
```

The browser must not render the 3D model.

## Minimum character animations

### Run loop

- 12–20 frames recommended
- target animation playback: approximately **14–18 FPS**
- continuous loop during gameplay

### Hit junk food

- approximately 6–10 frames
- short one-shot reaction
- then immediately return to run animation

### End / celebrate

- approximately 12–20 frames
- used on game completion/result transition

### Optional later

- dedicated side-step left
- dedicated side-step right

Do not require these for the first implementation.

## Lane change visual

For initial version:

- runner keeps run animation playing
- tween runner X position to adjacent lane
- apply small temporary tilt

Recommended lane transition:

```text
140–180 ms
```

Example feel:

```ts
this.tweens.add({
  targets: runner,
  x: targetX,
  duration: 160,
  ease: 'Sine.easeOut',
});
```

Small tilt may be used:

```text
left  -> approximately -4° to -7°
right -> approximately +4° to +7°
```

Do not use complex body physics for lane switching.

---

# 13. Fake Shadow / Depth

The player and approaching objects may use a lightweight shadow sprite.

Use:

- blurred transparent ellipse PNG/WebP
- alpha around 0.2–0.4
- scale based on object depth

Do not calculate real-time shadows.

---

# 14. Road and Environment

The environment should appear to move continuously toward the player.

Possible layers:

1. far background
2. distant environment
3. road
4. road markings
5. roadside props
6. game objects
7. player
8. foreground effects/HUD

Use parallax to provide depth.

Prefer reusable scrolling textures or pooled sprites.

Avoid rendering giant background images larger than necessary.

---

# 15. Collision Detection

No physics engine is required.

Use simple lightweight overlap/intersection checks.

Options:

- Phaser rectangle bounds
- circles where appropriate
- custom simplified hitboxes

Visual sprite bounds should not automatically become oversized collision bounds if transparent padding exists.

Use manually tuned hitboxes if needed.

---

# 16. Joystick / Gamepad Requirements

The external joystick is the primary gameplay controller.

Use the browser Gamepad API.

## Required support

Listen for:

```ts
window.addEventListener('gamepadconnected', ...);
window.addEventListener('gamepaddisconnected', ...);
```

During the Phaser update loop, poll:

```ts
navigator.getGamepads();
```

Do not keep a stale Gamepad object forever; read the current gamepad state repeatedly.

## Horizontal axis

Default expected control:

```text
axis 0
```

Do not permanently hardcode this assumption without allowing configuration/debugging because generic USB joysticks may map differently.

Create a joystick mapping configuration.

## Dead zone

Use an analog dead zone.

Initial default:

```ts
const DEAD_ZONE = 0.35;
```

Make this configurable.

## One movement per stick action

Do **not** trigger lane changes on every frame while the stick is held.

Correct behavior:

```text
center
  ↓
stick left
  ↓
move exactly one lane left
  ↓
holding left does nothing
  ↓
return to center
  ↓
input is armed again
```

Implement edge/dead-zone crossing detection.

## Keyboard fallback

For development and emergency event operation:

- ArrowLeft = move left
- ArrowRight = move right
- optionally A/D

Keyboard and joystick must use the same game input methods.

---

# 17. Gamepad Diagnostics

Create a small developer-only diagnostic mode/page or overlay capable of showing:

- connected controller ID
- controller index
- axis count
- button count
- current axis values
- detected left/right axis
- dead-zone value

This is important because event USB joysticks may use non-standard mappings.

Do not show diagnostic data to normal event participants.

---

# 18. Game Scene Architecture

Recommended Phaser scene structure:

```text
BootScene
PreloadScene
GameScene
```

Optional later:

```text
ResultScene
```

However, normal app Result/Leaderboard UI should preferably remain in Next.js rather than duplicating full UI inside Phaser.

## BootScene

Responsibilities:

- minimum initialization
- decide quality profile
- transition to preload

## PreloadScene

Responsibilities:

- load all required gameplay assets
- show loading progress if needed
- ensure nothing is downloaded during active gameplay

## GameScene

Responsibilities:

- countdown
- timer
- runner
- joystick polling
- lane movement
- spawning
- movement/perspective calculations
- collision
- score
- game completion

---

# 19. Next.js vs Phaser Responsibility

This boundary is mandatory.

## Next.js / React owns

- welcome screen
- registration
- page routing
- registration form
- leaderboard UI
- result UI
- app-level session context
- Supabase communication outside active gameplay
- event branding UI surrounding game where appropriate

## Phaser owns

- animation loop
- game timer
- runner position
- food positions
- collisions
- score during gameplay
- spawn system
- difficulty
- particles
- camera/game effects
- joystick polling during game

## Never do this

Do not update React state every frame with:

- runner X/Y
- food coordinates
- animation frame
- particles
- timer milliseconds

At game end, Phaser should emit one compact result object back to the app.

Example:

```ts
interface GameResult {
  score: number;
  healthyCollected: number;
  junkCollected: number;
  durationMs: number;
  completedAt: string;
}
```

---

# 20. Communication Between React and Phaser

Keep the interface small.

Suggested pattern:

```text
React creates GameCanvas
        ↓
GameCanvas creates Phaser.Game
        ↓
Phaser runs independently
        ↓
Game completes
        ↓
onGameComplete(result)
        ↓
React submits result
        ↓
Navigate to result/leaderboard
```

Do not tightly couple Phaser scenes to Next.js router internals.

---

# 21. Asset Strategy

All gameplay assets must be optimized before deployment.

## Preferred formats

- WebP for most static raster assets when transparency/quality is suitable
- PNG when required for atlas/tooling compatibility or exact alpha handling
- compressed audio suitable for browser use

## Texture atlases

Pack runner animation and related sprites into texture atlases.

Prefer:

```text
runner.png
runner.json
```

instead of dozens of independent image requests.

Pack related food/environment sprites where practical.

## Avoid

- 4K textures
- uncompressed huge PNGs
- unnecessary alpha padding
- massive sprite frames
- duplicate assets

---

# 22. Runner Asset Guidelines

For baseline 540 × 960 internal resolution:

Suggested source runner frame size:

```text
approximately 300 × 400 px
or
approximately 350 × 450 px
```

Final size depends on artwork.

The displayed runner should appear detailed enough at normal event viewing distance without consuming excessive texture memory.

Keep all animation frames consistent in canvas size and anchor point.

---

# 23. Audio

Audio is optional/configurable but architecture should allow:

- background music
- healthy-food collect sound
- junk-food hit sound
- countdown sound
- game-over sound

Preload all audio before gameplay.

No network audio streaming during the game.

Provide a global mute configuration.

---

# 24. Supabase Data Model

Use UUID primary keys.

## players

Suggested table:

```sql
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);
```

Add indexes/constraints based on final registration rules.

Do not force unique phone/email unless the event requires one attempt per attendee.

## game_sessions

Suggested table:

```sql
create table game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer,
  healthy_collected integer not null default 0,
  junk_collected integer not null default 0,
  duration_ms integer,
  status text not null default 'started',
  created_at timestamptz not null default now()
);
```

Recommended status values:

```text
started
completed
abandoned
```

Use a proper check constraint or enum-like validation if desired.

---

# 25. Leaderboard Logic

Leaderboard rules should be centralized/configurable.

Default suggested behavior:

- show highest completed score per player
- sort descending by score
- define deterministic tie-break behavior

Suggested tie-break:

1. higher score
2. earlier completion time

Do not count sessions with status other than `completed`.

Create a SQL view or RPC for leaderboard retrieval rather than duplicating aggregation logic across components.

---

# 26. Score Submission Security

Do not expose Supabase service-role keys in the browser.

Public browser keys are allowed only where intended by Supabase security design.

Use RLS.

Final score submission should preferably go through:

- Supabase Edge Function, or
- secure server-side Next.js endpoint/server action

Server-side validation should check at minimum:

- session exists
- session is active
- session has not already been completed
- score is integer and within plausible configured bounds
- collection counts are valid
- duration is within expected tolerance around 60 seconds

This does not need anti-cheat complexity comparable to an online competitive game, but simple validation is required.

---

# 27. Network Rules During Gameplay

The active 60-second game must be **network-independent**.

Sequence:

```text
register / create session
        ↓
ensure assets are available
        ↓
START GAME
        ↓
60 seconds entirely local
        ↓
GAME COMPLETE
        ↓
submit result
        ↓
leaderboard
```

During those 60 seconds:

- no Supabase requests
- no leaderboard subscriptions required by GameScene
- no asset fetching
- no analytics call that blocks gameplay

---

# 28. Offline / Event Reliability

Internet failure must not break the participant flow.

## Asset caching

Use a service worker to cache the game shell and required static game assets after initial successful load.

At minimum cache:

- JS/CSS needed for game route
- sprite atlases
- backgrounds
- fonts required by game
- audio
- essential UI assets

## Failed score submission

If Supabase/network is unavailable after game completion:

1. save the completed result locally in IndexedDB
2. mark it pending sync
3. continue the normal UX
4. retry when network returns

Do not hold the user on a spinner indefinitely.

## Queue record should include

- local queue ID
- server session ID if available
- player ID
- score
- healthy count
- junk count
- duration
- completion timestamp
- retry count

Prevent duplicate submission when retrying.

---

# 29. Fullscreen / Kiosk Behaviour

The application is intended for a dedicated event screen.

Requirements:

- portrait layout only
- occupy full viewport
- no horizontal scrolling
- no accidental text selection during game
- prevent drag behavior on images
- hide pointer cursor on game page if appropriate
- prevent page overscroll where possible
- keep game focused

Do not rely solely on browser Fullscreen API because kiosk browser configuration may control fullscreen externally.

The app must still look correct at normal browser fullscreen size.

---

# 30. Responsive Rules

Primary target is 9:16 portrait.

Use a centered 9:16 game area.

If viewport is slightly different, fit without stretching artwork disproportionately.

Phaser should use FIT scaling.

Do not distort assets independently in X/Y merely to fill the screen.

---

# 31. Suggested Project Structure

Keep the project intentionally clean.

```text
src/
├── app/
│   ├── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── game/
│   │   └── page.tsx
│   ├── result/
│   │   └── page.tsx
│   ├── leaderboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── game/
│   │   └── GameCanvas.tsx
│   └── ui/
│
├── game/
│   ├── config/
│   │   ├── game-config.ts
│   │   ├── game-rules.ts
│   │   └── quality-profiles.ts
│   │
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   └── GameScene.ts
│   │
│   ├── entities/
│   │   ├── Runner.ts
│   │   └── FoodItem.ts
│   │
│   ├── systems/
│   │   ├── InputController.ts
│   │   ├── SpawnSystem.ts
│   │   ├── CollisionSystem.ts
│   │   ├── ScoreSystem.ts
│   │   ├── PerspectiveSystem.ts
│   │   └── DifficultySystem.ts
│   │
│   ├── pools/
│   │   └── FoodPool.ts
│   │
│   └── types/
│       └── game.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── offline/
│   │   ├── score-queue.ts
│   │   └── sync-scores.ts
│   └── utils/
│
├── stores/
│   └── session-store.ts
│
└── types/
    └── app.ts

public/
├── game/
│   ├── atlases/
│   ├── food/
│   ├── backgrounds/
│   ├── environment/
│   ├── effects/
│   └── audio/
│
└── sw.js
```

Do not over-engineer this structure with unnecessary abstraction layers.

---

# 32. Central Configuration

Important gameplay values should live in one place.

Example:

```ts
export const GAME_RULES = {
  durationSeconds: 60,
  laneCount: 3,
  startingLane: 1,

  healthyFoodPoints: 10,
  junkFoodPenalty: 5,
  minimumScore: 0,

  laneTweenMs: 160,
  joystickDeadZone: 0.35,

  maxActiveFood: 20,
};
```

Do not scatter magic numbers throughout scenes.

---

# 33. Input Abstraction

Do not let GameScene directly contain all joystick-specific logic.

Create an `InputController` that exposes simple intent:

```ts
interface GameInputState {
  moveLeft: boolean;
  moveRight: boolean;
}
```

or event methods such as:

```ts
onMoveLeft();
onMoveRight();
```

Joystick and keyboard should feed the same abstraction.

This allows testing without physical hardware.

---

# 34. Spawn System

Food spawning should be deterministic enough to avoid impossible patterns.

Requirements:

- never require jumping
- player must always be able to remain/play using lane changes only
- do not spawn unfair combinations across all lanes if all are harmful and unavoidable
- avoid collisions caused by overlapping objects from the same spawn cycle
- recycle pooled objects when they pass the player

Spawn data should include:

```ts
interface SpawnedItem {
  kind: 'healthy' | 'junk';
  lane: 0 | 1 | 2;
  depth: number;
  active: boolean;
}
```

---

# 35. 2.5D Perspective System

Use normalized depth instead of arbitrary duplicated calculations.

Concept:

```text
depth = 0   -> vanishing point / far away
depth = 1   -> near player / bottom
```

Use depth to calculate:

- screen Y
- lane X spread
- scale
- shadow scale/alpha
- movement speed perception

Keep the math lightweight.

Avoid per-frame object allocations.

---

# 36. HUD

Gameplay HUD should remain simple and readable.

Show:

- remaining time
- current score

Optional:

- healthy collected
- short feedback such as `+10`
- joystick disconnected warning

HUD can be Phaser-based for maximum isolation during gameplay.

If DOM/React HUD is used, update only at low frequency / meaningful state changes, not every animation frame.

---

# 37. Visual Feedback

## Healthy collection

Use lightweight effects such as:

- tiny burst particles
- glow sprite
- `+points` popup
- positive sound

## Junk collision

Use lightweight effects such as:

- small camera shake
- red/dark overlay flash
- runner hit animation
- penalty popup
- negative sound

Do not use expensive full-screen post-processing.

---

# 38. Timing

Use real elapsed timestamps / delta time.

Gameplay duration must not depend on FPS.

If frame rate drops briefly, the game should still end after approximately 60 real seconds.

Use Phaser's timing system or a monotonic elapsed-time approach.

---

# 39. Game End

At 60 seconds:

1. stop accepting gameplay input
2. stop new spawning
3. finish/recycle active objects safely
4. stop timer
5. calculate final result once
6. emit final result to React/Next layer
7. persist/queue result
8. navigate to result or leaderboard

Never submit the same session multiple times because of repeated callbacks.

Use an explicit `isGameFinished` guard.

---

# 40. Error Handling

The participant should never see raw developer errors.

Handle gracefully:

- joystick disconnected
- network unavailable
- score submission failure
- Supabase temporarily unavailable
- missing registration state
- accidental page refresh

For a missing/invalid session, return user to a safe start/registration flow.

Log useful diagnostics to console in development.

---

# 41. Event Operator Recovery

Include an easy operator recovery mechanism.

At minimum:

- keyboard can control game
- refresh returns to safe application state
- pending offline scores are retained
- app can return to Start screen

Optional later:

- hidden admin/operator panel
- joystick calibration page
- quality profile selector
- network status
- pending score queue count

---

# 42. Environment Variables

Expected environment variables may include:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-side only if needed by secure endpoint/function deployment
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client bundles.

Use the latest supported Supabase environment naming/conventions if project setup changes.

---

# 43. Supabase RLS

Row Level Security must be enabled on public-facing tables.

Do not simply disable RLS for convenience.

Policies should be designed around the final architecture.

If writes happen through secure server/Edge Function logic, browser access should be limited accordingly.

Leaderboard reads may be public/anonymous if the event requires them.

Do not expose sensitive registration information in leaderboard queries.

Leaderboard should return only necessary public fields such as:

- display name
- score
- rank

Never return phone/email to public leaderboard UI.

---

# 44. Code Quality Rules for Cursor

Cursor must follow these implementation rules:

1. Use TypeScript strict mode.
2. Prefer simple explicit code over abstractions that provide no benefit.
3. Do not introduce dependencies unless needed.
4. Do not introduce 3D engines.
5. Do not introduce a physics engine.
6. Do not use React state for frame-by-frame gameplay.
7. Avoid allocations inside Phaser `update()` where practical.
8. Reuse objects and arrays in hot paths.
9. Keep configuration centralized.
10. Keep Next.js and Phaser concerns separated.
11. Do not fetch network resources during active gameplay.
12. Optimize assets for low-end hardware.
13. Test joystick reconnection/disconnection.
14. Preserve 9:16 portrait layout.
15. Always prefer stable frame rate over decorative effects.

---

# 45. Performance Testing Requirements

Before event deployment, test on the **actual event PC**.

Test at least:

- 10 consecutive game sessions
- controller input
- leaderboard submission
- controller disconnect/reconnect
- slow internet
- complete internet loss after game start
- internet recovery
- browser refresh
- fullscreen mode

Observe:

- FPS stability
- memory growth between sessions
- asset loading
- garbage-collection stutter
- duplicate score submissions

## Memory requirement

Destroy/reinitialize Phaser cleanly when leaving/re-entering the game route.

There must not be multiple Phaser instances after repeated sessions.

---

# 46. Acceptance Criteria

The first production-ready version is accepted when:

- Start page works correctly in portrait mode.
- Registration saves valid player/session information.
- All required game assets are loaded before gameplay begins.
- Countdown runs correctly.
- Game lasts 60 real seconds.
- Runner is visibly animated throughout gameplay.
- Joystick moves runner exactly one lane per intentional left/right input.
- Holding joystick to one side does not repeatedly skip lanes uncontrollably.
- Keyboard fallback works.
- Healthy/junk objects use convincing perspective movement.
- Healthy collection affects score correctly.
- Junk collection affects score correctly.
- Game remains visually smooth on the target low-end event PC.
- No network call is required during active gameplay.
- Final result is submitted or safely queued offline.
- Leaderboard shows valid completed scores.
- Phone/email or private registration fields are never displayed publicly.
- Replaying multiple sessions does not progressively reduce performance.

---

# 47. Implementation Order

Cursor should build this in the following sequence.

## Phase 1 — Application shell

- initialize Next.js + TypeScript + Tailwind
- create portrait layouts/routes
- Supabase setup
- start page
- registration page
- placeholder leaderboard

## Phase 2 — Phaser foundation

- client-only GameCanvas
- Phaser config
- BootScene
- PreloadScene
- GameScene
- 540 × 960 internal resolution
- basic 3-lane layout

## Phase 3 — Core gameplay

- temporary runner sprite
- running animation
- keyboard input
- lane tweening
- 60-second timer
- food spawning
- perspective movement
- collision
- scoring

## Phase 4 — Joystick

- Gamepad API
- controller detection
- axis mapping
- dead zone
- edge-triggered lane changes
- diagnostics
- disconnect/reconnect handling

## Phase 5 — Visual polish

- final runner atlas
- final food assets
- road/environment
- parallax
- fake shadows
- lightweight particles
- audio
- polished HUD

## Phase 6 — Backend integration

- secure session creation
- result submission
- leaderboard RPC/view
- Realtime if required
- RLS

## Phase 7 — Event reliability

- service worker caching
- IndexedDB score queue
- retry/sync
- error recovery
- kiosk behavior

## Phase 8 — Low-end optimization

- test actual machine
- inspect frame time
- reduce effects if necessary
- lock quality profile
- repeat-session memory testing

---

# 48. Initial Placeholder Assets

Development must not wait for final artwork.

Use temporary low-cost placeholders first:

- simple runner sprite/atlas
- colored healthy-food placeholders
- colored junk-food placeholders
- simple road texture
- simple shadow ellipse

Validate gameplay and performance before integrating final art.

Final art should be swapped without rewriting game logic.

---

# 49. Design Direction

Overall visual direction:

- modern
- clean
- event-friendly
- colorful
- premium
- highly readable
- energetic
- polished 2.5D

The game should **feel 3D**, even though it is technically 2D.

The design should avoid looking like a flat web page during gameplay.

Depth should come from:

- perspective road
- sprite scaling
- layered scenery
- parallax
- fake shadows
- motion
- foreground/background separation
- high-quality pre-rendered artwork

---

# 50. Final Architectural Principle

Always follow this priority order:

```text
1. Smooth gameplay
2. Event reliability
3. Input reliability
4. Clear game mechanics
5. Visual quality
6. Decorative effects
```

If a visual feature causes frame drops on the event PC, remove or simplify the feature.

The desired result is not technically complex 3D.

The desired result is:

> **A game that LOOKS premium and 3D-like while running as a very lightweight 2D/2.5D Phaser game.**

---

# 51. Official Technical References

- Next.js: https://nextjs.org/docs
- Phaser: https://docs.phaser.io/
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase JavaScript: https://supabase.com/docs/reference/javascript/introduction
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Gamepad API: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
- Vercel: https://vercel.com/docs

---

# 52. Cursor Instruction

Before writing or modifying code, Cursor should treat this document as the project's primary technical specification.

If an implementation decision conflicts with this file, prefer this file unless the requirement has been explicitly changed later.

In particular, Cursor must never "upgrade" the visual implementation into real-time 3D simply because the design looks three-dimensional.

The runtime remains **Phaser 4 + optimized 2D/2.5D sprites**.
