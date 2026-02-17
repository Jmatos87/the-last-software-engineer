import type { ConsumableDef, ConsumableRarity } from '../types';

export const consumables: Record<string, ConsumableDef> = {
  // ═══════════════════════════════════════
  // COMMON (6)
  // ═══════════════════════════════════════
  energy_drink: {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: '+2 Energy this turn. Tastes like battery acid and ambition.',
    rarity: 'common',
    icon: '⚡',
    target: 'self',
    effect: { energy: 2 },
  },
  coffee_thermos: {
    id: 'coffee_thermos',
    name: 'Cold Brew Thermos',
    description: 'Draw 3 cards. Brewed at 4 AM during a production incident.',
    rarity: 'common',
    icon: '☕',
    target: 'self',
    effect: { draw: 3 },
  },
  desk_snack: {
    id: 'desk_snack',
    name: 'Desk Snack Bag',
    description: 'Heal 12 HP. Expired trail mix from the communal kitchen.',
    rarity: 'common',
    icon: '🍪',
    target: 'self',
    effect: { heal: 12 },
  },
  stress_ball: {
    id: 'stress_ball',
    name: 'Company Stress Ball',
    description: '-15 Stress. It has the company logo on it. Squeeze harder.',
    rarity: 'common',
    icon: '🟡',
    target: 'self',
    effect: { stressRelief: 15 },
  },
  stack_trace_potion: {
    id: 'stack_trace_potion',
    name: 'Stack Trace',
    description: 'Apply 3 Vulnerable to an enemy. Their weaknesses revealed.',
    rarity: 'common',
    icon: '🔍',
    target: 'enemy',
    effect: { applyToTarget: { vulnerable: 3 } },
  },
  git_blame: {
    id: 'git_blame',
    name: 'Git Blame',
    description: 'Apply 2 Weak to an enemy. It was their commit all along.',
    rarity: 'common',
    icon: '👉',
    target: 'enemy',
    effect: { applyToTarget: { weak: 2 } },
  },

  // ═══════════════════════════════════════
  // UNCOMMON (6)
  // ═══════════════════════════════════════
  leetcode_grind: {
    id: 'leetcode_grind',
    name: 'LeetCode Grind Session',
    description: '+2 Confidence (+2 attack damage). You solved 50 mediums in one sitting.',
    rarity: 'uncommon',
    icon: '💻',
    target: 'self',
    effect: { applyToSelf: { confidence: 2 } },
  },
  kombucha: {
    id: 'kombucha',
    name: 'Artisanal Kombucha',
    description: 'Heal 20 HP + 2 Regen. Fermented by the office wellness committee.',
    rarity: 'uncommon',
    icon: '🍵',
    target: 'self',
    effect: { heal: 20, applyToSelf: { regen: 2 } },
  },
  duck_debugger: {
    id: 'duck_debugger',
    name: 'Rubber Duck Debugger',
    description: '8 Block + Draw 2. Explain the problem to the duck.',
    rarity: 'uncommon',
    icon: '🦆',
    target: 'self',
    effect: { block: 8, draw: 2 },
  },
  deploy_on_friday: {
    id: 'deploy_on_friday',
    name: 'Deploy on Friday',
    description: '10 damage to ALL enemies. Bold move. Let\'s see how it plays out.',
    rarity: 'uncommon',
    icon: '🚀',
    target: 'all_enemies',
    effect: { damageAll: 10 },
  },
  regex_grenade: {
    id: 'regex_grenade',
    name: 'Regex Grenade',
    description: '3 Vulnerable to ALL enemies. /.*kaboom.*/g',
    rarity: 'uncommon',
    icon: '💣',
    target: 'all_enemies',
    effect: { applyToAll: { vulnerable: 3 } },
  },
  linkedin_premium_potion: {
    id: 'linkedin_premium_potion',
    name: 'LinkedIn Premium Trial',
    description: '+3 Networking. See who viewed your profile. Draw extra cards each turn.',
    rarity: 'uncommon',
    icon: '🌟',
    target: 'self',
    effect: { applyToSelf: { networking: 3 } },
  },

  // ═══════════════════════════════════════
  // RARE (3)
  // ═══════════════════════════════════════
  resignation_letter: {
    id: 'resignation_letter',
    name: 'Resignation Letter',
    description: '40 damage to one enemy. "Dear Manager, I quit." — devastating.',
    rarity: 'rare',
    icon: '📜',
    target: 'enemy',
    effect: { damage: 40 },
  },
  severance_package: {
    id: 'severance_package',
    name: 'Severance Package',
    description: 'Heal 30 HP, +30 gold, -20 stress. The golden goodbye.',
    rarity: 'rare',
    icon: '💼',
    target: 'self',
    effect: { heal: 30, goldGain: 30, stressRelief: 20 },
  },
  infinite_loop: {
    id: 'infinite_loop',
    name: 'Infinite Loop',
    description: '15 damage + 2 Weak to ALL enemies. while(true) { obliterate(); }',
    rarity: 'rare',
    icon: '♾️',
    target: 'all_enemies',
    effect: { damageAll: 15, applyToAll: { weak: 2 } },
  },
};

// ═══════════════════════════════════════
// Drop helpers
// ═══════════════════════════════════════

const commonPool = Object.values(consumables).filter(c => c.rarity === 'common');
const uncommonPool = Object.values(consumables).filter(c => c.rarity === 'uncommon');
const rarePool = Object.values(consumables).filter(c => c.rarity === 'rare');

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickByRarity(commonWeight: number, uncommonWeight: number, _rareWeight: number): ConsumableDef {
  const roll = Math.random() * 100;
  if (roll < commonWeight) return pickRandom(commonPool);
  if (roll < commonWeight + uncommonWeight) return pickRandom(uncommonPool);
  return pickRandom(rarePool);
}

/** Get a consumable drop weighted by act */
export function getConsumableDrop(act: number): ConsumableDef {
  switch (act) {
    case 1: return pickByRarity(70, 25, 5);
    case 2: return pickByRarity(45, 40, 15);
    case 3: return pickByRarity(25, 45, 30);
    default: return pickByRarity(70, 25, 5);
  }
}

/** Get a random rare consumable (for boss drops) */
export function getRareConsumable(): ConsumableDef {
  return pickRandom(rarePool);
}

/** Get consumables for shop display */
export function getShopConsumables(act: number, count: number = 2): ConsumableDef[] {
  // Weight toward act-appropriate rarities
  const pool: ConsumableDef[] = [];
  for (let i = 0; i < count; i++) {
    pool.push(getConsumableDrop(act));
  }
  // Deduplicate
  const seen = new Set<string>();
  const result: ConsumableDef[] = [];
  for (const c of pool) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      result.push(c);
    }
  }
  // Fill if deduplication removed some
  const allConsumables = Object.values(consumables);
  while (result.length < count) {
    const pick = allConsumables[Math.floor(Math.random() * allConsumables.length)];
    if (!seen.has(pick.id)) {
      seen.add(pick.id);
      result.push(pick);
    }
  }
  return result;
}

/** Get a consumable def by ID */
export function getConsumableDef(id: string): ConsumableDef | undefined {
  return consumables[id];
}

/** Get a random consumable of specific rarity */
export function getRandomConsumable(rarity: ConsumableRarity): ConsumableDef {
  switch (rarity) {
    case 'common': return pickRandom(commonPool);
    case 'uncommon': return pickRandom(uncommonPool);
    case 'rare': return pickRandom(rarePool);
  }
}
