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
CHARACTER_SELECT → MAP → [BATTLE | REST | EVENT | SHOP] → BATTLE_REWARD → MAP → ... → BOSS → VICTORY
                                                                                        ↓
                                                                                    GAME_OVER
```

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
Effects: `vulnerable`, `weak`, `strength`, `dexterity`, `regen`, `poison`. All are number values that decrement each turn.

## Important Notes
- The store has `as any` casts in several places (Immer/Zustand type workaround) — don't remove these.
- `cards` in `data/cards.ts` is a `Record<string, CardDef>` keyed by card ID.
- `enemies` in `data/enemies.ts` is a `Record<string, EnemyDef>` keyed by enemy ID.
- Encounter arrays (`normalEncounters`, `eliteEncounters`, `bossEncounters`) are `string[][]` — arrays of enemy ID groups.
- Map generation produces rows 0-14 with a boss node at the end.
- Gold starts at 50. Rest heals 30% maxHP. Card removal costs 75 gold.
