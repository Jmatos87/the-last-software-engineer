# Event System Redesign — DnD × Software Engineering

## Goals
1. **No-repeat within a run** — track seen events, never show the same event twice
2. **Act-themed pools** — events tied to specific acts (Act 1: job search, Act 2: interviews, Act 3: corporate endgame)
3. **Class-specific events per act** — 2 events per class per act (24 total)
4. **DnD narration** — every event reads like a D&D encounter narrated by a DM who only knows tech
5. **Cross-act chain** — "The Referral Scroll" spans all 3 acts with branching payoffs
6. **Shrine events** — 4 utility events available in any act, once per run

## Event Counts
| Pool | Count | Per-run pool |
|------|-------|-------------|
| Act 1 Neutral | 6 | 6 |
| Act 2 Neutral | 6 | 6 |
| Act 3 Neutral | 6 | 6 |
| Class per act | 2×4×3 = 24 | 2 per act |
| Shrines | 4 | 4 (any act) |
| Chain events | 3 parts | 1 per act (conditional) |
| **Total** | **~46** | **~9-11 per act** |

## Type Changes

### EventDef additions
```ts
act?: number;          // 1, 2, 3 — which act this event appears in (undefined = any act / shrine)
condition?: {
  requireFlag?: string;   // only show if this flag is set in run.eventFlags
  requireNoFlag?: string; // only show if this flag is NOT set
};
```

### EventChoice.outcome additions
```ts
setFlag?: string;    // set a flag in run.eventFlags when this choice is picked
maxHp?: number;      // change max HP
```

### RunState additions
```ts
seenEventIds: string[];                // event IDs already encountered this run
eventFlags: Record<string, boolean>;   // cross-event state (chain events)
```

## Selection Algorithm
```
1. Filter by act (event.act === currentAct OR event.act === undefined)
2. Filter by class (event.class === playerClass OR event.class === undefined)
3. Filter out seen events (event.id NOT IN run.seenEventIds)
4. Filter by conditions (check requireFlag/requireNoFlag against run.eventFlags)
5. Random pick from remaining pool
6. Add event.id to run.seenEventIds
```

## File Structure
- `act1Events.ts` — 6 neutral Act 1 + referral chain pt 1
- `act2Events.ts` — 6 neutral Act 2 + referral chain pt 2
- `act3Events.ts` — 6 neutral Act 3 + referral chain pt 3
- `frontendEvents.ts` — 6 Frontend events (2 per act)
- `backendEvents.ts` — 6 Backend events (2 per act)
- `architectEvents.ts` — 6 Architect events (2 per act)
- `aiEngineerEvents.ts` — 6 AI Engineer events (2 per act)
- `shrineEvents.ts` — 4 shrine events
- `index.ts` — barrel + getEligibleEvent() helper

## Writing Voice
DnD Dungeon Master who only knows software engineering:
- "You enter a torch-lit conference room..."
- "A hooded recruiter materializes from the shadows of your inbox..."
- "The ancient codebase reveals forbidden knowledge..."
- Mix genuine fantasy language with mundane tech reality for comedic contrast
