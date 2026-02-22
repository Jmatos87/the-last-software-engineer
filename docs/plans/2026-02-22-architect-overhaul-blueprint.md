# Architect Overhaul: Blueprint System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Architect as "The Obelisk" — an engineer-slot manager where slotting engineers in the specific blueprint order triggers massive burst rewards, with passive per-turn effects and overflow evokes.

**Architecture:** New `EngineerSlot` data type in `src/data/engineers.ts` holds passive + evoke effects for each of 11 engineer types. `BattleState` gains `engineerSlots[]`, `maxEngineerSlots`, `blueprint[]`, and `blueprintProgress`. Playing an engineer card slots it; matching the blueprint in order advances progress; completing it fires all evoke effects + generates a new blueprint. Overflow evokes oldest slot when slots exceed max. Passives fire every turn start. Helper `applyEvokeEffect` in `battleActions.ts` centralizes evoke execution.

**Tech Stack:** TypeScript, React 19, Zustand 5 + Immer, plain CSS

---

## Task 1: New engineer roster file

**Files:**
- Create: `src/data/engineers.ts`

**Step 1: Create the file**

```ts
import type { EngineerSlot } from '../types';

export const engineerRoster: Record<string, EngineerSlot> = {
  frontend_jr: {
    id: 'frontend_jr', name: 'Frontend Jr', icon: '💻',
    passiveEffect: { dodge: 2 },
    evokeEffect: { damageAll: 12, applyToAll: { bleed: 2 } },
  },
  frontend_sr: {
    id: 'frontend_sr', name: 'Frontend Sr', icon: '🎨',
    passiveEffect: { dodge: 3, bleedRandom: 1 },
    evokeEffect: { damageAll: 20, applyToAll: { bleed: 3 } },
  },
  backend_jr: {
    id: 'backend_jr', name: 'Backend Jr', icon: '🖥️',
    passiveEffect: { queueBlock: 6 },
    evokeEffect: { queueBlock: 8, queueDamageAll: 8, queueChain: 8 },
  },
  backend_sr: {
    id: 'backend_sr', name: 'Backend Sr', icon: '⚙️',
    passiveEffect: { queueBlock: 10, queueDamageAll: 6 },
    evokeEffect: { queueBlock: 14, queueDamageAll: 14, queueChain: 14 },
  },
  ai_jr: {
    id: 'ai_jr', name: 'AI Jr', icon: '🤖',
    passiveEffect: { generateTokens: 1 },
    evokeEffect: { damage: 10, damageScalesWithTokens: 2 },
  },
  ai_sr: {
    id: 'ai_sr', name: 'AI Sr', icon: '🧠',
    passiveEffect: { generateTokens: 2 },
    evokeEffect: { damageAllScalesWithTokens: 3 },
  },
  qa_engineer: {
    id: 'qa_engineer', name: 'QA Engineer', icon: '🔍',
    passiveEffect: { vulnerableRandom: 1 },
    evokeEffect: { applyToAll: { vulnerable: 3, weak: 2 } },
  },
  devops_engineer: {
    id: 'devops_engineer', name: 'DevOps', icon: '⚡',
    passiveEffect: { energy: 1 },
    evokeEffect: { energy: 3, draw: 3 },
  },
  security_engineer: {
    id: 'security_engineer', name: 'Security', icon: '🔒',
    passiveEffect: { counterOffer: 1 },
    evokeEffect: { damageAllEqualsCounterOffer: true, gainCounterOfferDouble: true },
  },
  data_engineer: {
    id: 'data_engineer', name: 'Data', icon: '📊',
    passiveEffect: { draw: 1 },
    evokeEffect: { draw: 3, shuffleDiscardToDraw: true },
  },
  principal_engineer: {
    id: 'principal_engineer', name: 'Principal', icon: '👑',
    passiveEffect: { resilience: 1 },
    evokeEffect: { doubleResilience: true },
  },
};

export function generateBlueprint(): string[] {
  const ids = Object.keys(engineerRoster);
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}
```

**Step 2: Verify build** — will error on missing types, that's expected. Note the errors.

---

## Task 2: Add new types

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add EngineerPassive, EngineerEvoke, EngineerSlot interfaces**

Insert AFTER the `QueuedEffect` interface block (after line ~163, before `// ── Deployments ──`):

```ts
// ── Engineer Slots (Architect mechanic) ──
export interface EngineerPassive {
  block?: number;
  draw?: number;
  energy?: number;
  dodge?: number;
  resilience?: number;
  counterOffer?: number;
  generateTokens?: number;
  queueBlock?: number;
  queueDamageAll?: number;
  vulnerableRandom?: number;   // apply N vulnerable to random enemy each turn
  bleedRandom?: number;        // apply N bleed to random enemy each turn
}

export interface EngineerEvoke {
  block?: number;
  draw?: number;
  energy?: number;
  damage?: number;                      // deal to random enemy
  damageScalesWithTokens?: number;      // deal (damage) + tokens × N to random enemy
  damageAll?: number;                   // deal to all enemies
  applyToAll?: StatusEffect;
  shuffleDiscardToDraw?: boolean;
  queueBlock?: number;                  // queue ice block for next detonation turn
  queueDamageAll?: number;              // queue fire AoE for next detonation turn
  queueChain?: number;                  // queue lightning chain for next detonation turn
  damageAllScalesWithTokens?: number;   // deal tokens × N to all enemies, tokens → 0
  damageAllEqualsCounterOffer?: boolean; // deal counterOffer stacks as damage to all
  gainCounterOfferDouble?: boolean;     // gain counterOffer = current counterOffer stacks
  doubleResilience?: boolean;           // gain resilience = current resilience stacks
}

export interface EngineerSlot {
  id: string;
  name: string;
  icon: string;
  passiveEffect: EngineerPassive;
  evokeEffect: EngineerEvoke;
}
```

**Step 2: Add new CardEffect fields**

Insert AFTER the `queueBurn` field (after line ~153, before the closing `}`):

```ts
  // Architect Engineer Slot mechanics
  slotEngineer?: string;           // engineer ID to slot (key into engineerRoster)
  addEngineerSlot?: number;        // increase maxEngineerSlots by N (max 5)
  removeEngineerSlot?: number;     // decrease maxEngineerSlots by N (evokes oldest if at max, min 1)
  evokeOldest?: boolean;           // fire oldest slot's evoke + remove from slots
  evokeAll?: boolean;              // fire ALL slots' evokes + clear slots (no new blueprint)
  damagePerSlot?: number;          // deal N × engineerSlots.length damage to target
  blockPerSlot?: number;           // gain N × engineerSlots.length block
  damageAllPerSlot?: number;       // deal N × engineerSlots.length damage to ALL enemies
  advanceBlueprint?: number;       // advance blueprint progress by N (triggers complete if ≥ 3)
  regenerateBlueprint?: boolean;   // generate new random blueprint, reset progress to 0
  shuffleEngineerSlots?: boolean;  // shuffle order of engineer slots
  addScopeCreepToDiscard?: number; // add N scope_creep curse cards to discard pile
```

**Step 3: Add to BattleState interface**

Insert AFTER the `detonationQueue` field (after line ~422, before closing `}`):

```ts
  // Architect Engineer Slot mechanics
  engineerSlots: EngineerSlot[];     // currently slotted engineers
  maxEngineerSlots: number;          // starts at 3; cards can change 1–5
  blueprint: string[];               // ordered 3-engineer-ID sequence for blueprint completion
  blueprintProgress: number;         // sequential matches achieved (0–3)
```

**Step 4: Run `npm run build`** — verify TypeScript accepts the new types (only engineers.ts import may error if types aren't resolved yet, but the types file itself should compile).

---

## Task 3: Battle actions — helpers, init, executePlayCard, startNewTurn

**Files:**
- Modify: `src/store/battleActions.ts`

### Step 1: Update imports at top of file

Change the existing type import line to:

```ts
import type { BattleState, Deployment, EnemyDef, EnemyInstance, RunState, CardInstance, QueuedEffect, EngineerEvoke, EngineerSlot } from '../types';
```

Add after the existing imports (after the `import { ... } from '../utils/battleEngine'` line):

```ts
import { generateBlueprint, engineerRoster } from '../data/engineers';
```

### Step 2: Add applyEvokeEffect helper before initBattle (insert before `export function initBattle`)

```ts
function applyEvokeEffect(
  battle: BattleState,
  run: RunState,
  evoke: EngineerEvoke
): BattleState {
  let b: BattleState = {
    ...battle,
    enemies: battle.enemies.map(e => ({ ...e, statusEffects: { ...e.statusEffects } })),
  };

  if (evoke.block) b.playerBlock = (b.playerBlock || 0) + evoke.block;
  if (evoke.energy) b.energy = (b.energy || 0) + evoke.energy;

  if (evoke.draw && evoke.draw > 0) {
    const { drawn, newDrawPile, newDiscardPile } = drawCards(b.drawPile, b.discardPile, evoke.draw);
    b = { ...b, hand: [...b.hand, ...drawn], drawPile: newDrawPile, discardPile: newDiscardPile };
  }

  // Single-target damage (+ optional token scaling)
  if (evoke.damage !== undefined || evoke.damageScalesWithTokens !== undefined) {
    const baseDmg = evoke.damage || 0;
    const tokenBonus = evoke.damageScalesWithTokens
      ? Math.floor((b.tokens || 0) * evoke.damageScalesWithTokens)
      : 0;
    const totalDmg = baseDmg + tokenBonus;
    if (totalDmg > 0 && b.enemies.length > 0) {
      const idx = Math.floor(Math.random() * b.enemies.length);
      const dmg = calculateDamage(totalDmg, b.playerStatusEffects, b.enemies[idx].statusEffects, run.items);
      b.enemies = b.enemies.map((e, i) => i === idx ? applyDamageToEnemy(e, dmg) : e);
    }
  }

  if (evoke.damageAll) {
    const damageAllAmt = evoke.damageAll;
    b.enemies = b.enemies.map(e =>
      applyDamageToEnemy(e, calculateDamage(damageAllAmt, b.playerStatusEffects, e.statusEffects, run.items))
    );
  }

  // AoE damage scales with tokens (consumes tokens)
  if (evoke.damageAllScalesWithTokens) {
    const totalDmg = Math.floor((b.tokens || 0) * evoke.damageAllScalesWithTokens);
    if (totalDmg > 0) {
      b.enemies = b.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(totalDmg, b.playerStatusEffects, e.statusEffects, run.items))
      );
    }
    b.tokens = 0;
  }

  if (evoke.applyToAll) {
    const toApply = evoke.applyToAll;
    b.enemies = b.enemies.map(e => ({
      ...e,
      statusEffects: mergeStatusEffects(e.statusEffects, toApply),
    }));
  }

  if (evoke.shuffleDiscardToDraw) {
    const combined = shuffleDeck([...b.drawPile, ...b.discardPile]);
    b = { ...b, drawPile: combined, discardPile: [] };
  }

  if (evoke.queueBlock) {
    b.detonationQueue = [...b.detonationQueue, { element: 'ice' as const, blockAmount: evoke.queueBlock }];
  }
  if (evoke.queueDamageAll) {
    b.detonationQueue = [...b.detonationQueue, { element: 'fire' as const, damageAllAmount: evoke.queueDamageAll }];
  }
  if (evoke.queueChain) {
    b.detonationQueue = [...b.detonationQueue, { element: 'lightning' as const, chainAmount: evoke.queueChain }];
  }

  if (evoke.damageAllEqualsCounterOffer) {
    const dmgAmt = b.playerStatusEffects.counterOffer || 0;
    if (dmgAmt > 0) {
      b.enemies = b.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(dmgAmt, b.playerStatusEffects, e.statusEffects, run.items))
      );
    }
  }

  if (evoke.gainCounterOfferDouble) {
    const current = b.playerStatusEffects.counterOffer || 0;
    b.playerStatusEffects = mergeStatusEffects(b.playerStatusEffects, { counterOffer: current });
  }

  if (evoke.doubleResilience) {
    const current = b.playerStatusEffects.resilience || 0;
    b.playerStatusEffects = mergeStatusEffects(b.playerStatusEffects, { resilience: current });
  }

  b.enemies = b.enemies.filter(e => e.currentHp > 0);
  return b;
}

function applyBlueprintComplete(battle: BattleState, run: RunState): BattleState {
  let b = { ...battle };
  for (const slot of b.engineerSlots) {
    b = applyEvokeEffect(b, run, slot.evokeEffect);
  }
  b.engineerSlots = [];
  b.blueprint = generateBlueprint();
  b.blueprintProgress = 0;
  return b;
}
```

### Step 3: Add to initBattle return (inside the `battle:` object)

Find the line `detonationQueue: [],` in the initBattle return (line ~143). After it, add:

```ts
      engineerSlots: [],
      maxEngineerSlots: 3,
      blueprint: generateBlueprint(),
      blueprintProgress: 0,
```

### Step 4: Add architect effects to executePlayCard

Find the detonation queue push section in executePlayCard (the block that starts with `if (effects.queueBlock)` and ends with `if (effects.queueChain)`). AFTER this block and BEFORE the `return { battle: newBattle, ... }`, insert:

```ts
  // ── Architect: Engineer Slot Effects ──
  // damagePerSlot / blockPerSlot / damageAllPerSlot (additional combat math)
  if (effects.damagePerSlot && (newBattle.engineerSlots || []).length > 0) {
    const slotDmg = effects.damagePerSlot * newBattle.engineerSlots.length;
    if (targetEnemy && slotDmg > 0) {
      const calcDmg = calculateDamage(slotDmg, newBattle.playerStatusEffects, targetEnemy.statusEffects, run.items);
      newBattle.enemies = newBattle.enemies.map(e =>
        e.instanceId === targetEnemy.instanceId ? applyDamageToEnemy(e, calcDmg) : e
      );
    }
  }
  if (effects.blockPerSlot && (newBattle.engineerSlots || []).length > 0) {
    const slotBlock = effects.blockPerSlot * newBattle.engineerSlots.length;
    newBattle.playerBlock += calculateBlock(slotBlock, newBattle.playerStatusEffects, run.items);
  }
  if (effects.damageAllPerSlot && (newBattle.engineerSlots || []).length > 0) {
    const slotAllDmg = effects.damageAllPerSlot * newBattle.engineerSlots.length;
    if (slotAllDmg > 0) {
      newBattle.enemies = newBattle.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(slotAllDmg, newBattle.playerStatusEffects, e.statusEffects, run.items))
      );
    }
  }

  // addScopeCreepToDiscard
  if (effects.addScopeCreepToDiscard) {
    const curseDef = getCardDef('scope_creep');
    if (curseDef) {
      for (let i = 0; i < effects.addScopeCreepToDiscard; i++) {
        newBattle.discardPile = [...newBattle.discardPile, createCardInstance(curseDef)];
      }
    }
  }

  // shuffleEngineerSlots
  if (effects.shuffleEngineerSlots && (newBattle.engineerSlots || []).length > 1) {
    newBattle.engineerSlots = shuffleDeck([...newBattle.engineerSlots] as any) as any as EngineerSlot[];
  }

  // regenerateBlueprint
  if (effects.regenerateBlueprint) {
    newBattle.blueprint = generateBlueprint();
    newBattle.blueprintProgress = 0;
  }

  // evokeOldest
  if (effects.evokeOldest && (newBattle.engineerSlots || []).length > 0) {
    const oldest = newBattle.engineerSlots[0];
    newBattle.engineerSlots = newBattle.engineerSlots.slice(1);
    newBattle = { ...applyEvokeEffect(newBattle, run, oldest.evokeEffect), engineerSlots: newBattle.engineerSlots.slice(1) };
    // Re-apply after applyEvokeEffect (it spreads battle but we already sliced)
    // Correct approach:
    const afterEvoke = applyEvokeEffect({ ...newBattle, engineerSlots: newBattle.engineerSlots }, run, oldest.evokeEffect);
    newBattle = afterEvoke;
  }

  // evokeAll
  if (effects.evokeAll && (newBattle.engineerSlots || []).length > 0) {
    const slotsToEvoke = [...newBattle.engineerSlots];
    newBattle.engineerSlots = [];
    for (const slot of slotsToEvoke) {
      newBattle = applyEvokeEffect(newBattle, run, slot.evokeEffect);
    }
    newBattle.blueprintProgress = 0;
  }

  // addEngineerSlot
  if (effects.addEngineerSlot) {
    newBattle.maxEngineerSlots = Math.min(5, (newBattle.maxEngineerSlots || 3) + effects.addEngineerSlot);
  }

  // removeEngineerSlot
  if (effects.removeEngineerSlot) {
    newBattle.maxEngineerSlots = Math.max(1, (newBattle.maxEngineerSlots || 3) - effects.removeEngineerSlot);
    // If occupied slots now exceed max, evoke oldest
    while ((newBattle.engineerSlots || []).length > newBattle.maxEngineerSlots) {
      const oldest = newBattle.engineerSlots[0];
      newBattle.engineerSlots = newBattle.engineerSlots.slice(1);
      newBattle = applyEvokeEffect(newBattle, run, oldest.evokeEffect);
    }
  }

  // advanceBlueprint
  if (effects.advanceBlueprint) {
    newBattle.blueprintProgress = Math.min(
      (newBattle.blueprintProgress || 0) + effects.advanceBlueprint,
      (newBattle.blueprint || []).length
    );
    if (newBattle.blueprintProgress >= (newBattle.blueprint || []).length && newBattle.blueprint.length > 0) {
      newBattle = applyBlueprintComplete(newBattle, run);
    }
  }

  // slotEngineer (must be last — handles overflow and blueprint logic)
  if (effects.slotEngineer) {
    const engineerDef = engineerRoster[effects.slotEngineer];
    if (engineerDef) {
      // Add to slots
      newBattle.engineerSlots = [...(newBattle.engineerSlots || []), engineerDef];

      // Check blueprint progress (sequential match)
      const expectedId = (newBattle.blueprint || [])[newBattle.blueprintProgress || 0];
      if (effects.slotEngineer === expectedId) {
        newBattle.blueprintProgress = (newBattle.blueprintProgress || 0) + 1;
      }

      // Check blueprint complete
      if ((newBattle.blueprintProgress || 0) >= (newBattle.blueprint || []).length && newBattle.blueprint.length > 0) {
        newBattle = applyBlueprintComplete(newBattle, run);
      }
      // Check overflow (only if blueprint not just completed)
      else if (newBattle.engineerSlots.length > (newBattle.maxEngineerSlots || 3)) {
        const evicted = newBattle.engineerSlots[0];
        newBattle.engineerSlots = newBattle.engineerSlots.slice(1);
        newBattle = applyEvokeEffect(newBattle, run, evicted.evokeEffect);
      }
    }
  }
```

**Note on evokeOldest bug:** The evokeOldest section above has a double-apply bug. Replace the entire `// evokeOldest` block with:

```ts
  // evokeOldest
  if (effects.evokeOldest && (newBattle.engineerSlots || []).length > 0) {
    const oldest = newBattle.engineerSlots[0];
    const slotsAfterEvict = newBattle.engineerSlots.slice(1);
    newBattle = applyEvokeEffect({ ...newBattle, engineerSlots: slotsAfterEvict }, run, oldest.evokeEffect);
  }
```

### Step 5: Update startNewTurn to fire engineer passives

Find the section in `startNewTurn` that processes Burn damage (ends around line ~1448). AFTER the `postDeployEnemies = postDeployEnemies.filter(e => e.currentHp > 0);` line that follows the Burn section, and BEFORE the detonation queue section (`const queueToProcess...`), insert:

```ts
  // ── Engineer Slot Passives (Architect mechanic) ──
  let engineerPassiveBlock = 0;
  let engineerPassiveEnergy = 0;
  let engineerTokenGain = 0;
  let engineerQueuedEffects: QueuedEffect[] = [];
  const engineerPassiveStatus: import('../types').StatusEffect = {};

  for (const slot of (battle.engineerSlots || [])) {
    const p = slot.passiveEffect;
    if (p.block) engineerPassiveBlock += p.block;
    if (p.energy) engineerPassiveEnergy += p.energy;
    if (p.dodge) engineerPassiveStatus.dodge = (engineerPassiveStatus.dodge || 0) + p.dodge;
    if (p.resilience) engineerPassiveStatus.resilience = (engineerPassiveStatus.resilience || 0) + p.resilience;
    if (p.counterOffer) engineerPassiveStatus.counterOffer = (engineerPassiveStatus.counterOffer || 0) + p.counterOffer;
    if (p.generateTokens) engineerTokenGain += p.generateTokens;
    if (p.queueBlock) engineerQueuedEffects.push({ element: 'ice' as const, blockAmount: p.queueBlock });
    if (p.queueDamageAll) engineerQueuedEffects.push({ element: 'fire' as const, damageAllAmount: p.queueDamageAll });
    if (p.vulnerableRandom && postDeployEnemies.length > 0) {
      const vuln = p.vulnerableRandom;
      const idx = Math.floor(Math.random() * postDeployEnemies.length);
      postDeployEnemies = postDeployEnemies.map((e, i) =>
        i === idx ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { vulnerable: vuln }) } : e
      );
    }
    if (p.bleedRandom && postDeployEnemies.length > 0) {
      const bleedAmt = p.bleedRandom;
      const idx = Math.floor(Math.random() * postDeployEnemies.length);
      postDeployEnemies = postDeployEnemies.map((e, i) =>
        i === idx ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { bleed: bleedAmt }) } : e
      );
    }
  }

  // Merge engineer passive status effects into player status
  const mergedWithEngineer = Object.keys(engineerPassiveStatus).length > 0
    ? mergeStatusEffects(mergedStatus, engineerPassiveStatus)
    : mergedStatus;
```

Also, find where `drawCount` is calculated (around line 1315):
```ts
  const drawCount = Math.max(1, 5 + extraDraw + networkingDraw - drawPenalty);
```
Add engineer draw to it:
```ts
  const engineerExtraDraw = (battle.engineerSlots || []).reduce((sum, slot) => sum + (slot.passiveEffect.draw || 0), 0);
  const drawCount = Math.max(1, 5 + extraDraw + networkingDraw - drawPenalty + engineerExtraDraw);
```

### Step 6: Update startNewTurn return statement

Find the return statement at line ~1507. Update the following fields:

- `playerStatusEffects: mergedStatus` → `playerStatusEffects: mergedWithEngineer`
- `playerBlock: newBlock + blockBonus + deploymentBlock + detonationBlock` → add `+ engineerPassiveBlock`
- `energy: Math.max(0, battle.maxEnergy + hustleEnergy - (battle.nextTurnEnergyPenalty || 0))` → add `+ engineerPassiveEnergy` at end
- `tokens: battle.tokens ?? 0` → `tokens: (battle.tokens ?? 0) + engineerTokenGain`
- `detonationQueue: []` → `detonationQueue: engineerQueuedEffects`

The `...battle` spread at the top of the return already carries over `engineerSlots`, `maxEngineerSlots`, `blueprint`, `blueprintProgress` from the previous turn, so those don't need explicit additions.

**Step 7: Run `npm run build`** — resolve any TypeScript errors (likely type mismatches in the helpers). Fix until clean.

---

## Task 4: BattleScreen — Engineer slots and blueprint display

**Files:**
- Modify: `src/components/battle/BattleScreen.tsx`

**Step 1: Add engineer slots + blueprint display for Architect**

Find where the detonation queue display is rendered for `backend_dev` (look for `{run?.character.id === 'backend_dev'`). After that block, add:

```tsx
{/* Architect — Engineer Slots + Blueprint */}
{run?.character.id === 'architect' && battle && (
  <div className="architect-slots-display">
    <div className="engineer-slots">
      {(battle.engineerSlots || []).length === 0 && (
        <span className="no-slots-hint">No engineers slotted</span>
      )}
      {(battle.engineerSlots || []).map((slot, i) => (
        <div key={i} className="engineer-slot-badge">
          <span className="slot-icon">{slot.icon}</span>
          <span className="slot-name">{slot.name}</span>
          <span className="slot-passive">{formatEngineerPassive(slot.passiveEffect)}</span>
        </div>
      ))}
      <span className="slot-count-badge">
        {(battle.engineerSlots || []).length}/{battle.maxEngineerSlots || 3}
      </span>
    </div>
    <div className="blueprint-display">
      <span className="blueprint-label">BLUEPRINT:</span>
      {(battle.blueprint || []).map((engineerId, i) => (
        <span
          key={i}
          className={`blueprint-step ${i < (battle.blueprintProgress || 0) ? 'matched' : 'pending'}`}
        >
          {engineerRosterForDisplay[engineerId]?.icon ?? '?'} {engineerRosterForDisplay[engineerId]?.name ?? engineerId}
          {i < (battle.blueprint || []).length - 1 && ' →'}
        </span>
      ))}
      <span className="blueprint-progress">({battle.blueprintProgress || 0}/{(battle.blueprint || []).length})</span>
    </div>
  </div>
)}
```

**Step 2: Add import and helper function**

At the top of the file, add the engineerRoster import:

```ts
import { engineerRoster as engineerRosterForDisplay } from '../../data/engineers';
```

Add the `formatEngineerPassive` helper function inside the component (or as a module-level function):

```ts
function formatEngineerPassive(p: import('../../types').EngineerPassive): string {
  const parts: string[] = [];
  if (p.energy) parts.push(`+${p.energy} ⚡`);
  if (p.draw) parts.push(`+${p.draw} draw`);
  if (p.block) parts.push(`+${p.block} block`);
  if (p.dodge) parts.push(`+${p.dodge} dodge`);
  if (p.resilience) parts.push(`+${p.resilience} res`);
  if (p.counterOffer) parts.push(`+${p.counterOffer} ctr`);
  if (p.generateTokens) parts.push(`+${p.generateTokens} tok`);
  if (p.queueBlock) parts.push(`⏳${p.queueBlock} blk`);
  if (p.queueDamageAll) parts.push(`⏳${p.queueDamageAll} AoE`);
  if (p.vulnerableRandom) parts.push(`vuln rnd`);
  if (p.bleedRandom) parts.push(`bleed rnd`);
  return parts.join(' ');
}
```

**Step 3: Add CSS to src/index.css**

Find the detonation queue display CSS and add after it:

```css
/* Architect Engineer Slots */
.architect-slots-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  margin: 4px 0;
}

.engineer-slots {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.engineer-slot-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 12px;
  font-size: 0.75rem;
}

.slot-icon { font-size: 0.9rem; }
.slot-name { font-weight: 600; color: #c4b5fd; }
.slot-passive { color: #a78bfa; font-size: 0.7rem; }

.slot-count-badge {
  margin-left: auto;
  font-size: 0.75rem;
  color: #7c3aed;
  font-weight: bold;
}

.no-slots-hint {
  color: #6b7280;
  font-style: italic;
  font-size: 0.75rem;
}

.blueprint-display {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 0.75rem;
}

.blueprint-label {
  color: #8b5cf6;
  font-weight: bold;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

.blueprint-step {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.72rem;
}

.blueprint-step.matched {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.blueprint-step.pending {
  background: rgba(75, 85, 99, 0.3);
  color: #9ca3af;
  border: 1px solid rgba(75, 85, 99, 0.4);
}

.blueprint-progress {
  color: #6b7280;
  font-size: 0.7rem;
}
```

**Step 4: Run `npm run build`** — fix any TypeScript errors.

---

## Task 5: Architect card pool (full replacement)

**Files:**
- Modify: `src/data/cards/architectCards.ts`

Replace the entire file with the following 50 cards. Starters keep `rarity: 'starter'`. Engineer card IDs match the `engineerRoster` keys.

```ts
import type { CardDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// ARCHITECT — "The Obelisk"
// Slot engineers into 3 positions. Passives fire every turn.
// Match blueprint order for burst completion rewards.
// ═══════════════════════════════════════════════════════════════

export const architectCards: Record<string, CardDef> = {

  // ── Starters ──
  singleton_pattern: {
    id: 'singleton_pattern', name: 'Singleton Strike', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'architect',
    description: 'Deal 7 damage. There can be only one (instance).',
    effects: { damage: 7 },
    upgradedEffects: { damage: 11 },
    upgradedDescription: 'Deal 11 damage.',
    icon: '1️⃣',
  },
  design_doc: {
    id: 'design_doc', name: 'Design Doc', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'architect',
    description: 'Draw 2 cards. 47 pages. Nobody read it.',
    effects: { draw: 2 },
    upgradedEffects: { draw: 3 },
    upgradedDescription: 'Draw 3 cards.',
    icon: '📄',
  },
  code_review: {
    id: 'code_review', name: 'Code Review', type: 'skill', target: 'all_enemies', cost: 1, rarity: 'starter',
    class: 'architect',
    description: 'Apply 2 Vulnerable to all enemies. "It\'s all wrong."',
    effects: { applyToAll: { vulnerable: 2 } },
    upgradedEffects: { applyToAll: { vulnerable: 3 } },
    upgradedDescription: 'Apply 3 Vulnerable to all enemies.',
    icon: '🔎',
  },

  // ── Common: Engineer Cards ──
  devops_engineer: {
    id: 'devops_engineer', name: 'Slot: DevOps', type: 'skill', target: 'self', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Slot a DevOps engineer. Passive: +1 energy/turn. Evoke: +3 energy + draw 3.',
    effects: { slotEngineer: 'devops_engineer' },
    upgradedEffects: { slotEngineer: 'devops_engineer' },
    upgradedDescription: 'Slot a DevOps engineer. Passive: +1 energy/turn. Evoke: +3 energy + draw 3.',
    upgradedCost: 1,
    icon: '⚡',
  },
  qa_engineer: {
    id: 'qa_engineer', name: 'Slot: QA', type: 'skill', target: 'self', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Slot a QA engineer. Passive: 1 Vulnerable to random/turn. Evoke: 3 Vulnerable + 2 Weak to ALL.',
    effects: { slotEngineer: 'qa_engineer' },
    upgradedEffects: { slotEngineer: 'qa_engineer' },
    upgradedDescription: 'Slot a QA engineer. Passive: 1 Vulnerable to random/turn. Evoke: 3 Vulnerable + 2 Weak to ALL.',
    upgradedCost: 1,
    icon: '🔍',
  },
  frontend_jr: {
    id: 'frontend_jr', name: 'Slot: Frontend Jr', type: 'skill', target: 'self', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Slot a Frontend Jr. Passive: +2 dodge/turn. Evoke: Deal 12 damage to all + 2 Bleed all.',
    effects: { slotEngineer: 'frontend_jr' },
    upgradedEffects: { slotEngineer: 'frontend_jr' },
    upgradedDescription: 'Slot a Frontend Jr. Passive: +2 dodge/turn. Evoke: Deal 12 damage to all + 2 Bleed all.',
    upgradedCost: 1,
    icon: '💻',
  },
  backend_jr: {
    id: 'backend_jr', name: 'Slot: Backend Jr', type: 'skill', target: 'self', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Slot a Backend Jr. Passive: Schedule 6 block/turn. Evoke: Queue ice+fire+lightning at 8 each.',
    effects: { slotEngineer: 'backend_jr' },
    upgradedEffects: { slotEngineer: 'backend_jr' },
    upgradedDescription: 'Slot a Backend Jr. Passive: Schedule 6 block/turn. Evoke: Queue ice+fire+lightning at 8 each.',
    upgradedCost: 1,
    icon: '🖥️',
  },
  ai_jr: {
    id: 'ai_jr', name: 'Slot: AI Jr', type: 'skill', target: 'self', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Slot an AI Jr. Passive: +1 token/turn. Evoke: Deal 10 + tokens×2 damage to random enemy.',
    effects: { slotEngineer: 'ai_jr' },
    upgradedEffects: { slotEngineer: 'ai_jr' },
    upgradedDescription: 'Slot an AI Jr. Passive: +1 token/turn. Evoke: Deal 10 + tokens×2 damage to random enemy.',
    upgradedCost: 1,
    icon: '🤖',
  },

  // ── Common: Pattern Cards ──
  whiteboard_strike: {
    id: 'whiteboard_strike', name: 'Whiteboard Strike', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Deal 6 damage. Apply 1 Vulnerable. Still there from the last sprint.',
    effects: { damage: 6, applyToTarget: { vulnerable: 1 } },
    upgradedEffects: { damage: 9, applyToTarget: { vulnerable: 2 } },
    upgradedDescription: 'Deal 9 damage. Apply 2 Vulnerable.',
    icon: '📝',
  },
  tech_spec: {
    id: 'tech_spec', name: 'Tech Spec', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Gain 7 block. Draw 1 card. Nobody reviewed it.',
    effects: { block: 7, draw: 1 },
    upgradedEffects: { block: 10, draw: 1 },
    upgradedDescription: 'Gain 10 block. Draw 1 card.',
    icon: '📋',
  },
  sprint_planning: {
    id: 'sprint_planning', name: 'Sprint Planning', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Regenerate a new blueprint. Draw 1 card. "Let\'s reset the roadmap."',
    effects: { regenerateBlueprint: true, draw: 1 },
    upgradedEffects: { regenerateBlueprint: true, draw: 2 },
    upgradedDescription: 'Regenerate a new blueprint. Draw 2 cards.',
    icon: '📅',
  },
  dependency_injection: {
    id: 'dependency_injection', name: 'Dependency Injection', type: 'skill', target: 'self', cost: 0, rarity: 'common',
    class: 'architect',
    description: 'Shuffle your engineer slots. Gain 1 energy. "Invert the control."',
    effects: { shuffleEngineerSlots: true, energy: 1 },
    upgradedEffects: { shuffleEngineerSlots: true, energy: 2 },
    upgradedDescription: 'Shuffle your engineer slots. Gain 2 energy.',
    icon: '🔀',
  },
  stakeholder_alignment: {
    id: 'stakeholder_alignment', name: 'Stakeholder Alignment', type: 'skill', target: 'all_enemies', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Gain 12 block. Apply 1 Weak to all. "They all agree, they just don\'t know what to."',
    effects: { block: 12, applyToAll: { weak: 1 } },
    upgradedEffects: { block: 16, applyToAll: { weak: 1 } },
    upgradedDescription: 'Gain 16 block. Apply 1 Weak to all.',
    icon: '🤝',
  },
  pivot: {
    id: 'pivot', name: 'Pivot', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Advance blueprint by 1. Draw 1 card. Cut corners. Ship faster.',
    effects: { advanceBlueprint: 1, draw: 1 },
    upgradedEffects: { advanceBlueprint: 2, draw: 1 },
    upgradedDescription: 'Advance blueprint by 2. Draw 1 card.',
    icon: '↩️',
  },
  chain_of_responsibility: {
    id: 'chain_of_responsibility', name: 'Chain of Responsibility', type: 'attack', target: 'enemy', cost: 2, rarity: 'common',
    class: 'architect',
    description: 'Deal 5 damage per slotted engineer. Pass it on until someone handles it.',
    effects: { damagePerSlot: 5 },
    upgradedEffects: { damagePerSlot: 7 },
    upgradedDescription: 'Deal 7 damage per slotted engineer.',
    icon: '⛓️',
  },
  code_freeze: {
    id: 'code_freeze', name: 'Code Freeze', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Gain 4 block per slotted engineer. "No more changes before launch."',
    effects: { blockPerSlot: 4 },
    upgradedEffects: { blockPerSlot: 6 },
    upgradedDescription: 'Gain 6 block per slotted engineer.',
    icon: '🧊',
  },
  architecture_review: {
    id: 'architecture_review', name: 'Architecture Review', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Gain 5 block. Draw 1 card. Scheduled for Thursday.',
    effects: { block: 5, draw: 1 },
    upgradedEffects: { block: 7, draw: 2 },
    upgradedDescription: 'Gain 7 block. Draw 2 cards.',
    icon: '🏛️',
  },
  technical_interview: {
    id: 'technical_interview', name: 'Technical Interview', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Deal 8 damage. Apply 1 Vulnerable. Reverse a binary tree on a whiteboard.',
    effects: { damage: 8, applyToTarget: { vulnerable: 1 } },
    upgradedEffects: { damage: 12, applyToTarget: { vulnerable: 2 } },
    upgradedDescription: 'Deal 12 damage. Apply 2 Vulnerable.',
    icon: '💡',
  },

  // ── Rare: Engineer Cards ──
  frontend_sr: {
    id: 'frontend_sr', name: 'Slot: Frontend Sr', type: 'skill', target: 'self', cost: 3, rarity: 'rare',
    class: 'architect',
    description: 'Slot a Frontend Sr. Passive: +3 dodge + 1 Bleed random/turn. Evoke: 20 AoE + 3 Bleed all.',
    effects: { slotEngineer: 'frontend_sr' },
    upgradedEffects: { slotEngineer: 'frontend_sr' },
    upgradedDescription: 'Slot a Frontend Sr. Passive: +3 dodge + 1 Bleed random/turn. Evoke: 20 AoE + 3 Bleed all.',
    upgradedCost: 2,
    icon: '🎨',
  },
  backend_sr: {
    id: 'backend_sr', name: 'Slot: Backend Sr', type: 'skill', target: 'self', cost: 3, rarity: 'rare',
    class: 'architect',
    description: 'Slot a Backend Sr. Passive: Schedule 10 block + 6 AoE/turn. Evoke: Queue ice+fire+lightning at 14 each.',
    effects: { slotEngineer: 'backend_sr' },
    upgradedEffects: { slotEngineer: 'backend_sr' },
    upgradedDescription: 'Slot a Backend Sr. Passive: Schedule 10 block + 6 AoE/turn. Evoke: Queue ice+fire+lightning at 14 each.',
    upgradedCost: 2,
    icon: '⚙️',
  },
  ai_sr: {
    id: 'ai_sr', name: 'Slot: AI Sr', type: 'skill', target: 'self', cost: 3, rarity: 'rare',
    class: 'architect',
    description: 'Slot an AI Sr. Passive: +2 tokens/turn. Evoke: Deal tokens×3 to all enemies, tokens → 0.',
    effects: { slotEngineer: 'ai_sr' },
    upgradedEffects: { slotEngineer: 'ai_sr' },
    upgradedDescription: 'Slot an AI Sr. Passive: +2 tokens/turn. Evoke: Deal tokens×3 to all enemies, tokens → 0.',
    upgradedCost: 2,
    icon: '🧠',
  },
  principal_engineer: {
    id: 'principal_engineer', name: 'Slot: Principal', type: 'skill', target: 'self', cost: 3, rarity: 'rare',
    class: 'architect',
    description: 'Slot a Principal Engineer. Passive: +1 resilience/turn. Evoke: Double your current resilience.',
    effects: { slotEngineer: 'principal_engineer' },
    upgradedEffects: { slotEngineer: 'principal_engineer' },
    upgradedDescription: 'Slot a Principal Engineer. Passive: +1 resilience/turn. Evoke: Double your current resilience.',
    upgradedCost: 2,
    icon: '👑',
  },

  // ── Rare: Pattern Cards ──
  add_headcount: {
    id: 'add_headcount', name: 'Add Headcount', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'architect',
    description: 'Gain 1 engineer slot (max 5). Draw 2 cards. "We just need more people."',
    effects: { addEngineerSlot: 1, draw: 2 },
    upgradedEffects: { addEngineerSlot: 1, draw: 2 },
    upgradedDescription: 'Gain 1 engineer slot (max 5). Draw 2 cards.',
    upgradedCost: 1,
    icon: '👥',
  },
  restructure: {
    id: 'restructure', name: 'Restructure', type: 'skill', target: 'self', cost: 0, rarity: 'rare',
    class: 'architect',
    description: 'Lose 1 slot (min 1), evokes oldest. Gain 2 energy. "Nobody is safe."',
    effects: { removeEngineerSlot: 1, energy: 2 },
    upgradedEffects: { removeEngineerSlot: 1, energy: 3 },
    upgradedDescription: 'Lose 1 slot, evokes oldest. Gain 3 energy.',
    icon: '🔁',
  },
  fast_track: {
    id: 'fast_track', name: 'Fast Track', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'architect',
    description: 'Evoke your oldest slotted engineer. Draw 1 card. "Skip the queue."',
    effects: { evokeOldest: true, draw: 1 },
    upgradedEffects: { evokeOldest: true, draw: 2 },
    upgradedDescription: 'Evoke your oldest slotted engineer. Draw 2 cards.',
    icon: '⏩',
  },
  microservices_decomposition: {
    id: 'microservices_decomposition', name: 'Microservices', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
    class: 'architect',
    description: 'Deal 6 damage per slotted engineer to ALL enemies. Split everything apart.',
    effects: { damageAllPerSlot: 6 },
    upgradedEffects: { damageAllPerSlot: 8 },
    upgradedDescription: 'Deal 8 damage per slotted engineer to ALL enemies.',
    icon: '🧩',
  },
  sprint_velocity: {
    id: 'sprint_velocity', name: 'Sprint Velocity', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'architect',
    description: 'Draw 3 cards. Gain 1 energy. "Our velocity is off the charts."',
    effects: { draw: 3, energy: 1 },
    upgradedEffects: { draw: 4, energy: 2 },
    upgradedDescription: 'Draw 4 cards. Gain 2 energy.',
    icon: '📈',
  },
  tech_debt_payment: {
    id: 'tech_debt_payment', name: 'Tech Debt Payment', type: 'skill', target: 'self', cost: 0, rarity: 'rare',
    class: 'architect',
    description: 'Exhaust 1 random card from hand. Gain 1 energy. Exhaust. "Pay it down eventually."',
    effects: { exhaustRandom: 1, energy: 1 },
    upgradedEffects: { exhaustRandom: 1, energy: 2 },
    upgradedDescription: 'Exhaust 1 random card from hand. Gain 2 energy. Exhaust.',
    exhaust: true,
    icon: '💸',
  },
  over_engineering: {
    id: 'over_engineering', name: 'Over-Engineering', type: 'attack', target: 'enemy', cost: 3, rarity: 'rare',
    class: 'architect',
    description: 'Deal 40 damage. Add a Scope Creep to your discard. "Just one more abstraction layer."',
    effects: { damage: 40, addScopeCreepToDiscard: 1 },
    upgradedEffects: { damage: 55, addScopeCreepToDiscard: 1 },
    upgradedDescription: 'Deal 55 damage. Add a Scope Creep to discard.',
    icon: '🌀',
  },
  cross_functional_team: {
    id: 'cross_functional_team', name: 'Cross-Functional', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
    class: 'architect',
    description: 'Deal 5 damage per slotted engineer to ALL enemies. Gain 8 block.',
    effects: { damageAllPerSlot: 5, block: 8 },
    upgradedEffects: { damageAllPerSlot: 7, block: 12 },
    upgradedDescription: 'Deal 7 damage per slotted engineer to ALL. Gain 12 block.',
    icon: '🌐',
  },
  agile_retro: {
    id: 'agile_retro', name: 'Agile Retro', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'architect',
    description: 'Gain 8 block. Draw 2 cards. "What went well? What didn\'t?"',
    effects: { block: 8, draw: 2 },
    upgradedEffects: { block: 12, draw: 2 },
    upgradedDescription: 'Gain 12 block. Draw 2 cards.',
    icon: '🔄',
  },
  pair_programming: {
    id: 'pair_programming', name: 'Pair Programming', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
    class: 'architect',
    description: 'Deal 12 damage to all enemies. Draw 2 cards. Two people arguing about variable names.',
    effects: { damageAll: 12, draw: 2 },
    upgradedEffects: { damageAll: 18, draw: 2 },
    upgradedDescription: 'Deal 18 damage to all enemies. Draw 2 cards.',
    icon: '👫',
  },
  architecture_astronaut: {
    id: 'architecture_astronaut', name: 'Architecture Astronaut', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    class: 'architect',
    description: 'Deal 15 damage. Apply 2 Vulnerable. Draw 1. Design detached from reality.',
    effects: { damage: 15, applyToTarget: { vulnerable: 2 }, draw: 1 },
    upgradedEffects: { damage: 22, applyToTarget: { vulnerable: 2 }, draw: 1 },
    upgradedDescription: 'Deal 22 damage. Apply 2 Vulnerable. Draw 1.',
    icon: '🚀',
  },

  // ── Epic: Engineer Cards ──
  security_engineer: {
    id: 'security_engineer', name: 'Slot: Security', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
    class: 'architect',
    description: 'Slot a Security Engineer. Passive: +1 counter-offer/turn. Evoke: Deal counter-offer as damage to all + double counter-offer.',
    effects: { slotEngineer: 'security_engineer' },
    upgradedEffects: { slotEngineer: 'security_engineer' },
    upgradedDescription: 'Slot a Security Engineer. Passive: +1 counter-offer/turn. Evoke: Deal counter-offer as damage to all + double counter-offer.',
    upgradedCost: 2,
    icon: '🔒',
  },
  data_engineer: {
    id: 'data_engineer', name: 'Slot: Data', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
    class: 'architect',
    description: 'Slot a Data Engineer. Passive: Draw 1 card/turn. Evoke: Draw 3 + shuffle discard into draw.',
    effects: { slotEngineer: 'data_engineer' },
    upgradedEffects: { slotEngineer: 'data_engineer' },
    upgradedDescription: 'Slot a Data Engineer. Passive: Draw 1 card/turn. Evoke: Draw 3 + shuffle discard into draw.',
    upgradedCost: 2,
    icon: '📊',
  },

  // ── Epic: Pattern Cards ──
  full_reorg: {
    id: 'full_reorg', name: 'Full Reorg', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
    class: 'architect',
    description: 'Evoke ALL slotted engineers simultaneously. Clear slots. Exhaust. Nobody survives The Reorg.',
    effects: { evokeAll: true },
    upgradedEffects: { evokeAll: true },
    upgradedDescription: 'Evoke ALL slotted engineers. Clear slots. Exhaust.',
    upgradedCost: 2,
    exhaust: true,
    icon: '🔥',
  },
  mythical_man_month: {
    id: 'mythical_man_month', name: 'Mythical Man-Month', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
    class: 'architect',
    description: 'Gain 2 engineer slots. Draw 3 cards. Exhaust. Adding people makes it later.',
    effects: { addEngineerSlot: 2, draw: 3 },
    upgradedEffects: { addEngineerSlot: 2, draw: 3 },
    upgradedDescription: 'Gain 2 engineer slots. Draw 3 cards. Exhaust.',
    upgradedCost: 1,
    exhaust: true,
    icon: '📚',
  },
  conways_law: {
    id: 'conways_law', name: "Conway's Law", type: 'skill', target: 'self', cost: 2, rarity: 'epic',
    class: 'architect',
    description: 'Gain 7 block per slotted engineer. Apply 1 Weak to all. Your org mirrors your architecture.',
    effects: { blockPerSlot: 7, applyToAll: { weak: 1 } },
    upgradedEffects: { blockPerSlot: 10, applyToAll: { weak: 1 } },
    upgradedDescription: 'Gain 10 block per slotted engineer. Apply 1 Weak to all.',
    icon: '🏗️',
  },
  domain_driven_design: {
    id: 'domain_driven_design', name: 'Domain-Driven Design', type: 'attack', target: 'enemy', cost: 3, rarity: 'epic',
    class: 'architect',
    description: 'Deal 12 damage per slotted engineer to target. Model the real world.',
    effects: { damagePerSlot: 12 },
    upgradedEffects: { damagePerSlot: 16 },
    upgradedDescription: 'Deal 16 damage per slotted engineer to target.',
    icon: '🗂️',
  },
  blueprint_bypass: {
    id: 'blueprint_bypass', name: 'Blueprint Bypass', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
    class: 'architect',
    description: 'Advance blueprint by 3. If complete, fire all evokes. Exhaust. Ship it.',
    effects: { advanceBlueprint: 3 },
    upgradedEffects: { advanceBlueprint: 5 },
    upgradedDescription: 'Advance blueprint by 5. If complete, fire all evokes. Exhaust.',
    exhaust: true,
    icon: '⚡',
  },
  zero_downtime_deploy: {
    id: 'zero_downtime_deploy', name: 'Zero-Downtime Deploy', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
    class: 'architect',
    description: 'Evoke ALL slotted engineers. Gain 1 slot. Exhaust. It never goes down.',
    effects: { evokeAll: true, addEngineerSlot: 1 },
    upgradedEffects: { evokeAll: true, addEngineerSlot: 1 },
    upgradedDescription: 'Evoke ALL slotted engineers. Gain 1 slot. Exhaust.',
    upgradedCost: 2,
    exhaust: true,
    icon: '🚀',
  },
  scale_horizontally: {
    id: 'scale_horizontally', name: 'Scale Horizontally', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'epic',
    class: 'architect',
    description: 'Gain 1 engineer slot. Deal 10 damage to all enemies. More machines, more power.',
    effects: { addEngineerSlot: 1, damageAll: 10 },
    upgradedEffects: { addEngineerSlot: 1, damageAll: 15 },
    upgradedDescription: 'Gain 1 engineer slot. Deal 15 damage to all enemies.',
    icon: '📡',
  },
  the_great_rewrite: {
    id: 'the_great_rewrite', name: 'The Great Rewrite', type: 'skill', target: 'self', cost: 3, rarity: 'epic',
    class: 'architect',
    description: 'Exhaust all cards in hand. Evoke ALL engineers. Draw 7 cards. Exhaust. Starting over.',
    effects: { exhaustAllHand: true, evokeAll: true, draw: 7 },
    upgradedEffects: { exhaustAllHand: true, evokeAll: true, draw: 9 },
    upgradedDescription: 'Exhaust all cards in hand. Evoke ALL engineers. Draw 9 cards. Exhaust.',
    exhaust: true,
    icon: '♻️',
  },

  // ── Legendary ──
  systems_thinking: {
    id: 'systems_thinking', name: 'Systems Thinking', type: 'skill', target: 'self', cost: 0, rarity: 'legendary',
    class: 'architect',
    description: 'Evoke ALL engineers. Draw 5 cards. Gain 2 energy. Exhaust. See the whole board.',
    effects: { evokeAll: true, draw: 5, energy: 2 },
    upgradedEffects: { evokeAll: true, draw: 7, energy: 2 },
    upgradedDescription: 'Evoke ALL engineers. Draw 7 cards. Gain 2 energy. Exhaust.',
    exhaust: true,
    icon: '🌐',
  },
  the_grand_design: {
    id: 'the_grand_design', name: 'The Grand Design', type: 'skill', target: 'self', cost: 2, rarity: 'legendary',
    class: 'architect',
    description: 'Gain 3 engineer slots. Evoke ALL engineers. Draw 3. Exhaust. One vision. Total control.',
    effects: { addEngineerSlot: 3, evokeAll: true, draw: 3 },
    upgradedEffects: { addEngineerSlot: 3, evokeAll: true, draw: 3 },
    upgradedDescription: 'Gain 3 engineer slots. Evoke ALL engineers. Draw 3. Exhaust.',
    upgradedCost: 1,
    exhaust: true,
    icon: '👁️',
  },
  impossible_deadline: {
    id: 'impossible_deadline', name: 'Impossible Deadline', type: 'attack', target: 'all_enemies', cost: 3, rarity: 'legendary',
    class: 'architect',
    description: 'Deal 50 damage to all enemies. Add 2 Scope Creeps to discard. Ship by Friday.',
    effects: { damageAll: 50, addScopeCreepToDiscard: 2 },
    upgradedEffects: { damageAll: 70, addScopeCreepToDiscard: 2 },
    upgradedDescription: 'Deal 70 damage to all enemies. Add 2 Scope Creeps to discard.',
    icon: '⏰',
  },
  technical_excellence: {
    id: 'technical_excellence', name: 'Technical Excellence', type: 'skill', target: 'self', cost: 3, rarity: 'legendary',
    class: 'architect',
    description: 'Exhaust all hand cards. Evoke ALL engineers. Draw 7 cards. Exhaust. Zero compromise.',
    effects: { exhaustAllHand: true, evokeAll: true, draw: 7 },
    upgradedEffects: { exhaustAllHand: true, evokeAll: true, draw: 9 },
    upgradedDescription: 'Exhaust all hand cards. Evoke ALL engineers. Draw 9 cards. Exhaust.',
    exhaust: true,
    icon: '🏆',
  },

  // ── Curse ──
  scope_creep: {
    id: 'scope_creep', name: 'Scope Creep', type: 'curse', target: 'self', cost: 0, rarity: 'curse',
    class: 'architect',
    description: 'Unplayable. Gain 5 stress when drawn. "Can we just add one more feature?"',
    effects: {},
    upgradedEffects: {},
    upgradedDescription: 'Unplayable. Gain 5 stress when drawn.',
    icon: '🦠',
  },
};
```

**Step 2: Add `upgradedCost` to CardDef type**

Check `src/types/index.ts` for the `CardDef` interface. If `upgradedCost` is not already a field, add it:

```ts
  upgradedCost?: number;   // overrides cost when upgraded
```

**Step 3: If upgradedCost is new, apply it in executePlayCard**

Find where `effectiveCost = card.cost` is set. Change to:

```ts
  let effectiveCost = card.upgraded && card.upgradedCost !== undefined ? card.upgradedCost : card.cost;
```

**Step 4: Run `npm run build`** — fix any TypeScript errors.

---

## Task 6: Update characters.ts

**Files:**
- Modify: `src/data/characters.ts`

Find the `architect` entry and replace with:

```ts
  {
    id: 'architect',
    name: 'Architect',
    title: 'The Obelisk',
    hp: 65,
    energy: 3,
    maxStress: 90,
    description: 'The Obelisk. Slot engineers into 3 positions. Each turn all slotted engineers fire their passives. Match the blueprint in order for a burst completion that fires all evokes at once.',
    starterDeckIds: [
      'singleton_pattern', 'singleton_pattern', 'singleton_pattern', 'singleton_pattern',
      'devops_engineer', 'devops_engineer',
      'qa_engineer',
      'design_doc',
      'code_review',
      'coffee_break',
    ],
    starterRelicId: 'whiteboard_marker',
    icon: '📐',
    available: true,
  },
```

---

## Task 7: Bump version

**Files:**
- Modify: `src/store/gameStore.ts`

Find `GAME_VERSION` at the top of the file and change from `'1.14.0'` to `'1.15.0'`.

---

## Final Verification

Run `npm run build` — must pass with zero TypeScript errors before considering implementation complete.

Spot-check:
- [ ] `engineerRoster` in engineers.ts exports all 11 engineers
- [ ] `generateBlueprint()` returns 3 IDs
- [ ] `BattleState` has all 4 new fields
- [ ] `CardEffect` has all 12 new fields
- [ ] `applyEvokeEffect` handles all 11 engineer evoke types
- [ ] `startNewTurn` processes passives and seeds new `detonationQueue` with passive queues
- [ ] Blueprint completion fires all evokes, clears slots, generates new blueprint
- [ ] Overflow evicts oldest when slots exceed max
- [ ] BattleScreen shows slots + blueprint only for architect character
- [ ] `scope_creep` curse card triggers 5 stress on draw (handled by existing curse-draw stress logic)
