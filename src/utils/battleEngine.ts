import type { StatusEffect, EnemyInstance, ItemDef } from '../types';

export function calculateDamage(
  baseDamage: number,
  attackerEffects: StatusEffect,
  defenderEffects: StatusEffect,
  items: ItemDef[] = []
): number {
  let damage = baseDamage;

  // Add confidence
  damage += attackerEffects.confidence || 0;

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

export function calculateStressDamage(
  baseDamage: number,
  attackerEffects: StatusEffect,
  defenderEffects: StatusEffect,
  attackerEnemyId?: string
): number {
  let damage = baseDamage;

  // Confidence boosts stress damage
  damage += attackerEffects.confidence || 0;

  // Weak reduces stress damage by 25%
  if ((attackerEffects.weak || 0) > 0) {
    damage = Math.floor(damage * 0.75);
  }

  // Vulnerable increases stress damage by 50%
  if ((defenderEffects.vulnerable || 0) > 0) {
    damage = Math.floor(damage * 1.5);
  }

  // Recruiter Bot gets +2 stress per hope stack on target
  if (attackerEnemyId === 'recruiter_bot' && (defenderEffects.hope || 0) > 0) {
    damage += 2 * (defenderEffects.hope || 0);
  }

  return Math.max(0, damage);
}

export function calculateBlock(
  baseBlock: number,
  effects: StatusEffect,
  items: ItemDef[] = [],
  isSkillCard: boolean = false
): number {
  let total = baseBlock;

  // Add resilience
  total += effects.resilience || 0;

  // Add item bonus block
  for (const item of items) {
    total += item.effect.bonusBlock || 0;
  }

  // css_custom_props relic: block from skills increased by skillBlockMultiplier%
  if (isSkillCard) {
    const multiplierItem = items.find(i => i.effect.skillBlockMultiplier);
    if (multiplierItem) {
      total = Math.ceil(total * (multiplierItem.effect.skillBlockMultiplier! / 100));
    }
  }

  return Math.max(0, total);
}

export function calculateCopium(
  baseCopium: number,
  effects: StatusEffect,
  items: ItemDef[] = []
): number {
  let copium = baseCopium;

  // Resilience boosts copium
  copium += effects.resilience || 0;

  // Bonus copium from relics
  for (const item of items) {
    copium += item.effect.bonusCopium || 0;
  }

  // Cringe reduces copium by 1 per stack
  if ((effects.cringe || 0) > 0) {
    copium -= effects.cringe || 0;
  }

  return Math.max(0, copium);
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

export function applyStressToPlayer(
  currentStress: number,
  damage: number
): number {
  return currentStress + damage;
}

export function tickStatusEffects(effects: StatusEffect): StatusEffect {
  const newEffects: StatusEffect = {};
  // Temporary (decrement each turn)
  if (effects.vulnerable && effects.vulnerable > 0) newEffects.vulnerable = effects.vulnerable - 1;
  if (effects.weak && effects.weak > 0) newEffects.weak = effects.weak - 1;
  if (effects.poison && effects.poison > 0) newEffects.poison = effects.poison - 1;
  if (effects.hope && effects.hope > 0) newEffects.hope = effects.hope - 1;
  if (effects.cringe && effects.cringe > 0) newEffects.cringe = effects.cringe - 1;
  if (effects.ghosted && effects.ghosted > 0) newEffects.ghosted = effects.ghosted - 1;
  if (effects.regen && effects.regen > 0) newEffects.regen = effects.regen - 1;
  // Frontend: dodge decays at player turn start (not here) — preserve current value
  if (effects.dodge && effects.dodge > 0) newEffects.dodge = effects.dodge;
  // Permanent (persist)
  if (effects.confidence) newEffects.confidence = effects.confidence;
  if (effects.resilience) newEffects.resilience = effects.resilience;
  if (effects.selfCare) newEffects.selfCare = effects.selfCare;
  if (effects.networking) newEffects.networking = effects.networking;
  if (effects.savingsAccount) newEffects.savingsAccount = effects.savingsAccount;
  if (effects.counterOffer) newEffects.counterOffer = effects.counterOffer;
  if (effects.hustleCulture) newEffects.hustleCulture = effects.hustleCulture;
  // bleed persists on enemies — NOT ticked here, handled in startNewTurn to apply damage then decrement
  if (effects.bleed && effects.bleed > 0) newEffects.bleed = effects.bleed;
  // burn persists on enemies — NOT ticked here, handled in startNewTurn to apply damage then decrement
  if (effects.burn && effects.burn > 0) newEffects.burn = effects.burn;
  return newEffects;
}

export function mergeStatusEffects(existing: StatusEffect, apply: StatusEffect): StatusEffect {
  return {
    vulnerable: (existing.vulnerable || 0) + (apply.vulnerable || 0) || undefined,
    weak: (existing.weak || 0) + (apply.weak || 0) || undefined,
    confidence: (existing.confidence || 0) + (apply.confidence || 0) || undefined,
    resilience: (existing.resilience || 0) + (apply.resilience || 0) || undefined,
    regen: (existing.regen || 0) + (apply.regen || 0) || undefined,
    poison: (existing.poison || 0) + (apply.poison || 0) || undefined,
    hope: (existing.hope || 0) + (apply.hope || 0) || undefined,
    cringe: (existing.cringe || 0) + (apply.cringe || 0) || undefined,
    ghosted: (existing.ghosted || 0) + (apply.ghosted || 0) || undefined,
    selfCare: (existing.selfCare || 0) + (apply.selfCare || 0) || undefined,
    networking: (existing.networking || 0) + (apply.networking || 0) || undefined,
    savingsAccount: (existing.savingsAccount || 0) + (apply.savingsAccount || 0) || undefined,
    counterOffer: (existing.counterOffer || 0) + (apply.counterOffer || 0) || undefined,
    hustleCulture: (existing.hustleCulture || 0) + (apply.hustleCulture || 0) || undefined,
    // Frontend Engineer mechanics
    dodge: (existing.dodge || 0) + (apply.dodge || 0) || undefined,
    bleed: (existing.bleed || 0) + (apply.bleed || 0) || undefined,
    burn: (existing.burn || 0) + (apply.burn || 0) || undefined,
  };
}
