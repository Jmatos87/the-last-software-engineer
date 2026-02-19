import type { EnemyDef } from '../../types';

// ════════════════════════════════════════════════
// ACT 3 — Corporate Final Round
// ════════════════════════════════════════════════

export const act3Enemies: Record<string, EnemyDef> = {

  // ── Act 3 Common Enemies ──

  // RITUALIST — Load Balancer buffs defense; Distributed Slam is the payoff
  system_design_titan: {
    id: 'system_design_titan',
    name: 'System Design Titan',
    hp: 70,
    gold: 62,
    icon: '🏛️',
    moves: [
      { name: "Let's Talk Scalability", type: 'attack_defend', damage: 12, block: 10, icon: '📐', quip: '"Draw the architecture. All of it."' },
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
      { name: "You Don't Belong", type: 'stress_attack', stressDamage: 12, icon: '😰', quip: '"They\'ll realize any day now."' },
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
      { name: "Let's Circle Back", type: 'attack', damage: 14, icon: '🔄', quip: '"Per my last email..."' },
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
      { name: 'Shuffle Teams', type: 'summon', summonId: 'chaos_agent', summonCount: 2, icon: '🔀', quip: '"Your team no longer exists."' },
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
      { name: 'Counter-Counter Offer', type: 'attack', damage: 30, stressDamage: 12, icon: '⚖️', quip: '"Counter. Counter. COUNTER."' },
      { name: 'Committee Slam', type: 'attack', damage: 48, icon: '💥', quip: '"Motion to reject. All in favor?"' },
      { name: 'Offer Rescinded', type: 'attack', damage: 42, stressDamage: 16, icon: '📄', quip: '"The offer has been WITHDRAWN."' },
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
      { name: 'Disruption', type: 'attack', damage: 28, stressDamage: 12, icon: '💥', quip: '"Disrupt EVERYTHING."' },
      { name: 'Golden Parachute', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🪂', quip: '"I have a $50M exit package."' },
      { name: 'Move Fast Break Things', type: 'attack', damage: 40, icon: '🔥', quip: '"Including your career!"' },
      { name: 'Hostile Takeover', type: 'attack', damage: 52, stressDamage: 20, icon: '☠️', quip: '"Bow before the brand."' },
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
      { name: 'Complete Meltdown', type: 'attack', damage: 38, stressDamage: 30, icon: '🔥', quip: '"EVERYTHING IS FALLING APART."' },
      { name: 'You Never Belonged', type: 'attack', damage: 35, stressDamage: 20, icon: '🎭', quip: '"They\'re going to REVOKE your degree."' },
    ],
  },

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
