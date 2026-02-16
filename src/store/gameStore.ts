import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, EnemyDef } from '../types';
import { characters } from '../data/characters';
import { cards, getRewardCards, getCardDef } from '../data/cards';
import { enemies, normalEncounters, eliteEncounters, bossEncounters } from '../data/enemies';
import { events } from '../data/events';
import { items } from '../data/items';
import { createCardInstance } from '../utils/deckUtils';
import { generateMap } from '../utils/mapGenerator';
import { initBattle, executePlayCard, executeEnemyTurn, startNewTurn } from './battleActions';

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    screen: 'CHARACTER_SELECT',
    run: null,
    battle: null,
    pendingRewards: null,
    pendingEvent: null,
    eventOutcome: null,

    selectCharacter: (characterId: string) => {
      const char = characters.find(c => c.id === characterId);
      if (!char || !char.available) return;

      const deck = char.starterDeckIds.map(id => createCardInstance(getCardDef(id)));
      const map = generateMap();

      set(state => {
        state.run = {
          character: char,
          hp: char.hp,
          maxHp: char.hp,
          gold: 50,
          deck,
          items: [],
          map,
          stress: 0,
          maxStress: char.maxStress,
          floor: 0,
          act: 1,
        };
      });
    },

    startRun: () => {
      set(state => {
        state.screen = 'MAP';
      });
    },

    navigateToNode: (nodeId: string) => {
      const state = get();
      if (!state.run) return;

      const node = state.run.map.nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Check if node is reachable
      const { currentRow, currentNodeId } = state.run.map;
      if (currentRow === -1) {
        // Must be row 0
        if (node.row !== 0) return;
      } else {
        const currentNode = state.run.map.nodes.find(n => n.id === currentNodeId);
        if (!currentNode || !currentNode.connections.includes(nodeId)) return;
      }

      set(s => {
        if (!s.run) return;
        s.run.map.currentNodeId = nodeId;
        s.run.map.currentRow = node.row;
        const mapNode = s.run.map.nodes.find(n => n.id === nodeId);
        if (mapNode) mapNode.visited = true;
      });

      // Transition to appropriate screen
      switch (node.type) {
        case 'battle': {
          const encounter = normalEncounters[Math.floor(Math.random() * normalEncounters.length)];
          const enemyDefs = encounter.map(id => enemies[id]);
          get().startBattle(enemyDefs);
          break;
        }
        case 'elite': {
          const encounter = eliteEncounters[Math.floor(Math.random() * eliteEncounters.length)];
          const enemyDefs = encounter.map(id => enemies[id]);
          get().startBattle(enemyDefs);
          break;
        }
        case 'boss': {
          const encounter = bossEncounters[0];
          const enemyDefs = encounter.map(id => enemies[id]);
          get().startBattle(enemyDefs);
          break;
        }
        case 'rest':
          set(s => { s.screen = 'REST'; });
          break;
        case 'event': {
          const event = events[Math.floor(Math.random() * events.length)];
          set(s => {
            s.pendingEvent = event;
            s.screen = 'EVENT';
          });
          break;
        }
        case 'shop':
          set(s => { s.screen = 'SHOP'; });
          break;
      }
    },

    startBattle: (enemyDefs: EnemyDef[]) => {
      const state = get();
      if (!state.run) return;

      const battleState = initBattle(state.run, enemyDefs);

      set(s => {
        s.battle = battleState;
        s.screen = 'BATTLE';
      });
    },

    playCard: (cardInstanceId: string, targetInstanceId?: string) => {
      const state = get();
      if (!state.battle || !state.run) return;

      const { battle: newBattle, stressReduction } = executePlayCard(state.battle, state.run, cardInstanceId, targetInstanceId);

      set(s => {
        s.battle = newBattle as any;
        if (s.run && stressReduction > 0) {
          s.run.stress = Math.max(0, s.run.stress - stressReduction);
        }
      });

      // Check if all enemies are dead
      if (newBattle.enemies.length === 0) {
        const isElite = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const isBoss = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'boss';

        if (isBoss) {
          get().victory();
          return;
        }

        // Post-battle heal from items
        const healOnKill = state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0);
        const extraGold = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        // Take-Home Assignment fast-kill bonus: +15 gold if killed in <= 2 turns
        const takeHomeBonus = (newBattle.turn <= 2 && state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'battle') ? 15 : 0;
        const goldReward = (isElite ? 30 : 15) + Math.floor(Math.random() * 10) + extraGold + takeHomeBonus;

        set(s => {
          if (!s.run) return;
          s.run.hp = Math.min(s.run.maxHp, s.run.hp + healOnKill);
          s.pendingRewards = {
            gold: goldReward,
            cardChoices: getRewardCards(3) as any,
          };
          s.screen = 'BATTLE_REWARD';
        });
      }
    },

    endTurn: () => {
      const state = get();
      if (!state.battle || !state.run) return;

      const { battle: afterEnemyTurn, playerHp, playerStress } = executeEnemyTurn(state.battle, state.run);

      if (playerHp <= 0) {
        set(s => {
          if (s.run) s.run.hp = 0;
          s.battle = null;
        });
        get().gameOver();
        return;
      }

      if (playerStress >= state.run.maxStress) {
        set(s => {
          if (s.run) {
            s.run.hp = 0;
            s.run.stress = s.run.maxStress;
          }
          s.battle = null;
        });
        get().gameOver();
        return;
      }

      // Apply player regen (Touch Grass) before new turn
      const regenAmount = afterEnemyTurn.playerStatusEffects.regen || 0;
      const hpAfterRegen = regenAmount > 0 ? Math.min(state.run.maxHp, playerHp + regenAmount) : playerHp;

      const { battle: newTurn, stressChange } = startNewTurn(afterEnemyTurn, state.run);

      set(s => {
        if (s.run) {
          s.run.hp = hpAfterRegen;
          s.run.stress = Math.max(0, Math.min(s.run.maxStress, playerStress + stressChange));
        }
        s.battle = newTurn as any;
      });
    },

    collectRewardGold: () => {
      set(s => {
        if (!s.run || !s.pendingRewards) return;
        s.run.gold += s.pendingRewards.gold;
        s.pendingRewards.gold = 0;
      });
    },

    pickRewardCard: (cardId: string) => {
      const state = get();
      if (!state.run || !state.pendingRewards) return;

      const cardDef = state.pendingRewards.cardChoices.find(c => c.id === cardId);
      if (!cardDef) return;

      const instance = createCardInstance(cardDef);

      set(s => {
        if (!s.run) return;
        // Auto-collect any uncollected gold before clearing rewards
        if (s.pendingRewards && s.pendingRewards.gold > 0) {
          s.run.gold += s.pendingRewards.gold;
        }
        s.run.deck.push(instance as any);
        s.pendingRewards = null;
        s.screen = 'MAP';
      });
    },

    skipRewardCards: () => {
      set(s => {
        // Auto-collect any uncollected gold before clearing rewards
        if (s.run && s.pendingRewards && s.pendingRewards.gold > 0) {
          s.run.gold += s.pendingRewards.gold;
        }
        s.pendingRewards = null;
        s.screen = 'MAP';
      });
    },

    rest: () => {
      set(s => {
        if (!s.run) return;
        const heal = Math.floor(s.run.maxHp * 0.3);
        s.run.hp = Math.min(s.run.maxHp, s.run.hp + heal);
        const stressHeal = Math.floor(s.run.maxStress * 0.3);
        s.run.stress = Math.max(0, s.run.stress - stressHeal);
        s.screen = 'MAP';
      });
    },

    upgradeCard: (cardInstanceId: string) => {
      set(s => {
        if (!s.run) return;
        const card = s.run.deck.find(c => c.instanceId === cardInstanceId);
        if (!card || card.upgraded) return;

        card.upgraded = true;
        if (card.upgradedEffects) {
          card.effects = card.upgradedEffects;
        }
        if (card.upgradedDescription) {
          card.description = card.upgradedDescription;
        }
        card.name = card.name + '+';
        s.screen = 'MAP';
      });
    },

    makeEventChoice: (choiceIndex: number) => {
      const state = get();
      if (!state.run || !state.pendingEvent) return;

      const choice = state.pendingEvent.choices[choiceIndex];
      if (!choice) return;

      set(s => {
        if (!s.run) return;

        const outcome = choice.outcome;
        if (outcome.hp) {
          s.run.hp = Math.max(1, Math.min(s.run.maxHp, s.run.hp + outcome.hp));
        }
        if (outcome.gold) {
          s.run.gold += outcome.gold;
        }
        let cardAdded: any = undefined;
        if (outcome.addCard) {
          let cardDef;
          if (outcome.addCard === 'random_common') {
            const commons = Object.values(cards).filter(c => c.rarity === 'common');
            cardDef = commons[Math.floor(Math.random() * commons.length)];
          } else if (outcome.addCard === 'random_uncommon') {
            const uncommons = Object.values(cards).filter(c => c.rarity === 'uncommon');
            cardDef = uncommons[Math.floor(Math.random() * uncommons.length)];
          } else {
            cardDef = cards[outcome.addCard];
          }
          if (cardDef) {
            const instance = createCardInstance(cardDef);
            s.run.deck.push(instance as any);
            cardAdded = instance;
          }
        }
        if (outcome.removeRandomCard && s.run.deck.length > 1) {
          const idx = Math.floor(Math.random() * s.run.deck.length);
          s.run.deck.splice(idx, 1);
        }

        s.eventOutcome = {
          message: outcome.message,
          cardAdded: cardAdded,
        };
      });
    },

    dismissEventOutcome: () => {
      set(s => {
        s.pendingEvent = null;
        s.eventOutcome = null;
        s.screen = 'MAP';
      });
    },

    buyCard: (cardId: string) => {
      const cardDef = cards[cardId];
      if (!cardDef) return;

      const cost = cardDef.rarity === 'common' ? 50 : cardDef.rarity === 'uncommon' ? 75 : 150;

      set(s => {
        if (!s.run || s.run.gold < cost) return;
        s.run.gold -= cost;
        s.run.deck.push(createCardInstance(cardDef) as any);
      });
    },

    buyItem: (itemId: string) => {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const cost = item.rarity === 'common' ? 100 : item.rarity === 'uncommon' ? 150 : 250;

      set(s => {
        if (!s.run || s.run.gold < cost) return;
        s.run.gold -= cost;
        s.run.items.push(item as any);

        // Apply immediate effects
        if (item.effect.extraHp) {
          s.run.maxHp += item.effect.extraHp;
          s.run.hp += item.effect.extraHp;
        }
      });
    },

    removeCard: (cardInstanceId: string) => {
      const cost = 75;
      set(s => {
        if (!s.run || s.run.gold < cost || s.run.deck.length <= 1) return;
        s.run.gold -= cost;
        const idx = s.run.deck.findIndex(c => c.instanceId === cardInstanceId);
        if (idx !== -1) s.run.deck.splice(idx, 1);
      });
    },

    returnToMap: () => {
      set(s => { s.screen = 'MAP'; });
    },

    gameOver: () => {
      set(s => { s.screen = 'GAME_OVER'; });
    },

    victory: () => {
      set(s => { s.screen = 'VICTORY'; });
    },

    restart: () => {
      set(s => {
        s.screen = 'CHARACTER_SELECT';
        s.run = null;
        s.battle = null;
        s.pendingRewards = null;
        s.pendingEvent = null;
        s.eventOutcome = null;
      });
    },
  }))
);
