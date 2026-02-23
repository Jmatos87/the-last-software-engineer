# Detonation Queue Timer System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the fixed "fires next turn" detonation queue with a 4-tier delay system (1/2/3/4 turns), add interaction cards (accelerate, amplify, stack, detonate-now), move queue pills above enemy heads, and add a `primed` enemy debuff.

**Architecture:** Add `turnsUntilFire` to `QueuedEffect`; engine ticks timers each turn and only fires effects at 0. New card effect fields (`queueBlockQuick/Delayed/Charged`, `accelerateQueue`, `amplifyQueue`, `stackMatchingQueue`, `detonateNow`) push to the queue with the right delay. Existing cards stay backwards-compatible (all implicitly fast = 1 turn). UI renders pills above the enemies area with color-coded countdowns.

**Tech Stack:** React 19, TypeScript 5.9, Zustand+Immer, plain CSS. No test framework — verify with `npm run build` and manual in-game checks.

---

### Task 1: Add `turnsUntilFire` to types + new CardEffect fields + `primed` status

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add `turnsUntilFire` to `QueuedEffect`**

Find the `QueuedEffect` interface and add the field:

```typescript
export interface QueuedEffect {
  element: 'ice' | 'fire' | 'lightning';
  blockAmount?: number;
  damageAllAmount?: number;
  chainAmount?: number;
  burnApply?: number;
  turnsUntilFire: number; // 1=fast, 2=quick, 3=delayed, 4=charged
}
```

**Step 2: Add new `CardEffect` queue fields**

In the `CardEffect` interface, after the existing `queueBlock/queueDamageAll/queueChain/queueBurn` fields, add:

```typescript
// Tiered queue variants (existing queueX = fast/1-turn)
queueBlockQuick?: number;        // ice block, fires in 2 turns
queueBlockDelayed?: number;      // ice block, fires in 3 turns
queueBlockCharged?: number;      // ice block, fires in 4 turns

queueDamageAllQuick?: number;    // fire AoE, fires in 2 turns
queueDamageAllDelayed?: number;  // fire AoE, fires in 3 turns
queueDamageAllCharged?: number;  // fire AoE, fires in 4 turns

queueChainQuick?: number;        // lightning chain, fires in 2 turns
queueChainDelayed?: number;      // lightning chain, fires in 3 turns
queueChainCharged?: number;      // lightning chain, fires in 4 turns

queueBurnDelayed?: number;       // fire burn AoE, fires in 3 turns
queueBurnCharged?: number;       // fire burn AoE, fires in 4 turns

// Interaction effects
accelerateQueue?: number;        // subtract N from ALL turnsUntilFire (min 1)
amplifyQueue?: number;           // multiply all pending amounts by (1 + N/100)
stackMatchingQueue?: { element: 'ice' | 'fire' | 'lightning'; amount: number }; // add N to largest pending of same element
detonateNow?: boolean;           // fire ALL queued effects immediately this turn
```

**Step 3: Add `primed` to the temporary status effects list**

Find the status effects comment block (near `vulnerable`, `weak`, etc.) and add `primed` to the `StatusEffects` interface:

```typescript
primed?: number;  // each stack applied instantly reduces all detonation timers by 1 (min 1)
```

**Step 4: Build**

```bash
npm run build
```

Expected: clean build (TypeScript will catch any missed references).

---

### Task 2: Update engine — timer ticking in `startNewTurn`

**Files:**
- Modify: `src/store/battleActions.ts`

**Context:** The detonation processing block starts around line 2176 with:
```typescript
// Process Detonation Queue (Backend mechanic: scheduled effects fire at start of player's turn)
const queueToProcess: QueuedEffect[] = battle.detonationQueue || [];
```

**Step 1: Replace "fire everything" with "tick + split"**

Replace the entire detonation queue setup section:

```typescript
// OLD:
const queueToProcess: QueuedEffect[] = battle.detonationQueue || [];

// NEW:
// Tick all timers — decrement turnsUntilFire by 1
const tickedQueue: QueuedEffect[] = (battle.detonationQueue || []).map(qe => ({
  ...qe,
  turnsUntilFire: (qe.turnsUntilFire ?? 1) - 1,
}));

// Split: fire effects at 0, keep the rest for next turn
const queueToProcess: QueuedEffect[] = tickedQueue.filter(qe => qe.turnsUntilFire <= 0);
const remainingQueue: QueuedEffect[] = tickedQueue.filter(qe => qe.turnsUntilFire > 0);
```

**Step 2: Pass `remainingQueue` into the return object**

In the `return { battle: { ... } }` block at the end of `startNewTurn`, find `detonationQueue` and update it:

```typescript
// OLD:
detonationQueue: engineerQueuedEffects,

// NEW — merge engineer-generated effects with leftover pending effects:
detonationQueue: [...remainingQueue, ...engineerQueuedEffects],
```

**Step 3: Update batch bonus to count elements in FIRING set only**

The current code counts all queued elements. Change it to count only `queueToProcess`:

```typescript
// This line is already correct if queueToProcess is the firing set — verify it reads:
const queueElements = new Set(queueToProcess.map(e => e.element));
```

No change needed if it already uses `queueToProcess`. Just confirm.

**Step 4: Build and verify**

```bash
npm run build
```

Test in-game: play a fast card (e.g. cache_warmup — it queues ice block). End turn. The block should fire on the NEXT turn start. Works same as before — backwards compatible.

---

### Task 3: Wire new card effect fields in `executePlayCard`

**Files:**
- Modify: `src/store/battleActions.ts`

**Context:** Find the section in `executePlayCard` that processes `queueBlock`, `queueDamageAll`, `queueChain`, `queueBurn`. It pushes to `newBattle.detonationQueue`. Add new fields alongside the existing ones.

**Step 1: Add tiered queue field handlers**

After the existing `if (effects.queueBlock)` block, add:

```typescript
// Tiered ice queue
if (effects.queueBlockQuick) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'ice', blockAmount: effects.queueBlockQuick, turnsUntilFire: 2 }];
}
if (effects.queueBlockDelayed) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'ice', blockAmount: effects.queueBlockDelayed, turnsUntilFire: 3 }];
}
if (effects.queueBlockCharged) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'ice', blockAmount: effects.queueBlockCharged, turnsUntilFire: 4 }];
}

// Tiered fire queue
if (effects.queueDamageAllQuick) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', damageAllAmount: effects.queueDamageAllQuick, turnsUntilFire: 2 }];
}
if (effects.queueDamageAllDelayed) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', damageAllAmount: effects.queueDamageAllDelayed, turnsUntilFire: 3 }];
}
if (effects.queueDamageAllCharged) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', damageAllAmount: effects.queueDamageAllCharged, turnsUntilFire: 4 }];
}

// Tiered lightning queue
if (effects.queueChainQuick) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'lightning', chainAmount: effects.queueChainQuick, turnsUntilFire: 2 }];
}
if (effects.queueChainDelayed) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'lightning', chainAmount: effects.queueChainDelayed, turnsUntilFire: 3 }];
}
if (effects.queueChainCharged) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'lightning', chainAmount: effects.queueChainCharged, turnsUntilFire: 4 }];
}

// Tiered burn queue
if (effects.queueBurnDelayed) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', burnApply: effects.queueBurnDelayed, turnsUntilFire: 3 }];
}
if (effects.queueBurnCharged) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', burnApply: effects.queueBurnCharged, turnsUntilFire: 4 }];
}
```

**Step 2: Also ensure existing fast fields use `turnsUntilFire: 1`**

Find the existing blocks and add the field:

```typescript
// Existing queueBlock handler — add turnsUntilFire: 1
if (effects.queueBlock) {
  let iceBlockAmt = effects.queueBlock;
  if (!newBattle.firstIceUsed && run.items.some(i => i.effect.firstIceDoubleQueue)) {
    iceBlockAmt = iceBlockAmt * 2;
    newBattle.firstIceUsed = true;
  }
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'ice', blockAmount: iceBlockAmt, turnsUntilFire: 1 }];
}
if (effects.queueDamageAll) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', damageAllAmount: effects.queueDamageAll, turnsUntilFire: 1 }];
}
if (effects.queueChain) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'lightning', chainAmount: effects.queueChain, turnsUntilFire: 1 }];
}
if (effects.queueBurn) {
  newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
    { element: 'fire', burnApply: effects.queueBurn, turnsUntilFire: 1 }];
}
```

**Step 3: Add `accelerateQueue` handler**

After the queue-push section:

```typescript
if (effects.accelerateQueue && effects.accelerateQueue > 0) {
  newBattle.detonationQueue = (newBattle.detonationQueue || []).map(qe => ({
    ...qe,
    turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - effects.accelerateQueue!),
  }));
}
```

**Step 4: Add `amplifyQueue` handler**

```typescript
if (effects.amplifyQueue && effects.amplifyQueue > 0) {
  const mult = 1 + effects.amplifyQueue / 100;
  newBattle.detonationQueue = (newBattle.detonationQueue || []).map(qe => ({
    ...qe,
    blockAmount:     qe.blockAmount     ? Math.floor(qe.blockAmount * mult)     : undefined,
    damageAllAmount: qe.damageAllAmount ? Math.floor(qe.damageAllAmount * mult) : undefined,
    chainAmount:     qe.chainAmount     ? Math.floor(qe.chainAmount * mult)     : undefined,
    burnApply:       qe.burnApply       ? Math.floor(qe.burnApply * mult)       : undefined,
  }));
}
```

**Step 5: Add `stackMatchingQueue` handler**

```typescript
if (effects.stackMatchingQueue) {
  const { element, amount } = effects.stackMatchingQueue;
  const queue = newBattle.detonationQueue || [];
  // Find largest pending effect of matching element
  let targetIdx = -1;
  let targetMax = 0;
  queue.forEach((qe, i) => {
    if (qe.element !== element) return;
    const val = qe.damageAllAmount ?? qe.chainAmount ?? qe.blockAmount ?? 0;
    if (val > targetMax) { targetMax = val; targetIdx = i; }
  });
  if (targetIdx >= 0) {
    newBattle.detonationQueue = queue.map((qe, i) => {
      if (i !== targetIdx) return qe;
      return {
        ...qe,
        blockAmount:     qe.blockAmount     ? qe.blockAmount + amount     : undefined,
        damageAllAmount: qe.damageAllAmount ? qe.damageAllAmount + amount : undefined,
        chainAmount:     qe.chainAmount     ? qe.chainAmount + amount     : undefined,
      };
    });
  } else {
    // No matching element found — queue a fast fire for amount
    newBattle.detonationQueue = [...queue,
      { element: 'fire', damageAllAmount: amount, turnsUntilFire: 1 }];
  }
}
```

**Step 6: Add `detonateNow` handler**

This must fire INLINE — set all pending effects to `turnsUntilFire: 0` so the detonation block in `startNewTurn` picks them up. But `executePlayCard` runs during the player's turn, not at turn start. So `detonateNow` must trigger detonation immediately within `executePlayCard`.

Add after queue modifications:

```typescript
if (effects.detonateNow && (newBattle.detonationQueue || []).length > 0) {
  const queueToFire = newBattle.detonationQueue || [];
  const firingElements = new Set(queueToFire.map(e => e.element));
  const batchMult = firingElements.size >= 3 ? 2.0 : firingElements.size === 2 ? 1.5 : 1.0;

  for (const qe of queueToFire) {
    if (qe.blockAmount) {
      newBattle.playerBlock += Math.floor(qe.blockAmount * batchMult);
    }
    if (qe.damageAllAmount) {
      const dmg = Math.floor(qe.damageAllAmount * batchMult);
      newBattle.enemies = newBattle.enemies.map(e => {
        if (e.currentHp <= 0) return e;
        return applyDamageToEnemy(e, calculateDamage(dmg, newBattle.playerStatusEffects, e.statusEffects, run.items));
      });
    }
    if (qe.chainAmount) {
      const chainDmg = Math.floor(qe.chainAmount * batchMult);
      newBattle.enemies = newBattle.enemies.map(e => {
        if (e.currentHp <= 0) return e;
        return applyDamageToEnemy(e, calculateDamage(chainDmg, newBattle.playerStatusEffects, e.statusEffects, run.items));
      });
    }
    if (qe.burnApply) {
      const burnAmt = Math.floor(qe.burnApply * batchMult);
      newBattle.enemies = newBattle.enemies.map(e => ({
        ...e,
        statusEffects: { ...e.statusEffects, burn: (e.statusEffects.burn || 0) + burnAmt },
      }));
    }
  }
  // Track kills from detonateNow
  const killed = newBattle.enemies.filter(e => e.currentHp <= 0);
  newBattle.killCount = (newBattle.killCount || 0) + killed.length;
  newBattle.goldEarned = (newBattle.goldEarned || 0) + killed.reduce((s, e) => s + (e.gold || 0), 0);
  newBattle.enemies = newBattle.enemies.filter(e => e.currentHp > 0);
  newBattle.detonationQueue = [];
}
```

**Step 7: Add `primed` application in the enemy-hit section**

When a card applies `applyToTarget` status effects and the target gets `primed` stacks, immediately reduce all queue timers:

```typescript
// After applying applyToTarget to the enemy — add near the existing applyToTarget handler:
const primedApplied = effects.applyToTarget?.primed ?? 0;
if (primedApplied > 0) {
  newBattle.detonationQueue = (newBattle.detonationQueue || []).map(qe => ({
    ...qe,
    turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - primedApplied),
  }));
}
```

Also handle `applyToAll` primed (for Mark for Deletion):

```typescript
const primedAllApplied = effects.applyToAll?.primed ?? 0;
if (primedAllApplied > 0) {
  newBattle.detonationQueue = (newBattle.detonationQueue || []).map(qe => ({
    ...qe,
    turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - primedAllApplied),
  }));
}
```

**Step 8: Build**

```bash
npm run build
```

---

### Task 4: Re-tier existing backend cards

**Files:**
- Modify: `src/data/cards/backendCards.ts`

**Rules:**
- Fast (1 turn) — keep existing `queueX` fields, no change
- Quick (2 turns) — change field name to `queueXQuick`, buff value ×1.25
- Delayed (3 turns) — change field name to `queueXDelayed`, buff value ×1.5
- Charged (4 turns) — change field name to `queueXCharged`, buff value ×1.75

**Cards to keep as fast (no change):**
- cache_warmup, scheduled_exception, async_webhook (starter deck — always fast)
- cold_cache, stack_trace, index_scan, garbage_fire, exception_throw (commons)

**Cards to re-tier:**

**Quick (2 turns):**
| Card | Field change | New value |
|---|---|---|
| cold_backup | queueBlock: 18 → queueBlockQuick | 22 |
| connection_pool | queueBlock: 6 → queueBlockQuick | 8 |
| webhook_blast | queueDamageAll: 10 → queueDamageAllQuick | 13 |
| retry_loop | queueChain: 8 → queueChainQuick | 10 |
| pub_sub_event | queueChain: 8 → queueChainQuick | 10 |
| circuit_breaker | queueBlock: 10 → queueBlockQuick | 13 |
| async_task | queueChain: 6 → queueChainQuick | 8 |
| read_replica | queueBlock: 20 → queueBlockQuick | 25 |

**Delayed (3 turns):**
| Card | Field change | New value |
|---|---|---|
| kafka_offset | queueChain: 15 → queueChainDelayed | 22 |
| message_queue | queueChain: 10 → queueChainDelayed | 15 |
| distributed_strike | queueChain: 12 → queueChainDelayed | 18 |
| thunderbolt_query | queueChain: 14 → queueChainDelayed | 21 |
| event_storm | queueChain: 16 → queueChainDelayed | 24 |
| fuel_injection | queueBlock: 25 → queueBlockDelayed | 38 |
| backdraft | queueDamageAll: 30 → queueDamageAllDelayed | 45 (also queueBurn stays fast) |
| thermal_cascade | queueDamageAll: 18 → queueDamageAllDelayed | 27 |
| surge_discharge | queueChain: 30 → queueChainDelayed | 45 |
| batch_processing | all 3 fields → Delayed: queueBlockDelayed: 18, queueDamageAllDelayed: 18, queueChainDelayed: 18 |
| hot_standby | queueBlock: 14 → queueBlockDelayed | 21 |
| pagerduty_alert | queueDamageAll: 20 → queueDamageAllDelayed | 30 |

**Charged (4 turns):**
| Card | Field change | New value |
|---|---|---|
| absolute_zero | queueBlock: 30 → queueBlockCharged | 52 |
| ice_storm_deploy | queueBlock: 20 → queueBlockCharged | 35 |
| nuclear_deploy | queueBlock/DamageAll/Chain: 25 → queueXCharged | 44 each |
| chain_lightning | queueChain: 20 → queueChainCharged | 35 |
| thunderstorm_protocol | queueChain: 20 → queueChainCharged | 35 |
| production_incident | queueDamageAll: 35 → queueDamageAllCharged | 61 |
| server_meltdown | queueDamageAll: 30 → queueDamageAllCharged | 52 |
| cryo_cascade | queueBlock: 40 → queueBlockCharged | 70 |
| elemental_convergence | all 3 → Charged: each: 17 |
| infinite_loop | queueChain: 35 → queueChainCharged | 61 |

Also: for any card with a `queueBurn` field, leave it as `queueBurn` (fast, 1-turn burn) unless specifically noted — burn application is a debuff, less urgency than damage.

**Upgrades — update descriptions to reflect new timers:**

For fixed-path upgrades, chose the upgrade path that makes the most sense per card:
- **Speed path**: drop 1 tier (e.g. Charged→Delayed), keep same value. Update `upgradedEffects` field name accordingly.
- **Power path**: stay same tier, multiply value ×1.4. Keep same field name, update value.

**Step 1: Work through each card group methodically**

For each card, make the field name change + value update + update `upgradedEffects` + update `upgradedDescription` to say e.g. "Fires in 2 turns." or "Fires in 3 turns."

**Step 2: Build after each group**

```bash
npm run build
```

---

### Task 5: Add 6 new interaction cards

**Files:**
- Modify: `src/data/cards/backendCards.ts`

Add before the `technical_debt` curse card:

```typescript
early_patch: {
  id: 'early_patch', name: 'Early Patch', type: 'skill', target: 'self', cost: 1, rarity: 'common',
  class: 'backend',
  description: 'Reduce all queued timers by 1. Hotfix deployed ahead of schedule.',
  effects: { accelerateQueue: 1 },
  upgradedEffects: { accelerateQueue: 2 },
  upgradedDescription: 'Reduce all queued timers by 2.',
  icon: '⏩',
},

primed_shot: {
  id: 'primed_shot', name: 'Primed Shot', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend',
  description: 'Deal 8 damage. Apply 2 Primed — instantly reduces all queue timers by 2.',
  effects: { damage: 8, applyToTarget: { primed: 2 } },
  upgradedEffects: { damage: 12, applyToTarget: { primed: 3 } },
  upgradedDescription: 'Deal 12 damage. Apply 3 Primed (timers -3).',
  icon: '🎯',
},

hotpath_override: {
  id: 'hotpath_override', name: 'Hotpath Override', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
  class: 'backend',
  description: 'All pending queue effects gain +50% power. Profile before you optimize.',
  effects: { amplifyQueue: 50 },
  upgradedEffects: { amplifyQueue: 75 },
  upgradedDescription: 'All pending queue effects gain +75% power.',
  icon: '🔥',
},

mark_for_deletion: {
  id: 'mark_for_deletion', name: 'Mark for Deletion', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
  class: 'backend',
  description: 'Deal 10 damage to all. Apply 2 Primed to all enemies (timers -2).',
  effects: { damageAll: 10, applyToAll: { primed: 2 } },
  upgradedEffects: { damageAll: 14, applyToAll: { primed: 3 } },
  upgradedDescription: 'Deal 14 damage to all. Apply 3 Primed to all enemies (timers -3).',
  icon: '🗑️',
},

stack_overflow_card: {
  id: 'stack_overflow_card', name: 'Stack Overflow', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
  class: 'backend',
  description: 'Add 15 to the largest pending fire/lightning effect. If none exists, queue fast fire for 15.',
  effects: { stackMatchingQueue: { element: 'fire', amount: 15 } },
  upgradedEffects: { stackMatchingQueue: { element: 'fire', amount: 22 } },
  upgradedDescription: 'Add 22 to the largest pending fire/lightning effect.',
  icon: '📚',
},

system_flush: {
  id: 'system_flush', name: 'System Flush', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
  class: 'backend',
  description: 'Fire ALL queued effects immediately at full power with batch bonus. The queue is clear.',
  effects: { detonateNow: true },
  upgradedEffects: { detonateNow: true, block: 10 },
  upgradedDescription: 'Gain 10 block. Fire ALL queued effects immediately at full power.',
  icon: '💥',
},
```

**Step 1: Add cards**
**Step 2: Build**

```bash
npm run build
```

---

### Task 6: Update UI — move pills above enemies, countdown colors

**Files:**
- Modify: `src/components/battle/BattleScreen.tsx`
- Modify: `src/index.css`

**Step 1: Remove the existing SCHEDULED pills bar**

Find and remove the existing scheduled/detonation queue display section in `BattleScreen.tsx` (the section that renders the "SCHEDULED" pills row).

**Step 2: Add countdown pills above the enemies area**

In the enemies section of `BattleScreen.tsx`, add a pills row above the enemy displays:

```tsx
{/* Detonation countdown pills — shown above enemies */}
{battle.detonationQueue && battle.detonationQueue.length > 0 && (
  <div style={{
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: compact ? 6 : 10,
  }}>
    {battle.detonationQueue.map((qe, i) => {
      const turns = qe.turnsUntilFire ?? 1;
      const color = turns >= 4 ? '#4a9eff'      // blue — charged
        : turns === 3 ? '#22d3ee'               // teal — delayed
        : turns === 2 ? '#fbbf24'               // yellow — quick
        : '#ef4444';                             // red — fast/imminent
      const icon = qe.element === 'ice' ? '🧊'
        : qe.element === 'fire' ? '🔥' : '⚡';
      const value = qe.blockAmount ?? qe.damageAllAmount ?? qe.chainAmount ?? qe.burnApply ?? 0;
      return (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          padding: '2px 8px',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${color}`,
          fontSize: compact ? 10 : 12,
          color,
          fontWeight: 'bold',
        }}>
          <span>{icon}</span>
          <span>{value}</span>
          <span style={{ opacity: 0.8, fontSize: compact ? 9 : 11 }}>in {turns}</span>
        </div>
      );
    })}
  </div>
)}
```

**Step 3: Add `primed` to enemy status effect display**

In `src/components/battle/EnemyDisplay.tsx`, add `primed` to the status effects map:

```typescript
primed: { icon: '🎯', name: 'Primed', desc: 'queue timers reduced on application', color: '#f97316' },
```

In `src/components/common/StatusEffects.tsx`, add:

```typescript
primed: { icon: '🎯', label: 'Primed — Detonation timers were reduced when applied', unit: 'turns', color: '#f97316' },
```

**Step 4: Build**

```bash
npm run build
```

---

### Task 7: Bump GAME_VERSION

**Files:**
- Modify: `src/store/gameStore.ts`

Find `GAME_VERSION` at the top and bump:
```typescript
const GAME_VERSION = '1.17.0';
```

**Build final check:**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

---

## Verification Checklist (manual in-game)

- [ ] Play a fast card (e.g. `cache_warmup`) — queue pill appears red "in 1" — fires next turn
- [ ] Play a quick card — pill appears yellow "in 2" — fires 2 turns later
- [ ] Play a delayed card — pill appears teal "in 3" — fires 3 turns later
- [ ] Play a charged card — pill appears blue "in 4" — fires 4 turns later
- [ ] Play `early_patch` — all timer numbers decrease by 1
- [ ] Play `primed_shot` on enemy — enemy shows 🎯 debuff, all timers drop by 2
- [ ] Play `hotpath_override` — queue amounts visibly increase
- [ ] Play `system_flush` — all queued effects fire immediately, queue clears
- [ ] Kill an enemy via detonation — reward screen appears (no ghosted bug)
- [ ] Batch bonus still applies when 2+ element types fire on same turn
