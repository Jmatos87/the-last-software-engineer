# AI Engineer Class Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the AI Engineer's token_economy and training_loop archetypes with Data Pipeline and Inference, rework the starter deck, relics, consumables, and Architect engineer slots to create a class that's competitive in the early game while retaining the temperature gauge as its signature mechanic.

**Architecture:** Remove all token/training_loop BattleState fields, CardEffect fields, and engine logic. Add a single new BattleState field `pipelineData` (number, resets each turn, +1 per card played). Add inference CardEffect fields that check enemy intents. Rewrite all ~33 token/training_loop cards as new Data Pipeline and Inference cards. Update AI Jr/Sr architect engineer slots to use pipelineData instead of tokens.

**Tech Stack:** React 19, TypeScript 5.9, Zustand 5 + Immer, Vite 7

---

## Design Summary

### 3 Archetypes (was: temperature / token_economy / training_loop)

| Archetype | Mechanic | Identity |
|---|---|---|
| **Temperature** (kept) | Hot/Cold gauge 0–10, overflow (≥10 → 12 AoE + reset 5) / freeze (≤0 → 15 block + reset 5) | Mid-game scaling, AoE burst |
| **Data Pipeline** (new) | `pipelineData` counter resets to 0 at start of turn. +1 per card played. Cards scale with current pipelineData | Early-game combo engine — play more cards = hit harder this turn |
| **Inference** (new) | React to enemy intents. Conditional bonuses: extra block vs attackers, extra damage vs buffers, counter-play | Early-game reactive defense — strong from turn 1 because enemies always telegraph |

### Why This Fixes Early Game

| Turn | Old AI Engineer | New AI Engineer |
|---|---|---|
| Turn 1 | 13-16 dmg, 4-8 block | ~22 dmg, 6-10 block |
| Why | model_init = 5 dmg, needs multi-turn ramp | neural_spike = 8-10 dmg (scales with cards played THIS turn) |
| Defense | Cold needs temp ≤3 (2+ cards setup) | threat_scan gives 6-10 block immediately based on enemy intent |
| Feel | "I'm setting up..." | "I'm already doing things" |

---

## New Starter Deck (10 cards)

| Card | Cost | Type | Effect | Archetype |
|---|---|---|---|---|
| `neural_spike` ×4 | 1 | Attack | Deal 6 damage. +1 per pipelineData. | Pipeline |
| `threat_scan` ×2 | 1 | Skill | Gain 6 block. If enemy intends attack: +4 block. | Inference |
| `data_feed` ×1 | 0 | Skill | +2 pipelineData. Draw 1. | Pipeline |
| `hot_read` ×1 | 0 | Attack | Deal 4 damage. Heat +1. | Temperature |
| `cold_scan` ×1 | 1 | Skill | Gain 5 block. Cool -1. If Cold (≤3): +3 block. | Temperature |
| `coffee_break` ×1 | 1 | Skill | Reduce 6 stress. | Neutral |

**Turn 1 example (3 energy):**
- data_feed (free) → 2 pipelineData, draw 1
- hot_read (free) → 4 dmg, heat to 6
- neural_spike (1 cost) → 6+3 = 9 dmg (pipelineData=3 after playing 3 cards)
- neural_spike (1 cost) → 6+4 = 10 dmg (pipelineData=4)
- threat_scan (1 cost) → 6 block (+4 if enemy attacking = 10)
- **Total: ~23 damage + 6-10 block + temp at 6**

---

## Full Card Pool

### Data Pipeline — Commons (6)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `neural_spike` | Neural Spike | 1 | Attack | Deal 6 dmg. +1 per pipelineData. | Deal 8 dmg. +1 per pipelineData. |
| `data_feed` | Data Feed | 0 | Skill | +2 pipelineData. Draw 1. | +3 pipelineData. Draw 1. |
| `batch_process` | Batch Process | 1 | Attack | Deal 4 dmg to ALL. +1 per pipelineData. | Deal 6 dmg to ALL. +1 per pipelineData. |
| `data_cache` | Data Cache | 1 | Skill | Gain 5 block. +1 per pipelineData. | Gain 7 block. +1 per pipelineData. |
| `parallel_query` | Parallel Query | 0 | Skill | +3 pipelineData. | +4 pipelineData. |
| `feature_extract` | Feature Extract | 1 | Attack | Deal 8 dmg. If pipelineData ≥ 4: draw 1. | Deal 10 dmg. If pipelineData ≥ 3: draw 1. |

### Data Pipeline — Rares (5)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `deep_pipeline` | Deep Pipeline | 1 | Skill | +4 pipelineData. Draw 1. Gain 4 block. | +5 pipelineData. Draw 1. Gain 6 block. |
| `data_explosion` | Data Explosion | 2 | Attack | Deal 3 dmg per pipelineData to target. | Deal 4 dmg per pipelineData. |
| `etl_overload` | ETL Overload | 1 | Attack | Deal 5 dmg to ALL. +2 per pipelineData. | Deal 7 dmg to ALL. +2 per pipelineData. |
| `streaming_ingest` | Streaming Ingest | 0 | Skill | +2 pipelineData. Next card this turn costs 0. | +3 pipelineData. Next card costs 0. |
| `map_reduce` | Map Reduce | 2 | Skill | Double current pipelineData. Draw 2. | Double pipelineData. Draw 3. |

### Data Pipeline — Epics (4)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `petabyte_crunch` | Petabyte Crunch | 2 | Attack | Deal 4 dmg per pipelineData to ALL. | Deal 5 dmg per pipelineData to ALL. |
| `real_time_stream` | Real-Time Stream | 1 | Power | End of turn: retain 3 pipelineData. | Retain 4 pipelineData. |
| `data_singularity` | Data Singularity | 3 | Attack | Deal 6 dmg per pipelineData. Exhaust. | Deal 7 dmg per pipelineData. Cost 2. Exhaust. |
| `pipeline_overflow` | Pipeline Overflow | 1 | Skill | If pipelineData ≥ 6: gain 1 energy, draw 2, +3 data. | Threshold ≥ 5. |

### Data Pipeline — Legendaries (2)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `infinite_dataset` | Infinite Dataset | 2 | Power | Each card played generates +1 extra pipelineData (2 per card instead of 1). | Cost 1. |
| `the_data_lake` | The Data Lake | 1 | Attack | Deal pipelineData × pipelineData dmg. Exhaust. | Deal pipelineData × pipelineData + 5 dmg. Exhaust. |

---

### Inference — Commons (6)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `threat_scan` | Threat Scan | 1 | Skill | Gain 6 block. If enemy intends attack: +4 block. | Gain 8 block. If attack: +5. |
| `hot_read` | Hot Read | 0 | Attack | Deal 4 dmg. Heat +1. | Deal 6 dmg. Heat +1. |
| `predict_aggro` | Predict Aggro | 1 | Attack | Deal 7 dmg. If enemy intends attack: +5 dmg. | Deal 9 dmg. If attack: +6. |
| `anomaly_detect` | Anomaly Detect | 1 | Skill | Gain 5 block. If enemy intends buff: +2 Confidence. | Gain 7 block. If buff: +3 Confidence. |
| `preemptive_patch` | Preemptive Patch | 0 | Skill | If enemy intends debuff: gain 4 block + cleanse 1 debuff. | Gain 6 block + cleanse 1. |
| `counter_model` | Counter Model | 1 | Attack | Deal dmg equal to enemy's intended attack dmg. | Deal 150% of intended. |

### Inference — Rares (5)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `full_forecast` | Full Forecast | 1 | Skill | Gain block = total incoming attack dmg from all enemies. | Also draw 1. |
| `exploit_window` | Exploit Window | 1 | Attack | Deal 10 dmg. If enemy intends buff/heal: +10 dmg. | Deal 12. If buff/heal: +12. |
| `predictive_shield` | Predictive Shield | 2 | Skill | Gain 8 block. If enemy intends attack: also gain 2 Dodge. | Gain 10 block. +3 Dodge. |
| `bayesian_trap` | Bayesian Trap | 1 | Attack | Deal 8 dmg. If attack: apply 2 Vulnerable. If defend: apply 2 Weak. | Deal 10. Apply 3 each. |
| `read_the_room` | Read the Room | 0 | Skill | Draw 2. If any enemy intends attack: gain 4 block. | Draw 2. Gain 6 block. |

### Inference — Epics (3)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `perfect_prediction` | Perfect Prediction | 2 | Skill | Gain block = total incoming dmg. Gain 1 Confidence. | Also gain 1 Resilience. |
| `adversarial_attack` | Adversarial Attack | 2 | Attack | Deal 15 dmg. If you "counter" intent (block vs attack, attack vs buff): +15. | Deal 18. Counter: +18. |
| `early_warning` | Early Warning | 1 | Power | Turn start: if any enemy intends attack, gain 3 block. If buff, gain 1 Confidence. | Gain 5 block / 2 Confidence. |

### Inference — Legendaries (2)

| ID | Name | Cost | Type | Effect | Upgraded |
|---|---|---|---|---|---|
| `omniscience` | Omniscience | 3 | Power | Turn start: gain block = all incoming attack dmg + deal 5 dmg to all attacking enemies. | Cost 2. |
| `black_swan_event` | Black Swan Event | 1 | Attack | Deal 30 dmg. If enemy did NOT intend attack: deal 0 instead. Exhaust. | Deal 40. Exhaust. |

---

### Temperature — Cards KEPT (no changes)

All existing temperature cards stay as-is:
- **Commons (6):** hot_take, freeze_frame, thermal_shock, liquid_cooling, ambient_temperature, superconductor
- **Rares (4):** thermal_runaway, absolute_zero, phase_transition, combustion_engine
- **Epics (3):** supernova, permafrost, heat_death
- **Legendaries (3):** absolute_temperature, the_heat_equation, (1 more TBD from existing)

### Curse (1, kept)
- `model_deprecation` — kept as-is

---

## Card Count Summary

| Archetype | Common | Rare | Epic | Legendary | Total |
|---|---|---|---|---|---|
| Data Pipeline | 6 | 5 | 4 | 2 | 17 |
| Inference | 6 | 5 | 3 | 2 | 16 |
| Temperature (kept) | 6 | 4 | 3 | 3 | 16 |
| Starters | 5 | — | — | — | 5 |
| Curse | — | — | — | — | 1 |
| **Total** | **23** | **14** | **10** | **7** | **~55** |

---

## Relics — AI Engineer (reworked)

### Remove
- `learning_rate` — referenced training_loop, no longer relevant
- `token_faucet` — referenced tokens, no longer relevant

### Keep (temperature relics)
- `feedback_loop` (rare) — Overflow grants 2 energy
- `overfit` (epic) — Hot threshold ≥5, temp floor 3
- `hallucination_engine` (epic) — Overflow +10 dmg, reset to 0

### Modify
- `gpu_cluster` (starter) — Was: "Draw 1 extra card/turn. Training_loop +1 bonus." → New: "Draw 1 extra card per turn. Start each turn with 1 pipelineData."
- `context_limit` (epic) — Was: "Start with 2 Conf + 2 Res + 8 stress." → Keep as-is (generic enough)

### Add New
- `feature_store` (common) — "Start each combat with 3 pipelineData on turn 1. Pre-computed features."
- `sensor_array` (rare) — "Inference conditional bonuses grant +3 extra block/damage. More sensors."
- `context_window` (epic) — "Retain 4 pipelineData between turns. Start combat with 5 stress."

### Final AI Engineer Relic List (1 starter + 6 class)

| ID | Name | Rarity | Effect | Flavor |
|---|---|---|---|---|
| `gpu_cluster` | GPU Cluster | Starter | Draw 1 extra card/turn. Start each turn with 1 pipelineData. | "$47,000/month in cloud compute." |
| `feature_store` | Feature Store | Common | Start each combat with 3 pipelineData on first turn. | "Pre-computed features. Someone planned ahead." |
| `feedback_loop` | Feedback Loop | Rare | On temperature overflow: gain 2 energy. | "Push hard enough to reap." |
| `sensor_array` | Sensor Array | Rare | Inference "if enemy intends X" bonuses grant +3 extra. | "More sensors. More certainty. More paranoia." |
| `overfit` | Overfit | Epic | Hot bonus at temp ≥5 (not 7). Temp floor 3. | "Works on training data. Ships to prod anyway." |
| `hallucination_engine` | Hallucination Engine | Epic | Overflow +10 dmg. Overflow resets temp to 0 not 5. | "Not a bug. A feature hallucination." |
| `context_window` | Context Window | Epic | Retain 4 pipelineData between turns. +5 stress/combat. | "8k context. 200k anxiety." |

---

## Consumables — AI Engineer (reworked)

### Keep
- `temperature_spike` (rare, class: ai_engineer) — Set temp to 9

### Add
- `preloaded_dataset` (rare, class: ai_engineer) — Set pipelineData to 8. "Someone left the training data in memory."

---

## Frontend Relic Fix (Bleed gap)

### Replace
- `dependency_hell` (epic) → `memory_leak_relic` (epic) — "Bleed applied by your cards is increased by 2. Start combat with 5 stress."

### Add Consumable
- `exploit_kit` (rare, class: frontend) — "Apply 6 Bleed to target. Frontend only."

---

## Architect Engineer Slots — AI Jr / AI Sr (reworked)

These currently reference tokens. Must update to use pipelineData.

### AI Jr (architect common card)
- **Old passive:** (draw: 1) — **KEEP** (doesn't reference tokens)
- **Old evoke:** Deal 10 + tokens×2 to random — **CHANGE TO:** Deal 10 + pipelineData×2 to random
- **Old harmonic:** tokens×3 AoE — **CHANGE TO:** pipelineData×3 AoE
- **Update card descriptions** in architectCards.ts

### AI Sr (architect rare card)
- **Old passive:** +2 tokens/turn — **CHANGE TO:** +2 pipelineData/turn
- **Old evoke:** tokens×3 AoE, tokens→0 — **CHANGE TO:** pipelineData×3 AoE
- **Old harmonic:** tokens×5 AoE — **CHANGE TO:** pipelineData×5 AoE
- **Update card descriptions** in architectCards.ts

### Engineer definitions (engineers.ts)
- `ai_jr`: passiveEffect: { draw: 1 } (keep), evokeEffect: { damage: 10, damageScalesWithPipeline: 2 }, harmonicEffect: { damageAllScalesWithPipeline: 3 }
- `ai_sr`: passiveEffect: { generatePipelineData: 2 }, evokeEffect: { damageAllScalesWithPipeline: 3 }, harmonicEffect: { damageAllScalesWithPipeline: 5 }

---

## BattleState Changes

### Remove
- `tokens: number`
- `cardPlayCounts: Record<string, number>`

### Add
- `pipelineData: number` — starts at 0 (or relic bonus), resets at start of each turn (minus retained amount), +1 per card played

### Keep
- `temperature: number` — no changes

---

## New CardEffect Fields

### Remove from CardEffect
- `generateTokens`, `doubleTokens`, `damagePerToken`, `blockPerToken`, `damageAllPerToken`
- `damagePerTimesPlayed`, `damageAllPerTimesPlayed`, `blockPerTimesPlayed`, `bonusAtSecondPlay`

### Add to CardEffect — Pipeline
- `gainPipelineData?: number` — gain N extra pipelineData (on top of the +1 per card played)
- `damagePerPipeline?: number` — deal N damage per pipelineData
- `damageAllPerPipeline?: number` — deal N damage per pipelineData to ALL enemies
- `blockPerPipeline?: number` — gain N block per pipelineData
- `doublePipelineData?: boolean` — double current pipelineData
- `pipelineThresholdDraw?: number` — if pipelineData ≥ N: draw 1 card
- `pipelineThresholdEnergy?: number` — if pipelineData ≥ N: gain 1 energy
- `pipelineThresholdGainData?: number` — if pipelineData ≥ N: gain 3 more pipelineData
- `nextCardCostZero?: boolean` — (already exists? check) next card this turn costs 0
- `retainPipelineData?: number` — (power) retain N pipelineData between turns
- `extraPipelinePerCard?: number` — (power) each card played grants +N extra pipelineData

### Add to CardEffect — Inference
- `blockIfEnemyAttacks?: number` — if target enemy intends attack: gain N extra block
- `damageIfEnemyAttacks?: number` — if target enemy intends attack: deal N extra damage
- `damageIfEnemyBuffs?: number` — if target enemy intends buff/heal: deal N extra damage
- `blockIfEnemyDebuffs?: number` — if target enemy intends debuff: gain N block + cleanse 1
- `confidenceIfEnemyBuffs?: number` — if target enemy intends buff: gain N confidence
- `damageEqualsEnemyAttack?: boolean` — deal damage equal to enemy's intended attack damage
- `damageEqualsEnemyAttackMultiplier?: number` — multiply the above (for upgraded counter_model)
- `blockEqualsIncomingDamage?: boolean` — gain block equal to total incoming attack damage from all enemies
- `dodgeIfEnemyAttacks?: number` — if enemy intends attack: gain N dodge
- `vulnerableIfEnemyAttacks?: number` — if enemy attacks: apply N vulnerable
- `weakIfEnemyDefends?: number` — if enemy defends: apply N weak
- `drawIfAnyEnemyAttacks?: number` — draw N if any enemy intends attack (for read_the_room)
- `blockIfAnyEnemyAttacks?: number` — gain N block if any enemy intends attack
- `inferenceStartOfTurnBlock?: number` — (power) turn start: if any enemy attacks, gain N block
- `inferenceStartOfTurnConfidence?: number` — (power) turn start: if any enemy buffs, gain N confidence
- `inferenceStartOfTurnDamageAll?: number` — (power) turn start: deal N to all attacking enemies

### Remove from RelicEffect
- `trainingLoopBonus`, `startTokens`, `tokenLossPerTurn`

### Add to RelicEffect
- `startPipelineData?: number` — start first turn of combat with N pipelineData
- `pipelineRetain?: number` — retain N pipelineData between turns
- `inferenceBonus?: number` — inference conditional bonuses grant +N extra
- `pipelinePerTurnStart?: number` — gain N pipelineData at start of each turn (for gpu_cluster)

### Remove from EngineerPassive
- `generateTokens`

### Add to EngineerPassive
- `generatePipelineData?: number` — gain N pipelineData at start of turn

### Remove from EngineerEvoke
- `damageScalesWithTokens`, `damageAllScalesWithTokens`

### Add to EngineerEvoke
- `damageScalesWithPipeline?: number` — deal damage + pipelineData × N to random enemy
- `damageAllScalesWithPipeline?: number` — deal pipelineData × N to all enemies

---

## New Consumable Effect Fields

### Add to ConsumableEffect (in types)
- `setPipelineData?: number` — set pipelineData to N

---

## UI Changes

### HeroCard.tsx
- **Remove** token counter UI (lines 233-246: `battle.tokens` display)
- **Add** pipelineData counter (same location, show when pipelineData > 0)
  - Icon: 📊 or 🔢
  - Color: #60a5fa (blue)
  - Format: "📊 {pipelineData}"

### Keep
- Temperature gauge — no changes

---

## Events — AI Engineer

**No changes needed.** All 6 AI Engineer events (training_grounds, data_lake, hallucination_swamp, compute_furnace, singularity_gate, ethics_tribunal) use generic rewards (random cards, gold, HP, stress, upgrades). None reference token/training_loop mechanics directly.

---

## Files Affected — Complete List

### Must Rewrite
1. `src/data/cards/aiEngineerCards.ts` — Remove all token_economy + training_loop cards, add all Pipeline + Inference cards, keep temperature cards

### Must Modify (significant)
2. `src/types/index.ts` — Remove old CardEffect/RelicEffect/BattleState/EngineerEvoke/EngineerPassive fields, add new ones
3. `src/store/battleActions.ts` — Remove token/training_loop engine logic, add pipelineData tracking (+1 per card), inference intent-checking logic, pipeline scaling logic, turn-start reset/retain logic
4. `src/data/items.ts` — Remove learning_rate + token_faucet relics, modify gpu_cluster, add feature_store + sensor_array + context_window, replace dependency_hell with memory_leak_relic
5. `src/data/engineers.ts` — Update ai_jr and ai_sr to use pipeline instead of tokens
6. `src/data/characters.ts` — Update AI Engineer starter deck IDs
7. `src/components/battle/HeroCard.tsx` — Replace token counter with pipelineData counter

### Must Modify (minor)
8. `src/data/cards/architectCards.ts` — Update ai_jr and ai_sr card descriptions
9. `src/data/consumables.ts` — Add preloaded_dataset consumable, add exploit_kit consumable
10. `src/data/cards/index.ts` — Barrel re-export (should auto-work if aiEngineerCards export name unchanged)

### No Changes Needed
- `src/data/events/aiEngineerEvents.ts` — Generic rewards, no mechanic references
- `src/utils/battleEngine.ts` — Damage/block calc doesn't reference tokens/training_loop
- `src/utils/mapGenerator.ts` — Unrelated
- `src/utils/deckUtils.ts` — Unrelated

---

## Implementation Tasks

### Task 1: Update Types (`src/types/index.ts`)

**Files:** Modify `src/types/index.ts`

**Step 1:** Remove old CardEffect fields:
- `generateTokens`, `doubleTokens`, `damagePerToken`, `blockPerToken`, `damageAllPerToken`
- `damagePerTimesPlayed`, `damageAllPerTimesPlayed`, `blockPerTimesPlayed`, `bonusAtSecondPlay`

**Step 2:** Add new CardEffect fields (Pipeline):
- `gainPipelineData`, `damagePerPipeline`, `damageAllPerPipeline`, `blockPerPipeline`
- `doublePipelineData`, `pipelineThresholdDraw`, `pipelineThresholdEnergy`, `pipelineThresholdGainData`
- `retainPipelineData`, `extraPipelinePerCard`

**Step 3:** Add new CardEffect fields (Inference):
- `blockIfEnemyAttacks`, `damageIfEnemyAttacks`, `damageIfEnemyBuffs`, `blockIfEnemyDebuffs`
- `confidenceIfEnemyBuffs`, `damageEqualsEnemyAttack`, `damageEqualsEnemyAttackMultiplier`
- `blockEqualsIncomingDamage`, `dodgeIfEnemyAttacks`, `vulnerableIfEnemyAttacks`, `weakIfEnemyDefends`
- `blockIfAnyEnemyAttacks`, `inferenceStartOfTurnBlock`, `inferenceStartOfTurnConfidence`, `inferenceStartOfTurnDamageAll`

**Step 4:** Update BattleState — remove `tokens`, `cardPlayCounts`, add `pipelineData: number`

**Step 5:** Update RelicEffect — remove `trainingLoopBonus`, `startTokens`, `tokenLossPerTurn`, add `startPipelineData`, `pipelineRetain`, `inferenceBonus`, `pipelinePerTurnStart`

**Step 6:** Update EngineerPassive — remove `generateTokens`, add `generatePipelineData`

**Step 7:** Update EngineerEvoke — remove `damageScalesWithTokens`, `damageAllScalesWithTokens`, add `damageScalesWithPipeline`, `damageAllScalesWithPipeline`

**Step 8:** Add `setPipelineData?: number` to consumable effect type

**Step 9:** Run `npm run build` to find all type errors (these will guide remaining tasks)

---

### Task 2: Rewrite AI Engineer Cards (`src/data/cards/aiEngineerCards.ts`)

**Files:** Rewrite `src/data/cards/aiEngineerCards.ts`

**Step 1:** Update file header comment to reflect new archetypes (temperature / data_pipeline / inference)

**Step 2:** Replace all 5 starter card definitions with new starters:
- `neural_spike`, `threat_scan`, `data_feed`, `hot_read`, `cold_scan`

**Step 3:** Delete ALL token_economy cards (commons through legendaries — ~15 cards)

**Step 4:** Delete ALL training_loop cards (commons through legendaries — ~18 cards)

**Step 5:** Write all 17 Data Pipeline cards (6 common, 5 rare, 4 epic, 2 legendary) per the card tables above

**Step 6:** Write all 16 Inference cards (6 common, 5 rare, 3 epic, 2 legendary) per the card tables above

**Step 7:** Keep ALL temperature cards untouched (6 common, 4 rare, 3 epic, 3 legendary)

**Step 8:** Keep curse `model_deprecation` untouched

**Step 9:** Verify export name is still `aiEngineerCards` (Record<string, CardDef>)

---

### Task 3: Update Character Starter Deck (`src/data/characters.ts`)

**Files:** Modify `src/data/characters.ts` (lines 67-85)

**Step 1:** Update `starterDeckIds` array to:
```
['neural_spike', 'neural_spike', 'neural_spike', 'neural_spike',
 'threat_scan', 'threat_scan',
 'data_feed', 'hot_read', 'cold_scan',
 'coffee_break']
```

**Step 2:** Keep `starterRelicId: 'gpu_cluster'` (will be updated in Task 5)

---

### Task 4: Update Battle Engine (`src/store/battleActions.ts`)

**Files:** Modify `src/store/battleActions.ts`

This is the largest task. Work through in order:

**Step 1: initBattle** — Remove `tokens` and `cardPlayCounts` initialization. Add `pipelineData: 0` (plus relic `startPipelineData` bonus). Check for `pipelinePerTurnStart` relic to add initial pipeline.

**Step 2: executePlayCard — Remove old tracking:**
- Remove `cardPlayCounts` increment logic (~line 395-398)
- Remove token economy effect block (~lines 1092-1120): `generateTokens`, `doubleTokens`, `damagePerToken`, `blockPerToken`, `damageAllPerToken`
- Remove training loop effect block (~lines 1123-1149): `damagePerTimesPlayed`, `blockPerTimesPlayed`, `bonusAtSecondPlay`

**Step 3: executePlayCard — Add pipelineData tracking:**
- After a card is played, increment `pipelineData` by 1 (+ `extraPipelinePerCard` from any active power)
- If card has `gainPipelineData`: add that amount too

**Step 4: executePlayCard — Add Pipeline effect resolution:**
- `damagePerPipeline`: deal N × current pipelineData to target
- `damageAllPerPipeline`: deal N × current pipelineData to ALL enemies
- `blockPerPipeline`: gain N × current pipelineData block
- `doublePipelineData`: double current pipelineData
- `pipelineThresholdDraw`: if pipelineData ≥ N, draw 1
- `pipelineThresholdEnergy`: if pipelineData ≥ N, gain 1 energy
- `pipelineThresholdGainData`: if pipelineData ≥ N, gain 3 more pipelineData
- `retainPipelineData`: set a retained amount (handled at turn end)
- `extraPipelinePerCard`: set a persistent bonus (power card)

**Step 5: executePlayCard — Add Inference effect resolution:**
- Need a helper: `getEnemyIntentType(enemy)` that returns 'attack' | 'defend' | 'buff' | 'debuff' | 'other' based on `enemy.currentMove.type`
  - attack types: 'attack', 'attack_defend', 'stress_attack', 'dual_attack'
  - defend types: 'defend'
  - buff types: 'buff', 'buff_allies', 'heal_allies'
  - debuff types: 'debuff', 'exhaust', 'corrupt', 'discard', 'energy_drain'
- `blockIfEnemyAttacks`: if target enemy intends attack type, gain N extra block (+ inferenceBonus relic)
- `damageIfEnemyAttacks`: if target enemy intends attack type, deal N extra damage (+ inferenceBonus)
- `damageIfEnemyBuffs`: if target enemy intends buff type, deal N extra damage (+ inferenceBonus)
- `blockIfEnemyDebuffs`: if target enemy intends debuff type, gain N block + cleanse 1 debuff
- `confidenceIfEnemyBuffs`: if target enemy intends buff type, gain N confidence
- `damageEqualsEnemyAttack`: deal damage = enemy's intended attack value (from `enemy.currentMove.damage` or 0)
- `damageEqualsEnemyAttackMultiplier`: multiply the above by N (for upgraded counter_model at 1.5×)
- `blockEqualsIncomingDamage`: gain block = sum of all enemies' intended attack damage
- `dodgeIfEnemyAttacks`: if enemy attacks, gain N dodge
- `vulnerableIfEnemyAttacks`: if enemy attacks, apply N vulnerable to target
- `weakIfEnemyDefends`: if enemy defends, apply N weak to target
- `blockIfAnyEnemyAttacks`: if ANY enemy intends attack, gain N block
- For self-target cards: check against all enemies or primary target as appropriate

**Step 6: startNewTurn — Pipeline reset:**
- Calculate retained amount: base 0 + `retainPipelineData` power + `pipelineRetain` relic
- Set `pipelineData = min(current, retainedAmount)` (i.e., reset to 0 unless retained)
- Add `pipelinePerTurnStart` relic bonus

**Step 7: startNewTurn — Inference power cards:**
- `inferenceStartOfTurnBlock`: if any enemy intends attack, gain N block
- `inferenceStartOfTurnConfidence`: if any enemy intends buff, gain N confidence
- `inferenceStartOfTurnDamageAll`: deal N to all attacking enemies

**Step 8: startNewTurn — Remove old token logic:**
- Remove `tokenLossPerTurn` relic logic
- Remove `engineerTokenGain` from engineer slot passives
- Remove `tokens` from new battle state construction
- Remove `cardPlayCounts` from new battle state construction

**Step 9: Engineer slot passives — Update token → pipeline:**
- Replace all `if (p.generateTokens) engineerTokenGain += p.generateTokens` with pipeline equivalent
- `if (p.generatePipelineData) pipelineGain += p.generatePipelineData`
- Same for resonance/harmonic effects

**Step 10: applyEvokeEffect — Update token scaling → pipeline scaling:**
- Replace `damageScalesWithTokens` with `damageScalesWithPipeline`: deal (damage + pipelineData × N)
- Replace `damageAllScalesWithTokens` with `damageAllScalesWithPipeline`: deal pipelineData × N to all
- Remove token→0 reset after spending (pipelineData persists within the turn)

---

### Task 5: Update Relics (`src/data/items.ts`)

**Files:** Modify `src/data/items.ts`

**Step 1:** Update `gpu_cluster` starter relic:
- New description: "Draw 1 extra card per turn. Start each turn with 1 pipelineData. $47,000/month in cloud compute."
- New effect: `{ extraDraw: 1, pipelinePerTurnStart: 1 }`

**Step 2:** Remove `learning_rate` relic (training_loop)

**Step 3:** Remove `token_faucet` relic (tokens)

**Step 4:** Add `feature_store` common relic:
- "Start each combat with 3 pipelineData on first turn. Pre-computed features. Someone planned ahead."
- Effect: `{ startPipelineData: 3 }`

**Step 5:** Add `sensor_array` rare relic:
- "Inference conditional bonuses grant +3 extra block/damage. More sensors. More certainty. More paranoia."
- Effect: `{ inferenceBonus: 3 }`

**Step 6:** Keep `feedback_loop`, `overfit`, `hallucination_engine`, `context_limit` as-is (temperature relics / generic)

**Step 7:** Modify `context_limit` → `context_window`:
- New id: `context_window`, new name: "Context Window"
- "Retain 4 pipelineData between turns. Start combat with 5 stress. 8k context. 200k anxiety."
- Effect: `{ pipelineRetain: 4, startBattleStress: 5 }`

**Step 8:** Update section comment: "AI ENGINEER CLASS RELICS (temperature / data_pipeline / inference)"

**Step 9: Frontend fix** — Replace `dependency_hell` with `memory_leak_relic`:
- "Bleed applied by your cards is increased by 2. Start combat with 5 stress. The heap grows."
- Effect: `{ bleedBonus: 2, startBattleStress: 5 }`

---

### Task 6: Update Engineer Definitions (`src/data/engineers.ts`)

**Files:** Modify `src/data/engineers.ts`

**Step 1:** Update `ai_jr`:
```ts
ai_jr: {
  id: 'ai_jr', name: 'AI Jr', icon: '🤖',
  passiveEffect: { draw: 1 },
  evokeEffect: { damage: 10, damageScalesWithPipeline: 2 },
  harmonicEffect: { damageAllScalesWithPipeline: 3 },
},
```

**Step 2:** Update `ai_sr`:
```ts
ai_sr: {
  id: 'ai_sr', name: 'AI Sr', icon: '🧠',
  passiveEffect: { generatePipelineData: 2 },
  evokeEffect: { damageAllScalesWithPipeline: 3 },
  harmonicEffect: { damageAllScalesWithPipeline: 5 },
},
```

---

### Task 7: Update Architect Card Descriptions (`src/data/cards/architectCards.ts`)

**Files:** Modify `src/data/cards/architectCards.ts`

**Step 1:** Update `ai_jr` card description and upgradedDescription:
- "Slot an AI Jr. Passive: draw 1/turn. Evoke: Deal 10 + data×2 to random enemy."
- Upgraded: "Slot an AI Jr. Passive: draw 1/turn. Evoke: Deal 10 + data×2 to random. Cost 1."

**Step 2:** Update `ai_sr` card description and upgradedDescription:
- "Slot an AI Sr. Passive: +2 pipelineData/turn. Evoke: Deal data×3 to all enemies."
- Upgraded: "Slot an AI Sr. Passive: +2 data/turn. Evoke: data×3 AoE. Cost 2."

---

### Task 8: Update Consumables (`src/data/consumables.ts`)

**Files:** Modify `src/data/consumables.ts`

**Step 1:** Add `preloaded_dataset` consumable:
```ts
preloaded_dataset: {
  id: 'preloaded_dataset', name: 'Preloaded Dataset', icon: '📊',
  description: 'Set pipelineData to 8. AI Engineer only. Someone left the training data in memory.',
  rarity: 'rare', target: 'self', class: 'ai_engineer',
  effect: { setPipelineData: 8 },
},
```

**Step 2:** Add `exploit_kit` consumable (Frontend bleed):
```ts
exploit_kit: {
  id: 'exploit_kit', name: 'Exploit Kit', icon: '🩸',
  description: 'Apply 6 Bleed to target enemy. Frontend only. Zero-day. Their day.',
  rarity: 'rare', target: 'enemy', class: 'frontend',
  effect: { applyToTarget: { bleed: 6 } },
},
```

---

### Task 9: Update HeroCard UI (`src/components/battle/HeroCard.tsx`)

**Files:** Modify `src/components/battle/HeroCard.tsx`

**Step 1:** Replace token counter (lines 233-246) with pipelineData counter:
```tsx
{charId === 'ai_engineer' && (battle.pipelineData ?? 0) > 0 && (
  <div style={{
    background: 'rgba(96,165,250,0.15)',
    border: '1px solid rgba(96,165,250,0.5)',
    borderRadius: 4,
    padding: compact ? '1px 4px' : '2px 6px',
    fontSize: compact ? 7 : 12,
    color: '#60a5fa',
    fontWeight: 'bold',
  }}>
    📊 {battle.pipelineData}
  </div>
)}
```

---

### Task 10: Wire Consumable Effect (`src/store/gameStore.ts`)

**Files:** Modify `src/store/gameStore.ts`

**Step 1:** Find the consumable use handler (search for `setTemperature` to find the pattern)

**Step 2:** Add `setPipelineData` effect handling:
```ts
if (effect.setPipelineData !== undefined && state.battle) {
  state.battle.pipelineData = effect.setPipelineData;
}
```

**Step 3:** Wire `bleedBonus` relic effect in battleActions.ts (for Frontend memory_leak_relic):
- When applying bleed from a card, check player items for `bleedBonus` and add that amount

---

### Task 11: Build & Fix Type Errors

**Step 1:** Run `npm run build`

**Step 2:** Fix any remaining type errors from removed fields

**Step 3:** Run `npm run lint`

**Step 4:** Fix any lint errors

---

### Task 12: Playtest Verification

**Step 1:** Run `npm run dev`

**Step 2:** Start a new game as AI Engineer

**Step 3:** Verify:
- Starter deck has correct 10 cards
- pipelineData counter appears and increments per card played
- pipelineData resets at turn start
- neural_spike damage scales with pipelineData
- threat_scan gives bonus block when enemy intends attack
- Temperature gauge still works (hot_read heats, cold_scan cools)
- GPU Cluster relic draws extra card + gives 1 pipeline per turn start

**Step 4:** Check Architect with AI Jr/AI Sr slots — verify pipeline scaling works

**Step 5:** Verify no console errors

---

### Task 13: Version Bump & Cleanup

**Step 1:** Bump `GAME_VERSION` in `src/store/gameStore.ts` (minor version bump, e.g. 1.23.0)

**Step 2:** Update file header comment in aiEngineerCards.ts

**Step 3:** Update CLAUDE.md memory notes if needed

---

## Dependency Order

```
Task 1 (types) → Task 2 (cards) + Task 3 (characters) + Task 5 (relics) + Task 6 (engineers) + Task 7 (architect cards) + Task 8 (consumables) + Task 9 (UI)
                  ↓ all of the above feed into ↓
                  Task 4 (battle engine — biggest task, needs types + cards defined first)
                  Task 10 (consumable wiring)
                  ↓
                  Task 11 (build & fix)
                  ↓
                  Task 12 (playtest)
                  ↓
                  Task 13 (version bump)
```

Tasks 2, 3, 5, 6, 7, 8, 9 can all be done in parallel after Task 1.
Task 4 and 10 should be done after all data tasks.
Tasks 11-13 are sequential at the end.
