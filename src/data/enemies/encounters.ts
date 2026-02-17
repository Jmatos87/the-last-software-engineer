import { act1Solos, act1Duos, act1Trios, act1ElitePool, act1BossPool } from './act1Enemies';
import { act2Solos, act2Duos, act2Trios, act2ElitePool, act2BossPool } from './act2Enemies';
import { act3Solos, act3Duos, act3Trios, act3ElitePool, act3BossPool } from './act3Enemies';

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

/** Pick a boss encounter for a given act */
export function getBossEncounter(act: number): string[] {
  const pool = act === 3 ? act3BossPool : act === 2 ? act2BossPool : act1BossPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Legacy exports for backwards compatibility
export const normalEncounters = [...act1Solos, ...act1Duos, ...act1Trios];
export const eliteEncounters = act1ElitePool;
export const bossEncounters = act1BossPool;
