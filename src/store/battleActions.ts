import { v4 as uuidv4 } from 'uuid';
import type { BattleState, EnemyDef, EnemyInstance, RunState, CardInstance } from '../types';
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
    if (item.effect.startBattleStrength) {
      playerStatusEffects.strength = (playerStatusEffects.strength || 0) + item.effect.startBattleStrength;
    }
    if (item.effect.startBattleDexterity) {
      playerStatusEffects.dexterity = (playerStatusEffects.dexterity || 0) + item.effect.startBattleDexterity;
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
    if (item.effect.startCombatStrengthPerPower) {
      // Count power cards in deck
      const powerCount = run.deck.filter(c => c.type === 'power').length;
      playerStatusEffects.strength = (playerStatusEffects.strength || 0) + powerCount;
    }
    if (item.effect.startCombatActStrength) {
      playerStatusEffects.strength = (playerStatusEffects.strength || 0) + run.act;
      playerStatusEffects.dexterity = (playerStatusEffects.dexterity || 0) + run.act;
    }
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
      energy: run.character.energy + extraEnergy,
      maxEnergy: run.character.energy + extraEnergy,
      turn: 1,
      playerBlock: startBlock,
      playerStatusEffects,
      killCount: 0,
      totalEnemies: enemies.length,
      powersPlayedThisCombat: 0,
      cardsPlayedThisTurn: 0,
      firstAttackPlayedThisTurn: false,
      firstSkillPlayedThisTurn: false,
      firstPowerPlayedThisCombat: false,
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

  // Gain gold
  if (effects.gainGold) {
    goldChange += effects.gainGold;
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
        if (item.effect.perPowerPlayed.strength) {
          newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { strength: item.effect.perPowerPlayed.strength });
        }
        if (item.effect.perPowerPlayed.dexterity) {
          newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, { dexterity: item.effect.perPowerPlayed.dexterity });
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

  // Remove dead enemies and track kills
  const killed = newBattle.enemies.filter(e => e.currentHp <= 0).length;
  newBattle.killCount = (newBattle.killCount || 0) + killed;
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

    // Advance move index
    const nextIndex = (updatedEnemy.moveIndex + 1) % updatedEnemy.moves.length;
    updatedEnemy.moveIndex = nextIndex;
    updatedEnemy.currentMove = updatedEnemy.moves[nextIndex];

    // Tick enemy status effects
    updatedEnemy.statusEffects = tickStatusEffects(updatedEnemy.statusEffects);

    return updatedEnemy;
  });

  // Count vanished vs killed (by counter-offer thorns) before filtering
  const enemiesVanished = enemiesToRemove.length;
  const enemiesKilled = newBattle.enemies.filter(e =>
    e.currentHp <= 0 && !enemiesToRemove.includes(e.instanceId)
  ).length;
  newBattle.killCount = (newBattle.killCount || 0) + enemiesKilled;

  // Remove vanished enemies (Ghost Company) and enemies killed by Counter-Offer
  newBattle.enemies = newBattle.enemies.filter(e =>
    e.currentHp > 0 && !enemiesToRemove.includes(e.instanceId)
  );

  // Tick player status effects
  newBattle.playerStatusEffects = tickStatusEffects(newBattle.playerStatusEffects);

  return { battle: newBattle, playerHp, playerStress, enemiesVanished, enemiesKilled, vanishedIds: enemiesToRemove, goldChange };
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
  // Self Care: reduce stress
  const selfCare = battle.playerStatusEffects.selfCare || 0;
  if (selfCare > 0) stressChange -= selfCare;
  // Hustle Culture: gain stress
  if (hustleEnergy > 0) stressChange += 3 * hustleEnergy;

  // Relic: strengthPerTurn (fine_tuning, scaling_laws handled via powers, but some relics give it)
  let turnStartStatusMerge: import('../types').StatusEffect = {};
  for (const item of run.items) {
    if (item.effect.strengthPerTurn) {
      turnStartStatusMerge.strength = (turnStartStatusMerge.strength || 0) + item.effect.strengthPerTurn;
    }
    if (item.effect.blockPerTurn) {
      // Added to block below
    }
    if (item.effect.copiumPerTurn) {
      stressChange -= item.effect.copiumPerTurn;
    }
    if (item.effect.strengthIfHasStrength && (battle.playerStatusEffects.strength || 0) > 0) {
      turnStartStatusMerge.strength = (turnStartStatusMerge.strength || 0) + 1;
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

  return {
    battle: {
      ...battle,
      hand,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      exhaustPile: newExhaust,
      energy: battle.maxEnergy + hustleEnergy,
      playerBlock: newBlock + blockBonus,
      playerStatusEffects: mergedStatus,
      turn: battle.turn + 1,
      cardsPlayedThisTurn: 0,
      firstAttackPlayedThisTurn: false,
      firstSkillPlayedThisTurn: false,
    },
    stressChange,
    hpChange,
  };
}
