# CLAUDE.md — The Last Software Engineer

## Project Overview
A **Slay the Spire-style roguelike deck-building game** built as a single-page web app. The player selects a character, navigates a procedurally generated map, fights enemies with a card-based combat system, collects rewards, and progresses through acts. Satirical job-search / dev humor theme.

## Game Design Philosophy

### Inspirations
All game mechanic changes must draw inspiration from these titles:
- **Slay the Spire** — card synergies, relic interactions, act structure, rarity scaling
- **Ring of Pain** — risk/reward loops, dangerous item tradeoffs, pre-fight threat assessment
- **Monster Train 1 & 2** — unit stacking, faction synergies, boss escalation, late-game power spikes
- **Inscryption** — asymmetric cards, sacrifice mechanics, cards with dark side effects, surprise rule-breaking
- **Darkest Dungeon** — stress as a resource, punishing but fair difficulty, atmospheric dread, meaningful loss

### Core Design Pillars

**Risk & Reward** — Every fight must feel like a meaningful choice. Elites and bosses offer better loot at greater danger. Events can curse, bless, or trade. The player should constantly weigh upside vs. downside, never be on autopilot.

**Outscaling Fantasy** — Builds should have a ceiling high enough that a well-constructed deck feels unstoppable by Act 3. Confidence stacking, multi-hit chains, exhaust synergies, power card snowballs — the player should be able to break the game if they find the right pieces.

**Card Variety & Playstyle Breadth** — Each class targets multiple archetypes. No two runs should feel identical. Cards should enable niche combos, not just stat sticks. A large card pool (target ~180–210 cards) ensures variety across runs.

**Event Design Spectrum** — Events exist on a spectrum:
- **Cursed** — bad things happen, no upside (rare, dread-inducing)
- **Risk/Reward** — explicit trade (HP for gold, card for relic, etc.) with transparent costs
- **Mixed** — good outcome with a sting attached
- **Windfall** — purely positive, but rare enough to feel like luck

**Rarity & Progression Feel** — Common cards are expendable scaffolding. Rare cards define a build. Epic cards break rules. Legendary cards win runs. Each rarity tier should feel qualitatively different, not just numerically stronger.

## Tech Stack
- **Framework:** React 19 + TypeScript 5.9
- **Build tool:** Vite 7
- **State management:** Zustand 5 with Immer middleware
- **Drag and drop:** @dnd-kit/core 6
- **IDs:** uuid
- **Linting:** ESLint 9 with typescript-eslint, react-hooks, and react-refresh plugins
- **Styling:** Plain CSS (src/index.css) — no CSS framework, no CSS modules, no Tailwind
- **No test framework** — no unit tests, no testing libraries installed
- **No router** — screen transitions are state-driven via `useGameStore.screen`

## Commands
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Project Structure
```
src/
├── App.tsx                  # Root component — switches screen based on store state
├── main.tsx                 # Entry point, renders <App /> into #root
├── index.css                # All styles (single file)
├── types/index.ts           # All TypeScript types/interfaces
├── hooks/
│   └── useMobile.ts         # Mobile/landscape detection hook (compact mode)
├── store/
│   ├── gameStore.ts         # Zustand store — all game state + actions + save/load
│   └── battleActions.ts     # Pure functions for battle logic (init, play card, enemy turn)
├── data/
│   ├── cards/               # Card definitions split by class
│   │   ├── frontendCards.ts
│   │   ├── backendCards.ts
│   │   ├── architectCards.ts
│   │   ├── aiEngineerCards.ts
│   │   ├── neutralCards.ts
│   │   ├── helpers.ts       # getRewardCards, getCardDef, etc.
│   │   └── index.ts         # Barrel — re-exports `cards` record + helpers
│   ├── enemies/             # Enemy definitions split by act
│   │   ├── act1Enemies.ts
│   │   ├── act2Enemies.ts
│   │   ├── act3Enemies.ts
│   │   ├── encounters.ts    # getNormalEncounter, getEliteEncounter, getBossEncounter
│   │   └── index.ts         # Barrel — re-exports `enemies` record + encounter helpers
│   ├── events/              # Event definitions split by category
│   │   ├── neutralEvents.ts
│   │   ├── frontendEvents.ts
│   │   ├── backendEvents.ts
│   │   ├── architectEvents.ts
│   │   ├── aiEngineerEvents.ts
│   │   ├── consumableEvents.ts
│   │   └── index.ts         # Barrel — re-exports `events` array
│   ├── characters.ts        # Character definitions (starter decks, stats)
│   ├── consumables.ts       # Consumable (single-use battle item) definitions
│   └── items.ts             # Item (relic) definitions + shop helpers
├── utils/
│   ├── battleEngine.ts      # Damage/block calculation, status effect resolution
│   ├── deckUtils.ts         # createCardInstance, shuffle
│   └── mapGenerator.ts      # Procedural map generation (rows, connections)
├── components/
│   ├── battle/
│   │   ├── BattleScreen.tsx  # Main battle UI (hand, enemies, energy, end turn)
│   │   ├── CardComponent.tsx # Individual card rendering + drag source
│   │   ├── ConsumableBar.tsx # Consumable slot bar during combat
│   │   └── EnemyDisplay.tsx  # Enemy HP, intent, status effects
│   ├── common/
│   │   ├── CardPreview.tsx   # Hover card preview (desktop only)
│   │   ├── EnergyOrb.tsx     # Energy display
│   │   ├── HpBar.tsx         # HP bar component
│   │   ├── StatusEffects.tsx # Status effect icons
│   │   ├── Tooltip.tsx       # Hover tooltip
│   │   └── TopBar.tsx        # Persistent top bar (HP, gold, stress, act info)
│   └── screens/
│       ├── CharacterSelectScreen.tsx
│       ├── MapScreen.tsx
│       ├── BattleRewardScreen.tsx
│       ├── RestScreen.tsx
│       ├── EventScreen.tsx
│       ├── ShopScreen.tsx
│       ├── GameOverScreen.tsx
│       └── VictoryScreen.tsx
```

**Note:** Data directories use barrel `index.ts` files. Import paths like `'../data/enemies'` resolve to `enemies/index.ts` via Vite.

## Architecture Patterns

### State Management
- **Single Zustand store** (`useGameStore`) holds all game state: `screen`, `run`, `battle`, `pendingRewards`, `pendingEvent`.
- Store uses **Immer middleware** — mutate state directly inside `set()` callbacks.
- Actions are defined inline in the store creator, not in separate files.
- Screen navigation is state-driven: set `state.screen` to a `Screen` type value.
- **Save/load:** `gameStore.ts` persists run state to `localStorage`. Includes migration logic for renamed fields (e.g., strength→confidence).

### Game Flow
```
CHARACTER_SELECT → MAP → [BATTLE | REST | EVENT | SHOP] → BATTLE_REWARD → MAP → ...
  → ACT 1 BOSS → REWARD → ACT 2 MAP → ... → ACT 2 BOSS → REWARD → ACT 3 MAP → ... → ACT 3 BOSS → VICTORY
                                                                                                      ↓
                                                                                                  GAME_OVER
```
Acts 1-2 boss victory generates a new map for the next act. Act 3 boss victory → VICTORY screen.
Player keeps deck, items, gold, HP, consumables between acts.

### Battle System
- `battleActions.ts` contains **pure functions** (`initBattle`, `executePlayCard`, `executeEnemyTurn`, `startNewTurn`) that take state and return new state.
- `battleEngine.ts` handles damage calculation, block, status effects (vulnerable, weak, confidence, resilience, poison, regen).
- Cards are played by `instanceId` (unique per card copy), enemies targeted by `instanceId`.
- Dead enemies are removed from `battle.enemies` array — when empty, battle is won.
- Card damage previews account for enemy vulnerability (defender effects passed through).
- Enemy intent damage is color-coded: green when debuffed, red when buffed vs. base.

### Data Model
- **Definitions** (`CardDef`, `EnemyDef`, etc.) are static templates in `src/data/`.
- **Instances** (`CardInstance`, `EnemyInstance`) are runtime copies with `instanceId` (uuid) and mutable state.
- `CardInstance extends CardDef` with `instanceId` + `upgraded` flag.
- `EnemyInstance extends EnemyDef` with `instanceId`, `currentHp`, `block`, `statusEffects`, `moveIndex`.

### Conventions
- All components are **named exports** (not default exports), except `App.tsx`.
- Components use `useGameStore(s => s.specificField)` selectors for re-render optimization.
- All types live in `src/types/index.ts` — import from there.
- All data definitions live in `src/data/` — import from there.
- CSS is all in `src/index.css` — no component-level styles, no CSS-in-JS.
- Emoji icons are used for cards, enemies, items, and UI elements (no image assets).

## Characters (4 playable classes)
- **Frontend Dev** — reactive/fortress archetypes, CSS/JS themed cards
- **Backend Dev** — brute force/rate limiter archetypes, server/security themed cards
- **Architect** — design patterns/tech spec archetypes, systems themed cards
- **AI Engineer** — gradient descent/prompt engineering/hallucination archetypes, ML themed cards

Each class has its own card pool, starter deck, starter relic, and class-specific events.

## Key Types (src/types/index.ts)
- `Screen` — union of all screen names
- `CardDef` / `CardInstance` — card template / runtime card
- `EnemyDef` / `EnemyInstance` — enemy template / runtime enemy
- `CharacterDef` — playable character stats + starter deck
- `ItemDef` — relic with passive effects
- `ConsumableDef` — single-use battle item
- `EventDef` / `EventChoice` — random event with branching outcomes
- `MapNode` / `GameMap` — procedural map structure
- `BattleState` — hand, draw/discard/exhaust piles, energy, block, status
- `RunState` — character, HP, gold, deck, items, consumables, map, floor, act
- `GameState` — top-level store type (state + all actions)

## UX Rules
- **Reward previews are mandatory.** Whenever the player is offered cards, relics, items, or consumables as rewards (battle rewards, events, shops, etc.), the UI must show the full description so the player can make an informed decision before accepting. Never present a reward as just a name/icon — always include its description text.
- **Inline descriptions everywhere.** All reward/picker screens show descriptions inline (not hover-only), so mobile users can see them too.

## Status Effect System
Temporary (decrement each turn): `vulnerable`, `weak`, `poison`, `hope`, `cringe`, `ghosted`.
Permanent (persist): `confidence`, `resilience`, `regen`, `selfCare`, `networking`, `savingsAccount`, `counterOffer`, `hustleCulture`.

- **Confidence** — +1 damage per attack per stack (was "strength")
- **Resilience** — +1 block & stress reduction per stack (was "dexterity")

## Consumable System
- **15 single-use battle items** (6 common, 6 uncommon, 3 rare) in `src/data/consumables.ts`
- Player has **3 consumable slots** (`run.maxConsumables`)
- Used during combat via `ConsumableBar` component
- Dropped from battle rewards, events, and shops

## Enemy Move Types
Basic: `attack`, `defend`, `buff`, `debuff`, `attack_defend`, `stress_attack`, `dual_attack`, `discard`.
Advanced: `exhaust` (cards to exhaust pile), `buff_allies` (buff other enemies), `gold_steal` (steal player gold), `heal_allies` (heal other enemies).

## Act Structure — 3 Acts, 60 Enemies Total
**Act 1 — The Application Abyss** (Job search chaos)
- 12 commons, 5 elites, 3 bosses (HR Phone Screen, ATS Final Form, Ghosting Phantom)
- Enemy mechanics: exhaust, buff allies, gold steal, swarms

**Act 2 — The Interview Gauntlet** (Technical screens & personality tests)
- 12 commons, 5 elites, 3 bosses (Panel Interview Hydra, Live Coding Challenge, VP of Engineering)
- Reactive enemies, DPS checks, spawning-style buffs, energy drain themes

**Act 3 — Corporate Final Round** (Suits, offers, and existential dread)
- 12 commons, 5 elites, 3 bosses (Offer Committee, The CEO, Imposter Syndrome Final Form)
- Multi-mechanic enemies, resource drain, deck destruction, doom-timer style escalation

## Map Generation
- **12 rows**, 2-4 columns per row (3 starting paths, 1 boss node)
- **~36 nodes per act** with zone-based distribution:
  - Early zone (first 25%): battles only, no elites
  - Mid zone (middle 50%): elites appear, full variety
  - Late zone (final 25%): harder encounters, guaranteed rest
- Elite placement rules: never in early zone, max per path (Act 1: 1, Act 2: 2, Act 3: 3), min 2 rows apart
- `generateMap(act)` accepts act number for act-aware generation

## Encounter Selection
- `getNormalEncounter(act, row, totalRows)` — solos in early zone, full pool (solos+duos+trios) in mid/late
- `getEliteEncounter(act)` — act-specific elite pool
- `getBossEncounter(act)` — act-specific boss pool (random selection from 3 per act)

## Rest Site
- **Rest** — Heal 30% maxHP
- **Upgrade** — Pick a card to upgrade (shows current → upgraded description)
- **Train** (Act 2+) — Gain a random class card
- **Reflect** (Act 3+) — Remove a card from deck

## Mobile Support
- `useMobile()` hook in `src/hooks/useMobile.ts` detects mobile/landscape via media queries
- Returns `{ compact }` boolean — components use this for responsive layouts
- All reward/picker screens work on mobile (inline descriptions, no hover dependency)

## Important Notes
- The store has `as any` casts in several places (Immer/Zustand type workaround) — don't remove these.
- `cards` in `data/cards/index.ts` is a `Record<string, CardDef>` keyed by card ID.
- `enemies` in `data/enemies/index.ts` is a `Record<string, EnemyDef>` keyed by enemy ID.
- Encounter helpers: `getNormalEncounter(act, row, totalRows)`, `getEliteEncounter(act)`, `getBossEncounter(act)`.
- Map generation: `generateMap(act)` produces 12-row maps with ~36 nodes per act, boss at row 11.
- Gold starts at 50. Rest heals 30% maxHP. Card removal costs 75 gold.
- `removeChosenCard` — events let the player pick which card to remove (not random).
- Save migration in `gameStore.ts` handles renamed fields (strength→confidence, dexterity→resilience).
