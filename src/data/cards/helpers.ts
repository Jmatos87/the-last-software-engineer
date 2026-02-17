import type { CardDef } from '../../types';
import { cards } from './index';

export function getCardDef(id: string): CardDef {
  return cards[id];
}

export function getRewardCards(count: number, rarity?: 'common' | 'uncommon' | 'rare', playerClass?: string, act?: number, encounterType?: 'normal' | 'elite' | 'boss'): CardDef[] {
  // Rarity weighting by act
  const rarityWeights = act === 3
    ? { common: 30, uncommon: 50, rare: 20 }
    : act === 2
    ? { common: 50, uncommon: 40, rare: 10 }
    : { common: 70, uncommon: 25, rare: 5 };

  function pickRarity(): 'common' | 'uncommon' | 'rare' {
    if (rarity) return rarity;
    const roll = Math.random() * 100;
    if (roll < rarityWeights.rare) return 'rare';
    if (roll < rarityWeights.rare + rarityWeights.uncommon) return 'uncommon';
    return 'common';
  }

  const allPool = Object.values(cards).filter(c => c.rarity !== 'starter' && c.rarity !== 'curse');

  // Class-gated: build weighted pool per rarity
  function getPool(r: 'common' | 'uncommon' | 'rare'): CardDef[] {
    const pool = allPool.filter(c => c.rarity === r);
    if (!playerClass) return pool;
    const classCards = pool.filter(c => c.class === playerClass);
    const neutralCards = pool.filter(c => !c.class);
    const weighted: CardDef[] = [];
    for (let i = 0; i < 4; i++) weighted.push(...classCards);
    weighted.push(...neutralCards);
    return weighted;
  }

  const seen = new Set<string>();
  const result: CardDef[] = [];

  // Elite guarantees at least 1 uncommon; Boss guarantees at least 1 rare
  if (encounterType === 'boss' && !rarity) {
    const rarePool = getPool('rare');
    const shuffled = [...rarePool].sort(() => Math.random() - 0.5);
    for (const card of shuffled) {
      if (!seen.has(card.id)) { seen.add(card.id); result.push(card); break; }
    }
  } else if (encounterType === 'elite' && !rarity) {
    const uncPool = getPool('uncommon');
    const shuffled = [...uncPool].sort(() => Math.random() - 0.5);
    for (const card of shuffled) {
      if (!seen.has(card.id)) { seen.add(card.id); result.push(card); break; }
    }
  }

  // Fill remaining slots with rarity-weighted picks
  let attempts = 0;
  while (result.length < count && attempts < 100) {
    attempts++;
    const r = pickRarity();
    const pool = getPool(r);
    if (pool.length === 0) continue;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!seen.has(pick.id)) {
      seen.add(pick.id);
      result.push(pick);
    }
  }

  return result;
}
