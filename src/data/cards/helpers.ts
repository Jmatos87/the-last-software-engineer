import type { CardDef } from '../../types';
import { cards } from './index';

export function getCardDef(id: string): CardDef {
  return cards[id];
}

export function getRewardCards(count: number, rarity?: 'common' | 'rare' | 'epic' | 'legendary', playerClass?: string, act?: number, encounterType?: 'normal' | 'elite' | 'boss'): CardDef[] {
  // Rarity weighting by act (4-tier system)
  const rarityWeights = act === 3
    ? { common: 20, rare: 42, epic: 28, legendary: 10 }
    : act === 2
    ? { common: 40, rare: 38, epic: 17, legendary: 5 }
    : { common: 65, rare: 27, epic: 7, legendary: 1 };

  function pickRarity(): 'common' | 'rare' | 'epic' | 'legendary' {
    if (rarity) return rarity;
    // Elite and boss fights: no commons — minimum rarity is rare
    if (encounterType === 'elite' || encounterType === 'boss') {
      const total = rarityWeights.rare + rarityWeights.epic + rarityWeights.legendary;
      const roll = Math.random() * total;
      if (roll < rarityWeights.legendary) return 'legendary';
      if (roll < rarityWeights.legendary + rarityWeights.epic) return 'epic';
      return 'rare';
    }
    const roll = Math.random() * 100;
    if (roll < rarityWeights.legendary) return 'legendary';
    if (roll < rarityWeights.legendary + rarityWeights.epic) return 'epic';
    if (roll < rarityWeights.legendary + rarityWeights.epic + rarityWeights.rare) return 'rare';
    return 'common';
  }

  const allPool = Object.values(cards).filter(c => c.rarity !== 'starter' && c.rarity !== 'curse');

  // Class-gated: build weighted pool per rarity
  function getPool(r: 'common' | 'rare' | 'epic' | 'legendary'): CardDef[] {
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

  // Elite guarantees at least 1 rare; Boss guarantees at least 1 epic
  if (encounterType === 'boss' && !rarity) {
    const epicPool = getPool('epic');
    const shuffled = [...epicPool].sort(() => Math.random() - 0.5);
    for (const card of shuffled) {
      if (!seen.has(card.id)) { seen.add(card.id); result.push(card); break; }
    }
  } else if (encounterType === 'elite' && !rarity) {
    const rarePool = getPool('rare');
    const shuffled = [...rarePool].sort(() => Math.random() - 0.5);
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
