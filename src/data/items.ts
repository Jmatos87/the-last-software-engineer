import type { ItemDef, CardClass } from '../types';

export const items: ItemDef[] = [
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
    description: 'First Engineer card each combat costs 0. Dried out. Still works.',
    rarity: 'starter', class: 'architect', isStarter: true,
    effect: { firstEngineerCardFree: true },
  },
  {
    id: 'gpu_cluster', name: 'GPU Cluster', icon: '🔧',
    description: 'Draw 1 extra card per turn. Start each turn with 1 pipelineData. $47,000/month in cloud compute.',
    rarity: 'starter', class: 'ai_engineer', isStarter: true,
    effect: { extraDraw: 1, pipelinePerTurnStart: 1 },
  },

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
    id: 'memory_leak_relic', name: 'Memory Leak', icon: '💧',
    description: 'Bleed applied by your cards is increased by 2. Start combat with 5 stress. The heap grows. You pretend not to notice.',
    rarity: 'epic', class: 'frontend',
    effect: { bleedBonus: 2, startBattleStress: 5 },
  },
  {
    id: 'css_custom_props', name: 'CSS Custom Properties', icon: '🎨',
    description: 'Block from skills is increased by 50%. Start combat with 1 Confidence. var(--invincibility: conditional).',
    rarity: 'epic', class: 'frontend',
    effect: { skillBlockMultiplier: 150, startBattleConfidence: 1 },
  },

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
    id: 'technical_debt_relic', name: 'Technical Debt', icon: '💳',
    description: 'Gain 1 extra energy per turn. Start each combat with 1 Burn on yourself. You borrowed from future-you.',
    rarity: 'rare', class: 'backend',
    effect: { extraEnergy: 1, startSelfBurn: 1 },
  },
  {
    id: 'triple_stack_optimizer', name: 'Triple Stack Optimizer', icon: '🌪️',
    description: 'Queue all 3 elements (ice + fire + lightning) in one turn: gain 1 energy next turn.',
    rarity: 'epic', class: 'backend',
    effect: { tripleElementEnergy: 1 },
  },
  {
    id: 'burn_propagator', name: 'Burn Propagator', icon: '🔥',
    description: 'Applying Burn to any enemy also applies 1 Burn to all other enemies. Fire spreads. That is the technical term.',
    rarity: 'epic', class: 'backend',
    effect: { burnPropagation: true },
  },
  {
    id: 'circuit_breaker', name: 'Circuit Breaker', icon: '⚡',
    description: 'Once per combat, survive a killing blow with 1 HP. After detonation fires, apply 1 Vulnerable to all enemies.',
    rarity: 'epic', class: 'backend',
    effect: { surviveKillingBlow: true, vulnerableOnDetonate: true },
  },

  // ═══════════════════════════════════════════════════════════════
  // ARCHITECT CLASS RELICS (engineer slots / resonance)
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
    description: 'Gain 1 Confidence at turn start per slotted engineer. The team is small. The confidence: enormous.',
    rarity: 'epic', class: 'architect',
    effect: { confidencePerSlottedEngineer: true },
  },
  {
    id: 'domain_model', name: 'Domain Model', icon: '🗂️',
    description: 'At combat start, your first 3 cards played cost 0. Well-bounded contexts.',
    rarity: 'epic', class: 'architect',
    effect: { firstNCardsFree: 3 },
  },

  // ═══════════════════════════════════════════════════════════════
  // AI ENGINEER CLASS RELICS (temperature / data_pipeline / inference)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'feature_store', name: 'Feature Store', icon: '📦',
    description: 'Start each combat with 3 pipelineData on first turn. Pre-computed features. Someone planned ahead.',
    rarity: 'common', class: 'ai_engineer',
    effect: { startPipelineData: 3 },
  },
  {
    id: 'sensor_array', name: 'Sensor Array', icon: '📡',
    description: 'Inference conditional bonuses grant +3 extra block/damage. More sensors. More certainty. More paranoia.',
    rarity: 'rare', class: 'ai_engineer',
    effect: { inferenceBonus: 3 },
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
    id: 'context_window', name: 'Context Window', icon: '🪟',
    description: 'Retain 4 pipelineData between turns. Start combat with 5 stress. 8k context. 200k anxiety.',
    rarity: 'epic', class: 'ai_engineer',
    effect: { pipelineRetain: 4, startBattleStress: 5 },
  },

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
    description: 'Draw 1 extra card each turn. Block out the standup meeting.',
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
];

function getCharClassId(charId: string): CardClass | undefined {
  if (charId === 'frontend_dev') return 'frontend';
  if (charId === 'backend_dev') return 'backend';
  if (charId === 'architect') return 'architect';
  if (charId === 'ai_engineer') return 'ai_engineer';
  return undefined;
}

export function getShopItems(count: number, characterId?: string): ItemDef[] {
  const classId = characterId ? getCharClassId(characterId) : undefined;
  const pool = items.filter(i => {
    if (i.isStarter) return false;
    if (!classId) return true;
    return !i.class || i.class === classId;
  });
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRewardArtifact(ownedIds: string[], count: number = 1, characterId?: string): ItemDef[] {
  const classId = characterId ? getCharClassId(characterId) : undefined;
  const available = items.filter(item => {
    if (item.isStarter) return false;
    if (ownedIds.includes(item.id)) return false;
    if (!classId) return true;
    return !item.class || item.class === classId;
  });
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getStarterRelic(characterId: string): ItemDef | undefined {
  const classId = getCharClassId(characterId);
  if (!classId) return undefined;
  return items.find(i => i.isStarter && i.class === classId);
}
