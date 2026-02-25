import type { ConsumableDef, ConsumableRarity, CardClass } from '../types';

export const consumables: Record<string, ConsumableDef> = {
  // ═══════════════════════════════════════
  // COMMON (8) — Generic tempo tools
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // RARE (9) — 4 class-specific + 5 enhanced generic
  // ═══════════════════════════════════════
  flow_jar: {
    id: 'flow_jar', name: 'Flow State Jar', icon: '🫙',
    description: 'Gain 5 Flow immediately. Frontend only.',
    rarity: 'rare', target: 'self', class: 'frontend',
    effect: { gainFlow: 5 },
  },
  exploit_kit: {
    id: 'exploit_kit', name: 'Exploit Kit', icon: '🩸',
    description: 'Apply 6 Bleed to target enemy. Frontend only. Zero-day. Their day.',
    rarity: 'rare', target: 'enemy', class: 'frontend',
    effect: { applyToTarget: { bleed: 6 } },
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
  preloaded_dataset: {
    id: 'preloaded_dataset', name: 'Preloaded Dataset', icon: '📊',
    description: 'Set pipelineData to 8. AI Engineer only. Someone left the training data in memory.',
    rarity: 'rare', target: 'self', class: 'ai_engineer',
    effect: { setPipelineData: 8 },
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

  // ═══════════════════════════════════════
  // EPIC (5) — High impact, stress costs
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // LEGENDARY (2) — Exceptional, with stings
  // ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// Drop helpers
// ═══════════════════════════════════════

const allConsumableValues = Object.values(consumables);
const commonPool = allConsumableValues.filter(c => c.rarity === 'common' && !c.class);
const rareGenericPool = allConsumableValues.filter(c => c.rarity === 'rare' && !c.class);
const epicPool = allConsumableValues.filter(c => c.rarity === 'epic');
const legendaryPool = allConsumableValues.filter(c => c.rarity === 'legendary');

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickByRarity(
  cPool: ConsumableDef[], rPool: ConsumableDef[], ePool: ConsumableDef[], lPool: ConsumableDef[],
  cW: number, rW: number, eW: number, _lW: number
): ConsumableDef {
  const roll = Math.random() * 100;
  if (roll < cW) return pickRandom(cPool);
  if (roll < cW + rW) return pickRandom(rPool.length > 0 ? rPool : cPool);
  if (roll < cW + rW + eW) return pickRandom(ePool.length > 0 ? ePool : rPool);
  return pickRandom(lPool.length > 0 ? lPool : ePool);
}

/** Get a consumable drop weighted by act, optionally including class-specific rares */
export function getConsumableDrop(act: number, playerClass?: CardClass): ConsumableDef {
  const classRares = playerClass
    ? allConsumableValues.filter(c => c.rarity === 'rare' && c.class === playerClass)
    : [];
  const rarePool = [...rareGenericPool, ...classRares];
  switch (act) {
    case 1: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 65, 28, 6, 1);
    case 2: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 40, 38, 17, 5);
    case 3: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 15, 40, 33, 12);
    default: return pickByRarity(commonPool, rarePool, epicPool, legendaryPool, 65, 28, 6, 1);
  }
}

/** Get a random epic consumable (for boss drops) */
export function getRareConsumable(): ConsumableDef {
  return pickRandom(epicPool.length > 0 ? epicPool : rareGenericPool);
}

/** Get consumables for shop display */
export function getShopConsumables(act: number, count: number = 2, playerClass?: CardClass): ConsumableDef[] {
  const pool: ConsumableDef[] = [];
  for (let i = 0; i < count; i++) {
    pool.push(getConsumableDrop(act, playerClass));
  }
  const seen = new Set<string>();
  const result: ConsumableDef[] = [];
  for (const c of pool) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      result.push(c);
    }
  }
  while (result.length < count) {
    const pick = allConsumableValues[Math.floor(Math.random() * allConsumableValues.length)];
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
    case 'rare': return pickRandom(rareGenericPool);
    case 'epic': return pickRandom(epicPool.length > 0 ? epicPool : rareGenericPool);
    case 'legendary': return pickRandom(legendaryPool.length > 0 ? legendaryPool : epicPool);
  }
}
