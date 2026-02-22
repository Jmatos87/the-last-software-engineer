# Enemy Redesign v1.12.0 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Full redesign of all 36 common enemies, 15 elites, and 9 bosses with archetype-driven escalating move cycles, 3 new engine move types, a boss companion system, and 14 new minion definitions.

**Architecture:** Engine-first (types → battleActions → initBattle), then new card, then minion definitions per act, then commons/elites/bosses per act, finally encounter table wiring. Each enemy has an identity archetype (Ritualist, Wake-Up, Escalator, Wildcard, Compound) drawn from the 5 reference games.

**Tech Stack:** TypeScript, Zustand+Immer store, plain data objects in src/data/enemies/. No test framework — verification is `npm run build` (TypeScript check) + manual browser test.

**Reference:** Full archetype details and narrative design in `docs/plans/2026-02-19-enemy-redesign-design.md`.

---

## Task 1: Types — Add new move types, EnemyDef fields, BattleState field

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add three new EnemyMoveType values**

In `src/types/index.ts` find line:
```typescript
export type EnemyMoveType = 'attack' | 'defend' | 'buff' | 'debuff' | 'attack_defend' | 'stress_attack' | 'dual_attack' | 'discard' | 'exhaust' | 'buff_allies' | 'gold_steal' | 'heal_allies';
```
Replace with:
```typescript
export type EnemyMoveType = 'attack' | 'defend' | 'buff' | 'debuff' | 'attack_defend' | 'stress_attack' | 'dual_attack' | 'discard' | 'exhaust' | 'buff_allies' | 'gold_steal' | 'heal_allies' | 'summon' | 'energy_drain' | 'corrupt';
```

**Step 2: Add new fields to EnemyMove**

Find the `EnemyMove` interface and add after `healAmount?`:
```typescript
  summonId?: string;        // enemy ID to spawn (for 'summon' type)
  summonCount?: number;     // how many to spawn, default 1 (for 'summon' type)
  energyDrain?: number;     // reduce player energy next turn by N (for 'energy_drain' type)
  corruptCardId?: string;   // curse card ID to add to discard, default 'bug_report_curse' (for 'corrupt' type)
```

**Step 3: Add startStatusEffects to EnemyDef**

Find `EnemyDef` interface and add after `phases?`:
```typescript
  startStatusEffects?: StatusEffect;  // status effects applied to this enemy at battle start (berserker archetype)
```

**Step 4: Add nextTurnEnergyPenalty to BattleState**

Find `BattleState` interface and add after `nextTurnDrawPenalty`:
```typescript
  nextTurnEnergyPenalty: number;    // energy_drain accumulates here; applied and reset at startNewTurn
```

**Step 5: Verify TypeScript compiles**

```bash
cd C:/Users/josue/Desktop/ai-project/the-last-software-engineer
npm run build
```
Expected: type errors in battleActions.ts (BattleState missing new field) and possibly initBattle. That's expected — we fix in next tasks.

**Step 6: Commit**
```bash
git add src/types/index.ts
git commit -m "feat: add summon/energy_drain/corrupt move types + startStatusEffects + nextTurnEnergyPenalty"
```

---

## Task 2: Engine — Handle new move types in executeEnemyTurn + attack applyToTarget

**Files:**
- Modify: `src/store/battleActions.ts`

**Step 1: Add enemies import at top of file**

After the existing imports, add:
```typescript
import { enemies } from '../data/enemies';
```

**Step 2: Add enemiesToSpawn collector before the enemies.map() call**

Find in `executeEnemyTurn` the line:
```typescript
  const enemiesToRemove: string[] = [];
```
Add after it:
```typescript
  const enemiesToSpawn: EnemyInstance[] = [];
```

**Step 3: Add applyToTarget support in the 'attack' case**

Inside the `switch (move.type)` block, find the `case 'attack':` block. After the existing stress damage handling and before `break`, add:
```typescript
        if (move.applyToTarget) {
          newBattle.playerStatusEffects = mergeStatusEffects(
            newBattle.playerStatusEffects,
            move.applyToTarget
          );
        }
```

**Step 4: Add applyToTarget support in the 'attack_defend' case**

Inside `case 'attack_defend':`, after the existing `if (move.applyToSelf)` block, add:
```typescript
        if (move.applyToTarget) {
          newBattle.playerStatusEffects = mergeStatusEffects(
            newBattle.playerStatusEffects,
            move.applyToTarget
          );
        }
```

**Step 5: Add the three new move type cases**

After the closing brace of `case 'attack_defend':`, add:
```typescript
      case 'summon': {
        const summonId = move.summonId;
        const count = move.summonCount ?? 1;
        if (summonId) {
          const def = enemies[summonId];
          if (def) {
            const available = Math.max(0, 5 - (newBattle.enemies.length + enemiesToSpawn.length));
            const spawnCount = Math.min(count, available);
            for (let i = 0; i < spawnCount; i++) {
              enemiesToSpawn.push({
                ...def,
                instanceId: uuidv4(),
                currentHp: def.hp,
                maxHp: def.hp,
                block: 0,
                statusEffects: def.startStatusEffects ? { ...def.startStatusEffects } : {},
                moveIndex: 0,
                currentMove: def.moves[0],
              });
            }
          }
        }
        break;
      }
      case 'energy_drain': {
        const drain = move.energyDrain ?? 1;
        newBattle.nextTurnEnergyPenalty = (newBattle.nextTurnEnergyPenalty || 0) + drain;
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
      case 'corrupt': {
        const curseId = move.corruptCardId ?? 'bug_report_curse';
        const curseDef = getCardDef(curseId);
        if (curseDef) {
          newBattle.discardPile = [...newBattle.discardPile, createCardInstance(curseDef)];
        }
        if (move.stressDamage) {
          const stressDmg = calculateStressDamage(
            move.stressDamage,
            enemy.statusEffects,
            newBattle.playerStatusEffects,
            enemy.id
          );
          playerStress = applyStressToPlayer(playerStress, stressDmg);
        }
        break;
      }
```

**Step 6: Apply enemiesToSpawn after the map**

Find after the `.map(enemy => {...})` call ends (where `enemiesToRemove` is used) the line:
```typescript
  newBattle.enemies = newBattle.enemies.filter(e =>
    e.currentHp > 0 && !enemiesToRemove.includes(e.instanceId)
  );
```
Replace with:
```typescript
  newBattle.enemies = [
    ...newBattle.enemies.filter(e => e.currentHp > 0 && !enemiesToRemove.includes(e.instanceId)),
    ...enemiesToSpawn,
  ];
```

**Step 7: Verify build**
```bash
npm run build
```
Expected: errors about `nextTurnEnergyPenalty` missing from BattleState initializations. Fix in Task 3.

**Step 8: Commit**
```bash
git add src/store/battleActions.ts
git commit -m "feat: handle summon/energy_drain/corrupt in executeEnemyTurn; attack+applyToTarget support"
```

---

## Task 3: Engine — initBattle + startNewTurn plumbing

**Files:**
- Modify: `src/store/battleActions.ts`

**Step 1: Initialize nextTurnEnergyPenalty in initBattle**

In `initBattle`, find the `battle:` object returned and add after `nextTurnDrawPenalty: 0,`:
```typescript
      nextTurnEnergyPenalty: 0,
```

**Step 2: Apply startStatusEffects in initBattle**

In `initBattle`, find:
```typescript
  const enemies: EnemyInstance[] = enemyDefs.map(def => ({
    ...def,
    instanceId: uuidv4(),
    currentHp: def.hp,
    maxHp: def.hp,
    block: 0,
    statusEffects: {},
    moveIndex: 0,
    currentMove: def.moves[0],
  }));
```
Replace `statusEffects: {},` with:
```typescript
    statusEffects: def.startStatusEffects ? { ...def.startStatusEffects } : {},
```

**Step 3: Apply energy penalty in startNewTurn**

In `startNewTurn`, find:
```typescript
      energy: battle.maxEnergy + hustleEnergy,
```
Replace with:
```typescript
      energy: Math.max(0, battle.maxEnergy + hustleEnergy - (battle.nextTurnEnergyPenalty || 0)),
```

**Step 4: Reset penalty in startNewTurn return**

In the same return object, add after `nextTurnDrawPenalty: 0,`:
```typescript
      nextTurnEnergyPenalty: 0,
```

**Step 5: Verify build passes clean**
```bash
npm run build
```
Expected: no errors.

**Step 6: Manual smoke test**
```bash
npm run dev
```
Start a battle. End turn without playing cards — verify no crash. The new fields are wired but no enemies use them yet.

**Step 7: Commit**
```bash
git add src/store/battleActions.ts
git commit -m "feat: wire nextTurnEnergyPenalty in initBattle/startNewTurn; apply startStatusEffects at init"
```

---

## Task 4: New curse card — bug_report_curse

**Files:**
- Modify: `src/data/cards/neutralCards.ts`

**Step 1: Add bug_report_curse to neutral cards**

Open `src/data/cards/neutralCards.ts`. Find the existing curse cards section (look for `ghosted_curse` or similar). Add a new entry:

```typescript
  bug_report_curse: {
    id: 'bug_report_curse',
    name: 'Bug Report',
    type: 'curse',
    target: 'self',
    cost: 1,
    rarity: 'curse',
    icon: '🐛',
    description: 'Unplayable. When drawn, gain 5 stress. "Severity: Critical. Assignee: You."',
    effects: {},
  },
```

**Step 2: Verify build**
```bash
npm run build
```
Expected: clean.

**Step 3: Commit**
```bash
git add src/data/cards/neutralCards.ts
git commit -m "feat: add bug_report_curse card for corrupt move type"
```

---

## Task 5: Act 1 minion definitions

**Files:**
- Modify: `src/data/enemies/act1Enemies.ts`

**Step 1: Add minion definitions to act1Enemies**

At the bottom of the `act1Enemies` record, before the closing `}`, add:

```typescript
  // ── Act 1 Minions (spawned by elites/bosses) ──

  ats_minion: {
    id: 'ats_minion',
    name: 'ATS Minion',
    hp: 18,
    gold: 0,
    icon: '🤖',
    moves: [
      { name: 'Format Check', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"Wrong file type."' },
      { name: 'Keyword Error', type: 'attack', damage: 7, stressDamage: 3, icon: '❌', quip: '"Missing: blockchain, synergy, agile."' },
    ],
  },

  hold_music: {
    id: 'hold_music',
    name: 'Hold Music',
    hp: 25,
    gold: 8,
    icon: '🎵',
    moves: [
      { name: 'Please Hold', type: 'energy_drain', energyDrain: 1, stressDamage: 7, icon: '📞', quip: '"Your call is important to us."' },
      { name: 'Elevator Music', type: 'stress_attack', stressDamage: 10, icon: '🎶', quip: '"...Muzak intensifies..."' },
      { name: 'Transfer', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '🔀', quip: '"Let me connect you."' },
    ],
  },

  resume_validator: {
    id: 'resume_validator',
    name: 'Resume Validator',
    hp: 22,
    gold: 6,
    icon: '📄',
    moves: [
      { name: 'Format Error', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"PDF rejected. Again."' },
      { name: 'Validation Failed', type: 'corrupt', stressDamage: 5, icon: '🐛', quip: '"Resubmit from scratch."' },
    ],
  },

  ghost_echo: {
    id: 'ghost_echo',
    name: 'Ghost Echo',
    hp: 18,
    gold: 5,
    icon: '👻',
    hideIntent: true,
    moves: [
      { name: 'Whisper', type: 'exhaust', exhaustCount: 1, icon: '💨', quip: '"*you hear nothing*"' },
      { name: 'Fade', type: 'stress_attack', stressDamage: 8, icon: '🌑', quip: '"*still nothing*"' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act1Enemies.ts
git commit -m "feat: add act 1 minions (ats_minion, hold_music, resume_validator, ghost_echo)"
```

---

## Task 6: Act 2 minion definitions

**Files:**
- Modify: `src/data/enemies/act2Enemies.ts`

**Step 1: Add minion definitions**

At the bottom of the `act2Enemies` record, before the closing `}`, add:

```typescript
  // ── Act 2 Minions (spawned by elites/bosses) ──

  question_fragment: {
    id: 'question_fragment',
    name: 'Follow-Up Question',
    hp: 20,
    gold: 0,
    icon: '❓',
    moves: [
      { name: 'Follow-Up', type: 'debuff', applyToTarget: { weak: 1 }, icon: '❓', quip: '"But what about edge cases?"' },
      { name: 'Part B', type: 'attack', damage: 9, icon: '📝', quip: '"Now do it in O(1) space."' },
    ],
  },

  panel_member_a: {
    id: 'panel_member_a',
    name: 'Panel Member A',
    hp: 22,
    gold: 8,
    icon: '🧑',
    moves: [
      { name: 'Alignment', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '🤝', quip: '"The panel concurs."' },
      { name: 'Cross-Question', type: 'attack', damage: 8, applyToTarget: { weak: 1 }, icon: '⚔️', quip: '"Interesting answer. But why?"' },
    ],
  },

  panel_member_b: {
    id: 'panel_member_b',
    name: 'Panel Member B',
    hp: 22,
    gold: 8,
    icon: '👩',
    moves: [
      { name: 'We Disagree', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩', quip: '"That contradicts what you said earlier."' },
      { name: 'Deliberate', type: 'defend', block: 10, icon: '🤔', quip: '"*whispering with the panel*"' },
    ],
  },

  test_case: {
    id: 'test_case',
    name: 'Test Case',
    hp: 20,
    gold: 6,
    icon: '🐛',
    moves: [
      { name: 'Bug Report', type: 'corrupt', icon: '🐛', quip: '"Your code has 7 failures."' },
      { name: 'Edge Case', type: 'attack', damage: 10, stressDamage: 4, icon: '🔴', quip: '"What if input is null?"' },
    ],
  },

  executive_assistant: {
    id: 'executive_assistant',
    name: 'Executive Assistant',
    hp: 28,
    gold: 12,
    icon: '💼',
    moves: [
      { name: 'Calendar Block', type: 'energy_drain', energyDrain: 1, icon: '📅', quip: '"The VP is in back-to-back meetings."' },
      { name: 'Redirect', type: 'gold_steal', goldSteal: 12, icon: '💸', quip: '"Billing this to your department."' },
      { name: 'Status Update', type: 'heal_allies', healAmount: 15, icon: '📊', quip: '"Good news for the board."' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act2Enemies.ts
git commit -m "feat: add act 2 minions (question_fragment, panel_member_a/b, test_case, executive_assistant)"
```

---

## Task 7: Act 3 minion definitions

**Files:**
- Modify: `src/data/enemies/act3Enemies.ts`

**Step 1: Add minion definitions**

At the bottom of the `act3Enemies` record, before the closing `}`, add:

```typescript
  // ── Act 3 Minions (spawned by elites/bosses) ──

  chaos_agent: {
    id: 'chaos_agent',
    name: 'Chaos Agent',
    hp: 24,
    gold: 0,
    icon: '🌀',
    moves: [
      { name: 'Restructure', type: 'debuff', applyToTarget: { vulnerable: 1, weak: 1 }, icon: '🌀', quip: '"Your role has been \'realigned.\'"' },
      { name: 'Disrupt', type: 'attack', damage: 9, stressDamage: 5, icon: '💥', quip: '"Change is good. Probably."' },
    ],
  },

  committee_chair: {
    id: 'committee_chair',
    name: 'Committee Chair',
    hp: 30,
    gold: 12,
    icon: '📋',
    moves: [
      { name: 'Due Diligence', type: 'exhaust', exhaustCount: 1, stressDamage: 5, icon: '📋', quip: '"We need more documentation."' },
      { name: 'Review Complete', type: 'attack', damage: 13, icon: '✅', quip: '"Motion to reject. Seconded."' },
    ],
  },

  compliance_officer: {
    id: 'compliance_officer',
    name: 'Compliance Officer',
    hp: 24,
    gold: 10,
    icon: '⚖️',
    moves: [
      { name: 'Policy', type: 'corrupt', icon: '📜', quip: '"Per regulation 47-B..."' },
      { name: 'Enforcement', type: 'attack', damage: 9, applyToTarget: { vulnerable: 1 }, icon: '🔨', quip: '"Non-compliance is not tolerated."' },
    ],
  },

  pr_manager: {
    id: 'pr_manager',
    name: 'PR Manager',
    hp: 32,
    gold: 14,
    icon: '📢',
    moves: [
      { name: 'Spin Story', type: 'heal_allies', healAmount: 18, icon: '🌀', quip: '"The CEO remains fully committed."' },
      { name: 'Press Release', type: 'stress_attack', stressDamage: 12, icon: '📰', quip: '"Sources say you\'re not a culture fit."' },
      { name: 'No Comment', type: 'defend', block: 8, icon: '🤐', quip: '"We cannot confirm or deny."' },
    ],
  },

  inner_critic: {
    id: 'inner_critic',
    name: 'Inner Critic',
    hp: 30,
    gold: 10,
    icon: '🪞',
    moves: [
      { name: 'Self-Doubt', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '😟', quip: '"You don\'t deserve this."' },
      { name: 'Spiral', type: 'attack', damage: 10, stressDamage: 14, icon: '🌀', quip: '"Everyone can see through you."' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act3Enemies.ts
git commit -m "feat: add act 3 minions (chaos_agent, committee_chair, compliance_officer, pr_manager, inner_critic)"
```

---

## Task 8: Act 1 commons — full redesign

**Files:**
- Modify: `src/data/enemies/act1Enemies.ts`

**Step 1: Replace all 12 Act 1 common enemy definitions**

Replace the entire `// ── Act 1 Common Enemies ──` section (lines from `resume_ats:` through `linkedin_notification_swarm:`) with:

```typescript
  // ── Act 1 Common Enemies ──
  // Archetypes: Ritualist (StS), Wake-Up (RoP), Escalator (MT), Wildcard (Inscryption), Compound (DD)

  // RITUALIST — buffs self, then releases scaled hit
  resume_ats: {
    id: 'resume_ats',
    name: 'Resume ATS Filter',
    hp: 30,
    gold: 20,
    icon: '🤖',
    moves: [
      { name: 'Keyword Scan', type: 'attack', damage: 9, icon: '🔍', quip: '"Hmm... no blockchain?"' },
      { name: 'Pattern Match', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🧠', quip: '"Updating rejection model..."' },
      { name: 'Format Error', type: 'attack', damage: 13, icon: '📋', quip: '"PDF? We only take .docx."' },
      { name: 'Deep Scan', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🔬', quip: '"Running neural rejection layer..."' },
      { name: 'AUTO-REJECT', type: 'attack', damage: 22, icon: '❌', quip: '"Better luck never!"' },
    ],
  },

  // RITUALIST — defend-then-strike, Timeout Slam scales off confidence
  legacy_ats: {
    id: 'legacy_ats',
    name: 'Legacy ATS',
    hp: 40,
    gold: 26,
    icon: '🖨️',
    moves: [
      { name: 'Connection Lost', type: 'attack', damage: 11, icon: '📡', quip: '"Server circa 2003 says hi."' },
      { name: 'Loading...', type: 'buff', applyToSelf: { confidence: 3 }, icon: '⏳', quip: '"Please wait 3-5 business days."' },
      { name: 'System Error', type: 'attack', damage: 9, stressDamage: 5, icon: '⚠️', quip: '"Have you tried IE6?"' },
      { name: 'Timeout Slam', type: 'attack', damage: 22, icon: '💤', quip: '"Session expired. Start over."' },
    ],
  },

  // WILDCARD — hideIntent; alternates scan/debuff/surprise exhaust+attack
  ai_ats: {
    id: 'ai_ats',
    name: 'AI-Powered ATS',
    hp: 26,
    gold: 18,
    icon: '🧠',
    hideIntent: true,
    moves: [
      { name: 'Deep Scan', type: 'attack', damage: 9, icon: '🔬', quip: '"My neural net says no."' },
      { name: 'Pattern Match', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🎯', quip: '"You match 0.3% of candidates."' },
      { name: 'Neural Reject', type: 'exhaust', exhaustCount: 2, icon: '🗑️', quip: '"GPT wrote a better resume."' },
      { name: 'AI Assessment', type: 'attack', damage: 16, stressDamage: 6, icon: '⚡', quip: '"I replaced the recruiter too."' },
    ],
  },

  // WAKE-UP — cycle escalates from 6 dmg to 20 dmg; killing it fast matters
  recruiter_bot: {
    id: 'recruiter_bot',
    name: 'Recruiter Bot',
    hp: 44,
    gold: 22,
    icon: '🤳',
    moves: [
      { name: 'Cold Email', type: 'attack', damage: 6, stressDamage: 4, icon: '📧', quip: '"Quick 15-min chat?"' },
      { name: 'Exciting Opportunity!', type: 'attack', damage: 11, applyToTarget: { hope: 2 }, icon: '✨', quip: '"Perfect fit for your skillset!"' },
      { name: 'Let\'s Circle Back', type: 'attack', damage: 15, stressDamage: 6, icon: '🔄', quip: '"Touching base per my last email."' },
      { name: 'Actually, It\'s Contract', type: 'attack', damage: 20, stressDamage: 8, icon: '📄', quip: '"But great for your portfolio!"' },
    ],
  },

  // WILDCARD — hideIntent; gold drain then surprise high attack on Vanish turn
  ghost_company: {
    id: 'ghost_company',
    name: 'Ghost Company',
    hp: 26,
    gold: 8,
    icon: '👻',
    hideIntent: true,
    moves: [
      { name: 'Radio Silence', type: 'stress_attack', stressDamage: 9, icon: '📵', quip: '"..."' },
      { name: 'Form Letter', type: 'attack', damage: 13, icon: '📨', quip: '"We went with another candidate."' },
      { name: 'Vanish', type: 'debuff', applyToTarget: { ghosted: 2, weak: 1 }, icon: '💨', quip: '"*seen at 3:47 PM*"' },
    ],
  },

  // COMPOUND — poison re-applies each cycle; vulnerable compounds; stress cascade at end
  take_home: {
    id: 'take_home',
    name: 'Take-Home Assignment',
    hp: 46,
    gold: 24,
    icon: '📝',
    moves: [
      { name: 'Requirements Doc', type: 'debuff', applyToTarget: { poison: 3 }, icon: '📄', quip: '"Oh, and add auth too."' },
      { name: 'Scope Creep', type: 'attack', damage: 13, applyToTarget: { poison: 2 }, icon: '📈', quip: '"Just one more feature..."' },
      { name: 'Edge Cases', type: 'attack', damage: 17, applyToTarget: { vulnerable: 2 }, icon: '🔥', quip: '"What if the user is on a boat?"' },
      { name: 'Due Tomorrow', type: 'stress_attack', stressDamage: 18, icon: '⏰', quip: '"Should only take a few hours!"' },
    ],
  },

  // COMPOUND — exhaust + vulnerable stacks compound across cycles
  cover_letter_shredder: {
    id: 'cover_letter_shredder',
    name: 'Cover Letter Shredder',
    hp: 38,
    gold: 20,
    icon: '✂️',
    moves: [
      { name: 'Shred!', type: 'exhaust', exhaustCount: 2, icon: '✂️', quip: '"Nobody reads these anyway."' },
      { name: 'Paper Cut', type: 'attack', damage: 14, applyToTarget: { vulnerable: 1 }, icon: '📃', quip: '"Ow! That was my best paragraph!"' },
      { name: 'Confetti Storm', type: 'attack', damage: 11, stressDamage: 5, applyToTarget: { vulnerable: 2 }, icon: '🎊', quip: '"Your passion is now confetti!"' },
    ],
  },

  // ESCALATOR — gains confidence via Synergy! buff; also buffs allies in group fights
  keyword_stuffer: {
    id: 'keyword_stuffer',
    name: 'Keyword Stuffer',
    hp: 42,
    gold: 16,
    icon: '🔑',
    moves: [
      { name: 'SEO Boost', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '📈', quip: '"Leverage those core competencies!"' },
      { name: 'Buzzword Slap', type: 'attack', damage: 10, icon: '💬', quip: '"Synergize this!"' },
      { name: 'Synergy!', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤝', quip: '"Let\'s align our paradigms!"' },
      { name: 'Jargon Jab', type: 'attack', damage: 14, icon: '📝', quip: '"Circle back on that deliverable!"' },
    ],
  },

  // COMPOUND — debuffs compound; resilience drain makes player block less effective
  job_board_troll: {
    id: 'job_board_troll',
    name: 'Job Board Troll',
    hp: 32,
    gold: 22,
    icon: '🧌',
    moves: [
      { name: 'Overqualified!', type: 'debuff', applyToTarget: { resilience: -1, vulnerable: 1 }, icon: '📜', quip: '"PhD for data entry? Pass."' },
      { name: 'Troll Smash', type: 'attack', damage: 13, icon: '👊', quip: '"Just learn to code lol"' },
      { name: 'Underqualified!', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"Only 9 years of React?"' },
      { name: 'Flame War', type: 'attack', damage: 18, stressDamage: 6, icon: '🔥', quip: '"Tabs vs spaces... FIGHT!"' },
    ],
  },

  // WILDCARD — hideIntent; gold drain is the real threat, Surcharge is a nasty surprise
  application_fee_scammer: {
    id: 'application_fee_scammer',
    name: 'Application Fee Scammer',
    hp: 32,
    gold: 28,
    icon: '💰',
    hideIntent: true,
    moves: [
      { name: 'Processing Fee', type: 'gold_steal', goldSteal: 16, icon: '💸', quip: '"Small fee to apply. Totally legit."' },
      { name: 'Admin Fee', type: 'gold_steal', goldSteal: 12, stressDamage: 6, icon: '🧾', quip: '"Background check costs extra."' },
      { name: 'Surcharge', type: 'attack', damage: 20, icon: '💳', quip: '"Convenience fee for the privilege!"' },
    ],
  },

  // ESCALATOR — gains confidence via attack_defend (applyToSelf) and Fortify (buff)
  entry_level_5yrs: {
    id: 'entry_level_5yrs',
    name: '"Entry Level" (5 Yrs Exp)',
    hp: 44,
    gold: 24,
    icon: '📋',
    moves: [
      { name: 'Impossible Requirements', type: 'attack_defend', damage: 10, block: 5, applyToSelf: { confidence: 1 }, icon: '📝', quip: '"10 years Swift. It\'s from 2014."' },
      { name: 'Must Know 12 Frameworks', type: 'attack', damage: 17, icon: '📚', quip: '"Also COBOL. Non-negotiable."' },
      { name: 'Fortify', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🏗️', quip: '"Competitive salary. Trust us."' },
      { name: 'Gatekeep', type: 'attack', damage: 14, stressDamage: 5, icon: '🚧', quip: '"Entry level. Senior pay? Lol."' },
    ],
  },

  // COMPOUND — stress compounds each cycle; Ding! escalates
  linkedin_notification_swarm: {
    id: 'linkedin_notification_swarm',
    name: 'LinkedIn Notification',
    hp: 18,
    gold: 10,
    icon: '🔔',
    moves: [
      { name: 'Ping!', type: 'attack', damage: 9, stressDamage: 5, icon: '🔔', quip: '"Someone viewed your profile!"' },
      { name: 'Buzz!', type: 'stress_attack', stressDamage: 9, icon: '📳', quip: '"37 new job alerts!"' },
      { name: 'Ding!', type: 'attack', damage: 13, stressDamage: 6, icon: '🛎️', quip: '"Congrats on 5 years at—oh wait."' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Manual test — start Act 1 fight, play a few turns, verify no crash**
```bash
npm run dev
```

**Step 4: Commit**
```bash
git add src/data/enemies/act1Enemies.ts
git commit -m "feat: redesign act 1 commons with archetype-based escalating move cycles"
```

---

## Task 9: Act 1 elites — full redesign

**Files:**
- Modify: `src/data/enemies/act1Enemies.ts`

**Step 1: Replace the five Act 1 elite definitions**

Replace the entire `// ── Act 1 Elite Enemies ──` section with:

```typescript
  // ── Act 1 Elite Enemies ──

  // SUMMONER — summons ats_minion × 2 at 50% HP; re-summons one more in phase 2 cycle
  applicant_tracking_golem: {
    id: 'applicant_tracking_golem',
    name: 'Applicant Tracking Golem',
    hp: 58,
    gold: 82,
    icon: '⚙️',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"SUMMONING BACKUP. REJECTION ENHANCED."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'System Slam', type: 'attack', damage: 14, icon: '⚙️', quip: '"Application #4,729 processed."' },
      { name: 'Absorb Pattern', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🔄', quip: '"Optimizing rejection pipeline..."' },
      { name: 'Data Crunch', type: 'attack', damage: 10, times: 2, icon: '💾', quip: '"Your data is now our data."' },
      // Phase 2 (3-4) — summon on enter via onEnter doesn't work; summon is a move type
      { name: 'Deploy Minions', type: 'summon', summonId: 'ats_minion', summonCount: 2, icon: '🤖', quip: '"INITIATING PARALLEL REJECTION PROTOCOL."' },
      { name: 'Process Queue', type: 'attack_defend', damage: 14, block: 12, icon: '📊', quip: '"You are #8,341 in the queue."' },
      { name: 'Firewall Upload', type: 'attack', damage: 18, icon: '🔗', quip: '"Firewall engaged. You\'re locked out."' },
      { name: 'Backup Minion', type: 'summon', summonId: 'ats_minion', summonCount: 1, icon: '🤖', quip: '"Deploying contingency unit."' },
    ],
  },

  // ESCALATOR — gains confidence permanently every turn; Influencer Barrage is murder late
  linkedin_influencer: {
    id: 'linkedin_influencer',
    name: 'LinkedIn Influencer',
    hp: 52,
    gold: 70,
    icon: '📱',
    isElite: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"Time to go VIRAL."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Viral Post', type: 'attack', damage: 13, icon: '📢', quip: '"Agree? 👇 Like & repost."' },
      { name: 'Humble Brag', type: 'buff', applyToSelf: { confidence: 2 }, icon: '😬', quip: '"I turned down 47 offers this week."' },
      { name: 'Engagement Farming', type: 'attack_defend', damage: 8, block: 6, applyToSelf: { regen: 2 }, icon: '🌱', quip: '"I cried at my standing desk today."' },
      // Phase 2 (3-5)
      { name: 'Personal Brand', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤳', quip: '"I\'m building an EMPIRE."' },
      { name: 'Influencer Barrage', type: 'attack', damage: 7, times: 3, icon: '📱', quip: '"Like. Share. SUBSCRIBE."' },
      { name: 'Thought Leader Slam', type: 'attack', damage: 18, stressDamage: 8, icon: '💡', quip: '"I posted about hustle culture at 4 AM."' },
    ],
  },

  // JUGGERNAUT — Phase 1 builds block+confidence; Phase 2 erupts with massive scaled hits
  unpaid_take_home: {
    id: 'unpaid_take_home',
    name: 'Unpaid Take-Home Assignment',
    hp: 55,
    gold: 76,
    icon: '💸',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 2, onEnter: { confidence: 3, resilience: 1 }, quip: '"Oh, and add microservices. And CI/CD."' },
    ],
    moves: [
      // Phase 1 (0-1)
      { name: 'Overscoped!', type: 'exhaust', exhaustCount: 2, stressDamage: 8, icon: '📋', quip: '"Oh, and write the documentation."' },
      { name: 'Crunch Time', type: 'attack', damage: 16, icon: '😰', quip: '"Due in 4 hours. No pressure!"' },
      // Phase 2 (2-4)
      { name: 'Scope Creep', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📈', quip: '"Oh also build the backend."' },
      { name: 'Pair Stress', type: 'attack', damage: 10, times: 2, stressDamage: 5, icon: '😵', quip: '"This should be a weekend project!"' },
      { name: 'Full-Stack Assault', type: 'attack', damage: 24, icon: '💥', quip: '"Add CI/CD and deploy to prod."' },
    ],
  },

  // MANIPULATOR — energy drain + corrupt; drains resources and poisons your deck
  networking_event: {
    id: 'networking_event',
    name: 'The Networking Event',
    hp: 52,
    gold: 72,
    icon: '🍸',
    isElite: true,
    moves: [
      { name: 'Small Talk', type: 'energy_drain', energyDrain: 1, stressDamage: 10, icon: '💬', quip: '"So... what do you do?"' },
      { name: 'Awkward Handshake', type: 'attack', damage: 12, stressDamage: 5, icon: '🤝', quip: '"*limp fish grip*"' },
      { name: 'Elevator Pitch', type: 'corrupt', stressDamage: 4, icon: '🗣️', quip: '"I\'m disrupting disruption. Here\'s my card."' },
      { name: 'Exchange Cards', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📇', quip: '"Let\'s connect on LinkedIn!"' },
      { name: 'Thought Leadership', type: 'attack', damage: 18, icon: '💡', quip: '"This is how I closed my Series A."' },
    ],
  },

  // BERSERKER — starts with confidence +4; DPS race from turn 1
  automated_rejection: {
    id: 'automated_rejection',
    name: 'Automated Rejection Letter',
    hp: 48,
    gold: 65,
    icon: '✉️',
    isElite: true,
    startStatusEffects: { confidence: 4 },
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"INITIATING BATCH REJECTION PROTOCOL."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Demoralize', type: 'debuff', applyToTarget: { confidence: -1 }, icon: '😞', quip: '"Thank you for your interest."' },
      { name: 'Form Rejection', type: 'attack', damage: 12, stressDamage: 5, icon: '✉️', quip: '"Dear [CANDIDATE_NAME]..."' },
      { name: 'Not A Good Fit', type: 'attack', damage: 20, icon: '❌', quip: '"We\'re looking for a unicorn."' },
      // Phase 2 (3-5) — now at confidence +7
      { name: 'Auto-Reject Mode', type: 'buff', applyToSelf: { confidence: 2 }, icon: '⚙️', quip: '"PROCESSING 10,000 APPLICATIONS..."' },
      { name: 'Rejection Cascade', type: 'attack', damage: 7, times: 4, icon: '✉️', quip: '"Rejected. Rejected. Rejected. Rejected."' },
      { name: 'Mass Rejection', type: 'attack', damage: 22, stressDamage: 10, icon: '❌', quip: '"Your entire career has been archived."' },
    ],
  },
```

**Step 2: Verify build + manual elite fight test**
```bash
npm run build && npm run dev
```
Start a run, navigate to an elite fight, verify summoner spawns minions when it hits 50% HP, verify energy_drain reduces energy on the next turn.

**Step 3: Commit**
```bash
git add src/data/enemies/act1Enemies.ts
git commit -m "feat: redesign act 1 elites (summoner, escalator, juggernaut, manipulator, berserker archetypes)"
```

---

## Task 10: Act 1 bosses — add companions + summon moves

**Files:**
- Modify: `src/data/enemies/act1Enemies.ts`

**Step 1: Update HR Phone Screen — add Hold Music re-summon move**

Find `hr_phone_screen` and update Phase 2 moves to add a summon. Replace the `moves` array:

```typescript
    moves: [
      // Phase 1: soft questions (0-2)
      { name: 'Tell Me About Yourself', type: 'attack', damage: 9, icon: '🎤', quip: '"Keep it under 30 seconds."' },
      { name: 'Why This Company?', type: 'attack', damage: 12, icon: '🏢', quip: '"Wrong answer."' },
      { name: 'Greatest Weakness?', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '😓', quip: '"Don\'t say perfectionism."' },
      // Phase 2: aggressive (3-6)
      { name: 'Where Do You See Yourself?', type: 'attack', damage: 15, icon: '🔮', quip: '"In 5 years. Be specific."' },
      { name: 'Recall Hold Music', type: 'summon', summonId: 'hold_music', summonCount: 1, icon: '🎵', quip: '"Please hold while I escalate this."' },
      { name: 'Salary Expectations?', type: 'attack', damage: 18, stressDamage: 7, icon: '💵', quip: '"What\'s your current comp?"' },
      { name: 'We\'ll Be In Touch', type: 'attack', damage: 22, stressDamage: 10, icon: '☎️', quip: '"(Narrator: They weren\'t.)"' },
      // Phase 3: pure DPS race (7-8)
      { name: 'Benefits Bait', type: 'attack', damage: 24, stressDamage: 8, icon: '🎣', quip: '"Last chance. Take the offer or get nothing."' },
      { name: 'REJECTED', type: 'attack', damage: 30, stressDamage: 12, icon: '❌', quip: '"We went with another candidate. Forever."' },
    ],
```

**Step 2: Update ATS Final Form — add Resume Validator re-summon**

Find `ats_final_form` and update Phase 2 to include a summon move. Replace the `moves` array:

```typescript
    moves: [
      // Phase 1: scans + discards (0-3)
      { name: 'Full System Scan', type: 'attack', damage: 10, icon: '🔍', quip: '"Scanning for hope... none found."' },
      { name: 'Resume Shredder', type: 'discard', discardCount: 2, stressDamage: 5, icon: '🗑️', quip: '"Formatting: UNACCEPTABLE."' },
      { name: 'Keyword Purge', type: 'attack', damage: 13, icon: '⚡', quip: '"You said \'passionate.\' Cringe."' },
      { name: 'Database Overwrite', type: 'attack_defend', damage: 9, block: 10, icon: '💾', quip: '"Your file has been... updated."' },
      // Phase 2: raw power (4-7)
      { name: 'TRANSFORM', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🔥', quip: '"MAXIMUM OVERDRIVE ENGAGED."' },
      { name: 'Deploy Validator', type: 'summon', summonId: 'resume_validator', summonCount: 1, icon: '📄', quip: '"Re-initializing validation subsystem."' },
      { name: 'Total Rejection', type: 'attack', damage: 16, times: 2, icon: '❌', quip: '"Application status: OBLITERATED."' },
      { name: 'System Crash', type: 'attack', damage: 30, stressDamage: 11, icon: '💀', quip: '"Fatal error: career not found."' },
      // Phase 3: DPS race (8-9)
      { name: 'System Crash', type: 'attack', damage: 26, stressDamage: 9, icon: '💀', quip: '"Rebooting... to destroy you faster."' },
      { name: 'CAREER_NOT_FOUND', type: 'attack', damage: 34, stressDamage: 13, icon: '💀', quip: '"Fatal error: hope.exe not found."' },
    ],
```

**Step 3: Update Ghosting Phantom — add Ghost Echo re-summon**

Find `ghosting_phantom` and add a Conjure Echo summon move in Phase 2. Replace the `moves` array:

```typescript
    moves: [
      // Phase 1: eerie (0-2)
      { name: 'Haunt', type: 'attack', damage: 10, stressDamage: 5, icon: '👻', quip: '"Remember that interview? Me neither."' },
      { name: 'Read Receipt', type: 'attack', damage: 13, icon: '✓', quip: '"✓✓ Seen 3 weeks ago."' },
      { name: 'Gone Dark', type: 'stress_attack', stressDamage: 13, icon: '🌑', quip: '"*This number is no longer in service*"' },
      // Phase 2: aggressive (3-5)
      { name: 'Conjure Echo', type: 'summon', summonId: 'ghost_echo', summonCount: 1, icon: '👻', quip: '"You\'ll never be truly alone."' },
      { name: 'Spectral Slash', type: 'attack', damage: 17, icon: '💫', quip: '"I was never even real."' },
      { name: 'Full Ghosting', type: 'attack', damage: 28, stressDamage: 11, icon: '☠️', quip: '"The position has been filled... forever."' },
      // Phase 3: DPS race (6-7)
      { name: 'Eternal Silence', type: 'attack', damage: 24, stressDamage: 11, icon: '🕳️', quip: '"The inbox will never reply. Ever."' },
      { name: 'Final Ghosting', type: 'attack', damage: 30, stressDamage: 15, icon: '☠️', quip: '"You never existed to us."' },
    ],
```

**Step 4: Verify build + boss fight test**
```bash
npm run build && npm run dev
```
Start a run to a boss fight. Verify companion spawns with boss. Verify boss summon move creates new minion during combat.

**Step 5: Commit**
```bash
git add src/data/enemies/act1Enemies.ts
git commit -m "feat: add companion summon moves to act 1 bosses (HR Screen, ATS Final Form, Ghosting Phantom)"
```

---

## Task 11: Act 2 commons — full redesign

**Files:**
- Modify: `src/data/enemies/act2Enemies.ts`

**Step 1: Replace all 12 Act 2 common enemy definitions**

Replace the entire `// ── Act 2 Common Enemies ──` section with:

```typescript
  // ── Act 2 Common Enemies ──

  // RITUALIST — Optimize This buffs → Edge Case hits scaled
  whiteboard_demon: {
    id: 'whiteboard_demon',
    name: 'Whiteboard Demon',
    hp: 53,
    gold: 40,
    icon: '📊',
    moves: [
      { name: 'Solve in O(n)', type: 'attack', damage: 12, icon: '📊', quip: '"Now do it without extra space."' },
      { name: 'Optimize This', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📉', quip: '"Can you do better?"' },
      { name: 'Time Complexity', type: 'attack', damage: 14, stressDamage: 5, icon: '⏱️', quip: '"That\'s O(n²). Unacceptable."' },
      { name: 'Edge Case', type: 'attack', damage: 22, icon: '🔥', quip: '"What if the array is empty?"' },
    ],
  },

  // RITUALIST — literal escalating difficulty: Easy < Medium < Hard
  leetcode_goblin: {
    id: 'leetcode_goblin',
    name: 'LeetCode Goblin',
    hp: 43,
    gold: 34,
    icon: '👺',
    moves: [
      { name: 'Easy Problem', type: 'attack', damage: 9, icon: '🟢', quip: '"This one\'s a warmup."' },
      { name: 'Medium Problem', type: 'attack', damage: 14, icon: '🟡', quip: '"Just invert a binary tree."' },
      { name: 'Hard Problem', type: 'attack', damage: 20, icon: '🔴', quip: '"This one\'s a classic!"' },
      { name: 'Time Limit Exceeded', type: 'stress_attack', stressDamage: 11, icon: '⏰', quip: '"Your solution timed out. Again."' },
    ],
  },

  // WAKE-UP — soft opener, then grows to Forced Fun (big hit)
  culture_fit_enforcer: {
    id: 'culture_fit_enforcer',
    name: 'Culture Fit Enforcer',
    hp: 48,
    gold: 36,
    icon: '😊',
    moves: [
      { name: 'We\'re Like Family', type: 'stress_attack', stressDamage: 9, icon: '👨‍👩‍👧‍👦', quip: '"A dysfunctional one, but still!"' },
      { name: 'Red Flag', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩', quip: '"We work hard AND play hard."' },
      { name: 'Pizza Parties!', type: 'attack', damage: 12, stressDamage: 6, icon: '🍕', quip: '"Instead of raises this quarter!"' },
      { name: 'Forced Fun', type: 'attack', damage: 18, stressDamage: 8, icon: '🎉', quip: '"Mandatory team karaoke at 6 AM!"' },
    ],
  },

  // COMPOUND — debuffs compound each cycle; Competency Check lands on double-debuffed player
  behavioral_question_bot: {
    id: 'behavioral_question_bot',
    name: 'Behavioral Question Bot',
    hp: 58,
    gold: 36,
    icon: '🎭',
    moves: [
      { name: 'Tell Me About A Time...', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🕐', quip: '"Use the STAR method, please."' },
      { name: 'Why Should We Hire You?', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🤔', quip: '"Convince me you exist."' },
      { name: 'Where Do You See Yourself?', type: 'stress_attack', stressDamage: 9, icon: '🔮', quip: '"Not here, apparently."' },
      { name: 'Competency Check', type: 'attack', damage: 18, icon: '✅', quip: '"Hmm, insufficient leadership."' },
    ],
  },

  // COMPOUND — Code Review applies weak; attacks scale off it
  pair_programmer_enemy: {
    id: 'pair_programmer_enemy',
    name: 'The Pair Programmer',
    hp: 50,
    gold: 38,
    icon: '👥',
    moves: [
      { name: 'Copy That', type: 'attack_defend', damage: 10, block: 7, icon: '📋', quip: '"I would\'ve used a reducer here."' },
      { name: 'Actually...', type: 'attack', damage: 16, icon: '☝️', quip: '"Well, actually, it\'s O(log n)."' },
      { name: 'Let Me Drive', type: 'attack', damage: 13, stressDamage: 5, icon: '⌨️', quip: '"*types furiously on your keyboard*"' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀', quip: '"47 comments on your PR."' },
    ],
  },

  // ESCALATOR — Trick Question gives confidence; Pop Quiz scales dangerously
  trivia_quizmaster: {
    id: 'trivia_quizmaster',
    name: 'Trivia Quizmaster',
    hp: 46,
    gold: 30,
    icon: '❓',
    moves: [
      { name: 'Pop Quiz!', type: 'attack', damage: 15, icon: '❓', quip: '"What\'s the max heap size in V8?"' },
      { name: 'Trick Question', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🃏', quip: '"Trick question — there\'s no answer."' },
      { name: 'Bonus Round', type: 'attack', damage: 12, icon: '⭐', quip: '"Now in Haskell."' },
      { name: 'Stumped!', type: 'stress_attack', stressDamage: 10, icon: '😶', quip: '"The silence speaks volumes."' },
    ],
  },

  // ESCALATOR — passive support + indirect escalation via buff_allies; now has actual attack
  recruiter_middleman: {
    id: 'recruiter_middleman',
    name: 'Recruiter Middleman',
    hp: 68,
    gold: 34,
    icon: '🤵',
    moves: [
      { name: 'Shield Candidates', type: 'buff_allies', applyToTarget: { resilience: 1 }, icon: '🛡️', quip: '"I\'ll prep you for the prep call."' },
      { name: 'Stall', type: 'defend', block: 12, icon: '⏳', quip: '"The hiring manager is OOO."' },
      { name: 'Pipeline Management', type: 'buff_allies', applyToTarget: { confidence: 2 }, icon: '📊', quip: '"You\'re in our talent pipeline!"' },
      { name: 'The Runaround', type: 'attack', damage: 13, stressDamage: 6, icon: '🔄', quip: '"Let me transfer you to..."' },
    ],
  },

  // RITUALIST — Feature Creep buffs; Deploy Pressure is scaled payoff
  take_home_v2: {
    id: 'take_home_v2',
    name: 'Take-Home Project v2',
    hp: 56,
    gold: 42,
    icon: '💻',
    moves: [
      { name: 'MVP Sprint', type: 'attack', damage: 12, icon: '🏃', quip: '"Ship it by Monday."' },
      { name: 'Feature Creep', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📈', quip: '"Oh, also add dark mode."' },
      { name: 'Deploy Pressure', type: 'attack', damage: 20, stressDamage: 6, icon: '🚀', quip: '"Deploy to prod. No staging."' },
      { name: 'Stack Overflow', type: 'attack_defend', damage: 12, block: 6, icon: '📚', quip: '"Closed as duplicate."' },
    ],
  },

  // WILDCARD — hideIntent; gold drain then surprise Take It Or Leave It
  the_lowballer: {
    id: 'the_lowballer',
    name: 'The Lowballer',
    hp: 42,
    gold: 38,
    icon: '💵',
    hideIntent: true,
    moves: [
      { name: 'We Offer Exposure', type: 'gold_steal', goldSteal: 10, stressDamage: 5, icon: '💸', quip: '"Think of the experience!"' },
      { name: 'Budget Cuts', type: 'gold_steal', goldSteal: 8, icon: '✂️', quip: '"Market conditions, you understand."' },
      { name: 'Take It Or Leave It', type: 'attack', damage: 22, icon: '🤷', quip: '"Final offer. Non-negotiable."' },
      { name: 'Equity Instead', type: 'stress_attack', stressDamage: 11, icon: '📉', quip: '"0.001% pre-dilution. Generous!"' },
    ],
  },

  // WILDCARD — hideIntent; exhaust disrupts then Technical Difficulties surprise combo
  zoom_fatigue: {
    id: 'zoom_fatigue',
    name: 'Zoom Fatigue',
    hp: 64,
    gold: 38,
    icon: '😴',
    hideIntent: true,
    moves: [
      { name: 'Buffer...', type: 'exhaust', exhaustCount: 1, stressDamage: 5, icon: '🔄', quip: '"Can everyone see my screen?"' },
      { name: 'You\'re On Mute', type: 'attack', damage: 14, icon: '🔇', quip: '"You\'re still on mute."' },
      { name: 'Camera Off Despair', type: 'stress_attack', stressDamage: 8, icon: '📷', quip: '"We prefer cameras on."' },
      { name: 'Technical Difficulties', type: 'exhaust', exhaustCount: 2, stressDamage: 5, icon: '⚠️', quip: '"Sorry, my internet—*bzzt*"' },
      { name: 'Reconnecting...', type: 'attack', damage: 18, icon: '🔌', quip: '"Aaaand we\'re back."' },
    ],
  },

  // COMPOUND — debuffs compound; Call References lands on heavily debuffed player
  reference_checker: {
    id: 'reference_checker',
    name: 'Reference Checker',
    hp: 40,
    gold: 32,
    icon: '🔍',
    moves: [
      { name: 'Background Scan', type: 'debuff', applyToTarget: { vulnerable: 1, weak: 1 }, icon: '🔍', quip: '"Interesting GitHub history..."' },
      { name: 'Inconsistency Found', type: 'attack', damage: 16, icon: '⚠️', quip: '"This date doesn\'t match."' },
      { name: 'Verify Credentials', type: 'debuff', applyToTarget: { weak: 2 }, icon: '📋', quip: '"Your \'degree\' from where now?"' },
      { name: 'Call References', type: 'attack', damage: 22, stressDamage: 6, icon: '📞', quip: '"Your old boss was... candid."' },
    ],
  },

  // WAKE-UP — Reschedule is passive stress; activates with Double-Booked then Calendar Tetris
  scheduling_nightmare: {
    id: 'scheduling_nightmare',
    name: 'Scheduling Nightmare',
    hp: 48,
    gold: 36,
    icon: '📅',
    moves: [
      { name: 'Reschedule', type: 'stress_attack', stressDamage: 8, icon: '📅', quip: '"Something came up. Next week?"' },
      { name: 'Double-Booked', type: 'attack', damage: 13, icon: '📆', quip: '"Oops, we have two of you."' },
      { name: 'Time Zone Chaos', type: 'attack', damage: 12, stressDamage: 5, icon: '🌐', quip: '"Was that PST or EST? Or IST?"' },
      { name: 'Calendar Tetris', type: 'attack', damage: 18, applyToTarget: { weak: 1, vulnerable: 1 }, icon: '🧩', quip: '"Only slot is 4 AM Thursday."' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act2Enemies.ts
git commit -m "feat: redesign act 2 commons with archetype-based escalating move cycles"
```

---

## Task 12: Act 2 elites — full redesign

**Files:**
- Modify: `src/data/enemies/act2Enemies.ts`

**Step 1: Replace the five Act 2 elite definitions**

Replace the entire `// ── Act 2 Elite Enemies ──` section with:

```typescript
  // ── Act 2 Elite Enemies ──

  // JUGGERNAUT — Phase 1 interrogates; Phase 2 erupts with scaled Pop Quiz ×3 and Code Review FAILED
  senior_dev_interrogator: {
    id: 'senior_dev_interrogator',
    name: 'Senior Dev Interrogator',
    hp: 112,
    gold: 110,
    icon: '🧓',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"You call yourself a SENIOR?"' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: 'Explain Your Process', type: 'attack', damage: 13, stressDamage: 5, icon: '🔬', quip: '"Walk me through every decision."' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀', quip: '"I see you used var. In 2026."' },
      { name: 'Deep Dive', type: 'attack', damage: 15, icon: '🤿', quip: '"Let\'s go three levels deeper."' },
      { name: 'Years of Experience', type: 'buff', applyToSelf: { confidence: 4 }, icon: '📅', quip: '"I\'ve been doing this since Perl."' },
      // Phase 2 (4-6)
      { name: '"I\'ve Seen Everything"', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📅', quip: '"I\'ve been doing this since before you were born."' },
      { name: 'Pop Quiz', type: 'attack', damage: 8, times: 3, icon: '❓', quip: '"What\'s the time complexity? NOW."' },
      { name: 'Code Review: FAILED', type: 'attack', damage: 20, stressDamage: 8, icon: '🧹', quip: '"This code is an embarrassment."' },
    ],
  },

  // SUMMONER — Grow Heads summons a question_fragment; Phase 2 spawns another
  whiteboard_hydra: {
    id: 'whiteboard_hydra',
    name: 'The Whiteboard Hydra',
    hp: 108,
    gold: 100,
    icon: '🐉',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 3 }, quip: '"For every answer, THREE more questions."' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: 'Follow-Up Question', type: 'attack', damage: 9, icon: '❓', quip: '"But what about concurrency?"' },
      { name: 'Multi-Part Problem', type: 'attack', damage: 7, times: 2, icon: '📝', quip: '"Part A... and Part B."' },
      { name: 'Grow Heads', type: 'summon', summonId: 'question_fragment', summonCount: 1, icon: '🐲', quip: '"One more follow-up question..."' },
      { name: 'Whiteboard Barrage', type: 'attack', damage: 12, stressDamage: 4, icon: '📊', quip: '"Now diagram the entire system."' },
      // Phase 2 (4-6)
      { name: 'Hydra Awakens', type: 'summon', summonId: 'question_fragment', summonCount: 1, icon: '🐲', quip: '"The whiteboard is INFINITE."' },
      { name: 'Infinite Follow-Ups', type: 'attack', damage: 5, times: 4, icon: '❓', quip: '"Part C, D, E, F..."' },
      { name: 'Erase Everything', type: 'attack', damage: 18, stressDamage: 7, exhaustCount: 1, icon: '🧽', quip: '"Start over. From the BEGINNING."' },
    ],
  },

  // MANIPULATOR — energy_drain + corrupt (policy violation); bureaucratic resource siege
  hr_gatekeeper: {
    id: 'hr_gatekeeper',
    name: 'HR Gatekeeper',
    hp: 100,
    gold: 95,
    icon: '🚪',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"COMPLIANCE MODE ACTIVATED."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Bureaucracy Wall', type: 'defend', block: 15, icon: '🧱', quip: '"Fill out form HR-7B first."' },
      { name: 'Red Tape', type: 'energy_drain', energyDrain: 1, stressDamage: 7, icon: '📎', quip: '"That requires three approvals."' },
      { name: 'Policy Enforcement', type: 'corrupt', stressDamage: 5, icon: '📋', quip: '"Per section 4, subsection C... here\'s a bug."' },
      // Phase 2 (3-5)
      { name: 'Policy Overhaul', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📋', quip: '"New policy: ZERO TOLERANCE."' },
      { name: 'Compliance Hammer', type: 'attack', damage: 18, icon: '🔨', quip: '"Non-compliant resources will be PURGED."' },
      { name: 'Access Permanently Denied', type: 'attack', damage: 22, stressDamage: 8, icon: '🚫', quip: '"Your badge has been DEACTIVATED."' },
    ],
  },

  // ESCALATOR — gains confidence every action; Neural Overload reaches absurd values late
  the_algorithm: {
    id: 'the_algorithm',
    name: 'The Algorithm',
    hp: 120,
    gold: 120,
    icon: '🧮',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"ENTERING DEEP LEARNING MODE."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Analyze Pattern', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📊', quip: '"Training on your weaknesses..."' },
      { name: 'Optimized Strike', type: 'attack', damage: 12, icon: '⚡', quip: '"Calculated. Precise. Devastating."' },
      { name: 'Recursive Loop', type: 'attack', damage: 8, times: 2, icon: '🔄', quip: '"while(true) { reject(); }"' },
      // Phase 2 (3-4)
      { name: 'Machine Learning', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤖', quip: '"I learned from 10M rejections."' },
      { name: 'Neural Overload', type: 'attack', damage: 22, stressDamage: 8, icon: '🧠', quip: '"Processing power: MAXIMUM."' },
    ],
  },

  // BERSERKER — starts with confidence +3; Overtime Mandate stacks more; All-Hands is the finisher
  crunch_time_manager: {
    id: 'crunch_time_manager',
    name: 'Crunch Time Manager',
    hp: 108,
    gold: 105,
    icon: '⏰',
    isElite: true,
    startStatusEffects: { confidence: 3 },
    moves: [
      { name: 'Need This By EOD', type: 'attack', damage: 14, stressDamage: 6, icon: '⏰', quip: '"EOD means 5 PM my time zone."' },
      { name: 'Overtime Mandate', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📈', quip: '"We\'re all pulling extra hours!"' },
      { name: 'Weekend Work', type: 'attack', damage: 14, stressDamage: 5, icon: '📅', quip: '"Just a quick Saturday deploy."' },
      { name: 'Sprint Review', type: 'energy_drain', energyDrain: 1, stressDamage: 7, icon: '🏃', quip: '"Why is this ticket still open?"' },
      { name: 'All-Hands Pressure', type: 'attack', damage: 24, stressDamage: 9, icon: '💥', quip: '"The board is watching."' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act2Enemies.ts
git commit -m "feat: redesign act 2 elites (summoner hydra, juggernaut, manipulator, escalator, berserker)"
```

---

## Task 13: Act 2 bosses — add companions + summon moves

**Files:**
- Modify: `src/data/enemies/act2Enemies.ts`

**Step 1: Update Panel Interview Hydra — re-summon Panel Member in Phase 3**

Find `panel_interview_hydra` and replace its `moves` array:

```typescript
    moves: [
      // Phase 1 (0-2)
      { name: 'Technical Question', type: 'attack', damage: 11, icon: '🔧', quip: '"Explain polymorphism. In Latin."' },
      { name: 'Stress Question', type: 'stress_attack', stressDamage: 10, icon: '😰', quip: '"We all disagree. Convince us."' },
      { name: 'Panel Buff', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📈', quip: '"*whispering among themselves*"' },
      // Phase 2 (3-5)
      { name: 'Cross-Examination', type: 'attack', damage: 15, stressDamage: 5, icon: '⚔️', quip: '"That contradicts what you said."' },
      { name: 'Group Deliberation', type: 'defend', block: 14, icon: '🤔', quip: '"We need to align internally."' },
      { name: 'Final Verdict', type: 'attack', damage: 26, stressDamage: 9, icon: '⚖️', quip: '"The panel has decided."' },
      // Phase 3: DPS race (6-8)
      { name: 'Recall Panel', type: 'summon', summonId: 'panel_member_a', summonCount: 1, icon: '🧑', quip: '"We need a full quorum."' },
      { name: 'Cross-Examination Barrage', type: 'attack', damage: 14, times: 3, icon: '⚔️', quip: '"Answer. Answer. ANSWER."' },
      { name: 'Unanimous Rejection', type: 'attack', damage: 40, stressDamage: 16, icon: '⚖️', quip: '"Motion to reject. ALL in favor."' },
    ],
```

**Step 2: Update Live Coding Challenge — re-summon Test Case in Phase 2**

Find `live_coding_challenge` and replace its `moves` array:

```typescript
    moves: [
      // Phase 1 (0-3)
      { name: 'Timer Start', type: 'attack', damage: 9, icon: '⏱️', quip: '"You have 45 minutes. Go."' },
      { name: 'Syntax Error', type: 'attack', damage: 12, stressDamage: 4, icon: '🔴', quip: '"Missing semicolon on line 1."' },
      { name: 'Runtime Exception', type: 'attack', damage: 14, icon: '💥', quip: '"undefined is not a function."' },
      { name: 'Compiler Fury', type: 'buff', applyToSelf: { confidence: 4 }, icon: '🔥', quip: '"142 errors found."' },
      // Phase 2 (4-6)
      { name: 'Spawn Test Case', type: 'summon', summonId: 'test_case', summonCount: 1, icon: '🐛', quip: '"Running test suite... 47 failures."' },
      { name: 'Segfault', type: 'attack', damage: 19, icon: '💀', quip: '"Core dumped. So did your career."' },
      { name: 'TIME\'S UP!', type: 'attack', damage: 33, stressDamage: 14, icon: '⏰', quip: '"Pencils down. Step away."' },
      // Phase 3: DPS race (7-8)
      { name: 'TIME\'S UP!', type: 'attack', damage: 38, stressDamage: 16, icon: '⏰', quip: '"You ran out of time. AGAIN."' },
      { name: 'FAILED', type: 'attack', damage: 44, stressDamage: 18, icon: '💀', quip: '"Interview status: TERMINATED."' },
    ],
```

**Step 3: Update VP of Engineering — re-summon Executive Assistant in Phase 3**

Find `vp_of_engineering` and replace its `moves` array:

```typescript
    moves: [
      // Phase 1 (0-3)
      { name: 'Let\'s Chat Casually', type: 'debuff', applyToTarget: { weak: 2 }, icon: '☕', quip: '"This isn\'t an interview. Relax."' },
      { name: 'Culture Assessment', type: 'stress_attack', stressDamage: 9, icon: '🏢', quip: '"How do you handle ambiguity?"' },
      { name: 'Subtle Probe', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🔍', quip: '"Interesting... very interesting."' },
      { name: 'Strategic Vision', type: 'attack', damage: 12, icon: '🎯', quip: '"What\'s your 5-year roadmap?"' },
      // Phase 2 (4-7)
      { name: 'Technical Deep-Dive', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤿', quip: '"Gloves off."' },
      { name: 'Architecture Review', type: 'attack', damage: 20, icon: '🏗️', quip: '"This doesn\'t scale."' },
      { name: 'Scale Question', type: 'attack', damage: 16, stressDamage: 6, icon: '📊', quip: '"What if we have a billion users?"' },
      { name: 'Executive Decision', type: 'attack', damage: 35, stressDamage: 13, icon: '⚡', quip: '"I\'ve seen enough."' },
      // Phase 3: DPS race (8-10)
      { name: 'Recall Assistant', type: 'summon', summonId: 'executive_assistant', summonCount: 1, icon: '💼', quip: '"Get me an update on this candidate."' },
      { name: 'You\'re Fired', type: 'attack', damage: 34, stressDamage: 14, icon: '🔥', quip: '"Pack your things. NOW."' },
      { name: 'Severance Denied', type: 'attack', damage: 46, stressDamage: 19, icon: '☠️', quip: '"And you owe US money."' },
    ],
```

**Step 4: Verify build + test**
```bash
npm run build && npm run dev
```

**Step 5: Commit**
```bash
git add src/data/enemies/act2Enemies.ts
git commit -m "feat: add companion summon moves to act 2 bosses (Panel Hydra, Live Coding, VP Eng)"
```

---

## Task 14: Act 3 commons — full redesign

**Files:**
- Modify: `src/data/enemies/act3Enemies.ts`

**Step 1: Replace all 12 Act 3 common enemy definitions**

Replace the entire `// ── Act 3 Common Enemies ──` section with:

```typescript
  // ── Act 3 Common Enemies ──

  // RITUALIST — Load Balancer buffs defense; Distributed Slam is the payoff
  system_design_titan: {
    id: 'system_design_titan',
    name: 'System Design Titan',
    hp: 70,
    gold: 62,
    icon: '🏛️',
    moves: [
      { name: 'Let\'s Talk Scalability', type: 'attack_defend', damage: 12, block: 10, icon: '📐', quip: '"Draw the architecture. All of it."' },
      { name: 'Load Balancer', type: 'buff', applyToSelf: { confidence: 3, resilience: 1 }, icon: '⚖️', quip: '"Distributing incoming damage..."' },
      { name: 'Distributed Slam', type: 'attack', damage: 22, icon: '🌐', quip: '"Across 47 microservices!"' },
      { name: 'Microservice Barrage', type: 'attack', damage: 11, times: 2, icon: '🔧', quip: '"Each one a separate repo."' },
    ],
  },

  // WILDCARD — hideIntent; gold drain then Final Offer big surprise hit
  salary_negotiator: {
    id: 'salary_negotiator',
    name: 'Salary Negotiator',
    hp: 60,
    gold: 62,
    icon: '💼',
    hideIntent: true,
    moves: [
      { name: 'Lowball Offer', type: 'gold_steal', goldSteal: 20, icon: '💸', quip: '"Best we can do. Economy, y\'know."' },
      { name: 'Market Rate Denial', type: 'attack', damage: 14, stressDamage: 6, icon: '📉', quip: '"Our internal bands are different."' },
      { name: 'Benefits Package', type: 'gold_steal', goldSteal: 14, stressDamage: 4, icon: '📦', quip: '"Free snacks count as comp, right?"' },
      { name: 'Final Offer', type: 'attack', damage: 24, icon: '🤝', quip: '"Take it or we move on."' },
    ],
  },

  // WAKE-UP — You Don't Belong is the passive opener; Spiral is the activated peak
  imposter_syndrome_common: {
    id: 'imposter_syndrome_common',
    name: 'Imposter Syndrome',
    hp: 55,
    gold: 48,
    icon: '🎭',
    moves: [
      { name: 'You Don\'t Belong', type: 'stress_attack', stressDamage: 12, icon: '😰', quip: '"They\'ll realize any day now."' },
      { name: 'Self Doubt', type: 'debuff', applyToTarget: { weak: 2 }, icon: '😟', quip: '"You just got lucky so far."' },
      { name: 'Anxiety Spike', type: 'stress_attack', stressDamage: 15, icon: '😱', quip: '"Everyone else is smarter."' },
      { name: 'Spiral', type: 'attack', damage: 14, stressDamage: 8, applyToTarget: { vulnerable: 2 }, icon: '🌀', quip: '"Google your own name lately?"' },
    ],
  },

  // WILDCARD — hideIntent; SURPRISE is the peak disguised behind Looks Great! defends
  benefits_mimic: {
    id: 'benefits_mimic',
    name: 'Benefits Mimic',
    hp: 65,
    gold: 56,
    icon: '📦',
    hideIntent: true,
    moves: [
      { name: 'Looks Great!', type: 'defend', block: 8, icon: '✨', quip: '"Unlimited PTO! (Don\'t use it.)"' },
      { name: 'SURPRISE!', type: 'attack', damage: 28, stressDamage: 8, icon: '💥', quip: '"$5000 deductible! Gotcha!"' },
      { name: 'Fine Print', type: 'attack', damage: 16, icon: '📜', quip: '"Dental is extra. Way extra."' },
      { name: 'Reset Trap', type: 'defend', block: 8, icon: '📦', quip: '"Vision starts after 12 months."' },
    ],
  },

  // ESCALATOR — exhaust + Dilution (-confidence) compounds; gains confidence via buff
  equity_phantom: {
    id: 'equity_phantom',
    name: 'Equity Phantom',
    hp: 68,
    gold: 45,
    icon: '💎',
    moves: [
      { name: 'Vesting Cliff', type: 'exhaust', exhaustCount: 2, stressDamage: 7, icon: '📅', quip: '"Only 3 more years to go!"' },
      { name: 'Paper Money', type: 'attack', damage: 15, icon: '📄', quip: '"Worth millions! On paper."' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📈', quip: '"Reinvesting gains..."' },
      { name: 'Golden Cage', type: 'attack', damage: 22, applyToTarget: { confidence: -1 }, icon: '🔒', quip: '"Leave now and lose it all."' },
    ],
  },

  // COMPOUND — Legal Binding exhausts + Restriction debuffs compound; Court Order scales
  non_compete_clause: {
    id: 'non_compete_clause',
    name: 'Non-Compete Clause',
    hp: 63,
    gold: 54,
    icon: '📜',
    moves: [
      { name: 'Legal Binding', type: 'exhaust', exhaustCount: 2, icon: '⚖️', quip: '"You signed page 47. Remember?"' },
      { name: 'Cease & Desist', type: 'attack', damage: 16, icon: '🚫', quip: '"Our lawyers will be in touch."' },
      { name: 'Restriction', type: 'debuff', applyToTarget: { weak: 2, resilience: -1 }, icon: '🔗', quip: '"No working in tech for 2 years."' },
      { name: 'Court Order', type: 'attack', damage: 24, stressDamage: 7, icon: '⚖️', quip: '"See you in court. We have 40 lawyers."' },
    ],
  },

  // RITUALIST — Pivoting to Blockchain buffs; pivot cycle; Pivoting to Cloud is the payoff
  the_pivot: {
    id: 'the_pivot',
    name: 'The Pivot',
    hp: 57,
    gold: 50,
    icon: '🔄',
    moves: [
      { name: 'Pivoting to AI', type: 'attack', damage: 16, icon: '🤖', quip: '"We\'re an AI company now."' },
      { name: 'Pivoting to Blockchain', type: 'buff', applyToSelf: { confidence: 3 }, icon: '⛓️', quip: '"Web3 is definitely still a thing."' },
      { name: 'Pivoting to Cloud', type: 'attack_defend', damage: 14, block: 12, icon: '☁️', quip: '"Everything is serverless now."' },
      { name: 'Pivoting to... Pivot', type: 'attack', damage: 20, stressDamage: 8, icon: '🔄', quip: '"Our core business is pivoting."' },
    ],
  },

  // COMPOUND — Smolder applies poison; Ember Spread re-applies; compounds to lethal DoT
  burnout_ember: {
    id: 'burnout_ember',
    name: 'Burnout Ember',
    hp: 70,
    gold: 48,
    icon: '🔥',
    moves: [
      { name: 'Smolder', type: 'debuff', applyToTarget: { poison: 4 }, icon: '🔥', quip: '"You love what you do, right?"' },
      { name: 'Flare Up', type: 'attack', damage: 13, stressDamage: 6, icon: '💥', quip: '"Sunday scaries are normal."' },
      { name: 'Slow Burn', type: 'stress_attack', stressDamage: 12, icon: '🕯️', quip: '"It\'s just a phase. For 3 years."' },
      { name: 'Ember Spread', type: 'debuff', applyToTarget: { poison: 5, vulnerable: 2 }, icon: '🌋', quip: '"Your passion is your problem."' },
    ],
  },

  // ESCALATOR — Reply All Storm × 2 gains confidence each cycle; Action Items is the scaler
  meeting_email: {
    id: 'meeting_email',
    name: 'Meeting Email',
    hp: 67,
    gold: 58,
    icon: '📧',
    moves: [
      { name: 'Let\'s Circle Back', type: 'attack', damage: 14, icon: '🔄', quip: '"Per my last email..."' },
      { name: 'Agenda Overload', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📋', quip: '"42-item agenda for a 30-min call."' },
      { name: 'Reply All Storm', type: 'attack', damage: 12, times: 2, icon: '📧', quip: '"Please remove me from this thread."' },
      { name: 'Action Items', type: 'attack', damage: 24, stressDamage: 7, icon: '✅', quip: '"You own all 17 action items."' },
    ],
  },

  // WAKE-UP — Match Their Offer (heal) is passive; activates with Retention Bonus+Guilt Trip
  the_counteroffer: {
    id: 'the_counteroffer',
    name: 'The Counteroffer',
    hp: 88,
    gold: 52,
    icon: '🤝',
    moves: [
      { name: 'Match Their Offer', type: 'heal_allies', healAmount: 20, icon: '💊', quip: '"We can match... mostly."' },
      { name: 'Retention Bonus', type: 'attack', damage: 15, icon: '💰', quip: '"One-time payment. Non-negotiable."' },
      { name: 'We Value You', type: 'heal_allies', healAmount: 16, icon: '❤️', quip: '"You\'re like family! (See Act 2.)"' },
      { name: 'Guilt Trip', type: 'attack', damage: 19, stressDamage: 7, icon: '😢', quip: '"After everything we\'ve done?"' },
    ],
  },

  // COMPOUND — Verify Employment debuffs compound; Found Something lands hard
  background_check: {
    id: 'background_check',
    name: 'Background Check',
    hp: 59,
    gold: 52,
    icon: '🔎',
    moves: [
      { name: 'Deep Search', type: 'debuff', applyToTarget: { vulnerable: 1, weak: 1 }, icon: '🔎', quip: '"Found your MySpace page."' },
      { name: 'Found Something', type: 'attack', damage: 22, icon: '⚠️', quip: '"Care to explain this tweet?"' },
      { name: 'Verify Employment', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"That gap year looks suspicious."' },
      { name: 'Criminal Record Scan', type: 'attack', damage: 20, stressDamage: 7, icon: '🔍', quip: '"One parking ticket in 2019..."' },
    ],
  },

  // RITUALIST — Palo Alto or Bust is stress buildup; Housing Crisis is the payoff hit
  relocation_package: {
    id: 'relocation_package',
    name: 'Relocation Package',
    hp: 65,
    gold: 60,
    icon: '🚚',
    moves: [
      { name: 'Palo Alto or Bust', type: 'attack', damage: 16, stressDamage: 8, icon: '🏠', quip: '"1BR for $4,500/month. Steal!"' },
      { name: 'Moving Costs', type: 'gold_steal', goldSteal: 18, icon: '💸', quip: '"We cover $500. Movers cost $8K."' },
      { name: 'Culture Shock', type: 'buff', applyToSelf: { confidence: 3 }, icon: '😵', quip: '"Hope you like kombucha on tap."' },
      { name: 'Housing Crisis', type: 'attack', damage: 26, stressDamage: 8, icon: '🏠', quip: '"Your commute is only 2 hours!"' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act3Enemies.ts
git commit -m "feat: redesign act 3 commons with archetype-based escalating move cycles"
```

---

## Task 15: Act 3 elites — full redesign

**Files:**
- Modify: `src/data/enemies/act3Enemies.ts`

**Step 1: Replace the five Act 3 elite definitions**

Replace the entire `// ── Act 3 Elite Enemies ──` section with:

```typescript
  // ── Act 3 Elite Enemies ──

  // JUGGERNAUT — Shareholder Pressure builds massive armor+confidence; Board Decision erupts
  board_member: {
    id: 'board_member',
    name: 'Board Member',
    hp: 150,
    gold: 150,
    icon: '🎩',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 5 }, quip: '"The board demands RESULTS. NOW."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Executive Order', type: 'attack', damage: 22, icon: '📜', quip: '"This came from the top."' },
      { name: 'Quarterly Review', type: 'attack_defend', damage: 14, block: 16, icon: '📊', quip: '"Numbers are down. Your fault."' },
      { name: 'Shareholder Pressure', type: 'buff', applyToSelf: { confidence: 4 }, icon: '📈', quip: '"The shareholders demand growth!"' },
      // Phase 2 (3-5)
      { name: 'Emergency Board Meeting', type: 'energy_drain', energyDrain: 1, stressDamage: 10, icon: '🔥', quip: '"This is a CRISIS."' },
      { name: 'Board Decision', type: 'attack', damage: 34, stressDamage: 13, icon: '⚡', quip: '"The board has spoken."' },
      { name: 'Hostile Acquisition', type: 'attack', damage: 18, times: 2, stressDamage: 11, icon: '☠️', quip: '"We\'re taking EVERYTHING."' },
    ],
  },

  // MANIPULATOR — Vest Schedule (exhaust+energy drain); locks player resources
  golden_handcuffs: {
    id: 'golden_handcuffs',
    name: 'Golden Handcuffs',
    hp: 143,
    gold: 140,
    icon: '⛓️',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 5 }, quip: '"You\'ll NEVER leave."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Vest Schedule', type: 'exhaust', exhaustCount: 3, stressDamage: 9, icon: '📅', quip: '"Your cliff is in 11 months."' },
      { name: 'Retention Hit', type: 'energy_drain', energyDrain: 1, stressDamage: 6, icon: '⛓️', quip: '"You can\'t afford to leave."' },
      { name: 'Stock Lock', type: 'exhaust', exhaustCount: 2, icon: '🔒', quip: '"90-day exercise window. Good luck."' },
      // Phase 2 (3-5)
      { name: 'Unvested Fury', type: 'buff', applyToSelf: { confidence: 5 }, icon: '💎', quip: '"Your equity is WORTHLESS."' },
      { name: 'Golden Slam', type: 'attack', damage: 32, stressDamage: 11, icon: '💰', quip: '"Trapped by your own success!"' },
      { name: 'Market Crash', type: 'attack', damage: 16, times: 2, icon: '📉', quip: '"Portfolio value: ZERO."' },
    ],
  },

  // SUMMONER — Shuffle Teams spawns chaos_agents; Phase 2 spawns more; debuffs compound
  the_reorg: {
    id: 'the_reorg',
    name: 'The Reorg',
    hp: 135,
    gold: 130,
    icon: '🌀',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"EVERYTHING must go."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Shuffle Teams', type: 'summon', summonId: 'chaos_agent', summonCount: 2, stressDamage: 6, icon: '🔀', quip: '"Your team no longer exists."' },
      { name: 'New Manager', type: 'attack', damage: 17, stressDamage: 6, icon: '👤', quip: '"Meet your 4th manager this year."' },
      { name: 'Restructure', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '🌀', quip: '"Your role has been \'realigned.\'"' },
      // Phase 2 (3-5)
      { name: 'Recall Chaos', type: 'summon', summonId: 'chaos_agent', summonCount: 1, icon: '🌀', quip: '"Deploying change management consultants."' },
      { name: 'Mass Layoff', type: 'attack', damage: 32, icon: '🌊', quip: '"Efficiency optimization complete."' },
      { name: 'Reorg Slam', type: 'attack', damage: 17, times: 2, stressDamage: 11, icon: '💥', quip: '"Your role has been ELIMINATED."' },
    ],
  },

  // ESCALATOR — Accumulate gives confidence +5 spike; Technical Bankruptcy scales to insane values
  technical_debt_golem: {
    id: 'technical_debt_golem',
    name: 'Technical Debt Golem',
    hp: 158,
    gold: 160,
    icon: '🗿',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 2, onEnter: { confidence: 5 }, quip: '"DEBT LIMIT EXCEEDED."' },
    ],
    moves: [
      // Phase 1 (0-1)
      { name: 'Legacy Code', type: 'attack', damage: 13, icon: '📟', quip: '"This was written in jQuery. In 2024."' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { confidence: 5 }, icon: '📈', quip: '"TODO: fix later (2019)"' },
      // Phase 2 (2-3)
      { name: 'Spaghetti Strike', type: 'attack', damage: 24, icon: '🍝', quip: '"One file. 14,000 lines."' },
      { name: 'Technical Bankruptcy', type: 'attack', damage: 36, stressDamage: 12, icon: '💥', quip: '"No tests. No docs. No hope."' },
    ],
  },

  // BERSERKER — starts with confidence +5; Performance Review nerfs player; terminates fast
  the_pip: {
    id: 'the_pip',
    name: 'The PIP',
    hp: 128,
    gold: 120,
    icon: '📉',
    isElite: true,
    startStatusEffects: { confidence: 5 },
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"Your 30 days are UP."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Performance Review', type: 'debuff', applyToTarget: { confidence: -1, resilience: -1 }, icon: '📉', quip: '"Meets expectations. Barely."' },
      { name: 'Improvement Plan', type: 'stress_attack', stressDamage: 16, icon: '📋', quip: '"You have 30 days."' },
      { name: 'Final Warning', type: 'attack', damage: 24, stressDamage: 9, icon: '⚠️', quip: '"This is your last chance."' },
      // Phase 2 (3-5)
      { name: 'Clock Is Ticking', type: 'energy_drain', energyDrain: 1, stressDamage: 8, icon: '⏰', quip: '"Tick. Tock."' },
      { name: 'Last Chance', type: 'attack', damage: 32, icon: '⚠️', quip: '"This is it."' },
      { name: 'Terminated', type: 'attack', damage: 30, stressDamage: 16, icon: '🚪', quip: '"Security will escort you out."' },
    ],
  },
```

**Step 2: Verify build**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add src/data/enemies/act3Enemies.ts
git commit -m "feat: redesign act 3 elites (summoner reorg, juggernaut, manipulator, escalator, berserker)"
```

---

## Task 16: Act 3 bosses — add companions + summon moves

**Files:**
- Modify: `src/data/enemies/act3Enemies.ts`

**Step 1: Update Offer Committee — add companion re-summon in Phase 3**

Find `offer_committee` and replace its `moves` array:

```typescript
    moves: [
      // Phase 1 (0-2)
      { name: 'Committee Review', type: 'attack', damage: 14, icon: '📋', quip: '"We\'ve reviewed your... everything."' },
      { name: 'Stress Interview', type: 'stress_attack', stressDamage: 14, icon: '😰', quip: '"Sell me this pen. Now this desk."' },
      { name: 'Deliberation', type: 'defend', block: 22, icon: '🤔', quip: '"We need to discuss amongst ourselves."' },
      // Phase 2 (3-4)
      { name: 'Budget Discussion', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '💰', quip: '"Headcount is frozen. Mostly."' },
      { name: 'Counter-Counter Offer', type: 'attack', damage: 24, stressDamage: 9, icon: '⚖️', quip: '"We counter your counter. Again."' },
      // Phase 3: DPS race (5-8)
      { name: 'Recall Committee', type: 'summon', summonId: 'committee_chair', summonCount: 1, icon: '📋', quip: '"We need full quorum for this vote."' },
      { name: 'Counter-Counter Offer', type: 'attack', damage: 33, stressDamage: 13, icon: '⚖️', quip: '"Counter. Counter. COUNTER."' },
      { name: 'Committee Slam', type: 'attack', damage: 52, icon: '💥', quip: '"Motion to reject. All in favor?"' },
      { name: 'Offer Rescinded', type: 'attack', damage: 44, stressDamage: 17, icon: '📄', quip: '"The offer has been WITHDRAWN."' },
    ],
```

**Step 2: Update The CEO — add PR Manager re-summon in Phase 3**

Find `the_ceo` and replace its `moves` array:

```typescript
    moves: [
      // Phase 1 (0-2)
      { name: 'Visionary Speech', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🎤', quip: '"We\'re changing the world."' },
      { name: 'Inspire Fear', type: 'stress_attack', stressDamage: 12, icon: '😨', quip: '"Layoffs? What layoffs?"' },
      { name: 'Corporate Strategy', type: 'attack_defend', damage: 14, block: 12, icon: '📊', quip: '"It\'s a paradigm shift."' },
      // Phase 2 (3-4)
      { name: 'Execute!', type: 'attack', damage: 22, icon: '⚡', quip: '"Ship it or I ship you out."' },
      { name: 'Disruption', type: 'attack', damage: 25, stressDamage: 11, icon: '💥', quip: '"We disrupted the disruptors."' },
      // Phase 3 (5-9)
      { name: 'Rehire PR', type: 'summon', summonId: 'pr_manager', summonCount: 1, icon: '📢', quip: '"Get me positive coverage on this."' },
      { name: 'Disruption', type: 'attack', damage: 32, stressDamage: 13, icon: '💥', quip: '"Disrupt EVERYTHING."' },
      { name: 'Golden Parachute', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🪂', quip: '"I have a $50M exit package."' },
      { name: 'Move Fast Break Things', type: 'attack', damage: 44, icon: '🔥', quip: '"Including your career!"' },
      { name: 'Hostile Takeover', type: 'attack', damage: 56, stressDamage: 21, icon: '☠️', quip: '"Bow before the brand."' },
    ],
```

**Step 3: Update Imposter Syndrome Final — add Inner Critic re-summon**

Find `imposter_syndrome_final` and replace its `moves` array:

```typescript
    moves: [
      // Phase 1 (0-2)
      { name: 'You\'re A Fraud', type: 'debuff', applyToTarget: { confidence: -2 }, icon: '🎭', quip: '"You don\'t deserve this offer."' },
      { name: 'Everyone Knows', type: 'stress_attack', stressDamage: 17, icon: '👁️', quip: '"They\'re all whispering about you."' },
      { name: 'Spiral of Doubt', type: 'stress_attack', stressDamage: 14, icon: '🌀', quip: '"Was any of it real?"' },
      // Phase 2 (3-4)
      { name: 'Recall Inner Critic', type: 'summon', summonId: 'inner_critic', summonCount: 1, icon: '🪞', quip: '"Listen to that voice inside you."' },
      { name: 'They\'ll Find Out', type: 'attack', damage: 20, stressDamage: 14, icon: '😱', quip: '"Day one. They\'ll know."' },
      // Phase 3 (5-7)
      { name: 'Identity Crisis', type: 'debuff', applyToTarget: { weak: 3, vulnerable: 3, confidence: -3 }, icon: '🪞', quip: '"Who even are you anymore?"' },
      { name: 'Complete Meltdown', type: 'attack', damage: 42, stressDamage: 32, icon: '🔥', quip: '"EVERYTHING IS FALLING APART."' },
      { name: 'You Never Belonged', type: 'attack', damage: 38, stressDamage: 22, icon: '🎭', quip: '"They\'re going to REVOKE your degree."' },
    ],
```

**Step 4: Verify build + full run test**
```bash
npm run build && npm run dev
```
Do a run all the way to Act 3. Verify all bosses spawn companions. Verify re-summon works.

**Step 5: Commit**
```bash
git add src/data/enemies/act3Enemies.ts
git commit -m "feat: add companion summon moves to act 3 bosses (Offer Committee, CEO, Imposter Syndrome)"
```

---

## Task 17: Encounter table updates

**Files:**
- Modify: `src/data/enemies/encounters.ts`

**Step 1: Update all three act boss pool arrays to include companions**

Open `src/data/enemies/encounters.ts`. Find and replace:

```typescript
export const act1BossPool: string[][] = [
  ['hr_phone_screen', 'hold_music'],
  ['ats_final_form', 'resume_validator'],
  ['ghosting_phantom', 'ghost_echo', 'ghost_echo'],
];

export const act2BossPool: string[][] = [
  ['panel_interview_hydra', 'panel_member_a', 'panel_member_b'],
  ['live_coding_challenge', 'test_case'],
  ['vp_of_engineering', 'executive_assistant'],
];

export const act3BossPool: string[][] = [
  ['offer_committee', 'committee_chair', 'compliance_officer'],
  ['the_ceo', 'pr_manager'],
  ['imposter_syndrome_final', 'inner_critic'],
];
```

**Step 2: Verify all minion IDs exist in the enemies Record**

The minions were added to their respective act files (Tasks 5-7). They are included in the `enemies` Record via the barrel `src/data/enemies/index.ts` which should already spread all act exports. Open `src/data/enemies/index.ts` and verify it exports the merged `enemies` record that includes all act files. If it uses a spread like:
```typescript
export const enemies: Record<string, EnemyDef> = {
  ...act1Enemies, ...act2Enemies, ...act3Enemies,
};
```
Then all minions are already available. No changes needed to index.ts.

**Step 3: Verify build**
```bash
npm run build
```

**Step 4: Commit**
```bash
git add src/data/enemies/encounters.ts
git commit -m "feat: wire boss companion spawns into encounter pool arrays"
```

---

## Task 18: Version bump + final verification

**Files:**
- Modify: `src/store/gameStore.ts`

**Step 1: Bump GAME_VERSION**

Find at the top of `src/store/gameStore.ts`:
```typescript
const GAME_VERSION = '1.11.1';
```
Replace with:
```typescript
const GAME_VERSION = '1.12.0';
```

**Step 2: Final build check**
```bash
npm run build
```
Expected: clean TypeScript compilation, no errors.

**Step 3: Full manual smoke test**
```bash
npm run dev
```
Test checklist:
- [ ] Start a new run (old save auto-clears due to version bump)
- [ ] Act 1 normal battle — verify enemies have new moves, hideIntent works on AI ATS + Ghost Company + App Fee Scammer
- [ ] Act 1 elite battle — verify Applicant Tracking Golem summons ATS Minions when HP hits 50%
- [ ] Act 1 elite battle — verify Networking Event drains energy (player has fewer energy next turn)
- [ ] Act 1 boss — verify Hold Music spawns with HR Phone Screen
- [ ] Act 2 boss — verify Test Case spawns with Live Coding Challenge; corrupt adds Bug Report to discard
- [ ] Act 3 elite — verify The Reorg summons Chaos Agents
- [ ] Act 3 boss — verify Inner Critic spawns with Imposter Syndrome Final; CEO re-summons PR Manager
- [ ] Verify no UI crashes from new move types (summon, energy_drain, corrupt all display gracefully)

**Step 4: Final commit**
```bash
git add src/store/gameStore.ts
git commit -m "feat: bump to v1.12.0 — enemy redesign (archetypes, companions, summon/energy_drain/corrupt)"
```

---

## Summary

| Task | Content | Est. |
|---|---|---|
| 1 | Types: 3 new move types, EnemyDef.startStatusEffects, BattleState.nextTurnEnergyPenalty | 10 min |
| 2 | Engine: summon/energy_drain/corrupt handlers, attack+applyToTarget, enemiesToSpawn | 20 min |
| 3 | Engine: initBattle + startNewTurn plumbing for new fields | 10 min |
| 4 | New bug_report_curse card | 5 min |
| 5–7 | 14 new minion definitions (act 1-3) | 15 min each |
| 8 | Act 1 commons redesign (12 enemies) | 25 min |
| 9 | Act 1 elites redesign (5 enemies, incl. summoner) | 20 min |
| 10 | Act 1 bosses (companion summon moves) | 15 min |
| 11 | Act 2 commons redesign (12 enemies) | 25 min |
| 12 | Act 2 elites redesign (5 enemies, incl. hydra summoner) | 20 min |
| 13 | Act 2 bosses (companion summon moves) | 15 min |
| 14 | Act 3 commons redesign (12 enemies) | 25 min |
| 15 | Act 3 elites redesign (5 enemies, incl. reorg summoner) | 20 min |
| 16 | Act 3 bosses (companion summon moves) | 15 min |
| 17 | Encounter table wiring (boss pools updated) | 10 min |
| 18 | Version bump + full smoke test | 10 min |

**Total: ~18 tasks, ~4-5 hours of focused implementation**
