import { act1Events } from './act1Events';
import { act2Events } from './act2Events';
import { act3Events } from './act3Events';
import { frontendEvents } from './frontendEvents';
import { backendEvents } from './backendEvents';
import { architectEvents } from './architectEvents';
import { aiEngineerEvents } from './aiEngineerEvents';
import { shrineEvents } from './shrineEvents';
import type { EventDef, RunState } from '../../types';

export const events: EventDef[] = [
  ...act1Events,
  ...act2Events,
  ...act3Events,
  ...frontendEvents,
  ...backendEvents,
  ...architectEvents,
  ...aiEngineerEvents,
  ...shrineEvents,
];

/**
 * Select an eligible event for the current run state.
 * Filters by act, class, seen events, and conditions.
 * Returns null if no eligible events remain.
 */
export function getEligibleEvent(
  run: RunState,
  playerClass: string | undefined,
): EventDef | null {
  const eligible = events.filter(e => {
    // Act filter: event must match current act or be act-agnostic (shrines)
    if (e.act !== undefined && e.act !== run.act) return false;

    // Class filter: event must match player class or be classless (neutral)
    if (e.class && e.class !== playerClass) return false;

    // No-repeat: skip events already seen this run
    if (run.seenEventIds.includes(e.id)) return false;

    // Condition check: require/exclude flags
    if (e.condition) {
      if (e.condition.requireFlag && !run.eventFlags[e.condition.requireFlag]) return false;
      if (e.condition.requireNoFlag && run.eventFlags[e.condition.requireNoFlag]) return false;
    }

    return true;
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}
