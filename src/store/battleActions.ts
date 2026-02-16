import { v4 as uuidv4 } from 'uuid';
import type { BattleState, EnemyDef, EnemyInstance, CardInstance, RunState } from '../types';
import { createCardInstance, shuffleDeck, drawCards } from '../utils/deckUtils';
import {
  calculateDamage,
  calculateBlock,
  applyDamageToEnemy,
  applyDamageToPlayer,
  tickStatusEffects,
  mergeStatusEffects,
} from '../utils/battleEngine';

export function initBattle(run: RunState, enemyDefs: EnemyDef[]): BattleState {
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

  return {
    enemies,
    hand: drawn,
    drawPile: newDrawPile,
    discardPile: newDiscardPile,
    exhaustPile: [],
    energy: run.character.energy + extraEnergy,
    maxEnergy: run.character.energy + extraEnergy,
    turn: 1,
    playerBlock: 0,
    playerStatusEffects: {},
  };
}

export function executePlayCard(
  battle: BattleState,
  run: RunState,
  cardInstanceId: string,
  targetInstanceId?: string
): BattleState {
  const cardIndex = battle.hand.findIndex(c => c.instanceId === cardInstanceId);
  if (cardIndex === -1) return battle;

  const card = battle.hand[cardIndex];
  if (card.cost > battle.energy) return battle;

  let newBattle = { ...battle };
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

  // Apply block
  if (effects.block) {
    const block = calculateBlock(effects.block, battle.playerStatusEffects, run.items);
    newBattle.playerBlock = (newBattle.playerBlock || 0) + block;
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

  // Heal
  if (effects.heal) {
    // Handled at run level
  }

  // Move card to discard
  newBattle.discardPile = [...newBattle.discardPile, card];

  // Remove dead enemies
  newBattle.enemies = newBattle.enemies.filter(e => e.currentHp > 0);

  return newBattle;
}

export function executeEnemyTurn(
  battle: BattleState,
  run: RunState
): { battle: BattleState; playerHp: number } {
  let newBattle = { ...battle };
  let playerHp = run.hp;

  // Reset player block
  newBattle.playerBlock = 0;

  // Each enemy acts
  newBattle.enemies = newBattle.enemies.map(enemy => {
    const move = enemy.currentMove;
    let updatedEnemy = { ...enemy };

    // Reset enemy block
    updatedEnemy.block = 0;

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

  // Tick player status effects
  newBattle.playerStatusEffects = tickStatusEffects(newBattle.playerStatusEffects);

  return { battle: newBattle, playerHp };
}

export function startNewTurn(battle: BattleState, run: RunState): BattleState {
  // Discard hand
  const newDiscard = [...battle.discardPile, ...battle.hand];
  const extraDraw = run.items.reduce((sum, item) => sum + (item.effect.extraDraw || 0), 0);
  const drawCount = 5 + extraDraw;

  const { drawn, newDrawPile, newDiscardPile } = drawCards(battle.drawPile, newDiscard, drawCount);

  return {
    ...battle,
    hand: drawn,
    drawPile: newDrawPile,
    discardPile: newDiscardPile,
    energy: battle.maxEnergy,
    turn: battle.turn + 1,
  };
}
