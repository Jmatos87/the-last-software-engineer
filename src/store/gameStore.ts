import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, EnemyDef, ConsumableInstance } from '../types';
import { characters } from '../data/characters';
import { cards, getRewardCards, getCardDef } from '../data/cards';
import { enemies, getNormalEncounter, getEliteEncounter, getBossEncounter } from '../data/enemies';
import { generateBlueprint } from '../data/engineers';
import { getEligibleEvent } from '../data/events';
import { items, getRewardArtifact, getStarterRelic } from '../data/items';
import { consumables, getConsumableDrop, getRareConsumable, getRandomConsumable, getConsumableDef } from '../data/consumables';
import { createCardInstance } from '../utils/deckUtils';
import { generateMap } from '../utils/mapGenerator';
import { initBattle, executePlayCard, executeEnemyTurn, startNewTurn } from './battleActions';
import { calculateDamage, applyDamageToEnemy, mergeStatusEffects } from '../utils/battleEngine';
import { drawCards } from '../utils/deckUtils';
import { v4 as uuidv4 } from 'uuid';
import type { CardClass } from '../types';

function getPlayerClass(characterId?: string): CardClass | undefined {
  if (characterId === 'frontend_dev') return 'frontend';
  if (characterId === 'backend_dev') return 'backend';
  if (characterId === 'architect') return 'architect';
  if (characterId === 'ai_engineer') return 'ai_engineer';
  return undefined;
}

const SAVE_KEY = 'tlse-save';
const GAME_VERSION = '1.22.2';

function saveGame(state: { screen: import('../types').Screen; run: import('../types').RunState | null }) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: GAME_VERSION, screen: state.screen, run: state.run }));
  } catch { /* quota exceeded — silently fail */ }
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

function loadGame(): { screen: import('../types').Screen; run: import('../types').RunState } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Version check — clear save if version mismatch
    if (data.version !== GAME_VERSION) {
      clearSave();
      return null;
    }
    // Migrate old saves without consumable fields
    if (data.run && !data.run.consumables) {
      data.run.consumables = [];
      data.run.maxConsumables = 3;
    }
    // Migrate rarity rename: uncommon→rare, rare→epic
    if (data.run) {
      for (const card of data.run.deck || []) {
        if (card.rarity === 'uncommon') card.rarity = 'rare';
        else if (card.rarity === 'rare' && card.rarity !== 'epic') { /* already handled above if it was uncommon */ }
      }
      // Two-pass to handle old saves: uncommon→rare first, then old rare→epic
      // We need to detect whether this was a pre-overhaul save
      // Simple heuristic: if any card has rarity 'uncommon', it's a pre-overhaul save
      const hasUncommon = (data.run.deck || []).some((c: any) => c.rarity === 'uncommon');
      if (hasUncommon) {
        for (const card of data.run.deck || []) {
          if (card.rarity === 'rare') card.rarity = 'epic';
          if (card.rarity === 'uncommon') card.rarity = 'rare';
        }
      }
      // Migrate item rarities
      for (const item of data.run.items || []) {
        if (item.rarity === 'uncommon') item.rarity = 'rare';
        else if (item.rarity === 'rare' && hasUncommon) item.rarity = 'epic';
      }
      // Migrate consumable rarities
      for (const c of data.run.consumables || []) {
        if (c.rarity === 'uncommon') c.rarity = 'rare';
        else if (c.rarity === 'rare' && hasUncommon) c.rarity = 'epic';
      }
    }
    // Migrate strength→confidence, dexterity→resilience rename
    if (data.run) {
      const migrateEffects = (fx: Record<string, unknown> | undefined) => {
        if (!fx) return;
        if ('strength' in fx) { (fx as any).confidence = fx.strength; delete fx.strength; }
        if ('dexterity' in fx) { (fx as any).resilience = fx.dexterity; delete fx.dexterity; }
      };
      // Player deck card effects
      for (const card of data.run.deck || []) {
        migrateEffects(card.effects?.applyToSelf);
        migrateEffects(card.effects?.applyToTarget);
        migrateEffects(card.effects?.applyToAll);
        migrateEffects(card.upgradedEffects?.applyToSelf);
        migrateEffects(card.upgradedEffects?.applyToTarget);
        migrateEffects(card.upgradedEffects?.applyToAll);
      }
      // Item effect property renames
      for (const item of data.run.items || []) {
        const e = item.effect;
        if (!e) continue;
        if ('startBattleStrength' in e) { e.startBattleConfidence = e.startBattleStrength; delete e.startBattleStrength; }
        if ('startBattleDexterity' in e) { e.startBattleResilience = e.startBattleDexterity; delete e.startBattleDexterity; }
        if ('strengthPerTurn' in e) { e.confidencePerTurn = e.strengthPerTurn; delete e.strengthPerTurn; }
        if ('strengthIfHasStrength' in e) { e.confidenceIfHasConfidence = e.strengthIfHasStrength; delete e.strengthIfHasStrength; }
        if ('startCombatStrengthPerPower' in e) { e.startCombatConfidencePerPower = e.startCombatStrengthPerPower; delete e.startCombatStrengthPerPower; }
        if ('startCombatActStrength' in e) { e.startCombatActConfidence = e.startCombatActStrength; delete e.startCombatActStrength; }
        if (e.perPowerPlayed) { migrateEffects(e.perPowerPlayed); }
        if (e.onPlayAttack) { migrateEffects(e.onPlayAttack); }
      }
    }
    // If the saved screen is a transient state with no persisted data, fall back to MAP
    const transientScreens = ['BATTLE', 'BATTLE_REWARD', 'EVENT', 'REST', 'SHOP'];
    if (data.screen && transientScreens.includes(data.screen) && data.run) {
      // For mid-battle refreshes: unvisit the current node and revert map position
      // so the player re-fights the encounter rather than skipping it.
      // Other transient screens (BATTLE_REWARD, EVENT, REST, SHOP) already resolved
      // their node action, so we leave the map state alone.
      if (data.screen === 'BATTLE') {
        const map = data.run.map;
        if (map) {
          const currentNodeId = map.currentNodeId;
          const currentRow = map.currentRow ?? -1;
          const currentNode = (map.nodes ?? []).find((n: any) => n.id === currentNodeId);
          if (currentNode) currentNode.visited = false;
          if (currentRow <= 0) {
            map.currentRow = -1;
            map.currentNodeId = null;
          } else {
            map.currentRow = currentRow - 1;
            const prevNode = (map.nodes ?? []).find((n: any) =>
              n.row === currentRow - 1 &&
              (n.connections ?? []).includes(currentNodeId) &&
              n.visited
            );
            map.currentNodeId = prevNode?.id ?? null;
          }
        }
      }
      data.screen = 'MAP';
    }
    return data;
  } catch { return null; }
}

const savedGame = loadGame();

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    screen: savedGame?.screen ?? 'CHARACTER_SELECT',
    run: savedGame?.run ?? null,
    battle: null,
    pendingRewards: null,
    pendingEvent: null,
    eventOutcome: null,
    pendingRemoveCount: null,
    pendingRemoveMessage: null,
    pendingRemoveCardsRemoved: [],
    pendingRemoveRewards: null,

    selectCharacter: (characterId: string) => {
      const char = characters.find(c => c.id === characterId);
      if (!char || !char.available) return;

      const deck = char.starterDeckIds.map(id => createCardInstance(getCardDef(id)));
      const map = generateMap(1);

      // Get starter relic if character has one
      const starterItems: import('../types').ItemDef[] = [];
      const starterRelic = getStarterRelic(characterId);
      if (starterRelic) starterItems.push(starterRelic);

      set(state => {
        state.run = {
          character: char,
          hp: char.hp,
          maxHp: char.hp,
          gold: 50,
          deck,
          items: starterItems as any,
          consumables: [],
          maxConsumables: 3,
          map,
          stress: 0,
          maxStress: char.maxStress,
          floor: 0,
          act: 1,
          seenEventIds: [],
          eventFlags: {},
        };
      });
    },

    startRun: () => {
      clearSave();
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
          const encounter = getBossEncounter(act, state.run ?? undefined);
          const enemyDefs = encounter.map(id => enemies[id]);
          get().startBattle(enemyDefs);
          break;
        }
        case 'rest':
          set(s => { s.screen = 'REST'; });
          break;
        case 'event': {
          // Act-aware, class-aware, no-repeat event selection
          const playerClass = getPlayerClass(state.run.character.id);
          const event = getEligibleEvent(state.run, playerClass);
          if (event) {
            set(s => {
              if (!s.run) return;
              s.pendingEvent = event;
              s.run.seenEventIds.push(event.id);
              s.screen = 'EVENT';
            });
          } else {
            // Fallback: if no events available, heal at a rest-like stop
            set(s => {
              if (!s.run) return;
              s.run.hp = Math.min(s.run.maxHp, s.run.hp + Math.floor(s.run.maxHp * 0.15));
              s.screen = 'MAP';
            });
          }
          break;
        }
        case 'shop':
          set(s => { s.screen = 'SHOP'; });
          break;
      }

      // Save game state after node selection
      const updated = get();
      saveGame({ screen: updated.screen, run: updated.run });
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

      const { battle: newBattle, stressReduction, hpChange, stressChange, goldChange } = executePlayCard(state.battle, state.run, cardInstanceId, targetInstanceId);

      set(s => {
        s.battle = newBattle as any;
        if (s.run) {
          if (stressReduction > 0) {
            s.run.stress = Math.max(0, s.run.stress - stressReduction);
          }
          if (stressChange !== 0) {
            s.run.stress = Math.max(0, Math.min(s.run.maxStress, s.run.stress + stressChange));
          }
          if (hpChange !== 0) {
            s.run.hp = Math.max(0, Math.min(s.run.maxHp, s.run.hp + hpChange));
          }
          if (goldChange !== 0) {
            s.run.gold = Math.max(0, s.run.gold + goldChange);
          }
        }
      });

      // Check if player died from self-damage
      const currentState = get();
      if (currentState.run && currentState.run.hp <= 0) {
        set(s => { s.battle = null; });
        get().gameOver();
        return;
      }
      // Check if stress maxed out
      if (currentState.run && currentState.run.stress >= currentState.run.maxStress) {
        set(s => {
          if (s.run) { s.run.hp = 0; s.run.stress = s.run.maxStress; }
          s.battle = null;
        });
        get().gameOver();
        return;
      }

      // Check if all enemies are dead — delay transition so death/flee animations play
      if (newBattle.enemies.length === 0) {
        const isElite = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const isBoss = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'boss';

        const kills = newBattle.killCount || 0;
        const allGhosted = kills === 0;
        const act = state.run.act;

        // Post-battle heal from items (only if you actually killed something)
        const healOnKill = kills > 0 ? state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0) : 0;
        const extraGold = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        // Take-Home Assignment fast-kill bonus: +15 gold if killed in <= 2 turns
        const takeHomeBonus = (newBattle.turn <= 2 && state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'battle') ? 15 : 0;

        const extraGoldPercent = state.run.items.reduce((sum, item) => sum + (item.effect.extraGoldPercent || 0), 0);
        const rawGold = allGhosted ? 0 : (newBattle.goldEarned + extraGold + takeHomeBonus);
        const goldReward = extraGoldPercent > 0 ? Math.floor(rawGold * (1 + extraGoldPercent / 100)) : rawGold;

        // Determine artifact drops
        const ownedIds = state.run.items.map(i => i.id);
        let artifactChoices: import('../types').ItemDef[] | undefined;
        if (isBoss) {
          artifactChoices = getRewardArtifact(ownedIds, 3, state.run?.character?.id);
        } else if (isElite && Math.random() < 0.5) {
          artifactChoices = getRewardArtifact(ownedIds, 1, state.run?.character?.id);
        }

        // Determine consumable drops
        const playerClassForConsumable = getPlayerClass(state.run?.character?.id);
        const canHoldConsumable = state.run.consumables.length < state.run.maxConsumables;
        let consumableChoices: import('../types').ConsumableDef[] | undefined;
        if (canHoldConsumable) {
          if (isBoss) {
            consumableChoices = [getRareConsumable()];
          } else if (isElite) {
            consumableChoices = [getConsumableDrop(act, playerClassForConsumable)];
          } else if (Math.random() < 0.5) {
            consumableChoices = [getConsumableDrop(act, playerClassForConsumable)];
          }
        }

        // Delay screen transition so death/flee animations play out
        setTimeout(() => {
          if (isBoss) {
            // Boss gives rewards before victory — full heal on boss kill
            set(s => {
              if (!s.run) return;
              s.run.hp = s.run.maxHp;
              s.run.gold += goldReward;
              s.pendingRewards = {
                gold: goldReward,
                cardChoices: allGhosted ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), act, 'boss') as any,
                artifactChoices: artifactChoices && artifactChoices.length > 0 ? artifactChoices as any : undefined,
                consumableChoices: consumableChoices,
                isBossReward: true,
              };
              s.screen = 'BATTLE_REWARD';
            });
            return;
          }
          // Post-fight passive stress
          const actStress = act === 1 ? 3 : act === 2 ? 5 : 8;
          // stressPerCombat relic: gain N extra stress after each combat
          const relicStress = state.run?.items.reduce((s, i) => s + (i.effect.stressPerCombat || 0), 0) ?? 0;
          // healPerCombat relic (office_plant): heal N HP after each combat
          const relicHeal = state.run?.items.reduce((s, i) => s + (i.effect.healPerCombat || 0), 0) ?? 0;
          set(s => {
            if (!s.run) return;
            s.run.hp = Math.min(s.run.maxHp, s.run.hp + healOnKill + relicHeal);
            s.run.gold += goldReward;
            s.run.stress = Math.min(s.run.maxStress, s.run.stress + actStress + relicStress);
            s.pendingRewards = {
              gold: goldReward,
              cardChoices: allGhosted ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), act, isElite ? 'elite' : 'normal') as any,
              artifactChoices: artifactChoices && artifactChoices.length > 0 ? artifactChoices as any : undefined,
              consumableChoices: consumableChoices,
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
        const allGhosted = kills === 0;

        const isElite = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const extraGold = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        const act2 = state.run.act;
        const extraGoldPercent2 = state.run.items.reduce((sum, item) => sum + (item.effect.extraGoldPercent || 0), 0);
        const rawGold2 = allGhosted ? 0 : (afterEnemyTurn.goldEarned + extraGold);
        const goldReward = extraGoldPercent2 > 0 ? Math.floor(rawGold2 * (1 + extraGoldPercent2 / 100)) : rawGold2;
        const healOnKill = state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0);

        // Determine artifact drops
        const ownedIds2 = state.run.items.map(i => i.id);
        let artifactChoices2: import('../types').ItemDef[] | undefined;
        if (isBoss) {
          artifactChoices2 = getRewardArtifact(ownedIds2, 3, state.run?.character?.id);
        } else if (isElite && Math.random() < 0.5) {
          artifactChoices2 = getRewardArtifact(ownedIds2, 1, state.run?.character?.id);
        }

        // Determine consumable drops
        const playerClassForConsumable2 = getPlayerClass(state.run?.character?.id);
        const canHoldConsumable2 = state.run.consumables.length < state.run.maxConsumables;
        let consumableChoices2: import('../types').ConsumableDef[] | undefined;
        if (canHoldConsumable2) {
          if (isBoss) {
            consumableChoices2 = [getRareConsumable()];
          } else if (isElite) {
            consumableChoices2 = [getConsumableDrop(act2, playerClassForConsumable2)];
          } else if (Math.random() < 0.5) {
            consumableChoices2 = [getConsumableDrop(act2, playerClassForConsumable2)];
          }
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
        const actStress2 = act2 === 1 ? 3 : act2 === 2 ? 5 : 8;
        setTimeout(() => {
          if (isBoss) {
            // Boss gives rewards before victory — full heal on boss kill
            set(s => {
              if (!s.run) return;
              s.run.hp = s.run.maxHp;
              s.pendingRewards = {
                gold: goldReward,
                cardChoices: allGhosted ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), act2, 'boss') as any,
                artifactChoices: artifactChoices2 && artifactChoices2.length > 0 ? artifactChoices2 as any : undefined,
                consumableChoices: consumableChoices2,
                isBossReward: true,
              };
              s.battle = null;
              s.screen = 'BATTLE_REWARD';
            });
            return;
          }
          set(s => {
            if (!s.run) return;
            s.run.stress = Math.min(s.run.maxStress, s.run.stress + actStress2);
            s.pendingRewards = {
              gold: goldReward,
              cardChoices: allGhosted ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), act2, isElite ? 'elite' : 'normal') as any,
              artifactChoices: artifactChoices2 && artifactChoices2.length > 0 ? artifactChoices2 as any : undefined,
              consumableChoices: consumableChoices2,
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

      const { battle: newTurn, stressChange, hpChange: turnHpChange } = startNewTurn(afterEnemyTurn, state.run);

      // Check if deployments killed the last enemy during start-of-turn processing
      if (newTurn.enemies.length === 0) {
        const isEliteAfterDeploy = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const isBossAfterDeploy = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'boss';

        const kills = newTurn.killCount || 0;
        const allGhosted = kills === 0;
        const actD = state.run.act;
        const extraGoldD = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        const extraGoldPercentD = state.run.items.reduce((sum, item) => sum + (item.effect.extraGoldPercent || 0), 0);
        const rawGoldD = allGhosted ? 0 : (newTurn.goldEarned + extraGoldD);
        const goldRewardD = extraGoldPercentD > 0 ? Math.floor(rawGoldD * (1 + extraGoldPercentD / 100)) : rawGoldD;
        const healOnKillD = kills > 0 ? state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0) : 0;

        const ownedIdsD = state.run.items.map(i => i.id);
        let artifactChoicesD: import('../types').ItemDef[] | undefined;
        if (isBossAfterDeploy) {
          artifactChoicesD = getRewardArtifact(ownedIdsD, 3, state.run?.character?.id);
        } else if (isEliteAfterDeploy && Math.random() < 0.5) {
          artifactChoicesD = getRewardArtifact(ownedIdsD, 1, state.run?.character?.id);
        }

        const playerClassForConsumableD = getPlayerClass(state.run?.character?.id);
        const canHoldConsumableD = state.run.consumables.length < state.run.maxConsumables;
        let consumableChoicesD: import('../types').ConsumableDef[] | undefined;
        if (canHoldConsumableD) {
          if (isBossAfterDeploy) {
            consumableChoicesD = [getRareConsumable()];
          } else if (isEliteAfterDeploy) {
            consumableChoicesD = [getConsumableDrop(actD, playerClassForConsumableD)];
          } else if (Math.random() < 0.5) {
            consumableChoicesD = [getConsumableDrop(actD, playerClassForConsumableD)];
          }
        }

        set(s => {
          if (!s.run) return;
          s.run.hp = Math.max(0, Math.min(s.run.maxHp, hpAfterRegen + turnHpChange + healOnKillD));
          s.run.stress = Math.max(0, Math.min(s.run.maxStress, playerStress + stressChange));
          s.run.gold += goldRewardD;
          s.battle = newTurn as any;
        });

        const actStressD = actD === 1 ? 3 : actD === 2 ? 5 : 8;
        setTimeout(() => {
          if (isBossAfterDeploy) {
            set(s => {
              if (!s.run) return;
              s.run.hp = s.run.maxHp;
              s.pendingRewards = {
                gold: goldRewardD,
                cardChoices: allGhosted ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), actD, 'boss') as any,
                artifactChoices: artifactChoicesD && artifactChoicesD.length > 0 ? artifactChoicesD as any : undefined,
                consumableChoices: consumableChoicesD,
                isBossReward: true,
              };
              s.battle = null;
              s.screen = 'BATTLE_REWARD';
            });
            return;
          }
          set(s => {
            if (!s.run) return;
            s.run.stress = Math.min(s.run.maxStress, s.run.stress + actStressD);
            s.pendingRewards = {
              gold: goldRewardD,
              cardChoices: allGhosted ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), actD, isEliteAfterDeploy ? 'elite' : 'normal') as any,
              artifactChoices: artifactChoicesD && artifactChoicesD.length > 0 ? artifactChoicesD as any : undefined,
              consumableChoices: consumableChoicesD,
            };
            s.battle = null;
            s.screen = 'BATTLE_REWARD';
          });
        }, 800);
        return;
      }

      set(s => {
        if (s.run) {
          s.run.hp = Math.max(0, Math.min(s.run.maxHp, hpAfterRegen + turnHpChange));
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
            // Stress relief on act completion
            const actStressRelief = s.run.act === 1 ? 30 : s.run.act === 2 ? 25 : 0;
            s.run.stress = Math.max(0, s.run.stress - actStressRelief);
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
      const afterPick = get();
      if (afterPick.screen === 'MAP') {
        saveGame({ screen: afterPick.screen, run: afterPick.run });
      } else if (afterPick.screen === 'VICTORY') {
        clearSave();
      }
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
            // Stress relief on act completion
            const actStressRelief = s.run.act === 1 ? 30 : s.run.act === 2 ? 25 : 0;
            s.run.stress = Math.max(0, s.run.stress - actStressRelief);
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
      const afterSkip = get();
      if (afterSkip.screen === 'MAP') {
        saveGame({ screen: afterSkip.screen, run: afterSkip.run });
      } else if (afterSkip.screen === 'VICTORY') {
        clearSave();
      }
    },

    rest: () => {
      set(s => {
        if (!s.run) return;
        const heal = Math.floor(s.run.maxHp * 0.3);
        s.run.hp = Math.min(s.run.maxHp, s.run.hp + heal);
        const stressRate = s.run.act === 1 ? 0.35 : s.run.act === 2 ? 0.25 : 0.20;
        const stressHeal = Math.floor(s.run.maxStress * stressRate);
        s.run.stress = Math.max(0, s.run.stress - stressHeal);
        s.screen = 'MAP';
      });
      const updated = get();
      saveGame({ screen: updated.screen, run: updated.run });
    },

    upgradeCard: (cardInstanceId: string) => {
      set(s => {
        if (!s.run) return;
        const card = s.run.deck.find(c => c.instanceId === cardInstanceId);
        if (!card || card.upgraded) return;

        card.upgraded = true;
        if (card.upgradedCost !== undefined) {
          card.cost = card.upgradedCost;
        }
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
        // Event reward scaling by act
        const evtScale = s.run.act === 1 ? 1 : s.run.act === 2 ? 1.5 : 2;
        if (outcome.hp) {
          const scaledHp = outcome.hp > 0 ? Math.floor(outcome.hp * evtScale) : outcome.hp;
          s.run.hp = Math.max(1, Math.min(s.run.maxHp, s.run.hp + scaledHp));
        }
        let goldChange: number | undefined;
        if (outcome.gold) {
          const scaledGold = outcome.gold > 0 ? Math.floor(outcome.gold * evtScale) : outcome.gold;
          s.run.gold += scaledGold;
          goldChange = scaledGold;
        }
        let cardAdded: any = undefined;
        if (outcome.addCard) {
          let cardDef;
          // Event card quality scaling by act
          let evtCardType = outcome.addCard;
          if (evtCardType === 'random_common' && s.run.act >= 2) evtCardType = 'random_rare';
          if (evtCardType === 'random_rare' && s.run.act >= 3 && Math.random() < 0.5) evtCardType = 'random_epic';
          if (evtCardType === 'random_uncommon') evtCardType = 'random_rare'; // migrate old event references
          if (evtCardType === 'random_common') {
            const commons = Object.values(cards).filter(c => c.rarity === 'common');
            cardDef = commons[Math.floor(Math.random() * commons.length)];
          } else if (evtCardType === 'random_rare') {
            const rares = Object.values(cards).filter(c => c.rarity === 'rare');
            cardDef = rares[Math.floor(Math.random() * rares.length)];
          } else if (evtCardType === 'random_epic') {
            const epics = Object.values(cards).filter(c => c.rarity === 'epic');
            cardDef = epics[Math.floor(Math.random() * epics.length)];
          } else {
            cardDef = cards[evtCardType];
          }
          if (cardDef) {
            const instance = createCardInstance(cardDef);
            s.run.deck.push(instance as any);
            cardAdded = instance;
          }
        }
        let cardRemoved: any = undefined;
        if (outcome.removeRandomCard && s.run.deck.length > 1) {
          const idx = Math.floor(Math.random() * s.run.deck.length);
          cardRemoved = { ...s.run.deck[idx] };
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
        if (outcome.setFlag) {
          s.run.eventFlags[outcome.setFlag] = true;
        }
        if (outcome.maxHp) {
          s.run.maxHp = Math.max(1, s.run.maxHp + outcome.maxHp);
          s.run.hp = Math.min(s.run.hp, s.run.maxHp);
        }

        let cardUpgraded: any = undefined;
        if (outcome.upgradeRandomCard) {
          const upgradable = s.run.deck.filter(c => !c.upgraded);
          if (upgradable.length > 0) {
            const card = upgradable[Math.floor(Math.random() * upgradable.length)];
            card.upgraded = true;
            if (card.upgradedCost !== undefined) card.cost = card.upgradedCost;
            if (card.upgradedEffects) card.effects = card.upgradedEffects;
            if (card.upgradedDescription) card.description = card.upgradedDescription;
            card.name = card.name + '+';
            cardUpgraded = { ...card };
          }
        }

        // Handle addConsumable
        let consumableAdded: ConsumableInstance | undefined;
        let consumableFull: ConsumableInstance | undefined;
        if (outcome.addConsumable) {
          const cType = outcome.addConsumable;
          const slotsAvailable = s.run.consumables.length < s.run.maxConsumables;
          if (cType === 'random_common_x2') {
            if (slotsAvailable) {
              const c1 = getRandomConsumable('common');
              const inst1: ConsumableInstance = { ...c1, instanceId: uuidv4() };
              s.run.consumables.push(inst1 as any);
              consumableAdded = inst1;
              if (s.run.consumables.length < s.run.maxConsumables) {
                const c2 = getRandomConsumable('common');
                const inst2: ConsumableInstance = { ...c2, instanceId: uuidv4() };
                s.run.consumables.push(inst2 as any);
              }
            } else {
              consumableFull = { ...getRandomConsumable('common'), instanceId: uuidv4() };
            }
          } else if (cType === 'random_uncommon_x2') {
            if (slotsAvailable) {
              const c1 = getRandomConsumable('rare');
              const inst1: ConsumableInstance = { ...c1, instanceId: uuidv4() };
              s.run.consumables.push(inst1 as any);
              consumableAdded = inst1;
              if (s.run.consumables.length < s.run.maxConsumables) {
                const c2 = getRandomConsumable('rare');
                const inst2: ConsumableInstance = { ...c2, instanceId: uuidv4() };
                s.run.consumables.push(inst2 as any);
              }
            } else {
              consumableFull = { ...getRandomConsumable('rare'), instanceId: uuidv4() };
            }
          } else {
            let cDef: import('../types').ConsumableDef | undefined;
            if (cType === 'random_common') cDef = getRandomConsumable('common');
            else if (cType === 'random_uncommon') cDef = getRandomConsumable('rare');
            else if (cType === 'random_rare') cDef = getRandomConsumable('rare');
            else if (cType === 'random_epic') cDef = getRandomConsumable('epic');
            else cDef = getConsumableDef(cType);
            if (cDef) {
              if (slotsAvailable) {
                const inst: ConsumableInstance = { ...cDef, instanceId: uuidv4() };
                s.run.consumables.push(inst as any);
                consumableAdded = inst;
              } else {
                consumableFull = { ...cDef, instanceId: uuidv4() };
              }
            }
          }
        }

        // If removeChosenCard, defer outcome — show card picker
        if (outcome.removeChosenCard && outcome.removeChosenCard > 0 && s.run.deck.length > 1) {
          s.pendingRemoveCount = outcome.removeChosenCard;
          s.pendingRemoveMessage = outcome.message;
          s.pendingRemoveCardsRemoved = [] as any;
          // Save any other rewards so confirmRemoveEventCard can include them in eventOutcome
          const pendingItemAdded = outcome.addItem
            ? (items.find(i => i.id === outcome.addItem) ?? undefined)
            : undefined;
          s.pendingRemoveRewards = {
            goldChange: goldChange,
            cardAdded: cardAdded,
            cardUpgraded: cardUpgraded,
            consumableAdded: consumableAdded,
            consumableFull: consumableFull,
            itemAdded: pendingItemAdded as any,
          };
          // Don't set eventOutcome yet — EventScreen will show card picker
          return;
        }

        const itemAdded = outcome.addItem
          ? (items.find(i => i.id === outcome.addItem) ?? undefined)
          : undefined;

        s.eventOutcome = {
          message: outcome.message,
          goldChange: goldChange,
          cardAdded: cardAdded,
          cardRemoved: cardRemoved,
          cardUpgraded: cardUpgraded,
          consumableAdded: consumableAdded,
          consumableFull: consumableFull,
          itemAdded: itemAdded as any,
        };
      });
    },

    dismissEventOutcome: () => {
      set(s => {
        s.pendingEvent = null;
        s.eventOutcome = null;
        s.pendingRemoveCount = null;
        s.pendingRemoveMessage = null;
        s.pendingRemoveCardsRemoved = [];
        s.pendingRemoveRewards = null;
        s.screen = 'MAP';
      });
      const updated = get();
      saveGame({ screen: updated.screen, run: updated.run });
    },

    buyCard: (cardId: string) => {
      const cardDef = cards[cardId];
      if (!cardDef) return;

      const cost = cardDef.rarity === 'common' ? 50 : cardDef.rarity === 'rare' ? 75 : cardDef.rarity === 'epic' ? 125 : cardDef.rarity === 'legendary' ? 200 : 50;

      set(s => {
        if (!s.run || s.run.gold < cost) return;
        s.run.gold -= cost;
        s.run.deck.push(createCardInstance(cardDef) as any);
      });
    },

    buyItem: (itemId: string) => {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const cost = item.rarity === 'common' ? 100 : item.rarity === 'rare' ? 150 : item.rarity === 'epic' ? 225 : item.rarity === 'legendary' ? 350 : 100;

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
      const state = get();
      if (!state.run) return;
      const discount = state.run.items.reduce((sum, item) => sum + (item.effect.cardRemovalDiscount || 0), 0);
      const cost = Math.max(0, 75 - discount);
      set(s => {
        if (!s.run || s.run.gold < cost || s.run.deck.length <= 1) return;
        s.run.gold -= cost;
        const idx = s.run.deck.findIndex(c => c.instanceId === cardInstanceId);
        if (idx !== -1) s.run.deck.splice(idx, 1);
      });
    },

    train: () => {
      set(s => {
        if (!s.run) return;
        const playerClass = getPlayerClass(s.run.character.id);
        const uncommons = Object.values(cards).filter((c: any) =>
          c.rarity === 'rare' && c.class === playerClass
        );
        if (uncommons.length > 0) {
          const pick = uncommons[Math.floor(Math.random() * uncommons.length)] as any;
          s.run.deck.push(createCardInstance(pick) as any);
        }
        s.screen = 'MAP';
      });
      const updated = get();
      saveGame({ screen: updated.screen, run: updated.run });
    },

    reflectRemoveCard: (cardInstanceId: string) => {
      set(s => {
        if (!s.run || s.run.deck.length <= 1) return;
        const idx = s.run.deck.findIndex(c => c.instanceId === cardInstanceId);
        if (idx !== -1) s.run.deck.splice(idx, 1);
        s.screen = 'MAP';
      });
      const updated = get();
      saveGame({ screen: updated.screen, run: updated.run });
    },

    returnToMap: () => {
      set(s => { s.screen = 'MAP'; });
      const updated = get();
      saveGame({ screen: updated.screen, run: updated.run });
    },

    gameOver: () => {
      clearSave();
      set(s => { s.screen = 'GAME_OVER'; });
    },

    victory: () => {
      clearSave();
      set(s => { s.screen = 'VICTORY'; });
    },

    restart: () => {
      clearSave();
      set(s => {
        s.screen = 'CHARACTER_SELECT';
        s.run = null;
        s.battle = null;
        s.pendingRewards = null;
        s.pendingEvent = null;
        s.eventOutcome = null;
        s.pendingRemoveCount = null;
        s.pendingRemoveMessage = null;
        s.pendingRemoveCardsRemoved = [];
        s.pendingRemoveRewards = null;
      });
    },

    useConsumable: (instanceId: string, targetInstanceId?: string) => {
      const state = get();
      if (!state.battle || !state.run) return;

      const cIdx = state.run.consumables.findIndex(c => c.instanceId === instanceId);
      if (cIdx === -1) return;
      const consumable = state.run.consumables[cIdx];

      set(s => {
        if (!s.run || !s.battle) return;
        // Remove consumable
        s.run.consumables.splice(cIdx, 1);

        const eff = consumable.effect;

        // Heal
        if (eff.heal) {
          s.run.hp = Math.min(s.run.maxHp, s.run.hp + eff.heal);
        }

        // Energy
        if (eff.energy) {
          s.battle.energy += eff.energy;
        }

        // Block
        if (eff.block) {
          s.battle.playerBlock += eff.block;
        }

        // Draw
        if (eff.draw) {
          const { drawn, newDrawPile, newDiscardPile } = drawCards(
            s.battle.drawPile, s.battle.discardPile, eff.draw
          );
          s.battle.hand = [...s.battle.hand, ...drawn] as any;
          s.battle.drawPile = newDrawPile as any;
          s.battle.discardPile = newDiscardPile as any;
        }

        // Stress relief
        if (eff.stressRelief) {
          s.run.stress = Math.max(0, s.run.stress - eff.stressRelief);
        }

        // Gold
        if (eff.goldGain) {
          s.run.gold += eff.goldGain;
        }

        // Self buffs
        if (eff.applyToSelf) {
          s.battle.playerStatusEffects = mergeStatusEffects(
            s.battle.playerStatusEffects, eff.applyToSelf
          ) as any;
        }

        // Single target damage + debuffs
        if (targetInstanceId && (eff.damage || eff.applyToTarget)) {
          const eIdx = s.battle.enemies.findIndex(e => e.instanceId === targetInstanceId);
          if (eIdx !== -1) {
            if (eff.damage) {
              const dmg = calculateDamage(eff.damage, s.battle.playerStatusEffects, s.battle.enemies[eIdx].statusEffects);
              s.battle.enemies[eIdx] = applyDamageToEnemy(s.battle.enemies[eIdx], dmg) as any;
            }
            if (eff.applyToTarget) {
              s.battle.enemies[eIdx] = {
                ...s.battle.enemies[eIdx],
                statusEffects: mergeStatusEffects(s.battle.enemies[eIdx].statusEffects, eff.applyToTarget),
              } as any;
            }
          }
        }

        // AoE damage + debuffs
        if (eff.damageAll) {
          s.battle.enemies = s.battle.enemies.map(enemy => {
            const dmg = calculateDamage(eff.damageAll!, s.battle!.playerStatusEffects, enemy.statusEffects);
            return applyDamageToEnemy(enemy, dmg);
          }) as any;
        }
        if (eff.applyToAll) {
          s.battle.enemies = s.battle.enemies.map(enemy => ({
            ...enemy,
            statusEffects: mergeStatusEffects(enemy.statusEffects, eff.applyToAll!),
          })) as any;
        }

        // Heal to full HP
        if (eff.healFull) {
          s.run.hp = s.run.maxHp;
        }

        // Stress to zero
        if (eff.stressToZero) {
          s.run.stress = 0;
        }

        // Add stress
        if (eff.addStress) {
          s.run.stress = Math.min(s.run.maxStress, s.run.stress + eff.addStress);
        }

        // Add epic cards to hand
        if (eff.addEpicCardsToHand && s.battle) {
          const playerClass = getPlayerClass(s.run.character.id);
          const epicCardsList = Object.values(cards).filter((c: any) =>
            c.rarity === 'epic' && (c.class === playerClass || !c.class)
          );
          const count = eff.addEpicCardsToHand;
          for (let i = 0; i < count; i++) {
            if (epicCardsList.length > 0) {
              const pick = epicCardsList[Math.floor(Math.random() * epicCardsList.length)] as any;
              const inst = createCardInstance(pick);
              (s.battle.hand as any[]).push(inst);
            }
          }
        }

        // Class-specific consumable effects
        // gainFlow: Frontend — gain N flow immediately
        if (eff.gainFlow) {
          s.battle.flow = Math.min(7, (s.battle.flow || 0) + eff.gainFlow);
        }

        // triggerDetonation: Backend — fire detonation queue immediately this turn
        if (eff.triggerDetonation && s.battle.detonationQueue && s.battle.detonationQueue.length > 0) {
          const queue = s.battle.detonationQueue;
          const qElements = new Set(queue.map((e: any) => e.element));
          const batchMult = qElements.size >= 3 ? 2.0 : qElements.size === 2 ? 1.5 : 1.0;
          let extraBlock = 0;
          for (const qe of queue as any[]) {
            if (qe.blockAmount) {
              extraBlock += Math.floor(qe.blockAmount * batchMult);
            }
            if (qe.damageAllAmount) {
              const dmgQ = Math.floor(qe.damageAllAmount * batchMult);
              if (dmgQ > 0) {
                s.battle.enemies = s.battle.enemies.map(en => {
                  const d = calculateDamage(dmgQ, s.battle!.playerStatusEffects, en.statusEffects);
                  return applyDamageToEnemy(en, d);
                }) as any;
              }
            }
            if (qe.chainAmount) {
              const chainD = Math.floor(qe.chainAmount * batchMult);
              if (chainD > 0) {
                s.battle.enemies = s.battle.enemies.map(en => {
                  const d = calculateDamage(chainD, s.battle!.playerStatusEffects, en.statusEffects);
                  return applyDamageToEnemy(en, d);
                }) as any;
              }
            }
          }
          s.battle.playerBlock += extraBlock;
          s.battle.detonationQueue = [] as any;
        }

        // advanceBlueprintConsumable: Architect — advance blueprint by N steps
        if (eff.advanceBlueprintConsumable && s.battle.blueprint) {
          const bpPrev = s.battle.blueprintProgress || 0;
          s.battle.blueprintProgress = Math.min(
            bpPrev + eff.advanceBlueprintConsumable,
            s.battle.blueprint.length
          );
          if ((s.battle.blueprintProgress || 0) >= s.battle.blueprint.length && s.battle.blueprint.length > 0) {
            // Evoke all slotted engineers and reset blueprint
            const slotsToEvoke = [...(s.battle.engineerSlots || [])];
            s.battle.engineerSlots = [] as any;
            s.battle.blueprint = generateBlueprint() as any;
            s.battle.blueprintProgress = 0;
            // Simple evoke: apply block from each slot's evoke
            for (const slot of slotsToEvoke as any[]) {
              if (slot.evokeEffect?.block) s.battle.playerBlock += slot.evokeEffect.block;
              if (slot.evokeEffect?.energy) s.battle.energy += slot.evokeEffect.energy;
            }
          }
        }

        // setTemperature: AI Engineer — set temperature to N
        if (eff.setTemperature !== undefined) {
          s.battle.temperature = Math.max(0, Math.min(10, eff.setTemperature));
        }

        // Remove dead enemies and track gold earned
        const deadFromConsumable = s.battle.enemies.filter(e => e.currentHp <= 0);
        s.battle.killCount = (s.battle.killCount || 0) + deadFromConsumable.length;
        s.battle.goldEarned = (s.battle.goldEarned || 0) + deadFromConsumable.reduce((sum, e) => sum + (e.gold || 0), 0);
        s.battle.enemies = s.battle.enemies.filter(e => e.currentHp > 0) as any;
      });

      // Check if battle won after consumable use
      const afterUse = get();
      if (afterUse.battle && afterUse.battle.enemies.length === 0) {
        const isEliteC = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'elite';
        const isBossC = state.run.map.nodes.find(
          n => n.id === state.run!.map.currentNodeId
        )?.type === 'boss';

        const killsC = afterUse.battle.killCount || 0;
        const allGhostedC = killsC === 0;
        const actC = state.run.act;
        const extraGoldC = state.run.items.reduce((sum, item) => sum + (item.effect.extraGold || 0), 0);
        const extraGoldPercentC = state.run.items.reduce((sum, item) => sum + (item.effect.extraGoldPercent || 0), 0);
        const rawGoldC = allGhostedC ? 0 : (afterUse.battle.goldEarned + extraGoldC);
        const goldRewardC = extraGoldPercentC > 0 ? Math.floor(rawGoldC * (1 + extraGoldPercentC / 100)) : rawGoldC;
        const healOnKillC = killsC > 0 ? state.run.items.reduce((sum, item) => sum + (item.effect.healOnKill || 0), 0) : 0;

        const ownedIdsC = state.run.items.map(i => i.id);
        let artifactChoicesC: import('../types').ItemDef[] | undefined;
        if (isBossC) {
          artifactChoicesC = getRewardArtifact(ownedIdsC, 3, state.run?.character?.id);
        } else if (isEliteC && Math.random() < 0.5) {
          artifactChoicesC = getRewardArtifact(ownedIdsC, 1, state.run?.character?.id);
        }

        const playerClassForConsumableC = getPlayerClass(state.run?.character?.id);
        const canHoldConsumableC = state.run.consumables.length < state.run.maxConsumables;
        let consumableChoicesC: import('../types').ConsumableDef[] | undefined;
        if (canHoldConsumableC) {
          if (isBossC) {
            consumableChoicesC = [getRareConsumable()];
          } else if (isEliteC) {
            consumableChoicesC = [getConsumableDrop(actC, playerClassForConsumableC)];
          } else if (Math.random() < 0.5) {
            consumableChoicesC = [getConsumableDrop(actC, playerClassForConsumableC)];
          }
        }

        set(s => {
          if (s.run) {
            s.run.hp = Math.min(s.run.maxHp, s.run.hp + healOnKillC);
            s.run.gold += goldRewardC;
          }
        });

        const actStressC = actC === 1 ? 3 : actC === 2 ? 5 : 8;
        setTimeout(() => {
          if (isBossC) {
            set(s => {
              if (!s.run) return;
              s.run.hp = s.run.maxHp;
              s.pendingRewards = {
                gold: goldRewardC,
                cardChoices: allGhostedC ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), actC, 'boss') as any,
                artifactChoices: artifactChoicesC && artifactChoicesC.length > 0 ? artifactChoicesC as any : undefined,
                consumableChoices: consumableChoicesC,
                isBossReward: true,
              };
              s.battle = null;
              s.screen = 'BATTLE_REWARD';
            });
            return;
          }
          set(s => {
            if (!s.run) return;
            s.run.stress = Math.min(s.run.maxStress, s.run.stress + actStressC);
            s.pendingRewards = {
              gold: goldRewardC,
              cardChoices: allGhostedC ? [] : getRewardCards(3, undefined, getPlayerClass(state.run?.character?.id), actC, isEliteC ? 'elite' : 'normal') as any,
              artifactChoices: artifactChoicesC && artifactChoicesC.length > 0 ? artifactChoicesC as any : undefined,
              consumableChoices: consumableChoicesC,
            };
            s.battle = null;
            s.screen = 'BATTLE_REWARD';
          });
        }, 800);
      }
    },

    pickRewardConsumable: (consumableId: string) => {
      set(s => {
        if (!s.run || !s.pendingRewards?.consumableChoices) return;
        const cDef = s.pendingRewards.consumableChoices.find(c => c.id === consumableId);
        if (!cDef || s.run.consumables.length >= s.run.maxConsumables) return;
        const inst: ConsumableInstance = { ...cDef, instanceId: uuidv4() };
        s.run.consumables.push(inst as any);
        s.pendingRewards.consumableChoices = undefined;
      });
    },

    skipRewardConsumable: () => {
      set(s => {
        if (!s.pendingRewards) return;
        s.pendingRewards.consumableChoices = undefined;
      });
    },

    buyConsumable: (consumableId: string) => {
      const cDef = consumables[consumableId];
      if (!cDef) return;
      const cost = cDef.rarity === 'common' ? 40 : cDef.rarity === 'rare' ? 65 : cDef.rarity === 'epic' ? 100 : cDef.rarity === 'legendary' ? 160 : 40;

      set(s => {
        if (!s.run || s.run.gold < cost || s.run.consumables.length >= s.run.maxConsumables) return;
        s.run.gold -= cost;
        const inst: ConsumableInstance = { ...cDef, instanceId: uuidv4() };
        s.run.consumables.push(inst as any);
      });
    },

    confirmRemoveEventCard: (cardInstanceId: string) => {
      set(s => {
        if (!s.run || !s.pendingRemoveCount || s.run.deck.length <= 1) return;
        const idx = s.run.deck.findIndex(c => c.instanceId === cardInstanceId);
        if (idx === -1) return;

        const removed = { ...s.run.deck[idx] };
        s.run.deck.splice(idx, 1);
        s.pendingRemoveCardsRemoved = [...s.pendingRemoveCardsRemoved, removed] as any;
        s.pendingRemoveCount -= 1;

        if (s.pendingRemoveCount <= 0) {
          // All removals done — show outcome, merging any deferred rewards
          s.eventOutcome = {
            message: s.pendingRemoveMessage || 'Cards removed.',
            cardsRemoved: s.pendingRemoveCardsRemoved as any,
            ...(s.pendingRemoveRewards || {}),
          };
          s.pendingRemoveCount = null;
          s.pendingRemoveMessage = null;
          s.pendingRemoveCardsRemoved = [];
          s.pendingRemoveRewards = null;
        }
      });
    },

    discardConsumable: (instanceId: string) => {
      set(s => {
        if (!s.run) return;
        const idx = s.run.consumables.findIndex(c => c.instanceId === instanceId);
        if (idx !== -1) s.run.consumables.splice(idx, 1);
      });
    },
  }))
);
