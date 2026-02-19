import type { EnemyDef } from '../../types';

// ════════════════════════════════════════════════
// ACT 3 — Corporate Final Round
// ════════════════════════════════════════════════

export const act3Enemies: Record<string, EnemyDef> = {

  // ── Act 3 Common Enemies (HP +15-20, massive damage bumps) ──

  system_design_titan: {
    id: 'system_design_titan',
    name: 'System Design Titan',
    hp: 70,
    gold: 62,
    icon: '🏛️',
    moves: [
      { name: 'Let\'s Talk Scalability', type: 'attack_defend', damage: 10, block: 8, icon: '📐', quip: '"Draw the architecture. All of it."' },
      { name: 'Load Balancer', type: 'defend', block: 14, icon: '⚖️', quip: '"Distributing incoming damage..."' },
      { name: 'Distributed Slam', type: 'attack', damage: 15, icon: '🌐', quip: '"Across 47 microservices!"' },
      { name: 'Microservice Barrage', type: 'attack', damage: 9, times: 2, icon: '🔧', quip: '"Each one a separate repo."' },
    ],
  },

  salary_negotiator: {
    id: 'salary_negotiator',
    name: 'Salary Negotiator',
    hp: 60,
    gold: 62,
    icon: '💼',
    moves: [
      { name: 'Lowball Offer', type: 'gold_steal', goldSteal: 18, icon: '💸', quip: '"Best we can do. Economy, y\'know."' },
      { name: 'Market Rate Denial', type: 'attack', damage: 12, stressDamage: 5, icon: '📉', quip: '"Our internal bands are different."' },
      { name: 'Benefits Package', type: 'gold_steal', goldSteal: 12, stressDamage: 3, icon: '📦', quip: '"Free snacks count as comp, right?"' },
      { name: 'Final Offer', type: 'attack', damage: 17, icon: '🤝', quip: '"Take it or we move on."' },
    ],
  },

  imposter_syndrome_common: {
    id: 'imposter_syndrome_common',
    name: 'Imposter Syndrome',
    hp: 55,
    gold: 48,
    icon: '🎭',
    moves: [
      { name: 'You Don\'t Belong', type: 'stress_attack', stressDamage: 10, icon: '😰', quip: '"They\'ll realize any day now."' },
      { name: 'Self Doubt', type: 'debuff', applyToTarget: { weak: 2 }, icon: '😟', quip: '"You just got lucky so far."' },
      { name: 'Anxiety Spike', type: 'stress_attack', stressDamage: 12, icon: '😱', quip: '"Everyone else is smarter."' },
      { name: 'Spiral', type: 'attack', damage: 10, stressDamage: 6, icon: '🌀', quip: '"Google your own name lately?"' },
    ],
  },

  benefits_mimic: {
    id: 'benefits_mimic',
    name: 'Benefits Mimic',
    hp: 65,
    gold: 56,
    icon: '📦',
    moves: [
      { name: 'Looks Great!', type: 'defend', block: 5, icon: '✨', quip: '"Unlimited PTO! (Don\'t use it.)"' },
      { name: 'SURPRISE!', type: 'attack', damage: 22, stressDamage: 6, icon: '💥', quip: '"$5000 deductible! Gotcha!"' },
      { name: 'Fine Print', type: 'attack', damage: 12, icon: '📜', quip: '"Dental is extra. Way extra."' },
      { name: 'Reset Trap', type: 'defend', block: 5, icon: '📦', quip: '"Vision starts after 12 months."' },
    ],
  },

  equity_phantom: {
    id: 'equity_phantom',
    name: 'Equity Phantom',
    hp: 68,
    gold: 45,
    icon: '💎',
    moves: [
      { name: 'Vesting Cliff', type: 'exhaust', exhaustCount: 2, stressDamage: 6, icon: '📅', quip: '"Only 3 more years to go!"' },
      { name: 'Paper Money', type: 'attack', damage: 11, icon: '📄', quip: '"Worth millions! On paper."' },
      { name: 'Dilution', type: 'debuff', applyToTarget: { confidence: -1 }, icon: '💧', quip: '"New funding round! Your share: 0.0001%"' },
      { name: 'Golden Cage', type: 'exhaust', exhaustCount: 1, icon: '🔒', quip: '"Leave now and lose it all."' },
    ],
  },

  non_compete_clause: {
    id: 'non_compete_clause',
    name: 'Non-Compete Clause',
    hp: 63,
    gold: 54,
    icon: '📜',
    moves: [
      { name: 'Legal Binding', type: 'exhaust', exhaustCount: 2, icon: '⚖️', quip: '"You signed page 47. Remember?"' },
      { name: 'Cease & Desist', type: 'attack', damage: 13, icon: '🚫', quip: '"Our lawyers will be in touch."' },
      { name: 'Restriction', type: 'debuff', applyToTarget: { weak: 2, resilience: -1 }, icon: '🔗', quip: '"No working in tech for 2 years."' },
      { name: 'Court Order', type: 'attack', damage: 17, stressDamage: 5, icon: '⚖️', quip: '"See you in court. We have 40 lawyers."' },
    ],
  },

  the_pivot: {
    id: 'the_pivot',
    name: 'The Pivot',
    hp: 57,
    gold: 50,
    icon: '🔄',
    moves: [
      { name: 'Pivoting to AI', type: 'attack', damage: 14, icon: '🤖', quip: '"We\'re an AI company now."' },
      { name: 'Pivoting to Blockchain', type: 'buff', applyToSelf: { confidence: 2 }, icon: '⛓️', quip: '"Web3 is definitely still a thing."' },
      { name: 'Pivoting to Cloud', type: 'attack_defend', damage: 10, block: 10, icon: '☁️', quip: '"Everything is serverless now."' },
      { name: 'Pivoting to... Pivot', type: 'stress_attack', stressDamage: 8, icon: '🔄', quip: '"Our core business is pivoting."' },
    ],
  },

  burnout_ember: {
    id: 'burnout_ember',
    name: 'Burnout Ember',
    hp: 70,
    gold: 48,
    icon: '🔥',
    moves: [
      { name: 'Smolder', type: 'debuff', applyToTarget: { poison: 6 }, icon: '🔥', quip: '"You love what you do, right?"' },
      { name: 'Flare Up', type: 'attack', damage: 10, stressDamage: 5, icon: '💥', quip: '"Sunday scaries are normal."' },
      { name: 'Slow Burn', type: 'stress_attack', stressDamage: 10, icon: '🕯️', quip: '"It\'s just a phase. For 3 years."' },
      { name: 'Ember Spread', type: 'debuff', applyToTarget: { poison: 5, vulnerable: 1 }, icon: '🌋', quip: '"Your passion is your problem."' },
    ],
  },

  meeting_email: {
    id: 'meeting_email',
    name: 'Meeting Email',
    hp: 67,
    gold: 58,
    icon: '📧',
    moves: [
      { name: 'Let\'s Circle Back', type: 'attack', damage: 12, icon: '🔄', quip: '"Per my last email..."' },
      { name: 'Agenda Overload', type: 'exhaust', exhaustCount: 1, stressDamage: 4, icon: '📋', quip: '"42-item agenda for a 30-min call."' },
      { name: 'Reply All Storm', type: 'attack', damage: 10, times: 2, icon: '📧', quip: '"Please remove me from this thread."' },
      { name: 'Action Items', type: 'attack', damage: 16, icon: '✅', quip: '"You own all 17 action items."' },
    ],
  },

  the_counteroffer: {
    id: 'the_counteroffer',
    name: 'The Counteroffer',
    hp: 88,
    gold: 52,
    icon: '🤝',
    moves: [
      { name: 'Match Their Offer', type: 'heal_allies', healAmount: 18, icon: '💊', quip: '"We can match... mostly."' },
      { name: 'Retention Bonus', type: 'attack', damage: 12, icon: '💰', quip: '"One-time payment. Non-negotiable."' },
      { name: 'We Value You', type: 'heal_allies', healAmount: 14, icon: '❤️', quip: '"You\'re like family! (See Act 2.)"' },
      { name: 'Guilt Trip', type: 'attack', damage: 11, stressDamage: 5, icon: '😢', quip: '"After everything we\'ve done?"' },
    ],
  },

  background_check: {
    id: 'background_check',
    name: 'Background Check',
    hp: 59,
    gold: 52,
    icon: '🔎',
    moves: [
      { name: 'Deep Search', type: 'attack', damage: 12, icon: '🔎', quip: '"Found your MySpace page."' },
      { name: 'Found Something', type: 'attack', damage: 17, icon: '⚠️', quip: '"Care to explain this tweet?"' },
      { name: 'Verify Employment', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"That gap year looks suspicious."' },
      { name: 'Criminal Record Scan', type: 'attack', damage: 13, stressDamage: 5, icon: '🔍', quip: '"One parking ticket in 2019..."' },
    ],
  },

  relocation_package: {
    id: 'relocation_package',
    name: 'Relocation Package',
    hp: 65,
    gold: 60,
    icon: '🚚',
    moves: [
      { name: 'Palo Alto or Bust', type: 'attack', damage: 14, stressDamage: 6, icon: '🏠', quip: '"1BR for $4,500/month. Steal!"' },
      { name: 'Moving Costs', type: 'gold_steal', goldSteal: 15, icon: '💸', quip: '"We cover $500. Movers cost $8K."' },
      { name: 'Culture Shock', type: 'stress_attack', stressDamage: 10, icon: '😵', quip: '"Hope you like kombucha on tap."' },
      { name: 'Housing Crisis', type: 'attack', damage: 18, icon: '🏠', quip: '"Your commute is only 2 hours!"' },
    ],
  },

  // ── Act 3 Elite Enemies (HP +30, damage bumps — mini-bosses) ──

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
      // Phase 1: Board politics (indices 0-2)
      { name: 'Executive Order', type: 'attack', damage: 20, icon: '📜', quip: '"This came from the top."' },
      { name: 'Quarterly Review', type: 'attack_defend', damage: 12, block: 14, icon: '📊', quip: '"Numbers are down. Your fault."' },
      { name: 'Shareholder Pressure', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📈', quip: '"The shareholders demand growth!"' },
      // Phase 2: Hostile board (indices 3-5)
      { name: 'Emergency Board Meeting', type: 'buff', applyToSelf: { confidence: 4 }, icon: '🔥', quip: '"This is a CRISIS."' },
      { name: 'Board Decision', type: 'attack', damage: 30, stressDamage: 12, icon: '⚡', quip: '"The board has spoken."' },
      { name: 'Hostile Acquisition', type: 'attack', damage: 16, times: 2, stressDamage: 10, icon: '☠️', quip: '"We\'re taking EVERYTHING."' },
    ],
  },

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
      // Phase 1: Resource drain (indices 0-2)
      { name: 'Vest Schedule', type: 'exhaust', exhaustCount: 3, stressDamage: 8, icon: '📅', quip: '"Your cliff is in 11 months."' },
      { name: 'Retention Hit', type: 'attack', damage: 15, icon: '⛓️', quip: '"You can\'t afford to leave."' },
      { name: 'Stock Lock', type: 'exhaust', exhaustCount: 2, icon: '🔒', quip: '"90-day exercise window. Good luck."' },
      // Phase 2: Golden fury (indices 3-5)
      { name: 'Unvested Fury', type: 'buff', applyToSelf: { confidence: 4 }, icon: '💎', quip: '"Your equity is WORTHLESS."' },
      { name: 'Golden Slam', type: 'attack', damage: 28, stressDamage: 10, icon: '💰', quip: '"Trapped by your own success!"' },
      { name: 'Market Crash', type: 'attack', damage: 14, times: 2, icon: '📉', quip: '"Portfolio value: ZERO."' },
    ],
  },

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
      // Phase 1: Corporate chaos (indices 0-2)
      { name: 'Shuffle Teams', type: 'discard', discardCount: 4, icon: '🔀', quip: '"Your team no longer exists. Draw 4 fewer cards next turn."' },
      { name: 'New Manager', type: 'attack', damage: 14, stressDamage: 5, icon: '👤', quip: '"Meet your 4th manager this year."' },
      { name: 'Restructure', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '🌀', quip: '"Your role has been \'realigned.\'"' },
      // Phase 2: Scorched earth (indices 3-5)
      { name: 'Scorched Earth', type: 'buff', applyToSelf: { confidence: 4 }, icon: '🔥', quip: '"Burn the org chart."' },
      { name: 'Mass Layoff', type: 'attack', damage: 28, icon: '🌊', quip: '"Efficiency optimization complete."' },
      { name: 'Reorg Slam', type: 'attack', damage: 14, times: 2, stressDamage: 10, icon: '💥', quip: '"Your role has been ELIMINATED."' },
    ],
  },

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
      // Phase 1 (indices 0-1)
      { name: 'Legacy Code', type: 'attack', damage: 10, icon: '📟', quip: '"This was written in jQuery. In 2024."' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { confidence: 4 }, icon: '📈', quip: '"TODO: fix later (2019)"' },
      // Phase 2 (indices 2-3)
      { name: 'Spaghetti Strike', type: 'attack', damage: 20, icon: '🍝', quip: '"One file. 14,000 lines."' },
      { name: 'Technical Bankruptcy', type: 'attack', damage: 30, stressDamage: 10, icon: '💥', quip: '"No tests. No docs. No hope."' },
    ],
  },

  the_pip: {
    id: 'the_pip',
    name: 'The PIP',
    hp: 128,
    gold: 120,
    icon: '📉',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"Your 30 days are UP."' },
    ],
    moves: [
      // Phase 1: Performance warning (indices 0-2)
      { name: 'Performance Review', type: 'debuff', applyToTarget: { confidence: -1, resilience: -1 }, icon: '📉', quip: '"Meets expectations. Barely."' },
      { name: 'Improvement Plan', type: 'stress_attack', stressDamage: 14, icon: '📋', quip: '"You have 30 days."' },
      { name: 'Final Warning', type: 'attack', damage: 20, stressDamage: 8, icon: '⚠️', quip: '"This is your last chance."' },
      // Phase 2: Termination mode (indices 3-5)
      { name: 'Clock Is Ticking', type: 'buff', applyToSelf: { confidence: 3 }, icon: '⏰', quip: '"Tick. Tock."' },
      { name: 'Last Chance', type: 'attack', damage: 28, icon: '⚠️', quip: '"This is it."' },
      { name: 'Terminated', type: 'attack', damage: 26, stressDamage: 14, icon: '🚪', quip: '"Security will escort you out."' },
    ],
  },

  // ── Act 3 Bosses (HP bumped, 3 phases each) ──

  offer_committee: {
    id: 'offer_committee',
    name: 'Offer Committee',
    hp: 264,
    gold: 240,
    icon: '👥',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"The committee is getting serious."' },
      { hpPercent: 30, moveStartIndex: 5, onEnter: { confidence: 2 }, quip: '"FINAL DELIBERATION."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'Committee Review', type: 'attack', damage: 12, icon: '📋', quip: '"We\'ve reviewed your... everything."' },
      { name: 'Stress Interview', type: 'stress_attack', stressDamage: 12, icon: '😰', quip: '"Sell me this pen. Now this desk."' },
      { name: 'Deliberation', type: 'defend', block: 20, icon: '🤔', quip: '"We need to discuss amongst ourselves."' },
      // Phase 2 (indices 3-4)
      { name: 'Budget Discussion', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '💰', quip: '"Headcount is frozen. Mostly."' },
      { name: 'Counter-Counter Offer', type: 'attack', damage: 20, stressDamage: 8, icon: '⚖️', quip: '"We counter your counter. Again."' },
      // Phase 3: pure DPS race — buff folded into onEnter (indices 5-7)
      { name: 'Counter-Counter Offer', type: 'attack', damage: 19, stressDamage: 8, icon: '⚖️', quip: '"Counter. Counter. COUNTER."' },
      { name: 'Committee Slam', type: 'attack', damage: 35, icon: '💥', quip: '"Motion to reject. All in favor?"' },
      { name: 'Offer Rescinded', type: 'attack', damage: 30, stressDamage: 11, icon: '📄', quip: '"The offer has been WITHDRAWN."' },
    ],
  },

  the_ceo: {
    id: 'the_ceo',
    name: 'The CEO',
    hp: 250,
    gold: 230,
    icon: '🏆',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"Enough pleasantries."' },
      { hpPercent: 30, moveStartIndex: 5, onEnter: { confidence: 5 }, quip: '"I AM the company."' },
    ],
    moves: [
      // Phase 1: "Vision" (indices 0-2)
      { name: 'Visionary Speech', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🎤', quip: '"We\'re changing the world."' },
      { name: 'Inspire Fear', type: 'stress_attack', stressDamage: 10, icon: '😨', quip: '"Layoffs? What layoffs?"' },
      { name: 'Corporate Strategy', type: 'attack_defend', damage: 12, block: 10, icon: '📊', quip: '"It\'s a paradigm shift."' },
      // Phase 2: "Execution" (indices 3-4)
      { name: 'Execute!', type: 'attack', damage: 18, icon: '⚡', quip: '"Ship it or I ship you out."' },
      { name: 'Disruption', type: 'attack', damage: 20, stressDamage: 10, icon: '💥', quip: '"We disrupted the disruptors."' },
      // Phase 3: "Hostile" — reordered for attacks-last cycling (indices 5-8)
      { name: 'Disruption', type: 'attack', damage: 16, stressDamage: 8, icon: '💥', quip: '"Disrupt EVERYTHING."' },
      { name: 'Golden Parachute', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🪂', quip: '"I have a $50M exit package."' },
      { name: 'Move Fast Break Things', type: 'attack', damage: 24, icon: '🔥', quip: '"Including your career!"' },
      { name: 'Hostile Takeover', type: 'attack', damage: 35, stressDamage: 14, icon: '☠️', quip: '"Bow before the brand."' },
    ],
  },

  imposter_syndrome_final: {
    id: 'imposter_syndrome_final',
    name: 'Imposter Syndrome (Final Form)',
    hp: 222,
    gold: 220,
    icon: '🎭',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"The doubt is spreading..."' },
      { hpPercent: 25, moveStartIndex: 5, onEnter: { confidence: 5 }, quip: '"COMPLETE MELTDOWN IMMINENT."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'You\'re A Fraud', type: 'debuff', applyToTarget: { confidence: -2 }, icon: '🎭', quip: '"You don\'t deserve this offer."' },
      { name: 'Everyone Knows', type: 'stress_attack', stressDamage: 15, icon: '👁️', quip: '"They\'re all whispering about you."' },
      { name: 'Spiral of Doubt', type: 'stress_attack', stressDamage: 12, icon: '🌀', quip: '"Was any of it real?"' },
      // Phase 2 (indices 3-4)
      { name: 'They\'ll Find Out', type: 'attack', damage: 16, stressDamage: 12, icon: '😱', quip: '"Day one. They\'ll know."' },
      { name: 'Crushing Anxiety', type: 'stress_attack', stressDamage: 18, icon: '💀', quip: '"You can\'t even breathe right."' },
      // Phase 3 (indices 5-7)
      { name: 'Identity Crisis', type: 'debuff', applyToTarget: { weak: 3, vulnerable: 3, confidence: -3 }, icon: '🪞', quip: '"Who even are you anymore?"' },
      { name: 'Complete Meltdown', type: 'attack', damage: 25, stressDamage: 27, icon: '🔥', quip: '"EVERYTHING IS FALLING APART."' },
      { name: 'You Never Belonged', type: 'attack', damage: 22, stressDamage: 14, icon: '🎭', quip: '"They\'re going to REVOKE your degree."' },
    ],
  },
};

// ── Act 3 Encounter Tables ──

export const act3Solos: string[][] = [
  ['system_design_titan'],
  ['salary_negotiator'],
  ['imposter_syndrome_common'],
  ['benefits_mimic'],
  ['equity_phantom'],
  ['non_compete_clause'],
  ['the_pivot'],
  ['burnout_ember'],
  ['meeting_email'],
  ['the_counteroffer'],
  ['background_check'],
  ['relocation_package'],
];

export const act3Duos: string[][] = [
  ['the_counteroffer', 'salary_negotiator'],              // Heal + gold drain (must kill healer)
  ['imposter_syndrome_common', 'burnout_ember'],          // Stress bomb + poison
  ['non_compete_clause', 'equity_phantom'],               // Deck destruction (3 exhaust/cycle)
  ['system_design_titan', 'the_pivot'],                   // Tank + escalator (Pivot stacks str)
  ['meeting_email', 'background_check'],                  // Exhaust + burst damage
  ['benefits_mimic', 'relocation_package'],               // Surprise burst + gold drain
  ['burnout_ember', 'burnout_ember'],                     // Poison swarm (6-8 poison/cycle)
  ['the_pivot', 'burnout_ember'],                         // Confidence scaling + DoT
];

export const act3Trios: string[][] = [
  ['imposter_syndrome_common', 'burnout_ember', 'equity_phantom'],                // Stress + poison + exhaust
  ['system_design_titan', 'the_pivot', 'the_counteroffer'],                       // Tank + scale + heal
  ['salary_negotiator', 'relocation_package', 'benefits_mimic'],                  // Economic siege
  ['non_compete_clause', 'background_check', 'meeting_email'],                    // Deck annihilation (4 exhaust/cycle)
];

export const act3ElitePool: string[][] = [
  ['board_member'],
  ['golden_handcuffs'],
  ['the_reorg'],
  ['technical_debt_golem'],
  ['the_pip'],
];

export const act3BossPool: string[][] = [
  ['offer_committee'],
  ['the_ceo'],
  ['imposter_syndrome_final'],
];
