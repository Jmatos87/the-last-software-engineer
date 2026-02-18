#!/usr/bin/env tsx
/**
 * simulate.ts — Archetype-aware battle simulator for The Last Software Engineer
 * Run with: npx tsx simulate.ts [runs_per_char=200]
 *
 * AI uses archetype detection on the current deck to drive card priority and
 * play ordering. Aggression scales smoothly with HP: full offense > 70% HP,
 * mixed at 50%, defensive priority < 30%.
 *
 * Archetypes:
 *   Frontend:  fortress (block/tank) | dom (AoE debuffer) | reactive (draw engine)
 *   Backend:   rate_limiter (counterOffer snowball) | brute_force (confidence stacking) | query_optimizer (exhaust-draw)
 *   Architect: design_patterns (dual-stat powers) | scope_creep (energy ramp/bombs) | tech_spec (free/exhaust burst)
 *   AI Eng:    gradient_descent (incremental scaling) | hallucination (glass cannon) | prompt_engineering (copium/draw sustain)
 *
 * Each act simulates: normals → event → elite → rest → shop → boss
 * Relics scored by archetype affinity; acquired at elites (40%), boss rewards, and shops.
 */

import { characters } from './src/data/characters';
import { cards, getRewardCards } from './src/data/cards';
import { items, getRewardArtifact } from './src/data/items';
import { events } from './src/data/events';
import { enemies, getNormalEncounter, getEliteEncounter, getBossEncounter } from './src/data/enemies';
import { createCardInstance } from './src/utils/deckUtils';
import { initBattle, executePlayCard, executeEnemyTurn, startNewTurn } from './src/store/battleActions';
import type { RunState, CardInstance, ItemDef, BattleState, EnemyDef, CharacterDef, CardDef } from './src/types';

// ─── Config ──────────────────────────────────────────────────────────────────
const RUNS_PER_CHAR  = parseInt(process.argv[2] || '200');
const MAX_TURNS      = 60;
const TOTAL_MAP_ROWS = 12;

const ACT_STRUCTURE = [
  { normals: 3, act: 1 },
  { normals: 3, act: 2 },
  { normals: 3, act: 3 },
];

// ─── Archetype detection ──────────────────────────────────────────────────────
type Archetype =
  | 'fortress' | 'dom' | 'reactive' | 'combo'
  | 'rate_limiter' | 'brute_force' | 'query_optimizer'
  | 'design_patterns' | 'scope_creep' | 'tech_spec'
  | 'temperature' | 'token_economy' | 'training_loop'
  | 'neutral';

function detectArchetype(deck: CardInstance[]): Archetype {
  const counts: Record<string, number> = {};
  for (const c of deck) {
    if (c.archetype) {
      const weight = c.rarity === 'legendary' ? 4 : c.rarity === 'epic' ? 3 : c.rarity === 'rare' ? 2 : 1;
      counts[c.archetype] = (counts[c.archetype] || 0) + weight;
    }
  }
  if (Object.keys(counts).length === 0) return 'neutral';
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Archetype;
}

// ─── Aggression curve ─────────────────────────────────────────────────────────
// Returns 0.0 (full defense) → 1.0 (full offense) based on HP%
function aggressionLevel(hpPct: number): number {
  if (hpPct > 0.85) return 0.85;  // never full offense — always value block
  if (hpPct > 0.70) return 0.70;
  if (hpPct > 0.50) return 0.55;
  if (hpPct > 0.35) return 0.35;
  if (hpPct > 0.20) return 0.20;
  return 0.15; // still need some offense to actually kill enemies
}

// ─── Card scoring ─────────────────────────────────────────────────────────────
interface ScoreContext {
  hp: number;           // actual current HP
  hpPct: number;
  stressPct: number;
  aggression: number;    // 0-1
  archetype: Archetype;
  battle: BattleState;
  run: RunState;
  hasCounterOffer: boolean;
  playerConfidence: number;
  playerResilience: number;
  incomingDamage: number;
  incomingStress: number;
  canSurviveWithoutBlock: boolean;
  targetId?: string;
  // AI Engineer mechanic state
  temperature: number;
  tokens: number;
  cardPlayCounts: Record<string, number>;
}

// Estimate total incoming damage from enemy intents (HP damage only)
function estimateIncoming(battle: BattleState): { damage: number; stress: number } {
  let damage = 0;
  let stress = 0;
  for (const e of battle.enemies) {
    const m = e.currentMove;
    const weak = (e.statusEffects.weak || 0) > 0;
    const mult = weak ? 0.75 : 1;
    if (m.type === 'attack' || m.type === 'attack_defend' || m.type === 'dual_attack') {
      const times = m.times || 1;
      const confidence = e.statusEffects.confidence || 0;
      damage += (Math.floor((m.damage || 0) * mult) + confidence) * times;
    }
    if (m.type === 'stress_attack' || m.type === 'dual_attack' || m.stressDamage) {
      stress += Math.floor((m.stressDamage || 0) * mult);
    }
  }
  return { damage, stress };
}

function scoreCard(card: CardInstance, ctx: ScoreContext): { score: number; targetId?: string } {
  if (card.type === 'curse') return { score: -999 };

  const { hpPct, stressPct, aggression, archetype, battle, run } = ctx;
  const fx = card.effects;
  let score = 0;
  let targetId = ctx.targetId;

  // ── Cost check ──────────────────────────────────────────────────────────────
  let cost = card.cost;
  if (card.type === 'power' && !battle.firstPowerPlayedThisCombat) {
    if (run.items.some(i => i.effect.firstPowerFree)) cost = 0;
  }
  if (cost > battle.energy) return { score: -999 };

  // ── Base scores by card type ─────────────────────────────────────────────────
  const attackBase = 50 + aggression * 30;    // 50→80 as hp rises
  const blockBase  = 50 + (1 - aggression) * 30; // 50→80 as hp falls
  const powerBase  = 75;                       // powers almost always worth playing early

  if (card.type === 'power') {
    const totalEnemyHp = ctx.battle.enemies.reduce((s, e) => s + e.currentHp, 0);
    score = totalEnemyHp < 30 ? 10 : powerBase; // don't waste powers when fight is nearly won
  } else if (card.type === 'attack') {
    score = attackBase;
    // Pick target: kill one-shottable enemy first; else hit the most dangerous attacker
    if (card.target === 'enemy' && battle.enemies.length > 0) {
      const playerDmg = (fx.damage || 0) + ctx.playerConfidence;
      const killable = battle.enemies.find(e => e.currentHp <= playerDmg);
      if (killable) {
        targetId = killable.instanceId;
      } else {
        const mostDangerous = battle.enemies.reduce((a, b) => {
          const dmgA = ((a.currentMove?.damage || 0) + (a.statusEffects.confidence || 0)) * (a.currentMove?.times || 1);
          const dmgB = ((b.currentMove?.damage || 0) + (b.statusEffects.confidence || 0)) * (b.currentMove?.times || 1);
          return dmgA > dmgB ? a : b;
        });
        targetId = mostDangerous.instanceId;
      }
    }
    // Raw damage contribution
    const rawDmg = (fx.damage || 0) * (fx.times || 1)
      + (fx.damageAll || 0) * 0.8
      + (fx.damagePerCardExhausted || 0) * 2;
    score += rawDmg * 0.4;
  } else if (card.type === 'skill') {
    const blockVal  = fx.block || 0;
    const copiumVal = fx.copium || 0;
    const drawVal   = fx.draw || 0;

    if (blockVal > 0) {
      score = blockBase + blockVal * 0.6;
    } else if (copiumVal > 0) {
      // Copium priority rises with stress
      score = 30 + stressPct * 60 + copiumVal * 0.5;
    } else if (drawVal > 0) {
      score = 40 + drawVal * 5;
    } else {
      score = 30; // utility skills
    }
  }

  // 0-cost bonus (play these freely)
  if (card.cost === 0) score += 12;

  // ── Archetype-specific bonuses ────────────────────────────────────────────────
  switch (archetype) {

    // ── fortress: block first, copium when stressed, attacks secondary ──────────
    case 'fortress': {
      if (fx.block && fx.block > 0) {
        score += 25 + fx.block * 0.8;             // block is king
        if (fx.copium) score += 10;               // block+copium combo extra bonus
      }
      if (fx.copium && stressPct > 0.30) score += 15;
      // Don't penalize attacks — fortress still needs damage, just prefers block
      break;
    }

    // ── dom: vulnerable → then attack into it; AoE is premium ─────────────────
    case 'dom': {
      const appliesVuln = (fx.applyToTarget?.vulnerable || fx.applyToAll?.vulnerable || 0) > 0;
      if (appliesVuln) {
        score += 30;
        // Prefer applying to highest-HP enemy to maximize payoff
        if (card.target === 'enemy' && battle.enemies.length > 0) {
          const strongest = battle.enemies.reduce((a, b) => a.currentHp > b.currentHp ? a : b);
          targetId = strongest.instanceId;
        }
      }
      if (fx.damageAll) score += 20;
      // Big bonus for attacking a vulnerable target
      if (card.type === 'attack' && targetId) {
        const tgt = battle.enemies.find(e => e.instanceId === targetId);
        if (tgt && (tgt.statusEffects.vulnerable || 0) > 0) score += 25;
      }
      break;
    }

    // ── reactive: draw first, then chain attacks; low-cost premium ──────────────
    case 'reactive': {
      if (fx.draw) score += fx.draw * 10;
      if (card.cost === 0) score += 15;
      if (card.cost === 1 && fx.draw) score += 5;
      // After drawing, attacks become more valuable (more hand options)
      if (card.type === 'attack' && battle.hand.length >= 4) score += 10;
      break;
    }

    // ── combo: chain 0-cost cards → explode with cardsPlayedThisTurn scalers ──
    case 'combo': {
      const played = battle.cardsPlayedThisTurn || 0;
      // Cheap setup cards early in turn; scalers late when count is high
      if (fx.nextCardCostZero) score += 30 + (played < 3 ? 15 : 0);  // great early
      if (fx.draw) score += fx.draw * 8;
      if (fx.energy) score += fx.energy * 12;
      if (fx.damagePerCardPlayed) score += fx.damagePerCardPlayed * played * 1.5 + (played >= 3 ? 20 : 0);
      if (fx.damageAllPerCardPlayed) score += fx.damageAllPerCardPlayed * played * 2 + (played >= 4 ? 30 : 0);
      if (card.cost === 0) score += 20;  // 0-cost cards are chain links
      break;
    }

    // ── rate_limiter: stack counterOffer first, then conditional block ──────────
    case 'rate_limiter': {
      if (fx.applyToSelf?.counterOffer) score += 35;
      if (fx.bonusBlockIfCounterOffer && ctx.hasCounterOffer) score += 20;
      if (fx.bonusBlockIfCounterOffer && !ctx.hasCounterOffer) score -= 5; // wait for the buff
      if (fx.block) score += 10;
      break;
    }

    // ── brute_force: confidence-building attacks early, then raw damage ─────────
    case 'brute_force': {
      if (card.type === 'attack' && fx.applyToSelf?.confidence) {
        score += 30; // confidence attacks get priority
      }
      if (card.type === 'attack') {
        score += ctx.playerConfidence * 2; // attacks better once confidence is built
      }
      if (fx.damage && fx.damage >= 10) score += 10; // reward hard hitters
      break;
    }

    // ── query_optimizer: exhaust-draw synergy; thin the deck ───────────────────
    case 'query_optimizer': {
      if (fx.exhaustRandom || fx.exhaustFromDraw) {
        score += 20;
        if (run.deck.length > 12) score += 10; // more valuable with fat decks
      }
      if (fx.draw) score += fx.draw * 8;
      if (card.cost === 0 && fx.block) score += 10; // free block is always good
      break;
    }

    // ── design_patterns: powers first (permanent buffs), then attacks ───────────
    case 'design_patterns': {
      if (card.type === 'power') {
        score += 40; // play powers ASAP — they scale the rest of the fight
        if (fx.applyToSelf?.confidence && fx.applyToSelf?.resilience) score += 15; // dual-stat premium
      }
      // Attacks scale better once buffs are placed
      if (card.type === 'attack' && ctx.playerConfidence >= 2) score += 15;
      break;
    }

    // ── scope_creep: energy ramp → then bombs; penalize bombs when broke ────────
    case 'scope_creep': {
      if (fx.energy && fx.energy > 0) {
        score += 50; // play energy generators first, always
        if (card.cost === 0) score += 20; // free energy = free real estate
      }
      // High-cost attacks are great once ramped
      if (card.type === 'attack' && card.cost >= 2) {
        if (battle.energy >= card.cost) score += 20;
        else score -= 20; // don't get tempted prematurely
      }
      if (fx.damage && fx.damage >= 15) score += 15; // bomb cards
      break;
    }

    // ── tech_spec: 0-cost exhaust burst first, then regular plays ───────────────
    case 'tech_spec': {
      if (card.cost === 0 && card.exhaust) score += 35; // free exhausts = burst setup
      if (card.cost === 0) score += 20;
      if (card.exhaust && (fx.damage || 0) >= 8) score += 10; // high-damage exhausts
      if (fx.energy) score += 25; // energy generators enable the burst
      break;
    }

    // ── temperature: push toward extremes; cash hot/cold bonuses; overflow/freeze ─
    case 'temperature': {
      const temp = ctx.temperature ?? 5;
      const isHot = temp >= 7;
      const isCold = temp <= 3;
      // Push toward extremes — reward heatUp/coolDown
      if (fx.heatUp) {
        const nextTemp = temp + fx.heatUp;
        if (nextTemp >= 10) score += 25; // overflow imminent = bonus!
        else score += fx.heatUp * 5;
        if (isHot) score += 10; // already hot, heatUp cards are premium
      }
      if (fx.coolDown) {
        const nextTemp = temp - fx.coolDown;
        if (nextTemp <= 0) score += 25; // freeze imminent = bonus!
        else score += fx.coolDown * 5;
        if (isCold) score += 10; // already cold, coolDown cards are premium
      }
      // Reward conditional bonuses when condition is met
      if (fx.damageIfHot && isHot) score += fx.damageIfHot * 1.5;
      if (fx.damageAllIfHot && isHot) score += fx.damageAllIfHot * 2;
      if (fx.blockIfCold && isCold) score += fx.blockIfCold * 1.2;
      break;
    }

    // ── token_economy: generate when low; flush when primed or threatened ────────
    case 'token_economy': {
      const tokens = ctx.tokens ?? 0;
      if (fx.generateTokens) {
        score += tokens < 12 ? fx.generateTokens * 5 : fx.generateTokens * 2;
      }
      if (fx.doubleTokens) {
        score += tokens > 0 ? tokens * 3 : 5; // doubling 0 is useless
      }
      if (fx.damagePerToken) {
        if (tokens >= 10) score += tokens * 2;
        else if (tokens >= 5) score += tokens * 1.5;
        else score -= 10; // don't flush low token counts
      }
      if (fx.blockPerToken) {
        if (tokens >= 8 && !ctx.canSurviveWithoutBlock) score += tokens * 2;
        else if (tokens >= 6) score += tokens;
        else score -= 5;
      }
      if (fx.damageAllPerToken) {
        if (tokens >= 10) score += tokens * 1.5;
        else if (tokens >= 6) score += tokens;
        else score -= 5;
      }
      break;
    }

    // ── training_loop: reward plays that scale with repetition ──────────────────
    case 'training_loop': {
      const playCount = (ctx.cardPlayCounts ?? {})[card.id] || 0;
      // Cards that scale with play count — prioritize replaying them
      if (fx.damagePerTimesPlayed) {
        score += fx.damagePerTimesPlayed * (playCount + 1) * 2;
      }
      if (fx.blockPerTimesPlayed) {
        score += fx.blockPerTimesPlayed * (playCount + 1) * 1.5;
      }
      // Bonus-at-second-play cards get big reward on 2nd+ play
      if (fx.bonusAtSecondPlay) {
        if (playCount >= 1) score += 30; // 2nd play bonus active!
        else score += 10; // first play still sets up the bonus
      }
      break;
    }

    case 'neutral':
    default:
      break;
  }

  // ── Universal: scale attack scoring by aggression ────────────────────────────
  if (card.type === 'attack') {
    score = score * (0.7 + aggression * 0.3);
  }
  if (card.type === 'skill' && (fx.block || 0) > 0) {
    score = score * (0.7 + (1 - aggression) * 0.3);
  }

  // ── Threat override: if incoming damage will kill you, block is survival ─────
  if (!ctx.canSurviveWithoutBlock && ctx.incomingDamage > 0) {
    if (fx.block && fx.block > 0) {
      // How much block do we need?
      const deficit = ctx.incomingDamage - (ctx.battle.playerBlock || 0);
      const blockUrgency = Math.min(deficit / Math.max(ctx.hp, 1), 3); // 0→3 scale
      score += 40 + blockUrgency * 30; // +40 to +130 emergency bonus
    }
    if (card.type === 'attack') {
      // Check if we can one-shot any enemy — killing them removes their damage
      const canKill = card.target === 'enemy' && battle.enemies.some(e => {
        const dmg = (fx.damage || 0) + ctx.playerConfidence;
        return dmg >= e.currentHp;
      });
      if (!canKill) score -= 20; // attacks that don't kill are risky right now
    }
  }

  // ── Stress threat override ────────────────────────────────────────────────────
  if (ctx.incomingStress > 0 && (stressPct * run.maxStress + ctx.incomingStress) >= run.maxStress * 0.85) {
    if (fx.copium && fx.copium > 0) score += 50; // copium becomes critical
  }

  return { score, targetId };
}

// ─── Battle simulation ────────────────────────────────────────────────────────
interface BattleResult {
  survived: boolean;
  hpAfter: number;
  stressAfter: number;
  turnsUsed: number;
  deathCause?: 'hp' | 'stress';
  goldGained: number;
}

function simulateBattle(run: RunState, enemyDefs: EnemyDef[]): BattleResult {
  const { battle: initB, hpAdjust, stressAdjust } = initBattle(run, enemyDefs);
  let battle = initB;
  let hp     = Math.min(run.maxHp, Math.max(0, run.hp + hpAdjust));
  let stress = Math.max(0, run.stress + stressAdjust);
  let gold   = 0;
  let liveRun: RunState = { ...run, hp, stress };

  // Detect archetype once per battle (deck is stable during a fight)
  const archetype = detectArchetype(liveRun.deck);
  let turnsUsed = 0;

  while (battle.enemies.length > 0 && turnsUsed < MAX_TURNS) {

    // ── Player turn ────────────────────────────────────────────────────────────
    let played = true;
    let playsThisTurn = 0;
    const MAX_PLAYS_PER_TURN = 60; // guard against infinite energy-draw loops (e.g. promise_all)
    while (played && battle.energy > 0 && battle.enemies.length > 0 && playsThisTurn < MAX_PLAYS_PER_TURN) {
      played = false;

      const hpPct     = hp / run.maxHp;
      const stressPct = stress / run.maxStress;
      const aggression = aggressionLevel(hpPct);
      const hasCounterOffer  = (battle.playerStatusEffects.counterOffer || 0) > 0;
      const playerConfidence = battle.playerStatusEffects.confidence || 0;
      const playerResilience = battle.playerStatusEffects.resilience || 0;
      const { damage: incoming, stress: incomingStress } = estimateIncoming(battle);
      const canSurvive = (hp + (battle.playerBlock || 0)) > incoming;

      const ctx: ScoreContext = {
        hp, hpPct, stressPct, aggression, archetype, battle, run: liveRun,
        hasCounterOffer, playerConfidence, playerResilience,
        incomingDamage: incoming, incomingStress,
        canSurviveWithoutBlock: canSurvive,
        temperature: battle.temperature ?? 5,
        tokens: battle.tokens ?? 0,
        cardPlayCounts: battle.cardPlayCounts ?? {},
      };

      type Scored = { card: CardInstance; score: number; targetId?: string };
      const candidates: Scored[] = [];

      for (const card of battle.hand) {
        const { score, targetId } = scoreCard(card, ctx);
        if (score < -100) continue; // unplayable or skipped
        candidates.push({ card, score, targetId });
      }

      if (candidates.length === 0) break;
      candidates.sort((a, b) => b.score - a.score);

      const best = candidates[0];
      const result = executePlayCard(battle, liveRun, best.card.instanceId, best.targetId);
      if (result.battle === battle) break;

      battle  = result.battle;
      hp      = Math.min(run.maxHp, Math.max(0, hp + result.hpChange));
      stress  = Math.max(0, stress + result.stressChange - result.stressReduction);
      gold   += result.goldChange;
      liveRun = { ...liveRun, hp, stress };
      played  = true;
      playsThisTurn++;
    }

    if (battle.enemies.length === 0) break;

    // ── Enemy turn ─────────────────────────────────────────────────────────────
    const er = executeEnemyTurn(battle, liveRun);
    battle  = er.battle;
    hp      = er.playerHp;
    stress  = er.playerStress;
    gold   += er.goldChange;
    liveRun = { ...liveRun, hp, stress };

    if (hp <= 0)                 return { survived: false, hpAfter: 0,  stressAfter: stress, turnsUsed, deathCause: 'hp',     goldGained: gold };
    if (stress >= run.maxStress) return { survived: false, hpAfter: hp, stressAfter: stress, turnsUsed, deathCause: 'stress', goldGained: gold };

    // ── Start new player turn ──────────────────────────────────────────────────
    const tr = startNewTurn(battle, liveRun);
    battle  = tr.battle;
    hp      = Math.min(run.maxHp, Math.max(0, hp + tr.hpChange));
    stress  = Math.max(0, stress + tr.stressChange);
    liveRun = { ...liveRun, hp, stress };

    if (hp <= 0)                 return { survived: false, hpAfter: 0,  stressAfter: stress, turnsUsed, deathCause: 'hp',     goldGained: gold };
    if (stress >= run.maxStress) return { survived: false, hpAfter: hp, stressAfter: stress, turnsUsed, deathCause: 'stress', goldGained: gold };

    turnsUsed++;
  }

  const won = battle.enemies.length === 0;
  return {
    survived:    won,
    hpAfter:     hp,
    stressAfter: stress,
    turnsUsed,
    deathCause:  won ? undefined : 'hp',
    goldGained:  gold + (battle.goldEarned || 0),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeRun(char: CharacterDef, deck: CardInstance[], relics: ItemDef[], act = 1): RunState {
  return {
    character: char, hp: char.hp, maxHp: char.hp, gold: 50, deck, items: relics,
    consumables: [], maxConsumables: 3,
    map: { nodes: [], currentNodeId: null, currentRow: 0 },
    stress: 0, maxStress: char.maxStress, floor: 0, act,
  };
}

function getStarterRelic(char: CharacterDef): ItemDef | undefined {
  return char.starterRelicId ? items.find(i => i.id === char.starterRelicId) : undefined;
}
function getEnemyDefs(ids: string[]): EnemyDef[] {
  return ids.map(id => enemies[id]).filter(Boolean);
}

function getClassCardPool(char: CharacterDef): CardDef[] {
  const cls = char.id === 'frontend_dev' ? 'frontend'
    : char.id === 'backend_dev' ? 'backend'
    : char.id === 'architect'   ? 'architect'
    : 'ai_engineer';
  return Object.values(cards).filter(
    (c: any) => c.class === cls && c.rarity !== 'curse' && c.rarity !== 'starter'
  ) as CardDef[];
}

// Score a card for archetype fit — higher = better pick
function scoreCardReward(card: CardDef, archetype: Archetype): number {
  const inArch = card.archetype === archetype;
  let score = inArch ? 35 : 0;
  // Rarity bonus: legendaries are near-always-take; epics beat archetype commons
  score += card.rarity === 'legendary' ? 75
    : card.rarity === 'epic'   ? 50
    : card.rarity === 'rare'   ? 22
    : 0;
  // Cards with no archetype tag (neutrals, utility) are useful in any build
  if (!card.archetype) score += 8;
  // Never pick curses
  if (card.rarity === 'curse') score = -999;
  return score;
}

// Generate 3 real offers (act-aware rarity, elite/boss guarantees) and pick best
function pickRewardCard(
  deck: CardInstance[],
  act: number,
  encounterType: 'normal' | 'elite' | 'boss',
  charClass: string,
  targetArchetype: Archetype | null = null,
): CardDef {
  // Use targetArchetype if set (build intent), otherwise detect from deck
  const archetype = targetArchetype ?? detectArchetype(deck);
  const offers = getRewardCards(3, undefined, charClass, act, encounterType);
  if (!offers.length) {
    // Fallback: pull random from full class pool
    const pool = Object.values(cards).filter((c: any) => c.class === charClass && c.rarity !== 'curse' && c.rarity !== 'starter') as CardDef[];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return offers.sort((a, b) => scoreCardReward(b, archetype) - scoreCardReward(a, archetype))[0];
}

// Apply post-combat relic bonuses (heal-on-kill, extra gold)
function applyPostCombatRelics(run: RunState, battleGold: number): RunState {
  const heal     = run.items.reduce((sum, i) => sum + (i.effect.healOnKill || 0), 0);
  const flatGold = run.items.reduce((sum, i) => sum + (i.effect.extraGold || 0), 0);
  const pctGold  = run.items.reduce((sum, i) => sum + (i.effect.extraGoldPercent || 0), 0);
  const bonusGold = flatGold + Math.floor(battleGold * (pctGold / 100));
  return {
    ...run,
    hp:   heal     > 0 ? Math.min(run.maxHp, run.hp + heal) : run.hp,
    gold: bonusGold > 0 ? run.gold + bonusGold               : run.gold,
  };
}

// ─── Relic scoring ────────────────────────────────────────────────────────────
function scoreRelic(relic: ItemDef, run: RunState, archetype: Archetype): number {
  const fx = relic.effect;
  const hpPct    = run.hp / run.maxHp;
  const stressPct = run.stress / run.maxStress;
  let score = 0;

  // ── Universal utility ────────────────────────────────────────────────────────
  if (fx.extraDraw)              score += (fx.extraDraw || 0) * 25;
  if (fx.extraEnergy)            score += (fx.extraEnergy || 0) * 30;
  if (fx.extraEnergyFirstTurn)   score += (fx.extraEnergyFirstTurn || 0) * 15;
  if (fx.extraHp)                score += (fx.extraHp || 0) * 1.2 + (1 - hpPct) * 10;
  if (fx.healOnKill)             score += (fx.healOnKill || 0) * 4 * (1.5 - hpPct);
  if (fx.healPerCombat)          score += (fx.healPerCombat || 0) * 3 * (1.5 - hpPct);
  if (fx.bonusDamage)            score += (fx.bonusDamage || 0) * 12;
  if (fx.bonusBlock)             score += (fx.bonusBlock || 0) * 10;
  if (fx.extraGold)              score += (fx.extraGold || 0) * 2;
  if (fx.extraGoldPercent)       score += (fx.extraGoldPercent || 0) * 1.2;
  if (fx.startBattleBlock)       score += (fx.startBattleBlock || 0) * 7;
  if (fx.startBattleConfidence)  score += (fx.startBattleConfidence || 0) * 14;
  if (fx.startBattleResilience)  score += (fx.startBattleResilience || 0) * 12;
  if (fx.multiHitBonus)          score += (fx.multiHitBonus || 0) * 10;

  // ── Penalties: cursed / double-edged relics ───────────────────────────────────
  if (fx.stressPerCombat)       score -= (fx.stressPerCombat || 0) * 4 * (1 + stressPct * 2);
  if (fx.startBattleVulnerable) score -= (fx.startBattleVulnerable || 0) * 20;
  if (fx.startBattleWeak)       score -= (fx.startBattleWeak || 0) * 15;
  if (fx.startBattleDamage)     score -= (fx.startBattleDamage || 0) * 6 * (2 - hpPct);

  // ── Archetype-specific bonuses ────────────────────────────────────────────────
  switch (archetype) {
    case 'fortress':
      if (fx.bonusBlock)            score += 22;
      if (fx.skillBlockMultiplier)  score += 45;
      if (fx.firstSkillBlock)       score += 28;
      if (fx.startBattleResilience) score += 22;
      break;
    case 'dom':
      if (fx.vulnerableAlsoWeak)    score += 42;
      if (fx.bonusDamage)           score += 15;
      break;
    case 'reactive':
      if (fx.extraDraw)             score += 22;
      if (fx.cardsPlayedEnergy)     score += 18;
      break;
    case 'combo':
      if (fx.extraDraw)             score += 25;
      if (fx.extraEnergy)           score += 20;
      if (fx.cardsPlayedEnergy)     score += 30;
      if (fx.bonusDamage)           score += 15;
      break;
    case 'rate_limiter':
      if (fx.counterOfferStart)     score += 38;
      if (fx.bonusBlock)            score += 15;
      break;
    case 'brute_force':
      if (fx.startBattleConfidence) score += 28;
      if (fx.multiHitBonus)         score += 25;
      break;
    case 'query_optimizer':
      if (fx.exhaustSynergyBlock)   score += 28;
      if (fx.exhaustGainEnergy)     score += 32;
      if (fx.exhaustDrawCard)       score += 28;
      if (fx.exhaustDoubleTrigger)  score += 35;
      break;
    case 'design_patterns':
      if (fx.firstPowerFree)        score += 38;
      if (fx.onPlayPower)           score += 22;
      if (fx.perPowerPlayed)        score += 28;
      break;
    case 'scope_creep':
      if (fx.extraEnergy)           score += 28;
      if (fx.extraEnergyFirstTurn)  score += 22;
      break;
    case 'tech_spec':
      if (fx.firstNCardsFree)       score += 35;
      if (fx.exhaustGainEnergy)     score += 28;
      if (fx.exhaustDrawCard)       score += 22;
      break;
    case 'temperature':
      // More energy = more heatUp/coolDown cards playable; bonus damage synergizes when hot
      if (fx.extraEnergy)           score += 20;
      if (fx.bonusDamage)           score += 15;
      if (fx.startBattleConfidence) score += 18;
      if (fx.startBattleResilience) score += 18;
      break;
    case 'token_economy':
      // Energy helps play more token generators; draw finds generators/flush cards faster
      if (fx.extraEnergy)           score += 18;
      if (fx.extraDraw)             score += 15;
      if (fx.extraGold)             score += 5;
      break;
    case 'training_loop':
      // Draw = play cards more = more loop iterations; energy enables more plays per turn
      if (fx.extraDraw)             score += 22;
      if (fx.extraEnergy)           score += 20;
      if (fx.startBattleConfidence) score += 18;
      if (fx.startBattleResilience) score += 15;
      break;
    default:
      break;
  }

  return score;
}

// Pick the best relic from a set of candidates
function pickBestRelic(candidates: ItemDef[], run: RunState, archetype: Archetype): ItemDef {
  return candidates
    .map(r => ({ relic: r, score: scoreRelic(r, run, archetype) }))
    .sort((a, b) => b.score - a.score)[0].relic;
}

// Add a relic and apply immediate stat effects (extraHp raises maxHp + heals that amount)
function addRelicToRun(run: RunState, relic: ItemDef): RunState {
  const extraHp = relic.effect.extraHp || 0;
  return {
    ...run,
    items: [...run.items, relic],
    maxHp: run.maxHp + extraHp,
    hp:    run.hp    + extraHp,  // same as real game: gain the HP immediately
  };
}

// ─── Rest simulation ──────────────────────────────────────────────────────────
// Stress always heals at rest (35% Act 1 / 25% Act 2 / 20% Act 3).
// HP healed if < 65%, otherwise upgrade the best non-upgraded card.
function simulateRest(run: RunState): RunState {
  const stressRate = run.act === 1 ? 0.35 : run.act === 2 ? 0.25 : 0.20;
  const stressHeal = Math.floor(run.maxStress * stressRate);

  const hpPct = run.hp / run.maxHp;
  if (hpPct < 0.65) {
    return {
      ...run,
      hp:     Math.min(run.maxHp, run.hp + Math.floor(run.maxHp * 0.30)),
      stress: Math.max(0, run.stress - stressHeal),
    };
  }
  // Act 3+: use Reflect to remove a curse or unupgraded starter (deck quality > 1 upgrade)
  if (run.act >= 3) {
    const junk = run.deck.find(c => c.type === 'curse')
      || run.deck.find(c => c.rarity === 'starter' && !c.upgraded);
    if (junk) {
      return {
        ...run,
        stress: Math.max(0, run.stress - stressHeal),
        deck: run.deck.filter(c => c.instanceId !== junk.instanceId),
      };
    }
  }
  // Upgrade priority: epic/legendary attack first, then rare, then power, then any attack
  const toUpgrade = run.deck.find(c => !c.upgraded && c.type === 'attack' && (c.rarity === 'legendary' || c.rarity === 'epic'))
    || run.deck.find(c => !c.upgraded && c.type === 'attack' && c.rarity === 'rare')
    || run.deck.find(c => !c.upgraded && c.type === 'power')
    || run.deck.find(c => !c.upgraded && c.type === 'attack')
    || run.deck.find(c => !c.upgraded && c.type !== 'curse');
  if (toUpgrade) {
    return {
      ...run,
      stress: Math.max(0, run.stress - stressHeal),
      deck: run.deck.map(c => c.instanceId === toUpgrade.instanceId ? { ...c, upgraded: true } : c),
    };
  }
  return { ...run, stress: Math.max(0, run.stress - stressHeal) };
}

// ─── Shop simulation ──────────────────────────────────────────────────────────
const RELIC_PRICES: Record<string, number> = {
  common: 50, rare: 120, epic: 200, legendary: 300,
};

function simulateShop(run: RunState): RunState {
  const archetype = detectArchetype(run.deck);
  const ownedIds  = run.items.map(i => i.id);

  // Get 3 random relics available to this character, excluding owned ones
  const candidates = getRewardArtifact(ownedIds, 3, run.character.id);
  if (!candidates.length) return run;

  let gold     = run.gold;
  let newItems = [...run.items];

  // Score all offered relics and buy the best one we can afford
  const scored = candidates
    .map(r => ({ relic: r, score: scoreRelic(r, run, archetype), price: RELIC_PRICES[r.rarity] ?? 120 }))
    .sort((a, b) => b.score - a.score);

  for (const { relic, score, price } of scored) {
    if (score < 25) break; // below threshold: not worth buying
    if (gold >= price) {
      gold -= price;
      // Apply via addRelicToRun so extraHp updates maxHp too
      const bought = addRelicToRun({ ...run, gold }, relic);
      return { ...bought, gold };
    }
  }

  return { ...run, gold, items: newItems };
}

// ─── Event simulation ─────────────────────────────────────────────────────────
function simulateEvent(run: RunState): RunState {
  const classId = run.character.id === 'frontend_dev' ? 'frontend'
    : run.character.id === 'backend_dev' ? 'backend'
    : run.character.id === 'architect'   ? 'architect'
    : 'ai_engineer';

  const relevant = events.filter(e => !e.class || e.class === classId);
  if (!relevant.length) return run;

  const event    = relevant[Math.floor(Math.random() * relevant.length)];
  const archetype = detectArchetype(run.deck);
  const hpPct    = run.hp / run.maxHp;
  const stressPct = run.stress / run.maxStress;
  const classPool = getClassCardPool(run.character);

  // Score each choice by its expected value to the run
  const scoreChoice = (choice: { outcome: {
    hp?: number; gold?: number; stress?: number;
    addCard?: string; removeRandomCard?: boolean; removeChosenCard?: number;
    upgradeRandomCard?: boolean; addItem?: string; addConsumable?: string;
  } }): number => {
    const o = choice.outcome;
    let s = 0;
    if (o.hp !== undefined) {
      // Healing more valuable when low HP; damage worse when low HP
      s += o.hp > 0 ? o.hp * (1 + (1 - hpPct) * 2) : o.hp * (1 + hpPct * 1.5);
    }
    if (o.gold !== undefined) s += o.gold * 0.7;
    if (o.stress !== undefined) {
      // Gaining stress: terrible when already stressed; reducing stress: good when stressed
      if (o.stress > 0) s -= o.stress * (3 + stressPct * 5);
      else s += (-o.stress) * (2 + stressPct * 3);
    }
    if (o.addCard) {
      s += o.addCard.includes('epic') ? 40 : o.addCard.includes('rare') ? 25 : 12;
    }
    if (o.addItem) {
      const item = items.find(i => i.id === o.addItem);
      s += item ? scoreRelic(item, run, archetype) * 0.6 + 20 : 25;
    }
    if (o.removeChosenCard || o.removeRandomCard) {
      s += run.deck.length > 10 ? 18 : 6;
    }
    if (o.upgradeRandomCard) s += 20;
    if (o.addConsumable)     s += 10;
    return s;
  };

  const best = event.choices
    .map(c => ({ choice: c, score: scoreChoice(c) }))
    .sort((a, b) => b.score - a.score)[0].choice;

  const o         = best.outcome;
  const evtScale  = run.act === 1 ? 1 : run.act === 2 ? 1.5 : 2; // real game scales positive outcomes by act
  let hp          = run.hp;
  let gold        = run.gold;
  let stress      = run.stress;
  let maxHp       = run.maxHp;
  let deck        = [...run.deck];
  let newItems    = [...run.items];

  if (o.hp !== undefined) {
    const scaled = o.hp > 0 ? Math.floor(o.hp * evtScale) : o.hp;
    hp = Math.min(maxHp, Math.max(0, hp + scaled));
  }
  if (o.gold !== undefined) {
    const scaled = o.gold > 0 ? Math.floor(o.gold * evtScale) : o.gold;
    gold = Math.max(0, gold + scaled);
  }
  if (o.stress !== undefined) stress = Math.max(0, Math.min(run.maxStress - 1, stress + o.stress));

  if (o.addCard) {
    const rarity = o.addCard.includes('epic') ? 'epic'
      : o.addCard.includes('rare') ? 'rare' : 'common';
    const pool = classPool.filter(c => c.rarity === rarity);
    if (pool.length) {
      const picked = pool[Math.floor(Math.random() * pool.length)];
      deck = [...deck, createCardInstance(picked)];
    }
  }

  if (o.addItem) {
    const item = items.find(i => i.id === o.addItem);
    if (item && !newItems.some(i => i.id === item.id)) {
      // Apply extraHp immediately, like the real game
      const extraHp = item.effect.extraHp || 0;
      newItems = [...newItems, item];
      maxHp += extraHp;
      hp    += extraHp;
    }
  }

  if ((o.removeChosenCard || o.removeRandomCard) && deck.length > 0) {
    // Remove worst card: curse > unupgraded starter > unupgraded 0-effect common > costliest
    const junkScore = (c: CardInstance): number => {
      if (c.type === 'curse') return 1000;
      if (!c.upgraded && c.rarity === 'starter') return 500;
      if (!c.upgraded && c.rarity === 'common' && !c.effects.damage && !c.effects.block) return 200;
      return c.cost;
    };
    const toRemove = [...deck].sort((a, b) => junkScore(b) - junkScore(a))[0];
    deck = deck.filter(c => c.instanceId !== toRemove.instanceId);
  }

  if (o.upgradeRandomCard && deck.length > 0) {
    const eligible = deck.filter(c => !c.upgraded && c.type !== 'curse');
    if (eligible.length) {
      const target = eligible[Math.floor(Math.random() * eligible.length)];
      deck = deck.map(c => c.instanceId === target.instanceId ? { ...c, upgraded: true } : c);
    }
  }

  return { ...run, hp, maxHp, gold, stress, deck, items: newItems };
}

// ─── Full run simulation ───────────────────────────────────────────────────────
type DeathLoc = string;

interface RunResult {
  won: boolean;
  floorsCleared: number;
  deathCause?: 'hp' | 'stress';
  deathAt?: DeathLoc;
  hpAtBoss:       [number, number, number];
  hpAfterBoss:    [number, number, number];
  totalTurns:     number;
  archetypePlayed: Archetype;
  relicsAcquired: number;
}

function simulateRun(char: CharacterDef): RunResult {
  const starterCards: CardInstance[] = char.starterDeckIds
    .map(id => cards[id] ? createCardInstance(cards[id]) : null)
    .filter(Boolean) as CardInstance[];

  const starterRelic      = getStarterRelic(char);
  const initialRelicCount = starterRelic ? 1 : 0;
  const charClass = char.id === 'frontend_dev' ? 'frontend'
    : char.id === 'backend_dev' ? 'backend'
    : char.id === 'architect'   ? 'architect'
    : 'ai_engineer';

  let run = makeRun(char, starterCards, starterRelic ? [starterRelic] : []);

  // For frontend, randomly assign a target archetype so 50% of runs pursue combo
  const targetArchetype: Archetype | null = charClass === 'frontend' && Math.random() < 0.5
    ? 'combo'
    : null;

  const archetypePlayed = detectArchetype(run.deck);

  let floors = 0, totalTurns = 0;
  const hpAtBoss:    [number, number, number] = [0, 0, 0];
  const hpAfterBoss: [number, number, number] = [0, 0, 0];

  const earlyExit = (deathCause: 'hp' | 'stress' | undefined, deathAt: string): RunResult => ({
    won: false, floorsCleared: floors, deathCause, deathAt,
    hpAtBoss, hpAfterBoss, totalTurns, archetypePlayed: detectArchetype(run.deck),
    relicsAcquired: run.items.length - initialRelicCount,
  });

  for (const { normals, act } of ACT_STRUCTURE) {
    run = { ...run, act };

    // ── Normal battles ──────────────────────────────────────────────────────────
    for (let n = 0; n < normals; n++) {
      const row  = Math.floor(((n + 1) / (normals + 2)) * TOTAL_MAP_ROWS);
      const defs = getEnemyDefs(getNormalEncounter(act, row, TOTAL_MAP_ROWS));
      if (!defs.length) continue;

      const r = simulateBattle(run, defs);
      floors++; totalTurns += r.turnsUsed;
      run = { ...run, hp: r.hpAfter, stress: r.stressAfter, gold: run.gold + r.goldGained };

      if (!r.survived) return earlyExit(r.deathCause, `a${act}_normal${n + 1}`);

      run = applyPostCombatRelics(run, r.goldGained);
      // Post-battle passive stress (3 / 5 / 8 by act) — applied after every non-boss fight
      const actStress = act === 1 ? 3 : act === 2 ? 5 : 8;
      run = { ...run, stress: Math.min(run.maxStress, run.stress + actStress) };
      if (run.stress >= run.maxStress) return earlyExit('stress', `a${act}_normal${n + 1}`);

      // Card reward: skip if deck is bloated — consistency drops sharply above 16 cards
      const deckSize = run.deck.length;
      const takeRate = deckSize >= 19 ? 0 : deckSize >= 16 ? 0.35 : 0.65;
      if (Math.random() < takeRate) {
        run = { ...run, deck: [...run.deck, createCardInstance(pickRewardCard(run.deck, act, 'normal', charClass, targetArchetype))] };
      }
    }

    // ── Event node ──────────────────────────────────────────────────────────────
    run = simulateEvent(run);

    // ── Elite ───────────────────────────────────────────────────────────────────
    const eliteDefs = getEnemyDefs(getEliteEncounter(act));
    if (eliteDefs.length) {
      const r = simulateBattle(run, eliteDefs);
      floors++; totalTurns += r.turnsUsed;
      run = { ...run, hp: r.hpAfter, stress: r.stressAfter, gold: run.gold + r.goldGained };

      if (!r.survived) return earlyExit(r.deathCause, `a${act}_elite`);

      run = applyPostCombatRelics(run, r.goldGained);
      // Post-elite passive stress (same as normals)
      const eliteStress = act === 1 ? 3 : act === 2 ? 5 : 8;
      run = { ...run, stress: Math.min(run.maxStress, run.stress + eliteStress) };
      if (run.stress >= run.maxStress) return earlyExit('stress', `a${act}_elite`);

      // Elite reward: 3 offers with guaranteed rare, pick best
      run = { ...run, deck: [...run.deck, createCardInstance(pickRewardCard(run.deck, act, 'elite', charClass, targetArchetype))] };

      // 40% chance of a relic reward (choose best of 3, apply extraHp immediately)
      if (Math.random() < 0.40) {
        const ownedIds     = run.items.map(i => i.id);
        const relicOptions = getRewardArtifact(ownedIds, 3, char.id);
        if (relicOptions.length) {
          const archetype = detectArchetype(run.deck);
          run = addRelicToRun(run, pickBestRelic(relicOptions, run, archetype));
        }
      }

      // Small post-elite heal (20% — enough to avoid entering rest too depleted)
      run = { ...run, hp: Math.min(run.maxHp, run.hp + Math.floor(run.maxHp * 0.20)) };
    }

    // ── Rest site ────────────────────────────────────────────────────────────────
    run = simulateRest(run);

    // ── Shop ─────────────────────────────────────────────────────────────────────
    run = simulateShop(run);

    // ── Boss ────────────────────────────────────────────────────────────────────
    const bossDefs = getEnemyDefs(getBossEncounter(act, run));
    if (bossDefs.length) {
      hpAtBoss[act - 1] = run.hp;
      const r = simulateBattle(run, bossDefs);
      floors++; totalTurns += r.turnsUsed;
      run = { ...run, hp: r.hpAfter, stress: r.stressAfter, gold: run.gold + r.goldGained };

      if (!r.survived) return earlyExit(r.deathCause, `a${act}_boss`);

      hpAfterBoss[act - 1] = r.hpAfter;
      run = applyPostCombatRelics(run, r.goldGained);

      // Boss: FULL HP restore (no stress penalty), card (guaranteed epic), relic pick (best of 3)
      run = { ...run, hp: run.maxHp };
      run = { ...run, deck: [...run.deck, createCardInstance(pickRewardCard(run.deck, act, 'boss', charClass, targetArchetype))] };

      const ownedIds     = run.items.map(i => i.id);
      const relicOptions = getRewardArtifact(ownedIds, 3, char.id);
      if (relicOptions.length) {
        const archetype = detectArchetype(run.deck);
        run = addRelicToRun(run, pickBestRelic(relicOptions, run, archetype));
      }
    }
  }

  return {
    won: true, floorsCleared: floors,
    hpAtBoss, hpAfterBoss, totalTurns, archetypePlayed: detectArchetype(run.deck),
    relicsAcquired: run.items.length - initialRelicCount,
  };
}

// ─── Reporting ─────────────────────────────────────────────────────────────────
function avg(arr: number[]): number { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function pct(n: number, total: number): string { return `${((n / (total || 1)) * 100).toFixed(1)}%`; }
function bar(rate: number, w = 28): string {
  const f = Math.round(rate * w);
  return '[' + '█'.repeat(f) + '░'.repeat(w - f) + ']';
}

const W = 64;
console.log('\n' + '═'.repeat(W));
console.log('  THE LAST SOFTWARE ENGINEER — Archetype-Aware Simulator');
console.log(`  ${RUNS_PER_CHAR} runs × ${characters.filter(c => c.available).length} characters`);
console.log('═'.repeat(W));

const summary: { name: string; icon: string; winRate: number }[] = [];

for (const char of characters.filter(c => c.available)) {
  process.stdout.write(`  Simulating ${char.icon} ${char.name}...`);
  const results: RunResult[] = [];
  for (let i = 0; i < RUNS_PER_CHAR; i++) results.push(simulateRun(char));
  process.stdout.write('\r' + ' '.repeat(W) + '\r');

  const wins         = results.filter(r => r.won).length;
  const losses       = results.filter(r => !r.won);
  const winRate      = wins / RUNS_PER_CHAR;
  const hpDeaths     = losses.filter(r => r.deathCause === 'hp').length;
  const stressDeaths = losses.filter(r => r.deathCause === 'stress').length;
  const avgFloors    = avg(results.map(r => r.floorsCleared));
  const avgTurns     = avg(results.map(r => r.totalTurns));
  const avgRelics    = avg(results.map(r => r.relicsAcquired));

  // Archetype breakdown
  const archCounts: Record<string, number> = {};
  for (const r of results) archCounts[r.archetypePlayed] = (archCounts[r.archetypePlayed] || 0) + 1;
  const topArch = Object.entries(archCounts).sort((a, b) => b[1] - a[1]).map(([a, n]) => `${a}(${n})`).join(', ');

  // Boss stats
  const a1In  = results.map(r => r.hpAtBoss[0]).filter(n => n > 0);
  const a2In  = results.map(r => r.hpAtBoss[1]).filter(n => n > 0);
  const a3In  = results.map(r => r.hpAtBoss[2]).filter(n => n > 0);
  const a1Out = results.map(r => r.hpAfterBoss[0]).filter(n => n > 0);
  const a2Out = results.map(r => r.hpAfterBoss[1]).filter(n => n > 0);

  // Death location breakdown
  const deathLocs: Record<string, number> = {};
  for (const r of losses) if (r.deathAt) deathLocs[r.deathAt] = (deathLocs[r.deathAt] || 0) + 1;
  const topDeaths = Object.entries(deathLocs).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([l, n]) => `${l}(${n})`).join(', ');

  console.log('\n' + '─'.repeat(W));
  console.log(`  ${char.icon}  ${char.name} — ${char.title}  [HP:${char.hp} Stress:${char.maxStress}]`);
  console.log('─'.repeat(W));
  console.log(`  Win rate       ${bar(winRate)}  ${pct(wins, RUNS_PER_CHAR)} (${wins}/${RUNS_PER_CHAR})`);
  console.log(`  Avg floors     ${avgFloors.toFixed(2)} / 15   |   Avg turns/run  ${avgTurns.toFixed(1)}`);
  console.log(`  Avg relics     ${avgRelics.toFixed(2)} acquired per run`);
  console.log(`  Deaths → HP: ${hpDeaths}  Stress: ${stressDeaths}   (${pct(hpDeaths, losses.length)} HP / ${pct(stressDeaths, losses.length)} stress)`);
  if (topDeaths) console.log(`  Death hotspots  ${topDeaths}`);
  console.log(`  Archetypes     ${topArch}`);

  const bossLine = (label: string, inArr: number[], outArr: number[], maxHp: number) => {
    if (!inArr.length) return;
    const reachPct = pct(inArr.length, RUNS_PER_CHAR);
    const inAvg    = avg(inArr).toFixed(1);
    const outStr   = outArr.length ? `  survived avg ${avg(outArr).toFixed(1)} HP out` : '';
    console.log(`  ${label}  reach ${reachPct} | avg HP in ${inAvg}/${maxHp}${outStr}`);
  };

  bossLine('Act 1 boss:', a1In, a1Out, char.hp);
  bossLine('Act 2 boss:', a2In, a2Out, char.hp);
  bossLine('Act 3 boss:', a3In, [],   char.hp);

  summary.push({ name: char.name, icon: char.icon, winRate });
}

console.log('\n' + '═'.repeat(W));
console.log('  SUMMARY  (sorted by win rate)');
console.log('─'.repeat(W));
for (const r of summary.sort((a, b) => b.winRate - a.winRate)) {
  const pctStr = pct(Math.round(r.winRate * RUNS_PER_CHAR), RUNS_PER_CHAR);
  console.log(`  ${r.icon}  ${r.name.padEnd(16)}  ${bar(r.winRate, 20)}  ${pctStr}`);
}
console.log('═'.repeat(W) + '\n');
