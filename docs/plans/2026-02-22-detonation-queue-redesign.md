# Detonation Queue Redesign — Backend Engineer

**Date:** 2026-02-22
**Status:** Approved, ready for implementation

---

## Overview

The detonation queue currently fires all scheduled effects exactly 1 turn after they're queued — no variance, no strategy. This redesign introduces variable delay timers (1–4 turns), meaningful upgrade paths, AoE variants, and interaction cards that let players accelerate, amplify, or combo pending effects.

---

## 1. Delay Tiers

| Tier | Turns Until Fire | Who Uses It |
|---|---|---|
| Fast | 1 | Starter cards, weakest commons — immediate, low payoff |
| Quick | 2 | Most commons, weaker rares — reliable, moderate payoff |
| Delayed | 3 | Most rares, some epics — build-around, strong payoff |
| Charged | 4 | Epics, legendaries — big commitment, massive payoff |

Damage/block values scale with delay: Charged cards deal ~50–60% more than Fast equivalents.

---

## 2. Data Model Changes

### `QueuedEffect` (types/index.ts)
Add one field:
```typescript
turnsUntilFire: number; // 1=fast, 2=quick, 3=delayed, 4=charged
```

### New `CardEffect` fields
```typescript
// Medium/slow queue variants (existing queueX fields = fast, 1 turn)
queueBlockQuick?: number;       // ice block, 2-turn delay
queueBlockDelayed?: number;     // ice block, 3-turn delay
queueBlockCharged?: number;     // ice block, 4-turn delay

queueDamageAllQuick?: number;   // fire AoE, 2-turn delay
queueDamageAllDelayed?: number; // fire AoE, 3-turn delay
queueDamageAllCharged?: number; // fire AoE, 4-turn delay

queueChainQuick?: number;       // lightning chain, 2-turn delay
queueChainDelayed?: number;     // lightning chain, 3-turn delay
queueChainCharged?: number;     // lightning chain, 4-turn delay

// Interaction effects
accelerateQueue?: number;       // subtract N from ALL turnsUntilFire (min 1 each)
amplifyQueue?: number;          // multiply ALL pending amounts by (1 + N/100)
stackMatchingQueue?: number;    // add N to the largest pending effect of same element; if none, queue fast fire for N
detonateNow?: boolean;          // fire ALL queued effects immediately this turn at full power + batch bonus
```

### New status effect: `primed`
- Temporary (decrements each turn like `vulnerable`)
- **On application**: each stack immediately reduces ALL `turnsUntilFire` by 1 (min 1)
- Visual indicator: enemy is "marked" for detonation priority

---

## 3. Engine Changes (battleActions.ts — startNewTurn)

### Timer tick logic (replaces current "fire everything" approach)
```
1. Tick: decrement every qe.turnsUntilFire by 1
2. Split: firing = queue where turnsUntilFire === 0; pending = queue where turnsUntilFire > 0
3. Batch bonus: count unique elements in FIRING set only
4. Fire: process firing effects (existing ice/fire/lightning logic unchanged)
5. Keep: pending effects carried into return state as new detonationQueue
```

### `accelerateQueue` card effect (executePlayCard)
Immediately subtract N from all `turnsUntilFire` (min 1) when card is played.

### `amplifyQueue` card effect (executePlayCard)
Immediately multiply all `blockAmount`, `damageAllAmount`, `chainAmount` by `(1 + N/100)` — floor the result.

### `stackMatchingQueue` card effect (executePlayCard)
Find the first queued effect matching the specified element, add N to its amount. If none found, push a new fast (turnsUntilFire: 1) fire effect for N damage.

### `detonateNow` card effect (executePlayCard)
Move all pending queue effects to fire this turn by setting `turnsUntilFire = 0`, then process immediately (trigger the detonation logic inline). Clears queue after firing.

### `primed` status effect (executePlayCard)
When applying `primed` stacks to an enemy, immediately reduce all `detonationQueue[].turnsUntilFire` by the stacks applied (min 1 per effect).

---

## 4. Card Re-tiering

### Existing cards → new tiers

| Card | Old | New Tier |
|---|---|---|
| cache_warmup | fast | fast (1) — starter |
| scheduled_exception | fast | fast (1) — starter |
| async_webhook | fast | fast (1) — starter |
| cold_cache | fast | fast (1) |
| cold_backup | fast | quick (2) |
| connection_pool | fast | quick (2) |
| pub_sub_event | fast | quick (2) |
| retry_loop | fast | quick (2) |
| circuit_breaker | fast | quick (2) |
| webhook_blast | fast | quick (2) |
| async_task | fast | quick (2) |
| kafka_offset | fast | delayed (3) |
| message_queue | fast | delayed (3) |
| distributed_strike | fast | delayed (3) |
| thunderbolt_query | fast | delayed (3) |
| event_storm | fast | delayed (3) |
| absolute_zero | fast | charged (4) |
| nuclear_deploy | fast | charged (4) |
| chain_lightning | fast | charged (4) |
| production_incident | fast | charged (4) |
| infinite_loop | fast | charged (4) |
| cryo_cascade | fast | charged (4) |
| fuel_injection | fast | delayed (3) |
| backdraft | fast | delayed (3) |
| thermal_cascade | fast | delayed (3) |
| surge_discharge | fast | delayed (3) |
| thunderstorm_protocol | fast | charged (4) |
| batch_processing | fast | delayed (3) |
| elemental_convergence | fast | charged (4) |

Damage/block values on delayed and charged cards are buffed ~20–30% (delayed) and ~40–60% (charged) vs current values.

---

## 5. Upgrade Rules

| Rarity | Path | Options |
|---|---|---|
| Common (fast) | Fixed | Either: drop to instant-fire (plays effect same turn) OR +40% damage |
| Common (quick) | Fixed | Either: drop to fast (1 turn) OR +40% damage |
| Rare (delayed) | Fixed | Either: drop to quick (2 turns) OR +40% damage |
| Epic/Legendary (charged) | **Both** | Drop 1 tier (charged→delayed) AND +30% damage |

---

## 6. New Interaction Cards (6 total)

| Card | Cost | Rarity | Effect |
|---|---|---|---|
| Early Patch | 1 | Common | Reduce all queued timers by 1 (min 1). |
| Primed Shot | 1 | Common | Deal 8 damage. Apply 2 Primed to target (instantly -2 to all timers). |
| Hotpath Override | 2 | Rare | Amplify all pending effects by +50%. |
| Mark for Deletion | 2 | Rare | Deal 10 damage to all enemies. Apply 2 Primed to all (instantly -2 to all timers). |
| Stack Overflow | 2 | Rare | Add 15 damage to the largest pending fire/lightning effect. If none, queue fast fire for 15. |
| System Flush | 3 | Epic | Fire ALL queued effects immediately this turn at full power with batch bonus. |

---

## 7. UI Changes

### Pills move above enemy heads
- Remove the current "SCHEDULED" bar from the battle UI
- Render countdown pills floating above the enemies section (or centered above all enemies for AoE effects)
- Each pill shows: element icon (🧊/🔥/⚡) + countdown number

### Countdown color coding
- **Blue** — 4 turns (charged, far away)
- **Teal** — 3 turns (delayed)
- **Yellow** — 2 turns (quick, getting close)
- **Red** — 1 turn (fast, fires next turn)

### `primed` enemy status
Rendered in the enemy's status effect row (existing StatusEffects component) with a 🎯 icon.

---

## 8. Out of Scope
- No changes to the batch bonus system (2 elements = ×1.5, 3 = ×2.0 + System Meltdown)
- No changes to ice/fire/lightning element identities
- No changes to any other class mechanics
