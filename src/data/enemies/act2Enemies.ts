import type { EnemyDef } from '../../types';

// ════════════════════════════════════════════════
// ACT 2 — The Interview Gauntlet
// ════════════════════════════════════════════════

export const act2Enemies: Record<string, EnemyDef> = {

  // ── Act 2 Common Enemies ──

  // RITUALIST — Optimize This buffs → Edge Case hits scaled
  whiteboard_demon: {
    id: 'whiteboard_demon',
    name: 'Whiteboard Demon',
    hp: 115,
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
    hp: 100,
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
    hp: 105,
    gold: 36,
    icon: '😊',
    moves: [
      { name: "We're Like Family", type: 'stress_attack', stressDamage: 9, icon: '👨‍👩‍👧‍👦', quip: '"A dysfunctional one, but still!"' },
      { name: 'Red Flag', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩', quip: '"We work hard AND play hard."' },
      { name: 'Pizza Parties!', type: 'attack', damage: 12, stressDamage: 6, icon: '🍕', quip: '"Instead of raises this quarter!"' },
      { name: 'Forced Fun', type: 'attack', damage: 18, stressDamage: 8, icon: '🎉', quip: '"Mandatory team karaoke at 6 AM!"' },
    ],
  },

  // COMPOUND — debuffs compound each cycle; Competency Check lands on double-debuffed player
  behavioral_question_bot: {
    id: 'behavioral_question_bot',
    name: 'Behavioral Question Bot',
    hp: 120,
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
    hp: 110,
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
    hp: 100,
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
    hp: 130,
    gold: 34,
    icon: '🤵',
    moves: [
      { name: 'Shield Candidates', type: 'buff_allies', applyToSelf: { resilience: 1 }, icon: '🛡️', quip: '"I\'ll prep you for the prep call."' },
      { name: 'Stall', type: 'defend', block: 12, icon: '⏳', quip: '"The hiring manager is OOO."' },
      { name: 'Pipeline Management', type: 'buff_allies', applyToSelf: { confidence: 2 }, icon: '📊', quip: '"You\'re in our talent pipeline!"' },
      { name: 'The Runaround', type: 'attack', damage: 13, stressDamage: 6, icon: '🔄', quip: '"Let me transfer you to..."' },
    ],
  },

  // RITUALIST — Feature Creep buffs; Deploy Pressure is scaled payoff
  take_home_v2: {
    id: 'take_home_v2',
    name: 'Take-Home Project v2',
    hp: 115,
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
    hp: 100,
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
    hp: 120,
    gold: 38,
    icon: '😴',
    hideIntent: true,
    moves: [
      { name: 'Buffer...', type: 'exhaust', exhaustCount: 1, stressDamage: 5, icon: '🔄', quip: '"Can everyone see my screen?"' },
      { name: "You're On Mute", type: 'attack', damage: 14, icon: '🔇', quip: '"You\'re still on mute."' },
      { name: 'Camera Off Despair', type: 'stress_attack', stressDamage: 8, icon: '📷', quip: '"We prefer cameras on."' },
      { name: 'Technical Difficulties', type: 'exhaust', exhaustCount: 2, stressDamage: 5, icon: '⚠️', quip: '"Sorry, my internet—*bzzt*"' },
      { name: 'Reconnecting...', type: 'attack', damage: 18, icon: '🔌', quip: '"Aaaand we\'re back."' },
    ],
  },

  // COMPOUND — debuffs compound; Call References lands on heavily debuffed player
  reference_checker: {
    id: 'reference_checker',
    name: 'Reference Checker',
    hp: 105,
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
    hp: 110,
    gold: 36,
    icon: '📅',
    moves: [
      { name: 'Reschedule', type: 'stress_attack', stressDamage: 8, icon: '📅', quip: '"Something came up. Next week?"' },
      { name: 'Double-Booked', type: 'attack', damage: 13, icon: '📆', quip: '"Oops, we have two of you."' },
      { name: 'Time Zone Chaos', type: 'attack', damage: 12, stressDamage: 5, icon: '🌐', quip: '"Was that PST or EST? Or IST?"' },
      { name: 'Calendar Tetris', type: 'attack', damage: 18, applyToTarget: { weak: 1, vulnerable: 1 }, icon: '🧩', quip: '"Only slot is 4 AM Thursday."' },
    ],
  },

  // ── Act 2 Elite Enemies ──

  // JUGGERNAUT — Phase 1 interrogates; Phase 2 erupts with scaled Pop Quiz ×3 and Code Review FAILED
  senior_dev_interrogator: {
    id: 'senior_dev_interrogator',
    name: 'Senior Dev Interrogator',
    hp: 240,
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
    hp: 220,
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
    hp: 200,
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
    hp: 280,
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
    hp: 260,
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

  // ── Act 2 Bosses (HP bumped, phases added) ──

  panel_interview_hydra: {
    id: 'panel_interview_hydra',
    name: 'Panel Interview Hydra',
    hp: 340,
    gold: 185,
    icon: '🐲',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3, resilience: 1 }, quip: '"The panel has reached a consensus."' },
      { hpPercent: 25, moveStartIndex: 6, onEnter: { confidence: 4 }, quip: '"The panel is UNANIMOUS."' },
    ],
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
  },

  live_coding_challenge: {
    id: 'live_coding_challenge',
    name: 'The Live Coding Challenge',
    hp: 380,
    gold: 175,
    icon: '⌨️',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 3 }, quip: '"Time is running out..."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { confidence: 4 }, quip: '"COMPILATION: FAILED."' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: 'Timer Start', type: 'attack', damage: 9, icon: '⏱️', quip: '"You have 45 minutes. Go."' },
      { name: 'Syntax Error', type: 'attack', damage: 12, stressDamage: 4, icon: '🔴', quip: '"Missing semicolon on line 1."' },
      { name: 'Runtime Exception', type: 'attack', damage: 14, icon: '💥', quip: '"undefined is not a function."' },
      { name: 'Compiler Fury', type: 'buff', applyToSelf: { confidence: 4 }, icon: '🔥', quip: '"142 errors found."' },
      // Phase 2 (4-6)
      { name: 'Spawn Test Case', type: 'summon', summonId: 'test_case', summonCount: 1, icon: '🐛', quip: '"Running test suite... 47 failures."' },
      { name: 'Segfault', type: 'attack', damage: 19, icon: '💀', quip: '"Core dumped. So did your career."' },
      { name: "TIME'S UP!", type: 'attack', damage: 33, stressDamage: 14, icon: '⏰', quip: '"Pencils down. Step away."' },
      // Phase 3: DPS race (7-8)
      { name: "TIME'S UP! (Overtime)", type: 'attack', damage: 38, stressDamage: 16, icon: '⏰', quip: '"You ran out of time. AGAIN."' },
      { name: 'FAILED', type: 'attack', damage: 44, stressDamage: 18, icon: '💀', quip: '"Interview status: TERMINATED."' },
    ],
  },

  vp_of_engineering: {
    id: 'vp_of_engineering',
    name: 'The VP of Engineering',
    hp: 440,
    gold: 195,
    icon: '👔',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"Now the real interview begins."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { confidence: 5 }, quip: '"You\'re DONE here."' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: "Let's Chat Casually", type: 'debuff', applyToTarget: { weak: 2 }, icon: '☕', quip: '"This isn\'t an interview. Relax."' },
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
      { name: "You're Fired", type: 'attack', damage: 34, stressDamage: 14, icon: '🔥', quip: '"Pack your things. NOW."' },
      { name: 'Severance Denied', type: 'attack', damage: 46, stressDamage: 19, icon: '☠️', quip: '"And you owe US money."' },
    ],
  },

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
      { name: 'Alignment', type: 'buff_allies', applyToSelf: { confidence: 1 }, icon: '🤝', quip: '"The panel concurs."' },
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
};

// ── Act 2 Encounter Tables ──

export const act2Solos: string[][] = [
  ['whiteboard_demon'],
  ['leetcode_goblin'],
  ['culture_fit_enforcer'],
  ['behavioral_question_bot'],
  ['pair_programmer_enemy'],
  ['trivia_quizmaster'],
  ['recruiter_middleman'],
  ['take_home_v2'],
  ['the_lowballer'],
  ['zoom_fatigue'],
  ['reference_checker'],
  ['scheduling_nightmare'],
];

export const act2Duos: string[][] = [
  ['whiteboard_demon', 'trivia_quizmaster'],            // Double vulnerable stacking
  ['recruiter_middleman', 'take_home_v2'],              // Support buffs DPS
  ['culture_fit_enforcer', 'behavioral_question_bot'],  // Stress pincer attack
  ['pair_programmer_enemy', 'reference_checker'],       // Double weak lock
  ['the_lowballer', 'zoom_fatigue'],                    // Gold drain + exhaust
  ['leetcode_goblin', 'leetcode_goblin'],               // Pure DPS race
  ['scheduling_nightmare', 'culture_fit_enforcer'],     // Debuff + stress
  ['whiteboard_demon', 'pair_programmer_enemy'],        // Vulnerable + boosted follow-up
];

export const act2Trios: string[][] = [
  ['recruiter_middleman', 'whiteboard_demon', 'take_home_v2'],                       // Buffed assault
  ['leetcode_goblin', 'leetcode_goblin', 'leetcode_goblin'],                         // Grind rush
  ['culture_fit_enforcer', 'behavioral_question_bot', 'scheduling_nightmare'],       // Stress gauntlet
  ['the_lowballer', 'zoom_fatigue', 'reference_checker'],                            // Resource siege
];

export const act2ElitePool: string[][] = [
  ['senior_dev_interrogator'],
  ['whiteboard_hydra'],
  ['hr_gatekeeper'],
  ['the_algorithm'],
  ['crunch_time_manager'],
];

export const act2BossPool: string[][] = [
  ['panel_interview_hydra', 'panel_member_a', 'panel_member_b'],
  ['live_coding_challenge', 'test_case'],
  ['vp_of_engineering', 'executive_assistant'],
];
