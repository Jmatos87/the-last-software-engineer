import type { CardDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// AI ENGINEER — "The Model Trainer"
// Archetypes: temperature | token_economy | training_loop
//
// Temperature: push temp 0–10; Hot(≥7)→bonus dmg; Cold(≤3)→bonus block;
//              Overflow(10)→12 AoE + reset 5; Freeze(0)→15 block + reset 5
// Token Economy: accumulate tokens across turns; cash out for scaled dmg/block
// Training Loop: cards scale with how many times they've been played this combat
// ═══════════════════════════════════════════════════════════════

export const aiEngineerCards: Record<string, CardDef> = {

  // ── Starters ──────────────────────────────────────────────────────────────

  model_init: {
    id: 'model_init', name: 'Model Init', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Deal 4 damage +1 per play this combat (1st: 5, 2nd: 6...). Weights: random. Hope: eternal.',
    effects: { damage: 4, damagePerTimesPlayed: 1 },
    upgradedEffects: { damage: 6, damagePerTimesPlayed: 2 },
    upgradedDescription: 'Deal 6 damage +2 per play this combat.',
    icon: '🧠',
  },

  cold_inference: {
    id: 'cold_inference', name: 'Cold Inference', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 1°. Gain 4 block. If Cold (≤3°): gain 4 more. Temperature: deterministic. Outputs: predictable.',
    effects: { coolDown: 1, block: 4, blockIfCold: 4 },
    upgradedEffects: { coolDown: 1, block: 6, blockIfCold: 6 },
    upgradedDescription: 'Cool 1°. Gain 6 block. If Cold (≤3°): gain 6 more.',
    icon: '🧊',
  },

  token_budget: {
    id: 'token_budget', name: 'Token Budget', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 3 tokens. Draw 1 card. Every inference costs something. Budget accordingly.',
    effects: { generateTokens: 3, draw: 1 },
    upgradedEffects: { generateTokens: 5, draw: 1 },
    upgradedDescription: 'Generate 5 tokens. Draw 1 card.',
    icon: '🪙',
  },

  epoch_start: {
    id: 'epoch_start', name: 'Epoch Start', type: 'skill', target: 'self', cost: 0, rarity: 'starter',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain 4 block. 2nd play this combat: draw 1 card. Epoch 1 of many. Loss: still catastrophic.',
    effects: { block: 4, bonusAtSecondPlay: { draw: 1 } },
    upgradedEffects: { block: 6, bonusAtSecondPlay: { draw: 1 } },
    upgradedDescription: 'Gain 6 block. 2nd play: draw 1 card.',
    icon: '🔄',
  },

  calibration: {
    id: 'calibration', name: 'Calibration', type: 'attack', target: 'enemy', cost: 0, rarity: 'starter',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 1°. Deal 4 damage. If Hot (≥7°): deal 3 more. Calibrating the loss function. Gently.',
    effects: { heatUp: 1, damage: 4, damageIfHot: 3 },
    upgradedEffects: { heatUp: 1, damage: 6, damageIfHot: 4 },
    upgradedDescription: 'Heat 1°. Deal 6 damage. If Hot (≥7°): deal 4 more.',
    icon: '🎛️',
  },

  // ── Temperature Commons ───────────────────────────────────────────────────

  hot_take: {
    id: 'hot_take', name: 'Hot Take', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 2°. Deal 7 damage. If Hot (≥7°): deal 5 more. "My model is objectively better." —you, confidently.',
    effects: { heatUp: 2, damage: 7, damageIfHot: 5 },
    upgradedEffects: { heatUp: 2, damage: 9, damageIfHot: 6 },
    upgradedDescription: 'Heat 2°. Deal 9 damage. If Hot (≥7°): deal 6 more.',
    icon: '🔥',
  },

  freeze_frame: {
    id: 'freeze_frame', name: 'Freeze Frame', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 2°. Gain 8 block. If Cold (≤3°): gain 6 more. Stop. Evaluate the gradient. Don\'t move.',
    effects: { coolDown: 2, block: 8, blockIfCold: 6 },
    upgradedEffects: { coolDown: 2, block: 10, blockIfCold: 8 },
    upgradedDescription: 'Cool 2°. Gain 10 block. If Cold (≤3°): gain 8 more.',
    icon: '❄️',
  },

  thermal_shock: {
    id: 'thermal_shock', name: 'Thermal Shock', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 3°. Deal 8 damage. Apply 1 Vulnerable. From cold to hot to broken in one forward pass.',
    effects: { heatUp: 3, damage: 8, applyToTarget: { vulnerable: 1 } },
    upgradedEffects: { heatUp: 3, damage: 10, applyToTarget: { vulnerable: 1 } },
    upgradedDescription: 'Heat 3°. Deal 10 damage. Apply 1 Vulnerable.',
    icon: '⚡',
  },

  liquid_cooling: {
    id: 'liquid_cooling', name: 'Liquid Cooling', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 2°. Gain 6 block. Reduce 5 Stress. The GPU needed it more. You needed it more.',
    effects: { coolDown: 2, block: 6, copium: 5 },
    upgradedEffects: { coolDown: 2, block: 8, copium: 7 },
    upgradedDescription: 'Cool 2°. Gain 8 block. Reduce 7 Stress.',
    icon: '💧',
  },

  ambient_temperature: {
    id: 'ambient_temperature', name: 'Ambient Temperature', type: 'power', target: 'self', cost: 2, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 1°. Gain 1 Resilience (+1 block & stress heal/stack). The environment shapes the model. Permanently.',
    effects: { heatUp: 1, applyToSelf: { resilience: 1 } },
    upgradedEffects: { heatUp: 1, applyToSelf: { resilience: 1 } },
    upgradedDescription: 'Cost 1. Heat 1°. Gain 1 Resilience (+1 block & stress heal/stack).',
    upgradedCost: 1,
    icon: '🌡️',
  },

  superconductor: {
    id: 'superconductor', name: 'Superconductor', type: 'attack', target: 'enemy', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 1°. Deal 5 damage. If Hot (≥7°): deal 4 more. Zero resistance. Maximum throughput. Still loses the demo.',
    effects: { heatUp: 1, damage: 5, damageIfHot: 4 },
    upgradedEffects: { heatUp: 1, damage: 7, damageIfHot: 5 },
    upgradedDescription: 'Heat 1°. Deal 7 damage. If Hot (≥7°): deal 5 more.',
    icon: '⚗️',
  },

  // ── Token Economy Commons ─────────────────────────────────────────────────

  api_call: {
    id: 'api_call', name: 'API Call', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 4 tokens. Draw 1 card. GET /inference?tokens=4. Status 200. (For now.)',
    effects: { generateTokens: 4, draw: 1 },
    upgradedEffects: { generateTokens: 5, draw: 1 },
    upgradedDescription: 'Cost 0. Generate 5 tokens. Draw 1 card.',
    upgradedCost: 0,
    icon: '📡',
  },

  token_flush: {
    id: 'token_flush', name: 'Token Flush', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Spend all tokens. Deal damage equal to tokens. Don\'t let the budget go to waste.',
    effects: { damagePerToken: true },
    upgradedEffects: { damagePerToken: true },
    upgradedDescription: 'Cost 0. Spend all tokens. Deal damage equal to tokens.',
    upgradedCost: 0,
    icon: '💸',
  },

  compute_budget: {
    id: 'compute_budget', name: 'Compute Budget', type: 'skill', target: 'self', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 3 tokens. "This month\'s compute budget: $40,000." You start generating tokens.',
    effects: { generateTokens: 3 },
    upgradedEffects: { generateTokens: 4 },
    upgradedDescription: 'Generate 4 tokens.',
    icon: '💻',
  },

  rate_limit_hit: {
    id: 'rate_limit_hit', name: 'Rate Limit Hit', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 3 tokens. Gain 5 block. Hit the limit. Generate a defensive posture. Standard procedure.',
    effects: { generateTokens: 3, block: 5 },
    upgradedEffects: { generateTokens: 4, block: 7 },
    upgradedDescription: 'Generate 4 tokens. Gain 7 block.',
    icon: '🚫',
  },

  bulk_inference: {
    id: 'bulk_inference', name: 'Bulk Inference', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'common',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Spend all tokens. Deal damage equal to half your tokens to ALL enemies. Batch processing. Cost: everything.',
    effects: { damageAllPerToken: true },
    upgradedEffects: { damageAllPerToken: true },
    upgradedDescription: 'Cost 1. Spend all tokens. Deal half-tokens damage to ALL enemies.',
    upgradedCost: 1,
    icon: '📊',
  },

  token_interest: {
    id: 'token_interest', name: 'Token Interest', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Double your tokens. Compound growth. Just like your burn rate.',
    effects: { doubleTokens: true },
    upgradedEffects: { doubleTokens: true },
    upgradedDescription: 'Cost 0. Double your tokens.',
    upgradedCost: 0,
    icon: '📈',
  },

  // ── Training Loop Commons ─────────────────────────────────────────────────

  gradient_step: {
    id: 'gradient_step', name: 'Gradient Step', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Deal 6 damage +1 per play this combat (1st: 7, 2nd: 8...). Each iteration improves the loss.',
    effects: { damage: 6, damagePerTimesPlayed: 1 },
    upgradedEffects: { damage: 8, damagePerTimesPlayed: 2 },
    upgradedDescription: 'Deal 8 damage +2 per play this combat.',
    icon: '📉',
  },

  memory_replay: {
    id: 'memory_replay', name: 'Memory Replay', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain 4 block +1 per play this combat (1st: 5, 2nd: 6...). Replay buffer: full. Experiences: bad.',
    effects: { block: 4, blockPerTimesPlayed: 1 },
    upgradedEffects: { block: 6, blockPerTimesPlayed: 2 },
    upgradedDescription: 'Gain 6 block +2 per play this combat.',
    icon: '💾',
  },

  second_epoch: {
    id: 'second_epoch', name: 'Second Epoch', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Deal 8 damage. 2nd play this combat: draw 1 card. The second pass always finds what the first missed.',
    effects: { damage: 8, bonusAtSecondPlay: { draw: 1 } },
    upgradedEffects: { damage: 10, bonusAtSecondPlay: { draw: 2 } },
    upgradedDescription: 'Deal 10 damage. 2nd play: draw 2 cards.',
    icon: '🔁',
  },

  iterative_defense: {
    id: 'iterative_defense', name: 'Iterative Defense', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain 7 block. 2nd play this combat: gain 4 more. Iterate to defend. The wall grows each cycle.',
    effects: { block: 7, bonusAtSecondPlay: { block: 4 } },
    upgradedEffects: { block: 9, bonusAtSecondPlay: { block: 6 } },
    upgradedDescription: 'Gain 9 block. 2nd play: gain 6 more.',
    icon: '🔒',
  },

  pattern_recognition: {
    id: 'pattern_recognition', name: 'Pattern Recognition', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Draw 2 cards. 2nd play this combat: draw 1 more. You\'ve seen this pattern before. In prod. It was bad.',
    effects: { draw: 2, bonusAtSecondPlay: { draw: 1 } },
    upgradedEffects: { draw: 3, bonusAtSecondPlay: { draw: 1 } },
    upgradedDescription: 'Draw 3 cards. 2nd play: draw 1 more.',
    icon: '🔍',
  },

  overfitting_shield: {
    id: 'overfitting_shield', name: 'Overfitting Shield', type: 'skill', target: 'self', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain block equal to times played this combat (1st: 1, 2nd: 2...). The model memorized the defense pattern.',
    effects: { blockPerTimesPlayed: 1 },
    upgradedEffects: { blockPerTimesPlayed: 2 },
    upgradedDescription: 'Gain 2 block per play this combat.',
    icon: '🛡️',
  },

  // ── Temperature Rares ─────────────────────────────────────────────────────

  thermal_runaway: {
    id: 'thermal_runaway', name: 'Thermal Runaway', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 4°. Deal 14 damage. If Hot (≥7°): deal 10 more. The GPU hit 105°C. This is fine. They are not.',
    effects: { heatUp: 4, damage: 14, damageIfHot: 10 },
    upgradedEffects: { heatUp: 4, damage: 18, damageIfHot: 14 },
    upgradedDescription: 'Heat 4°. Deal 18 damage. If Hot (≥7°): deal 14 more.',
    icon: '🌋',
  },

  absolute_zero: {
    id: 'absolute_zero', name: 'Absolute Zero', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 4°. Gain 16 block. If Cold (≤3°): gain 12 more. 0 Kelvin. 0 damage taken. Theoretical. Worth trying.',
    effects: { coolDown: 4, block: 16, blockIfCold: 12 },
    upgradedEffects: { coolDown: 4, block: 20, blockIfCold: 16 },
    upgradedDescription: 'Cool 4°. Gain 20 block. If Cold (≤3°): gain 16 more.',
    icon: '🧊',
  },

  phase_transition: {
    id: 'phase_transition', name: 'Phase Transition', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 3°. Gain 10 block. If Cold (≤3°): gain 8 more. Reduce 8 Stress. Solid → liquid → "I can do this".',
    effects: { coolDown: 3, block: 10, blockIfCold: 8, copium: 8 },
    upgradedEffects: { coolDown: 3, block: 13, blockIfCold: 10, copium: 10 },
    upgradedDescription: 'Cool 3°. Gain 13 block. If Cold (≤3°): gain 10 more. Reduce 10 Stress.',
    icon: '💎',
  },

  combustion_engine: {
    id: 'combustion_engine', name: 'Combustion Engine', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 2°. Gain 2 Confidence (+1 dmg/stack). The model runs hot. The attacks run hotter.',
    effects: { heatUp: 2, applyToSelf: { confidence: 2 } },
    upgradedEffects: { heatUp: 2, applyToSelf: { confidence: 3 } },
    upgradedDescription: 'Cost 1. Heat 2°. Gain 3 Confidence (+1 dmg/stack).',
    upgradedCost: 1,
    icon: '🔧',
  },

  // ── Token Economy Rares ───────────────────────────────────────────────────

  venture_capital: {
    id: 'venture_capital', name: 'Venture Capital', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'token_economy', exhaust: true,
    description: 'Exhaust. Generate 10 tokens. Gain 12 stress. $10M for a pivot you didn\'t understand. Investors do.',
    effects: { generateTokens: 10, addStress: 12 },
    upgradedEffects: { generateTokens: 10, addStress: 8 },
    upgradedDescription: 'Exhaust. Generate 10 tokens. Gain 8 stress.',
    icon: '💰',
  },

  cash_out: {
    id: 'cash_out', name: 'Cash Out', type: 'attack', target: 'enemy', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Spend all tokens. Deal damage = tokens. Apply 2 Vulnerable. Series B: cashing out before the crash.',
    effects: { damagePerToken: true, applyToTarget: { vulnerable: 2 } },
    upgradedEffects: { damagePerToken: true, applyToTarget: { vulnerable: 3 } },
    upgradedDescription: 'Spend all tokens. Deal damage = tokens. Apply 3 Vulnerable.',
    icon: '💵',
  },

  token_sink: {
    id: 'token_sink', name: 'Token Sink', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Spend all tokens. Gain block = tokens. Draw 1 card. Defensive spending. The board approves. Briefly.',
    effects: { blockPerToken: true, draw: 1 },
    upgradedEffects: { blockPerToken: true, draw: 2 },
    upgradedDescription: 'Spend all tokens. Gain block = tokens. Draw 2 cards.',
    icon: '🕳️',
  },

  market_maker: {
    id: 'market_maker', name: 'Market Maker', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 5 tokens. Gain 1 Networking (+1 draw/turn). Making markets. Making tokens. Making enemies.',
    effects: { generateTokens: 5, applyToSelf: { networking: 1 } },
    upgradedEffects: { generateTokens: 8, applyToSelf: { networking: 1 } },
    upgradedDescription: 'Cost 1. Generate 8 tokens. Gain 1 Networking (+1 draw/turn).',
    upgradedCost: 1,
    icon: '📋',
  },

  // ── Training Loop Rares ───────────────────────────────────────────────────

  momentum_build: {
    id: 'momentum_build', name: 'Momentum Build', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Deal 10 damage +2 per play this combat. 2nd play: gain 1 energy. Momentum: built. Enemies: concerned.',
    effects: { damage: 10, damagePerTimesPlayed: 2, bonusAtSecondPlay: { energy: 1 } },
    upgradedEffects: { damage: 14, damagePerTimesPlayed: 3, bonusAtSecondPlay: { energy: 1 } },
    upgradedDescription: 'Deal 14 damage +3 per play. 2nd play: gain 1 energy.',
    icon: '🚀',
  },

  convergence: {
    id: 'convergence', name: 'Convergence', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain block = 2 per play this combat. Draw 1. 2nd play: reduce 8 Stress. The model converges. Slowly. Then all at once.',
    effects: { blockPerTimesPlayed: 2, draw: 1, bonusAtSecondPlay: { copium: 8 } },
    upgradedEffects: { blockPerTimesPlayed: 3, draw: 1, bonusAtSecondPlay: { copium: 10 } },
    upgradedDescription: 'Cost 1. Gain block = 3 per play. Draw 1. 2nd play: reduce 10 Stress.',
    upgradedCost: 1,
    icon: '🎯',
  },

  long_training_run: {
    id: 'long_training_run', name: 'Long Training Run', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain 2 Confidence (+1 dmg/stack). Gain 1 Resilience (+1 block/stack). 72 hours. 12 GPUs. Loss: still not zero.',
    effects: { applyToSelf: { confidence: 2, resilience: 1 } },
    upgradedEffects: { applyToSelf: { confidence: 3, resilience: 2 } },
    upgradedDescription: 'Cost 1. Gain 3 Confidence. Gain 2 Resilience.',
    upgradedCost: 1,
    icon: '⏳',
  },

  early_stopping: {
    id: 'early_stopping', name: 'Early Stopping', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    class: 'ai_engineer', archetype: 'training_loop', exhaust: true,
    description: 'Exhaust. Gain block = 8 × times played this combat (1st play: 8 block). Stop before overfitting to pain.',
    effects: { blockPerTimesPlayed: 8 },
    upgradedEffects: { blockPerTimesPlayed: 12 },
    upgradedDescription: 'Exhaust. Gain block = 12 × times played this combat.',
    icon: '⏹️',
  },

  // ── Temperature Epics ─────────────────────────────────────────────────────

  supernova: {
    id: 'supernova', name: 'Supernova', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 5°. Deal 20 damage. If Hot (≥7°): deal 18 more. (Overflow→12 AoE + reset.) Star formation: complete.',
    effects: { heatUp: 5, damage: 20, damageIfHot: 18 },
    upgradedEffects: { heatUp: 5, damage: 25, damageIfHot: 22 },
    upgradedDescription: 'Heat 5°. Deal 25 damage. If Hot (≥7°): deal 22 more.',
    icon: '💥',
  },

  permafrost: {
    id: 'permafrost', name: 'Permafrost', type: 'skill', target: 'self', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Cool 5°. Gain 22 block. If Cold (≤3°): gain 18 more. (Freeze→15 block + reset.) Now a permanent feature.',
    effects: { coolDown: 5, block: 22, blockIfCold: 18 },
    upgradedEffects: { coolDown: 5, block: 28, blockIfCold: 22 },
    upgradedDescription: 'Cool 5°. Gain 28 block. If Cold (≤3°): gain 22 more.',
    icon: '🏔️',
  },

  heat_death: {
    id: 'heat_death', name: 'Heat Death', type: 'attack', target: 'all_enemies', cost: 3, rarity: 'epic',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 3°. Deal 15 damage to ALL. If Hot (≥7°): deal 10 more to ALL. The universe ends. Enemies first.',
    effects: { heatUp: 3, damageAll: 15, damageAllIfHot: 10 },
    upgradedEffects: { heatUp: 3, damageAll: 20, damageAllIfHot: 14 },
    upgradedDescription: 'Heat 3°. Deal 20 to ALL. If Hot (≥7°): deal 14 more to ALL.',
    icon: '☀️',
  },

  // ── Token Economy Epics ───────────────────────────────────────────────────

  series_a: {
    id: 'series_a', name: 'Series A', type: 'skill', target: 'self', cost: 1, rarity: 'epic',
    class: 'ai_engineer', archetype: 'token_economy', exhaust: true,
    description: 'Exhaust. Double your tokens. Gain 1 energy. $15M for proven product-market fit: your token hoard.',
    effects: { doubleTokens: true, energy: 1 },
    upgradedEffects: { doubleTokens: true, energy: 1 },
    upgradedDescription: 'Cost 0. Exhaust. Double tokens. Gain 1 energy.',
    upgradedCost: 0,
    icon: '📊',
  },

  hostile_takeover: {
    id: 'hostile_takeover', name: 'Hostile Takeover', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 6 tokens. Spend ALL tokens. Deal damage = total tokens. Corporate aggression. Token edition.',
    effects: { generateTokens: 6, damagePerToken: true },
    upgradedEffects: { generateTokens: 8, damagePerToken: true },
    upgradedDescription: 'Cost 1. Generate 8 tokens. Spend ALL. Deal damage = total tokens.',
    upgradedCost: 1,
    icon: '🏢',
  },

  ipo_day: {
    id: 'ipo_day', name: 'IPO Day', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 4 tokens. Spend ALL tokens. Deal half-tokens damage to ALL enemies. Going public. Losses: distributed.',
    effects: { generateTokens: 4, damageAllPerToken: true },
    upgradedEffects: { generateTokens: 6, damageAllPerToken: true },
    upgradedDescription: 'Generate 6 tokens. Spend ALL. Deal half-tokens to ALL.',
    icon: '📉',
  },

  // ── Training Loop Epics ───────────────────────────────────────────────────

  catastrophic_success: {
    id: 'catastrophic_success', name: 'Catastrophic Success', type: 'attack', target: 'enemy', cost: 3, rarity: 'epic',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Deal 18 damage +4 per play this combat. 2nd play: gain 1 energy. It worked. Everyone is confused.',
    effects: { damage: 18, damagePerTimesPlayed: 4, bonusAtSecondPlay: { energy: 1 } },
    upgradedEffects: { damage: 24, damagePerTimesPlayed: 6, bonusAtSecondPlay: { energy: 1 } },
    upgradedDescription: 'Deal 24 damage +6 per play. 2nd play: gain 1 energy.',
    icon: '🎲',
  },

  regularization: {
    id: 'regularization', name: 'Regularization', type: 'skill', target: 'self', cost: 0, rarity: 'epic',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain block = 4 × times played this combat (1st: 4, 2nd: 8, 3rd: 12...). Prevent overfitting to damage.',
    effects: { blockPerTimesPlayed: 4 },
    upgradedEffects: { blockPerTimesPlayed: 6 },
    upgradedDescription: 'Gain block = 6 × times played this combat.',
    icon: '📐',
  },

  neural_plasticity: {
    id: 'neural_plasticity', name: 'Neural Plasticity', type: 'power', target: 'self', cost: 2, rarity: 'epic',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain 3 Confidence (+1 dmg/stack). Gain 1 Networking (+1 draw/turn). The net rewired itself. You didn\'t ask.',
    effects: { applyToSelf: { confidence: 3, networking: 1 } },
    upgradedEffects: { applyToSelf: { confidence: 4, networking: 2 } },
    upgradedDescription: 'Cost 1. Gain 4 Confidence. Gain 2 Networking (+1 draw/turn each).',
    upgradedCost: 1,
    icon: '🌐',
  },

  // ── Temperature Legendaries ───────────────────────────────────────────────

  absolute_temperature: {
    id: 'absolute_temperature', name: 'Absolute Temperature', type: 'power', target: 'self', cost: 3, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Gain 5 Confidence (+1 dmg/stack). Gain 5 Resilience (+1 block/stack). Temperature mastered. Stats: untouchable.',
    effects: { applyToSelf: { confidence: 5, resilience: 5 } },
    upgradedEffects: { applyToSelf: { confidence: 6, resilience: 6 } },
    upgradedDescription: 'Cost 2. Gain 6 Confidence. Gain 6 Resilience.',
    upgradedCost: 2,
    icon: '🌡️',
  },

  the_heat_equation: {
    id: 'the_heat_equation', name: 'The Heat Equation', type: 'attack', target: 'enemy', cost: 2, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'temperature',
    description: 'Heat 5°. Deal 25 damage. If Hot (≥7°): deal 20 more. (Overflow→12 AoE + reset.) ∂T/∂t = solved.',
    effects: { heatUp: 5, damage: 25, damageIfHot: 20 },
    upgradedEffects: { heatUp: 5, damage: 32, damageIfHot: 25 },
    upgradedDescription: 'Heat 5°. Deal 32 damage. If Hot (≥7°): deal 25 more.',
    icon: '🔥',
  },

  // ── Token Economy Legendaries ─────────────────────────────────────────────

  unicorn_round: {
    id: 'unicorn_round', name: 'Unicorn Round', type: 'skill', target: 'self', cost: 2, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Generate 15 tokens. Heal 10 HP. Reduce 20 Stress. $100M Series C. Product: token generation. Revenue: tears.',
    effects: { generateTokens: 15, heal: 10, copium: 20 },
    upgradedEffects: { generateTokens: 20, heal: 14, copium: 25 },
    upgradedDescription: 'Cost 1. Generate 20 tokens. Heal 14 HP. Reduce 25 Stress.',
    upgradedCost: 1,
    icon: '🦄',
  },

  token_burn: {
    id: 'token_burn', name: 'Token Burn', type: 'attack', target: 'enemy', cost: 1, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'token_economy',
    description: 'Spend all tokens. Deal damage = tokens. Apply 2 Vulnerable to ALL enemies. Burn rate: maximized.',
    effects: { damagePerToken: true, applyToAll: { vulnerable: 2 } },
    upgradedEffects: { damagePerToken: true, applyToAll: { vulnerable: 3 } },
    upgradedDescription: 'Spend all tokens. Deal damage = tokens. Apply 3 Vulnerable to ALL.',
    icon: '🔥',
  },

  // ── Training Loop Legendaries ─────────────────────────────────────────────

  perfect_overfit: {
    id: 'perfect_overfit', name: 'Perfect Overfit', type: 'power', target: 'self', cost: 3, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Gain 4 Confidence, 4 Resilience, 2 Networking. Memorized the meta. Generalized to crushing it. No coincidence.',
    effects: { applyToSelf: { confidence: 4, resilience: 4, networking: 2 } },
    upgradedEffects: { applyToSelf: { confidence: 5, resilience: 5, networking: 3 } },
    upgradedDescription: 'Cost 2. Gain 5 Confidence, 5 Resilience, 3 Networking.',
    upgradedCost: 2,
    icon: '🤖',
  },

  infinite_loop: {
    id: 'infinite_loop', name: 'Infinite Loop', type: 'attack', target: 'enemy', cost: 1, rarity: 'legendary',
    class: 'ai_engineer', archetype: 'training_loop',
    description: 'Deal 6 damage +5 per play this combat. 2nd play: gain 1 energy. The loop never converges. Neither do you.',
    effects: { damage: 6, damagePerTimesPlayed: 5, bonusAtSecondPlay: { energy: 1 } },
    upgradedEffects: { damage: 8, damagePerTimesPlayed: 7, bonusAtSecondPlay: { energy: 1 } },
    upgradedDescription: 'Deal 8 damage +7 per play. 2nd play: gain 1 energy.',
    icon: '♾️',
  },

  // ── AI Engineer Curse ──────────────────────────────────────────────────────

  model_deprecation: {
    id: 'model_deprecation', name: 'Model Deprecation', type: 'curse', target: 'self', cost: 1, rarity: 'curse',
    class: 'ai_engineer',
    description: 'Unplayable. Add 6 stress when drawn. The model you built your startup on was deprecated. Migration path: none.',
    effects: {},
    icon: '⚰️',
  },
};
