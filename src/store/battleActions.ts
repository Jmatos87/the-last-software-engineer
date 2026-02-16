import { v4 as uuidv4 } from 'uuid';
import type { BattleState, EnemyDef, EnemyInstance, RunState } from '../types';
import { createCardInstance, shuffleDeck, drawCards } from '../utils/deckUtils';
import { getCardDef } from '../data/cards';
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
  }

  return {
    battle: {
      enemies,
      hand: drawn,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      exhaustPile: [],
      energy: run.character.energy + extraEnergy,
      maxEnergy: run.character.energy + extraEnergy,
      turn: 1,
      playerBlock: 0,
      playerStatusEffects,
      killCount: 0,
      totalEnemies: enemies.length,
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
): { battle: BattleState; stressReduction: number } {
  const cardIndex = battle.hand.findIndex(c => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return { battle, stressReduction: 0 };

  const card = battle.hand[cardIndex];

  // Block curse cards from being played
  if (card.type === 'curse') return { battle, stressReduction: 0 };

  if (card.cost > battle.energy) return { battle, stressReduction: 0 };

  const newBattle = { ...battle };
  let stressReduction = 0;
  newBattle.energy -= card.cost;
  newBattle.hand = [...battle.hand];
  newBattle.hand.splice(cardIndex, 1);
  newBattle.enemies = [...battle.enemies];

  const effects = card.effects;

  // Apply damage to single target
  if (effects.damage && targetInstanceId) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      const enemy = newBattle.enemies[enemyIdx];
      const dmg = calculateDamage(effects.damage, battle.playerStatusEffects, enemy.statusEffects, run.items);

      // Handle multi-hit (pair programming)
      if (card.id === 'pair_programming') {
        let updatedEnemy = { ...enemy };
        for (let i = 0; i < 2; i++) {
          updatedEnemy = applyDamageToEnemy(updatedEnemy, dmg);
        }
        newBattle.enemies[enemyIdx] = updatedEnemy;
      } else {
        newBattle.enemies[enemyIdx] = applyDamageToEnemy(enemy, dmg);
      }

      // Apply debuffs to target
      if (effects.applyToTarget) {
        newBattle.enemies[enemyIdx] = {
          ...newBattle.enemies[enemyIdx],
          statusEffects: mergeStatusEffects(newBattle.enemies[enemyIdx].statusEffects, effects.applyToTarget),
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
    newBattle.enemies = newBattle.enemies.map(enemy => ({
      ...enemy,
      statusEffects: mergeStatusEffects(enemy.statusEffects, effects.applyToAll!),
    }));
  }

  // Apply block
  if (effects.block) {
    const block = calculateBlock(effects.block, battle.playerStatusEffects, run.items);
    newBattle.playerBlock = (newBattle.playerBlock || 0) + block;
  }

  // Apply copium — directly reduces stress
  if (effects.copium) {
    stressReduction = calculateCopium(effects.copium, battle.playerStatusEffects);
  }

  // Apply self buffs
  if (effects.applyToSelf) {
    newBattle.playerStatusEffects = mergeStatusEffects(newBattle.playerStatusEffects, effects.applyToSelf);
  }

  // Apply target debuffs (for cards like code_review that only apply debuffs)
  if (effects.applyToTarget && targetInstanceId && !effects.damage) {
    const enemyIdx = newBattle.enemies.findIndex(e => e.instanceId === targetInstanceId);
    if (enemyIdx !== -1) {
      newBattle.enemies[enemyIdx] = {
        ...newBattle.enemies[enemyIdx],
        statusEffects: mergeStatusEffects(newBattle.enemies[enemyIdx].statusEffects, effects.applyToTarget),
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

  // Move card to discard (powers get exhausted — single use per battle)
  if (card.type === 'power') {
    newBattle.exhaustPile = [...newBattle.exhaustPile, card];
  } else {
    newBattle.discardPile = [...newBattle.discardPile, card];
  }

  // Remove dead enemies and track kills
  const killed = newBattle.enemies.filter(e => e.currentHp <= 0).length;
  newBattle.killCount = (newBattle.killCount || 0) + killed;
  newBattle.enemies = newBattle.enemies.filter(e => e.currentHp > 0);

  return { battle: newBattle, stressReduction };
}

export function executeEnemyTurn(
  battle: BattleState,
  run: RunState
): { battle: BattleState; playerHp: number; playerStress: number; enemiesVanished: number; enemiesKilled: number; vanishedIds: string[]; goldChange: number } {
  const newBattle = { ...battle };
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

export function startNewTurn(battle: BattleState, run: RunState): { battle: BattleState; stressChange: number } {
  // Reset player block (Savings Account retains up to X)
  const savedBlock = battle.playerStatusEffects.savingsAccount || 0;
  const newBlock = savedBlock > 0 ? Math.min(battle.playerBlock, savedBlock) : 0;

  // Discard hand
  const newDiscard = [...battle.discardPile, ...battle.hand];
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
  // Self Care: reduce stress
  const selfCare = battle.playerStatusEffects.selfCare || 0;
  if (selfCare > 0) stressChange -= selfCare;
  // Hustle Culture: gain stress
  if (hustleEnergy > 0) stressChange += 3 * hustleEnergy;

  // Touch Grass (regen): heal HP — handled in executeEnemyTurn already via regen

  return {
    battle: {
      ...battle,
      hand,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      energy: battle.maxEnergy + hustleEnergy,
      playerBlock: newBlock,
      turn: battle.turn + 1,
    },
    stressChange,
  };
}
