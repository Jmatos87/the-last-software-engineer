# CLAUDE.md — The Last Software Engineer

## Project Overview
A **Slay the Spire-style roguelike deck-building game** built as a single-page web app. The player selects a character, navigates a procedurally generated map, fights enemies with a card-based combat system, collects rewards, and progresses through acts.

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
├── store/
│   ├── gameStore.ts         # Zustand store — all game state + actions
│   └── battleActions.ts     # Pure functions for battle logic (init, play card, enemy turn)
├── data/
│   ├── cards.ts             # Card definitions + helpers (getRewardCards, getCardDef)
│   ├── characters.ts        # Character definitions (starter decks, stats)
│   ├── enemies.ts           # Enemy definitions + encounter tables (normal, elite, boss)
│   ├── events.ts            # Event definitions with choices/outcomes
│   └── items.ts             # Item (relic) definitions + shop helpers
├── utils/
│   ├── battleEngine.ts      # Damage/block calculation, status effect resolution
│   ├── deckUtils.ts         # createCardInstance, shuffle
│   └── mapGenerator.ts      # Procedural map generation (rows, connections)
├── components/
│   ├── battle/
│   │   ├── BattleScreen.tsx  # Main battle UI (hand, enemies, energy, end turn)
│   │   ├── CardComponent.tsx # Individual card rendering + drag source
│   │   └── EnemyDisplay.tsx  # Enemy HP, intent, status effects
│   ├── common/
│   │   ├── EnergyOrb.tsx     # Energy display
│   │   ├── HpBar.tsx         # HP bar component
│   │   ├── StatusEffects.tsx  # Status effect icons
│   │   └── Tooltip.tsx       # Hover tooltip
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

## Architecture Patterns

### State Management
- **Single Zustand store** (`useGameStore`) holds all game state: `screen`, `run`, `battle`, `pendingRewards`, `pendingEvent`.
- Store uses **Immer middleware** — mutate state directly inside `set()` callbacks.
- Actions are defined inline in the store creator, not in separate files.
- Screen navigation is state-driven: set `state.screen` to a `Screen` type value.

### Game Flow
```
CHARACTER_SELECT → MAP → [BATTLE | REST | EVENT | SHOP] → BATTLE_REWARD → MAP → ...
  → ACT 1 BOSS → REWARD → ACT 2 MAP → ... → ACT 2 BOSS → REWARD → ACT 3 MAP → ... → ACT 3 BOSS → VICTORY
                                                                                                      ↓
                                                                                                  GAME_OVER
```
Acts 1-2 boss victory generates a new map for the next act. Act 3 boss victory → VICTORY screen.
Player keeps deck, items, gold, HP between acts.

### Battle System
- `battleActions.ts` contains **pure functions** (`initBattle`, `executePlayCard`, `executeEnemyTurn`, `startNewTurn`) that take state and return new state.
- `battleEngine.ts` handles damage calculation, block, status effects (vulnerable, weak, strength, dexterity, poison, regen).
- Cards are played by `instanceId` (unique per card copy), enemies targeted by `instanceId`.
- Dead enemies are removed from `battle.enemies` array — when empty, battle is won.

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

## Key Types (src/types/index.ts)
- `Screen` — union of all screen names
- `CardDef` / `CardInstance` — card template / runtime card
- `EnemyDef` / `EnemyInstance` — enemy template / runtime enemy
- `CharacterDef` — playable character stats + starter deck
- `ItemDef` — relic with passive effects
- `EventDef` / `EventChoice` — random event with branching outcomes
- `MapNode` / `GameMap` — procedural map structure
- `BattleState` — hand, draw/discard/exhaust piles, energy, block, status
- `RunState` — character, HP, gold, deck, items, map, floor, act
- `GameState` — top-level store type (state + all actions)

## Status Effect System
Temporary (decrement each turn): `vulnerable`, `weak`, `poison`, `hope`, `cringe`, `ghosted`.
Permanent (persist): `strength`, `dexterity`, `regen`, `selfCare`, `networking`, `savingsAccount`, `counterOffer`, `hustleCulture`.

## Enemy Move Types
Basic: `attack`, `defend`, `buff`, `debuff`, `attack_defend`, `stress_attack`, `dual_attack`, `discard`.
Advanced: `exhaust` (cards to exhaust pile), `buff_allies` (buff other enemies), `gold_steal` (steal player gold), `heal_allies` (heal other enemies).

## Act Structure — 3 Acts, 60 Enemies Total
**Act 1 — The Application Abyss** (Job search chaos)
- 12 commons, 5 elites, 3 bosses (HR Phone Screen, ATS Final Form, Ghosting Phantom)
- New enemy mechanics: exhaust (Cover Letter Shredder), buff allies (Keyword Stuffer), gold steal (Application Fee Scammer), swarms (LinkedIn Notifications)

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

## Change Log / Design Decisions

### Frontend Dev Card Set (planned)
**Goal:** Give the Frontend Dev class its own unique themed card pool + class-specific events.

**New Cards (16 total):**

*Starter (in starting deck):*
- `console_log` (keep), `div_block` (keep), `important_override` (!important, 0-cost 4 block), `jsx_spray` (AoE 4 dmg all), `css_animate` (5 block + 4 stress reduction)

*Common (normal battle rewards):*
- `callback_hell` (9 dmg), `promise_chain` (draw 2), `use_state` (7 block + 3 stress), `flexbox` (6 block + draw 1), `npm_audit` (5 dmg + 2 vulnerable)

*Uncommon (elite battle rewards):*
- `async_await` (0-cost draw 3), `prototype_pollution` (8 dmg all + 1 weak), `virtual_dom` (16 block), `two_way_binding` (8 dmg + 8 block), `css_grid` (power: 2 dexterity)

*Rare (boss rewards / special events):*
- `nyancat_rainbow` (12 dmg all + 1 vulnerable), `strict_mode` (power: 3 strength), `observable_stream` (power: 1 networking + 2 selfCare)

**Updated Starter Deck (10 cards):**
4x console_log, 2x div_block, 1x important_override, 1x jsx_spray, 1x css_animate, 1x coffee_break

**New Frontend Events (4):**
- "The NPM Black Hole" — node_modules sentience, drops callback_hell
- "Stack Overflow is Down" — panic scenario, drops async_await
- "The CSS Centering Challenge" — centering a div, drops flexbox
- "The Nyancat Shrine" — RGB shrine, drops nyancat_rainbow

**Tone:** All descriptions are satirical/funny job-search and dev humor.

## Important Notes
- The store has `as any` casts in several places (Immer/Zustand type workaround) — don't remove these.
- `cards` in `data/cards.ts` is a `Record<string, CardDef>` keyed by card ID.
- `enemies` in `data/enemies.ts` is a `Record<string, EnemyDef>` keyed by enemy ID.
- Encounter helpers: `getNormalEncounter(act, row, totalRows)`, `getEliteEncounter(act)`, `getBossEncounter(act)`. Legacy arrays (`normalEncounters`, `eliteEncounters`, `bossEncounters`) still exported for backwards compat.
- Map generation: `generateMap(act)` produces 12-row maps with ~36 nodes per act, boss at row 11.
- Gold starts at 50. Rest heals 30% maxHP. Card removal costs 75 gold.
