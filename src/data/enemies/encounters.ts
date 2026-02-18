import { act1Solos, act1Duos, act1Trios, act1ElitePool, act1BossPool } from './act1Enemies';
import { act2Solos, act2Duos, act2Trios, act2ElitePool, act2BossPool } from './act2Enemies';
import { act3Solos, act3Duos, act3Trios, act3ElitePool, act3BossPool } from './act3Enemies';
import type { RunState } from '../../types';

// ════════════════════════════════════════════════
// Encounter selection helpers
// ════════════════════════════════════════════════

/** Get solo encounters for a given act (early zone battles) */
function getEarlyEncounters(act: number): string[][] {
  switch (act) {
    case 2: return act2Solos;
    case 3: return act3Solos;
    default: return act1Solos;
  }
}

/** Get harder encounters for a given act (mid/late zone battles) */
function getMidLateEncounters(act: number): string[][] {
  switch (act) {
    case 2: return [...act2Solos, ...act2Duos, ...act2Trios];
    case 3: return [...act3Solos, ...act3Duos, ...act3Trios];
    default: return [...act1Solos, ...act1Duos, ...act1Trios];
  }
}

/** Pick a normal encounter based on act and map row (zone) */
export function getNormalEncounter(act: number, row: number, totalRows: number): string[] {
  const earlyThreshold = Math.floor(totalRows * 0.25);

  if (row < earlyThreshold) {
    // Early zone: solos only
    const pool = getEarlyEncounters(act);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Mid/late zone: full pool
  const pool = getMidLateEncounters(act);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Pick an elite encounter for a given act */
export function getEliteEncounter(act: number): string[] {
  const pool = act === 3 ? act3ElitePool : act === 2 ? act2ElitePool : act1ElitePool;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Pick a boss encounter for a given act, with deck-analysis counter-pick if run is provided */
export function getBossEncounter(act: number, run?: RunState): string[] {
  const pool = act === 3 ? act3BossPool : act === 2 ? act2BossPool : act1BossPool;
  if (!run) return pool[Math.floor(Math.random() * pool.length)];

  const deck = run.deck;
  const total = Math.max(deck.length, 1);
  const attacks = deck.filter(c => c.type === 'attack').length;
  const skills  = deck.filter(c => c.type === 'skill').length;
  const powers  = deck.filter(c => c.type === 'power').length;

  const isBlockHeavy    = (skills / total) > 0.45 && deck.some(c => (c.effects.block || 0) >= 8);
  const isAttackHeavy   = (attacks / total) > 0.5;
  const isDrawEngine    = deck.filter(c => (c.effects.draw || 0) >= 3).length >= 2;
  const hasPowerSynergy = (powers / total) > 0.25;
  const isHighStress    = run.stress / run.maxStress > 0.5;
  const isLowHP         = run.hp / run.maxHp < 0.5;

  if (act === 1) {
    if (isBlockHeavy)  return ['hr_phone_screen'];   // vuln+weak negates block investment
    if (isDrawEngine)  return ['ats_final_form'];    // discard wrecks draw engines
    if (isAttackHeavy) return ['ghosting_phantom'];  // hidden intent defeats attack planners
  }
  if (act === 2) {
    if (isHighStress)    return ['panel_interview_hydra']; // stress attacks compound existing damage
    if (hasPowerSynergy) return ['vp_of_engineering'];     // debuffs punish power setup windows
    return ['live_coding_challenge'];                       // burst punishes depleted runs
  }
  if (act === 3) {
    if (hasPowerSynergy)         return ['imposter_syndrome_final']; // conf drain crushes stacking
    if (isHighStress || isLowHP) return ['offer_committee'];         // stress finisher
    return ['the_ceo'];                                               // general final exam
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Legacy exports for backwards compatibility
export const normalEncounters = [...act1Solos, ...act1Duos, ...act1Trios];
export const eliteEncounters = act1ElitePool;
export const bossEncounters = act1BossPool;
