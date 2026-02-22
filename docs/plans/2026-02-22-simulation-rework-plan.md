# Class Simulation, Relic/Consumable Redesign & Difficulty Audit — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simulate all 4 classes to find bugs and balance gaps, then completely redesign relics and consumables to synergize with each class's new archetype mechanics while preserving game difficulty at every act.

**Architecture:** Parallel simulation agents produce structured findings → bugs fixed in engine/data files → relics replaced wholesale in items.ts with class-mechanic-aware effects → consumables replaced in consumables.ts with class-gated items and reasonable damage/heal caps → new effect fields added to types/index.ts and wired into battleActions.ts and gameStore.ts.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Zustand 5 + Immer. No test framework — verification is `npm run build` (TypeScript check) plus in-game playtesting notes.

**Current version:** `1.15.0` in `src/store/gameStore.ts`. Bump to `1.16.0` at end.

---

## Design Reference — New Relics

All current relics in `src/data/items.ts` are REPLACED. The new set is designed to synergize with each class's overhauled mechanics. Every relic has either a cost, a condition, or a meaningful restriction — no unconditional stat sticks.

### Starter Relics (1 per class)

| id | class | effect fields | description |
|----|-------|--------------|-------------|
| `node_modules` | frontend | `startBattleConfidence: 1, drawOnOverflow: 2` | Start combat with 1 Confidence. After overflow, draw 2 cards. |
| `production_server` | backend | `startBattleConfidence: 1, startBattleResilience: 1, startBattleBlock: 4` | Start combat with 1 Confidence, 1 Resilience, 4 block. |
| `whiteboard_marker` | architect | `firstPowerFree: true` | First Power card each combat costs 0. (keep) |
| `gpu_cluster` | ai_engineer | `extraDraw: 1, trainingLoopBonus: 1` | Draw 1 extra card per turn. Training_loop cards gain +1 bonus per play count. |

### Frontend Relics (flow / dodge / bleed archetype)

| id | rarity | effect fields | description | tradeoff |
|----|--------|--------------|-------------|----------|
| `surge_capacitor` | common | `overflowBonusDamage: 5` | Overflow deals 5 extra damage to all enemies. | None — early common, accessible |
| `flow_retain` | rare | `retainFlow: 2` | Retain 2 Flow between turns (doesn't reset to 0). | None — ramp amplifier |
| `dodge_protocol` | rare | `blockPerDodgeStack: 1` | Start of each turn: gain 1 block per Dodge stack. | None — evasion/tank hybrid |
| `hot_reload` | epic | `drawOnOverflow: 2, dodgeOnOverflow: 2` | After overflow: draw 2 cards, gain 2 Dodge. | High-energy burst required |
| `dependency_hell` | epic | `startFlowBonus: 4, startBattleStress: 8` | Start combat with 4 Flow. Start combat with 8 stress. | Stress cost each combat |
| `bleed_amplifier` | epic | `startBattleConfidence: 2, startBattleResilience: 1, stressPerCombat: 5` | Start combat: +2 Conf, +1 Resil. Gain 5 stress after each combat. | Ongoing stress cost |

### Backend Relics (detonation queue / ice / fire / lightning archetype)

| id | rarity | effect fields | description | tradeoff |
|----|--------|--------------|-------------|----------|
| `cache_invalidation` | common | `firstIceDoubleQueue: true` | First ice card each combat queues double block. | None — tempo boost |
| `hot_standby` | rare | `healOnDetonate: 4` | After detonation fires, heal 4 HP. | Must use detonation to benefit |
| `technical_debt` | rare | `extraEnergy: 1, startSelfBurn: 1` | +1 energy per turn. Start each combat with 1 Burn on yourself. | Ongoing damage to self |
| `triple_stack_optimizer` | epic | `tripleElementEnergy: 1` | Queue all 3 element types in one turn: gain 1 energy next turn. | Requires setup |
| `burn_propagator` | epic | `burnPropagation: true` | Applying Burn to any enemy also applies 1 Burn to all other enemies. | None — strong in groups |
| `detonation_compiler` | epic | `vulnerableOnDetonate: true` | After detonation fires, apply 1 Vulnerable to all enemies. | Must use detonation to benefit |

### Architect Relics (engineer slots / blueprint archetype)

| id | rarity | effect fields | description | tradeoff |
|----|--------|--------------|-------------|----------|
| `agile_board` | common | `drawOnBlueprintAdvance: 1` | Advancing blueprint also draws 1 card. | None — card draw on mechanic use |
| `architecture_review` | rare | `blueprintCompleteVulnerable: 2` | Blueprint completion applies 2 Vulnerable to all enemies. | Requires blueprint setup |
| `sprint_velocity` | rare | `startBlockPerEngineer: 4` | Start combat with 4 block per slotted engineer. | Depends on prior engineer slots |
| `senior_engineer` | epic | `doubleEngineerPassive: true` | Engineer passives trigger twice each turn. | None — powerful but costly card slots |
| `scope_creep` | epic | `maxEngineerSlots: 2, confidencePerSlottedEngineer: true` | Max 2 engineer slots. Gain 1 Confidence/turn per slotted engineer. | Restricts roster depth |
| `tech_spec_relic` | epic | `extraDraw: 1, bonusBlock: 2` | Draw 1 extra card/turn. Block from skills +2. | None — versatile support |

### AI Engineer Relics (temperature / tokens / training_loop archetype)

| id | rarity | effect fields | description | tradeoff |
|----|--------|--------------|-------------|----------|
| `learning_rate` | common | `trainingLoopBonus: 1` | Training_loop cards gain +1 extra bonus per play count. | None — scaling amplifier |
| `token_faucet` | rare | `startTokens: 3, tokenLossPerTurn: 1` | Start combat with 3 tokens. Lose 1 token per turn. | Token drain over time |
| `feedback_loop` | rare | `overflowEnergyGain: 2` | When temperature overflows (hits 10), gain 2 energy. | Must push to overflow |
| `overfit` | epic | `hotThreshold: 5, temperatureFloor: 3` | Hot bonus at temp ≥ 5 (not 7). Temp floor 3 (no Freeze, no Cold bonus). | Loses Cold+Freeze archetypes |
| `hallucination_engine` | epic | `overflowBonusDamage: 10, overflowResetToZero: true` | Overflow deals 10 extra AoE damage. Resets temp to 0 (not 5). | Freeze-locks you after overflow |
| `context_limit` | epic | `startBattleConfidence: 2, startBattleResilience: 2, startBattleStress: 8` | Start combat: +2 Conf, +2 Resil, +8 stress. | Heavy stress cost |

### Neutral Relics (tradeoffs at rare/epic, safe at common)

| id | rarity | effect fields | description | tradeoff |
|----|--------|--------------|-------------|----------|
| `office_plant` | common | `healPerCombat: 3` | Heal 3 HP after each combat. | None |
| `expense_report` | common | `extraGold: 8` | Gain 8 gold after each combat. | None |
| `standing_desk` | common | `extraHp: 15` | Gain 15 max HP. | None |
| `onboarding_docs` | common | `startBattleBlock: 5` | Start each combat with 5 block. | None |
| `crunch_mode` | rare | `extraEnergy: 1, stressPerCombat: 5` | +1 energy/turn. Gain 5 stress after each combat. | Stress pressure |
| `second_monitor` | rare | `extraDraw: 1` | Draw 1 extra card each turn. | None — mild |
| `gaming_mouse` | rare | `bonusDamage: 2` | Deal 2 extra damage with all attacks. | None — mild |
| `imposter_syndrome` | rare | `damageReductionPercent: 25, startBattleStress: 10` | Take 25% less damage. Start each combat with 10 stress. | Stress pressure |
| `performance_review` | epic | `startBattleConfidence: 1, startBattleResilience: 1, stressPerCombat: 8` | Start combat: +1 Conf, +1 Resil. 8 stress per combat. | Ongoing stress cost |
| `stock_options` | epic | `extraGold: 25, extraHp: -10` | Gain 25 gold per combat. Max HP -10. | HP reduction |
| `management_deck` | epic | `confidenceOnKill: 3` | On kill: gain 3 Confidence for this combat. | Must get kills to benefit |

---

## Design Reference — New Consumables

All current consumables in `src/data/consumables.ts` are REPLACED. Caps: max single-target damage 25, max AoE 15, max heal 20. Legendaries may exceed with stress cost.

### Common (8) — Generic tempo tools

| id | effect | target |
|----|--------|--------|
| `energy_drink` | `{ energy: 2 }` | self |
| `cold_brew` | `{ draw: 3 }` | self |
| `granola_bar` | `{ heal: 10 }` | self |
| `stress_ball` | `{ stressRelief: 20 }` | self |
| `stack_trace_c` | `{ applyToTarget: { vulnerable: 3 } }` | enemy |
| `git_blame_c` | `{ applyToTarget: { weak: 2 } }` | enemy |
| `documentation_c` | `{ block: 10 }` | self |
| `hotfix_c` | `{ heal: 8, applyToTarget: { vulnerable: 2 } }` | enemy |

### Rare (9) — 4 class-specific + 5 enhanced generic

| id | class | effect | target | notes |
|----|-------|--------|--------|-------|
| `flow_jar` | frontend | `{ gainFlow: 5 }` | self | New field: gainFlow |
| `detonation_primer` | backend | `{ triggerDetonation: true }` | self | New field: triggerDetonation |
| `sprint_ticket` | architect | `{ advanceBlueprintConsumable: 3 }` | self | New field |
| `temperature_spike` | ai_engineer | `{ setTemperature: 9 }` | self | New field |
| `leetcode_grind` | — | `{ applyToSelf: { confidence: 2 } }` | self | |
| `kombucha` | — | `{ heal: 15, applyToSelf: { regen: 2 } }` | self | |
| `deploy_friday` | — | `{ damageAll: 12 }` | all_enemies | |
| `regex_grenade` | — | `{ applyToAll: { vulnerable: 3 } }` | all_enemies | |
| `pair_session` | — | `{ draw: 3, energy: 1 }` | self | |

### Epic (5) — High impact with costs

| id | effect | target | cost |
|----|--------|--------|------|
| `resignation_letter` | `{ damage: 25, addStress: 10 }` | enemy | +10 stress |
| `severance_package` | `{ heal: 20, goldGain: 20, stressRelief: 10 }` | self | — |
| `all_hands_meeting` | `{ applyToAll: { vulnerable: 3, weak: 3 }, addStress: 5 }` | all_enemies | +5 stress |
| `production_deploy` | `{ damage: 20, addStress: 15 }` | enemy | +15 stress |
| `yc_acceptance` | `{ addEpicCardsToHand: 2 }` | self | — |

### Legendary (2) — Game-changing with stings

| id | effect | target | sting |
|----|--------|--------|-------|
| `golden_ticket` | `{ energy: 3, heal: 25, stressRelief: 25 }` | self | No full heal, no zero stress |
| `the_whitepaper` | `{ draw: 5, energy: 3, applyToAll: { vulnerable: 3, weak: 2 }, addStress: 20 }` | all_enemies | +20 stress |

---

## Implementation Tasks

---

### Task 1: Run Parallel Simulation Agents

**Files:** none (read-only research task)

**Step 1: Launch 4 agents simultaneously**

Use `superpowers:dispatching-parallel-agents`. Launch all 4 in one message.

Each agent prompt follows this template (substitute class-specific content):

```
You are simulating 10 full 3-act runs of "The Last Software Engineer" as [CLASS_NAME].

Read these files before simulating:
- src/data/cards/[CLASS]Cards.ts (full card pool)
- src/data/cards/neutralCards.ts
- src/data/enemies/act1Enemies.ts, act2Enemies.ts, act3Enemies.ts
- src/data/enemies/encounters.ts
- src/data/characters.ts (starter deck)
- src/data/items.ts (relics)
- src/data/consumables.ts
- src/store/battleActions.ts (how effects are applied)
- src/utils/battleEngine.ts (damage/block math)

For each of 10 runs, simulate a full 3-act run using this template:

RUN N:
- Setup: starter deck cards, starter relic, HP, energy
- Act 1 (3 battles + 1 boss):
  - Battle 1: enemy, hand drawn, cards played, outcome
  - Card reward choices (which you pick and why)
  - Event/rest decisions
  - Boss fight: strategy, outcome, HP remaining
- Act 2 (4 battles + 1 boss):
  - Key elite fight
  - Boss fight
- Act 3 (4 battles + 1 boss):
  - Final boss attempt
  - WIN or LOSS, HP remaining, stress level

After all 10 runs, produce a structured report:

WIN_RATE: X/10

BUGS:
- [Description vs effect mismatch, interaction error, or impossible behavior]

BALANCE_OVERTUNED:
- [Card that felt too strong with specific run context]

BALANCE_UNDERTUNED:
- [Card that was never worth picking]

DEAD_CARDS:
- [Cards never selected in any reward screen across 10 runs]

RELIC_GAPS:
- [Current relics that don't interact with class mechanic]

CONSUMABLE_GAPS:
- [No consumable interacts with class-specific resources]

DIFFICULTY_TRIVIA:
- [Any fight that felt skippable/trivial because of a card/relic/consumable]

DIFFICULTY_WALLS:
- [Any enemy that felt unfair or had no counterplay]
```

**Step 2: Wait for all 4 agents to complete**

**Step 3: Compile findings into `docs/plans/sim-findings.md`**

Format:
```markdown
# Simulation Findings

## Frontend Dev (win rate: X/10)
### Bugs
### Balance
### Dead Cards
### Difficulty Notes

## Backend Dev (win rate: X/10)
...

## Architect (win rate: X/10)
...

## AI Engineer (win rate: X/10)
...

## Cross-class Issues
...
```

---

### Task 2: Fix Bugs Found in Simulation

**Files:**
- Modify: `src/data/cards/frontendCards.ts`
- Modify: `src/data/cards/backendCards.ts`
- Modify: `src/data/cards/architectCards.ts`
- Modify: `src/data/cards/aiEngineerCards.ts`
- Modify: `src/data/cards/neutralCards.ts`
- Modify: `src/utils/battleEngine.ts`
- Modify: `src/store/battleActions.ts`

**Step 1: For each bug in sim-findings.md, fix it**

Priority order:
1. Description says X but `effects` does Y → fix `effects` to match description (description is source of truth)
2. Effect field referenced but not handled in engine → add handler in battleActions.ts
3. Numeric errors (damage/block off by visible amount) → fix value

**Step 2: Build check**
```bash
npm run build
```
Expected: 0 TypeScript errors.

---

### Task 3: Balance Tune Cards from Simulation

**Files:** Same card files as Task 2

**Step 1: For each BALANCE_OVERTUNED card in findings, reduce value by ~15-20%**

Rule: Never change a card's mechanic, only its numbers. Round to whole numbers.

**Step 2: For each BALANCE_UNDERTUNED card, increase value by ~15-20%**

**Step 3: For DEAD_CARDS — evaluate:**
- If cost too high → reduce cost by 1 (if > 0)
- If effect too weak → buff numbers
- If design is irredeemably bad → flag for future redesign (don't delete)

**Step 4: Build check**
```bash
npm run build
```

---

### Task 4: Add New Type Fields

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add new ItemDef effect fields**

Inside the `ItemDef` `effect` object, after the existing `extraEnergyFirstTurn` field, add:

```typescript
    // ── Frontend relic fields ──
    drawOnOverflow?: number;           // after overflow: draw N cards
    dodgeOnOverflow?: number;          // after overflow: gain N dodge
    retainFlow?: number;               // retain N flow between turns (don't reset to 0)
    blockPerDodgeStack?: number;       // at turn start: gain N block per dodge stack
    startFlowBonus?: number;           // start combat with N flow
    overflowBonusDamage?: number;      // overflow deals N extra AoE damage (frontend + ai_engineer)
    // ── Backend relic fields ──
    firstIceDoubleQueue?: boolean;     // first ice card each combat queues double block
    healOnDetonate?: number;           // heal N HP after detonation fires
    startSelfBurn?: number;            // start combat with N burn on player
    tripleElementEnergy?: number;      // queue all 3 elements in one turn: gain N energy next turn
    burnPropagation?: boolean;         // applying burn to one enemy also applies 1 burn to others
    vulnerableOnDetonate?: boolean;    // after detonation fires: apply 1 vulnerable to all enemies
    // ── Architect relic fields ──
    drawOnBlueprintAdvance?: number;   // after advancing blueprint: draw N cards
    blueprintCompleteVulnerable?: number; // blueprint completion: apply N vulnerable to all enemies
    startBlockPerEngineer?: number;    // start combat with N block per slotted engineer
    doubleEngineerPassive?: boolean;   // engineer passives trigger twice each turn
    maxEngineerSlots?: number;         // cap engineer slots at N (replaces default of 3)
    confidencePerSlottedEngineer?: boolean; // gain 1 confidence/turn per slotted engineer
    // ── AI Engineer relic fields ──
    trainingLoopBonus?: number;        // training_loop cards gain +N extra bonus per play count
    startTokens?: number;              // start combat with N tokens
    tokenLossPerTurn?: number;         // lose N tokens at end of each turn
    overflowEnergyGain?: number;       // on temperature overflow: gain N energy
    overflowResetToZero?: boolean;     // overflow resets temperature to 0 instead of 5
    hotThreshold?: number;             // override hot bonus activation threshold (default 7)
    temperatureFloor?: number;         // temperature cannot go below N
    // ── Neutral relic fields ──
    damageReductionPercent?: number;   // take N% less incoming damage (applied in calculateDamage)
    startBattleStress?: number;        // start each combat with N stress added
    confidenceOnKill?: number;         // on enemy kill: gain N confidence this combat
```

**Step 2: Add new ConsumableEffect fields**

Inside the `ConsumableEffect` interface, after `addEpicCardsToHand`, add:

```typescript
  gainFlow?: number;                   // gain N flow (frontend class consumable)
  triggerDetonation?: boolean;         // fire detonation queue immediately (backend class consumable)
  advanceBlueprintConsumable?: number; // advance blueprint by N (architect class consumable)
  setTemperature?: number;             // set temperature to N (ai_engineer class consumable)
```

**Step 3: Add class field to ConsumableDef**

In the `ConsumableDef` interface, add after `target`:
```typescript
  class?: CardClass;  // if set, only drop for matching player class
```

**Step 4: Build check**
```bash
npm run build
```
Expected: 0 errors (new fields are optional, nothing breaks).

---

### Task 5: Replace items.ts — Starter + Frontend + Backend Relics

**Files:**
- Modify: `src/data/items.ts`

**Step 1: Replace entire file content**

Keep the imports and helper functions at the bottom. Replace all `items: ItemDef[]` content with the new set.

**Starter Relics block:**
```typescript
  // ═══════════════════════════════════════════════════════════════
  // STARTER RELICS (1 per class)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'node_modules', name: 'node_modules', icon: '📦',
    description: 'Start combat with 1 Confidence. After overflow, draw 2 cards. 4.2 GB of dependencies finally paying off.',
    rarity: 'starter', class: 'frontend', isStarter: true,
    effect: { startBattleConfidence: 1, drawOnOverflow: 2 },
  },
  {
    id: 'production_server', name: 'Production Server', icon: '🖥️',
    description: 'Start combat with 1 Confidence, 1 Resilience, and 4 block. Running since 2016. Nobody dares touch it.',
    rarity: 'starter', class: 'backend', isStarter: true,
    effect: { startBattleConfidence: 1, startBattleResilience: 1, startBattleBlock: 4 },
  },
  {
    id: 'whiteboard_marker', name: 'Whiteboard Marker', icon: '🖊️',
    description: 'First Power each combat costs 0. Dried out. Still works.',
    rarity: 'starter', class: 'architect', isStarter: true,
    effect: { firstPowerFree: true },
  },
  {
    id: 'gpu_cluster', name: 'GPU Cluster', icon: '🔧',
    description: 'Draw 1 extra card per turn. Training_loop cards gain +1 bonus per play count. $47,000/month in cloud compute.',
    rarity: 'starter', class: 'ai_engineer', isStarter: true,
    effect: { extraDraw: 1, trainingLoopBonus: 1 },
  },
```

**Frontend Relics block:**
```typescript
  // ═══════════════════════════════════════════════════════════════
  // FRONTEND CLASS RELICS (flow / dodge / bleed)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'surge_capacitor', name: 'Surge Capacitor', icon: '⚡',
    description: 'Overflow deals 5 extra damage to all enemies. Release the backpressure.',
    rarity: 'common', class: 'frontend',
    effect: { overflowBonusDamage: 5 },
  },
  {
    id: 'flow_retain', name: 'Perpetual Flow State', icon: '🌊',
    description: 'Retain 2 Flow between turns (doesn\'t reset to 0 at turn end). You never leave the zone.',
    rarity: 'rare', class: 'frontend',
    effect: { retainFlow: 2 },
  },
  {
    id: 'dodge_protocol', name: 'Dodge Protocol', icon: '👻',
    description: 'At the start of each turn, gain 1 block per Dodge stack. Evasion becoming armor.',
    rarity: 'rare', class: 'frontend',
    effect: { blockPerDodgeStack: 1 },
  },
  {
    id: 'hot_reload', name: 'Hot Reload', icon: '♻️',
    description: 'After overflow: draw 2 cards and gain 2 Dodge. The component refreshed. So did you.',
    rarity: 'epic', class: 'frontend',
    effect: { drawOnOverflow: 2, dodgeOnOverflow: 2 },
  },
  {
    id: 'dependency_hell', name: 'Dependency Hell', icon: '📦',
    description: 'Start combat with 4 Flow. Start combat with 8 stress. Peer dependencies: irreconcilable.',
    rarity: 'epic', class: 'frontend',
    effect: { startFlowBonus: 4, startBattleStress: 8 },
  },
  {
    id: 'bleed_amplifier', name: 'Bleed Amplifier', icon: '🩸',
    description: 'Start combat with 2 Confidence and 1 Resilience. Gain 5 stress after each combat. Hemorrhaging faster every run.',
    rarity: 'epic', class: 'frontend',
    effect: { startBattleConfidence: 2, startBattleResilience: 1, stressPerCombat: 5 },
  },
```

**Backend Relics block:**
```typescript
  // ═══════════════════════════════════════════════════════════════
  // BACKEND CLASS RELICS (detonation queue / ice / fire / lightning)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cache_invalidation', name: 'Cache Invalidation', icon: '❄️',
    description: 'First ice card each combat queues double block. The hard problem: briefly solved.',
    rarity: 'common', class: 'backend',
    effect: { firstIceDoubleQueue: true },
  },
  {
    id: 'hot_standby', name: 'Hot Standby', icon: '🔋',
    description: 'After your detonation fires, heal 4 HP. Always on. Always alert. Spiritually gone.',
    rarity: 'rare', class: 'backend',
    effect: { healOnDetonate: 4 },
  },
  {
    id: 'technical_debt', name: 'Technical Debt', icon: '💳',
    description: 'Gain 1 extra energy per turn. Start each combat with 1 Burn on yourself. You borrowed from future-you.',
    rarity: 'rare', class: 'backend',
    effect: { extraEnergy: 1, startSelfBurn: 1 },
  },
  {
    id: 'triple_stack_optimizer', name: 'Triple Stack Optimizer', icon: '🌪️',
    description: 'Queue all 3 elements (ice + fire + lightning) in one turn: gain 1 energy next turn. Orchestration. Barely.',
    rarity: 'epic', class: 'backend',
    effect: { tripleElementEnergy: 1 },
  },
  {
    id: 'burn_propagator', name: 'Burn Propagator', icon: '🔥',
    description: 'Applying Burn to any enemy also applies 1 Burn to all other enemies in the fight. Fire spreads. That is the technical term.',
    rarity: 'epic', class: 'backend',
    effect: { burnPropagation: true },
  },
  {
    id: 'detonation_compiler', name: 'Detonation Compiler', icon: '💻',
    description: 'After detonation fires, apply 1 Vulnerable to all enemies. The blast radius: your audit trail.',
    rarity: 'epic', class: 'backend',
    effect: { vulnerableOnDetonate: true },
  },
```

**Step 2: Build check**
```bash
npm run build
```

---

### Task 6: Replace items.ts — Architect + AI Engineer + Neutral Relics

**Files:**
- Modify: `src/data/items.ts`

**Step 1: Add Architect relics block after Backend relics:**
```typescript
  // ═══════════════════════════════════════════════════════════════
  // ARCHITECT CLASS RELICS (engineer slots / blueprint)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'agile_board', name: 'Agile Board', icon: '📋',
    description: 'Advancing blueprint also draws 1 card. The ticket moved. You noticed.',
    rarity: 'common', class: 'architect',
    effect: { drawOnBlueprintAdvance: 1 },
  },
  {
    id: 'architecture_review', name: 'Architecture Review', icon: '🔎',
    description: 'Blueprint completion applies 2 Vulnerable to all enemies. Rubber-stamped. Violently.',
    rarity: 'rare', class: 'architect',
    effect: { blueprintCompleteVulnerable: 2 },
  },
  {
    id: 'sprint_velocity', name: 'Sprint Velocity', icon: '🏃',
    description: 'Start each combat with 4 block per slotted engineer. Prior investment, present shield.',
    rarity: 'rare', class: 'architect',
    effect: { startBlockPerEngineer: 4 },
  },
  {
    id: 'senior_engineer', name: 'Senior Engineer', icon: '🏅',
    description: 'Engineer passives trigger twice each turn. Mentorship: passive-aggressive.',
    rarity: 'epic', class: 'architect',
    effect: { doubleEngineerPassive: true },
  },
  {
    id: 'scope_creep', name: 'Scope Creep', icon: '📈',
    description: 'Max engineer slots: 2. Gain 1 Confidence at turn start per slotted engineer. The team is small. The confidence: enormous.',
    rarity: 'epic', class: 'architect',
    effect: { maxEngineerSlots: 2, confidencePerSlottedEngineer: true },
  },
  {
    id: 'tech_spec_relic', name: 'Tech Spec', icon: '📄',
    description: 'Draw 1 extra card per turn. Block from skills +2. 47 pages. Actually read.',
    rarity: 'epic', class: 'architect',
    effect: { extraDraw: 1, bonusBlock: 2 },
  },
```

**Step 2: Add AI Engineer relics block:**
```typescript
  // ═══════════════════════════════════════════════════════════════
  // AI ENGINEER CLASS RELICS (temperature / tokens / training_loop)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'learning_rate', name: 'Learning Rate', icon: '📊',
    description: 'Training_loop cards gain +1 extra bonus per play count on top of their listed rate.',
    rarity: 'common', class: 'ai_engineer',
    effect: { trainingLoopBonus: 1 },
  },
  {
    id: 'token_faucet', name: 'Token Faucet', icon: '🪣',
    description: 'Start each combat with 3 tokens. Lose 1 token per turn. It trickles. It drains.',
    rarity: 'rare', class: 'ai_engineer',
    effect: { startTokens: 3, tokenLossPerTurn: 1 },
  },
  {
    id: 'feedback_loop', name: 'Feedback Loop', icon: '🔄',
    description: 'When temperature overflows (hits 10), gain 2 energy. Push hard enough to reap.',
    rarity: 'rare', class: 'ai_engineer',
    effect: { overflowEnergyGain: 2 },
  },
  {
    id: 'overfit', name: 'Overfit', icon: '🎯',
    description: 'Hot bonus activates at temp ≥ 5 (not 7). Temperature cannot drop below 3 (no Cold bonus, no Freeze).',
    rarity: 'epic', class: 'ai_engineer',
    effect: { hotThreshold: 5, temperatureFloor: 3 },
  },
  {
    id: 'hallucination_engine', name: 'Hallucination Engine', icon: '🎲',
    description: 'Overflow deals 10 extra damage to all enemies. Overflow resets temperature to 0 instead of 5.',
    rarity: 'epic', class: 'ai_engineer',
    effect: { overflowBonusDamage: 10, overflowResetToZero: true },
  },
  {
    id: 'context_limit', name: 'Context Limit', icon: '🪟',
    description: 'Start combat with 2 Confidence and 2 Resilience. Start each combat with 8 stress. Burned in. Burned out.',
    rarity: 'epic', class: 'ai_engineer',
    effect: { startBattleConfidence: 2, startBattleResilience: 2, startBattleStress: 8 },
  },
```

**Step 3: Add Neutral relics block:**
```typescript
  // ═══════════════════════════════════════════════════════════════
  // NEUTRAL RELICS (all classes)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'office_plant', name: 'Office Plant', icon: '🌱',
    description: 'Heal 3 HP after each combat. Somehow still alive.',
    rarity: 'common',
    effect: { healPerCombat: 3 },
  },
  {
    id: 'expense_report', name: 'Expense Report', icon: '💰',
    description: 'Gain 8 gold after each combat. Approved on the 4th submission.',
    rarity: 'common',
    effect: { extraGold: 8 },
  },
  {
    id: 'standing_desk', name: 'Standing Desk', icon: '🪑',
    description: 'Gain 15 max HP. Your back: slightly less destroyed.',
    rarity: 'common',
    effect: { extraHp: 15 },
  },
  {
    id: 'onboarding_docs', name: 'Onboarding Docs', icon: '📖',
    description: 'Start each combat with 5 block. Written by whoever left last.',
    rarity: 'common',
    effect: { startBattleBlock: 5 },
  },
  {
    id: 'crunch_mode', name: 'Crunch Mode', icon: '⏰',
    description: 'Gain 1 extra energy per turn. Gain 5 stress after each combat. Sleep: optional.',
    rarity: 'rare',
    effect: { extraEnergy: 1, stressPerCombat: 5 },
  },
  {
    id: 'second_monitor', name: 'Second Monitor', icon: '🖥️',
    description: 'Draw 1 extra card per turn. Block out the standup meeting.',
    rarity: 'rare',
    effect: { extraDraw: 1 },
  },
  {
    id: 'gaming_mouse', name: 'Gaming Mouse', icon: '🖱️',
    description: 'Deal 2 extra damage with all attacks.',
    rarity: 'rare',
    effect: { bonusDamage: 2 },
  },
  {
    id: 'imposter_syndrome', name: 'Imposter Syndrome', icon: '🎭',
    description: 'Take 25% less damage from all sources. Start each combat with 10 stress. You don\'t belong here. That saves you.',
    rarity: 'rare',
    effect: { damageReductionPercent: 25, startBattleStress: 10 },
  },
  {
    id: 'performance_review', name: 'Performance Review', icon: '📊',
    description: 'Start combat: +1 Confidence, +1 Resilience. Gain 8 stress after each combat. Exceeds expectations. Barely survives them.',
    rarity: 'epic',
    effect: { startBattleConfidence: 1, startBattleResilience: 1, stressPerCombat: 8 },
  },
  {
    id: 'stock_options', name: 'Stock Options', icon: '📈',
    description: 'Gain 25 gold after each combat. Max HP -10. 4-year vest. Cliff at month 5.',
    rarity: 'epic',
    effect: { extraGold: 25, extraHp: -10 },
  },
  {
    id: 'management_deck', name: 'Management Deck', icon: '🃏',
    description: 'On kill: gain 3 Confidence for this combat. The boss is eliminated. You feel great.',
    rarity: 'epic',
    effect: { confidenceOnKill: 3 },
  },
```

**Step 4: Update helper functions at bottom of items.ts**

The `getRewardArtifact` and `getShopItems` helpers filter by rarity. Ensure they exclude `isStarter: true` relics (they already do based on existing logic). No changes needed unless current code references old relic IDs by name.

**Step 5: Build check**
```bash
npm run build
```

---

### Task 7: Replace consumables.ts

**Files:**
- Modify: `src/data/consumables.ts`

**Step 1: Replace the entire `consumables` record with the new set**

```typescript
export const consumables: Record<string, ConsumableDef> = {
  // ═══════════════════════════════════
  // COMMON (8) — Generic tempo tools
  // ═══════════════════════════════════
  energy_drink: {
    id: 'energy_drink', name: 'Energy Drink', icon: '⚡',
    description: '+2 Energy this turn. Tastes like battery acid and ambition.',
    rarity: 'common', target: 'self',
    effect: { energy: 2 },
  },
  cold_brew: {
    id: 'cold_brew', name: 'Cold Brew Thermos', icon: '☕',
    description: 'Draw 3 cards. Brewed at 4 AM during a production incident.',
    rarity: 'common', target: 'self',
    effect: { draw: 3 },
  },
  granola_bar: {
    id: 'granola_bar', name: 'Granola Bar', icon: '🍫',
    description: 'Heal 10 HP. Expired trail mix from the communal kitchen.',
    rarity: 'common', target: 'self',
    effect: { heal: 10 },
  },
  stress_ball: {
    id: 'stress_ball', name: 'Company Stress Ball', icon: '🟡',
    description: '-20 Stress. It has the company logo on it. Squeeze harder.',
    rarity: 'common', target: 'self',
    effect: { stressRelief: 20 },
  },
  stack_trace_c: {
    id: 'stack_trace_c', name: 'Stack Trace', icon: '🔍',
    description: 'Apply 3 Vulnerable to an enemy. Their weaknesses: revealed.',
    rarity: 'common', target: 'enemy',
    effect: { applyToTarget: { vulnerable: 3 } },
  },
  git_blame_c: {
    id: 'git_blame_c', name: 'Git Blame', icon: '👉',
    description: 'Apply 2 Weak to an enemy. It was their commit all along.',
    rarity: 'common', target: 'enemy',
    effect: { applyToTarget: { weak: 2 } },
  },
  documentation_c: {
    id: 'documentation_c', name: 'Documentation', icon: '📖',
    description: 'Gain 10 block. Finally written. Already outdated.',
    rarity: 'common', target: 'self',
    effect: { block: 10 },
  },
  hotfix_c: {
    id: 'hotfix_c', name: 'Hotfix Patch', icon: '🩹',
    description: 'Heal 8 HP. Apply 2 Vulnerable to target. Ship now, regret never.',
    rarity: 'common', target: 'enemy',
    effect: { heal: 8, applyToTarget: { vulnerable: 2 } },
  },

  // ═══════════════════════════════════
  // RARE (9) — 4 class-specific + 5 generic
  // ═══════════════════════════════════
  flow_jar: {
    id: 'flow_jar', name: 'Flow State Jar', icon: '🫙',
    description: 'Gain 5 Flow immediately. Frontend only.',
    rarity: 'rare', target: 'self', class: 'frontend',
    effect: { gainFlow: 5 },
  },
  detonation_primer: {
    id: 'detonation_primer', name: 'Detonation Primer', icon: '💥',
    description: 'Trigger your detonation queue immediately this turn. Backend only.',
    rarity: 'rare', target: 'self', class: 'backend',
    effect: { triggerDetonation: true },
  },
  sprint_ticket: {
    id: 'sprint_ticket', name: 'Sprint Ticket', icon: '🎫',
    description: 'Advance blueprint by 3. Architect only. The ticket was always yours.',
    rarity: 'rare', target: 'self', class: 'architect',
    effect: { advanceBlueprintConsumable: 3 },
  },
  temperature_spike: {
    id: 'temperature_spike', name: 'Temperature Spike', icon: '🌡️',
    description: 'Set temperature to 9 (Hot state). AI Engineer only.',
    rarity: 'rare', target: 'self', class: 'ai_engineer',
    effect: { setTemperature: 9 },
  },
  leetcode_grind: {
    id: 'leetcode_grind', name: 'LeetCode Grind Session', icon: '💻',
    description: '+2 Confidence (+2 attack damage). You solved 50 mediums in one sitting.',
    rarity: 'rare', target: 'self',
    effect: { applyToSelf: { confidence: 2 } },
  },
  kombucha: {
    id: 'kombucha', name: 'Artisanal Kombucha', icon: '🍵',
    description: 'Heal 15 HP. Gain 2 Regen. Fermented by the office wellness committee.',
    rarity: 'rare', target: 'self',
    effect: { heal: 15, applyToSelf: { regen: 2 } },
  },
  deploy_friday: {
    id: 'deploy_friday', name: 'Deploy on Friday', icon: '🚀',
    description: 'Deal 12 damage to ALL enemies. Bold move. Let\'s see how it plays out.',
    rarity: 'rare', target: 'all_enemies',
    effect: { damageAll: 12 },
  },
  regex_grenade: {
    id: 'regex_grenade', name: 'Regex Grenade', icon: '💣',
    description: '3 Vulnerable to ALL enemies. /.*kaboom.*/g',
    rarity: 'rare', target: 'all_enemies',
    effect: { applyToAll: { vulnerable: 3 } },
  },
  pair_session: {
    id: 'pair_session', name: 'Pair Programming Session', icon: '🧑‍💻',
    description: 'Draw 3 cards. Gain 1 energy. Someone else\'s problem too, now.',
    rarity: 'rare', target: 'self',
    effect: { draw: 3, energy: 1 },
  },

  // ═══════════════════════════════════
  // EPIC (5) — High impact, stress costs
  // ═══════════════════════════════════
  resignation_letter: {
    id: 'resignation_letter', name: 'Resignation Letter', icon: '📜',
    description: 'Deal 25 damage to one enemy. Gain 10 stress. The bridge is burned.',
    rarity: 'epic', target: 'enemy',
    effect: { damage: 25, addStress: 10 },
  },
  severance_package: {
    id: 'severance_package', name: 'Severance Package', icon: '💼',
    description: 'Heal 20 HP. Gain 20 gold. Reduce stress by 10. A generous goodbye.',
    rarity: 'epic', target: 'self',
    effect: { heal: 20, goldGain: 20, stressRelief: 10 },
  },
  all_hands_meeting: {
    id: 'all_hands_meeting', name: 'All-Hands Meeting', icon: '🔔',
    description: 'Apply 3 Vulnerable and 3 Weak to ALL enemies. Gain 5 stress. The CEO raised the bar.',
    rarity: 'epic', target: 'all_enemies',
    effect: { applyToAll: { vulnerable: 3, weak: 3 }, addStress: 5 },
  },
  production_deploy: {
    id: 'production_deploy', name: 'Production Deploy', icon: '☠️',
    description: 'Deal 20 damage to one enemy. Gain 15 stress. This is not dev. This is real.',
    rarity: 'epic', target: 'enemy',
    effect: { damage: 20, addStress: 15 },
  },
  yc_acceptance: {
    id: 'yc_acceptance', name: 'YC Acceptance', icon: '🏆',
    description: 'Add 2 random epic cards to your hand this turn. Series A: closed.',
    rarity: 'epic', target: 'self',
    effect: { addEpicCardsToHand: 2 },
  },

  // ═══════════════════════════════════
  // LEGENDARY (2) — Exceptional, with stings
  // ═══════════════════════════════════
  golden_ticket: {
    id: 'golden_ticket', name: 'Golden Ticket', icon: '🎫',
    description: 'Gain 3 energy. Heal 25 HP. Reduce stress by 25. The offer came through. The comp is real.',
    rarity: 'legendary', target: 'self',
    effect: { energy: 3, heal: 25, stressRelief: 25 },
  },
  the_whitepaper: {
    id: 'the_whitepaper', name: 'The Whitepaper', icon: '📃',
    description: 'Draw 5 cards. Gain 3 energy. Apply 3 Vulnerable + 2 Weak to ALL enemies. Gain 20 stress.',
    rarity: 'legendary', target: 'all_enemies',
    effect: { draw: 5, energy: 3, applyToAll: { vulnerable: 3, weak: 2 }, addStress: 20 },
  },
};
```

**Step 2: Update drop helpers**

Replace the pool declarations to use new IDs, and filter by `class` for class-specific drops:

```typescript
const allConsumableValues = Object.values(consumables);
const commonPool = allConsumableValues.filter(c => c.rarity === 'common' && !c.class);
const rareGenericPool = allConsumableValues.filter(c => c.rarity === 'rare' && !c.class);
const epicPool = allConsumableValues.filter(c => c.rarity === 'epic');
const legendaryPool = allConsumableValues.filter(c => c.rarity === 'legendary');
```

Update `getConsumableDrop` to accept optional `playerClass` and include class-specific rares for matching class:

```typescript
export function getConsumableDrop(act: number, playerClass?: CardClass): ConsumableDef {
  const rarePool = [
    ...rareGenericPool,
    ...allConsumableValues.filter(c => c.rarity === 'rare' && c.class === playerClass),
  ];
  switch (act) {
    case 1: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 65, 28, 6, 1);
    case 2: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 40, 38, 17, 5);
    case 3: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 15, 40, 33, 12);
    default: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 65, 28, 6, 1);
  }
}
```

Update `pickByRarity` to accept pools as parameters:
```typescript
function pickByRarity(
  cPool: ConsumableDef[], rPool: ConsumableDef[], ePool: ConsumableDef[], lPool: ConsumableDef[],
  cW: number, rW: number, eW: number, _lW: number
): ConsumableDef {
  const roll = Math.random() * 100;
  if (roll < cW) return pickRandom(cPool);
  if (roll < cW + rW) return pickRandom(rPool);
  if (roll < cW + rW + eW) return pickRandom(ePool.length > 0 ? ePool : rPool);
  return pickRandom(lPool.length > 0 ? lPool : ePool);
}
```

Update callers of `getConsumableDrop` in `gameStore.ts` to pass player class.

**Step 3: Build check**
```bash
npm run build
```

---

### Task 8: Wire New Relic Effects — initBattle & Turn Start

**Files:**
- Modify: `src/store/battleActions.ts`

In `initBattle`, find the section that applies starter relic effects (`startBattleConfidence`, `startBattleBlock`, etc.) and add the new fields:

**Step 1: After existing `startBattleBlock` application, add:**
```typescript
// startSelfBurn — Backend: start combat with N burn on player
const selfBurnTotal = run.items.reduce((s, i) => s + (i.effect.startSelfBurn || 0), 0);
if (selfBurnTotal > 0) {
  newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { burn: selfBurnTotal });
}

// startFlowBonus — Frontend: start combat with N flow
const startFlow = run.items.reduce((s, i) => s + (i.effect.startFlowBonus || 0), 0);
if (startFlow > 0) {
  newBattle.flow = Math.min(7, startFlow); // cap at 7 to not auto-trigger overflow
}

// startTokens — AI Engineer: start combat with N tokens
const startTokens = run.items.reduce((s, i) => s + (i.effect.startTokens || 0), 0);
if (startTokens > 0) {
  newBattle.tokens = (newBattle.tokens || 0) + startTokens;
}

// maxEngineerSlots — Architect: cap at N
const slotCap = run.items.reduce((min, i) => i.effect.maxEngineerSlots !== undefined ? Math.min(min, i.effect.maxEngineerSlots) : min, 3);
if (slotCap < 3 && newBattle.engineerSlots.length > slotCap) {
  newBattle.engineerSlots = newBattle.engineerSlots.slice(0, slotCap);
}

// startBlockPerEngineer — Architect: block = engineers × N
const blockPerEngineer = run.items.reduce((s, i) => s + (i.effect.startBlockPerEngineer || 0), 0);
if (blockPerEngineer > 0) {
  newBattle.playerBlock = (newBattle.playerBlock || 0) + blockPerEngineer * newBattle.engineerSlots.length;
}
```

**Step 2: In `startNewTurn`, after existing start-of-turn effects, add:**

Find where `blockPerTurn` is applied and add after it:
```typescript
// blockPerDodgeStack — Frontend: gain 1 block per dodge stack
const blockPerDodge = run.items.reduce((s, i) => s + (i.effect.blockPerDodgeStack || 0), 0);
if (blockPerDodge > 0) {
  const dodgeStacks = newBattle.playerStatusEffects.dodge || 0;
  newBattle.playerBlock = (newBattle.playerBlock || 0) + blockPerDodge * dodgeStacks;
}

// confidencePerSlottedEngineer — Architect: gain 1 confidence per slotted engineer
const confPerEngineer = run.items.some(i => i.effect.confidencePerSlottedEngineer);
if (confPerEngineer) {
  const engCount = newBattle.engineerSlots.length;
  if (engCount > 0) {
    newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { confidence: engCount });
  }
}

// tokenLossPerTurn — AI Engineer: lose N tokens per turn
const tokenLoss = run.items.reduce((s, i) => s + (i.effect.tokenLossPerTurn || 0), 0);
if (tokenLoss > 0) {
  newBattle.tokens = Math.max(0, (newBattle.tokens || 0) - tokenLoss);
}
```

**Step 3: In the overflow handler (flow hits 8), add overflow relic effects:**

Find the overflow block in `executePlayCard` where `flow >= 8` and add:
```typescript
// overflowBonusDamage — Frontend + AI Engineer: extra AoE on overflow
const overflowBonus = run.items.reduce((s, i) => s + (i.effect.overflowBonusDamage || 0), 0);
if (overflowBonus > 0) {
  newBattle.enemies = newBattle.enemies.map(e =>
    applyDamageToEnemy(e, calculateDamage(overflowBonus, battle.playerStatusEffects, e.statusEffects, run.items))
  );
}

// drawOnOverflow — Frontend: draw cards after overflow
const drawAfterOverflow = run.items.reduce((s, i) => s + (i.effect.drawOnOverflow || 0), 0);
if (drawAfterOverflow > 0) {
  const { drawn, newDrawPile, newDiscardPile } = drawCards(newBattle.drawPile, newBattle.discardPile, drawAfterOverflow);
  newBattle.hand = [...newBattle.hand, ...drawn];
  newBattle.drawPile = newDrawPile;
  newBattle.discardPile = newDiscardPile;
}

// dodgeOnOverflow — Frontend: gain dodge after overflow
const dodgeAfterOverflow = run.items.reduce((s, i) => s + (i.effect.dodgeOnOverflow || 0), 0);
if (dodgeAfterOverflow > 0) {
  newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { dodge: dodgeAfterOverflow });
}

// overflowResetToZero — AI Engineer: reset to 0 instead of 5
const resetToZero = run.items.some(i => i.effect.overflowResetToZero);
newBattle.flow = 0; // always 0 on overflow (was 0 before, keep)
// Note: temperature overflow uses same overflowResetToZero field — handled in temperature block
```

Also in the temperature overflow handler (temp hits 10):
```typescript
// overflowEnergyGain — AI Engineer: gain energy on temperature overflow
const tempOverflowEnergy = run.items.reduce((s, i) => s + (i.effect.overflowEnergyGain || 0), 0);
if (tempOverflowEnergy > 0) {
  newBattle.energy = (newBattle.energy || 0) + tempOverflowEnergy;
}

// overflowBonusDamage — shared field: extra AoE damage on temperature overflow
if (overflowBonus > 0) { /* already computed above — apply again for temp overflow if needed */ }

// overflowResetToZero — reset to 0 instead of 5
const tempResetToZero = run.items.some(i => i.effect.overflowResetToZero);
newBattle.temperature = tempResetToZero ? 0 : 5;
```

**Step 4: In temperature conditional checks, apply `hotThreshold` and `temperatureFloor`:**

Find `(newBattle.temperature ?? 5) >= 7` checks and replace with:
```typescript
const hotThreshold = run.items.reduce((min, i) => i.effect.hotThreshold !== undefined ? Math.min(min, i.effect.hotThreshold) : min, 7);
const tempFloor = run.items.reduce((max, i) => i.effect.temperatureFloor !== undefined ? Math.max(max, i.effect.temperatureFloor) : max, 0);

// Apply floor on coolDown
if (effects.coolDown) {
  const next = (newBattle.temperature ?? 5) - effects.coolDown;
  if (next <= tempFloor && tempFloor > 0) {
    newBattle.temperature = tempFloor; // can't go below floor
  } else if (next <= 0) {
    // Freeze: gain 15 block, reset to 5 (or floor if > 0)
    newBattle.playerBlock = (newBattle.playerBlock || 0) + 15;
    newBattle.temperature = Math.max(5, tempFloor);
  } else {
    newBattle.temperature = next;
  }
}

// Hot check
if (effects.damageIfHot && (newBattle.temperature ?? 5) >= hotThreshold && targetInstanceId) { ... }
if (effects.damageAllIfHot && (newBattle.temperature ?? 5) >= hotThreshold) { ... }
```

**Step 5: Build check**
```bash
npm run build
```

---

### Task 9: Wire New Relic Effects — Detonation & Architect & Kill Events

**Files:**
- Modify: `src/store/battleActions.ts`

**Step 1: In the detonation fire handler (where detonationQueue items fire at turn start), add:**

Find where `detonationQueue` is processed and add after it resolves:
```typescript
// healOnDetonate — Backend: heal N HP after detonation
if (firedAny) { // only if at least one element actually fired
  const healAmount = run.items.reduce((s, i) => s + (i.effect.healOnDetonate || 0), 0);
  if (healAmount > 0) {
    newBattle.playerHp = Math.min(run.maxHp, (newBattle.playerHp || run.maxHp) + healAmount);
  }
  // vulnerableOnDetonate — Backend: apply 1 vulnerable to all enemies after detonation
  const vulnOnDet = run.items.some(i => i.effect.vulnerableOnDetonate);
  if (vulnOnDet) {
    newBattle.enemies = newBattle.enemies.map(e => ({
      ...e,
      statusEffects: mergeStatusEffects(e.statusEffects, { vulnerable: 1 }),
    }));
  }
}
```

**Step 2: In the ice queue handler (queueBlock effect in executePlayCard), handle firstIceDoubleQueue:**

Find where `effects.queueBlock` is processed and add before it:
```typescript
const isFirstIce = run.items.some(i => i.effect.firstIceDoubleQueue) && !newBattle.firstIceUsed;
const iceBlock = isFirstIce ? effects.queueBlock * 2 : effects.queueBlock;
newBattle.detonationQueue = [...newBattle.detonationQueue, { element: 'ice' as const, blockAmount: iceBlock }];
if (isFirstIce) {
  newBattle.firstIceUsed = true; // add firstIceUsed: boolean to BattleState if not present
}
```

Add `firstIceUsed?: boolean` to `BattleState` in `src/types/index.ts`.

**Step 3: Track elements queued per turn for tripleElementEnergy:**

Add `elementsQueuedThisTurn?: Set<string>` to BattleState — but Sets don't serialize well. Instead use:
Add `elementsQueuedThisTurn?: string[]` to BattleState.

In `startNewTurn`, reset: `newBattle.elementsQueuedThisTurn = [];`

In each queue operation (queueBlock, queueDamageAll, queueChain), add the element type:
```typescript
newBattle.elementsQueuedThisTurn = [...(newBattle.elementsQueuedThisTurn || []), 'ice'];
// ... for fire: 'fire', for lightning: 'lightning'
```

After each card play, check:
```typescript
const uniqueElements = new Set(newBattle.elementsQueuedThisTurn || []);
const tripleEnergy = run.items.reduce((s, i) => s + (i.effect.tripleElementEnergy || 0), 0);
if (tripleEnergy > 0 && uniqueElements.size >= 3 && !(newBattle.tripleElementBonusUsed)) {
  newBattle.nextTurnEnergyBonus = (newBattle.nextTurnEnergyBonus || 0) + tripleEnergy;
  newBattle.tripleElementBonusUsed = true; // only once per turn
}
```

Add `nextTurnEnergyBonus?: number` and `tripleElementBonusUsed?: boolean` to BattleState.

In `startNewTurn`, apply and clear:
```typescript
if (newBattle.nextTurnEnergyBonus) {
  newBattle.energy = (newBattle.energy || 3) + newBattle.nextTurnEnergyBonus;
  newBattle.nextTurnEnergyBonus = 0;
}
newBattle.tripleElementBonusUsed = false;
newBattle.elementsQueuedThisTurn = [];
```

**Step 4: burnPropagation — when applying burn to one enemy, apply 1 to others:**

In the burn application path (where `applyToTarget: { burn: N }` is processed), add:
```typescript
const burnSpread = run.items.some(i => i.effect.burnPropagation);
if (burnSpread && appliedBurn > 0 && targetIdx !== -1) {
  newBattle.enemies = newBattle.enemies.map((e, i) => {
    if (i === targetIdx) return e; // already got full burn
    return { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { burn: 1 }) };
  });
}
```

**Step 5: drawOnBlueprintAdvance and blueprintCompleteVulnerable — in blueprint advance handler:**

Find where `advanceBlueprint` in CardEffect is processed and add:
```typescript
// drawOnBlueprintAdvance relic
const drawOnAdvance = run.items.reduce((s, i) => s + (i.effect.drawOnBlueprintAdvance || 0), 0);
if (drawOnAdvance > 0) {
  const { drawn, newDrawPile, newDiscardPile } = drawCards(newBattle.drawPile, newBattle.discardPile, drawOnAdvance);
  newBattle.hand = [...newBattle.hand, ...drawn];
  newBattle.drawPile = newDrawPile;
  newBattle.discardPile = newDiscardPile;
}

// blueprintCompleteVulnerable relic (only on completion)
if (blueprintJustCompleted) {
  const vulnAmount = run.items.reduce((s, i) => s + (i.effect.blueprintCompleteVulnerable || 0), 0);
  if (vulnAmount > 0) {
    newBattle.enemies = newBattle.enemies.map(e => ({
      ...e,
      statusEffects: mergeStatusEffects(e.statusEffects, { vulnerable: vulnAmount }),
    }));
  }
}
```

**Step 6: doubleEngineerPassive — in engineer passive tick, apply each passive twice:**

Find the engineer passive application loop and wrap it:
```typescript
const doublePasive = run.items.some(i => i.effect.doubleEngineerPassive);
const passiveIterations = doublePasive ? 2 : 1;
for (let iter = 0; iter < passiveIterations; iter++) {
  for (const slot of newBattle.engineerSlots) {
    // existing passive application code
  }
}
```

**Step 7: confidenceOnKill — after enemy death detection:**

Find where dead enemies are removed (in `executePlayCard` after damage) and add:
```typescript
const killCount = newBattle.enemies.filter(e => e.currentHp <= 0).length;
if (killCount > 0) {
  const confOnKill = run.items.reduce((s, i) => s + (i.effect.confidenceOnKill || 0), 0);
  if (confOnKill > 0) {
    newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { confidence: confOnKill * killCount });
  }
}
```

**Step 8: trainingLoopBonus — in training_loop cards (damagePerTimesPlayed):**

Find where `damagePerTimesPlayed` is processed:
```typescript
const trainingBonus = run.items.reduce((s, i) => s + (i.effect.trainingLoopBonus || 0), 0);
const playCount = newBattle.cardPlayCounts?.[card.id] || 0;
const bonusDmg = (effects.damagePerTimesPlayed + trainingBonus) * playCount;
```

**Step 9: Build check**
```bash
npm run build
```

---

### Task 10: Wire New Relic Effects — calculateDamage & gameStore

**Files:**
- Modify: `src/utils/battleEngine.ts`
- Modify: `src/store/gameStore.ts`

**Step 1: In `calculateDamage`, apply `damageReductionPercent` when called for player defense:**

The function is called for both player-to-enemy and enemy-to-player damage. We need to apply the reduction when the player is defending. Check the call site in `applyDamageToPlayer` or find where enemy damage is applied:

In `battleEngine.ts`, add a new exported helper:
```typescript
export function applyDamageReduction(damage: number, items: ItemDef[]): number {
  const reductionPct = items.reduce((s, i) => s + (i.effect.damageReductionPercent || 0), 0);
  if (reductionPct <= 0) return damage;
  return Math.max(1, Math.floor(damage * (1 - reductionPct / 100)));
}
```

In `battleActions.ts`, in the enemy attack handler (where player takes damage), wrap with:
```typescript
const reducedDamage = applyDamageReduction(rawDamage, run.items);
```

**Step 2: In `gameStore.ts`, wire `stressPerCombat` and `startBattleStress` in the post-combat flow:**

Find where the battle ends and player returns to map (in the `endBattle` / `nextNode` action). After battle victory:
```typescript
// stressPerCombat relics
const stressPerCombat = state.run.items.reduce((s, i) => s + (i.effect.stressPerCombat || 0), 0);
if (stressPerCombat > 0) {
  state.run.stress = Math.min(state.run.maxStress, state.run.stress + stressPerCombat);
}
```

And in `initBattle` (battleActions.ts), wire `startBattleStress`:
```typescript
const startStress = run.items.reduce((s, i) => s + (i.effect.startBattleStress || 0), 0);
if (startStress > 0) {
  // Apply stress to player — this requires access to run.stress in initBattle
  // Return a modified run as well, or apply stress in gameStore when transitioning to battle
}
```

Note: `startBattleStress` may be easier to apply in gameStore's `startBattle` action (before calling `initBattle`) since stress lives in `run`, not `battle`. Apply it there.

**Step 3: Wire class-specific consumable effects in gameStore.ts `useConsumable` action:**

Find the consumable use handler. After existing effects, add:
```typescript
// gainFlow — Frontend
if (consumable.effect.gainFlow) {
  state.battle.flow = Math.min(7, (state.battle.flow || 0) + consumable.effect.gainFlow);
}
// triggerDetonation — Backend
if (consumable.effect.triggerDetonation && state.battle.detonationQueue.length > 0) {
  // fire the queue now (reuse detonation fire logic)
  // simplest: set a flag that gameStore handles after consumable resolution
  state.battle.triggerDetonationNow = true; // new BattleState field
}
// advanceBlueprintConsumable — Architect
if (consumable.effect.advanceBlueprintConsumable) {
  // reuse the blueprint advance logic from battleActions
  const amount = consumable.effect.advanceBlueprintConsumable;
  state.battle.blueprintProgress = (state.battle.blueprintProgress || 0) + amount;
  // trigger complete if progress >= blueprint length
}
// setTemperature — AI Engineer
if (consumable.effect.setTemperature !== undefined) {
  state.battle.temperature = consumable.effect.setTemperature;
}
```

**Step 4: Update `getConsumableDrop` callers in gameStore.ts:**

Search for all `getConsumableDrop(` calls and add player class:
```typescript
getConsumableDrop(act, getPlayerClass(state.run.characterId))
```

**Step 5: Build check**
```bash
npm run build
```
Fix any TypeScript errors.

---

### Task 11: Bump Version

**Files:**
- Modify: `src/store/gameStore.ts`

**Step 1: Find `GAME_VERSION` at top of file and update:**

```typescript
const GAME_VERSION = '1.16.0';
```

**Step 2: Final build + lint check**
```bash
npm run build && npm run lint
```
Expected: 0 errors, 0 warnings.

---

### Task 12: Manual Verification Checklist

No automated tests exist. After building, verify in-browser:

- [ ] All 4 classes can start a run and complete Act 1 (no crashes on card play)
- [ ] Frontend: overflow triggers, drawOnOverflow draws cards, flow retained with relic
- [ ] Backend: detonation queue fires, healOnDetonate works, firstIceDoubleQueue visible in queue UI
- [ ] Architect: blueprint advances draw card (agile_board), blueprint completion applies Vulnerable
- [ ] AI Engineer: temperature overflow shows correct damage, tokens lose per turn with relic
- [ ] Consumables: flow_jar adds flow, detonation_primer fires queue, sprint_ticket advances blueprint, temperature_spike sets temp
- [ ] Neutral relics: crunch_mode adds stress after combat, imposter_syndrome reduces damage, confidenceOnKill fires on kill
- [ ] No `golden_ticket` style heal-full remains in consumables
- [ ] `npm run build` succeeds with 0 errors
