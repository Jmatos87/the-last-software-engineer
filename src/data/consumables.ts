import type { ConsumableDef, ConsumableRarity } from '../types';

export const consumables: Record<string, ConsumableDef> = {
  // ═══════════════════════════════════════
  // COMMON (9)
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
  // New common consumables
  todo_list: {
    id: 'todo_list',
    name: 'TODO List',
    description: 'Draw 2 cards. 47 items. None of them marked done.',
    rarity: 'common',
    icon: '📋',
    target: 'self',
    effect: { draw: 2 },
  },
  documentation: {
    id: 'documentation',
    name: 'Documentation',
    description: 'Gain 12 block. Finally written. Already outdated.',
    rarity: 'common',
    icon: '📖',
    target: 'self',
    effect: { block: 12 },
  },
  hotfix_patch: {
    id: 'hotfix_patch',
    name: 'Hotfix Patch',
    description: 'Heal 8 HP. Apply 2 Vulnerable to one enemy. Ship now, regret never.',
    rarity: 'common',
    icon: '🩹',
    target: 'enemy',
    effect: { heal: 8, applyToTarget: { vulnerable: 2 } },
  },

  // ═══════════════════════════════════════
  // RARE (9, was uncommon)
  // ═══════════════════════════════════════
  leetcode_grind: {
    id: 'leetcode_grind',
    name: 'LeetCode Grind Session',
    description: '+2 Confidence (+2 attack damage). You solved 50 mediums in one sitting.',
    rarity: 'rare',
    icon: '💻',
    target: 'self',
    effect: { applyToSelf: { confidence: 2 } },
  },
  kombucha: {
    id: 'kombucha',
    name: 'Artisanal Kombucha',
    description: 'Heal 20 HP + 2 Regen. Fermented by the office wellness committee.',
    rarity: 'rare',
    icon: '🍵',
    target: 'self',
    effect: { heal: 20, applyToSelf: { regen: 2 } },
  },
  duck_debugger: {
    id: 'duck_debugger',
    name: 'Rubber Duck Debugger',
    description: '8 Block + Draw 2. Explain the problem to the duck.',
    rarity: 'rare',
    icon: '🦆',
    target: 'self',
    effect: { block: 8, draw: 2 },
  },
  deploy_on_friday: {
    id: 'deploy_on_friday',
    name: 'Deploy on Friday',
    description: '10 damage to ALL enemies. Bold move. Let\'s see how it plays out.',
    rarity: 'rare',
    icon: '🚀',
    target: 'all_enemies',
    effect: { damageAll: 10 },
  },
  regex_grenade: {
    id: 'regex_grenade',
    name: 'Regex Grenade',
    description: '3 Vulnerable to ALL enemies. /.*kaboom.*/g',
    rarity: 'rare',
    icon: '💣',
    target: 'all_enemies',
    effect: { applyToAll: { vulnerable: 3 } },
  },
  linkedin_premium_potion: {
    id: 'linkedin_premium_potion',
    name: 'LinkedIn Premium Trial',
    description: '+3 Networking. See who viewed your profile.',
    rarity: 'rare',
    icon: '🌟',
    target: 'self',
    effect: { applyToSelf: { networking: 3 } },
  },
  // New rare consumables
  pair_session: {
    id: 'pair_session',
    name: 'Pair Programming Session',
    description: 'Draw 3 cards. Gain 2 energy. Someone else\'s problem too, now.',
    rarity: 'rare',
    icon: '🧑‍💻',
    target: 'self',
    effect: { draw: 3, energy: 2 },
  },
  postmortem: {
    id: 'postmortem',
    name: 'Postmortem Report',
    description: 'Heal 18 HP. Gain 20 block. Reduce 10 stress. Learn from failure.',
    rarity: 'rare',
    icon: '📊',
    target: 'self',
    effect: { heal: 18, block: 20, stressRelief: 10 },
  },
  api_key_consumable: {
    id: 'api_key_consumable',
    name: 'API Key',
    description: '+3 Confidence. +1 Networking. The key to everything.',
    rarity: 'rare',
    icon: '🔑',
    target: 'self',
    effect: { applyToSelf: { confidence: 3, networking: 1 } },
  },

  // ═══════════════════════════════════════
  // EPIC (5, was rare)
  // ═══════════════════════════════════════
  resignation_letter: {
    id: 'resignation_letter',
    name: 'Resignation Letter',
    description: '40 damage to one enemy. "Dear Manager, I quit." — devastating.',
    rarity: 'epic',
    icon: '📜',
    target: 'enemy',
    effect: { damage: 40 },
  },
  severance_package: {
    id: 'severance_package',
    name: 'Severance Package',
    description: 'Heal 30 HP, +30 gold, -20 stress. The golden goodbye.',
    rarity: 'epic',
    icon: '💼',
    target: 'self',
    effect: { heal: 30, goldGain: 30, stressRelief: 20 },
  },
  infinite_loop: {
    id: 'infinite_loop',
    name: 'Infinite Loop',
    description: '15 damage + 2 Weak to ALL enemies. while(true) { obliterate(); }',
    rarity: 'epic',
    icon: '♾️',
    target: 'all_enemies',
    effect: { damageAll: 15, applyToAll: { weak: 2 } },
  },
  // New epic consumables
  production_access: {
    id: 'production_access',
    name: 'Production Access',
    description: 'Deal 50 damage to one enemy. Add 10 stress. This is not dev.',
    rarity: 'epic',
    icon: '⚡',
    target: 'enemy',
    effect: { damage: 50, addStress: 10 },
  },
  all_hands_bomb: {
    id: 'all_hands_bomb',
    name: 'All-Hands Meeting',
    description: 'Apply 4 Vulnerable + 4 Weak to ALL enemies. The CEO raised the bar.',
    rarity: 'epic',
    icon: '💣',
    target: 'all_enemies',
    effect: { applyToAll: { vulnerable: 4, weak: 4 } },
  },

  // ═══════════════════════════════════════
  // LEGENDARY (2)
  // ═══════════════════════════════════════
  golden_ticket: {
    id: 'golden_ticket',
    name: 'Golden Ticket',
    description: 'Gain 3 energy. Heal to full HP. Gain 50 gold. Reduce stress to 0. You got the offer.',
    rarity: 'legendary',
    icon: '🎫',
    target: 'self',
    effect: { energy: 3, healFull: true, goldGain: 50, stressToZero: true },
  },
  yc_acceptance: {
    id: 'yc_acceptance',
    name: 'YC Acceptance',
    description: 'Add 2 random epic cards to your hand (playable this turn). Series A just closed.',
    rarity: 'legendary',
    icon: '🚀',
    target: 'self',
    effect: { addEpicCardsToHand: 2 },
  },
};

// ═══════════════════════════════════════
// Drop helpers
// ═══════════════════════════════════════

const commonPool = Object.values(consumables).filter(c => c.rarity === 'common');
const rarePool = Object.values(consumables).filter(c => c.rarity === 'rare');
const epicPool = Object.values(consumables).filter(c => c.rarity === 'epic');
const legendaryPool = Object.values(consumables).filter(c => c.rarity === 'legendary');

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickByRarity(commonWeight: number, rareWeight: number, epicWeight: number, _legendaryWeight: number): ConsumableDef {
  const roll = Math.random() * 100;
  if (roll < commonWeight) return pickRandom(commonPool);
  if (roll < commonWeight + rareWeight) return pickRandom(rarePool);
  if (roll < commonWeight + rareWeight + epicWeight) return pickRandom(epicPool.length > 0 ? epicPool : rarePool);
  return pickRandom(legendaryPool.length > 0 ? legendaryPool : epicPool);
}

/** Get a consumable drop weighted by act */
export function getConsumableDrop(act: number): ConsumableDef {
  switch (act) {
    case 1: return pickByRarity(65, 28, 6, 1);
    case 2: return pickByRarity(40, 38, 17, 5);
    case 3: return pickByRarity(15, 40, 33, 12);
    default: return pickByRarity(65, 28, 6, 1);
  }
}

/** Get a random epic consumable (for boss drops) */
export function getRareConsumable(): ConsumableDef {
  return pickRandom(epicPool.length > 0 ? epicPool : rarePool);
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
    case 'rare': return pickRandom(rarePool);
    case 'epic': return pickRandom(epicPool.length > 0 ? epicPool : rarePool);
    case 'legendary': return pickRandom(legendaryPool.length > 0 ? legendaryPool : epicPool);
  }
}
