# Backend Engineer Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Completely replace the Backend Engineer card pool with a "tanky elemental wizard" identity — three elemental archetypes (Ice, Fire, Lightning) built around a cross-turn **Surge** accumulator, backed by a new **Burn** DoT status effect and **Chain Hit** lightning strikes.

**Architecture:**
- New BattleState field: `surge` (cross-turn resource, never auto-resets, consumed by discharge effects)
- New StatusEffect: `burn` (fire DoT on enemies, ticks at player turn start like bleed)
- New CardEffect fields: `gainSurge`, `damagePerSurge`, `blockPerSurge`, `damageAllPerSurge`, `chainHit`
- Surge meter UI in BattleScreen (parallel to Flow meter for Frontend Dev)
- ~50 new cards split across Ice / Fire / Lightning archetypes

**Tech Stack:** React 19, TypeScript 5.9, Zustand 5 + Immer, plain CSS

---

## Scene-Setting Context

### The Character
Backend Dev is the "tanky elemental wizard" — high HP (85), methodical setup, survives current turns while charging power for devastating future turns. Think Dark Souls pyromancer crossed with a principal engineer at 3AM during an outage.

### The Three Archetypes

**🧊 Ice — "Cold Storage"**
- Builds **Surge** while gaining block (defensive ramp-up)
- Debuffs enemies with Weak/Vulnerable ("the DB is frozen, nothing can hit you")
- Themes: caching, Redis, CDN, rate limiting, database indexes, connection pools, cold backups

**🔥 Fire — "Production Incident"**
- Applies **Burn** DoT (fire ticking at start of each player turn, like bleed)
- Consumes Surge for explosive finishers (the payoff after setup)
- Themes: server fires, exceptions, hot paths, GC pauses, oncall alerts, flame wars, 500 errors

**⚡ Lightning — "Distributed Systems"**
- **Chain Hit** attacks (deal extra damage to ALL other enemies)
- Discharges Surge as AoE devastation (`damageAllPerSurge`)
- Themes: webhooks, Kafka, event buses, microservices, retries, circuit breakers, pub/sub

### The Fantasy
You spend early turns behind Ice walls, accumulating Surge. Fire cards bleed down enemies while you ramp. Then one turn you drop `Surge Discharge` or `Event Storm` and watch the whole encounter evaporate. Pure scaled wizard payoff.

---

## Existing System (Do NOT change)

- `bleed` in StatusEffect already implemented (Frontend mechanic) — burn is **separate** and parallel
- `flow` + `nextCardCostReduction` in BattleState — Backend does NOT use these
- `temperature`, `tokens`, `cardPlayCounts` in BattleState — AI Engineer only
- `tickStatusEffects` / `mergeStatusEffects` in `battleEngine.ts` — extend only, don't touch existing entries
- `startNewTurn` bleed logic in `battleActions.ts` — add burn block AFTER the bleed block, same pattern

---

## Task 1: Add types to `src/types/index.ts`

**Files:**
- Modify: `src/types/index.ts`

### 1a. Add `burn` to StatusEffect (after `bleed`)

```ts
// BEFORE (after bleed line):
bleed?: number;           // enemy DoT: deal bleed stacks damage at start of player turn, then decrement

// AFTER (add immediately below):
burn?: number;            // enemy fire DoT: deal burn stacks damage at start of player turn, then decrement
```

### 1b. Add `surge` to BattleState (after `nextCardCostReduction`)

```ts
// Add to BattleState, after nextCardCostReduction:
// Backend Engineer mechanics
surge: number;                    // cross-turn accumulator; never auto-resets; consumed by discharge effects
```

### 1c. Add 5 new fields to CardEffect (after `doubleTargetBleed`)

```ts
// After doubleTargetBleed: boolean line, add:
// Backend Engineer mechanics
gainSurge?: number;               // add N to BattleState.surge (persists across turns)
damagePerSurge?: number;          // deal N × surge bonus damage to target, then surge → 0
blockPerSurge?: number;           // gain N × surge block, then surge → 0 (can combine with damagePerSurge)
damageAllPerSurge?: number;       // deal N × surge to ALL enemies, then surge → 0
chainHit?: number;                // after hitting primary target, deal N damage to ALL other enemies
```

**Critical implementation note for surge-consuming effects:**
When a card has multiple surge fields (e.g., `blockPerSurge` AND `damagePerSurge`), capture surge value FIRST, apply ALL effects, THEN set surge → 0. Never reset surge between individual effects.

---

## Task 2: Update `src/utils/battleEngine.ts`

**Files:**
- Modify: `src/utils/battleEngine.ts`

### 2a. Add `burn` to `tickStatusEffects` (after the `bleed` persistence line)

Find this exact comment and line:
```ts
// bleed persists on enemies — NOT ticked here, handled in startNewTurn to apply damage then decrement
if (effects.bleed && effects.bleed > 0) newEffects.bleed = effects.bleed;
```

Add after:
```ts
// burn persists on enemies — NOT ticked here, handled in startNewTurn to apply damage then decrement
if (effects.burn && effects.burn > 0) newEffects.burn = effects.burn;
```

### 2b. Add `burn` to `mergeStatusEffects` (after the `bleed` merge line)

Find:
```ts
bleed: (existing.bleed || 0) + (apply.bleed || 0) || undefined,
```

Add after:
```ts
burn: (existing.burn || 0) + (apply.burn || 0) || undefined,
```

---

## Task 3: Update `src/store/battleActions.ts`

**Files:**
- Modify: `src/store/battleActions.ts`

### 3a. Add `surge: 0` to `initBattle`

In `initBattle`, find the return object where `flow: 0, nextCardCostReduction: 0` are set. Add `surge: 0` alongside them:

```ts
// Add to the BattleState object in initBattle return:
surge: 0,
```

### 3b. Add surge/chainHit effects to `executePlayCard`

Find the section with Flow State effects (labeled "Flow State: auto +1 flow"). Add a new section AFTER the Flow State block and AFTER the damagePerBleed/doubleTargetBleed steps:

```ts
// ── Surge mechanics (Backend Engineer) ──

// gainSurge: add N to cross-turn surge accumulator
if (effects.gainSurge) {
  newBattle.surge = (newBattle.surge ?? 0) + effects.gainSurge;
}

// Surge-consuming effects (all capture surge first, then reset to 0)
const hasSurgeConsume = effects.damagePerSurge || effects.blockPerSurge || effects.damageAllPerSurge;
if (hasSurgeConsume) {
  const surgeVal = newBattle.surge ?? 0;

  // blockPerSurge: gain (N × surge) block
  if (effects.blockPerSurge) {
    const bonusBlock = Math.floor(surgeVal * effects.blockPerSurge);
    newBattle.playerBlock += bonusBlock;
  }

  // damagePerSurge: deal (N × surge) bonus damage to target
  if (effects.damagePerSurge && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const dmg = calculateDamage(
        Math.floor(surgeVal * effects.damagePerSurge),
        battle.playerStatusEffects,
        newBattle.enemies[enemyIdx].statusEffects,
        run.items
      );
      if (dmg > 0) {
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      }
    }
  }

  // damageAllPerSurge: deal (N × surge) to ALL enemies
  if (effects.damageAllPerSurge) {
    const dmgEach = Math.floor(surgeVal * effects.damageAllPerSurge);
    if (dmgEach > 0) {
      newBattle.enemies = newBattle.enemies.map(e => {
        if (e.currentHp <= 0) return e;
        const dmg = calculateDamage(dmgEach, battle.playerStatusEffects, e.statusEffects, run.items);
        return applyDamageToEnemy(e, dmg);
      });
    }
  }

  // Reset surge after all consuming effects
  newBattle.surge = 0;
}

// chainHit: deal N damage to ALL OTHER enemies (not the primary target)
if (effects.chainHit && targetInstanceId) {
  const chainDmg = effects.chainHit;
  newBattle.enemies = newBattle.enemies.map(e => {
    if (e.instanceId === targetInstanceId) return e; // skip primary target
    if (e.currentHp <= 0) return e;                  // skip dead
    const dmg = calculateDamage(chainDmg, battle.playerStatusEffects, e.statusEffects, run.items);
    return applyDamageToEnemy(e, dmg);
  });
}
```

**Placement:** This block must come AFTER the `doubleTargetBleed` block and BEFORE the dead-enemy filtering / kill counting logic at the end of `executePlayCard`.

### 3c. Add burn DoT tick to `startNewTurn`

Find this block in `startNewTurn` (right after the bleed block):
```ts
// Suppress unused variable warnings — these will be merged into battle state below
void bleedKillCount; void bleedGoldEarned;
```

Add a parallel burn block IMMEDIATELY AFTER it:

```ts
// Apply Burn damage to enemies (Backend mechanic: fires at start of player's turn)
// Burn is NOT decremented by tickStatusEffects — handled here for full control, same pattern as bleed
postDeployEnemies = postDeployEnemies.map(e => {
  const burnDmg = e.statusEffects.burn || 0;
  if (burnDmg <= 0) return e;
  const damaged = applyDamageToEnemy({ ...e, statusEffects: { ...e.statusEffects } }, burnDmg);
  const newBurn = burnDmg > 1 ? burnDmg - 1 : undefined;
  return {
    ...damaged,
    statusEffects: { ...damaged.statusEffects, burn: newBurn },
  };
});
// Filter enemies killed by burn (kill count tracked via existing dead-enemy filter below)
postDeployEnemies = postDeployEnemies.filter(e => e.currentHp > 0);
```

---

## Task 4: Add Surge meter to `src/components/battle/BattleScreen.tsx`

**Files:**
- Modify: `src/components/battle/BattleScreen.tsx`

Find the FLOW meter block for `frontend_dev`:
```tsx
{run.character.id === 'frontend_dev' && battle && (
  // ... flow meter ...
)}
```

Add a **parallel block** for `backend_dev` right after it:

```tsx
{run.character.id === 'backend_dev' && battle && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
    <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>SURGE</span>
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,200,50,0.3)',
      borderRadius: 6,
      padding: '4px 8px',
      minWidth: 40,
      textAlign: 'center',
    }}>
      <span style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: (battle.surge ?? 0) >= 10 ? '#f87171'
             : (battle.surge ?? 0) >= 5  ? '#fbbf24'
             : '#60a5fa',
      }}>
        {battle.surge ?? 0}
      </span>
    </div>
    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
      {(battle.surge ?? 0) >= 10 ? '⚡ OVERLOADED' : (battle.surge ?? 0) >= 5 ? '🔥 CHARGED' : '🧊 BUILDING'}
    </span>
  </div>
)}
```

**Colors:** Blue (0–4 surge = building), Yellow/gold (5–9 = charged), Red (10+ = overloaded). No overflow mechanic — surge just accumulates until spent.

---

## Task 5: Write `src/data/cards/backendCards.ts`

**Files:**
- Modify: `src/data/cards/backendCards.ts` (complete replacement)

Complete 50-card spec below. All cards are `class: 'backend'` unless noted.

**IMPORTANT ID conflicts to avoid:**
- `memory_leak` is in new `frontendCards.ts` — do NOT use this ID
- `scope_creep` is in `architectCards.ts` starter — do NOT use this ID
- `coffee_break` is in `neutralCards.ts` — do NOT redefine it (just use in starter deck)

### Starters (5 cards)

```ts
cache_strike: {
  id: 'cache_strike', name: 'Cache Strike', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
  class: 'backend', archetype: 'ice',
  description: 'Deal 7 damage. Gain 2 Surge. What do we want? Faster queries. How? Cache everything. Why is it broken? Unknown.',
  effects: { damage: 7, gainSurge: 2 },
  upgradedEffects: { damage: 10, gainSurge: 3 },
  upgradedDescription: 'Deal 10 damage. Gain 3 Surge.',
  icon: '🧊',
},

server_wall: {
  id: 'server_wall', name: 'Server Wall', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
  class: 'backend', archetype: 'ice',
  description: 'Gain 6 block. Gain 2 Surge. HTTP 502: Bad Gateway to your face.',
  effects: { block: 6, gainSurge: 2 },
  upgradedEffects: { block: 9, gainSurge: 3 },
  upgradedDescription: 'Gain 9 block. Gain 3 Surge.',
  icon: '🛡️',
},

hot_reload: {
  id: 'hot_reload', name: 'Hot Reload', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
  class: 'backend', archetype: 'fire',
  description: 'Deal 8 damage. Restart everything in production. The traditional solution.',
  effects: { damage: 8 },
  upgradedEffects: { damage: 12 },
  upgradedDescription: 'Deal 12 damage.',
  icon: '🔥',
},

spark_test: {
  id: 'spark_test', name: 'Spark Test', type: 'attack', target: 'enemy', cost: 0, rarity: 'starter',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 5 damage. Gain 1 Surge. ICMP ECHO REQUEST, but electric.',
  effects: { damage: 5, gainSurge: 1 },
  upgradedEffects: { damage: 7, gainSurge: 1 },
  upgradedDescription: 'Deal 7 damage. Gain 1 Surge.',
  icon: '⚡',
},

stack_trace: {
  id: 'stack_trace', name: 'Stack Trace', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
  class: 'backend',
  description: 'Draw 2 cards. Follow the breadcrumbs of your failures.',
  effects: { draw: 2 },
  upgradedEffects: { draw: 3 },
  upgradedDescription: 'Draw 3 cards.',
  icon: '📜',
},
```

### Ice Commons (5 cards)

```ts
redis_hit: {
  id: 'redis_hit', name: 'Redis Hit', type: 'skill', target: 'self', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'ice',
  description: 'Gain 5 block. Gain 3 Surge. TTL: infinite. Until someone clears it.',
  effects: { block: 5, gainSurge: 3 },
  upgradedEffects: { block: 8, gainSurge: 4 },
  upgradedDescription: 'Gain 8 block. Gain 4 Surge.',
  icon: '🗄️',
},

connection_pool: {
  id: 'connection_pool', name: 'Connection Pool', type: 'skill', target: 'self', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'ice',
  description: 'Gain 8 block. maxPoolSize: 10. Current connections: 11. Panic.',
  effects: { block: 8 },
  upgradedEffects: { block: 12 },
  upgradedDescription: 'Gain 12 block.',
  icon: '🔌',
},

cold_backup: {
  id: 'cold_backup', name: 'Cold Backup', type: 'skill', target: 'self', cost: 2, rarity: 'common',
  class: 'backend', archetype: 'ice',
  description: 'Gain 14 block. Gain 1 Surge. The backup exists. It has never been restored. You\'re fine.',
  effects: { block: 14, gainSurge: 1 },
  upgradedEffects: { block: 20, gainSurge: 2 },
  upgradedDescription: 'Gain 20 block. Gain 2 Surge.',
  icon: '💾',
},

read_replica: {
  id: 'read_replica', name: 'Read Replica', type: 'skill', target: 'self', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'ice',
  description: 'Gain 4 block. Draw 1 card. Offload reads to the replica. It is 3 seconds behind. Like your career.',
  effects: { block: 4, draw: 1 },
  upgradedEffects: { block: 6, draw: 2 },
  upgradedDescription: 'Gain 6 block. Draw 2 cards.',
  icon: '📋',
},

index_scan: {
  id: 'index_scan', name: 'Index Scan', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'ice',
  description: 'Deal 7 damage. Apply 1 Weak. EXPLAIN ANALYZE: full table scan. Your DBA has given up.',
  effects: { damage: 7, applyToTarget: { weak: 1 } },
  upgradedEffects: { damage: 9, applyToTarget: { weak: 2 } },
  upgradedDescription: 'Deal 9 damage. Apply 2 Weak.',
  icon: '🔍',
},
```

### Fire Commons (5 cards)

```ts
exception_throw: {
  id: 'exception_throw', name: 'Exception Throw', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'fire',
  description: 'Deal 9 damage. Apply 2 Burn. RuntimeException: you exist.',
  effects: { damage: 9, applyToTarget: { burn: 2 } },
  upgradedEffects: { damage: 12, applyToTarget: { burn: 3 } },
  upgradedDescription: 'Deal 12 damage. Apply 3 Burn.',
  icon: '💥',
},

server_500: {
  id: 'server_500', name: '500 Error', type: 'attack', target: 'enemy', cost: 2, rarity: 'common',
  class: 'backend', archetype: 'fire',
  description: 'Deal 14 damage. Internal Server Error. The error is you.',
  effects: { damage: 14 },
  upgradedEffects: { damage: 20 },
  upgradedDescription: 'Deal 20 damage.',
  icon: '🚨',
},

hot_path: {
  id: 'hot_path', name: 'Hot Path', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'fire',
  description: 'Deal 7 damage. Gain 2 Surge. The 20% of code responsible for 100% of the incidents.',
  effects: { damage: 7, gainSurge: 2 },
  upgradedEffects: { damage: 10, gainSurge: 3 },
  upgradedDescription: 'Deal 10 damage. Gain 3 Surge.',
  icon: '🌡️',
},

memory_spike: {
  id: 'memory_spike', name: 'Memory Spike', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'fire',
  description: 'Deal 6 damage. Gain 1 Confidence (+1 dmg per stack). GC pause: 4 seconds. SLA: 2 seconds. Incident: filed.',
  effects: { damage: 6, applyToSelf: { confidence: 1 } },
  upgradedEffects: { damage: 8, applyToSelf: { confidence: 2 } },
  upgradedDescription: 'Deal 8 damage. Gain 2 Confidence.',
  icon: '📈',
},

garbage_fire: {
  id: 'garbage_fire', name: 'Garbage Fire', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'fire',
  description: 'Deal 5 damage. Apply 3 Burn. It runs. It shouldn\'t. It is, however, on fire.',
  effects: { damage: 5, applyToTarget: { burn: 3 } },
  upgradedEffects: { damage: 7, applyToTarget: { burn: 4 } },
  upgradedDescription: 'Deal 7 damage. Apply 4 Burn.',
  icon: '🔥',
},
```

### Lightning Commons (5 cards)

```ts
webhook_blast: {
  id: 'webhook_blast', name: 'Webhook Blast', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 5 damage to ALL enemies. POST /notify. Delivered. Delivered again. Delivered 47 more times.',
  effects: { damageAll: 5 },
  upgradedEffects: { damageAll: 8 },
  upgradedDescription: 'Deal 8 damage to ALL enemies.',
  icon: '📡',
},

retry_loop: {
  id: 'retry_loop', name: 'Retry Loop', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 5 damage. Gain 1 Surge. MAX_RETRIES: 3. Attempts: 40. Confidence: gone.',
  effects: { damage: 5, gainSurge: 1 },
  upgradedEffects: { damage: 8, gainSurge: 2 },
  upgradedDescription: 'Deal 8 damage. Gain 2 Surge.',
  icon: '🔄',
},

pub_sub_event: {
  id: 'pub_sub_event', name: 'Pub/Sub Event', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 5 damage. Deal 4 damage to ALL other enemies. Published to 3 services. Consumed by 6. None expected it.',
  effects: { damage: 5, chainHit: 4 },
  upgradedEffects: { damage: 7, chainHit: 6 },
  upgradedDescription: 'Deal 7 damage. Deal 6 damage to ALL other enemies.',
  icon: '📢',
},

circuit_breaker: {
  id: 'circuit_breaker', name: 'Circuit Breaker', type: 'skill', target: 'self', cost: 1, rarity: 'common',
  class: 'backend', archetype: 'lightning',
  description: 'Gain 4 block. Gain 2 Surge. OPEN state. Your requests are kindly refused. For everyone\'s safety.',
  effects: { block: 4, gainSurge: 2 },
  upgradedEffects: { block: 6, gainSurge: 3 },
  upgradedDescription: 'Gain 6 block. Gain 3 Surge.',
  icon: '⚡',
},

async_task: {
  id: 'async_task', name: 'Async Task', type: 'attack', target: 'enemy', cost: 0, rarity: 'common',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 4 damage. Gain 1 Surge. Fire and forget. Mostly forget.',
  effects: { damage: 4, gainSurge: 1 },
  upgradedEffects: { damage: 6, gainSurge: 1 },
  upgradedDescription: 'Deal 6 damage. Gain 1 Surge.',
  icon: '⏳',
},
```

### Ice Rares (5 cards)

```ts
permafrost: {
  id: 'permafrost', name: 'Permafrost', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'ice',
  description: 'Gain 12 block. Gain 6 Surge. The cache entry that lives forever. The bug that stays with it.',
  effects: { block: 12, gainSurge: 6 },
  upgradedEffects: { block: 16, gainSurge: 8 },
  upgradedDescription: 'Gain 16 block. Gain 8 Surge.',
  icon: '❄️',
},

database_lock: {
  id: 'database_lock', name: 'Database Lock', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'ice',
  description: 'Deal 8 damage. Gain 10 block. Gain 3 Surge. Apply 2 Vulnerable. SELECT * FOR UPDATE. Nobody else gets a turn.',
  effects: { damage: 8, block: 10, gainSurge: 3, applyToTarget: { vulnerable: 2 } },
  upgradedEffects: { damage: 12, block: 14, gainSurge: 4, applyToTarget: { vulnerable: 3 } },
  upgradedDescription: 'Deal 12 damage. Gain 14 block. Gain 4 Surge. Apply 3 Vulnerable.',
  icon: '🔒',
},

cdn_edge: {
  id: 'cdn_edge', name: 'CDN Edge', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
  class: 'backend', archetype: 'ice',
  description: 'Gain 6 block. Apply 1 Vulnerable to ALL enemies. Distributed everywhere. Correct nowhere.',
  effects: { block: 6, applyToAll: { vulnerable: 1 } },
  upgradedEffects: { block: 9, applyToAll: { vulnerable: 2 } },
  upgradedDescription: 'Gain 9 block. Apply 2 Vulnerable to ALL enemies.',
  icon: '🌐',
},

rate_limiter: {
  id: 'rate_limiter', name: 'Rate Limiter', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'ice',
  description: 'Gain block equal to 2× your current Surge. Consume all Surge. 429 Too Many Requests. You are the request.',
  effects: { blockPerSurge: 2 },
  upgradedEffects: { blockPerSurge: 3 },
  upgradedDescription: 'Gain block equal to 3× your current Surge. Consume all Surge.',
  icon: '🚧',
},

kubernetes_pod: {
  id: 'kubernetes_pod', name: 'K8s Pod', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'ice',
  description: 'Gain 5 block. Deploy a Pod for 3 turns (3 block/turn). kubectl apply -f hope.yml. Status: Pending.',
  effects: { block: 5, deploy: { name: 'K8s Pod', icon: '⚓', turns: 3, blockPerTurn: 3 } },
  upgradedEffects: { block: 8, deploy: { name: 'K8s Pod+', icon: '⚓', turns: 4, blockPerTurn: 4 } },
  upgradedDescription: 'Gain 8 block. Deploy a Pod for 4 turns (4 block/turn).',
  icon: '⚓',
},
```

### Fire Rares (5 cards)

```ts
core_dump: {
  id: 'core_dump', name: 'Core Dump', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'fire',
  description: 'Deal 16 damage. Apply 3 Burn. SIGSEGV. The stack couldn\'t handle the meeting either.',
  effects: { damage: 16, applyToTarget: { burn: 3 } },
  upgradedEffects: { damage: 22, applyToTarget: { burn: 4 } },
  upgradedDescription: 'Deal 22 damage. Apply 4 Burn.',
  icon: '💀',
},

exception_cascade: {
  id: 'exception_cascade', name: 'Exception Cascade', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'fire',
  description: 'Deal 8 damage + 1 per Surge. Consume all Surge. NullPointerException → IllegalStateException → you\'re fired.',
  effects: { damage: 8, damagePerSurge: 1 },
  upgradedEffects: { damage: 12, damagePerSurge: 2 },
  upgradedDescription: 'Deal 12 damage + 2 per Surge. Consume all Surge.',
  icon: '💥',
},

flame_war: {
  id: 'flame_war', name: 'Flame War PR', type: 'attack', target: 'enemy', cost: 1, rarity: 'rare',
  class: 'backend', archetype: 'fire',
  description: 'Deal 6 damage. Apply 2 Burn and 2 Vulnerable. 500-comment PR. Still unmerged. Still smoldering.',
  effects: { damage: 6, applyToTarget: { burn: 2, vulnerable: 2 } },
  upgradedEffects: { damage: 9, applyToTarget: { burn: 3, vulnerable: 3 } },
  upgradedDescription: 'Deal 9 damage. Apply 3 Burn and 3 Vulnerable.',
  icon: '💬',
},

pagerduty_alert: {
  id: 'pagerduty_alert', name: 'PagerDuty Alert', type: 'attack', target: 'enemy', cost: 1, rarity: 'rare',
  class: 'backend', archetype: 'fire',
  description: 'Deal 8 damage. Gain 2 Confidence. CRITICAL. 3AM. Your turn. The server\'s turn. Everyone\'s turn.',
  effects: { damage: 8, applyToSelf: { confidence: 2 } },
  upgradedEffects: { damage: 12, applyToSelf: { confidence: 3 } },
  upgradedDescription: 'Deal 12 damage. Gain 3 Confidence.',
  icon: '📟',
},

hot_standby: {
  id: 'hot_standby', name: 'Hot Standby', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'fire',
  description: 'Deal 12 damage. Gain 4 Surge. Always on. Always alert. Spiritually exhausted. Deploying anyway.',
  effects: { damage: 12, gainSurge: 4 },
  upgradedEffects: { damage: 16, gainSurge: 5 },
  upgradedDescription: 'Deal 16 damage. Gain 5 Surge.',
  icon: '🔋',
},
```

### Lightning Rares (5 cards)

```ts
distributed_strike: {
  id: 'distributed_strike', name: 'Distributed Strike', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 8 damage. Deal 6 damage to ALL other enemies. Microservices: 8 hops to display a button. All failing.',
  effects: { damage: 8, chainHit: 6 },
  upgradedEffects: { damage: 12, chainHit: 8 },
  upgradedDescription: 'Deal 12 damage. Deal 8 damage to ALL other enemies.',
  icon: '⚡',
},

event_storm: {
  id: 'event_storm', name: 'Event Storm', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 1 damage per Surge to ALL enemies. Consume all Surge. The event bus is melting. This is fine.',
  effects: { damageAllPerSurge: 1 },
  upgradedEffects: { damageAllPerSurge: 2 },
  upgradedDescription: 'Deal 2 damage per Surge to ALL enemies. Consume all Surge.',
  icon: '🌩️',
},

kafka_offset: {
  id: 'kafka_offset', name: 'Kafka Offset', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
  class: 'backend', archetype: 'lightning',
  description: 'Gain 3 Surge. Draw 1 card. Committed at offset 1. Committed at offset 1 again. 8 million messages. Still going.',
  effects: { gainSurge: 3, draw: 1 },
  upgradedEffects: { gainSurge: 4, draw: 2 },
  upgradedDescription: 'Gain 4 Surge. Draw 2 cards.',
  icon: '📮',
},

message_queue: {
  id: 'message_queue', name: 'Message Queue', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 5 damage to ALL enemies. Draw 1 card. SQS visibility timeout: 30s. Time to fix this: TBD.',
  effects: { damageAll: 5, draw: 1 },
  upgradedEffects: { damageAll: 8, draw: 2 },
  upgradedDescription: 'Deal 8 damage to ALL enemies. Draw 2 cards.',
  icon: '📬',
},

thunderbolt_query: {
  id: 'thunderbolt_query', name: 'Thunderbolt Query', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 12 damage. Deal 5 damage to ALL other enemies. N+1 queries, but N is large. Intentionally.',
  effects: { damage: 12, chainHit: 5 },
  upgradedEffects: { damage: 16, chainHit: 7 },
  upgradedDescription: 'Deal 16 damage. Deal 7 damage to ALL other enemies.',
  icon: '⚡',
},
```

### Ice Epics (3 cards)

```ts
absolute_zero: {
  id: 'absolute_zero', name: 'Absolute Zero', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'ice',
  exhaust: true,
  description: 'Gain block equal to 3× your current Surge. Consume all Surge. Exhaust. 0 Kelvin: unreachable. Your DB latency: attempting it.',
  effects: { blockPerSurge: 3 },
  upgradedEffects: { blockPerSurge: 4 },
  upgradedDescription: 'Gain block equal to 4× your current Surge. Consume all Surge. Exhaust.',
  icon: '🌨️',
},

ice_storm_deploy: {
  id: 'ice_storm_deploy', name: 'Ice Storm Deploy', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'ice',
  description: 'Gain 10 block. Apply 2 Vulnerable and 1 Weak to ALL enemies. Blue/Green deploy: blue died. Green panicked. Purple was a mistake.',
  effects: { block: 10, applyToAll: { vulnerable: 2, weak: 1 } },
  upgradedEffects: { block: 14, applyToAll: { vulnerable: 3, weak: 2 } },
  upgradedDescription: 'Gain 14 block. Apply 3 Vulnerable and 2 Weak to ALL enemies.',
  icon: '🌪️',
},

cold_replication: {
  id: 'cold_replication', name: 'Cold Replication', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'ice',
  description: 'Gain 12 block. Gain 8 Surge. Multi-region failover. Your primary is already gone. This is the last stand.',
  effects: { block: 12, gainSurge: 8 },
  upgradedEffects: { block: 16, gainSurge: 10 },
  upgradedDescription: 'Gain 16 block. Gain 10 Surge.',
  icon: '🔄',
},
```

### Fire Epics (3 cards)

```ts
volcanic_exception: {
  id: 'volcanic_exception', name: 'Volcanic Exception', type: 'attack', target: 'enemy', cost: 3, rarity: 'epic',
  class: 'backend', archetype: 'fire',
  exhaust: true,
  description: 'Deal 20 damage. Apply 5 Burn. Exhaust. The exception your CEO will screenshot. Forever.',
  effects: { damage: 20, applyToTarget: { burn: 5 } },
  upgradedEffects: { damage: 28, applyToTarget: { burn: 6 } },
  upgradedDescription: 'Deal 28 damage. Apply 6 Burn. Exhaust.',
  icon: '🌋',
},

server_meltdown: {
  id: 'server_meltdown', name: 'Server Meltdown', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'fire',
  exhaust: true,
  description: 'Deal 3 damage per Surge to target. Consume all Surge. Exhaust. 99.9% uptime. The 0.1%: legendary.',
  effects: { damagePerSurge: 3 },
  upgradedEffects: { damagePerSurge: 4 },
  upgradedDescription: 'Deal 4 damage per Surge to target. Consume all Surge. Exhaust.',
  icon: '💣',
},

firestorm_refactor: {
  id: 'firestorm_refactor', name: 'Firestorm Refactor', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'fire',
  description: 'Deal 8 damage to ALL enemies. Apply 2 Burn to ALL enemies. The big rewrite. The consequences: permanent.',
  effects: { damageAll: 8, applyToAll: { burn: 2 } },
  upgradedEffects: { damageAll: 12, applyToAll: { burn: 3 } },
  upgradedDescription: 'Deal 12 damage to ALL enemies. Apply 3 Burn to ALL enemies.',
  icon: '🔥',
},
```

### Lightning Epics (3 cards)

```ts
chain_lightning: {
  id: 'chain_lightning', name: 'Chain Lightning', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 10 damage. Deal 10 damage to ALL other enemies. One request. Seven downstream services. All failing.',
  effects: { damage: 10, chainHit: 10 },
  upgradedEffects: { damage: 14, chainHit: 12 },
  upgradedDescription: 'Deal 14 damage. Deal 12 damage to ALL other enemies.',
  icon: '⚡',
},

surge_discharge: {
  id: 'surge_discharge', name: 'Surge Discharge', type: 'attack', target: 'all_enemies', cost: 0, rarity: 'epic',
  class: 'backend', archetype: 'lightning',
  exhaust: true,
  description: 'Deal 2 damage per Surge to ALL enemies. Consume all Surge. Exhaust. Uncontrolled. Unstoppable. Unintentional.',
  effects: { damageAllPerSurge: 2 },
  upgradedEffects: { damageAllPerSurge: 3 },
  upgradedDescription: 'Deal 3 damage per Surge to ALL enemies. Consume all Surge. Exhaust.',
  icon: '⚡',
},

thunderstorm_protocol: {
  id: 'thunderstorm_protocol', name: 'Thunderstorm Protocol', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
  class: 'backend', archetype: 'lightning',
  description: 'Deal 6 damage. Deal 6 damage to ALL other enemies. Gain 4 Surge. Distribute the pain. Retain the power.',
  effects: { damage: 6, chainHit: 6, gainSurge: 4 },
  upgradedEffects: { damage: 9, chainHit: 8, gainSurge: 5 },
  upgradedDescription: 'Deal 9 damage. Deal 8 damage to ALL other enemies. Gain 5 Surge.',
  icon: '🌩️',
},
```

### Cross-Archetype Epic (1 card)

```ts
elemental_convergence: {
  id: 'elemental_convergence', name: 'Elemental Convergence', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
  class: 'backend',
  description: 'Gain 15 block. Gain 8 Surge. Gain 2 Confidence. Gain 2 Resilience. Fire, ice, lightning: mastered together. Nothing survives.',
  effects: { block: 15, gainSurge: 8, applyToSelf: { confidence: 2, resilience: 2 } },
  upgradedEffects: { block: 20, gainSurge: 10, applyToSelf: { confidence: 3, resilience: 3 } },
  upgradedDescription: 'Gain 20 block. Gain 10 Surge. Gain 3 Confidence. Gain 3 Resilience.',
  icon: '🌟',
},
```

### Legendaries (4 cards)

```ts
omniscient_debugger: {
  id: 'omniscient_debugger', name: 'Omniscient Debugger', type: 'attack', target: 'enemy', cost: 3, rarity: 'legendary',
  class: 'backend',
  exhaust: true,
  description: 'Deal 25 damage. Deal 15 damage to ALL other enemies. Apply 3 Burn and 3 Vulnerable. Exhaust. You understand every line. Every TODO. You are the horror.',
  effects: { damage: 25, chainHit: 15, applyToTarget: { burn: 3, vulnerable: 3 } },
  upgradedEffects: { damage: 32, chainHit: 20, applyToTarget: { burn: 4, vulnerable: 4 } },
  upgradedDescription: 'Deal 32 damage. Deal 20 to ALL others. Apply 4 Burn + 4 Vulnerable. Exhaust.',
  icon: '🔮',
},

chaos_monkey: {
  id: 'chaos_monkey', name: 'Chaos Monkey', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'legendary',
  class: 'backend',
  description: 'Deal 3 damage per Surge to ALL enemies. Apply 2 Vulnerable to ALL enemies. Consume all Surge. Netflix\'s gift: random failure, statistically inevitable.',
  effects: { damageAllPerSurge: 3, applyToAll: { vulnerable: 2 } },
  upgradedEffects: { damageAllPerSurge: 4, applyToAll: { vulnerable: 3 } },
  upgradedDescription: 'Deal 4 damage per Surge to ALL. Apply 3 Vulnerable to ALL. Consume all Surge.',
  icon: '🐒',
},

infinite_scaling: {
  id: 'infinite_scaling', name: 'Infinite Scaling', type: 'skill', target: 'self', cost: 3, rarity: 'legendary',
  class: 'backend',
  description: 'Deploy an Auto-Scaler for 5 turns (5 dmg + 3 block/turn). Min: 1 instance. Max: ∞. Billing: also ∞.',
  effects: { deploy: { name: 'Auto-Scaler', icon: '📊', turns: 5, attackPerTurn: 5, blockPerTurn: 3 } },
  upgradedEffects: { deploy: { name: 'Auto-Scaler+', icon: '📊', turns: 7, attackPerTurn: 7, blockPerTurn: 4 } },
  upgradedDescription: 'Deploy an Auto-Scaler for 7 turns (7 dmg + 4 block/turn).',
  icon: '📊',
},

production_incident: {
  id: 'production_incident', name: 'Production Incident', type: 'skill', target: 'self', cost: 3, rarity: 'legendary',
  class: 'backend',
  exhaust: true,
  description: 'Gain 30 block. Gain 15 Surge. Reduce stress by 20. Exhaust. The incident report writes itself. You survived. Technically.',
  effects: { block: 30, gainSurge: 15, copium: 20 },
  upgradedEffects: { block: 40, gainSurge: 20, copium: 25 },
  upgradedDescription: 'Gain 40 block. Gain 20 Surge. Reduce stress by 25. Exhaust.',
  icon: '🚒',
},
```

### Curse (1 card)

```ts
technical_debt: {
  id: 'technical_debt', name: 'Technical Debt', type: 'curse', target: 'self', cost: 0, rarity: 'curse',
  class: 'backend',
  description: 'When drawn, gain 5 Stress. // FIXME: this will be fixed eventually. (It won\'t.)',
  effects: { stress: 5 },
  upgradedEffects: { stress: 3 },
  upgradedDescription: 'When drawn, gain 3 Stress.',
  icon: '💸',
},
```

---

## Task 6: Update `src/data/characters.ts`

**Files:**
- Modify: `src/data/characters.ts`

Update the `backend_dev` character object:

```ts
{
  id: 'backend_dev',
  name: 'Backend Dev',
  title: 'The Elemental Architect',      // changed from 'The Server Sentinel'
  hp: 85,
  energy: 3,
  maxStress: 110,
  description: 'Tanky elemental wizard. Build Surge with Ice cards, ignite enemies with Fire, discharge lightning for AoE devastation. High HP, high setup, high payoff.',
  starterDeckIds: [
    'cache_strike', 'cache_strike', 'cache_strike', 'cache_strike',
    'server_wall', 'server_wall',
    'hot_reload',
    'spark_test',
    'stack_trace',
    'coffee_break',
  ],
  starterRelicId: 'production_server',
  icon: '🖥️',
  available: true,
},
```

---

## Task 7: Bump version in `src/store/gameStore.ts`

**Files:**
- Modify: `src/store/gameStore.ts`

Change `GAME_VERSION` from `'1.13.0'` to `'1.14.0'`:

```ts
const GAME_VERSION = '1.14.0';
```

---

## Verification

After all tasks, run:
```bash
npm run build
```

Expected: clean TypeScript compile + Vite build with no errors.

### Test Scenarios (manual)

1. **Surge builds across turns**: Play `cache_strike` turn 1 → see surge go up by 2. End turn → surge stays at 2. Play again turn 2 → surge accumulates.

2. **Burn ticks**: Apply `exception_throw` → enemy gets 2 Burn. End turn → at start of next player turn, enemy takes 2 damage, burn drops to 1.

3. **Chain hit**: Play `pub_sub_event` on one enemy in a multi-enemy fight → primary target takes 5, others take 4.

4. **Surge discharge**: Build 10 surge, play `surge_discharge` (cost 0) → all enemies take 20 damage, surge → 0.

5. **Rate limiter with high surge**: Build 8 surge, play `rate_limiter` → gain 16 block, surge → 0.

6. **Surge meter**: Start Backend Dev battle → see blue SURGE counter in BattleScreen. Watch it climb, change color to gold at 5+, red at 10+.

---

## Notes

- `burn` and `bleed` are mechanically identical DoTs — same tick pattern — but thematically distinct (fire vs bleeding). This is intentional.
- Surge is deliberately never auto-reset by `startNewTurn` — this is the cross-turn setup fantasy. Only `damagePerSurge`, `blockPerSurge`, `damageAllPerSurge` consume it.
- `chainHit` only fires when `targetInstanceId` is set — self-targeting cards never trigger it.
- `chaos_monkey` combines `damageAllPerSurge` with `applyToAll` — both effects are applied before surge resets.
- The `event_storm` rare and `surge_discharge` epic serve different use cases: event_storm is a rare you can add to deck for reliable AoE spending, surge_discharge is a 0-cost epic exhaust for a single massive turn.
