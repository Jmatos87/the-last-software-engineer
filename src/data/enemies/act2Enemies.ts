import type { EnemyDef } from '../../types';

// ════════════════════════════════════════════════
// ACT 2 — The Interview Gauntlet
// ════════════════════════════════════════════════

export const act2Enemies: Record<string, EnemyDef> = {

  // ── Act 2 Common Enemies (HP +8-10, key damage bumps) ──

  whiteboard_demon: {
    id: 'whiteboard_demon',
    name: 'Whiteboard Demon',
    hp: 53,
    gold: 40,
    icon: '📊',
    moves: [
      { name: 'Solve in O(n)', type: 'attack', damage: 10, icon: '📊', quip: '"Now do it without extra space."' },
      { name: 'Time Complexity', type: 'attack', damage: 8, stressDamage: 4, icon: '⏱️', quip: '"That\'s O(n²). Unacceptable."' },
      { name: 'Edge Case', type: 'attack', damage: 14, icon: '🔥', quip: '"What if the array is empty?"' },
      { name: 'Optimize This', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '📉', quip: '"Can you do better?"' },
    ],
  },

  leetcode_goblin: {
    id: 'leetcode_goblin',
    name: 'LeetCode Goblin',
    hp: 43,
    gold: 34,
    icon: '👺',
    moves: [
      { name: 'Easy Problem', type: 'attack', damage: 6, icon: '🟢', quip: '"This one\'s a warmup."' },
      { name: 'Medium Problem', type: 'attack', damage: 8, icon: '🟡', quip: '"Just invert a binary tree."' },
      { name: 'Hard Problem', type: 'attack', damage: 13, icon: '🔴', quip: '"This one\'s a classic!"' },
      { name: 'Time Limit Exceeded', type: 'stress_attack', stressDamage: 7, icon: '⏰', quip: '"Your solution timed out. Again."' },
    ],
  },

  culture_fit_enforcer: {
    id: 'culture_fit_enforcer',
    name: 'Culture Fit Enforcer',
    hp: 48,
    gold: 36,
    icon: '😊',
    moves: [
      { name: 'We\'re Like Family', type: 'stress_attack', stressDamage: 8, icon: '👨‍👩‍👧‍👦', quip: '"A dysfunctional one, but still!"' },
      { name: 'Red Flag', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩', quip: '"We work hard AND play hard."' },
      { name: 'Pizza Parties!', type: 'stress_attack', stressDamage: 6, icon: '🍕', quip: '"Instead of raises this quarter!"' },
      { name: 'Forced Fun', type: 'attack', damage: 8, stressDamage: 4, icon: '🎉', quip: '"Mandatory team karaoke at 6 AM!"' },
    ],
  },

  behavioral_question_bot: {
    id: 'behavioral_question_bot',
    name: 'Behavioral Question Bot',
    hp: 58,
    gold: 36,
    icon: '🎭',
    moves: [
      { name: 'Tell Me About A Time...', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🕐', quip: '"Use the STAR method, please."' },
      { name: 'Why Should We Hire You?', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🤔', quip: '"Convince me you exist."' },
      { name: 'Where Do You See Yourself?', type: 'stress_attack', stressDamage: 7, icon: '🔮', quip: '"Not here, apparently."' },
      { name: 'Competency Check', type: 'attack', damage: 9, icon: '✅', quip: '"Hmm, insufficient leadership."' },
    ],
  },

  pair_programmer_enemy: {
    id: 'pair_programmer_enemy',
    name: 'The Pair Programmer',
    hp: 50,
    gold: 38,
    icon: '👥',
    moves: [
      { name: 'Copy That', type: 'attack_defend', damage: 7, block: 7, icon: '📋', quip: '"I would\'ve used a reducer here."' },
      { name: 'Actually...', type: 'attack', damage: 11, icon: '☝️', quip: '"Well, actually, it\'s O(log n)."' },
      { name: 'Let Me Drive', type: 'attack', damage: 8, stressDamage: 3, icon: '⌨️', quip: '"*types furiously on your keyboard*"' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '👀', quip: '"47 comments on your PR."' },
    ],
  },

  trivia_quizmaster: {
    id: 'trivia_quizmaster',
    name: 'Trivia Quizmaster',
    hp: 46,
    gold: 30,
    icon: '❓',
    moves: [
      { name: 'Pop Quiz!', type: 'attack', damage: 13, icon: '❓', quip: '"What\'s the max heap size in V8?"' },
      { name: 'Trick Question', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🃏', quip: '"Trick question — there\'s no answer."' },
      { name: 'Bonus Round', type: 'attack', damage: 7, icon: '⭐', quip: '"Now in Haskell."' },
      { name: 'Stumped!', type: 'stress_attack', stressDamage: 6, icon: '😶', quip: '"The silence speaks volumes."' },
    ],
  },

  recruiter_middleman: {
    id: 'recruiter_middleman',
    name: 'Recruiter Middleman',
    hp: 68,
    gold: 34,
    icon: '🤵',
    moves: [
      { name: 'Shield Candidates', type: 'buff_allies', applyToTarget: { resilience: 1 }, icon: '🛡️', quip: '"I\'ll prep you for the prep call."' },
      { name: 'Stall', type: 'defend', block: 10, icon: '⏳', quip: '"The hiring manager is OOO."' },
      { name: 'Pipeline Management', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '📊', quip: '"You\'re in our talent pipeline!"' },
      { name: 'The Runaround', type: 'stress_attack', stressDamage: 5, icon: '🔄', quip: '"Let me transfer you to..."' },
    ],
  },

  take_home_v2: {
    id: 'take_home_v2',
    name: 'Take-Home Project v2',
    hp: 56,
    gold: 42,
    icon: '💻',
    moves: [
      { name: 'MVP Sprint', type: 'attack', damage: 8, icon: '🏃', quip: '"Ship it by Monday."' },
      { name: 'Feature Creep', type: 'buff', applyToSelf: { confidence: 1 }, icon: '📈', quip: '"Oh, also add dark mode."' },
      { name: 'Deploy Pressure', type: 'attack', damage: 13, stressDamage: 4, icon: '🚀', quip: '"Deploy to prod. No staging."' },
      { name: 'Stack Overflow', type: 'attack_defend', damage: 9, block: 5, icon: '📚', quip: '"Closed as duplicate."' },
    ],
  },

  the_lowballer: {
    id: 'the_lowballer',
    name: 'The Lowballer',
    hp: 42,
    gold: 38,
    icon: '💵',
    moves: [
      { name: 'We Offer Exposure', type: 'gold_steal', goldSteal: 8, stressDamage: 4, icon: '💸', quip: '"Think of the experience!"' },
      { name: 'Budget Cuts', type: 'gold_steal', goldSteal: 6, icon: '✂️', quip: '"Market conditions, you understand."' },
      { name: 'Take It Or Leave It', type: 'attack', damage: 12, icon: '🤷', quip: '"Final offer. Non-negotiable."' },
      { name: 'Equity Instead', type: 'stress_attack', stressDamage: 7, icon: '📉', quip: '"0.001% pre-dilution. Generous!"' },
    ],
  },

  zoom_fatigue: {
    id: 'zoom_fatigue',
    name: 'Zoom Fatigue',
    hp: 64,
    gold: 38,
    icon: '😴',
    moves: [
      { name: 'Buffer...', type: 'exhaust', exhaustCount: 1, icon: '🔄', quip: '"Can everyone see my screen?"' },
      { name: 'You\'re On Mute', type: 'attack', damage: 8, icon: '🔇', quip: '"You\'re still on mute."' },
      { name: 'Camera Off Despair', type: 'stress_attack', stressDamage: 6, icon: '📷', quip: '"We prefer cameras on."' },
      { name: 'Technical Difficulties', type: 'exhaust', exhaustCount: 2, stressDamage: 3, icon: '⚠️', quip: '"Sorry, my internet—*bzzt*"' },
    ],
  },

  reference_checker: {
    id: 'reference_checker',
    name: 'Reference Checker',
    hp: 40,
    gold: 32,
    icon: '🔍',
    moves: [
      { name: 'Background Scan', type: 'attack', damage: 8, icon: '🔍', quip: '"Interesting GitHub history..."' },
      { name: 'Inconsistency Found', type: 'attack', damage: 14, icon: '⚠️', quip: '"This date doesn\'t match."' },
      { name: 'Verify Credentials', type: 'debuff', applyToTarget: { weak: 2 }, icon: '📋', quip: '"Your \'degree\' from where now?"' },
      { name: 'Call References', type: 'attack', damage: 9, stressDamage: 3, icon: '📞', quip: '"Your old boss was... candid."' },
    ],
  },

  scheduling_nightmare: {
    id: 'scheduling_nightmare',
    name: 'Scheduling Nightmare',
    hp: 48,
    gold: 36,
    icon: '📅',
    moves: [
      { name: 'Reschedule', type: 'stress_attack', stressDamage: 6, icon: '📅', quip: '"Something came up. Next week?"' },
      { name: 'Double-Booked', type: 'attack', damage: 10, icon: '📆', quip: '"Oops, we have two of you."' },
      { name: 'Time Zone Chaos', type: 'attack', damage: 7, stressDamage: 4, icon: '🌐', quip: '"Was that PST or EST? Or IST?"' },
      { name: 'Calendar Tetris', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '🧩', quip: '"Only slot is 4 AM Thursday."' },
    ],
  },

  // ── Act 2 Elite Enemies (HP +20, damage bumps) ──

  senior_dev_interrogator: {
    id: 'senior_dev_interrogator',
    name: 'Senior Dev Interrogator',
    hp: 155,
    gold: 110,
    icon: '🧓',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"You call yourself a SENIOR?"' },
    ],
    moves: [
      // Phase 1: Interrogation (indices 0-3)
      { name: 'Explain Your Process', type: 'attack', damage: 14, stressDamage: 7, icon: '🔬', quip: '"Walk me through every decision."' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀', quip: '"I see you used var. In 2026."' },
      { name: 'Deep Dive', type: 'attack', damage: 20, icon: '🤿', quip: '"Let\'s go three levels deeper."' },
      { name: 'Years of Experience', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📅', quip: '"I\'ve been doing this since Perl."' },
      // Phase 2: Gloves off (indices 4-6)
      { name: '"I\'ve Seen Everything"', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📅', quip: '"I\'ve been doing this since before you were born."' },
      { name: 'Pop Quiz', type: 'attack', damage: 8, times: 2, icon: '❓', quip: '"What\'s the time complexity? NOW."' },
      { name: 'Code Review: FAILED', type: 'attack', damage: 22, stressDamage: 8, icon: '🧹', quip: '"This code is an embarrassment."' },
    ],
  },

  whiteboard_hydra: {
    id: 'whiteboard_hydra',
    name: 'The Whiteboard Hydra',
    hp: 148,
    gold: 100,
    icon: '🐉',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"For every answer, THREE more questions."' },
    ],
    moves: [
      // Phase 1: Standard whiteboard hell (indices 0-3)
      { name: 'Follow-Up Question', type: 'attack', damage: 9, icon: '❓', quip: '"But what about concurrency?"' },
      { name: 'Multi-Part Problem', type: 'attack', damage: 7, times: 2, icon: '📝', quip: '"Part A... and Part B."' },
      { name: 'Whiteboard Barrage', type: 'attack', damage: 12, stressDamage: 4, icon: '📊', quip: '"Now diagram the entire system."' },
      { name: 'Grow Heads', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🐲', quip: '"One more follow-up question..."' },
      // Phase 2: Hydra unleashed (indices 4-6)
      { name: 'Hydra Awakens', type: 'buff', applyToSelf: { confidence: 5 }, icon: '🐲', quip: '"The whiteboard is INFINITE."' },
      { name: 'Infinite Follow-Ups', type: 'attack', damage: 7, times: 4, icon: '❓', quip: '"Part C, D, E, F..."' },
      { name: 'Erase Everything', type: 'attack', damage: 22, stressDamage: 10, icon: '🧽', quip: '"Start over. From the BEGINNING."' },
    ],
  },

  hr_gatekeeper: {
    id: 'hr_gatekeeper',
    name: 'HR Gatekeeper',
    hp: 140,
    gold: 95,
    icon: '🚪',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 5 }, quip: '"COMPLIANCE MODE ACTIVATED."' },
    ],
    moves: [
      // Phase 1: Bureaucratic wall (indices 0-2)
      { name: 'Bureaucracy Wall', type: 'defend', block: 22, icon: '🧱', quip: '"Fill out form HR-7B first."' },
      { name: 'Red Tape', type: 'stress_attack', stressDamage: 8, icon: '📎', quip: '"That requires three approvals."' },
      { name: 'Policy Enforcement', type: 'attack_defend', damage: 10, block: 8, icon: '📋', quip: '"Per section 4, subsection C..."' },
      // Phase 2: Gatekeeper goes offensive (indices 3-5)
      { name: 'Policy Overhaul', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📋', quip: '"New policy: ZERO TOLERANCE."' },
      { name: 'Compliance Hammer', type: 'attack', damage: 22, icon: '🔨', quip: '"Non-compliant resources will be PURGED."' },
      { name: 'Access Permanently Denied', type: 'attack', damage: 28, stressDamage: 12, icon: '🚫', quip: '"Your badge has been DEACTIVATED."' },
    ],
  },

  the_algorithm: {
    id: 'the_algorithm',
    name: 'The Algorithm',
    hp: 168,
    gold: 120,
    icon: '🧮',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"ENTERING DEEP LEARNING MODE."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'Analyze Pattern', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📊', quip: '"Training on your weaknesses..."' },
      { name: 'Optimized Strike', type: 'attack', damage: 12, icon: '⚡', quip: '"Calculated. Precise. Devastating."' },
      { name: 'Recursive Loop', type: 'attack', damage: 8, times: 2, icon: '🔄', quip: '"while(true) { reject(); }"' },
      // Phase 2 (indices 3-4)
      { name: 'Machine Learning', type: 'attack_defend', damage: 11, block: 6, icon: '🤖', quip: '"I learned from 10M rejections."' },
      { name: 'Neural Overload', type: 'attack', damage: 30, stressDamage: 12, icon: '🧠', quip: '"Processing power: MAXIMUM."' },
    ],
  },

  crunch_time_manager: {
    id: 'crunch_time_manager',
    name: 'Crunch Time Manager',
    hp: 152,
    gold: 105,
    icon: '⏰',
    isElite: true,
    moves: [
      { name: 'Need This By EOD', type: 'attack', damage: 16, stressDamage: 10, icon: '⏰', quip: '"EOD means 5 PM my time zone."' },
      { name: 'Overtime Mandate', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📈', quip: '"We\'re all pulling extra hours!"' },
      { name: 'Weekend Work', type: 'attack', damage: 16, stressDamage: 7, icon: '📅', quip: '"Just a quick Saturday deploy."' },
      { name: 'Sprint Review', type: 'attack', damage: 15, icon: '🏃', quip: '"Why is this ticket still open?"' },
      { name: 'All-Hands Pressure', type: 'attack', damage: 34, stressDamage: 14, icon: '💥', quip: '"The board is watching."' },
    ],
  },

  // ── Act 2 Bosses (HP bumped, phases added) ──

  panel_interview_hydra: {
    id: 'panel_interview_hydra',
    name: 'Panel Interview Hydra',
    hp: 282,
    gold: 185,
    icon: '🐲',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3, resilience: 1 }, quip: '"The panel has reached a consensus."' },
      { hpPercent: 25, moveStartIndex: 6, onEnter: { confidence: 4 }, quip: '"The panel is UNANIMOUS."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'Technical Question', type: 'attack', damage: 10, icon: '🔧', quip: '"Explain polymorphism. In Latin."' },
      { name: 'Stress Question', type: 'stress_attack', stressDamage: 10, icon: '😰', quip: '"We all disagree. Convince us."' },
      { name: 'Panel Buff', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📈', quip: '"*whispering among themselves*"' },
      // Phase 2 (indices 3-5)
      { name: 'Cross-Examination', type: 'attack', damage: 14, stressDamage: 5, icon: '⚔️', quip: '"That contradicts what you said."' },
      { name: 'Group Deliberation', type: 'defend', block: 15, icon: '🤔', quip: '"We need to align internally."' },
      { name: 'Final Verdict', type: 'attack', damage: 26, stressDamage: 10, icon: '⚖️', quip: '"The panel has decided."' },
      // Phase 3: pure DPS race — buff folded into onEnter (indices 6-7)
      { name: 'Cross-Examination Barrage', type: 'attack', damage: 13, times: 3, icon: '⚔️', quip: '"Answer. Answer. ANSWER."' },
      { name: 'Unanimous Rejection', type: 'attack', damage: 38, stressDamage: 16, icon: '⚖️', quip: '"Motion to reject. ALL in favor."' },
    ],
  },

  live_coding_challenge: {
    id: 'live_coding_challenge',
    name: 'The Live Coding Challenge',
    hp: 265,
    gold: 175,
    icon: '⌨️',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 3 }, quip: '"Time is running out..."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { confidence: 4 }, quip: '"COMPILATION: FAILED."' },
    ],
    moves: [
      // Phase 1 (indices 0-3)
      { name: 'Timer Start', type: 'attack', damage: 8, icon: '⏱️', quip: '"You have 45 minutes. Go."' },
      { name: 'Syntax Error', type: 'attack', damage: 10, stressDamage: 4, icon: '🔴', quip: '"Missing semicolon on line 1."' },
      { name: 'Runtime Exception', type: 'attack', damage: 12, icon: '💥', quip: '"undefined is not a function."' },
      { name: 'Compiler Fury', type: 'buff', applyToSelf: { confidence: 4 }, icon: '🔥', quip: '"142 errors found."' },
      // Phase 2 (indices 4-6)
      { name: 'Stack Overflow', type: 'attack', damage: 14, stressDamage: 6, icon: '📚', quip: '"Maximum call stack exceeded."' },
      { name: 'Segfault', type: 'attack', damage: 18, icon: '💀', quip: '"Core dumped. So did your career."' },
      { name: 'TIME\'S UP!', type: 'attack', damage: 36, stressDamage: 16, icon: '⏰', quip: '"Pencils down. Step away."' },
      // Phase 3: pure DPS race — buff folded into onEnter (indices 7-8)
      { name: 'TIME\'S UP!', type: 'attack', damage: 36, stressDamage: 16, icon: '⏰', quip: '"You ran out of time. AGAIN."' },
      { name: 'FAILED', type: 'attack', damage: 42, stressDamage: 18, icon: '💀', quip: '"Interview status: TERMINATED."' },
    ],
  },

  vp_of_engineering: {
    id: 'vp_of_engineering',
    name: 'The VP of Engineering',
    hp: 305,
    gold: 195,
    icon: '👔',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"Now the real interview begins."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { confidence: 5 }, quip: '"You\'re DONE here."' },
    ],
    moves: [
      // Phase 1: "casual chat" (indices 0-3)
      { name: 'Let\'s Chat Casually', type: 'debuff', applyToTarget: { weak: 2 }, icon: '☕', quip: '"This isn\'t an interview. Relax."' },
      { name: 'Culture Assessment', type: 'stress_attack', stressDamage: 8, icon: '🏢', quip: '"How do you handle ambiguity?"' },
      { name: 'Subtle Probe', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🔍', quip: '"Interesting... very interesting."' },
      { name: 'Strategic Vision', type: 'attack', damage: 10, icon: '🎯', quip: '"What\'s your 5-year roadmap?"' },
      // Phase 2: "technical deep-dive" (indices 4-7)
      { name: 'Technical Deep-Dive', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤿', quip: '"Gloves off."' },
      { name: 'Architecture Review', type: 'attack', damage: 20, icon: '🏗️', quip: '"This doesn\'t scale."' },
      { name: 'Scale Question', type: 'attack', damage: 14, stressDamage: 6, icon: '📊', quip: '"What if we have a billion users?"' },
      { name: 'Executive Decision', type: 'attack', damage: 38, stressDamage: 14, icon: '⚡', quip: '"I\'ve seen enough."' },
      // Phase 3: final stand (indices 8-9)
      { name: 'You\'re Fired', type: 'buff', applyToSelf: { confidence: 5 }, icon: '🔥', quip: '"Pack your things."' },
      { name: 'Severance Denied', type: 'attack', damage: 44, stressDamage: 18, icon: '☠️', quip: '"And you owe US money."' },
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
  ['panel_interview_hydra'],
  ['live_coding_challenge'],
  ['vp_of_engineering'],
];
