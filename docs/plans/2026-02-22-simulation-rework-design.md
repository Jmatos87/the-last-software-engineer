# Design: Class Simulation, Relic/Consumable Redesign & Difficulty Audit

**Date:** 2026-02-22
**Scope:** All 4 classes (Frontend, Backend, Architect, AI Engineer)
**Output:** Bug fixes, balance tweaks, full relic redesign, full consumable redesign

---

## Goals

1. Run 10 full 3-act simulations per class (40 total) to surface bugs, dead cards, and balance gaps.
2. Redesign relics from scratch — class-specific synergy with new archetypes, every relic has a cost or condition.
3. Redesign consumables from scratch — class-specific resource interactions, no difficulty-trivializing items.
4. Audit for anything that makes act difficulty irrelevant and fix it.

---

## Simulation Structure

**Method:** 4 parallel agents (one per class), 10 full 3-act runs each.

**Per-run template:**
- Setup: starting deck, starter relic, HP
- Act 1: 3–5 battles + boss. Card reward choices, event decisions, run-ending threats.
- Act 2: 3–5 battles + boss. Power scaling check, elite encounters.
- Act 3: 3–5 battles + final boss. Win/loss, HP remaining, stress level at end.

**Agent outputs per class:**
- `WIN_RATE`: wins out of 10
- `BUGS[]`: description vs. effect field mismatches, interaction errors, missing implementations
- `BALANCE[]`: overtuned or undertuned cards (with specific values to change)
- `DEAD_CARDS[]`: cards never worth picking in any run
- `RELIC_GAPS[]`: starter relic or relic pool misaligned with class mechanic
- `CONSUMABLE_GAPS[]`: no consumable interacts with class-specific resources
- `DIFFICULTY_TRIVIA[]`: anything that made a fight or act feel inconsequential

---

## Relic Redesign Principles

**Inspirations:**
- **Slay the Spire**: Relics are double-edged. Build identity, not just stat buffs. (Burning Blood, Cursed Key, etc.)
- **Ring of Pain**: Every item has visible risk. Cost should be felt.
- **Monster Train**: Faction relics amplify the faction's specific mechanic, not raw numbers.
- **Inscryption**: Some relics break a rule — at a dark price.
- **Darkest Dungeon**: Stress is meaningful. Nothing removes it for free.

**Design rules:**
1. Class relics must reference the class's specific mechanic:
   - Frontend: flow, dodge stacks, bleed amplification
   - Backend: detonation queue, element batching, burn/ice/lightning synergy
   - Architect: engineer slots, blueprint progress, evoke timing
   - AI Engineer: temperature gauge, token economy, training_loop play counts
2. Every relic must have a **cost** (HP, stress, gold) OR be **conditional** (only fires in specific situations) — never an unconditional stat stick.
3. No relic may trivialize act difficulty (no "start every combat with 50 block", no passive infinite healing).
4. Neutral relics must present a visible tradeoff — something gained, something lost.
5. Legendary relics may break one rule — but with a meaningful sting.

---

## Consumable Redesign Principles

**Current problems identified:**
- `golden_ticket`: heal full + 50 gold + stress 0 = removes all run tension in one use
- `production_access`: 50 damage = one-shots Act 1/2 bosses trivially
- `postmortem`: heal 18 + 20 block + -10 stress = too much value, no cost
- Most consumables are generic (energy/draw/heal) with zero class interaction

**Design rules:**
1. Class-specific consumables must interact with the class's unique resource:
   - Frontend: add flow, clear/double bleed, grant dodge
   - Backend: add a queued element, trigger detonation early, apply burn
   - Architect: advance blueprint, slot a temporary engineer, evoke all
   - AI Engineer: adjust temperature, spend/generate tokens, boost training_loop count
2. **Max heal** from any consumable: 25 HP (not full heal).
3. **Max damage** from any consumable: 30 damage (not boss-instakill capable).
4. **Legendary consumables** get one exceptional effect — but must carry a sting (stress cost, HP cost, or debuff).
5. No consumable removes ALL stress or heals to full — those effects break Darkest Dungeon tension.
6. Generic consumables (energy, draw, block) are fine at common rarity — they should be tempo tools, not win conditions.

---

## Difficulty Audit

**Flag anything that:**
- Makes a fight trivial regardless of act (one-shot items, infinite block loops)
- Creates no-decision scenarios (always correct choice)
- Bypasses the stress system completely
- Allows a player to ignore an enemy mechanic entirely (e.g., dodge being spammable enough to be effectively invulnerable)

**Fix approach:** Nerf values, add costs, or add conditional triggers. Do not remove mechanics — weaken their ceiling.

---

## Implementation Order

1. Run 4 parallel simulation agents → collect all outputs
2. Compile cross-class report (bugs, balance, dead cards, gaps)
3. Fix all bugs in `battleEngine.ts`, `battleActions.ts`, card data files
4. Balance-tune outlier cards (numbers only, no mechanic changes unless egregious)
5. Write new relics in `items.ts` — full replacement, class-specific first, then neutral
6. Write new consumables in `consumables.ts` — full replacement with class interactions
7. Add any missing TypeScript types for new relic/consumable effect fields
8. Bump `GAME_VERSION` in `gameStore.ts`
