import type { ItemDef } from '../types';

export const items: ItemDef[] = [
  // ── Original artifacts ──
  {
    id: 'mechanical_keyboard',
    name: 'Mechanical Keyboard',
    description: 'Start each combat with 1 extra energy.',
    rarity: 'rare',
    icon: '⌨️',
    effect: { extraEnergy: 1 },
  },
  {
    id: 'second_monitor',
    name: 'Second Monitor',
    description: 'Draw 1 extra card each turn.',
    rarity: 'uncommon',
    icon: '🖥️',
    effect: { extraDraw: 1 },
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Gain 10 max HP.',
    rarity: 'common',
    icon: '🥤',
    effect: { extraHp: 10 },
  },
  {
    id: 'rubber_duck_relic',
    name: 'Rubber Duck',
    description: 'Heal 3 HP after each combat.',
    rarity: 'common',
    icon: '🦆',
    effect: { healOnKill: 3 },
  },
  {
    id: 'bitcoin_miner',
    name: 'Bitcoin Miner',
    description: 'Gain 15 extra gold after each combat.',
    rarity: 'uncommon',
    icon: '₿',
    effect: { extraGold: 15 },
  },
  {
    id: 'gaming_mouse',
    name: 'Gaming Mouse',
    description: 'Deal 2 extra damage with attacks.',
    rarity: 'uncommon',
    icon: '🖱️',
    effect: { bonusDamage: 2 },
  },
  {
    id: 'standing_desk',
    name: 'Standing Desk',
    description: 'Gain 2 extra block from skills.',
    rarity: 'uncommon',
    icon: '🪑',
    effect: { bonusBlock: 2 },
  },

  // ── New pure reward artifacts ──
  {
    id: 'linkedin_premium',
    name: 'LinkedIn Premium',
    description: 'Start each combat with 1 extra energy. Finally worth the subscription.',
    rarity: 'rare',
    icon: '💎',
    effect: { extraEnergy: 1 },
  },
  {
    id: 'noise_canceling_headphones',
    name: 'Noise-Canceling Headphones',
    description: 'Draw 1 extra card each turn. Block out the standup meeting.',
    rarity: 'uncommon',
    icon: '🎧',
    effect: { extraDraw: 1 },
  },
  {
    id: 'ergonomic_chair',
    name: 'Ergonomic Chair',
    description: 'Gain 15 max HP. Your back finally forgives you.',
    rarity: 'uncommon',
    icon: '🪑',
    effect: { extraHp: 15 },
  },
  {
    id: 'company_swag_mug',
    name: 'Company Swag Mug',
    description: 'Heal 3 HP after each combat. The logo is already fading.',
    rarity: 'common',
    icon: '☕',
    effect: { healOnKill: 3 },
  },
  {
    id: 'referral_bonus',
    name: 'Referral Bonus',
    description: 'Gain 10 extra gold after each combat. Networking pays off.',
    rarity: 'uncommon',
    icon: '🤝',
    effect: { extraGold: 10 },
  },
  {
    id: 'clicky_keyboard',
    name: 'Clicky Keyboard',
    description: 'Deal 2 bonus damage on attacks. Annoy everyone in the open office.',
    rarity: 'uncommon',
    icon: '⌨️',
    effect: { bonusDamage: 2 },
  },
  {
    id: 'blue_light_glasses',
    name: 'Blue Light Glasses',
    description: 'Gain 2 bonus block on skills. Protect your eyes AND your HP.',
    rarity: 'uncommon',
    icon: '👓',
    effect: { bonusBlock: 2 },
  },

  // ── Curse / double-edged artifacts ──
  {
    id: 'open_floor_plan',
    name: 'Open Floor Plan',
    description: 'Draw 1 extra card each turn, but gain 10 stress per combat. No escape from "quick chats."',
    rarity: 'uncommon',
    icon: '🏢',
    effect: { extraDraw: 1, stressPerCombat: 10 },
  },
  {
    id: 'crunch_mode',
    name: 'Crunch Mode',
    description: '+3 Strength at combat start, but take 5 damage. Ship it or die trying.',
    rarity: 'rare',
    icon: '🔥',
    effect: { startBattleStrength: 3, startBattleDamage: 5 },
  },
  {
    id: 'imposter_syndrome',
    name: 'Imposter Syndrome',
    description: 'Start each combat with 2 Vulnerable. You don\'t belong here.',
    rarity: 'uncommon',
    icon: '😰',
    effect: { startBattleVulnerable: 2 },
  },
  {
    id: 'unlimited_pto',
    name: 'Unlimited PTO',
    description: 'Heal 8 HP per combat, but start Weak 1. Nobody actually takes it.',
    rarity: 'rare',
    icon: '🏖️',
    effect: { healPerCombat: 8, startBattleWeak: 1 },
  },
  {
    id: 'on_call_rotation',
    name: 'On-Call Rotation',
    description: '+2 Dexterity at combat start, but +8 stress per combat. The PagerDuty never stops.',
    rarity: 'uncommon',
    icon: '📟',
    effect: { startBattleDexterity: 2, stressPerCombat: 8 },
  },
];

export function getShopItems(count: number): ItemDef[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRewardArtifact(ownedIds: string[], count: number = 1): ItemDef[] {
  const available = items.filter(item => !ownedIds.includes(item.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
