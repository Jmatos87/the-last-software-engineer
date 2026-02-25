import type { CardDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// AI ENGINEER — "The Model Trainer"
// Archetypes: temperature | data_pipeline | inference
//
// Temperature: push temp 0–10; Hot(≥7)→bonus dmg; Cold(≤3)→bonus block;
//              Overflow(10)→12 AoE + reset 5; Freeze(0)→15 block + reset 5
// Data Pipeline: accumulate pipelineData per turn (+1 per card played);
//                scale damage/block off pipelineData; resets each turn
// Inference: react to enemy intents — gain block/damage/debuffs
//            conditionally based on what enemies plan to do
// ═══════════════════════════════════════════════════════════════

export const aiEngineerCards: Record<string, CardDef> = {

  // ── Starters ──────────────────────────────────────────────────────────────

  neural_spike: {
    id: 'neural_spike', name: 'Neural Spike', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Deal 6 damage. +1 per pipelineData. A single synapse fires — and the data flowing through your pipeline sharpens the hit.',
    effects: { damage: 6, damagePerPipeline: 1 },
    upgradedEffects: { damage: 8, damagePerPipeline: 1 },
    upgradedDescription: 'Deal 8 damage. +1 per pipelineData. A thicker axon, a harder spike.',
    icon: '⚡',
  },

  threat_scan: {
    id: 'threat_scan', name: 'Threat Scan', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Gain 6 block. If enemy intends attack: +4 block. Your model predicted violence. Smart model.',
    effects: { block: 6, blockIfEnemyAttacks: 4 },
    upgradedEffects: { block: 8, blockIfEnemyAttacks: 5 },
    upgradedDescription: 'Gain 8 block. If enemy intends attack: +5 block. Finer-tuned threat detection.',
    icon: '🔍',
  },

  data_feed: {
    id: 'data_feed', name: 'Data Feed', type: 'skill', target: 'self', cost: 0, rarity: 'starter',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Gain 2 pipelineData. Draw 1. Streaming real-time data into the model. Garbage in, garbage out — unless you curate.',
    effects: { gainPipelineData: 2, draw: 1 },
    upgradedEffects: { gainPipelineData: 3, draw: 1 },
    upgradedDescription: 'Gain 3 pipelineData. Draw 1. A richer data feed. The pipeline hums.',
    icon: '📊',
  },

  hot_read: {
    id: 'hot_read', name: 'Hot Read', type: 'attack', target: 'enemy', cost: 0, rarity: 'starter',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Deal 4 damage. Heat +1. A quick cache hit while the forge warms up.',
    effects: { damage: 4, heatUp: 1 },
    upgradedEffects: { damage: 6, heatUp: 1 },
    upgradedDescription: 'Deal 6 damage. Heat +1. A hotter read. The cache practically glows.',
    icon: '🔥',
  },

  cold_scan: {
    id: 'cold_scan', name: 'Cold Scan', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Gain 5 block. Cool -1. If Cold (≤3): +3 block. A chilly diagnostic sweep. The frost reveals structural weaknesses.',
    effects: { block: 5, coolDown: 1, blockIfCold: 3 },
    upgradedEffects: { block: 7, coolDown: 1, blockIfCold: 4 },
    upgradedDescription: 'Gain 7 block. Cool -1. If Cold: +4 block. Sub-zero analysis yields deeper insights.',
    icon: '❄️',
  },

  cold_inference: {
    id: 'cold_inference', name: 'Cold Inference', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 1°. Gain 4 block. If Cold (≤3°): gain 4 more. The frost settles. In the cold, all things become certain.',
    effects: { coolDown: 1, block: 4, blockIfCold: 4 },
    upgradedEffects: { coolDown: 1, block: 6, blockIfCold: 6 },
    upgradedDescription: 'Cool 1°. Gain 6 block. If Cold (≤3°): gain 6 more. Deeper frost, deeper certainty.',
    icon: '🧊',
  },

  calibration: {
    id: 'calibration', name: 'Calibration', type: 'attack', target: 'enemy', cost: 0, rarity: 'starter',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 1°. Deal 4 damage. If Hot (≥7°): deal 3 more. A gentle stoking of the forge. The flames will remember.',
    effects: { heatUp: 1, damage: 4, damageIfHot: 3 },
    upgradedEffects: { heatUp: 1, damage: 6, damageIfHot: 4 },
    upgradedDescription: 'Heat 1°. Deal 6 damage. If Hot (≥7°): deal 4 more. The forge answers to a practiced hand.',
    icon: '🎛️',
  },

  // ── Temperature Commons ───────────────────────────────────────────────────

  hot_take: {
    id: 'hot_take', name: 'Hot Take', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 2°. Deal 7 damage. If Hot (≥7°): deal 5 more. You speak flame into the furnace. It roars back in agreement.',
    effects: { heatUp: 2, damage: 7, damageIfHot: 5 },
    upgradedEffects: { heatUp: 2, damage: 9, damageIfHot: 6 },
    upgradedDescription: 'Heat 2°. Deal 9 damage. If Hot (≥7°): deal 6 more. The furnace speaks louder now.',
    icon: '🔥',
  },

  freeze_frame: {
    id: 'freeze_frame', name: 'Freeze Frame', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 2°. Gain 8 block. If Cold (≤3°): gain 6 more. Time halts. The ice holds all motion captive.',
    effects: { coolDown: 2, block: 8, blockIfCold: 6 },
    upgradedEffects: { coolDown: 2, block: 10, blockIfCold: 8 },
    upgradedDescription: 'Cool 2°. Gain 10 block. If Cold (≤3°): gain 8 more. A glacier forms at your command.',
    icon: '❄️',
  },

  thermal_shock: {
    id: 'thermal_shock', name: 'Thermal Shock', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 3°. Deal 8 damage. Apply 1 Vulnerable. From permafrost to inferno in a single incantation. The target shatters.',
    effects: { heatUp: 3, damage: 8, applyToTarget: { vulnerable: 1 } },
    upgradedEffects: { heatUp: 3, damage: 10, applyToTarget: { vulnerable: 1 } },
    upgradedDescription: 'Heat 3°. Deal 10 damage. Apply 1 Vulnerable. A more violent transmutation.',
    icon: '⚡',
  },

  liquid_cooling: {
    id: 'liquid_cooling', name: 'Liquid Cooling', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 2°. Gain 6 block. Reduce 5 Stress. Enchanted waters quench the forge and calm the conjurer\'s mind.',
    effects: { coolDown: 2, block: 6, copium: 5 },
    upgradedEffects: { coolDown: 2, block: 8, copium: 7 },
    upgradedDescription: 'Cool 2°. Gain 8 block. Reduce 7 Stress. Purer waters, deeper relief.',
    icon: '💧',
  },

  ambient_temperature: {
    id: 'ambient_temperature', name: 'Ambient Temperature', type: 'power', target: 'self', cost: 2, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 1°. Gain 1 Resilience (+1 block & stress heal/stack). The environment attunes to your will. Permanently.',
    effects: { heatUp: 1, applyToSelf: { resilience: 1 } },
    upgradedEffects: { heatUp: 1, applyToSelf: { resilience: 1 } },
    upgradedDescription: 'Cost 1. Heat 1°. Gain 1 Resilience (+1 block & stress heal/stack). A cheaper binding of elemental favor.',
    upgradedCost: 1,
    icon: '🌡️',
  },

  superconductor: {
    id: 'superconductor', name: 'Superconductor', type: 'attack', target: 'enemy', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 1°. Deal 5 damage. If Hot (≥7°): deal 4 more. Zero arcane resistance. Pure elemental throughput.',
    effects: { heatUp: 1, damage: 5, damageIfHot: 4 },
    upgradedEffects: { heatUp: 1, damage: 7, damageIfHot: 5 },
    upgradedDescription: 'Heat 1°. Deal 7 damage. If Hot (≥7°): deal 5 more. The conduit hums with refined power.',
    icon: '⚗️',
  },

  // ── Data Pipeline Commons ───────────────────────────────────────────────────

  batch_process: {
    id: 'batch_process', name: 'Batch Process', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Deal 4 damage to ALL. +1 per pipelineData. Run the whole batch at once. Efficiency is brutality.',
    effects: { damage: 4, damageAllPerPipeline: 1 },
    upgradedEffects: { damage: 6, damageAllPerPipeline: 1 },
    upgradedDescription: 'Deal 6 damage to ALL. +1 per pipelineData. Optimized batch — same pipeline, harder output.',
    icon: '🔄',
  },

  data_cache: {
    id: 'data_cache', name: 'Data Cache', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Gain 5 block. +1 per pipelineData. The more data you process, the thicker the cache layer grows.',
    effects: { block: 5, blockPerPipeline: 1 },
    upgradedEffects: { block: 7, blockPerPipeline: 1 },
    upgradedDescription: 'Gain 7 block. +1 per pipelineData. A well-warmed cache. Practically a fortress.',
    icon: '💾',
  },

  parallel_query: {
    id: 'parallel_query', name: 'Parallel Query', type: 'skill', target: 'self', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Gain 3 pipelineData. Fan-out across every available thread. The data pours in.',
    effects: { gainPipelineData: 3 },
    upgradedEffects: { gainPipelineData: 4 },
    upgradedDescription: 'Gain 4 pipelineData. More threads, more data. Horizontal scaling at its finest.',
    icon: '⚙️',
  },

  feature_extract: {
    id: 'feature_extract', name: 'Feature Extract', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Deal 8 damage. If pipelineData ≥ 4: draw 1. Enough data and the features extract themselves.',
    effects: { damage: 8, pipelineThresholdDraw: 4 },
    upgradedEffects: { damage: 10, pipelineThresholdDraw: 3 },
    upgradedDescription: 'Deal 10 damage. If pipelineData ≥ 3: draw 1. Lower threshold — the model learns faster.',
    icon: '🧲',
  },

  // ── Inference Commons ───────────────────────────────────────────────────────

  predict_aggro: {
    id: 'predict_aggro', name: 'Predict Aggro', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Deal 7 damage. If enemy intends attack: +5 damage. You saw the swing coming. Your counter was already in motion.',
    effects: { damage: 7, damageIfEnemyAttacks: 5 },
    upgradedEffects: { damage: 9, damageIfEnemyAttacks: 6 },
    upgradedDescription: 'Deal 9 damage. If attack: +6. Sharper prediction, harder counter.',
    icon: '🎯',
  },

  anomaly_detect: {
    id: 'anomaly_detect', name: 'Anomaly Detect', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Gain 5 block. If enemy intends buff: +2 Confidence. Their arrogance is your training data.',
    effects: { block: 5, confidenceIfEnemyBuffs: 2 },
    upgradedEffects: { block: 7, confidenceIfEnemyBuffs: 3 },
    upgradedDescription: 'Gain 7 block. If buff: +3 Confidence. Better anomaly detection, better exploitation.',
    icon: '📡',
  },

  preemptive_patch: {
    id: 'preemptive_patch', name: 'Preemptive Patch', type: 'skill', target: 'self', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'inference',
    description: 'If enemy intends debuff: gain 4 block, cleanse 1 debuff. You patched the vulnerability before the exploit shipped.',
    effects: { blockIfEnemyDebuffs: 4 },
    upgradedEffects: { blockIfEnemyDebuffs: 6 },
    upgradedDescription: 'If debuff: gain 6 block + cleanse 1. A more thorough security audit.',
    icon: '🛡️',
  },

  counter_model: {
    id: 'counter_model', name: 'Counter Model', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Deal damage equal to enemy\'s intended attack damage. Mirror learning: your model perfectly replicates their aggression.',
    effects: { damageEqualsEnemyAttack: true },
    upgradedEffects: { damageEqualsEnemyAttack: true, damageEqualsEnemyAttackMultiplier: 1.5 },
    upgradedDescription: 'Deal 150% of intended attack damage. Your counter-model overfit to their strategy. Beautiful.',
    icon: '⚔️',
  },

  // ── Temperature Rares ─────────────────────────────────────────────────────

  thermal_runaway: {
    id: 'thermal_runaway', name: 'Thermal Runaway', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 4°. Deal 14 damage. If Hot (≥7°): deal 10 more. The forge cracks open. Molten fury pours forth unchecked.',
    effects: { heatUp: 4, damage: 14, damageIfHot: 10 },
    upgradedEffects: { heatUp: 4, damage: 18, damageIfHot: 14 },
    upgradedDescription: 'Heat 4°. Deal 18 damage. If Hot (≥7°): deal 14 more. The forge is lost. Only the inferno remains.',
    icon: '🌋',
  },

  absolute_zero: {
    id: 'absolute_zero', name: 'Absolute Zero', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 4°. Gain 16 block. If Cold (≤3°): gain 12 more. At the nadir of all heat, nothing may pass the frozen ward.',
    effects: { coolDown: 4, block: 16, blockIfCold: 12 },
    upgradedEffects: { coolDown: 4, block: 20, blockIfCold: 16 },
    upgradedDescription: 'Cool 4°. Gain 20 block. If Cold (≤3°): gain 16 more. The absolute ward — impenetrable ice.',
    icon: '🧊',
  },

  phase_transition: {
    id: 'phase_transition', name: 'Phase Transition', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 3°. Gain 10 block. If Cold (≤3°): gain 8 more. Reduce 8 Stress. Matter shifts form — solid, liquid, serene.',
    effects: { coolDown: 3, block: 10, blockIfCold: 8, copium: 8 },
    upgradedEffects: { coolDown: 3, block: 13, blockIfCold: 10, copium: 10 },
    upgradedDescription: 'Cool 3°. Gain 13 block. If Cold (≤3°): gain 10 more. Reduce 10 Stress. A deeper transmutation of state.',
    icon: '💎',
  },

  combustion_engine: {
    id: 'combustion_engine', name: 'Combustion Engine', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 2°. Gain 2 Confidence (+1 dmg/stack). The furnace within ignites. Every strike burns hotter hereafter.',
    effects: { heatUp: 2, applyToSelf: { confidence: 2 } },
    upgradedEffects: { heatUp: 2, applyToSelf: { confidence: 3 } },
    upgradedDescription: 'Cost 1. Heat 2°. Gain 3 Confidence (+1 dmg/stack). A master-forged engine of destruction.',
    upgradedCost: 1,
    icon: '🔧',
  },

  // ── Data Pipeline Rares ─────────────────────────────────────────────────────

  deep_pipeline: {
    id: 'deep_pipeline', name: 'Deep Pipeline', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Gain 4 pipelineData. Draw 1. Gain 4 block. Seven layers of transformations, each one adding signal. Your data has never been cleaner.',
    effects: { gainPipelineData: 4, draw: 1, block: 4 },
    upgradedEffects: { gainPipelineData: 5, draw: 1, block: 6 },
    upgradedDescription: 'Gain 5 pipelineData. Draw 1. Gain 6 block. A deeper pipeline. Production-grade.',
    icon: '🔬',
  },

  data_explosion: {
    id: 'data_explosion', name: 'Data Explosion', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Deal 3 damage per pipelineData. All that accumulated data detonates at once. The schema was not prepared.',
    effects: { damagePerPipeline: 3 },
    upgradedEffects: { damagePerPipeline: 4 },
    upgradedDescription: 'Deal 4 damage per pipelineData. A bigger explosion. The DBA weeps.',
    icon: '💥',
  },

  etl_overload: {
    id: 'etl_overload', name: 'ETL Overload', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Deal 5 damage to ALL. +2 per pipelineData. Extract, Transform, Liquidate. The pipeline overflows onto everyone.',
    effects: { damage: 5, damageAllPerPipeline: 2 },
    upgradedEffects: { damage: 7, damageAllPerPipeline: 2 },
    upgradedDescription: 'Deal 7 damage to ALL. +2 per pipelineData. Even more collateral spillage.',
    icon: '🌊',
  },

  streaming_ingest: {
    id: 'streaming_ingest', name: 'Streaming Ingest', type: 'skill', target: 'self', cost: 0, rarity: 'rare',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Gain 2 pipelineData. Next card this turn costs 0. Real-time ingestion — zero latency, zero cost.',
    effects: { gainPipelineData: 2, nextCardCostZero: true },
    upgradedEffects: { gainPipelineData: 3, nextCardCostZero: true },
    upgradedDescription: 'Gain 3 pipelineData. Next card costs 0. A wider firehose of free data.',
    icon: '📡',
  },

  map_reduce: {
    id: 'map_reduce', name: 'Map Reduce', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Double current pipelineData. Draw 2. Map it, reduce it, profit. Google made billions off this trick.',
    effects: { doublePipelineData: true, draw: 2 },
    upgradedEffects: { doublePipelineData: true, draw: 3 },
    upgradedDescription: 'Double pipelineData. Draw 3. An even greedier reduce step.',
    icon: '🗺️',
  },

  // ── Inference Rares ─────────────────────────────────────────────────────────

  full_forecast: {
    id: 'full_forecast', name: 'Full Forecast', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Gain block equal to total incoming attack damage from all enemies. Your model forecasted every blow. You brace accordingly.',
    effects: { blockEqualsIncomingDamage: true },
    upgradedEffects: { blockEqualsIncomingDamage: true, draw: 1 },
    upgradedDescription: 'Block = all incoming damage. Draw 1. A forecast so precise it generates its own documentation.',
    icon: '🌤️',
  },

  exploit_window: {
    id: 'exploit_window', name: 'Exploit Window', type: 'attack', target: 'enemy', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Deal 10 damage. If enemy intends buff/heal: +10. They dropped their guard to flex. Classic vulnerability.',
    effects: { damage: 10, damageIfEnemyBuffs: 10 },
    upgradedEffects: { damage: 12, damageIfEnemyBuffs: 12 },
    upgradedDescription: 'Deal 12. If buff/heal: +12. A wider exploit window. Zero-day energy.',
    icon: '🪟',
  },

  predictive_shield: {
    id: 'predictive_shield', name: 'Predictive Shield', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Gain 8 block. If enemy intends attack: gain 2 Dodge. Your shield manifests before the threat. Precognition or paranoia — same result.',
    effects: { block: 8, dodgeIfEnemyAttacks: 2 },
    upgradedEffects: { block: 10, dodgeIfEnemyAttacks: 3 },
    upgradedDescription: 'Gain 10 block. +3 Dodge if attack. An even more paranoid — er, prescient — shield.',
    icon: '🔮',
  },

  bayesian_trap: {
    id: 'bayesian_trap', name: 'Bayesian Trap', type: 'attack', target: 'enemy', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Deal 8 damage. If attack: 2 Vulnerable. If defend: 2 Weak. Update your priors. Then update their face.',
    effects: { damage: 8, vulnerableIfEnemyAttacks: 2, weakIfEnemyDefends: 2 },
    upgradedEffects: { damage: 10, vulnerableIfEnemyAttacks: 3, weakIfEnemyDefends: 3 },
    upgradedDescription: 'Deal 10. Apply 3 each. Stronger posterior. Theirs, specifically.',
    icon: '🪤',
  },

  read_the_room: {
    id: 'read_the_room', name: 'Read the Room', type: 'skill', target: 'self', cost: 0, rarity: 'rare',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Draw 2. If any enemy intends attack: gain 4 block. Emotional intelligence is just inference with worse documentation.',
    effects: { draw: 2, blockIfAnyEnemyAttacks: 4 },
    upgradedEffects: { draw: 2, blockIfAnyEnemyAttacks: 6 },
    upgradedDescription: 'Draw 2. If any enemy attacks: gain 6 block. You read the room so hard it blocked.',
    icon: '👁️',
  },

  // ── Temperature Epics ─────────────────────────────────────────────────────

  supernova: {
    id: 'supernova', name: 'Supernova', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 5°. Deal 20 damage. If Hot (≥7°): deal 18 more. (Overflow→12 AoE + reset.) A star is born and dies in your palm.',
    effects: { heatUp: 5, damage: 20, damageIfHot: 18 },
    upgradedEffects: { heatUp: 5, damage: 25, damageIfHot: 22 },
    upgradedDescription: 'Heat 5°. Deal 25 damage. If Hot (≥7°): deal 22 more. The dying star burns brighter.',
    icon: '💥',
  },

  permafrost: {
    id: 'permafrost', name: 'Permafrost', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 5°. Gain 22 block. If Cold (≤3°): gain 18 more. (Freeze→15 block + reset.) Ancient ice, eternal and unyielding.',
    effects: { coolDown: 5, block: 22, blockIfCold: 18 },
    upgradedEffects: { coolDown: 5, block: 28, blockIfCold: 22 },
    upgradedDescription: 'Cool 5°. Gain 28 block. If Cold (≤3°): gain 22 more. Glacial wards of primordial frost.',
    icon: '🏔️',
  },

  heat_death: {
    id: 'heat_death', name: 'Heat Death', type: 'attack', target: 'all_enemies', cost: 3, rarity: 'epic',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 3°. Deal 15 damage to ALL. If Hot (≥7°): deal 10 more to ALL. Entropy claims all. Your foes simply arrive first.',
    effects: { heatUp: 3, damageAll: 15, damageAllIfHot: 10 },
    upgradedEffects: { heatUp: 3, damageAll: 20, damageAllIfHot: 14 },
    upgradedDescription: 'Heat 3°. Deal 20 to ALL. If Hot (≥7°): deal 14 more to ALL. A grander apocalypse.',
    icon: '☀️',
  },

  // ── Data Pipeline Epics ─────────────────────────────────────────────────────

  petabyte_crunch: {
    id: 'petabyte_crunch', name: 'Petabyte Crunch', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Deal 4 damage per pipelineData to ALL enemies. Petabytes of data compressed into pure destructive force. Your cloud bill is catastrophic.',
    effects: { damageAllPerPipeline: 4 },
    upgradedEffects: { damageAllPerPipeline: 5 },
    upgradedDescription: 'Deal 5 damage per pipelineData to ALL. Exabyte territory. The CFO has been notified.',
    icon: '🏗️',
  },

  real_time_stream: {
    id: 'real_time_stream', name: 'Real-Time Stream', type: 'power', target: 'self', cost: 1, rarity: 'epic',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'At end of turn, retain 3 pipelineData. Your data stream never sleeps. Neither does your Kafka cluster.',
    effects: { retainPipelineData: 3 },
    upgradedEffects: { retainPipelineData: 4 },
    upgradedDescription: 'Retain 4 pipelineData. A wider stream. The backpressure is someone else\'s problem.',
    icon: '📺',
  },

  data_singularity: {
    id: 'data_singularity', name: 'Data Singularity', type: 'attack', target: 'enemy', cost: 3, rarity: 'epic',
    class: 'ai_engineer', archetype: 'data_pipeline', exhaust: true,
    description: 'Deal 6 damage per pipelineData. Exhaust. All data collapses into a single point of infinite density. Then it hits someone.',
    effects: { damagePerPipeline: 6 },
    upgradedEffects: { damagePerPipeline: 7 },
    upgradedDescription: 'Deal 7 per pipelineData. Cost 2. Exhaust. A cheaper singularity. Still just as singular.',
    upgradedCost: 2,
    icon: '🌑',
  },

  pipeline_overflow: {
    id: 'pipeline_overflow', name: 'Pipeline Overflow', type: 'skill', target: 'self', cost: 1, rarity: 'epic',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Draw 2. If pipelineData ≥ 6: gain 1 energy, +3 pipelineData. The pipeline overflows. Somebody forgot the rate limiter again.',
    effects: { draw: 2, pipelineThresholdEnergy: 6, pipelineThresholdGainData: 6 },
    upgradedEffects: { draw: 2, pipelineThresholdEnergy: 5, pipelineThresholdGainData: 5 },
    upgradedDescription: 'Draw 2. Threshold ≥ 5. Lower threshold, easier overflow. As intended.',
    icon: '🚿',
  },

  // ── Inference Epics ─────────────────────────────────────────────────────────

  perfect_prediction: {
    id: 'perfect_prediction', name: 'Perfect Prediction', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Gain block equal to total incoming damage. Gain 1 Confidence. Your model achieved 100% accuracy. On the test set, anyway.',
    effects: { blockEqualsIncomingDamage: true, applyToSelf: { confidence: 1 } },
    upgradedEffects: { blockEqualsIncomingDamage: true, applyToSelf: { confidence: 1, resilience: 1 } },
    upgradedDescription: 'Block = incoming. +1 Confidence, +1 Resilience. Perfect prediction AND perfect generalization.',
    icon: '🎱',
  },

  adversarial_attack: {
    id: 'adversarial_attack', name: 'Adversarial Attack', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Deal 15 damage. If enemy intends buff: +15. One carefully crafted pixel, and their entire worldview collapses.',
    effects: { damage: 15, damageIfEnemyBuffs: 15 },
    upgradedEffects: { damage: 18, damageIfEnemyBuffs: 18 },
    upgradedDescription: 'Deal 18. If buff: +18. A more adversarial adversarial attack.',
    icon: '🗡️',
  },

  early_warning: {
    id: 'early_warning', name: 'Early Warning', type: 'power', target: 'self', cost: 1, rarity: 'epic',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Start of turn: if any enemy attacks, gain 3 block. If any buffs, gain 1 Confidence. Your inference engine runs 24/7.',
    effects: { inferenceStartOfTurnBlock: 3, inferenceStartOfTurnConfidence: 1 },
    upgradedEffects: { inferenceStartOfTurnBlock: 5, inferenceStartOfTurnConfidence: 2 },
    upgradedDescription: 'Gain 5 block / 2 Confidence. A more aggressive early warning system.',
    icon: '📡',
  },

  // ── Temperature Legendaries ───────────────────────────────────────────────

  absolute_temperature: {
    id: 'absolute_temperature', name: 'Absolute Temperature', type: 'power', target: 'self', cost: 3, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Gain 5 Confidence (+1 dmg/stack). Gain 5 Resilience (+1 block/stack). Fire and ice bow before the master elementalist.',
    effects: { applyToSelf: { confidence: 5, resilience: 5 } },
    upgradedEffects: { applyToSelf: { confidence: 6, resilience: 6 } },
    upgradedDescription: 'Cost 2. Gain 6 Confidence. Gain 6 Resilience. Elemental sovereignty attained.',
    upgradedCost: 2,
    icon: '🌡️',
  },

  the_heat_equation: {
    id: 'the_heat_equation', name: 'The Heat Equation', type: 'attack', target: 'enemy', cost: 2, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 5°. Deal 25 damage. If Hot (≥7°): deal 20 more. (Overflow→12 AoE + reset.) The forbidden equation — flame given law.',
    effects: { heatUp: 5, damage: 25, damageIfHot: 20 },
    upgradedEffects: { heatUp: 5, damage: 32, damageIfHot: 25 },
    upgradedDescription: 'Heat 5°. Deal 32 damage. If Hot (≥7°): deal 25 more. The equation perfected. Creation weeps.',
    icon: '🔥',
  },

  // ── Data Pipeline Legendaries ───────────────────────────────────────────────

  infinite_dataset: {
    id: 'infinite_dataset', name: 'Infinite Dataset', type: 'power', target: 'self', cost: 2, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'data_pipeline',
    description: 'Each card played generates +1 extra pipelineData (2 per card instead of 1). Infinite data. The scaling laws were right all along.',
    effects: { extraPipelinePerCard: 1 },
    upgradedEffects: { extraPipelinePerCard: 1 },
    upgradedDescription: 'Cost 1. Each card generates +1 extra pipelineData. Cheaper access to infinite data. VCs love this.',
    upgradedCost: 1,
    icon: '♾️',
  },

  the_data_lake: {
    id: 'the_data_lake', name: 'The Data Lake', type: 'attack', target: 'enemy', cost: 1, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'data_pipeline', exhaust: true,
    description: 'Deal 5 damage per pipelineData. Exhaust. An ocean of unstructured data crashes down. Nobody told it where the schema was.',
    effects: { damagePerPipeline: 5 },
    upgradedEffects: { damagePerPipeline: 6 },
    upgradedDescription: 'Deal 6 per pipelineData. Exhaust. A deeper lake. Still no schema. Still devastating.',
    icon: '🌐',
  },

  // ── Inference Legendaries ───────────────────────────────────────────────────

  omniscience: {
    id: 'omniscience', name: 'Omniscience', type: 'power', target: 'self', cost: 3, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'inference',
    description: 'Turn start: gain 10 block if any enemy attacks. Deal 5 to all attacking enemies. You see everything. Everything.',
    effects: { inferenceStartOfTurnBlock: 10, inferenceStartOfTurnDamageAll: 5 },
    upgradedEffects: { inferenceStartOfTurnBlock: 10, inferenceStartOfTurnDamageAll: 5 },
    upgradedDescription: 'Cost 2. Turn start: gain 10 block, deal 5 to attackers. Cheaper omniscience. Still omniscient.',
    upgradedCost: 2,
    icon: '👁️‍🗨️',
  },

  black_swan_event: {
    id: 'black_swan_event', name: 'Black Swan Event', type: 'attack', target: 'enemy', cost: 1, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'inference', exhaust: true,
    description: 'If enemy intends attack: deal 30 damage. Otherwise deal 0. Exhaust. The model said this couldn\'t happen. The model was wrong.',
    effects: { damageIfEnemyAttacks: 30 },
    upgradedEffects: { damageIfEnemyAttacks: 40 },
    upgradedDescription: 'If attacking: deal 40. Exhaust. A blacker swan. A wronger model.',
    icon: '🦢',
  },

  // ── AI Engineer Curse ──────────────────────────────────────────────────────

  model_deprecation: {
    id: 'model_deprecation', name: 'Model Deprecation', type: 'curse', target: 'self', cost: 1, rarity: 'curse',
    class: 'ai_engineer',
    description: 'Unplayable. Add 6 stress when drawn. Your summoned familiar has been banished from the arcane registry. No recall spell exists.',
    effects: {},
    icon: '⚰️',
  },
};
