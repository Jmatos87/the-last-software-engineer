import type { ItemDef, CardClass } from '../types';

export const items: ItemDef[] = [
  // ═══════════════════════════════════════════════════════════════
  // STARTER RELICS (1 per class, given at run start)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'node_modules', name: 'node_modules', icon: '📦',
    description: 'Start of combat: add a random 0-cost Frontend card to hand. 4.2 GB of dependencies.',
    rarity: 'starter', class: 'frontend', isStarter: true,
    effect: { addRandomCardStart: true },
  },
  {
    id: 'production_server', name: 'Production Server', icon: '🖥️',
    description: 'Start of combat: gain 1 Confidence (+1 attack damage). Running since 2016. Nobody dares touch it.',
    rarity: 'starter', class: 'backend', isStarter: true,
    effect: { startBattleConfidence: 1 },
  },
  {
    id: 'whiteboard_marker', name: 'Whiteboard Marker', icon: '🖊️',
    description: 'First Power each combat costs 0. Uncapped. Dried out. Still works.',
    rarity: 'starter', class: 'architect', isStarter: true,
    effect: { firstPowerFree: true },
  },
  {
    id: 'gpu_cluster', name: 'GPU Cluster', icon: '🔧',
    description: 'Draw 1 extra card each turn. $47,000/month in cloud compute.',
    rarity: 'starter', class: 'ai_engineer', isStarter: true,
    effect: { extraDraw: 1 },
  },

  // ═══════════════════════════════════════════════════════════════
  // FRONTEND CLASS RELICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'webpack_bundle', name: 'Webpack Bundle', icon: '📦',
    description: 'Gain 2 block whenever you draw outside draw phase. (Simplified: +2 block on skills)',
    rarity: 'common', class: 'frontend',
    effect: { bonusBlock: 2 },
  },
  {
    id: 'chrome_devtools', name: 'Chrome DevTools', icon: '🔍',
    description: 'First skill each turn gives +3 block.',
    rarity: 'uncommon', class: 'frontend',
    effect: { firstSkillBlock: 3 },
  },
  {
    id: 'safari_bug_report', name: 'Safari Bug Report', icon: '🐛',
    description: 'Whenever you apply Vulnerable, also apply 1 Weak.',
    rarity: 'uncommon', class: 'frontend',
    effect: { vulnerableAlsoWeak: true },
  },
  {
    id: 'react_fiber', name: 'React Fiber', icon: '⚡',
    description: 'When you play 3+ cards in a turn, gain 1 energy.',
    rarity: 'rare', class: 'frontend',
    effect: { cardsPlayedEnergy: 1, cardsPlayedThreshold: 3 },
  },
  {
    id: 'tailwind_config', name: 'Tailwind Config', icon: '🎨',
    description: '+1 Resilience (+1 block from cards) at start of combat. Block from cards +2.',
    rarity: 'rare', class: 'frontend',
    effect: { startBattleResilience: 1, bonusBlock: 2 },
  },

  // ═══════════════════════════════════════════════════════════════
  // BACKEND CLASS RELICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'load_balancer', name: 'Load Balancer', icon: '⚖️',
    description: 'Multi-hit attacks deal +1 damage per hit.',
    rarity: 'common', class: 'backend',
    effect: { multiHitBonus: 1 },
  },
  {
    id: 'waf_rules', name: 'WAF Rules', icon: '🛡️',
    description: 'Start combat with 3 Counter-Offer.',
    rarity: 'uncommon', class: 'backend',
    effect: { counterOfferStart: 3 },
  },
  {
    id: 'redis_cache', name: 'Redis Cache', icon: '🔴',
    description: 'When you exhaust a card, gain 4 block.',
    rarity: 'uncommon', class: 'backend',
    effect: { exhaustSynergyBlock: 4 },
  },
  {
    id: 'kubernetes_cluster', name: 'Kubernetes Cluster', icon: '☸️',
    description: 'At start of combat, gain Confidence (+1 attack damage) equal to power cards in deck.',
    rarity: 'rare', class: 'backend',
    effect: { startCombatConfidencePerPower: true },
  },
  {
    id: 'database_replica', name: 'Database Replica', icon: '💾',
    description: 'When you exhaust a card, deal 3 damage to all enemies.',
    rarity: 'rare', class: 'backend',
    effect: { exhaustSynergyDamage: 3 },
  },

  // ═══════════════════════════════════════════════════════════════
  // ARCHITECT CLASS RELICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'uml_poster', name: 'UML Poster', icon: '📊',
    description: 'First Power each turn draws 1 card.',
    rarity: 'common', class: 'architect',
    effect: { onPlayPower: { draw: 1 } },
  },
  {
    id: 'jira_board', name: 'JIRA Board', icon: '📋',
    description: 'When you exhaust a card, gain 1 energy.',
    rarity: 'uncommon', class: 'architect',
    effect: { exhaustGainEnergy: true },
  },
  {
    id: 'gantt_chart', name: 'Gantt Chart', icon: '📈',
    description: 'Start combat with 1 extra energy.',
    rarity: 'uncommon', class: 'architect',
    effect: { extraEnergy: 1 },
  },
  {
    id: 'microservices_diagram', name: 'Microservices Diagram', icon: '🔀',
    description: 'Each power played gives +1 Confidence (+1 attack damage) this combat (permanent).',
    rarity: 'rare', class: 'architect',
    effect: { perPowerPlayed: { confidence: 1 } },
  },
  {
    id: 'legacy_codebase', name: 'Legacy Codebase', icon: '📜',
    description: 'Exhaust effects trigger twice.',
    rarity: 'rare', class: 'architect',
    effect: { exhaustDoubleTrigger: true },
  },

  // ═══════════════════════════════════════════════════════════════
  // AI ENGINEER CLASS RELICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'training_data', name: 'Training Data', icon: '📊',
    description: 'At start of turn, if you have Confidence (+attack damage), gain 1 more.',
    rarity: 'common', class: 'ai_engineer',
    effect: { confidenceIfHasConfidence: true },
  },
  {
    id: 'prompt_template', name: 'Prompt Template', icon: '📝',
    description: 'Copium effects give +3 bonus.',
    rarity: 'uncommon', class: 'ai_engineer',
    effect: { bonusCopium: 3 },
  },
  {
    id: 'chaos_monkey', name: 'Chaos Monkey', icon: '🐒',
    description: 'When you take self-damage, deal that damage to a random enemy.',
    rarity: 'uncommon', class: 'ai_engineer',
    effect: { selfDamageReflect: true },
  },
  {
    id: 'tpu_farm', name: 'TPU Farm', icon: '🏭',
    description: 'Start of combat: gain Confidence (+attack damage) and Resilience (+block from cards) equal to current act number.',
    rarity: 'rare', class: 'ai_engineer',
    effect: { startCombatActConfidence: true },
  },
  {
    id: 'safety_filter', name: 'Safety Filter', icon: '🔒',
    description: 'Self-damage from cards halved. Stress gain from cards halved.',
    rarity: 'rare', class: 'ai_engineer',
    effect: { selfDamageHalved: true, stressGainHalved: true },
  },

  // ═══════════════════════════════════════════════════════════════
  // NEUTRAL RELICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'mechanical_keyboard', name: 'Mechanical Keyboard',
    description: 'Start each combat with 1 extra energy.',
    rarity: 'rare', icon: '⌨️',
    effect: { extraEnergy: 1 },
  },
  {
    id: 'second_monitor', name: 'Second Monitor',
    description: 'Draw 1 extra card each turn.',
    rarity: 'uncommon', icon: '🖥️',
    effect: { extraDraw: 1 },
  },
  {
    id: 'energy_drink', name: 'Energy Drink',
    description: 'Gain 10 max HP.',
    rarity: 'common', icon: '🥤',
    effect: { extraHp: 10 },
  },
  {
    id: 'rubber_duck_relic', name: 'Rubber Duck',
    description: 'Heal 3 HP after each combat.',
    rarity: 'common', icon: '🦆',
    effect: { healOnKill: 3 },
  },
  {
    id: 'bitcoin_miner', name: 'Bitcoin Miner',
    description: 'Gain 15 extra gold after each combat.',
    rarity: 'uncommon', icon: '₿',
    effect: { extraGold: 15 },
  },
  {
    id: 'gaming_mouse', name: 'Gaming Mouse',
    description: 'Deal 2 extra damage with attacks.',
    rarity: 'uncommon', icon: '🖱️',
    effect: { bonusDamage: 2 },
  },
  {
    id: 'standing_desk', name: 'Standing Desk',
    description: 'Gain 2 extra block from skills.',
    rarity: 'uncommon', icon: '🪑',
    effect: { bonusBlock: 2 },
  },
  {
    id: 'linkedin_premium', name: 'LinkedIn Premium',
    description: 'Start each combat with 1 extra energy. Finally worth the subscription.',
    rarity: 'rare', icon: '💎',
    effect: { extraEnergy: 1 },
  },
  {
    id: 'noise_canceling_headphones', name: 'Noise-Canceling Headphones',
    description: 'Draw 1 extra card each turn. Block out the standup meeting.',
    rarity: 'uncommon', icon: '🎧',
    effect: { extraDraw: 1 },
  },
  {
    id: 'ergonomic_chair', name: 'Ergonomic Chair',
    description: 'Gain 15 max HP. Your back finally forgives you.',
    rarity: 'uncommon', icon: '🪑',
    effect: { extraHp: 15 },
  },
  {
    id: 'company_swag_mug', name: 'Company Swag Mug',
    description: 'Heal 3 HP after each combat. The logo is already fading.',
    rarity: 'common', icon: '☕',
    effect: { healOnKill: 3 },
  },
  {
    id: 'referral_bonus', name: 'Referral Bonus',
    description: 'Gain 10 extra gold after each combat. Networking pays off.',
    rarity: 'uncommon', icon: '🤝',
    effect: { extraGold: 10 },
  },
  {
    id: 'clicky_keyboard', name: 'Clicky Keyboard',
    description: 'Deal 2 bonus damage on attacks.',
    rarity: 'uncommon', icon: '⌨️',
    effect: { bonusDamage: 2 },
  },
  {
    id: 'blue_light_glasses', name: 'Blue Light Glasses',
    description: 'Gain 2 bonus block on skills.',
    rarity: 'uncommon', icon: '👓',
    effect: { bonusBlock: 2 },
  },
  // Curse / double-edged artifacts
  {
    id: 'open_floor_plan', name: 'Open Floor Plan',
    description: 'Draw 1 extra card each turn, but gain 10 stress per combat.',
    rarity: 'uncommon', icon: '🏢',
    effect: { extraDraw: 1, stressPerCombat: 10 },
  },
  {
    id: 'crunch_mode', name: 'Crunch Mode',
    description: '+3 Confidence (+3 attack damage) at combat start, but take 5 damage.',
    rarity: 'rare', icon: '🔥',
    effect: { startBattleConfidence: 3, startBattleDamage: 5 },
  },
  {
    id: 'imposter_syndrome', name: 'Imposter Syndrome',
    description: 'Start each combat with 2 Vulnerable. You don\'t belong here.',
    rarity: 'uncommon', icon: '😰',
    effect: { startBattleVulnerable: 2 },
  },
  {
    id: 'unlimited_pto', name: 'Unlimited PTO',
    description: 'Heal 8 HP per combat, but start Weak 1.',
    rarity: 'rare', icon: '🏖️',
    effect: { healPerCombat: 8, startBattleWeak: 1 },
  },
  {
    id: 'on_call_rotation', name: 'On-Call Rotation',
    description: '+2 Resilience (+2 block from cards) at combat start, but +8 stress per combat.',
    rarity: 'uncommon', icon: '📟',
    effect: { startBattleResilience: 2, stressPerCombat: 8 },
  },
  // New neutral relics
  {
    id: 'glassdoor_reviews', name: 'Glassdoor Reviews',
    description: 'At start of combat, gain 3 block.',
    rarity: 'common', icon: '⭐',
    effect: { startBattleBlock: 3 },
  },
  {
    id: 'blind_resume', name: 'Blind Resume',
    description: 'Card removal costs 25 less gold.',
    rarity: 'uncommon', icon: '📄',
    effect: { cardRemovalDiscount: 25 },
  },
  {
    id: 'equity_package', name: 'Equity Package',
    description: 'Gain 5 extra gold per combat. Gold rewards +25%.',
    rarity: 'rare', icon: '📈',
    effect: { extraGold: 5, extraGoldPercent: 25 },
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
  // Shop shows class + neutral relics (no starters)
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
