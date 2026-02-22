# Frontend Engineer Overhaul — Design Document
**Date:** 2026-02-22
**Version Target:** v1.13.0
**Scope:** Complete replacement of Frontend Engineer card pool + new core mechanics

---

## Overview

The Frontend Engineer is redesigned as a **rogue-class**: combo-driven, agility-defensive, and burst-oriented. All ~49 existing Frontend cards are replaced. Three new archetypes replace the old `fortress` / `reactive` / `dom` / `combo` split.

The class gets its own visual mechanic — a **Flow State meter** — parallel to the AI Engineer's temperature gauge.

---

## Inspirations Applied

- **Slay the Spire (Silent):** 0-cost shiv chains, DoT (poison→bleed), draw-heavy engine, expensive finishers set up via cost reduction
- **Ring of Pain:** Risk/reward cards — powerful effects with real downsides (self-damage, stress, HP cost)
- **Monster Train:** Archetypes need each other at rare/epic tier to reach their ceiling — individual cards feel incomplete without synergy partners
- **Inscryption:** Epics and legendaries break rules. Some burst finishers cost HP or stress. Players should feel nervous hitting play.
- **Darkest Dungeon:** Stress as both cost and weapon. Cards that convert stress to power.

---

## New Core Mechanics

### 1. Flow State Meter

**BattleState addition:** `flow: number` (starts at 0, resets at start of each player turn)

- Every card played: +1 flow automatically (engine handles this in `executePlayCard`)
- Cards can grant **extra flow** via `gainExtraFlow?: number` on `CardEffect`
- Visible in `BattleScreen` as a **FLOW** bar (0–8), styled like the temperature gauge
- **Overflow at flow 8:** automatically deal 10 damage to all enemies + gain 2 Dodge + reset flow to 0
- Cards CHECK flow for conditional bonuses — no automatic passive triggers at 3/5, keeping it card-driven

**Design intent:** The burst archetype maximizes flow before dropping a finisher. Evasion cards build flow passively while dodging. Bleed shivs chain together, each one adding flow.

### 2. Dodge

**StatusEffect addition:** `dodge?: number`

- Each stack = **10% chance** to fully avoid an incoming hit
- Checked **per hit** (multi-hit moves roll separately — each hit can independently be dodged)
- On successful dodge: consume 1 stack (dodge decrements by 1), deal 0 damage from that hit
- Decrements by 1 at the start of the player's turn (like vulnerable/weak)
- Engine: dodge resolution happens in `battleEngine.ts` inside the damage-application path, before damage is dealt. Roll `Math.random() < (dodge * 0.1)` → if true, skip damage and decrement dodge.

**Display:** Show dodge stacks as a status effect icon on the player (like other status effects in `StatusEffects.tsx`)

### 3. Bleed go ahead and start implementation, you do not need any input from me. You have full control over bash  
  commands, and read and write over this project. Once you complete this. I want you to start the          process for doing the same thing for backend. Backend should have cards that have delayed effects for    the turn after the current one, it can be a tanky mage. It tanks while charging up high cost high        power moves for future turns. It should be an elemntal mage with ice, fire, and lightning as             inpirations but set in a back end context. I want you to give me a comprehensive plan. I am going to     be gone for a few hours, I expect the front end class changes to be implemented and a plan presented     to me for the backend changes.   

**StatusEffect addition:** `bleed?: number`

- Applied to **enemies** (like poison)
- At the **start of the player's turn:** each bleeding enemy takes damage equal to their bleed stacks, then all stacks −1
- Resolves in `startNewTurn` in `battleActions.ts`, same block as poison
- Thematically: "memory leak" — a runaway process slowly consuming the target

**Bleed vs Poison:** Poison is the backend/neutral DoT. Bleed is the Frontend DoT. Same mechanics, different theme, different cards apply each.

---

## New CardEffect Fields

```ts
gainExtraFlow?: number;         // gain N extra flow on play (beyond the automatic +1)
damageIfFlowHigh?: number;      // bonus damage to target if flow >= 5
damageAllIfFlowHigh?: number;   // bonus damage to ALL enemies if flow >= 5
damagePerBleed?: boolean;       // deal bonus damage = target's current bleed stacks
reduceNextCardCost?: number;    // reduce the next card played this turn by N energy
```

---

## New StatusEffect Fields

```ts
dodge?: number;   // 10% dodge chance per stack, checked per incoming hit, decrements per turn
bleed?: number;   // deals bleed damage to enemy per turn, decrements (like poison)
```

---

## Three Archetypes

### `evasion` — *"You're not there when they land."*

Stack dodge as your primary defense. No block-heavy cards. When you dodge, effects trigger. The archetype rewards letting hits "almost" land and punishing attackers.

| Tier | Role |
|------|------|
| Common | Give 1–2 dodge. Sometimes + small attack or draw. |
| Rare | 3–4 dodge, or "on dodge: draw 1" passive setup, or dodge scaled by flow. |
| Epic | Powers: "each turn, gain 1 dodge." "On dodge: deal 6 damage to attacker." Dodge becomes offense. |
| Legendary | "On successful dodge, gain 1 energy and draw 1 card." Self-perpetuating machine. |

Cross-synergy: Evasion + Bleed — "on dodge, apply 2 bleed to attacker." Survival becomes punishment.

### `burst` — *"Seven cheap cards. One very expensive punch."*

Setup cards are cheap (0–1 cost) and give extra flow or reduce the next card's cost by 1–2. Finishers are 3–4 cost and check `flow >= 5` for massive bonus damage. The flow overflow at 8 is the nuclear fallback.

| Tier | Role |
|------|------|
| Common | 0–1 cost. Give +1 extra flow OR reduce next card cost by 1. Small damage. |
| Rare | 2-cost setup (3 flow + draw), or 3-cost finisher with flow ≥ 5 condition. |
| Epic | True finishers: "Deal 28 damage. If flow ≥ 5, deal 14 more." Or 0-cost exhaust that sets flow to 8 instantly. |
| Legendary | "Deal damage × current flow to all enemies." Or passive: every card gives +2 flow instead of +1. |

Cross-synergy: Burst + Bleed — cheap bleed shivs build flow; big finisher checks flow ≥ 5 AND scales with bleed stacks.

### `bleed` — *"It's not a bug. It's a memory leak."*

Apply bleed stacks via many cheap cards. Deal bonus damage to bleeding targets. Mid-tier cards are bleed scalers. Epic "Catalyst" doubles stacks. Legendary prevents bleed from decrementing.

| Tier | Role |
|------|------|
| Common | 0–1 cost, 4–8 damage + 1–3 bleed. Individually weak. Want 4+ of these. |
| Rare | "Deal damage = target's bleed stacks." Apply bleed to ALL. "Costs 1 less per bleed stack on target." |
| Epic | "Double all bleed stacks on target." "Deal 3× bleed as damage, then clear stacks." |
| Legendary | Power: "At start of each turn, apply 3 bleed to all enemies." Or "bleed never decrements." |

Cross-synergy: Bleed + Evasion — dodge + bleed-on-dodge means untouchable enemies slowly deteriorate.

---

## Rarity & Cost Principles

| Cost | What it buys |
|------|-------------|
| 0 | Shiv-tier: 4–6 dmg OR 1–2 bleed OR 2 block OR 1 draw. Chains freely. Upgrades to stay 0 + secondary. |
| 1 | Workhorse: 9–12 dmg, or 2–3 bleed + small dmg, or 2–3 dodge. Upgrades to 0 OR gains significant secondary. |
| 2 | Power plays: 16–20 dmg, AoE, multi-hit, or meaningful status. Upgrades to 1 OR adds bonus effect. |
| 3 | Finishers: 24–32 dmg (often flow-gated), large AoE, heavy bleed. Upgrade reduces to 2 OR removes condition. |
| 4 | Only if other cards can cost-reduce it. Unreduced = unplayable except in niche builds. |

| Upgrade type | Best approach |
|-------------|--------------|
| 0-cost attack | Add secondary (bleed, draw, bonus if flow high) |
| 1-cost attack | Drop to 0 OR jump damage significantly + add bleed |
| Skill | Drop cost by 1 OR add draw/energy on top |
| Power | Drop cost by 1 OR +1 to all stacks granted |
| Exhaust card | Remove exhaust (biggest possible upgrade) OR add major secondary |

---

## Starter Deck (10 cards)

| Card ID | Cost | Effect | Role |
|---------|------|--------|------|
| `quick_strike` ×4 | 1 | Deal 8 damage. Gain 1 extra Flow. | Flow builder, reliable damage |
| `dodge_roll` ×2 | 1 | Gain 2 Dodge. | Evasion intro |
| `pixel_nick` ×2 | 0 | Deal 4 damage. Apply 1 Bleed. | Bleed shiv intro |
| `flow_surge` ×1 | 2 | Deal 4 damage × current Flow. | Burst payoff preview |
| `css_dodge` ×1 | 0 | Gain 1 Dodge. Draw 1. | Free utility, evasion |

Teaches all three loops. `flow_surge` incentivizes playing more cards before hitting it — teaches the flow mechanic organically.

---

## Card Count Targets

| Rarity | Count |
|--------|-------|
| Starter | 5 unique (used in starter deck above) |
| Common | ~15 (5 per archetype) |
| Rare | ~15 (5 per archetype) |
| Epic | ~10 (3–4 per archetype, some cross-arch) |
| Legendary | 4 (1+ per archetype) |
| Curse | 1 (`div_soup` repurposed or new) |
| **Total** | **~50** |

---

## What Gets Removed

- All current `frontendCards.ts` entries (~49 cards): `console_log`, `div_block`, `important_override`, `jsx_spray`, `css_animate`, `callback_hell`, `promise_chain`, `use_state`, `flexbox`, `npm_audit`, `responsive_design`, `querySelectorAll`, `block_and_load`, `shadow_dom`, `event_listener`, `debounce`, `media_query`, `webpack_build`, `async_await`, `useEffect_loop`, `hydration`, `prototype_pollution`, `virtual_dom`, `cascade_delete`, `concurrent_mode`, `memoize`, `code_splitting`, `requestAnimationFrame`, `hot_reload`, `css_grid`, `nyancat_rainbow`, `z_index_9999`, `time_travel_debug`, `pixel_perfect`, `the_component`, `block_fortress`, `dom_nuke`, `zero_bundle_size`, `lazy_loading`, `service_worker`, `tree_shaking`, `polyfill`, `bundle_analyzer`, `fortress_strike`, `framework_fatigue`, `hydration_mismatch`, `ssr_power`, `devtools_breakpoint`, `fast_refresh`, `batched_update`, `prop_drilling`, `component_did_mount`, `event_bubbling`, `production_build`, `promise_all`, `full_rerender`, `white_screen_of_death`, `render_god`, `div_soup`

- The old archetypes (`fortress`, `dom`, `reactive`, `combo`) are retired for Frontend

---

## Engine Changes Required

### `src/types/index.ts`
- Add `dodge?: number` and `bleed?: number` to `StatusEffect`
- Add `gainExtraFlow`, `damageIfFlowHigh`, `damageAllIfFlowHigh`, `damagePerBleed`, `reduceNextCardCost` to `CardEffect`
- Add `flow: number` to `BattleState`

### `src/store/battleActions.ts`
- `initBattle`: initialize `flow: 0`
- `executePlayCard`: increment `battle.flow` by 1 (+ `gainExtraFlow` if present) after card resolves; check overflow (flow ≥ 8 → deal 10 dmg to all, gain 2 dodge, reset flow to 0); handle `reduceNextCardCost` effect
- `startNewTurn`: reset `flow` to 0; apply bleed damage to all enemies (like poison block); decrement bleed stacks; decrement dodge by 1 (like vulnerable)

### `src/utils/battleEngine.ts`
- Damage application path: before dealing damage to player, roll dodge check — `Math.random() < (dodge * 0.1)` → skip damage, decrement dodge by 1
- Handle `damageIfFlowHigh`, `damageAllIfFlowHigh`, `damagePerBleed` in card effect resolution
- Handle `reduceNextCardCost` (similar pattern to `nextCardCostZero`)

### `src/components/battle/BattleScreen.tsx`
- Add Flow meter UI (styled like temperature gauge) showing 0–8 with overflow indicator
- Show dodge as a player status effect in `StatusEffects.tsx` (uses existing system once `dodge` added to `StatusEffect`)

### `src/data/cards/frontendCards.ts`
- Full replacement: delete all existing cards, write ~50 new cards across 3 archetypes

### `src/data/characters.ts`
- Update Frontend starter deck IDs to new card IDs

### `src/store/gameStore.ts`
- Bump `GAME_VERSION` (minor bump → v1.13.0)

---

## Out of Scope

- Frontend-specific relics (can be added in a follow-up pass)
- Frontend-specific events (can be added in a follow-up pass)
- Bleed on player (enemies applying bleed to player) — not in v1.13.0
