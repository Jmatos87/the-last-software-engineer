import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, EnemyDef } from '../types';
import { characters } from '../data/characters';
import { cards, getRewardCards, getCardDef } from '../data/cards';
import { enemies, getNormalEncounter, getEliteEncounter, getBossEncounter } from '../data/enemies';
import { events } from '../data/events';
import { items, getRewardArtifact } from '../data/items';
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
      const map = generateMap(1);

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
      const act = state.run.act;
      const totalRows = Math.max(...state.run.map.nodes.map(n => n.row)) + 1;
      switch (node.type) {
        case 'battle': {
          const encounter = getNormalEncounter(act, node.row, totalRows);
          const enemyDefs = encounter.map(id => enemies[id]);
          get().startBattle(enemyDefs);
          break;
        }
        case 'elite': {
          const encounter = getEliteEncounter(act);
          const enemyDefs = encounter.map(id => enemies[id]);
          get().startBattle(enemyDefs);
          break;
        }
        case 'boss': {
          const encounter = getBossEncounter(act);
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

      const { battle: battleState, hpAdjust, stressAdjust } = initBattle(state.run, enemyDefs);

      set(s => {
        if (!s.run) return;
        s.battle = battleState as any;
        s.screen = 'BATTLE';
        // Apply artifact start-of-combat HP/stress adjustments
        if (hpAdjust !== 0) {
          s.run.hp = Math.max(1, Math.min(s.run.maxHp, s.run.hp + hpAdjust));
        }
        if (stressAdjust !== 0) {
          s.run.stress = Math.max(0, Math.min(s.run.maxStress, s.run.stress + stressAdjust));
        }
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

      // Check if all enemies are dead — delay transition so death/flee animations play
      if (newBattle.enemies.length === 0) {
        const isElite = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const isBoss = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'boss';

        const kills = newBattle.killCount || 0;
        const total = newBattle.totalEnemies || 1;
        const allGhosted = kills === 0;

        // Post-battle heal from items (only if you actually killed something)
        const healOnKill = kills > 0 ? state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0) : 0;
        const extraGold = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        // Take-Home Assignment fast-kill bonus: +15 gold if killed in <= 2 turns
        const takeHomeBonus = (newBattle.turn <= 2 && state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'battle') ? 15 : 0;

        // Gold scales with kills — no kills (all ghosted) = no gold
        const baseGold = isElite ? 30 : 15;
        const goldPerKill = Math.floor(baseGold / total);
        const goldReward = allGhosted ? 0 : (goldPerKill * kills) + Math.floor(Math.random() * 10) + extraGold + takeHomeBonus;

        // Determine artifact drops
        const ownedIds = state.run.items.map(i => i.id);
        let artifactChoices: import('../types').ItemDef[] | undefined;
        if (isBoss) {
          artifactChoices = getRewardArtifact(ownedIds, 3);
        } else if (isElite && Math.random() < 0.5) {
          artifactChoices = getRewardArtifact(ownedIds, 1);
        }

        // Delay screen transition so death/flee animations play out
        setTimeout(() => {
          if (isBoss) {
            // Boss gives rewards before victory
            set(s => {
              if (!s.run) return;
              s.run.hp = Math.min(s.run.maxHp, s.run.hp + healOnKill);
              s.run.gold += goldReward;
              s.pendingRewards = {
                gold: goldReward,
                cardChoices: allGhosted ? [] : getRewardCards(3) as any,
                artifactChoices: artifactChoices && artifactChoices.length > 0 ? artifactChoices as any : undefined,
                isBossReward: true,
              };
              s.screen = 'BATTLE_REWARD';
            });
            return;
          }
          set(s => {
            if (!s.run) return;
            s.run.hp = Math.min(s.run.maxHp, s.run.hp + healOnKill);
            s.run.gold += goldReward;
            s.pendingRewards = {
              gold: goldReward,
              cardChoices: allGhosted ? [] : getRewardCards(3) as any,
              artifactChoices: artifactChoices && artifactChoices.length > 0 ? artifactChoices as any : undefined,
            };
            s.screen = 'BATTLE_REWARD';
          });
        }, 800);
      }
    },

    endTurn: () => {
      const state = get();
      if (!state.battle || !state.run) return;

      const { battle: afterEnemyTurn, playerHp, playerStress, goldChange } = executeEnemyTurn(state.battle, state.run);

      // Apply gold changes from enemy actions (gold steal)
      if (goldChange !== 0) {
        set(s => {
          if (s.run) s.run.gold = Math.max(0, s.run.gold + goldChange);
        });
      }

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

      // Check if all enemies are gone after enemy turn (e.g. Ghost Company vanished)
      if (afterEnemyTurn.enemies.length === 0) {
        const isBoss = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'boss';

        const kills = afterEnemyTurn.killCount || 0;
        const total = afterEnemyTurn.totalEnemies || 1;
        const allGhosted = kills === 0;

        // Reduced gold if you didn't kill enemies — only get gold per kill
        const isElite = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const extraGold = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        const baseGold = isElite ? 30 : 15;
        const goldPerKill = Math.floor(baseGold / total);
        const goldReward = allGhosted ? 0 : (goldPerKill * kills) + Math.floor(Math.random() * 5) + extraGold;
        const healOnKill = state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0);

        // Determine artifact drops
        const ownedIds2 = state.run.items.map(i => i.id);
        let artifactChoices2: import('../types').ItemDef[] | undefined;
        if (isBoss) {
          artifactChoices2 = getRewardArtifact(ownedIds2, 3);
        } else if (isElite && Math.random() < 0.5) {
          artifactChoices2 = getRewardArtifact(ownedIds2, 1);
        }

        // Update HP/stress immediately but keep battle mounted for animations
        set(s => {
          if (!s.run) return;
          s.run.hp = Math.min(s.run.maxHp, playerHp + (kills > 0 ? healOnKill : 0));
          s.run.stress = Math.max(0, Math.min(s.run.maxStress, playerStress));
          s.run.gold += goldReward;
          s.battle = afterEnemyTurn as any;
        });

        // Delay screen transition so flee/death animations play out
        setTimeout(() => {
          if (isBoss) {
            // Boss gives rewards before victory
            set(s => {
              if (!s.run) return;
              s.pendingRewards = {
                gold: goldReward,
                cardChoices: allGhosted ? [] : getRewardCards(3) as any,
                artifactChoices: artifactChoices2 && artifactChoices2.length > 0 ? artifactChoices2 as any : undefined,
                isBossReward: true,
              };
              s.battle = null;
              s.screen = 'BATTLE_REWARD';
            });
            return;
          }
          set(s => {
            if (!s.run) return;
            s.pendingRewards = {
              gold: goldReward,
              cardChoices: allGhosted ? [] : getRewardCards(3) as any,
              artifactChoices: artifactChoices2 && artifactChoices2.length > 0 ? artifactChoices2 as any : undefined,
            };
            s.battle = null;
            s.screen = 'BATTLE_REWARD';
          });
        }, 800);
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
      // Gold is now auto-collected — this is a no-op kept for compatibility
    },

    pickRewardCard: (cardId: string) => {
      const state = get();
      if (!state.run || !state.pendingRewards) return;

      const cardDef = state.pendingRewards.cardChoices.find(c => c.id === cardId);
      if (!cardDef) return;

      const instance = createCardInstance(cardDef);
      const isBossReward = state.pendingRewards.isBossReward;

      set(s => {
        if (!s.run) return;
        s.run.deck.push(instance as any);
        s.pendingRewards = null;
        if (isBossReward) {
          if (s.run.act >= 3) {
            s.screen = 'VICTORY';
          } else {
            // Advance to next act
            s.run.act += 1;
            s.run.floor = 0;
            s.run.map = generateMap(s.run.act) as any;
            s.screen = 'MAP';
          }
        } else {
          s.screen = 'MAP';
        }
      });
    },

    claimArtifact: (itemId: string) => {
      const state = get();
      if (!state.run || !state.pendingRewards?.artifactChoices) return;

      const item = state.pendingRewards.artifactChoices.find(i => i.id === itemId);
      if (!item) return;

      set(s => {
        if (!s.run || !s.pendingRewards) return;
        s.run.items.push(item as any);
        // Apply immediate effects (extraHp)
        if (item.effect.extraHp) {
          s.run.maxHp += item.effect.extraHp;
          s.run.hp += item.effect.extraHp;
        }
        // Clear artifact choices after picking
        s.pendingRewards.artifactChoices = undefined;
      });
    },

    skipRewardCards: () => {
      const isBossReward = get().pendingRewards?.isBossReward;
      set(s => {
        s.pendingRewards = null;
        if (isBossReward) {
          if (!s.run || s.run.act >= 3) {
            s.screen = 'VICTORY';
          } else {
            // Advance to next act
            s.run.act += 1;
            s.run.floor = 0;
            s.run.map = generateMap(s.run.act) as any;
            s.screen = 'MAP';
          }
        } else {
          s.screen = 'MAP';
        }
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
        if (outcome.addItem) {
          const itemToAdd = items.find(i => i.id === outcome.addItem);
          if (itemToAdd && !s.run.items.some(i => i.id === itemToAdd.id)) {
            s.run.items.push(itemToAdd as any);
            if (itemToAdd.effect.extraHp) {
              s.run.maxHp += itemToAdd.effect.extraHp;
              s.run.hp += itemToAdd.effect.extraHp;
            }
          }
        }
        if (outcome.stress) {
          s.run.stress = Math.max(0, Math.min(s.run.maxStress, s.run.stress + outcome.stress));
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
