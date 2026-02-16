import type { ItemDef } from '../types';

export const items: ItemDef[] = [
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
];

export function getShopItems(count: number): ItemDef[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
