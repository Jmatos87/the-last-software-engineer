import type { StatusEffect, EnemyInstance, ItemDef } from '../types';

export function calculateDamage(
  baseDamage: number,
  attackerEffects: StatusEffect,
  defenderEffects: StatusEffect,
  items: ItemDef[] = []
): number {
  let damage = baseDamage;

  // Add strength
  damage += attackerEffects.strength || 0;

  // Add item bonus damage
  for (const item of items) {
    damage += item.effect.bonusDamage || 0;
  }

  // Weak reduces damage by 25%
  if ((attackerEffects.weak || 0) > 0) {
    damage = Math.floor(damage * 0.75);
  }

  // Vulnerable increases damage by 50%
  if ((defenderEffects.vulnerable || 0) > 0) {
    damage = Math.floor(damage * 1.5);
  }

  return Math.max(0, damage);
}

export function calculateBlock(
  baseBlock: number,
  effects: StatusEffect,
  items: ItemDef[] = []
): number {
  let block = baseBlock;

  // Add dexterity
  block += effects.dexterity || 0;

  // Add item bonus block
  for (const item of items) {
    block += item.effect.bonusBlock || 0;
  }

  return Math.max(0, block);
}

export function applyDamageToEnemy(
  enemy: EnemyInstance,
  damage: number
): EnemyInstance {
  let remaining = damage;
  let newBlock = enemy.block;
  let newHp = enemy.currentHp;

  if (newBlock > 0) {
    if (remaining >= newBlock) {
      remaining -= newBlock;
      newBlock = 0;
    } else {
      newBlock -= remaining;
      remaining = 0;
    }
  }

  newHp = Math.max(0, newHp - remaining);

  return { ...enemy, block: newBlock, currentHp: newHp };
}

export function applyDamageToPlayer(
  currentHp: number,
  playerBlock: number,
  damage: number
): { hp: number; block: number } {
  let remaining = damage;
  let block = playerBlock;

  if (block > 0) {
    if (remaining >= block) {
      remaining -= block;
      block = 0;
    } else {
      block -= remaining;
      remaining = 0;
    }
  }

  return { hp: Math.max(0, currentHp - remaining), block };
}

export function tickStatusEffects(effects: StatusEffect): StatusEffect {
  const newEffects: StatusEffect = {};
  if (effects.vulnerable && effects.vulnerable > 0) newEffects.vulnerable = effects.vulnerable - 1;
  if (effects.weak && effects.weak > 0) newEffects.weak = effects.weak - 1;
  if (effects.strength) newEffects.strength = effects.strength;
  if (effects.dexterity) newEffects.dexterity = effects.dexterity;
  if (effects.regen) newEffects.regen = effects.regen;
  if (effects.poison && effects.poison > 0) newEffects.poison = effects.poison - 1;
  return newEffects;
}

export function mergeStatusEffects(existing: StatusEffect, apply: StatusEffect): StatusEffect {
  return {
    vulnerable: (existing.vulnerable || 0) + (apply.vulnerable || 0) || undefined,
    weak: (existing.weak || 0) + (apply.weak || 0) || undefined,
    strength: (existing.strength || 0) + (apply.strength || 0) || undefined,
    dexterity: (existing.dexterity || 0) + (apply.dexterity || 0) || undefined,
    regen: (existing.regen || 0) + (apply.regen || 0) || undefined,
    poison: (existing.poison || 0) + (apply.poison || 0) || undefined,
  };
}
