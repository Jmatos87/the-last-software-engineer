# Enemy Redesign — Design Document
**Date:** 2026-02-19
**Scope:** Common enemies (36), Elite enemies (15), Act bosses (9) + 13 new minion definitions
**Status:** Approved

---

## Problem Statement

Common enemies currently deal ~5–7 HP/turn average, killing heroes in 11–12 turns when the player skips turns. The target is 6–7 turns for average heroes, ramping across acts. Raw damage inflation was rejected in favor of richer, more varied movesets inspired by the five reference games.

Group fights (duos/trios) were the key constraint: blunt 2× multipliers would be lethal in trios, so the solution is **escalating move cycles + archetype identity** rather than flat number bumps.

---

## Design Principles

- **Every enemy has a clear identity** — one mechanic that makes it memorable and creates tactical decisions
- **Move cycles escalate** — opener → buildup → peak threat. Killing fast is always rewarded.
- **Groups feel synergistic, not just additive** — archetypes that complement each other (ritualist + compound = pressure spiral)
- **Damage increase is moderate** — ~40-50% higher peak moves vs current, but the variety and escalation make fights feel harder
- **Inspiration-driven** — each archetype maps to a specific source game mechanic

---

## Inspiration Mapping

| Archetype | Source Game | Core Pattern |
|---|---|---|
| **Ritualist** | Slay the Spire | Buffs self confidence for 1–2 turns, then releases a scaled hit. Creates "kill before it's ready" urgency. |
| **Wake-Up** | Ring of Pain | First move is passive/weak. Activates after turn 1; each subsequent cycle grows more dangerous. |
| **Escalator** | Monster Train | Gains permanent confidence +1 every time it acts. Harmless early, lethal late. Never stops scaling. |
| **Wildcard** | Inscryption | One hidden or surprise move in its cycle. Asymmetric threat — seems manageable until it isn't. |
| **Compound** | Darkest Dungeon | Re-applies debuffs/poison so they compound. Stress cascades. Forces target prioritization. |

---

## New Engine Move Types

Three new `EnemyMoveType` values required. All others (attack, defend, buff, debuff, exhaust, etc.) are reused.

### `summon`
Spawns N copies of a specified enemy mid-combat.
- New fields on `EnemyMove`: `summonId: string`, `summonCount?: number` (default 1)
- Engine: after all enemies act, append new `EnemyInstance` objects to `battle.enemies` (capped: max 5 total enemies at once to prevent UI overflow)
- New enemy instances start at their first move (moveIndex 0)
- Summoned enemies award no gold on death (or small gold if desired)
- `totalEnemies` on BattleState is NOT incremented (summoned minions don't count toward kill reward)

### `energy_drain`
Reduces the player's energy at the start of their next turn.
- New field on `EnemyMove`: `energyDrain: number`
- New field on `BattleState`: `nextTurnEnergyPenalty: number` (initialized to 0)
- Engine: `startNewTurn` applies the penalty — `energy = Math.max(0, maxEnergy - nextTurnEnergyPenalty)` — then resets penalty to 0
- Multiple energy_drain moves in the same enemy turn stack additively

### `corrupt`
Adds one curse card (a "Bug Report" or context-specific curse) to the player's discard pile.
- Uses existing curse card infrastructure (`getCardDef`)
- Default corrupt card ID: `'bug_report_curse'` (new card, defined in neutralCards)
- Engine: push `createCardInstance(curseDef)` to `battle.discardPile` — it appears next time the player cycles their deck

---

## New Curse Card

### Bug Report (neutral curse)
- **Cost:** 1 (unplayable feeling, costs energy if accidentally played)
- **Type:** curse
- **Description:** *"Unplayable. When drawn, gain 5 stress. Corrupted by a failing test."*
- **Effect:** stress +5 on draw (uses existing curse-draw logic in `startNewTurn`)
- Thematic fit: companions inject broken code into your deck mid-fight

---

## Common Enemy Redesign

### Archetype Assignments

**Act 1 — Application Abyss**

| Enemy | Archetype | New Identity |
|---|---|---|
| Resume ATS Filter | Ritualist | Deep Scan (buff ×2) → AUTO-REJECT (scaled hit) |
| Legacy ATS | Ritualist | Connection Lost (attack) → Loading… (buff) → Timeout Slam (big hit) |
| AI ATS | Wildcard | Mild scans → hideIntent on final move (Neural Reject: exhaust 2 + attack) |
| Recruiter Bot | Wake-Up | Cold Email (weak opener) → activates; grows stress+damage each cycle |
| Ghost Company | Wake-Up | Radio Silence (stress only, turn 1) → Haunt → Full Ghosting (scales each pass) |
| Take-Home Assignment | Compound | Requirements Doc (poison 3) → Scope Creep (re-apply poison+vulnerable) → Due Tomorrow (stress cascade) |
| Cover Letter Shredder | Compound | Shred (exhaust 1) → Paper Cut (attack) → Confetti Storm (exhaust + vulnerable stacks) |
| Keyword Stuffer | Escalator | Gains confidence +1 every time it acts; Jargon Jab scales naturally |
| Job Board Troll | Compound | Debuffs stack: Overqualified (resilience -1) → Underqualified (vulnerable 2) → Flame War (boosted hit) |
| App Fee Scammer | Wildcard | Gold steal × 2 → Surcharge (high attack, hidden until it hits) |
| Entry Level 5yrs | Escalator | Gains confidence +1 per action; Impossible Requirements chains into Must Know 12 Frameworks |
| LinkedIn Swarm | Compound | Ping (stress+attack) → Buzz (stress) → Ding (attack); stress compounds each pass |

**Act 2 — Interview Gauntlet**

| Enemy | Archetype | New Identity |
|---|---|---|
| Whiteboard Demon | Ritualist | Optimize This (buff self) → Edge Case (scaled hit, vulnerable rider) |
| LeetCode Goblin | Ritualist | Easy → Medium → Hard: literal escalating cycle, Time Limit → stress burst |
| Culture Fit Enforcer | Wake-Up | Pizza Parties (stress, passive) → activates; Red Flag + Forced Fun compound stress |
| Behavioral Question Bot | Compound | Debuffs stack: Tell Me (weak 2) → Why Hire You (vulnerable 2) → Competency Check (scaled) |
| Pair Programmer | Compound | Code Review (weak+vulnerable) → Actually (high attack) → Let Me Drive (stress + attack) |
| Trivia Quizmaster | Escalator | Gains confidence +1 each act; Pop Quiz scales dangerously by turn 4 |
| Recruiter Middleman | Escalator | Buffs allies confidence each turn (indirect escalation for group fights) |
| Take-Home v2 | Ritualist | Feature Creep (buff) → Deploy Pressure (scaled attack+stress) |
| The Lowballer | Wildcard | Gold steal × 2 → Take It Or Leave It (high hidden attack) |
| Zoom Fatigue | Wildcard | Exhaust moves → You're On Mute (hidden attack when least expected) |
| Reference Checker | Compound | Verify Credentials (weak 2) → Inconsistency Found (high attack, scales with debuffs) |
| Scheduling Nightmare | Wake-Up | Reschedule (stress, passive) → activates; Calendar Tetris compounds debuffs |

**Act 3 — Corporate Final Round**

| Enemy | Archetype | New Identity |
|---|---|---|
| System Design Titan | Ritualist | Load Balancer (defend) → Distributed Slam (scales with stacks) |
| Salary Negotiator | Wildcard | Gold steals → Final Offer (surprise high attack) |
| Imposter Syndrome | Wake-Up | You Don't Belong (stress, passive) → activates; Spiral compounds stress+damage |
| Benefits Mimic | Wildcard | Looks Great! (defend, friendly) → SURPRISE (massive hit out of nowhere) |
| Equity Phantom | Escalator | Exhaust compounds + gains confidence; Paper Money scales naturally |
| Non-Compete Clause | Compound | Legal Binding (exhaust+restrict) → Restriction (debuff compound) → Court Order (scaled) |
| The Pivot | Ritualist | Pivoting to X (buff ×1-2) → Pivot (high scaled attack) |
| Burnout Ember | Compound | Smolder (poison 3) → re-applies poison with Ember Spread; compounds to lethal |
| Meeting Email | Escalator | Reply All Storm grows: gains confidence each cycle; Action Items scales |
| The Counteroffer | Wake-Up | Match Their Offer (heal allies, passive) → activates; Guilt Trip + Retention become threatening |
| Background Check | Compound | Verify Employment (weak+vulnerable) → Found Something (scales with stacks) |
| Relocation Package | Ritualist | Palo Alto or Bust (buff-adjacent stress) → Housing Crisis (scaled hit) |

### Move Cycle Structure (all commons)

Every common enemy follows this pattern:
1. **Opener** — mild action: light attack, debuff, stress, or defend. Low threat.
2. **Buildup** — escalation: buff self, re-apply debuff, or moderate attack
3. **Peak** — highest-damage move in kit (often with secondary effect: stress, exhaust, vulnerable)
4. **Optional reset** — non-attack (exhaust, debuff, heal_allies) before cycling back to opener

Damage targets per act (cycle average over all moves):
- Act 1: 9–11 HP/turn average (up from ~5–7)
- Act 2: 11–14 HP/turn average (up from ~8–10)
- Act 3: 14–18 HP/turn average (up from ~10–13)

---

## Elite Enemy Redesign

One **Summoner** elite per act. Others redesigned with deeper mechanics.

### Act 1 Elites

**Applicant Tracking Golem → SUMMONER**
- Phase 1: System Slam (attack) → Absorb Pattern (buff) → Data Crunch (×2 attack)
- At 50% HP: summons 2× `ats_minion` — minions exhaust 1 card/turn each
- Phase 2: boss focuses on big attacks while minions drain the deck
- Re-summon move: if minions are dead, boss can summon 1 more on its next cycle

**LinkedIn Influencer → ESCALATOR**
- Gains confidence +1 every time it acts (permanent, no cap)
- Phase 1: Viral Post → Humble Brag → Engagement Farming
- Phase 2: moves stay same but confidence stacking makes them terrifying by turn 6+
- Personal Brand now gives confidence +2 AND heals 10 HP (self-sustain on top of scaling)

**Unpaid Take-Home → JUGGERNAUT**
- Phase 1: Overscoped (exhaust 2 + stress) → Crunch Time (attack 15)
- Phase 2 (50% HP): enters armor mode — Scope Creep gives block+confidence simultaneously
- Full-Stack Assault: attack 22, scales +3 per confidence stack

**Networking Event → MANIPULATOR**
- Small Talk (energy_drain 1 + stress 9) — immediately punishes the player
- Awkward Handshake (corrupt — adds "Small Talk Curse" to discard)
- Elevator Pitch (attack 16)
- Exchange Cards (confidence +3 AND energy_drain 2 next turn)

**Automated Rejection → BERSERKER**
- Starts with confidence +3 (onEnter even before any phase)
- Demoralize → Form Rejection → Not A Good Fit (massive, scales from stacks)
- Phase 2 (50% HP): Auto-Reject Mode gives +2 more confidence (now at 5+)
- Rejection Cascade: 5×attack, each hit benefitting from confidence

### Act 2 Elites

**Whiteboard Hydra → SUMMONER**
- Grow Heads move now triggers `summon question_fragment` (1 per activation)
- Question fragments: small (20 HP), apply weak 1 + attack 6 each turn
- Phase 2: Hydra Awakens adds more confidence AND summons another fragment
- Erase Everything: massive hit, exhausts 1 card

**Senior Dev Interrogator → JUGGERNAUT**
- Phase 1: Explain Your Process (attack+stress) → Code Review (debuff) → Deep Dive (attack)
- Phase 2 (50% HP): Years of Experience (buff, massive confidence stack) → eruption
- Pop Quiz becomes ×3 multi-hit (from ×2); Code Review: FAILED scales from confidence

**HR Gatekeeper → MANIPULATOR**
- Bureaucracy Wall: defend 15 AND energy_drain 1
- Red Tape: corrupt (adds "Policy Violation" curse)
- Policy Enforcement: attack + apply weak
- Phase 2: Compliance Hammer scales; Access Denied: attack + energy_drain 2

**The Algorithm → ESCALATOR**
- Gains confidence +1 every time it acts (same as Influencer, but mechanical feel is colder)
- Analyze Pattern: buff +2 confidence + gain 10 block simultaneously
- Recursive Loop: ×2 attack, each hit scales from confidence
- Neural Overload: huge hit, scaling to frightening values by turn 6

**Crunch Time Manager → BERSERKER**
- Starts with confidence +2
- Overtime Mandate: confidence +2 (stacks fast)
- Weekend Work + Sprint Review both attack + stress
- All-Hands Pressure: attack 20+, scales hard; also energy_drain 1

### Act 3 Elites

**The Reorg → SUMMONER**
- Shuffle Teams: discard 4 (draw penalty) AND summons 2× `chaos_agent`
- Chaos agents apply vulnerable 1 + weak 1 every turn — compound debuffs
- Phase 2 (50% HP): Mass Layoff (big attack) + summons 1 more chaos agent if any have died
- Reorg Slam: ×2 attack, scales from debuffs already applied

**Board Member → JUGGERNAUT**
- Phase 1: Quarterly Review (attack_defend) → Shareholder Pressure (buff confidence +3 AND block +12)
- Phase 2: Board Decision (attack 32 + stress 12) → Hostile Acquisition (×2 attack, stress)
- Emergency Board Meeting gives confidence +4 AND energy_drain 1 (power + punish)

**Golden Handcuffs → MANIPULATOR**
- Vest Schedule: exhaust 3 + energy_drain 1 + stress 8 (triple drain)
- Stock Lock: exhaust 2
- Unvested Fury: confidence +4
- Golden Slam: attack 30, scales from confidence; Market Crash ×2

**Technical Debt Golem → ESCALATOR**
- Gains confidence +1 every action (slow but relentless accumulation)
- Legacy Code: attack (low base, but confidence makes it brutal fast)
- Accumulate: confidence +4 (huge spike)
- Spaghetti Strike + Technical Bankruptcy: catastrophic scaling hits late fight

**The PIP → BERSERKER**
- Starts with confidence +4 (the most aggressive opener)
- Performance Review: debuff confidence -1 AND resilience -1 to player (nerf and buff simultaneously)
- Improvement Plan: stress_attack 16
- Phase 2: Clock Is Ticking (confidence +3) → Last Chance (attack 30) → Terminated (attack 28+stress 14)

---

## Boss Companion System

### Design Rules
- Companions **spawn with the boss** at combat start (added to encounter arrays — no engine change)
- Some bosses have a `summon` move to re-call a companion after it dies (once per combat)
- Companions are low HP (18–35), focused on one mechanic, award small gold (5–15)
- UI: companions appear as normal enemy slots; player can target them freely

### Act 1 Boss Companions

**HR Phone Screen + 🎵 Hold Music (HP: 25)**
- Please Hold: energy_drain 1 + stress 7 — *"Your call is important to us."*
- Elevator Music: stress_attack 10 — *"...Muzak intensifies..."*
- Transfer: buff_allies (confidence +1 to HR Screen) — *"Let me connect you."*
- Boss re-summons Hold Music once via a `summon` move if it dies before phase 2

**ATS Final Form + 🤖 Resume Validator (HP: 22)**
- Format Error: exhaust 1 — *"PDF rejected. Again."*
- Validation Failed: corrupt (adds Bug Report curse) + stress 5 — *"Resubmit from scratch."*
- ATS Final Form has a `summon` move (Phase 2): summons a fresh Resume Validator

**Ghosting Phantom + 👻 Ghost Echo × 2 (HP: 18 each, hideIntent)**
- Both spawn with the boss; their intent is always hidden
- Whisper: exhaust 1 — *"\*you hear nothing\*"*
- Fade: stress_attack 8 — *"\*still nothing\*"*
- On death: Ghosting Phantom plays "Conjure Echo" (summon ghost_echo) once if both are dead

### Act 2 Boss Companions

**Panel Interview Hydra + 🧑 Panel Member A (HP: 22) + Panel Member B (HP: 22)**
- Panel Member A: Alignment (buff_allies confidence +1) → Cross-Question (weak 1 + attack 7)
- Panel Member B: We Disagree (apply vulnerable 2) → Deliberate (defend 10)
- Hydra re-summons one Panel Member via a phase 2 `summon` move

**Live Coding Challenge + 🐛 Test Case (HP: 20)**
- Bug Report: corrupt (adds Bug Report curse to discard) — *"Your code has 7 failures."*
- Edge Case: attack 9 + stress 4 — *"What if input is null?"*
- Live Coding Challenge does NOT re-summon; Test Case is a one-shot pressure piece

**VP of Engineering + 💼 Executive Assistant (HP: 28)**
- Calendar Block: energy_drain 1 — *"The VP is in back-to-back meetings."*
- Redirect: gold_steal 12 — *"Billing this to your department."*
- Status Update: heal_allies 15 (heals VP) — *"Good news for the board."*
- VP re-summons Executive Assistant in Phase 3 if it has died

### Act 3 Boss Companions

**Offer Committee + 📋 Committee Chair (HP: 30) + ⚖️ Compliance Officer (HP: 24)**
- Committee Chair: Due Diligence (exhaust 1 + stress 5) → Review Complete (attack 12)
- Compliance Officer: Policy (corrupt) → Enforcement (vulnerable 1 + attack 8)
- Offer Committee re-summons one companion in Phase 3

**The CEO + 📢 PR Manager (HP: 32)**
- Spin Story: heal_allies 18 (heals CEO) — *"The CEO remains fully committed."*
- Press Release: stress_attack 12 — *"Sources say you're not a culture fit."*
- The CEO: re-summons PR Manager with "Rehire" move in Phase 3 after it dies
- This forces the player to kill PR Manager twice to stop the healing loop

**Imposter Syndrome Final + 🪞 Inner Critic (HP: 30)**
- Self-Doubt: weak 1 + vulnerable 1 — *"You don't deserve this."*
- Spiral: stress_attack 14 + attack 9 — *"Everyone can see through you."*
- The Inner Critic makes the Final Form's own moves land 50% harder (vulnerable stacking)
- Imposter Syndrome Final re-summons Inner Critic once via a Phase 2 `summon` move
- Priority target: kill Inner Critic first or the final phase DPS check becomes brutal

---

## New Minion Definitions (13 enemies)

All minions: no isElite/isBoss, `gold: 0` (or 5–10 for Act 2–3), full `moves` array.

| ID | Name | HP | Act | Source |
|---|---|---|---|---|
| `ats_minion` | ATS Minion | 18 | 1 | Summoned by Applicant Tracking Golem |
| `question_fragment` | Follow-Up Question | 20 | 2 | Summoned by Whiteboard Hydra |
| `chaos_agent` | Chaos Agent | 24 | 3 | Summoned by The Reorg |
| `hold_music` | Hold Music | 25 | 1 | Spawns with HR Phone Screen |
| `resume_validator` | Resume Validator | 22 | 1 | Spawns with ATS Final Form |
| `ghost_echo` | Ghost Echo | 18 | 1 | Spawns with Ghosting Phantom (×2) |
| `panel_member_a` | Panel Member A | 22 | 2 | Spawns with Panel Interview Hydra |
| `panel_member_b` | Panel Member B | 22 | 2 | Spawns with Panel Interview Hydra |
| `test_case` | Test Case | 20 | 2 | Spawns with Live Coding Challenge |
| `executive_assistant` | Executive Assistant | 28 | 2 | Spawns with VP of Engineering |
| `committee_chair` | Committee Chair | 30 | 3 | Spawns with Offer Committee |
| `compliance_officer` | Compliance Officer | 24 | 3 | Spawns with Offer Committee |
| `pr_manager` | PR Manager | 32 | 3 | Spawns with The CEO |
| `inner_critic` | Inner Critic | 30 | 3 | Spawns with Imposter Syndrome Final |

*(14 minions total — Inner Critic added)*

---

## Encounter Table Changes

Boss encounter entries updated to include companions:

```
act1BossPool:
  ['hr_phone_screen', 'hold_music']
  ['ats_final_form', 'resume_validator']
  ['ghosting_phantom', 'ghost_echo', 'ghost_echo']

act2BossPool:
  ['panel_interview_hydra', 'panel_member_a', 'panel_member_b']
  ['live_coding_challenge', 'test_case']
  ['vp_of_engineering', 'executive_assistant']

act3BossPool:
  ['offer_committee', 'committee_chair', 'compliance_officer']
  ['the_ceo', 'pr_manager']
  ['imposter_syndrome_final', 'inner_critic']
```

---

## Files Changed

| File | Change |
|---|---|
| `src/types/index.ts` | Add `summon`, `energy_drain`, `corrupt` to `EnemyMoveType`; add `summonId`, `summonCount`, `energyDrain` fields to `EnemyMove`; add `nextTurnEnergyPenalty` to `BattleState` |
| `src/store/battleActions.ts` | Handle 3 new move types in `executeEnemyTurn`; apply energy penalty in `startNewTurn`; summon cap logic |
| `src/data/enemies/act1Enemies.ts` | Full redesign: 12 commons + 5 elites + 3 bosses + 6 minions |
| `src/data/enemies/act2Enemies.ts` | Full redesign: 12 commons + 5 elites + 3 bosses + 4 minions |
| `src/data/enemies/act3Enemies.ts` | Full redesign: 12 commons + 5 elites + 3 bosses + 4 minions |
| `src/data/enemies/encounters.ts` | Update boss pool arrays to include companions |
| `src/data/cards/neutralCards.ts` | Add `bug_report_curse` card definition |
| `src/store/gameStore.ts` | Bump `GAME_VERSION` (minor bump: 1.12.0) |

---

## Version

`GAME_VERSION`: `1.11.1` → `1.12.0` (minor: new mechanics, full enemy redesign)
