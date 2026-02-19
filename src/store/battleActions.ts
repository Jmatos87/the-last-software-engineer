import { v4 as uuidv4 } from 'uuid';
import type { BattleState, Deployment, EnemyDef, EnemyInstance, RunState, CardInstance } from '../types';
import { createCardInstance, shuffleDeck, drawCards } from '../utils/deckUtils';
import { cards, getCardDef } from '../data/cards';
import {
  calculateDamage,
  calculateBlock,
  calculateCopium,
  calculateStressDamage,
  applyDamageToEnemy,
  applyDamageToPlayer,
  applyStressToPlayer,
  tickStatusEffects,
  mergeStatusEffects,
} from '../utils/battleEngine';

export function initBattle(run: RunState, enemyDefs: EnemyDef[]): { battle: BattleState; hpAdjust: number; stressAdjust: number } {
  const enemies: EnemyInstance[] = enemyDefs.map(def => ({
    ...def,
    instanceId: uuidv4(),
    currentHp: def.hp,
    maxHp: def.hp,
    block: 0,
    statusEffects: {},
    moveIndex: 0,
    currentMove: def.moves[0],
  }));

  const drawPile = shuffleDeck([...run.deck]);
  const extraDraw = run.items.reduce((sum, item) => sum + (item.effect.extraDraw || 0), 0);
  const extraEnergy = run.items.reduce((sum, item) => sum + (item.effect.extraEnergy || 0), 0);
  const drawCount = 5 + extraDraw;

  const { drawn, newDrawPile, newDiscardPile } = drawCards(drawPile, [], drawCount);

  // Apply start-of-battle artifact effects
  const playerStatusEffects: import('../types').StatusEffect = {};
  let hpAdjust = 0;
  let stressAdjust = 0;

  for (const item of run.items) {
    if (item.effect.startBattleConfidence) {
      playerStatusEffects.confidence = (playerStatusEffects.confidence || 0) + item.effect.startBattleConfidence;
    }
    if (item.effect.startBattleResilience) {
      playerStatusEffects.resilience = (playerStatusEffects.resilience || 0) + item.effect.startBattleResilience;
    }
    if (item.effect.startBattleVulnerable) {
      playerStatusEffects.vulnerable = (playerStatusEffects.vulnerable || 0) + item.effect.startBattleVulnerable;
    }
    if (item.effect.startBattleWeak) {
      playerStatusEffects.weak = (playerStatusEffects.weak || 0) + item.effect.startBattleWeak;
    }
    if (item.effect.startBattleDamage) {
      hpAdjust -= item.effect.startBattleDamage;
    }
    if (item.effect.stressPerCombat) {
      stressAdjust += item.effect.stressPerCombat;
    }
    if (item.effect.healPerCombat) {
      hpAdjust += item.effect.healPerCombat;
    }
    if (item.effect.counterOfferStart) {
      playerStatusEffects.counterOffer = (playerStatusEffects.counterOffer || 0) + item.effect.counterOfferStart;
    }
    if (item.effect.startBattleBlock) {
      // Will be applied to playerBlock below
    }
    if (item.effect.startCombatConfidencePerPower) {
      // Count power cards in deck
      const powerCount = run.deck.filter(c => c.type === 'power').length;
      playerStatusEffects.confidence = (playerStatusEffects.confidence || 0) + powerCount;
    }
    if (item.effect.startCombatActConfidence) {
      playerStatusEffects.confidence = (playerStatusEffects.confidence || 0) + run.act;
      playerStatusEffects.resilience = (playerStatusEffects.resilience || 0) + run.act;
    }
  }

  // Stress threshold debuffs
  if (run.stress >= 50) {
    playerStatusEffects.weak = (playerStatusEffects.weak || 0) + 1;
  }

  let startBlock = 0;
  for (const item of run.items) {
    if (item.effect.startBattleBlock) {
      startBlock += item.effect.startBattleBlock;
    }
  }

  // Add random 0-cost class card for node_modules relic
  let hand = drawn;
  for (const item of run.items) {
    if (item.effect.addRandomCardStart && run.character.id) {
      const allCards = cards;
      const classId = run.character.id === 'frontend_dev' ? 'frontend'
        : run.character.id === 'backend_dev' ? 'backend'
        : run.character.id === 'architect' ? 'architect'
        : run.character.id === 'ai_engineer' ? 'ai_engineer' : undefined;
      if (classId) {
        const zeroCostCards = Object.values(allCards).filter((c: any) =>
          c.class === classId && c.cost === 0 && c.rarity !== 'curse'
        );
        if (zeroCostCards.length > 0) {
          const pick = zeroCostCards[Math.floor(Math.random() * zeroCostCards.length)] as any;
          hand = [...hand, createCardInstance(pick)];
        }
      }
    }
  }

  return {
    battle: {
      enemies,
      hand,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      exhaustPile: [],
      energy: Math.max(0, run.character.energy + extraEnergy - (run.stress >= 75 ? 1 : 0)),
      maxEnergy: run.character.energy + extraEnergy,
      turn: 1,
      playerBlock: startBlock,
      playerStatusEffects,
      killCount: 0,
      totalEnemies: enemies.length,
      goldEarned: 0,
      deployments: [],
      powersPlayedThisCombat: 0,
      cardsPlayedThisTurn: 0,
      firstAttackPlayedThisTurn: false,
      firstSkillPlayedThisTurn: false,
      firstPowerPlayedThisCombat: false,
      nextCardCostZero: false,
      temperature: 5,
      tokens: 0,
      cardPlayCounts: {},
    },
    hpAdjust,
    stressAdjust,
  };
}

export function executePlayCard(
  battle: BattleState,
  run: RunState,
  cardInstanceId: string,
  targetInstanceId?: string
): { battle: BattleState; stressReduction: number; hpChange: number; stressChange: number; goldChange: number } {
  const cardIndex = battle.hand.findIndex(c => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return { battle, stressReduction: 0, hpChange: 0, stressChange: 0, goldChange: 0 };

  const card = battle.hand[cardIndex];

  // Block curse cards from being played
  if (card.type === 'curse') return { battle, stressReduction: 0, hpChange: 0, stressChange: 0, goldChange: 0 };

  // Check if first power is free (whiteboard_marker relic)
  let effectiveCost = card.cost;
  if (card.type === 'power' && !battle.firstPowerPlayedThisCombat) {
    const hasFreeFirstPower = run.items.some(i => i.effect.firstPowerFree);
    if (hasFreeFirstPower) {
      effectiveCost = 0;
    }
  }

  // fast_refresh / event_bubbling: next card played this turn costs 0
  if (battle.nextCardCostZero) {
    effectiveCost = 0;
  }

  if (effectiveCost > battle.energy) return { battle, stressReduction: 0, hpChange: 0, stressChange: 0, goldChange: 0 };

  const newBattle = {
    ...battle,
    hand: [...battle.hand],
    drawPile: [...battle.drawPile],
    discardPile: [...battle.discardPile],
    exhaustPile: [...battle.exhaustPile],
    enemies: [...battle.enemies],
    playerStatusEffects: { ...battle.playerStatusEffects },
  };
  let stressReduction = 0;
  let hpChange = 0;
  let stressChange = 0;
  let goldChange = 0;
  newBattle.energy -= effectiveCost;
  newBattle.hand.splice(cardIndex, 1);
  newBattle.cardsPlayedThisTurn = (battle.cardsPlayedThisTurn || 0) + 1;

  // Step 1 — Training Loop tracking (must be FIRST so playCount is current when effects resolve)
  const prevPlayCount = (newBattle.cardPlayCounts || {})[card.id] || 0;
  newBattle.cardPlayCounts = { ...(newBattle.cardPlayCounts || {}), [card.id]: prevPlayCount + 1 };
  const currentPlayCount = newBattle.cardPlayCounts[card.id];

  const effects = card.effects;
  const hitTimes = effects.times || 1;

  // Apply damage to single target (with multi-hit support)
  if (effects.damage && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      let updatedEnemy = { ...newBattle.enemies[enemyIdx] };
      for (let i = 0; i < hitTimes; i++) {
        let dmg = calculateDamage(effects.damage, battle.playerStatusEffects, updatedEnemy.statusEffects, run.items);
        // Multi-hit bonus from relics
        if (hitTimes > 1) {
          const multiBonus = run.items.reduce((sum, item) => sum + (item.effect.multiHitBonus || 0), 0);
          dmg += multiBonus;
        }
        updatedEnemy = applyDamageToEnemy(updatedEnemy, dmg);
      }
      newBattle.enemies[enemyIdx] = updatedEnemy;

      // Apply debuffs to target
      if (effects.applyToTarget) {
        let debuffs = effects.applyToTarget;
        // Safari Bug Report: vulnerable also applies weak
        if (debuffs.vulnerable && run.items.some(i => i.effect.vulnerableAlsoWeak)) {
          debuffs = { ...debuffs, weak: (debuffs.weak || 0) + debuffs.vulnerable };
        }
        newBattle.enemies[enemyIdx] = {
          ...newBattle.enemies[enemyIdx],
          statusEffects: mergeStatusEffects(newBattle.enemies[enemyIdx].statusEffects, debuffs),
        };
      }
    }
  }

  // Deal damage again if target is vulnerable (cascade_delete)
  if (effects.vulnerableDoubleHit && effects.damage && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const originalEnemy = battle.enemies.find(e => e.instanceId === targetInstanceId);
      const wasVulnerable = (originalEnemy?.statusEffects.vulnerable || 0) > 0;
      if (wasVulnerable) {
        const bonusDmg = calculateDamage(effects.damage, battle.playerStatusEffects, originalEnemy!.statusEffects, run.items);
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], bonusDmg);
      }
    }
  }

  // Deal damage equal to current block to target (block_and_load, etc.)
  if (effects.damageEqualToBlock && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const blockAmt = Math.max(1, battle.playerBlock || 0);
      const dmg = calculateDamage(blockAmt, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
      newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
    }
  }

  // Deal damage equal to current block to ALL enemies (fortress_strike, dom_nuke)
  if (effects.damageAllEqualToBlock) {
    const blockAmt = Math.max(1, battle.playerBlock || 0);
    newBattle.enemies = newBattle.enemies.map(enemy => {
      const dmg = calculateDamage(blockAmt, battle.playerStatusEffects, enemy.statusEffects, run.items);
      return applyDamageToEnemy(enemy, dmg);
    });
  }

  // Step 2 — Temperature heatUp/coolDown (must run before hot/cold conditionals)
  if (effects.heatUp) {
    const next = (newBattle.temperature ?? 5) + effects.heatUp;
    if (next >= 10) {
      // Overflow: deal 12 AoE, reset to 5
      newBattle.enemies = newBattle.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(12, battle.playerStatusEffects, e.statusEffects, run.items)));
      newBattle.temperature = 5;
    } else {
      newBattle.temperature = next;
    }
  }
  if (effects.coolDown) {
    const next = (newBattle.temperature ?? 5) - effects.coolDown;
    if (next <= 0) {
      // Freeze: gain 15 block, reset to 5
      newBattle.playerBlock = (newBattle.playerBlock || 0) + 15;
      newBattle.temperature = 5;
    } else {
      newBattle.temperature = next;
    }
  }

  // Step 3 — Temperature conditional bonuses (damageIfHot, damageAllIfHot, blockIfCold)
  // Uses newBattle.temperature so heatUp/coolDown above are already applied
  if (effects.damageIfHot && (newBattle.temperature ?? 5) >= 7 && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const dmg = calculateDamage(effects.damageIfHot, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
      newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
    }
  }
  if (effects.damageAllIfHot && (newBattle.temperature ?? 5) >= 7) {
    newBattle.enemies = newBattle.enemies.map(e => {
      const dmg = calculateDamage(effects.damageAllIfHot!, battle.playerStatusEffects, e.statusEffects, run.items);
      return applyDamageToEnemy(e, dmg);
    });
  }
  if (effects.blockIfCold && (newBattle.temperature ?? 5) <= 3) {
    newBattle.playerBlock = (newBattle.playerBlock || 0) + effects.blockIfCold;
  }

  // Apply damage to all enemies
  if (effects.damageAll) {
    newBattle.enemies = newBattle.enemies.map(enemy => {
      const dmg = calculateDamage(effects.damageAll!, battle.playerStatusEffects, enemy.statusEffects, run.items);
      return applyDamageToEnemy(enemy, dmg);
    });
  }

  // Apply status effects to all enemies
  if (effects.applyToAll) {
    let allDebuffs = effects.applyToAll;
    if (allDebuffs.vulnerable && run.items.some(i => i.effect.vulnerableAlsoWeak)) {
      allDebuffs = { ...allDebuffs, weak: (allDebuffs.weak || 0) + allDebuffs.vulnerable };
    }
    newBattle.enemies = newBattle.enemies.map(enemy => ({
      ...enemy,
      statusEffects: mergeStatusEffects(enemy.statusEffects, allDebuffs),
    }));
  }

  // Apply block
  if (effects.block) {
    const block = calculateBlock(effects.block, battle.playerStatusEffects, run.items);
    newBattle.playerBlock = (newBattle.playerBlock || 0) + block;
  }

  // Bonus block if player already had block before this card was played (shadow_dom)
  if (effects.bonusBlockIfHasBlock && (battle.playerBlock || 0) > 0) {
    newBattle.playerBlock = (newBattle.playerBlock || 0) + effects.bonusBlockIfHasBlock;
  }

  // Bonus block if player has Counter-Offer (tcp_handshake)
  if (effects.bonusBlockIfCounterOffer && (newBattle.playerStatusEffects.counterOffer || 0) > 0) {
    const bonusBlock = calculateBlock(effects.bonusBlockIfCounterOffer, battle.playerStatusEffects, run.items);
    newBattle.playerBlock = (newBattle.playerBlock || 0) + bonusBlock;
  }

  // Clear block after all block-to-damage conversions resolve (dom_nuke)
  if (effects.clearBlock) {
    newBattle.playerBlock = 0;
  }

  // Consume nextCardCostZero flag (fast_refresh / event_bubbling)
  if (battle.nextCardCostZero) {
    newBattle.nextCardCostZero = false;
  }

  // Deal N × cardsPlayedThisTurn to target (batched_update, component_did_mount)
  if (effects.damagePerCardPlayed && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const totalDmg = effects.damagePerCardPlayed * newBattle.cardsPlayedThisTurn;
      const dmg = calculateDamage(totalDmg, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
      newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
    }
  }

  // Deal N × cardsPlayedThisTurn to ALL enemies (production_build, full_rerender)
  if (effects.damageAllPerCardPlayed) {
    const totalDmg = effects.damageAllPerCardPlayed * newBattle.cardsPlayedThisTurn;
    newBattle.enemies = newBattle.enemies.map(enemy => {
      const dmg = calculateDamage(totalDmg, battle.playerStatusEffects, enemy.statusEffects, run.items);
      return applyDamageToEnemy(enemy, dmg);
    });
  }

  // Set nextCardCostZero flag (fast_refresh / event_bubbling)
  if (effects.nextCardCostZero) {
    newBattle.nextCardCostZero = true;
  }

  // Apply copium — directly reduces stress
  if (effects.copium) {
    stressReduction = calculateCopium(effects.copium, battle.playerStatusEffects, run.items);
  }

  // Apply self buffs
  if (effects.applyToSelf) {
    newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, effects.applyToSelf);
  }

  // Apply target debuffs (for cards like code_review that only apply debuffs)
  if (effects.applyToTarget && targetInstanceId && !effects.damage) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      let debuffs = effects.applyToTarget;
      if (debuffs.vulnerable && run.items.some(i => i.effect.vulnerableAlsoWeak)) {
        debuffs = { ...debuffs, weak: (debuffs.weak || 0) + debuffs.vulnerable };
      }
      newBattle.enemies[enemyIdx] = {
        ...newBattle.enemies[enemyIdx],
        statusEffects: mergeStatusEffects(newBattle.enemies[enemyIdx].statusEffects, debuffs),
      };
    }
  }

  // Draw cards
  if (effects.draw) {
    const { drawn, newDrawPile, newDiscardPile } = drawCards(
      newBattle.drawPile,
      newBattle.discardPile,
      effects.draw
    );
    newBattle.hand = [...newBattle.hand, ...drawn];
    newBattle.drawPile = newDrawPile;
    newBattle.discardPile = newDiscardPile;
  }

  // Discard cards after drawing (hydration)
  if (effects.discardAfterDraw && effects.discardAfterDraw > 0 && newBattle.hand.length > 0) {
    for (let i = 0; i < effects.discardAfterDraw && newBattle.hand.length > 0; i++) {
      const idx = Math.floor(Math.random() * newBattle.hand.length);
      const [discarded] = newBattle.hand.splice(idx, 1);
      newBattle.discardPile = [...newBattle.discardPile, discarded];
    }
  }

  // Gain energy
  if (effects.energy) {
    newBattle.energy += effects.energy;
  }

  // Self damage
  if (effects.selfDamage) {
    let selfDmg = effects.selfDamage;
    // Safety Filter relic: halve self-damage
    if (run.items.some(i => i.effect.selfDamageHalved)) {
      selfDmg = Math.floor(selfDmg / 2);
    }
    hpChange -= selfDmg;
    // Chaos Monkey relic: reflect self-damage to random enemy
    if (run.items.some(i => i.effect.selfDamageReflect) && newBattle.enemies.length > 0) {
      const randIdx = Math.floor(Math.random() * newBattle.enemies.length);
      newBattle.enemies[randIdx] = applyDamageToEnemy(newBattle.enemies[randIdx], selfDmg);
    }
  }

  // Add stress
  if (effects.addStress) {
    let stressAdd = effects.addStress;
    if (run.items.some(i => i.effect.stressGainHalved)) {
      stressAdd = Math.floor(stressAdd / 2);
    }
    stressChange += stressAdd;
  }

  // Heal HP
  if (effects.heal) {
    hpChange += effects.heal;
  }

  // Gain gold
  if (effects.gainGold) {
    goldChange += effects.gainGold;
  }

  // Step 4 — Token Economy effects
  if (effects.generateTokens) {
    newBattle.tokens = (newBattle.tokens ?? 0) + effects.generateTokens;
  }
  if (effects.doubleTokens) {
    newBattle.tokens = (newBattle.tokens ?? 0) * 2;
  }
  if (effects.damagePerToken && targetInstanceId && (newBattle.tokens ?? 0) > 0) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const dmg = calculateDamage(newBattle.tokens!, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
      newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      newBattle.tokens = 0;
    }
  }
  if (effects.blockPerToken && (newBattle.tokens ?? 0) > 0) {
    newBattle.playerBlock = (newBattle.playerBlock || 0) + newBattle.tokens!;
    newBattle.tokens = 0;
  }
  if (effects.damageAllPerToken && (newBattle.tokens ?? 0) > 0) {
    const tokenDmgBase = Math.floor(newBattle.tokens! * 0.5);
    if (tokenDmgBase > 0) {
      newBattle.enemies = newBattle.enemies.map(e => {
        const dmg = calculateDamage(tokenDmgBase, battle.playerStatusEffects, e.statusEffects, run.items);
        return applyDamageToEnemy(e, dmg);
      });
    }
    newBattle.tokens = 0;
  }

  // Step 5 — Training Loop effects
  if (effects.damagePerTimesPlayed && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const bonus = effects.damagePerTimesPlayed * currentPlayCount;
      if (bonus > 0) {
        const dmg = calculateDamage(bonus, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      }
    }
  }
  if (effects.blockPerTimesPlayed) {
    const bonus = effects.blockPerTimesPlayed * currentPlayCount;
    if (bonus > 0) {
      newBattle.playerBlock = (newBattle.playerBlock || 0) + calculateBlock(bonus, battle.playerStatusEffects, run.items);
    }
  }
  if (effects.bonusAtSecondPlay && currentPlayCount >= 2) {
    const bonus = effects.bonusAtSecondPlay;
    if (bonus.damage && targetInstanceId) {
      const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
      if (enemyIdx !== -1) {
        const dmg = calculateDamage(bonus.damage, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      }
    }
    if (bonus.block) {
      newBattle.playerBlock = (newBattle.playerBlock || 0) + calculateBlock(bonus.block, battle.playerStatusEffects, run.items);
    }
    if (bonus.draw) {
      const { drawn: bDrawn, newDrawPile: bDp, newDiscardPile: bDisc } = drawCards(newBattle.drawPile, newBattle.discardPile, bonus.draw);
      newBattle.hand = [...newBattle.hand, ...bDrawn];
      newBattle.drawPile = bDp;
      newBattle.discardPile = bDisc;
    }
    if (bonus.copium) {
      stressReduction += calculateCopium(bonus.copium, battle.playerStatusEffects, run.items);
    }
    if (bonus.energy) {
      newBattle.energy += bonus.energy;
    }
  }

  // Exhaust random cards from hand
  if (effects.exhaustRandom && effects.exhaustRandom > 0) {
    for (let i = 0; i < effects.exhaustRandom && newBattle.hand.length > 0; i++) {
      const idx = Math.floor(Math.random() * newBattle.hand.length);
      const [exhausted] = newBattle.hand.splice(idx, 1);
      newBattle.exhaustPile = [...newBattle.exhaustPile, exhausted];
      triggerExhaustRelics(newBattle, run);
    }
  }

  // Exhaust from draw pile
  if (effects.exhaustFromDraw && effects.exhaustFromDraw > 0) {
    for (let i = 0; i < effects.exhaustFromDraw && newBattle.drawPile.length > 0; i++) {
      const idx = Math.floor(Math.random() * newBattle.drawPile.length);
      const [exhausted] = newBattle.drawPile.splice(idx, 1);
      newBattle.exhaustPile = [...newBattle.exhaustPile, exhausted];
      triggerExhaustRelics(newBattle, run);
    }
  }

  // Exhaust all cards in hand (strangler_fig, the_big_rewrite, final_sprint)
  let cardsExhaustedThisPlay = 0;
  if (effects.exhaustAllHand) {
    const handCopy = [...newBattle.hand];
    newBattle.hand = [];
    for (const c of handCopy) {
      newBattle.exhaustPile = [...newBattle.exhaustPile, c];
      cardsExhaustedThisPlay++;
      triggerExhaustRelics(newBattle, run);
    }
  }

  // Deal damage per card exhausted (strangler_fig, final_sprint)
  if (effects.damagePerCardExhausted && cardsExhaustedThisPlay > 0 && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const totalDmg = effects.damagePerCardExhausted * cardsExhaustedThisPlay;
      const dmg = calculateDamage(totalDmg, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
      newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
    }
  }

  // Shuffle discard pile into draw pile (time_travel_debug, the_pivot)
  if (effects.shuffleDiscardToDraw) {
    const combined = [...newBattle.drawPile, ...newBattle.discardPile];
    // Fisher-Yates shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    newBattle.drawPile = combined;
    newBattle.discardPile = [];
  }

  // Heal to full HP (the_offer)
  if (effects.healFull) {
    hpChange += run.maxHp - run.hp; // net heal to full
  }

  // Track power plays
  if (card.type === 'power') {
    newBattle.powersPlayedThisCombat = (battle.powersPlayedThisCombat || 0) + 1;
    if (!battle.firstPowerPlayedThisCombat) {
      newBattle.firstPowerPlayedThisCombat = true;
    }
  }

  // Relic triggers: onPlayAttack
  if (card.type === 'attack') {
    if (!battle.firstAttackPlayedThisTurn) {
      newBattle.firstAttackPlayedThisTurn = true;
      for (const item of run.items) {
        if (item.effect.energyOnFirstAttack) {
          newBattle.energy += item.effect.energyOnFirstAttack;
        }
      }
    }
    for (const item of run.items) {
      if (item.effect.onPlayAttack) {
        if (item.effect.onPlayAttack.block) {
          newBattle.playerBlock += item.effect.onPlayAttack.block;
        }
        if (item.effect.onPlayAttack.draw) {
          const { drawn: d, newDrawPile: ndp, newDiscardPile: ndisc } = drawCards(newBattle.drawPile, newBattle.discardPile, item.effect.onPlayAttack.draw);
          newBattle.hand = [...newBattle.hand, ...d];
          newBattle.drawPile = ndp;
          newBattle.discardPile = ndisc;
        }
      }
    }
  }

  // Relic triggers: onPlaySkill
  if (card.type === 'skill') {
    if (!battle.firstSkillPlayedThisTurn) {
      newBattle.firstSkillPlayedThisTurn = true;
      for (const item of run.items) {
        if (item.effect.drawOnFirstSkill) {
          const { drawn: d, newDrawPile: ndp, newDiscardPile: ndisc } = drawCards(newBattle.drawPile, newBattle.discardPile, item.effect.drawOnFirstSkill);
          newBattle.hand = [...newBattle.hand, ...d];
          newBattle.drawPile = ndp;
          newBattle.discardPile = ndisc;
        }
        if (item.effect.firstSkillBlock) {
          newBattle.playerBlock += item.effect.firstSkillBlock;
        }
      }
    }
  }

  // Relic triggers: onPlayPower
  if (card.type === 'power') {
    for (const item of run.items) {
      if (item.effect.onPlayPower) {
        if (item.effect.onPlayPower.draw) {
          const { drawn: d, newDrawPile: ndp, newDiscardPile: ndisc } = drawCards(newBattle.drawPile, newBattle.discardPile, item.effect.onPlayPower.draw);
          newBattle.hand = [...newBattle.hand, ...d];
          newBattle.drawPile = ndp;
          newBattle.discardPile = ndisc;
        }
        if (item.effect.onPlayPower.block) {
          newBattle.playerBlock += item.effect.onPlayPower.block;
        }
      }
      if (item.effect.firstPowerDraw && newBattle.powersPlayedThisCombat <= 1) {
        // Only on first power each turn (simplified: per combat tracking)
      }
    }
    // Microservices Diagram: each power gives +1 permanent damage
    for (const item of run.items) {
      if (item.effect.perPowerPlayed) {
        if (item.effect.perPowerPlayed.confidence) {
          newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { confidence: item.effect.perPowerPlayed.confidence });
        }
        if (item.effect.perPowerPlayed.resilience) {
          newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { resilience: item.effect.perPowerPlayed.resilience });
        }
      }
    }
  }

  // Cards played threshold relics (React Fiber: 3+ cards = +1 energy)
  for (const item of run.items) {
    if (item.effect.cardsPlayedEnergy && item.effect.cardsPlayedThreshold) {
      if (newBattle.cardsPlayedThisTurn === item.effect.cardsPlayedThreshold) {
        newBattle.energy += item.effect.cardsPlayedEnergy;
      }
    }
  }

  // Move card to appropriate pile
  const shouldExhaust = card.type === 'power' || card.exhaust;
  if (shouldExhaust) {
    newBattle.exhaustPile = [...newBattle.exhaustPile, card];
    // Trigger exhaust relics for the card itself (only for non-power exhaust cards)
    if (card.exhaust) {
      triggerExhaustRelics(newBattle, run);
    }
  } else {
    newBattle.discardPile = [...newBattle.discardPile, card];
  }

  // Deploy a service (Architect deployment cards)
  if (effects.deploy) {
    const deps = [...(newBattle.deployments || [])];
    if (deps.length >= 3) deps.shift(); // oldest slot replaced when full
    deps.push({
      name: effects.deploy.name,
      icon: effects.deploy.icon,
      turnsLeft: effects.deploy.turns,
      attackPerTurn: effects.deploy.attackPerTurn,
      blockPerTurn: effects.deploy.blockPerTurn,
      poisonPerTurn: effects.deploy.poisonPerTurn,
    });
    newBattle.deployments = deps;
  }

  // Deploy multiple services at once (outsource_everything)
  if (effects.deployMultiple) {
    const deps: Deployment[] = [];
    for (const d of effects.deployMultiple) {
      deps.push({
        name: d.name, icon: d.icon, turnsLeft: d.turns,
        attackPerTurn: d.attackPerTurn, blockPerTurn: d.blockPerTurn, poisonPerTurn: d.poisonPerTurn,
      });
    }
    newBattle.deployments = deps.slice(0, 3); // fill all 3 slots, replacing anything existing
  }

  // Remove dead enemies and track kills + gold earned
  const deadEnemies = newBattle.enemies.filter(e => e.currentHp <= 0);
  newBattle.killCount = (newBattle.killCount || 0) + deadEnemies.length;
  newBattle.goldEarned = (newBattle.goldEarned || 0) + deadEnemies.reduce((sum, e) => sum + (e.gold || 0), 0);
  newBattle.enemies = newBattle.enemies.filter(e => e.currentHp > 0);

  return { battle: newBattle, stressReduction, hpChange, stressChange, goldChange };
}

function triggerExhaustRelics(battle: BattleState, run: RunState): void {
  for (const item of run.items) {
    if (item.effect.onExhaust) {
      if (item.effect.onExhaust.block) {
        battle.playerBlock += item.effect.onExhaust.block;
      }
      if (item.effect.onExhaust.draw) {
        const { drawn, newDrawPile, newDiscardPile } = drawCards(battle.drawPile, battle.discardPile, item.effect.onExhaust.draw);
        battle.hand = [...battle.hand, ...drawn];
        battle.drawPile = newDrawPile;
        battle.discardPile = newDiscardPile;
      }
      if (item.effect.onExhaust.damage && battle.enemies.length > 0) {
        const randIdx = Math.floor(Math.random() * battle.enemies.length);
        battle.enemies[randIdx] = applyDamageToEnemy(battle.enemies[randIdx], item.effect.onExhaust.damage);
      }
    }
    if (item.effect.exhaustSynergyDamage && battle.enemies.length > 0) {
      const randIdx = Math.floor(Math.random() * battle.enemies.length);
      battle.enemies[randIdx] = applyDamageToEnemy(battle.enemies[randIdx], item.effect.exhaustSynergyDamage);
    }
    if (item.effect.exhaustSynergyBlock) {
      battle.playerBlock += item.effect.exhaustSynergyBlock;
    }
    if (item.effect.exhaustGainEnergy) {
      battle.energy += 1;
    }
    // Draw 1 card when exhausting (event_driven relic)
    if (item.effect.exhaustDrawCard) {
      const { drawn, newDrawPile, newDiscardPile } = drawCards(battle.drawPile, battle.discardPile, 1);
      battle.hand = [...battle.hand, ...drawn];
      battle.drawPile = newDrawPile;
      battle.discardPile = newDiscardPile;
    }
    // Double trigger
    if (item.effect.exhaustDoubleTrigger) {
      // The above effects already triggered once; trigger relevant ones again
      if (item.effect.onExhaust) {
        if (item.effect.onExhaust.block) battle.playerBlock += item.effect.onExhaust.block;
        if (item.effect.onExhaust.damage && battle.enemies.length > 0) {
          const randIdx = Math.floor(Math.random() * battle.enemies.length);
          battle.enemies[randIdx] = applyDamageToEnemy(battle.enemies[randIdx], item.effect.onExhaust.damage);
        }
      }
    }
  }
}

export function executeEnemyTurn(
  battle: BattleState,
  run: RunState
): { battle: BattleState; playerHp: number; playerStress: number; enemiesVanished: number; enemiesKilled: number; vanishedIds: string[]; goldChange: number } {
  const newBattle = {
    ...battle,
    hand: [...battle.hand],
    drawPile: [...battle.drawPile],
    discardPile: [...battle.discardPile],
    exhaustPile: [...battle.exhaustPile],
    enemies: battle.enemies.map(e => ({ ...e, statusEffects: { ...e.statusEffects } })),
    playerStatusEffects: { ...battle.playerStatusEffects },
  };
  let playerHp = run.hp;
  let playerStress = run.stress;
  let goldChange = 0;

  const enemiesToRemove: string[] = [];

  // Each enemy acts
  newBattle.enemies = newBattle.enemies.map(enemy => {
    const move = enemy.currentMove;
    let updatedEnemy = { ...enemy };

    // Reset enemy block
    updatedEnemy.block = 0;

    // Enemy regen (heal at start of action)
    if ((updatedEnemy.statusEffects.regen || 0) > 0) {
      updatedEnemy.currentHp = Math.min(
        updatedEnemy.maxHp,
        updatedEnemy.currentHp + (updatedEnemy.statusEffects.regen || 0)
      );
    }

    const thorns = newBattle.playerStatusEffects.counterOffer || 0;

    switch (move.type) {
      case 'attack': {
        const times = move.times || 1;
        for (let i = 0; i < times; i++) {
          const dmg = calculateDamage(
            move.damage || 0,
            enemy.statusEffects,
            newBattle.playerStatusEffects
          );
          const result = applyDamageToPlayer(playerHp, newBattle.playerBlock, dmg);
          playerHp = result.hp;
          newBattle.playerBlock = result.block;
        }
        // Counter-Offer thorns
        if (thorns > 0) {
          updatedEnemy = applyDamageToEnemy(updatedEnemy, thorns);
        }
        // Some attacks also deal stress as a rider
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'stress_attack': {
        const times = move.times || 1;
        for (let i = 0; i < times; i++) {
          const stressDmg = calculateStressDamage(
            move.stressDamage || 0,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'dual_attack': {
        // HP damage
        if (move.damage) {
          const dmg = calculateDamage(
            move.damage,
            enemy.statusEffects,
            newBattle.playerStatusEffects
          );
          const hpResult = applyDamageToPlayer(playerHp, newBattle.playerBlock, dmg);
          playerHp = hpResult.hp;
          newBattle.playerBlock = hpResult.block;
          // Counter-Offer thorns
          if (thorns > 0) {
            updatedEnemy = applyDamageToEnemy(updatedEnemy, thorns);
          }
        }
        // Stress damage
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'discard': {
        // Discard random cards from hand
        const discardCount = move.discardCount || 1;
        for (let i = 0; i < discardCount && newBattle.hand.length > 0; i++) {
          const idx = Math.floor(Math.random() * newBattle.hand.length);
          const [discarded] = newBattle.hand.splice(idx, 1);
          newBattle.discardPile = [...newBattle.discardPile, discarded];
        }
        // Discard moves can also deal stress
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'exhaust': {
        // Exhaust random cards from hand (removed from combat entirely)
        const exhaustCount = move.exhaustCount || 1;
        for (let i = 0; i < exhaustCount && newBattle.hand.length > 0; i++) {
          const idx = Math.floor(Math.random() * newBattle.hand.length);
          const [exhausted] = newBattle.hand.splice(idx, 1);
          newBattle.exhaustPile = [...newBattle.exhaustPile, exhausted];
        }
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'buff_allies': {
        // Apply buffs to all OTHER enemies (not self)
        if (move.applyToTarget) {
          newBattle.enemies = newBattle.enemies.map(e => {
            if (e.instanceId === enemy.instanceId) return e;
            return {
              ...e,
              statusEffects: mergeStatusEffects(e.statusEffects, move.applyToTarget!),
            };
          });
        }
        break;
      }
      case 'gold_steal': {
        // Steal gold from the player
        const steal = move.goldSteal || 0;
        goldChange -= steal;
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'heal_allies': {
        // Heal all OTHER enemies
        const healAmt = move.healAmount || 0;
        newBattle.enemies = newBattle.enemies.map(e => {
          if (e.instanceId === enemy.instanceId) return e;
          return {
            ...e,
            currentHp: Math.min(e.maxHp, e.currentHp + healAmt),
          };
        });
        break;
      }
      case 'defend': {
        updatedEnemy.block += move.block || 0;
        break;
      }
      case 'buff': {
        if (move.applyToSelf) {
          updatedEnemy.statusEffects = mergeStatusEffects(updatedEnemy.statusEffects, move.applyToSelf);
        }
        break;
      }
      case 'debuff': {
        if (move.applyToTarget) {
          newBattle.playerStatusEffects = mergeStatusEffects(
            newBattle.playerStatusEffects,
            move.applyToTarget
          );
        }
        // Ghost Company vanish: after applying ghosted on move index 2, mark for removal
        if (enemy.id === 'ghost_company' && enemy.moveIndex === 2) {
          enemiesToRemove.push(enemy.instanceId);
        }
        break;
      }
      case 'attack_defend': {
        const dmg = calculateDamage(
          move.damage || 0,
          enemy.statusEffects,
          newBattle.playerStatusEffects
        );
        const result = applyDamageToPlayer(playerHp, newBattle.playerBlock, dmg);
        playerHp = result.hp;
        newBattle.playerBlock = result.block;
        updatedEnemy.block += move.block || 0;
        // Counter-Offer thorns
        if (thorns > 0) {
          updatedEnemy = applyDamageToEnemy(updatedEnemy, thorns);
        }
        if (move.applyToSelf) {
          updatedEnemy.statusEffects = mergeStatusEffects(updatedEnemy.statusEffects, move.applyToSelf);
        }
        break;
      }
    }

    // Phase transition check + advance move index
    if (updatedEnemy.phases && updatedEnemy.phases.length > 0) {
      const hpPercent = (updatedEnemy.currentHp / updatedEnemy.maxHp) * 100;
      let targetPhaseIdx = -1;
      for (let pi = 0; pi < updatedEnemy.phases.length; pi++) {
        if (hpPercent <= updatedEnemy.phases[pi].hpPercent) {
          targetPhaseIdx = pi;
        }
      }
      const prevPhase = updatedEnemy.currentPhaseIndex ?? -1;
      if (targetPhaseIdx > prevPhase) {
        // New phase entered — apply onEnter buffs and jump to phase moves
        updatedEnemy.currentPhaseIndex = targetPhaseIdx;
        const phase = updatedEnemy.phases[targetPhaseIdx];
        if (phase.onEnter) {
          updatedEnemy.statusEffects = mergeStatusEffects(updatedEnemy.statusEffects, phase.onEnter);
        }
        updatedEnemy.moveIndex = phase.moveStartIndex;
        updatedEnemy.currentMove = updatedEnemy.moves[phase.moveStartIndex];
      } else if (targetPhaseIdx >= 0) {
        // Already in phase — cycle within phase moves only
        const phase = updatedEnemy.phases[targetPhaseIdx];
        const phaseStart = phase.moveStartIndex;
        const phaseEnd = (targetPhaseIdx + 1 < updatedEnemy.phases!.length)
          ? updatedEnemy.phases![targetPhaseIdx + 1].moveStartIndex
          : updatedEnemy.moves.length;
        const phaseMoves = phaseEnd - phaseStart;
        const nextIndex = phaseStart + ((updatedEnemy.moveIndex - phaseStart + 1) % phaseMoves);
        updatedEnemy.moveIndex = nextIndex;
        updatedEnemy.currentMove = updatedEnemy.moves[nextIndex];
      } else {
        // No phase active — normal cycling
        const nextIndex = (updatedEnemy.moveIndex + 1) % updatedEnemy.moves.length;
        updatedEnemy.moveIndex = nextIndex;
        updatedEnemy.currentMove = updatedEnemy.moves[nextIndex];
      }
    } else {
      // No phases defined — normal cycling
      const nextIndex = (updatedEnemy.moveIndex + 1) % updatedEnemy.moves.length;
      updatedEnemy.moveIndex = nextIndex;
      updatedEnemy.currentMove = updatedEnemy.moves[nextIndex];
    }

    // Tick enemy status effects
    updatedEnemy.statusEffects = tickStatusEffects(updatedEnemy.statusEffects);

    return updatedEnemy;
  });

  // Count vanished vs killed (by counter-offer thorns) before filtering
  const enemiesVanished = enemiesToRemove.length;
  const killedEnemies = newBattle.enemies.filter(e =>
    e.currentHp <= 0 && !enemiesToRemove.includes(e.instanceId)
  );
  newBattle.killCount = (newBattle.killCount || 0) + killedEnemies.length;
  // Gold counts for any enemy whose HP hit 0 — if Ghost Company dies before fleeing, it pays out
  newBattle.goldEarned = (newBattle.goldEarned || 0) + newBattle.enemies
    .filter(e => e.currentHp <= 0)
    .reduce((sum, e) => sum + (e.gold || 0), 0);

  // Remove vanished enemies (Ghost Company) and enemies killed by Counter-Offer
  newBattle.enemies = newBattle.enemies.filter(e =>
    e.currentHp > 0 && !enemiesToRemove.includes(e.instanceId)
  );

  // Tick player status effects
  newBattle.playerStatusEffects = tickStatusEffects(newBattle.playerStatusEffects);

  return { battle: newBattle, playerHp, playerStress, enemiesVanished, enemiesKilled: killedEnemies.length, vanishedIds: enemiesToRemove, goldChange };
}

export function startNewTurn(battle: BattleState, run: RunState): { battle: BattleState; stressChange: number; hpChange: number } {
  // Exhaust ethereal cards from hand before discarding
  let etherealExhausted: CardInstance[] = [];
  let handAfterEthereal = battle.hand;
  const etherealCards = battle.hand.filter(c => c.ethereal);
  if (etherealCards.length > 0) {
    etherealExhausted = etherealCards;
    handAfterEthereal = battle.hand.filter(c => !c.ethereal);
  }

  // Reset player block (Savings Account retains up to X)
  const savedBlock = battle.playerStatusEffects.savingsAccount || 0;
  const newBlock = savedBlock > 0 ? Math.min(battle.playerBlock, savedBlock) : 0;

  // Discard hand
  const newDiscard = [...battle.discardPile, ...handAfterEthereal];
  const newExhaust = [...battle.exhaustPile, ...etherealExhausted];
  const extraDraw = run.items.reduce((sum, item) => sum + (item.effect.extraDraw || 0), 0);
  const networkingDraw = battle.playerStatusEffects.networking || 0;
  const drawCount = 5 + extraDraw + networkingDraw;

  const { drawn, newDrawPile, newDiscardPile } = drawCards(battle.drawPile, newDiscard, drawCount);

  let hand = drawn;

  // Ghosted status: add curse cards to hand
  const ghostedStacks = battle.playerStatusEffects.ghosted || 0;
  if (ghostedStacks > 0) {
    const curseDef = getCardDef('ghosted_curse');
    if (curseDef) {
      for (let i = 0; i < ghostedStacks; i++) {
        hand = [...hand, createCardInstance(curseDef)];
      }
    }
  }

  // Hustle Culture: bonus energy
  const hustleEnergy = battle.playerStatusEffects.hustleCulture || 0;

  // Stress changes from buffs
  let stressChange = 0;
  let hpChange = 0;

  // Curse cards drawn add 5 stress each
  const cursesDrawn = hand.filter(c => c.type === 'curse').length;
  if (cursesDrawn > 0) stressChange += cursesDrawn * 5;

  // Apply player poison damage (poison ticks each turn, tickStatusEffects decrements it after)
  if ((battle.playerStatusEffects.poison || 0) > 0) {
    hpChange -= battle.playerStatusEffects.poison!;
  }
  // Self Care: reduce stress
  const selfCare = battle.playerStatusEffects.selfCare || 0;
  if (selfCare > 0) stressChange -= selfCare;
  // Hustle Culture: gain stress
  if (hustleEnergy > 0) stressChange += 3 * hustleEnergy;

  // Relic: confidencePerTurn (fine_tuning, scaling_laws handled via powers, but some relics give it)
  let turnStartStatusMerge: import('../types').StatusEffect = {};
  for (const item of run.items) {
    if (item.effect.confidencePerTurn) {
      turnStartStatusMerge.confidence = (turnStartStatusMerge.confidence || 0) + item.effect.confidencePerTurn;
    }
    if (item.effect.blockPerTurn) {
      // Added to block below
    }
    if (item.effect.copiumPerTurn) {
      stressChange -= item.effect.copiumPerTurn;
    }
    if (item.effect.confidenceIfHasConfidence && (battle.playerStatusEffects.confidence || 0) > 0) {
      turnStartStatusMerge.confidence = (turnStartStatusMerge.confidence || 0) + 1;
    }
  }

  let blockBonus = 0;
  for (const item of run.items) {
    if (item.effect.blockPerTurn) {
      blockBonus += item.effect.blockPerTurn;
    }
  }

  const mergedStatus = Object.keys(turnStartStatusMerge).length > 0
    ? mergeStatusEffects(battle.playerStatusEffects, turnStartStatusMerge)
    : battle.playerStatusEffects;

  // Process active deployments — they fire at the start of the player's turn
  let deploymentBlock = 0;
  let postDeployEnemies = battle.enemies.map(e => ({ ...e, statusEffects: { ...e.statusEffects } }));
  const activeDeployments: Deployment[] = [];

  for (const dep of (battle.deployments || [])) {
    if (dep.blockPerTurn) {
      deploymentBlock += dep.blockPerTurn;
    }
    if (dep.attackPerTurn && postDeployEnemies.length > 0) {
      const idx = Math.floor(Math.random() * postDeployEnemies.length);
      const dmg = calculateDamage(dep.attackPerTurn, mergedStatus, postDeployEnemies[idx].statusEffects, run.items);
      postDeployEnemies[idx] = applyDamageToEnemy(postDeployEnemies[idx], dmg);
    }
    if (dep.poisonPerTurn && postDeployEnemies.length > 0) {
      const idx = Math.floor(Math.random() * postDeployEnemies.length);
      postDeployEnemies[idx] = {
        ...postDeployEnemies[idx],
        statusEffects: mergeStatusEffects(postDeployEnemies[idx].statusEffects, { poison: dep.poisonPerTurn }),
      };
    }
    const remaining = dep.turnsLeft - 1;
    if (remaining > 0) {
      activeDeployments.push({ ...dep, turnsLeft: remaining });
    }
  }
  // Remove enemies killed by deployments
  postDeployEnemies = postDeployEnemies.filter(e => e.currentHp > 0);

  return {
    battle: {
      ...battle,
      hand,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      exhaustPile: newExhaust,
      energy: battle.maxEnergy + hustleEnergy,
      playerBlock: newBlock + blockBonus + deploymentBlock,
      playerStatusEffects: mergedStatus,
      enemies: postDeployEnemies,
      deployments: activeDeployments,
      turn: battle.turn + 1,
      cardsPlayedThisTurn: 0,
      firstAttackPlayedThisTurn: false,
      firstSkillPlayedThisTurn: false,
      nextCardCostZero: false,
      temperature: battle.temperature ?? 5,
      tokens: battle.tokens ?? 0,
      cardPlayCounts: battle.cardPlayCounts ?? {},
    },
    stressChange,
    hpChange,
  };
}
