Go with # Architect Overhaul — Three Design Options

**Date:** 2026-02-22
**Version Target:** v1.15.0

---

## The Vision (Confirmed by User)

The Architect is redesigned as an **Obelisk-class**. Three engineer slots hover over the character's head — like the Defect's orb slots in Slay the Spire. Each turn, all slotted engineers fire a passive effect automatically. When a 4th engineer card is played with full slots, the **oldest engineer is evoked** (fires a big one-time burst and leaves the slot), then the new engineer is slotted in.

**Engineer types**: Mix of the other 3 player classes (Frontend Dev, Backend Dev, AI Engineer) + specialty archetypes (QA Engineer, DevOps Engineer, Security Engineer, Data Engineer). Core class-engineers are common/rare. Specialty engineers are rare/epic/legendary finds.

**Energy**: Starting energy reduced from 4 to 3. Cards can add or remove slots (more slots = more passive power but slower to fill; fewer slots = cheaper evoke cycling).

**Slot manipulation**: Advanced cards can add a 4th slot (harder to evoke), remove a slot (lower the threshold for cheaper evokes), or swap which slot gets evoked.

---

## Core Mechanic: Engineer Slots (shared across all 3 options)

### BattleState additions

```ts
engineerSlots: EngineerSlot[];      // current slotted engineers, max = maxEngineerSlots
maxEngineerSlots: number;           // starts at 3; cards can raise/lower
```

### EngineerSlot type

```ts
export interface EngineerSlot {
  id: string;                       // engineer type ID (e.g. 'frontend_jr', 'devops', 'qa')
  name: string;
  icon: string;
  passiveEffect: EngineerPassive;   // fires every turn start
  evokeEffect: EngineerEvoke;       // fires once when evoked (slot overflows)
}
```

### How slots work (all options)

1. Play an engineer card → push to `engineerSlots`
2. If `engineerSlots.length > maxEngineerSlots` → oldest slot fires `evokeEffect` (big burst), removed
3. Every turn start → each slot fires its `passiveEffect`
4. Engineer cards are played like normal cards — no target needed, type: `'skill'`

### Turn start passive (handled in `startNewTurn`)

```ts
for (const slot of battle.engineerSlots) {
  // Apply passive: block, damage, draw, status, etc.
}
```

### Evoke trigger (handled in `executePlayCard` after a new engineer is slotted)

```ts
if (newBattle.engineerSlots.length > newBattle.maxEngineerSlots) {
  const evoked = newBattle.engineerSlots.shift(); // oldest leaves
  // Apply evoke effect: big damage burst, mass status, draw storm, etc.
}
```

---

## Engineer Roster (shared across all 3 options)

These engineer types can appear as slottable cards. Each has a **passive** (fires every turn) and an **evoke** (fires once on overflow).

### From Player Classes

| Engineer | Passive (per turn) | Evoke (once) |
|---|---|---|
| `frontend_jr` | +2 dodge | Deal 12 damage to all, apply 2 bleed to all |
| `frontend_sr` | +3 dodge, apply 1 bleed to random enemy | Deal 20 damage to all, apply 3 bleed to all |
| `backend_jr` | Schedule 6 block for next turn | Fire all 3 detonation types at 8 each (batch bonus likely) |
| `backend_sr` | Schedule 10 block + 6 AoE next turn | Fire ice+fire+lightning at 14 each (System Meltdown) |
| `ai_jr` | Gain 1 token | Deal 10 damage (scales with tokens at evoke) |
| `ai_sr` | Gain 2 tokens, +0.5 temp | Deal damage equal to tokens×3 to all enemies |

### Specialty Engineers

| Engineer | Passive (per turn) | Evoke (once) |
|---|---|---|
| `qa_engineer` | Apply 1 vulnerable to random enemy | Apply 3 vulnerable + 2 weak to ALL enemies |
| `devops_engineer` | Gain 1 energy | Gain 3 energy + draw 3 cards |
| `security_engineer` | +1 counter-offer (reflect damage when hit) | Deal 20 damage + gain counter-offer = current counter-offer stacks |
| `data_engineer` | Draw 1 card | Draw 3 cards + shuffle discard into draw |
| `principal_engineer` | +1 resilience | Gain resilience = current resilience (double it) |

---

## Option 1 — Pure Passive Stack ("Orb Factory")

**Philosophy:** Simple. Clean. StS Defect with an engineering theme. Stack engineers for compounding per-turn effects. Evoke cycling is the advanced play. Cards are: slot an engineer, or manipulate slots (add/remove), or draw/cycle.

### Archetype: Stack identical engineers for compounding passives

- 3 × `devops_engineer` = +3 energy per turn (broken if you survive long enough to build it)
- 3 × `qa_engineer` = 3 vulnerable per turn to random enemies (enemies melt slowly)
- 3 × `data_engineer` = +3 draw per turn = draw your entire deck repeatedly

### New CardEffect fields needed

```ts
slotEngineer?: EngineerSlot;         // slot this engineer
addEngineerSlot?: number;            // increase maxEngineerSlots by N
removeEngineerSlot?: number;         // decrease maxEngineerSlots by N (enables cheaper cycling)
evokeAllSlots?: boolean;             // trigger all slot evokes simultaneously (legendary)
```

### Card structure

- **Architect cards** (non-engineer): "Whiteboard Strike" (attack), "Requirements Doc" (draw), "Tech Spec" (block + draw), "Dependency Injection" (energy). Low rarity, fill the deck.
- **Engineer slot cards**: Each engineer type is its own card (common/rare/epic). Playing the card slots the engineer. Duplicate engineer cards = faster stacking.
- **Slot manipulation cards**: "Add Headcount" (add 1 slot), "Restructure" (remove 1 slot), "Fast Track" (evoke oldest immediately for free), "Reorg" (shuffle slot order).

### BattleScreen UI

```
[🧩 Frontend Jr]  [⚡ DevOps]  [🔒 Security]
    +2 dodge         +1 energy    +1 reflect
```
Three visible slot badges beneath the character with the engineer icon, name, and passive reminder.

### Trade-offs

✅ Easy to understand — slot engineers, watch passives fire
✅ Clear win condition — build the right trio for the encounter
✅ Simplest implementation (no new resource — just the slot array)
❌ Less decision-making during play — cards either slot engineers or they don't
❌ Feels less "Architect" — more "summon stack manager"
❌ Less synergy depth than other options

---

## Option 2 — Blueprint System ("Design Pattern")

**Philosophy:** Architects plan. The Blueprint system means you lay out a "design" at combat start or via cards — a sequence of engineer types you intend to slot. When you match the blueprint exactly, massive bonuses trigger. Inspired by Monster Train's unit stacking combos.

### Core mechanic: Blueprint

At combat start (or via a "Draw Blueprint" card), a random blueprint is revealed:

```
BLUEPRINT: [ QA → DevOps → Backend Sr ]
```

If you fill slots in this order, at the point the 3rd slot matches → **Blueprint Complete** bonus fires: all three evoke effects simultaneously, then all slots refill with upgraded versions.

### New BattleState fields

```ts
engineerSlots: EngineerSlot[];
maxEngineerSlots: number;
blueprint: string[];               // ordered engineer type IDs for current blueprint
blueprintProgress: number;         // how many sequential matches achieved
```

### How blueprints work

- Each turn, play engineer cards to fill slots
- If the engineer you slot matches `blueprint[blueprintProgress]` → `blueprintProgress++`, visual feedback
- If `blueprintProgress === blueprint.length` → BLUEPRINT COMPLETE: all evoke effects fire simultaneously + all slots upgraded + new blueprint drawn
- If you slot the wrong engineer → blueprint resets (or: wrong order doesn't reset, just doesn't advance — softer failure)

### Architect-specific cards

- **Blueprint cards**: "Sprint Planning" (draw a new blueprint), "Architecture Review" (see all blueprints, pick one), "Pivot" (change next blueprint slot to any type)
- **Engineer slot cards**: Same roster as Option 1
- **Pattern cards**: "Singleton" (if you have only 1 engineer type in slots: double that passive), "Observer" (each time a slot evokes: draw 1 card), "Factory Method" (spawn 2 copies of the youngest slotted engineer)

### Trade-offs

✅ Very unique — no card game does "ordered combo matching" quite like this
✅ Strong "architect" flavor — you're executing a design
✅ Evoke cycling becomes a skill expression: build your deck around specific blueprints
❌ Can feel frustrating if you can't draw the right engineer type to advance the blueprint
❌ Requires new blueprint UI element (readable at a glance but non-trivial to design)
❌ Slightly more complex implementation (blueprint progress tracking, reset logic)

---

## Option 3 — Resonance System ("Harmonic Stack") — Recommended

**Philosophy:** Adjacent engineer slots amplify each other. Two matching engineers = resonance (passive doubled). Matching all three = harmonic (all passives tripled + special synergy effect). Different neighbor combinations create unique synergy effects — like a periodic table of engineer combos.

### Core mechanic: Resonance

Slots are numbered left→right (1, 2, 3). At the start of each turn:
1. Each slot fires its normal passive
2. For each **adjacent pair** that matches → **Resonance**: that passive fires a second time
3. If **all three match** → **Harmonic**: that passive fires three times total + the `harmonicEffect` for that engineer type triggers

### Resonance example

Slots: `[DevOps, DevOps, QA]`
- Slot 1 (DevOps): +1 energy (normal)
- Slot 2 (DevOps): +1 energy (normal)
- Slot 1+2 adjacent match → Resonance: +1 energy bonus (doubles the pair)
- Slot 3 (QA): 1 vulnerable (normal)
- Total: +3 energy, 1 vulnerable

### Harmonic example

Slots: `[Security, Security, Security]`
- Each slot: +1 counter-offer (normal)
- All three match → Harmonic: +3 counter-offer AND `harmonicEffect` → deal damage equal to 3× counter-offer stacks to all enemies

### New BattleState fields

```ts
engineerSlots: EngineerSlot[];      // up to maxEngineerSlots
maxEngineerSlots: number;           // starts at 3
```

No extra fields — resonance/harmonic is computed from the slot array at turn start. Clean.

### EngineerSlot extended with harmonicEffect

```ts
export interface EngineerSlot {
  id: string;
  name: string;
  icon: string;
  passiveEffect: EngineerPassive;
  evokeEffect: EngineerEvoke;
  harmonicEffect: EngineerEvoke;    // fires when all slots are this type
}
```

### Architect card structure

**"Pattern" cards** (non-engineer): Enable slot manipulation and synergy play.
- `singleton_pattern`: If all slots are the same type: triple passive this turn. Cost 1.
- `observer_pattern`: Draw 1 card whenever a slot evokes. Power. Cost 2.
- `factory_method`: Duplicate the most-slotted engineer type once. Cost 2.
- `dependency_injection`: Swap any two slot positions. Cost 0.
- `design_doc`: Look at top 3 cards, put them back in any order. Draw 1. Cost 1.
- `code_review`: Apply 2 vulnerable to all enemies. Cost 1.
- `tech_debt_payment`: Remove a curse from deck. Gain 1 energy. Exhaust. Cost 0.

**Engineer cards**: Same roster, but now have `harmonicEffect` defined.

**Slot manipulation**:
- `add_headcount`: Gain 1 engineer slot (max 5). Cost 2.
- `restructure`: Lose 1 engineer slot (min 1). Evoke oldest immediately. Cost 0.
- `fast_track`: Evoke oldest slot immediately (without needing to slot a new engineer). Cost 1.
- `full_reorg`: Evoke ALL slots simultaneously. Clear all slots. Cost 3. Exhaust.

### Harmonic effects per engineer

| Engineer | Harmonic effect |
|---|---|
| DevOps ×3 | Gain 3 energy + draw 3 cards |
| QA ×3 | Apply 3 vulnerable + 3 weak to ALL enemies |
| Security ×3 | Deal damage = 3× counter-offer to all enemies |
| Data ×3 | Draw your entire hand again (fill to 10) |
| Frontend Jr ×3 | Gain 8 dodge + apply 6 bleed to all |
| Backend Sr ×3 | System Meltdown: fire ice+fire+lightning at 20 each |
| AI Sr ×3 | Deal damage = tokens × 5 to all enemies, tokens → 0 |
| Principal ×3 | Double all current status effects on player |

### Trade-offs

✅ **Most synergy depth** — slot composition is a constant decision
✅ Strong game-design flavor — "adjacent matching" is architectural thinking
✅ Evoke cycling is interesting: clearing a slot breaks a resonance, but the evoke burst might be worth it
✅ Scales gracefully — even with 1 matching pair you get value; full harmonic is the ceiling
✅ Starter deck teaches it naturally: play 2 DevOps, get resonance immediately
✅ Implementation is clean: resonance check is a pure function of the slot array
❌ Adjacent pair logic needs clear UI (slot indicators for resonance state)
❌ Slightly harder to parse at a glance — players need to remember which types resonate

---

## Implementation Scope (all options)

### New types needed (types/index.ts)

```ts
export interface EngineerPassive {
  block?: number;
  draw?: number;
  energy?: number;
  applyToSelf?: StatusEffect;
  applyToRandom?: StatusEffect;    // apply to a random enemy
  applyToAll?: StatusEffect;
  damage?: number;                  // deal to random enemy
  damageAll?: number;
  queueBlock?: number;             // backend-style detonation from passive
}

export interface EngineerEvoke {
  block?: number;
  draw?: number;
  energy?: number;
  damage?: number;
  damageAll?: number;
  applyToSelf?: StatusEffect;
  applyToAll?: StatusEffect;
  queueBlock?: number;
  queueDamageAll?: number;
  queueChain?: number;
  copium?: number;
}

export interface EngineerSlot {
  id: string;
  name: string;
  icon: string;
  passiveEffect: EngineerPassive;
  evokeEffect: EngineerEvoke;
  harmonicEffect?: EngineerEvoke;  // Option 3 only
}

// BattleState additions:
engineerSlots: EngineerSlot[];
maxEngineerSlots: number;
```

### New CardEffect field

```ts
slotEngineer?: EngineerSlot;         // slot this engineer when played
addEngineerSlot?: number;            // increase max slots
removeEngineerSlot?: number;         // decrease max slots (triggers evoke of oldest)
evokeOldest?: boolean;               // trigger evoke of oldest slot without slotting (fast_track)
evokeAll?: boolean;                  // evoke all slots simultaneously (full_reorg)
```

### Files to touch

1. `src/types/index.ts` — EngineerSlot, EngineerPassive, EngineerEvoke types + BattleState fields + CardEffect fields
2. `src/store/battleActions.ts` — initBattle (add slots: [], maxSlots: 3), executePlayCard (slot + evoke logic), startNewTurn (passive fire loop)
3. `src/components/battle/BattleScreen.tsx` — slot display UI (icons + passive reminder)
4. `src/data/cards/architectCards.ts` — full card replacement (~50 cards: pattern cards + engineer slot cards)
5. `src/data/characters.ts` — new starter deck, energy 4→3, new title
6. `src/store/gameStore.ts` — GAME_VERSION → 1.15.0

### Characters.ts change

```ts
{
  id: 'architect',
  name: 'Architect',
  title: 'The Obelisk',              // was 'The System Designer'
  hp: 65,
  energy: 3,                         // was 4 — reduced to match other classes
  maxStress: 90,
  description: 'The Obelisk. Slot engineers into 3 orb-like positions. Each turn, all slotted engineers fire their passive effects. Fill all slots with matching engineers for harmonic resonance. Evoke the oldest engineer for a burst when slots overflow.',
  starterDeckIds: [
    'singleton_pattern', 'singleton_pattern', 'singleton_pattern', 'singleton_pattern',
    'devops_engineer', 'devops_engineer',
    'qa_engineer',
    'design_doc',
    'code_review',
    'coffee_break',
  ],
}
```

---

## Recommendation

**Go with Option 3 (Resonance System).**

It delivers:
- The most meaningful decisions each turn (which engineers to slot, which resonance to maintain or break)
- The clearest endgame fantasy (harmonic = full passive domination)
- The cleanest implementation (no extra BattleState fields beyond slot array)
- The best "architect" flavor — you're thinking about adjacency, patterns, and when to sacrifice resonance for an evoke burst

Option 1 is solid but plays too much like a simpler version of Option 3. Option 2 is interesting but the blueprint frustration (can't draw the right type) is a real risk.

---

## Next Steps

Once you approve an option, invoke `writing-plans` to produce the full implementation plan with complete card specs for all ~50 Architect cards.
