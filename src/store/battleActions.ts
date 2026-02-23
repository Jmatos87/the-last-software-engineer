import { v4 as uuidv4 } from 'uuid';
import type { BattleState, Deployment, EnemyDef, EnemyInstance, RunState, CardInstance, QueuedEffect, EngineerEvoke } from '../types';
import { createCardInstance, shuffleDeck, drawCards } from '../utils/deckUtils';
import { cards, getCardDef } from '../data/cards';
import { enemies } from '../data/enemies';
import { generateBlueprint, engineerRoster } from '../data/engineers';
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

// ── Engineer Slot Helpers ──
// Both helpers mutate the battle object in place (newBattle is const in executePlayCard)

function applyEvokeEffect(
  b: BattleState,
  run: RunState,
  evoke: EngineerEvoke
): void {
  if (evoke.block) b.playerBlock = (b.playerBlock || 0) + evoke.block;
  if (evoke.energy) b.energy = (b.energy || 0) + evoke.energy;

  if (evoke.draw && evoke.draw > 0) {
    const { drawn, newDrawPile, newDiscardPile } = drawCards(b.drawPile, b.discardPile, evoke.draw);
    b.hand = [...b.hand, ...drawn];
    b.drawPile = newDrawPile;
    b.discardPile = newDiscardPile;
  }

  // Single-target damage (+ optional token scaling)
  if (evoke.damage !== undefined || evoke.damageScalesWithTokens !== undefined) {
    const baseDmg = evoke.damage || 0;
    const tokenBonus = evoke.damageScalesWithTokens
      ? Math.floor((b.tokens || 0) * evoke.damageScalesWithTokens)
      : 0;
    const totalDmg = baseDmg + tokenBonus;
    if (totalDmg > 0 && b.enemies.length > 0) {
      const idx = Math.floor(Math.random() * b.enemies.length);
      const dmg = calculateDamage(totalDmg, b.playerStatusEffects, b.enemies[idx].statusEffects, run.items);
      b.enemies = b.enemies.map((e, i) => i === idx ? applyDamageToEnemy(e, dmg) : e);
    }
  }

  // AoE damage
  if (evoke.damageAll) {
    const damageAllAmt = evoke.damageAll;
    b.enemies = b.enemies.map(e =>
      applyDamageToEnemy(e, calculateDamage(damageAllAmt, b.playerStatusEffects, e.statusEffects, run.items))
    );
  }

  // AoE damage scales with tokens (consumes tokens)
  if (evoke.damageAllScalesWithTokens) {
    const totalDmg = Math.floor((b.tokens || 0) * evoke.damageAllScalesWithTokens);
    if (totalDmg > 0) {
      b.enemies = b.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(totalDmg, b.playerStatusEffects, e.statusEffects, run.items))
      );
    }
    b.tokens = 0;
  }

  if (evoke.applyToAll) {
    const toApply = evoke.applyToAll;
    b.enemies = b.enemies.map(e => ({
      ...e,
      statusEffects: mergeStatusEffects(e.statusEffects, toApply),
    }));
  }

  // applyToSelf: apply status to player
  if (evoke.applyToSelf) {
    b.playerStatusEffects = mergeStatusEffects(b.playerStatusEffects, evoke.applyToSelf);
  }

  // doublePlayerStatus: double all current player status effect stacks
  if (evoke.doublePlayerStatus) {
    const cur = b.playerStatusEffects;
    const toDouble: import('../types').StatusEffect = {};
    if (cur.confidence) toDouble.confidence = cur.confidence;
    if (cur.resilience) toDouble.resilience = cur.resilience;
    if (cur.dodge) toDouble.dodge = cur.dodge;
    if (cur.counterOffer) toDouble.counterOffer = cur.counterOffer;
    if (cur.regen) toDouble.regen = cur.regen;
    if (cur.networking) toDouble.networking = cur.networking;
    if (cur.selfCare) toDouble.selfCare = cur.selfCare;
    if (cur.savingsAccount) toDouble.savingsAccount = cur.savingsAccount;
    b.playerStatusEffects = mergeStatusEffects(cur, toDouble);
  }

  // damageAllScalesWithCounterOffer: deal counterOffer × N to all enemies
  if (evoke.damageAllScalesWithCounterOffer) {
    const coStacks = b.playerStatusEffects.counterOffer || 0;
    const dmg = coStacks * evoke.damageAllScalesWithCounterOffer;
    if (dmg > 0) {
      b.enemies = b.enemies.map(e => applyDamageToEnemy({ ...e }, dmg));
    }
  }

  if (evoke.shuffleDiscardToDraw) {
    const combined = shuffleDeck([...b.drawPile, ...b.discardPile]);
    b.drawPile = combined;
    b.discardPile = [];
  }

  if (evoke.queueBlock) {
    b.detonationQueue = [...b.detonationQueue, { element: 'ice' as const, blockAmount: evoke.queueBlock, turnsUntilFire: 1 }];
  }
  if (evoke.queueDamageAll) {
    b.detonationQueue = [...b.detonationQueue, { element: 'fire' as const, damageAllAmount: evoke.queueDamageAll, turnsUntilFire: 1 }];
  }
  if (evoke.queueChain) {
    b.detonationQueue = [...b.detonationQueue, { element: 'lightning' as const, chainAmount: evoke.queueChain, turnsUntilFire: 1 }];
  }

  if (evoke.damageAllEqualsCounterOffer) {
    const dmgAmt = b.playerStatusEffects.counterOffer || 0;
    if (dmgAmt > 0) {
      b.enemies = b.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(dmgAmt, b.playerStatusEffects, e.statusEffects, run.items))
      );
    }
  }

  if (evoke.gainCounterOfferDouble) {
    const current = b.playerStatusEffects.counterOffer || 0;
    b.playerStatusEffects = mergeStatusEffects(b.playerStatusEffects, { counterOffer: current });
  }

  if (evoke.doubleResilience) {
    const current = b.playerStatusEffects.resilience || 0;
    b.playerStatusEffects = mergeStatusEffects(b.playerStatusEffects, { resilience: current });
  }

  b.enemies = b.enemies.filter(e => e.currentHp > 0);
}

function applyBlueprintComplete(b: BattleState, run: RunState): void {
  const slotsToEvoke = [...b.engineerSlots];
  b.engineerSlots = [];
  b.blueprint = generateBlueprint();
  b.blueprintProgress = 0;
  for (const slot of slotsToEvoke) {
    applyEvokeEffect(b, run, slot.evokeEffect);
  }
  // blueprintCompleteVulnerable relic: apply N Vulnerable to all enemies on blueprint completion
  const bpVuln = run.items.reduce((s, i) => s + (i.effect.blueprintCompleteVulnerable || 0), 0);
  if (bpVuln > 0) {
    b.enemies = b.enemies.map(e => ({
      ...e,
      statusEffects: { ...e.statusEffects, vulnerable: (e.statusEffects.vulnerable || 0) + bpVuln },
    }));
  }
}

export function initBattle(run: RunState, enemyDefs: EnemyDef[]): { battle: BattleState; hpAdjust: number; stressAdjust: number } {
  const enemies: EnemyInstance[] = enemyDefs.map(def => ({
    ...def,
    instanceId: uuidv4(),
    currentHp: def.hp,
    maxHp: def.hp,
    block: 0,
    statusEffects: def.startStatusEffects ? { ...def.startStatusEffects } : {},
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

  // startBattleStress — relics that add stress at combat start
  for (const item of run.items) {
    if (item.effect.startBattleStress) {
      stressAdjust += item.effect.startBattleStress;
    }
  }

  // startSelfBurn — Backend: start combat with N burn on player
  const selfBurnTotal = run.items.reduce((s, i) => s + (i.effect.startSelfBurn || 0), 0);
  if (selfBurnTotal > 0) {
    playerStatusEffects.burn = (playerStatusEffects.burn || 0) + selfBurnTotal;
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

  // domain_model relic: first N cards played cost 0
  const domainModelN = run.items.reduce((n, i) => n + (i.effect.firstNCardsFree || 0), 0);

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
      tokens: run.items.reduce((s, i) => s + (i.effect.startTokens || 0), 0),
      cardPlayCounts: {},
      nextTurnDrawPenalty: 0,
      nextTurnEnergyPenalty: 0,
      flow: Math.min(7, run.items.reduce((s, i) => s + (i.effect.startFlowBonus || 0), 0)),
      nextCardCostReduction: 0,
      detonationQueue: [],
      engineerSlots: [],
      maxEngineerSlots: 3,
      blueprint: generateBlueprint(),
      blueprintProgress: 0,
      // v1.15 new mechanic fields
      dodgedThisTurn: false,
      // v1.16 new mechanic fields
      firstIceUsed: false,
      dodgeScalesDamage: 0,
      burnDoTMultiplier: 1,
      circuitBreakerUsed: false,
      firstNCardsFreeRemaining: domainModelN,
      firstEngineerCardFreeUsed: false,
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

  // Check if first power is free (whiteboard_marker relic — redesigned: firstEngineerCardFree now)
  const effects_for_cost = card.upgraded && card.upgradedEffects ? { ...card.effects, ...card.upgradedEffects } : card.effects;
  let effectiveCost = card.upgraded && card.upgradedCost !== undefined ? card.upgradedCost : card.cost;
  if (card.type === 'power' && !battle.firstPowerPlayedThisCombat) {
    const hasFreeFirstPower = run.items.some(i => i.effect.firstPowerFree);
    if (hasFreeFirstPower) {
      effectiveCost = 0;
    }
  }

  // whiteboard_marker (redesigned): first engineer slot card costs 0
  if (effects_for_cost.slotEngineer && !battle.firstEngineerCardFreeUsed) {
    const hasFreeFirstEngineer = run.items.some(i => i.effect.firstEngineerCardFree);
    if (hasFreeFirstEngineer) {
      effectiveCost = 0;
    }
  }

  // domain_model relic: first N cards cost 0
  if ((battle.firstNCardsFreeRemaining || 0) > 0) {
    effectiveCost = 0;
  }

  // fast_refresh / event_bubbling: next card played this turn costs 0
  if (battle.nextCardCostZero) {
    effectiveCost = 0;
  }

  // Frontend burst: reduceNextCardCost lowers next card by N
  if ((battle.nextCardCostReduction || 0) > 0) {
    effectiveCost = Math.max(0, effectiveCost - battle.nextCardCostReduction);
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

  // Decrement domain_model free card counter
  if ((battle.firstNCardsFreeRemaining || 0) > 0) {
    newBattle.firstNCardsFreeRemaining = battle.firstNCardsFreeRemaining - 1;
  }

  // Step 1 — Training Loop tracking (must be FIRST so playCount is current when effects resolve)
  const prevPlayCount = (newBattle.cardPlayCounts || {})[card.id] || 0;
  newBattle.cardPlayCounts = { ...(newBattle.cardPlayCounts || {}), [card.id]: prevPlayCount + 1 };
  const currentPlayCount = newBattle.cardPlayCounts[card.id];

  const effects = card.upgraded && card.upgradedEffects ? { ...card.effects, ...card.upgradedEffects } : card.effects;
  const hitTimes = effects.times || 1;

  // Apply damage to single target (with multi-hit support)
  if (effects.damage && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      let updatedEnemy = { ...newBattle.enemies[enemyIdx] };
      // Dodge-scaling damage bonus (evasion_protocol power: +N per dodge stack)
      const dodgeScaleBonus = (newBattle.dodgeScalesDamage || 0) * (newBattle.playerStatusEffects.dodge || 0);
      const effectiveDamage = effects.damage + dodgeScaleBonus;
      for (let i = 0; i < hitTimes; i++) {
        let dmg = calculateDamage(effectiveDamage, battle.playerStatusEffects, updatedEnemy.statusEffects, run.items);
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
        // Primed reduces all detonation queue timers immediately
        const primedApplied = effects.applyToTarget.primed ?? 0;
        if (primedApplied > 0 && newBattle.detonationQueue && newBattle.detonationQueue.length > 0) {
          newBattle.detonationQueue = newBattle.detonationQueue.map(qe => ({
            ...qe,
            turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - primedApplied),
          }));
        }
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
  const hotThreshold = run.items.reduce((min, i) => i.effect.hotThreshold !== undefined ? Math.min(min, i.effect.hotThreshold) : min, 7);
  const tempFloor = run.items.reduce((max, i) => i.effect.temperatureFloor !== undefined ? Math.max(max, i.effect.temperatureFloor) : max, 0);

  if (effects.heatUp) {
    const next = (newBattle.temperature ?? 5) + effects.heatUp;
    if (next >= 10) {
      // Overflow: deal 12 AoE
      newBattle.enemies = newBattle.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(12, battle.playerStatusEffects, e.statusEffects, run.items)));
      // overflowBonusDamage relic: extra AoE on temperature overflow
      const tempOverflowBonus = run.items.reduce((s, i) => s + (i.effect.overflowBonusDamage || 0), 0);
      if (tempOverflowBonus > 0) {
        newBattle.enemies = newBattle.enemies.map(e =>
          applyDamageToEnemy(e, calculateDamage(tempOverflowBonus, battle.playerStatusEffects, e.statusEffects, run.items)));
      }
      // overflowEnergyGain relic: gain energy on temperature overflow
      const tempOverflowEnergy = run.items.reduce((s, i) => s + (i.effect.overflowEnergyGain || 0), 0);
      if (tempOverflowEnergy > 0) {
        newBattle.energy = (newBattle.energy || 0) + tempOverflowEnergy;
      }
      // overflowResetToZero relic: reset to 0 instead of 5
      newBattle.temperature = run.items.some(i => i.effect.overflowResetToZero) ? 0 : 5;
    } else {
      newBattle.temperature = next;
    }
  }
  if (effects.coolDown) {
    const next = (newBattle.temperature ?? 5) - effects.coolDown;
    if (tempFloor > 0 && next <= tempFloor) {
      // temperatureFloor relic: can't drop below floor, no freeze
      newBattle.temperature = tempFloor;
    } else if (next <= 0) {
      // Freeze: gain 15 block, reset to 5 (or floor)
      newBattle.playerBlock = (newBattle.playerBlock || 0) + 15;
      newBattle.temperature = Math.max(5, tempFloor);
    } else {
      newBattle.temperature = next;
    }
  }

  // Step 3 — Temperature conditional bonuses (damageIfHot, damageAllIfHot, blockIfCold)
  // Uses newBattle.temperature so heatUp/coolDown above are already applied
  if (effects.damageIfHot && (newBattle.temperature ?? 5) >= hotThreshold && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const dmg = calculateDamage(effects.damageIfHot, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
      newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
    }
  }
  if (effects.damageAllIfHot && (newBattle.temperature ?? 5) >= hotThreshold) {
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
    const dodgeScaleBonusAll = (newBattle.dodgeScalesDamage || 0) * (newBattle.playerStatusEffects.dodge || 0);
    const effectiveDamageAll = effects.damageAll + dodgeScaleBonusAll;
    newBattle.enemies = newBattle.enemies.map(enemy => {
      const dmg = calculateDamage(effectiveDamageAll, battle.playerStatusEffects, enemy.statusEffects, run.items);
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
    // Primed (applyToAll): reduce all detonation queue timers immediately
    const primedAllApplied = effects.applyToAll.primed ?? 0;
    if (primedAllApplied > 0 && newBattle.detonationQueue && newBattle.detonationQueue.length > 0) {
      newBattle.detonationQueue = newBattle.detonationQueue.map(qe => ({
        ...qe,
        turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - primedAllApplied),
      }));
    }
  }

  // Apply block
  if (effects.block) {
    const block = calculateBlock(effects.block, battle.playerStatusEffects, run.items, card.type === 'skill');
    newBattle.playerBlock = (newBattle.playerBlock || 0) + block;
  }

  // Bonus block if player already had block before this card was played (shadow_dom)
  if (effects.bonusBlockIfHasBlock && (battle.playerBlock || 0) > 0) {
    newBattle.playerBlock = (newBattle.playerBlock || 0) + effects.bonusBlockIfHasBlock;
  }

  // Bonus block if player has Counter-Offer (tcp_handshake)
  if (effects.bonusBlockIfCounterOffer && (newBattle.playerStatusEffects.counterOffer || 0) > 0) {
    const bonusBlock = calculateBlock(effects.bonusBlockIfCounterOffer, battle.playerStatusEffects, run.items, card.type === 'skill');
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

  // Consume nextCardCostReduction flag (Frontend burst: minify, hot_key, tree_shake_burst)
  if ((battle.nextCardCostReduction || 0) > 0) {
    newBattle.nextCardCostReduction = 0;
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

  // Set nextCardCostReduction flag (Frontend burst: minify, hot_key, tree_shake_burst)
  if (effects.reduceNextCardCost) {
    newBattle.nextCardCostReduction = (newBattle.nextCardCostReduction || 0) + effects.reduceNextCardCost;
  }

  // ── Frontend Flow State mechanic ──────────────────────────────────────────
  // Step A: increment flow (auto +1 per card played) + any extra flow from this card
  {
    const flowIncrement = 1 + (effects.gainExtraFlow || 0);
    const flowNext = (newBattle.flow ?? 0) + flowIncrement;
    if (flowNext >= 8) {
      // Overflow: deal 10 AoE damage, gain 2 Dodge, reset flow to 0
      newBattle.enemies = newBattle.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(10, battle.playerStatusEffects, e.statusEffects, run.items)));
      newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { dodge: 2 });
      // overflowBonusDamage relic: extra AoE on overflow
      const overflowBonus = run.items.reduce((s, i) => s + (i.effect.overflowBonusDamage || 0), 0);
      if (overflowBonus > 0) {
        newBattle.enemies = newBattle.enemies.map(e =>
          applyDamageToEnemy(e, calculateDamage(overflowBonus, battle.playerStatusEffects, e.statusEffects, run.items)));
      }
      // drawOnOverflow relic: draw cards after overflow
      const drawAfterOverflow = run.items.reduce((s, i) => s + (i.effect.drawOnOverflow || 0), 0);
      if (drawAfterOverflow > 0) {
        const { drawn: oDraw, newDrawPile: oDP, newDiscardPile: oDis } = drawCards(newBattle.drawPile, newBattle.discardPile, drawAfterOverflow);
        newBattle.hand = [...newBattle.hand, ...oDraw];
        newBattle.drawPile = oDP;
        newBattle.discardPile = oDis;
      }
      // dodgeOnOverflow relic: gain dodge after overflow
      const dodgeAfterOverflow = run.items.reduce((s, i) => s + (i.effect.dodgeOnOverflow || 0), 0);
      if (dodgeAfterOverflow > 0) {
        newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { dodge: dodgeAfterOverflow });
      }
      newBattle.flow = 0;
    } else {
      newBattle.flow = flowNext;
    }
  }

  // Step B: flow-conditional bonuses (check CURRENT flow after update)
  if (effects.damageIfFlowHigh && (newBattle.flow >= 5 || (newBattle.flow === 0 && (battle.flow ?? 0) + 1 + (effects.gainExtraFlow || 0) >= 5)) && targetInstanceId) {
    // Use pre-overflow flow for the check so finishers at flow 5-7 still fire the bonus
    const preOverflowFlow = (battle.flow ?? 0) + 1 + (effects.gainExtraFlow || 0);
    if (preOverflowFlow >= 5) {
      const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
      if (enemyIdx !== -1) {
        const dmg = calculateDamage(effects.damageIfFlowHigh, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      }
    }
  }
  if (effects.damageAllIfFlowHigh) {
    const preOverflowFlow = (battle.flow ?? 0) + 1 + (effects.gainExtraFlow || 0);
    if (preOverflowFlow >= 5) {
      newBattle.enemies = newBattle.enemies.map(e => {
        const dmg = calculateDamage(effects.damageAllIfFlowHigh!, battle.playerStatusEffects, e.statusEffects, run.items);
        return applyDamageToEnemy(e, dmg);
      });
    }
  }

  // Step C: bleed-scaling damage (deal N × target's bleed stacks)
  if (effects.damagePerBleed && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const bleedStacks = newBattle.enemies[enemyIdx].statusEffects.bleed || 0;
      if (bleedStacks > 0) {
        const dmg = calculateDamage(effects.damagePerBleed * bleedStacks, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      }
    }
  }

  // Step D: double bleed stacks on target (catalyst_patch)
  if (effects.doubleTargetBleed && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const currentBleed = newBattle.enemies[enemyIdx].statusEffects.bleed || 0;
      if (currentBleed > 0) {
        newBattle.enemies[enemyIdx] = {
          ...newBattle.enemies[enemyIdx],
          statusEffects: { ...newBattle.enemies[enemyIdx].statusEffects, bleed: currentBleed * 2 },
        };
      }
    }
  }

  // Step E: burn amplifier effects (Backend Engineer)
  // doubleBurnOnTarget
  if (effects.doubleBurnOnTarget && targetInstanceId) {
    const tIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (tIdx >= 0) {
      const currentBurn = newBattle.enemies[tIdx].statusEffects.burn || 0;
      if (currentBurn > 0) {
        newBattle.enemies[tIdx] = {
          ...newBattle.enemies[tIdx],
          statusEffects: { ...newBattle.enemies[tIdx].statusEffects, burn: currentBurn * 2 },
        };
      }
    }
  }

  // tripleBurnOnTarget
  if (effects.tripleBurnOnTarget && targetInstanceId) {
    const tIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (tIdx >= 0) {
      const currentBurn = newBattle.enemies[tIdx].statusEffects.burn || 0;
      if (currentBurn > 0) {
        newBattle.enemies[tIdx] = {
          ...newBattle.enemies[tIdx],
          statusEffects: { ...newBattle.enemies[tIdx].statusEffects, burn: currentBurn * 3 },
        };
      }
    }
  }

  // damagePerBurn: deal N × target's burn stacks
  if (effects.damagePerBurn && targetInstanceId) {
    const tIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (tIdx >= 0) {
      const targetBurn = newBattle.enemies[tIdx].statusEffects.burn || 0;
      if (targetBurn > 0) {
        const burnDmg = calculateDamage(
          effects.damagePerBurn * targetBurn,
          newBattle.playerStatusEffects,
          newBattle.enemies[tIdx].statusEffects,
          run.items
        );
        newBattle.enemies[tIdx] = applyDamageToEnemy({ ...newBattle.enemies[tIdx] }, burnDmg);
        if (effects.consumeBurnOnHit) {
          newBattle.enemies[tIdx] = {
            ...newBattle.enemies[tIdx],
            statusEffects: { ...newBattle.enemies[tIdx].statusEffects, burn: undefined },
          };
        }
        if (newBattle.enemies[tIdx].currentHp <= 0) {
          newBattle.goldEarned = (newBattle.goldEarned || 0) + (newBattle.enemies[tIdx].gold || 0);
          newBattle.killCount = (newBattle.killCount || 0) + 1;
        }
      }
    }
  }

  // applyBurnAll
  if (effects.applyBurnAll) {
    newBattle.enemies = newBattle.enemies.map(e => ({
      ...e,
      statusEffects: mergeStatusEffects(e.statusEffects, { burn: effects.applyBurnAll }),
    }));
  }

  // burnDoTMultiplier power card
  if (effects.burnDoTMultiplier) {
    newBattle.burnDoTMultiplier = effects.burnDoTMultiplier;
  }

  // Step F: dodge-scaling effects (Frontend Engineer)
  // damagePerDodge: deal N × current dodge stacks
  if (effects.damagePerDodge && targetInstanceId) {
    const dodgeStacks = newBattle.playerStatusEffects.dodge || 0;
    if (dodgeStacks > 0) {
      const tIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
      if (tIdx >= 0) {
        const dpd = calculateDamage(
          effects.damagePerDodge * dodgeStacks,
          newBattle.playerStatusEffects,
          newBattle.enemies[tIdx].statusEffects,
          run.items
        );
        newBattle.enemies[tIdx] = applyDamageToEnemy({ ...newBattle.enemies[tIdx] }, dpd);
        if (newBattle.enemies[tIdx].currentHp <= 0) {
          newBattle.goldEarned = (newBattle.goldEarned || 0) + (newBattle.enemies[tIdx].gold || 0);
          newBattle.killCount = (newBattle.killCount || 0) + 1;
        }
      }
    }
  }

  // bonusDamageIfDodgedThisTurn
  if (effects.bonusDamageIfDodgedThisTurnAmount && newBattle.dodgedThisTurn && targetInstanceId) {
    const tIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (tIdx >= 0) {
      const bonusDmg = calculateDamage(
        effects.bonusDamageIfDodgedThisTurnAmount,
        newBattle.playerStatusEffects,
        newBattle.enemies[tIdx].statusEffects,
        run.items
      );
      newBattle.enemies[tIdx] = applyDamageToEnemy({ ...newBattle.enemies[tIdx] }, bonusDmg);
      if (newBattle.enemies[tIdx].currentHp <= 0) {
        newBattle.goldEarned = (newBattle.goldEarned || 0) + (newBattle.enemies[tIdx].gold || 0);
        newBattle.killCount = (newBattle.killCount || 0) + 1;
      }
    }
  }
  // ── End Flow State mechanic ───────────────────────────────────────────────

  // ── Detonation Queue mechanics (Backend Engineer) ──────────────────────────
  // Cards push scheduled effects onto the queue; they fire at start of next turn
  if (effects.queueBlock) {
    // firstIceDoubleQueue relic: first ice card each combat queues double block
    let iceBlockAmt = effects.queueBlock;
    if (!newBattle.firstIceUsed && run.items.some(i => i.effect.firstIceDoubleQueue)) {
      iceBlockAmt = iceBlockAmt * 2;
      newBattle.firstIceUsed = true;
    }
    newBattle.detonationQueue = [
      ...(newBattle.detonationQueue || []),
      { element: 'ice' as const, blockAmount: iceBlockAmt, turnsUntilFire: 1 },
    ];
  }
  if (effects.queueDamageAll || effects.queueBurn) {
    let fireDmg = effects.queueDamageAll;
    let fireBurn = effects.queueBurn;
    // burnPropagation relic: when burn is queued, also queue 1 extra burn to spread to others
    // (handled at fire time in startNewTurn where burnApply fires)
    newBattle.detonationQueue = [
      ...(newBattle.detonationQueue || []),
      {
        element: 'fire' as const,
        damageAllAmount: fireDmg,
        burnApply: fireBurn,
        turnsUntilFire: 1,
      },
    ];
  }
  if (effects.queueChain) {
    newBattle.detonationQueue = [
      ...(newBattle.detonationQueue || []),
      { element: 'lightning' as const, chainAmount: effects.queueChain, turnsUntilFire: 1 },
    ];
  }

  // Tiered ice queue
  if (effects.queueBlockQuick) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'ice' as const, blockAmount: effects.queueBlockQuick, turnsUntilFire: 2 }];
  }
  if (effects.queueBlockDelayed) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'ice' as const, blockAmount: effects.queueBlockDelayed, turnsUntilFire: 3 }];
  }
  if (effects.queueBlockCharged) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'ice' as const, blockAmount: effects.queueBlockCharged, turnsUntilFire: 4 }];
  }

  // Tiered fire queue
  if (effects.queueDamageAllQuick) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'fire' as const, damageAllAmount: effects.queueDamageAllQuick, turnsUntilFire: 2 }];
  }
  if (effects.queueDamageAllDelayed) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'fire' as const, damageAllAmount: effects.queueDamageAllDelayed, turnsUntilFire: 3 }];
  }
  if (effects.queueDamageAllCharged) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'fire' as const, damageAllAmount: effects.queueDamageAllCharged, turnsUntilFire: 4 }];
  }

  // Tiered lightning queue
  if (effects.queueChainQuick) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'lightning' as const, chainAmount: effects.queueChainQuick, turnsUntilFire: 2 }];
  }
  if (effects.queueChainDelayed) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'lightning' as const, chainAmount: effects.queueChainDelayed, turnsUntilFire: 3 }];
  }
  if (effects.queueChainCharged) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'lightning' as const, chainAmount: effects.queueChainCharged, turnsUntilFire: 4 }];
  }

  // Tiered burn queue
  if (effects.queueBurnDelayed) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'fire' as const, burnApply: effects.queueBurnDelayed, turnsUntilFire: 3 }];
  }
  if (effects.queueBurnCharged) {
    newBattle.detonationQueue = [...(newBattle.detonationQueue || []),
      { element: 'fire' as const, burnApply: effects.queueBurnCharged, turnsUntilFire: 4 }];
  }

  // accelerateQueue: reduce all queue timers by N (min 1)
  if (effects.accelerateQueue && effects.accelerateQueue > 0) {
    newBattle.detonationQueue = (newBattle.detonationQueue || []).map(qe => ({
      ...qe,
      turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - effects.accelerateQueue!),
    }));
  }

  // amplifyQueue: multiply all queued amounts by (1 + N/100)
  if (effects.amplifyQueue && effects.amplifyQueue > 0) {
    const mult = 1 + effects.amplifyQueue / 100;
    newBattle.detonationQueue = (newBattle.detonationQueue || []).map(qe => ({
      ...qe,
      blockAmount:     qe.blockAmount     ? Math.floor(qe.blockAmount * mult)     : undefined,
      damageAllAmount: qe.damageAllAmount ? Math.floor(qe.damageAllAmount * mult) : undefined,
      chainAmount:     qe.chainAmount     ? Math.floor(qe.chainAmount * mult)     : undefined,
      burnApply:       qe.burnApply       ? Math.floor(qe.burnApply * mult)       : undefined,
    }));
  }

  // stackMatchingQueue: add amount to the largest pending effect of matching element
  if (effects.stackMatchingQueue) {
    const { element, amount } = effects.stackMatchingQueue;
    const queue = newBattle.detonationQueue || [];
    let targetIdx = -1;
    let targetMax = 0;
    queue.forEach((qe, i) => {
      if (qe.element !== element) return;
      const val = qe.damageAllAmount ?? qe.chainAmount ?? qe.blockAmount ?? 0;
      if (val > targetMax) { targetMax = val; targetIdx = i; }
    });
    if (targetIdx >= 0) {
      newBattle.detonationQueue = queue.map((qe, i) => {
        if (i !== targetIdx) return qe;
        return {
          ...qe,
          blockAmount:     qe.blockAmount     ? qe.blockAmount + amount     : undefined,
          damageAllAmount: qe.damageAllAmount ? qe.damageAllAmount + amount : undefined,
          chainAmount:     qe.chainAmount     ? qe.chainAmount + amount     : undefined,
        };
      });
    } else {
      // No matching element found — queue a fast fire for amount
      newBattle.detonationQueue = [...queue,
        { element: 'fire' as const, damageAllAmount: amount, turnsUntilFire: 1 }];
    }
  }

  // detonateNow: immediately fire ALL queued effects inline
  if (effects.detonateNow && (newBattle.detonationQueue || []).length > 0) {
    const queueToFire = newBattle.detonationQueue || [];
    const firingElements = new Set(queueToFire.map(e => e.element));
    const batchMult = firingElements.size >= 3 ? 2.0 : firingElements.size === 2 ? 1.5 : 1.0;

    for (const qe of queueToFire) {
      if (qe.blockAmount) {
        newBattle.playerBlock += Math.floor(qe.blockAmount * batchMult);
      }
      if (qe.damageAllAmount) {
        const dmg = Math.floor(qe.damageAllAmount * batchMult);
        newBattle.enemies = newBattle.enemies.map(e => {
          if (e.currentHp <= 0) return e;
          return applyDamageToEnemy(e, calculateDamage(dmg, newBattle.playerStatusEffects, e.statusEffects, run.items));
        });
      }
      if (qe.chainAmount) {
        const chainDmg = Math.floor(qe.chainAmount * batchMult);
        newBattle.enemies = newBattle.enemies.map(e => {
          if (e.currentHp <= 0) return e;
          return applyDamageToEnemy(e, calculateDamage(chainDmg, newBattle.playerStatusEffects, e.statusEffects, run.items));
        });
      }
      if (qe.burnApply) {
        const burnAmt = Math.floor(qe.burnApply * batchMult);
        newBattle.enemies = newBattle.enemies.map(e => ({
          ...e,
          statusEffects: { ...e.statusEffects, burn: (e.statusEffects.burn || 0) + burnAmt },
        }));
      }
    }
    // Track kills from detonateNow
    const killed = newBattle.enemies.filter(e => e.currentHp <= 0);
    newBattle.killCount = (newBattle.killCount || 0) + killed.length;
    newBattle.goldEarned = (newBattle.goldEarned || 0) + killed.reduce((s, e) => s + (e.gold || 0), 0);
    newBattle.enemies = newBattle.enemies.filter(e => e.currentHp > 0);
    newBattle.detonationQueue = [];
  }
  // ── End Detonation Queue mechanic ──────────────────────────────────────────

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
      // Primed reduces all detonation queue timers immediately
      const primedApplied = effects.applyToTarget.primed ?? 0;
      if (primedApplied > 0 && newBattle.detonationQueue && newBattle.detonationQueue.length > 0) {
        newBattle.detonationQueue = newBattle.detonationQueue.map(qe => ({
          ...qe,
          turnsUntilFire: Math.max(1, (qe.turnsUntilFire ?? 1) - primedApplied),
        }));
      }
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
  // trainingLoopBonus relic: add N extra scaling per play count to training_loop cards
  const trainingLoopRelic = run.items.reduce((s, i) => s + (i.effect.trainingLoopBonus || 0), 0);
  if (effects.damagePerTimesPlayed && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const bonus = (effects.damagePerTimesPlayed + trainingLoopRelic) * currentPlayCount;
      if (bonus > 0) {
        const dmg = calculateDamage(bonus, battle.playerStatusEffects, newBattle.enemies[enemyIdx].statusEffects, run.items);
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(newBattle.enemies[enemyIdx], dmg);
      }
    }
  }
  if (effects.blockPerTimesPlayed) {
    const bonus = (effects.blockPerTimesPlayed + trainingLoopRelic) * currentPlayCount;
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

  // Mark first engineer card free as used (whiteboard_marker redesign)
  if (effects.slotEngineer && !battle.firstEngineerCardFreeUsed) {
    const hasFreeFirstEngineer = run.items.some(i => i.effect.firstEngineerCardFree);
    if (hasFreeFirstEngineer) {
      newBattle.firstEngineerCardFreeUsed = true;
    }
  }

  // evasion_protocol power: set dodge damage scaling
  if (effects.dodgeScalesDamage) {
    newBattle.dodgeScalesDamage = effects.dodgeScalesDamage;
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
  // For upgraded cards, respect upgradedExhaust override if defined
  const cardExhausts = card.upgraded && card.upgradedExhaust !== undefined
    ? card.upgradedExhaust
    : (card.exhaust || false);
  const shouldExhaust = card.type === 'power' || cardExhausts;
  if (shouldExhaust) {
    newBattle.exhaustPile = [...newBattle.exhaustPile, card];
    // Trigger exhaust relics for the card itself (only for non-power exhaust cards)
    if (cardExhausts) {
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

  // ── Architect: Engineer Slot Effects ──

  // damagePerSlot: bonus damage to target scaled by slot count
  if (effects.damagePerSlot && (newBattle.engineerSlots || []).length > 0 && targetInstanceId) {
    const slotDmg = effects.damagePerSlot * newBattle.engineerSlots.length;
    if (slotDmg > 0) {
      const target = newBattle.enemies.find(e => e.instanceId === targetInstanceId);
      if (target) {
        const calcDmg = calculateDamage(slotDmg, newBattle.playerStatusEffects, target.statusEffects, run.items);
        newBattle.enemies = newBattle.enemies.map(e =>
          e.instanceId === targetInstanceId ? applyDamageToEnemy(e, calcDmg) : e
        );
      }
    }
  }

  // blockPerSlot: bonus block scaled by slot count
  if (effects.blockPerSlot && (newBattle.engineerSlots || []).length > 0) {
    const slotBlock = effects.blockPerSlot * newBattle.engineerSlots.length;
    newBattle.playerBlock += calculateBlock(slotBlock, newBattle.playerStatusEffects, run.items);
  }

  // damageAllPerSlot: bonus AoE damage scaled by slot count
  if (effects.damageAllPerSlot && (newBattle.engineerSlots || []).length > 0) {
    const slotAllDmg = effects.damageAllPerSlot * newBattle.engineerSlots.length;
    if (slotAllDmg > 0) {
      newBattle.enemies = newBattle.enemies.map(e =>
        applyDamageToEnemy(e, calculateDamage(slotAllDmg, newBattle.playerStatusEffects, e.statusEffects, run.items))
      );
    }
  }

  // addScopeCreepToDiscard: add curse cards to discard
  if (effects.addScopeCreepToDiscard) {
    const curseDef = getCardDef('scope_creep');
    if (curseDef) {
      for (let i = 0; i < effects.addScopeCreepToDiscard; i++) {
        newBattle.discardPile = [...newBattle.discardPile, createCardInstance(curseDef)];
      }
    }
  }

  // shuffleEngineerSlots: randomize slot order
  if (effects.shuffleEngineerSlots && (newBattle.engineerSlots || []).length > 1) {
    newBattle.engineerSlots = [...newBattle.engineerSlots].sort(() => Math.random() - 0.5);
  }

  // regenerateBlueprint: get a new blueprint, reset progress
  if (effects.regenerateBlueprint) {
    newBattle.blueprint = generateBlueprint();
    newBattle.blueprintProgress = 0;
  }

  // evokeOldest: fire and remove oldest slotted engineer
  if (effects.evokeOldest && (newBattle.engineerSlots || []).length > 0) {
    const oldest = newBattle.engineerSlots[0];
    newBattle.engineerSlots = newBattle.engineerSlots.slice(1);
    applyEvokeEffect(newBattle, run, oldest.evokeEffect);
  }

  // evokeAll: fire all slot evokes, clear slots
  if (effects.evokeAll && (newBattle.engineerSlots || []).length > 0) {
    const slotsToEvoke = [...newBattle.engineerSlots];
    newBattle.engineerSlots = [];
    newBattle.blueprintProgress = 0;
    for (const slot of slotsToEvoke) {
      applyEvokeEffect(newBattle, run, slot.evokeEffect);
    }
  }

  // addEngineerSlot: increase max slots
  if (effects.addEngineerSlot) {
    newBattle.maxEngineerSlots = Math.min(5, (newBattle.maxEngineerSlots || 3) + effects.addEngineerSlot);
  }

  // removeEngineerSlot: decrease max slots, unconditionally evoke oldest, then handle overflow
  if (effects.removeEngineerSlot) {
    newBattle.maxEngineerSlots = Math.max(1, (newBattle.maxEngineerSlots || 3) - effects.removeEngineerSlot);
    // Unconditionally evoke oldest slot (card says "evoke oldest" — always fires)
    if ((newBattle.engineerSlots || []).length > 0) {
      const evoked = newBattle.engineerSlots.shift()!;
      applyEvokeEffect(newBattle, run, evoked.evokeEffect);
    }
    // Handle any remaining overflow after the explicit evoke
    while ((newBattle.engineerSlots || []).length > newBattle.maxEngineerSlots) {
      const evoked2 = newBattle.engineerSlots.shift()!;
      applyEvokeEffect(newBattle, run, evoked2.evokeEffect);
    }
  }

  // advanceBlueprint: manually advance progress (triggers completion if ≥ length)
  if (effects.advanceBlueprint) {
    const bpBefore = newBattle.blueprintProgress || 0;
    newBattle.blueprintProgress = Math.min(
      bpBefore + effects.advanceBlueprint,
      (newBattle.blueprint || []).length
    );
    // drawOnBlueprintAdvance relic: draw N cards each time blueprint advances
    const bpDraw = run.items.reduce((s, i) => s + (i.effect.drawOnBlueprintAdvance || 0), 0);
    if (bpDraw > 0 && newBattle.blueprintProgress > bpBefore) {
      const { drawn, newDrawPile: dp2, newDiscardPile: disc2 } = drawCards(newBattle.drawPile, newBattle.discardPile, bpDraw);
      newBattle.hand = [...newBattle.hand, ...drawn];
      newBattle.drawPile = dp2;
      newBattle.discardPile = disc2;
    }
    if ((newBattle.blueprintProgress || 0) >= (newBattle.blueprint || []).length && (newBattle.blueprint || []).length > 0) {
      applyBlueprintComplete(newBattle, run);
    }
  }

  // slotEngineer: slot an engineer, check blueprint progress, check overflow
  if (effects.slotEngineer) {
    const engineerDef = engineerRoster[effects.slotEngineer];
    if (engineerDef) {
      newBattle.engineerSlots = [...(newBattle.engineerSlots || []), engineerDef];

      // Check blueprint sequential match
      const progressIdx = newBattle.blueprintProgress || 0;
      const expectedId = (newBattle.blueprint || [])[progressIdx];
      if (effects.slotEngineer === expectedId) {
        newBattle.blueprintProgress = progressIdx + 1;
        // drawOnBlueprintAdvance relic: draw N cards when blueprint advances via slotting
        const bpDraw2 = run.items.reduce((s, i) => s + (i.effect.drawOnBlueprintAdvance || 0), 0);
        if (bpDraw2 > 0) {
          const { drawn, newDrawPile: dp3, newDiscardPile: disc3 } = drawCards(newBattle.drawPile, newBattle.discardPile, bpDraw2);
          newBattle.hand = [...newBattle.hand, ...drawn];
          newBattle.drawPile = dp3;
          newBattle.discardPile = disc3;
        }
      }

      // Check blueprint completion
      if ((newBattle.blueprintProgress || 0) >= (newBattle.blueprint || []).length && (newBattle.blueprint || []).length > 0) {
        applyBlueprintComplete(newBattle, run);
      }
      // Check slot overflow (only if blueprint not just completed — slots would have been cleared)
      else if (newBattle.engineerSlots.length > (newBattle.maxEngineerSlots || 3)) {
        const evicted = newBattle.engineerSlots[0];
        newBattle.engineerSlots = newBattle.engineerSlots.slice(1);
        applyEvokeEffect(newBattle, run, evicted.evokeEffect);
      }
    }
  }

  // ── End Architect Engineer Slot Effects ──

  // Remove dead enemies and track kills + gold earned
  const deadEnemies = newBattle.enemies.filter(e => e.currentHp <= 0);
  const killCount = deadEnemies.length;
  newBattle.killCount = (newBattle.killCount || 0) + killCount;
  newBattle.goldEarned = (newBattle.goldEarned || 0) + deadEnemies.reduce((sum, e) => sum + (e.gold || 0), 0);
  newBattle.enemies = newBattle.enemies.filter(e => e.currentHp > 0);

  // confidenceOnKill relic: gain N Confidence (permanent) per enemy killed
  if (killCount > 0) {
    const confOnKill = run.items.reduce((s, i) => s + (i.effect.confidenceOnKill || 0), 0);
    if (confOnKill > 0) {
      newBattle.playerStatusEffects = {
        ...newBattle.playerStatusEffects,
        confidence: (newBattle.playerStatusEffects.confidence || 0) + confOnKill * killCount,
      };
    }
  }

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

  // damageReductionPercent relic (imposter_syndrome): reduce all incoming HP damage by N%
  const damageReductionMult = Math.max(0, 1 - run.items.reduce((s, i) => s + (i.effect.damageReductionPercent || 0), 0) / 100);

  const enemiesToRemove: string[] = [];
  const enemiesToSpawn: EnemyInstance[] = [];

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
          // Dodge check (Frontend evasion): 10% per stack, consumes 1 stack on success
          const dodgeStacks = newBattle.playerStatusEffects.dodge || 0;
          if (dodgeStacks > 0 && Math.random() < dodgeStacks * 0.1) {
            newBattle.playerStatusEffects = {
              ...newBattle.playerStatusEffects,
              dodge: dodgeStacks - 1 || undefined,
            };
            newBattle.dodgedThisTurn = true;
            continue; // skip this hit entirely
          }
          const dmg = calculateDamage(
            move.damage || 0,
            enemy.statusEffects,
            newBattle.playerStatusEffects
          );
          const result = applyDamageToPlayer(playerHp, newBattle.playerBlock, Math.floor(dmg * damageReductionMult));
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
        if (move.applyToTarget) {
          newBattle.playerStatusEffects = mergeStatusEffects(
            newBattle.playerStatusEffects,
            move.applyToTarget
          );
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
          // Dodge check
          const dodgeStacksDual = newBattle.playerStatusEffects.dodge || 0;
          const dualDodged = dodgeStacksDual > 0 && Math.random() < dodgeStacksDual * 0.1;
          if (dualDodged) {
            newBattle.playerStatusEffects = {
              ...newBattle.playerStatusEffects,
              dodge: dodgeStacksDual - 1 || undefined,
            };
            newBattle.dodgedThisTurn = true;
          } else {
            const dmg = calculateDamage(
              move.damage,
              enemy.statusEffects,
              newBattle.playerStatusEffects
            );
            const hpResult = applyDamageToPlayer(playerHp, newBattle.playerBlock, Math.floor(dmg * damageReductionMult));
            playerHp = hpResult.hp;
            newBattle.playerBlock = hpResult.block;
            // Counter-Offer thorns
            if (thorns > 0) {
              updatedEnemy = applyDamageToEnemy(updatedEnemy, thorns);
            }
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
        const discardCount = move.discardCount || 1;
        if (discardCount <= 2) {
          // Small discard: exhaust cards permanently from combat
          for (let i = 0; i < discardCount && newBattle.hand.length > 0; i++) {
            const idx = Math.floor(Math.random() * newBattle.hand.length);
            const [exhausted] = newBattle.hand.splice(idx, 1);
            newBattle.exhaustPile = [...newBattle.exhaustPile, exhausted];
          }
        } else {
          // Large discard: reduce how many cards the hero draws next turn
          newBattle.nextTurnDrawPenalty = (newBattle.nextTurnDrawPenalty || 0) + discardCount;
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
        // Dodge check
        const dodgeStacksAD = newBattle.playerStatusEffects.dodge || 0;
        const attackDefendDodged = dodgeStacksAD > 0 && Math.random() < dodgeStacksAD * 0.1;
        if (attackDefendDodged) {
          newBattle.playerStatusEffects = {
            ...newBattle.playerStatusEffects,
            dodge: dodgeStacksAD - 1 || undefined,
          };
          newBattle.dodgedThisTurn = true;
        } else {
          const dmg = calculateDamage(
            move.damage || 0,
            enemy.statusEffects,
            newBattle.playerStatusEffects
          );
          const result = applyDamageToPlayer(playerHp, newBattle.playerBlock, Math.floor(dmg * damageReductionMult));
          playerHp = result.hp;
          newBattle.playerBlock = result.block;
          // Counter-Offer thorns
          if (thorns > 0) {
            updatedEnemy = applyDamageToEnemy(updatedEnemy, thorns);
          }
        }
        updatedEnemy.block += move.block || 0;
        if (move.applyToSelf) {
          updatedEnemy.statusEffects = mergeStatusEffects(updatedEnemy.statusEffects, move.applyToSelf);
        }
        if (move.applyToTarget) {
          newBattle.playerStatusEffects = mergeStatusEffects(
            newBattle.playerStatusEffects,
            move.applyToTarget
          );
        }
        break;
      }
      case 'summon': {
        const summonId = move.summonId;
        const count = move.summonCount ?? 1;
        if (summonId) {
          const def = enemies[summonId];
          if (def) {
            const available = Math.max(0, 5 - (newBattle.enemies.length + enemiesToSpawn.length));
            const spawnCount = Math.min(count, available);
            for (let i = 0; i < spawnCount; i++) {
              enemiesToSpawn.push({
                ...def,
                instanceId: uuidv4(),
                currentHp: def.hp,
                maxHp: def.hp,
                block: 0,
                statusEffects: def.startStatusEffects ? { ...def.startStatusEffects } : {},
                moveIndex: 0,
                currentMove: def.moves[0],
              });
            }
          }
        }
        break;
      }
      case 'energy_drain': {
        const drain = move.energyDrain ?? 1;
        newBattle.nextTurnEnergyPenalty = (newBattle.nextTurnEnergyPenalty || 0) + drain;
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
      case 'corrupt': {
        const curseId = move.corruptCardId ?? 'bug_report_curse';
        const curseDef = getCardDef(curseId);
        if (curseDef) {
          newBattle.discardPile = [...newBattle.discardPile, createCardInstance(curseDef)];
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

  // Remove vanished enemies (Ghost Company) and enemies killed by Counter-Offer; append spawned enemies
  newBattle.enemies = [
    ...newBattle.enemies.filter(e => e.currentHp > 0 && !enemiesToRemove.includes(e.instanceId)),
    ...enemiesToSpawn,
  ];

  // Tick player status effects
  newBattle.playerStatusEffects = tickStatusEffects(newBattle.playerStatusEffects);

  // circuit_breaker relic: survive killing blow with 1 HP (once per combat)
  if (playerHp <= 0 && !newBattle.circuitBreakerUsed) {
    const hasCircuitBreaker = run.items.some(i => i.effect.surviveKillingBlow);
    if (hasCircuitBreaker) {
      playerHp = 1;
      newBattle.circuitBreakerUsed = true;
    }
  }

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
  const drawPenalty = battle.nextTurnDrawPenalty || 0;
  const engineerExtraDraw = (battle.engineerSlots || []).reduce((sum: number, slot) => sum + (slot.passiveEffect.draw || 0), 0);
  const drawCount = Math.max(1, 5 + extraDraw + networkingDraw - drawPenalty + engineerExtraDraw);

  const { drawn, newDrawPile: _newDrawPile, newDiscardPile: _newDiscardPile } = drawCards(battle.drawPile, newDiscard, drawCount);
  let newDrawPile = _newDrawPile;
  let newDiscardPile = _newDiscardPile;

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

  // Curse cards drawn add stress — amount varies per curse card (use upgradedEffects.stress if upgraded)
  const curseCards = hand.filter(c => c.type === 'curse');
  if (curseCards.length > 0) {
    const curseStress = curseCards.reduce((sum, curse) => {
      const upgraded = curse.upgraded;
      const stressVal = upgraded && curse.upgradedEffects?.stress != null
        ? curse.upgradedEffects.stress
        : (curse.effects?.stress ?? 5);
      return sum + stressVal;
    }, 0);
    stressChange += curseStress;
  }

  // Apply player poison damage (poison ticks each turn, tickStatusEffects decrements it after)
  if ((battle.playerStatusEffects.poison || 0) > 0) {
    hpChange -= battle.playerStatusEffects.poison!;
  }
  // Apply player regen healing (heals each turn, does not decrement)
  if ((battle.playerStatusEffects.regen || 0) > 0) {
    hpChange += battle.playerStatusEffects.regen!;
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

  // blockPerDodgeStack relic: gain N block per current dodge stack
  const blockPerDodge = run.items.reduce((s, i) => s + (i.effect.blockPerDodgeStack || 0), 0);
  // startBlockPerEngineer relic: gain N block per slotted engineer each turn
  const blockPerEngineer = run.items.reduce((s, i) => s + (i.effect.startBlockPerEngineer || 0), 0);
  // confidencePerSlottedEngineer relic: gain 1 confidence per slotted engineer each turn
  const confPerEngineer = run.items.some(i => i.effect.confidencePerSlottedEngineer);
  if (confPerEngineer && (battle.engineerSlots || []).length > 0) {
    turnStartStatusMerge.confidence = (turnStartStatusMerge.confidence || 0) + battle.engineerSlots.length;
  }
  // tokenLossPerTurn relic: lose N tokens per turn (clamped to 0)
  const tokenLoss = run.items.reduce((s, i) => s + (i.effect.tokenLossPerTurn || 0), 0);
  // retainFlow relic: retain up to N flow between turns instead of resetting to 0
  const retainFlow = run.items.reduce((s, i) => s + (i.effect.retainFlow || 0), 0);

  let blockBonus = 0;
  for (const item of run.items) {
    if (item.effect.blockPerTurn) {
      blockBonus += item.effect.blockPerTurn;
    }
  }
  if (blockPerDodge > 0) {
    blockBonus += blockPerDodge * (battle.playerStatusEffects.dodge || 0);
  }
  if (blockPerEngineer > 0) {
    blockBonus += blockPerEngineer * (battle.engineerSlots || []).length;
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

  // Apply Bleed damage to enemies (Frontend mechanic: fires at start of player's turn)
  // Bleed is NOT decremented by tickStatusEffects — we handle tick + decrement here for full control
  let bleedGoldEarned = 0;
  let bleedKillCount = 0;
  let detonationKillCount = 0;
  let detonationGoldEarned = 0;
  postDeployEnemies = postDeployEnemies.map(e => {
    const bleedDmg = e.statusEffects.bleed || 0;
    if (bleedDmg <= 0) return e;
    const damaged = applyDamageToEnemy({ ...e, statusEffects: { ...e.statusEffects } }, bleedDmg);
    const newBleed = bleedDmg > 1 ? bleedDmg - 1 : undefined;
    return {
      ...damaged,
      statusEffects: { ...damaged.statusEffects, bleed: newBleed },
    };
  });
  // Track kills and gold from bleed deaths
  const bleedDeadEnemies = postDeployEnemies.filter(e => e.currentHp <= 0);
  bleedKillCount = bleedDeadEnemies.length;
  bleedGoldEarned = bleedDeadEnemies.reduce((sum, e) => sum + (e.gold || 0), 0);
  postDeployEnemies = postDeployEnemies.filter(e => e.currentHp > 0);
  // Track kills and gold earned from bleed — will be merged into battle state in the return object

  // Apply Burn damage to enemies (Backend mechanic: fires at start of player's turn)
  // Burn is NOT decremented by tickStatusEffects — same pattern as bleed
  {
    const burnMultiplier = battle.burnDoTMultiplier || 1;
    postDeployEnemies = postDeployEnemies.map(e => {
      const burnDmg = e.statusEffects.burn || 0;
      if (burnDmg <= 0) return e;
      const damaged = applyDamageToEnemy({ ...e, statusEffects: { ...e.statusEffects } }, Math.floor(burnDmg * burnMultiplier));
      const newBurn = burnDmg > 1 ? burnDmg - 1 : undefined;
      return {
        ...damaged,
        statusEffects: { ...damaged.statusEffects, burn: newBurn },
      };
    });
  }
  postDeployEnemies = postDeployEnemies.filter(e => e.currentHp > 0);

  // ── Engineer Slot Passives (Architect mechanic: fire every turn start) ──
  let engineerPassiveBlock = 0;
  let engineerPassiveEnergy = 0;
  let engineerTokenGain = 0;
  let engineerQueuedEffects: QueuedEffect[] = [];
  const engineerPassiveStatus: import('../types').StatusEffect = {};

  for (const slot of (battle.engineerSlots || [])) {
    const p = slot.passiveEffect;
    if (p.block) engineerPassiveBlock += p.block;
    if (p.energy) engineerPassiveEnergy += p.energy;
    if (p.dodge) engineerPassiveStatus.dodge = (engineerPassiveStatus.dodge || 0) + p.dodge;
    if (p.resilience) engineerPassiveStatus.resilience = (engineerPassiveStatus.resilience || 0) + p.resilience;
    if (p.counterOffer) engineerPassiveStatus.counterOffer = (engineerPassiveStatus.counterOffer || 0) + p.counterOffer;
    if (p.generateTokens) engineerTokenGain += p.generateTokens;
    if (p.queueBlock) engineerQueuedEffects.push({ element: 'ice' as const, blockAmount: p.queueBlock, turnsUntilFire: 1 });
    if (p.queueDamageAll) engineerQueuedEffects.push({ element: 'fire' as const, damageAllAmount: p.queueDamageAll, turnsUntilFire: 1 });
    if (p.vulnerableRandom && postDeployEnemies.length > 0) {
      const vuln = p.vulnerableRandom;
      const idx = Math.floor(Math.random() * postDeployEnemies.length);
      postDeployEnemies = postDeployEnemies.map((e, i) =>
        i === idx ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { vulnerable: vuln }) } : e
      );
    }
    if (p.bleedRandom && postDeployEnemies.length > 0) {
      const bleedAmt = p.bleedRandom;
      const idx = Math.floor(Math.random() * postDeployEnemies.length);
      postDeployEnemies = postDeployEnemies.map((e, i) =>
        i === idx ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { bleed: bleedAmt }) } : e
      );
    }
  }

  // doubleEngineerPassive relic (senior_engineer): fire each slot passive a second time
  if (run.items.some(i => i.effect.doubleEngineerPassive)) {
    for (const slot of (battle.engineerSlots || [])) {
      const p = slot.passiveEffect;
      if (p.block) engineerPassiveBlock += p.block;
      if (p.energy) engineerPassiveEnergy += p.energy;
      if (p.dodge) engineerPassiveStatus.dodge = (engineerPassiveStatus.dodge || 0) + p.dodge;
      if (p.resilience) engineerPassiveStatus.resilience = (engineerPassiveStatus.resilience || 0) + p.resilience;
      if (p.counterOffer) engineerPassiveStatus.counterOffer = (engineerPassiveStatus.counterOffer || 0) + p.counterOffer;
      if (p.generateTokens) engineerTokenGain += p.generateTokens;
      if (p.queueBlock) engineerQueuedEffects.push({ element: 'ice' as const, blockAmount: p.queueBlock, turnsUntilFire: 1 });
      if (p.queueDamageAll) engineerQueuedEffects.push({ element: 'fire' as const, damageAllAmount: p.queueDamageAll, turnsUntilFire: 1 });
    }
  }

  // Merge engineer passive status into player status
  let mergedWithEngineer = Object.keys(engineerPassiveStatus).length > 0
    ? mergeStatusEffects(mergedStatus, engineerPassiveStatus)
    : mergedStatus;

  // ── Resonance: adjacent matching slots fire passive again (×2) ──
  const slots = battle.engineerSlots || [];
  if (slots.length >= 2) {
    for (let ri = 0; ri < slots.length - 1; ri++) {
      if (slots[ri].id === slots[ri + 1].id) {
        // Apply this slot's passive a second time
        const rp = slots[ri].passiveEffect;
        if (rp.block) engineerPassiveBlock += rp.block;
        if (rp.energy) engineerPassiveEnergy += rp.energy;
        if (rp.dodge) mergedWithEngineer = mergeStatusEffects(mergedWithEngineer, { dodge: rp.dodge });
        if (rp.resilience) mergedWithEngineer = mergeStatusEffects(mergedWithEngineer, { resilience: rp.resilience });
        if (rp.counterOffer) mergedWithEngineer = mergeStatusEffects(mergedWithEngineer, { counterOffer: rp.counterOffer });
        if (rp.generateTokens) engineerTokenGain += rp.generateTokens;
        if (rp.queueBlock) engineerQueuedEffects.push({ element: 'ice' as const, blockAmount: rp.queueBlock, turnsUntilFire: 1 });
        if (rp.queueDamageAll) engineerQueuedEffects.push({ element: 'fire' as const, damageAllAmount: rp.queueDamageAll, turnsUntilFire: 1 });
        if (rp.vulnerableRandom && postDeployEnemies.length > 0) {
          const vuln2 = rp.vulnerableRandom;
          const idx2 = Math.floor(Math.random() * postDeployEnemies.length);
          postDeployEnemies = postDeployEnemies.map((e, i) =>
            i === idx2 ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { vulnerable: vuln2 }) } : e
          );
        }
        if (rp.bleedRandom && postDeployEnemies.length > 0) {
          const bleed2 = rp.bleedRandom;
          const idx2 = Math.floor(Math.random() * postDeployEnemies.length);
          postDeployEnemies = postDeployEnemies.map((e, i) =>
            i === idx2 ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { bleed: bleed2 }) } : e
          );
        }
      }
    }
  }

  // ── Harmonic: all slots match → fire all passives a third time + harmonicEffect ──
  if (slots.length >= 2 && slots.every(s => s.id === slots[0].id)) {
    for (const hslot of slots) {
      const hp2 = hslot.passiveEffect;
      if (hp2.block) engineerPassiveBlock += hp2.block;
      if (hp2.energy) engineerPassiveEnergy += hp2.energy;
      if (hp2.dodge) mergedWithEngineer = mergeStatusEffects(mergedWithEngineer, { dodge: hp2.dodge });
      if (hp2.resilience) mergedWithEngineer = mergeStatusEffects(mergedWithEngineer, { resilience: hp2.resilience });
      if (hp2.counterOffer) mergedWithEngineer = mergeStatusEffects(mergedWithEngineer, { counterOffer: hp2.counterOffer });
      if (hp2.generateTokens) engineerTokenGain += hp2.generateTokens;
      if (hp2.queueBlock) engineerQueuedEffects.push({ element: 'ice' as const, blockAmount: hp2.queueBlock, turnsUntilFire: 1 });
      if (hp2.queueDamageAll) engineerQueuedEffects.push({ element: 'fire' as const, damageAllAmount: hp2.queueDamageAll, turnsUntilFire: 1 });
      if (hp2.vulnerableRandom && postDeployEnemies.length > 0) {
        const vuln3 = hp2.vulnerableRandom;
        const idx3 = Math.floor(Math.random() * postDeployEnemies.length);
        postDeployEnemies = postDeployEnemies.map((e, i) =>
          i === idx3 ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { vulnerable: vuln3 }) } : e
        );
      }
      if (hp2.bleedRandom && postDeployEnemies.length > 0) {
        const bleed3 = hp2.bleedRandom;
        const idx3 = Math.floor(Math.random() * postDeployEnemies.length);
        postDeployEnemies = postDeployEnemies.map((e, i) =>
          i === idx3 ? { ...e, statusEffects: mergeStatusEffects(e.statusEffects, { bleed: bleed3 }) } : e
        );
      }
    }
    // Fire harmonicEffect via applyEvokeEffect on a temporary state proxy
    if (slots[0].harmonicEffect) {
      const tokensBefore = (battle.tokens ?? 0) + engineerTokenGain;
      const harmonicProxy = {
        ...battle,
        enemies: postDeployEnemies,
        playerStatusEffects: mergedWithEngineer,
        playerBlock: engineerPassiveBlock,
        tokens: tokensBefore,
        detonationQueue: engineerQueuedEffects,
        energy: 0, // energy handled separately via engineerPassiveEnergy
        hand,
        drawPile: newDrawPile,
        discardPile: newDiscardPile,
      } as BattleState;
      applyEvokeEffect(harmonicProxy, run, slots[0].harmonicEffect);
      // Extract results back
      postDeployEnemies = harmonicProxy.enemies;
      mergedWithEngineer = harmonicProxy.playerStatusEffects;
      engineerPassiveBlock = harmonicProxy.playerBlock;
      engineerTokenGain = harmonicProxy.tokens - (battle.tokens ?? 0);
      engineerQueuedEffects = harmonicProxy.detonationQueue;
      engineerPassiveEnergy += harmonicProxy.energy;
      // Also extract any hand/draw/discard changes from draw effects
      hand = harmonicProxy.hand;
      newDrawPile = harmonicProxy.drawPile;
      newDiscardPile = harmonicProxy.discardPile;
    }
  }
  // ── End Engineer Slot Passives ──

  // Process Detonation Queue (Backend mechanic: scheduled effects fire at start of player's turn)
  // Note: engineer passive queued effects (engineerQueuedEffects) are seeded for NEXT turn in return

  // Tick all timers — decrement turnsUntilFire by 1
  const tickedQueue: QueuedEffect[] = (battle.detonationQueue || []).map(qe => ({
    ...qe,
    turnsUntilFire: (qe.turnsUntilFire ?? 1) - 1,
  }));

  // Split: fire effects at 0, keep the rest for next turn
  const queueToProcess: QueuedEffect[] = tickedQueue.filter(qe => qe.turnsUntilFire <= 0);
  const remainingQueue: QueuedEffect[] = tickedQueue.filter(qe => qe.turnsUntilFire > 0);
  let detonationBlock = 0;
  if (queueToProcess.length > 0) {
    const queueElements = new Set(queueToProcess.map(e => e.element));
    const batchMultiplier = queueElements.size >= 3 ? 2.0 : queueElements.size === 2 ? 1.5 : 1.0;
    const systemMeltdown = queueElements.size >= 3;

    for (const qe of queueToProcess) {
      // Ice: queued block
      if (qe.blockAmount) {
        detonationBlock += Math.floor(qe.blockAmount * batchMultiplier);
      }
      // Fire: queued AoE damage
      if (qe.damageAllAmount) {
        const dmg = Math.floor(qe.damageAllAmount * batchMultiplier);
        if (dmg > 0) {
          postDeployEnemies = postDeployEnemies.map(e => {
            if (e.currentHp <= 0) return e;
            return applyDamageToEnemy(e, calculateDamage(dmg, battle.playerStatusEffects, e.statusEffects, run.items));
          });
        }
      }
      // Fire: queued burn application to all enemies
      if (qe.burnApply) {
        const burnAmt = Math.floor(qe.burnApply * batchMultiplier);
        if (burnAmt > 0) {
          postDeployEnemies = postDeployEnemies.map(e => ({
            ...e,
            statusEffects: { ...e.statusEffects, burn: (e.statusEffects.burn || 0) + burnAmt },
          }));
          // burnPropagation relic: also apply 1 burn to every other enemy
          if (run.items.some(i => i.effect.burnPropagation) && postDeployEnemies.length > 1) {
            postDeployEnemies = postDeployEnemies.map(e => ({
              ...e,
              statusEffects: { ...e.statusEffects, burn: (e.statusEffects.burn || 0) + 1 },
            }));
          }
        }
      }
      // Lightning: queued chain damage to each enemy individually
      if (qe.chainAmount) {
        const chainDmg = Math.floor(qe.chainAmount * batchMultiplier);
        if (chainDmg > 0) {
          postDeployEnemies = postDeployEnemies.map(e => {
            if (e.currentHp <= 0) return e;
            return applyDamageToEnemy(e, calculateDamage(chainDmg, battle.playerStatusEffects, e.statusEffects, run.items));
          });
        }
      }
    }

    // System Meltdown: all 3 elements fired — apply 1 Vulnerable to all enemies
    if (systemMeltdown) {
      postDeployEnemies = postDeployEnemies.map(e => ({
        ...e,
        statusEffects: { ...e.statusEffects, vulnerable: (e.statusEffects.vulnerable || 0) + 1 },
      }));
    }

    // healOnDetonate relic: heal N HP when detonation fires
    const healOnDet = run.items.reduce((s, i) => s + (i.effect.healOnDetonate || 0), 0);
    if (healOnDet > 0) {
      hpChange += healOnDet;
    }
    // vulnerableOnDetonate relic: apply 1 Vulnerable to all enemies when detonation fires
    if (run.items.some(i => i.effect.vulnerableOnDetonate)) {
      postDeployEnemies = postDeployEnemies.map(e => ({
        ...e,
        statusEffects: { ...e.statusEffects, vulnerable: (e.statusEffects.vulnerable || 0) + 1 },
      }));
    }
    // tripleElementEnergy relic: firing all 3 elements grants 1 bonus energy next turn
    if (systemMeltdown) {
      const tripleEnergy = run.items.reduce((s, i) => s + (i.effect.tripleElementEnergy || 0), 0);
      if (tripleEnergy > 0) {
        // Add bonus energy immediately this turn (already at start of turn, so goes into current energy)
        engineerPassiveEnergy += tripleEnergy;
      }
    }

    // Filter enemies killed by detonations — count kills and gold first
    const detonationKilled = postDeployEnemies.filter(e => e.currentHp <= 0);
    detonationKillCount += detonationKilled.length;
    detonationGoldEarned += detonationKilled.reduce((sum, e) => sum + (e.gold || 0), 0);
    postDeployEnemies = postDeployEnemies.filter(e => e.currentHp > 0);
  }

  // Decay dodge by 1 at start of player's turn (predictable, visible decay)
  let finalPlayerStatus = mergedWithEngineer;
  if (finalPlayerStatus.dodge && finalPlayerStatus.dodge > 0) {
    finalPlayerStatus = {
      ...finalPlayerStatus,
      dodge: finalPlayerStatus.dodge > 1 ? finalPlayerStatus.dodge - 1 : undefined,
    };
  }

  // Accumulate bleed + detonation kill/gold into battle totals
  const totalKillCount = (battle.killCount || 0) + bleedKillCount + detonationKillCount;
  const totalGoldEarned = (battle.goldEarned || 0) + bleedGoldEarned + detonationGoldEarned;

  return {
    battle: {
      ...battle,
      killCount: totalKillCount,
      goldEarned: totalGoldEarned,
      hand,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      exhaustPile: newExhaust,
      energy: Math.max(0, battle.maxEnergy + hustleEnergy + engineerPassiveEnergy - (battle.nextTurnEnergyPenalty || 0)),
      playerBlock: newBlock + blockBonus + deploymentBlock + detonationBlock + engineerPassiveBlock,
      playerStatusEffects: finalPlayerStatus,
      enemies: postDeployEnemies,
      deployments: activeDeployments,
      turn: battle.turn + 1,
      cardsPlayedThisTurn: 0,
      firstAttackPlayedThisTurn: false,
      firstSkillPlayedThisTurn: false,
      nextCardCostZero: false,
      temperature: battle.temperature ?? 5,
      tokens: Math.max(0, (battle.tokens ?? 0) + engineerTokenGain - tokenLoss),
      cardPlayCounts: battle.cardPlayCounts ?? {},
      nextTurnDrawPenalty: 0,
      nextTurnEnergyPenalty: 0,
      flow: retainFlow > 0 ? Math.min(battle.flow ?? 0, retainFlow) : 0,
      nextCardCostReduction: 0,
      detonationQueue: [...remainingQueue, ...engineerQueuedEffects],
      dodgedThisTurn: false,
    },
    stressChange,
    hpChange,
  };
}
