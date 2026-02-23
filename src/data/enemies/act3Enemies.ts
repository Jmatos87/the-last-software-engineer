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
    hp: 180,
    gold: 62,
    icon: '🏛️',
    moves: [
      { name: "Let's Talk Scalability", type: 'attack_defend', damage: 12, block: 10, icon: '📐', quip: '"Behold my architecture, mortal. Kneel before it."' },
      { name: 'Load Balancer', type: 'buff', applyToSelf: { confidence: 3, resilience: 1 }, icon: '⚖️', quip: '"I distribute my wrath across all realms."' },
      { name: 'Distributed Slam', type: 'attack', damage: 22, icon: '🌐', quip: '"Forty-seven shards of ruin descend upon you!"' },
      { name: 'Microservice Barrage', type: 'attack', damage: 11, times: 2, icon: '🔧', quip: '"Each repo a separate cursed tomb."' },
    ],
  },

  // WILDCARD — hideIntent; gold drain then Final Offer big surprise hit
  salary_negotiator: {
    id: 'salary_negotiator',
    name: 'Salary Negotiator',
    hp: 155,
    gold: 62,
    icon: '💼',
    moves: [
      { name: 'Lowball Offer', type: 'gold_steal', goldSteal: 20, icon: '💸', quip: '"The treasury offers scraps. Be grateful, worm."' },
      { name: 'Market Rate Denial', type: 'attack', damage: 14, stressDamage: 6, icon: '📉', quip: '"Our kingdom\'s gold bands differ from yours."' },
      { name: 'Benefits Package', type: 'gold_steal', goldSteal: 14, stressDamage: 4, icon: '📦', quip: '"Stale bread counts as compensation here."' },
      { name: 'Final Offer', type: 'attack', damage: 24, icon: '🤝', quip: '"Accept or perish. There is no third path."' },
    ],
  },

  // WAKE-UP — You Don't Belong is the passive opener; Spiral is the activated peak
  imposter_syndrome_common: {
    id: 'imposter_syndrome_common',
    name: 'Imposter Syndrome',
    hp: 155,
    gold: 48,
    icon: '🎭',
    moves: [
      { name: "You Don't Belong", type: 'stress_attack', stressDamage: 12, icon: '😰', quip: '"The ancient ward senses a fraud in these halls."' },
      { name: 'Self Doubt', type: 'debuff', applyToTarget: { weak: 2 }, icon: '😟', quip: '"Luck carried you here. Skill did not."' },
      { name: 'Anxiety Spike', type: 'stress_attack', stressDamage: 15, icon: '😱', quip: '"Every soul in this dungeon outranks you."' },
      { name: 'Spiral', type: 'attack', damage: 14, stressDamage: 8, applyToTarget: { vulnerable: 2 }, icon: '🌀', quip: '"Scry your own name. See the nothing within."' },
    ],
  },

  // WILDCARD — hideIntent; SURPRISE is the peak disguised behind Looks Great! defends
  benefits_mimic: {
    id: 'benefits_mimic',
    name: 'Benefits Mimic',
    hp: 165,
    gold: 56,
    icon: '📦',
    hideIntent: true,
    moves: [
      { name: 'Looks Great!', type: 'defend', block: 8, icon: '✨', quip: '"Unlimited rest days! (The dead rest forever.)"' },
      { name: 'SURPRISE!', type: 'attack', damage: 28, stressDamage: 8, icon: '💥', quip: '"The chest was a mimic all along, fool!"' },
      { name: 'Fine Print', type: 'attack', damage: 16, icon: '📜', quip: '"The scroll\'s true curse lies in clause seven."' },
      { name: 'Reset Trap', type: 'defend', block: 8, icon: '📦', quip: '"Healing potions unlock after twelve moons."' },
    ],
  },

  // ESCALATOR — exhaust + Dilution (-confidence) compounds; gains confidence via buff
  equity_phantom: {
    id: 'equity_phantom',
    name: 'Equity Phantom',
    hp: 170,
    gold: 45,
    icon: '💎',
    moves: [
      { name: 'Vesting Cliff', type: 'exhaust', exhaustCount: 2, stressDamage: 7, icon: '📅', quip: '"Three more winters until the seal breaks."' },
      { name: 'Paper Money', type: 'attack', damage: 15, icon: '📄', quip: '"Phantom gold! Worth millions in the spirit realm."' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📈', quip: '"I hoard power like a dragon hoards coin."' },
      { name: 'Golden Cage', type: 'attack', damage: 22, applyToTarget: { confidence: -1 }, icon: '🔒', quip: '"Flee now and your soul-bond shatters."' },
    ],
  },

  // COMPOUND — Legal Binding exhausts + Restriction debuffs compound; Court Order scales
  non_compete_clause: {
    id: 'non_compete_clause',
    name: 'Non-Compete Clause',
    hp: 160,
    gold: 54,
    icon: '📜',
    moves: [
      { name: 'Legal Binding', type: 'exhaust', exhaustCount: 2, icon: '⚖️', quip: '"You signed the blood pact on page forty-seven."' },
      { name: 'Cease & Desist', type: 'attack', damage: 16, icon: '🚫', quip: '"My legion of barristers hungers for you."' },
      { name: 'Restriction', type: 'debuff', applyToTarget: { weak: 2, resilience: -1 }, icon: '🔗', quip: '"No questing in any realm for two cycles."' },
      { name: 'Court Order', type: 'attack', damage: 24, stressDamage: 7, icon: '⚖️', quip: '"The tribunal has forty sworn paladins. You have none."' },
    ],
  },

  // RITUALIST — Pivoting to Blockchain buffs; pivot cycle; Pivoting to Cloud is the payoff
  the_pivot: {
    id: 'the_pivot',
    name: 'The Pivot',
    hp: 155,
    gold: 50,
    icon: '🔄',
    moves: [
      { name: 'Pivoting to AI', type: 'attack', damage: 16, icon: '🤖', quip: '"We serve the golem lords now."' },
      { name: 'Pivoting to Blockchain', type: 'buff', applyToSelf: { confidence: 3 }, icon: '⛓️', quip: '"The chain-rune prophecy lives yet!"' },
      { name: 'Pivoting to Cloud', type: 'attack_defend', damage: 14, block: 12, icon: '☁️', quip: '"All spells are serverless incantations now."' },
      { name: 'Pivoting to... Pivot', type: 'attack', damage: 20, stressDamage: 8, icon: '🔄', quip: '"Our true power is shapeshifting. Always."' },
    ],
  },

  // COMPOUND — Smolder applies poison; Ember Spread re-applies; compounds to lethal DoT
  burnout_ember: {
    id: 'burnout_ember',
    name: 'Burnout Ember',
    hp: 175,
    gold: 48,
    icon: '🔥',
    moves: [
      { name: 'Smolder', type: 'debuff', applyToTarget: { poison: 4 }, icon: '🔥', quip: '"Your passion is kindling. I am the flame."' },
      { name: 'Flare Up', type: 'attack', damage: 13, stressDamage: 6, icon: '💥', quip: '"Sunday dread is merely my ember stirring."' },
      { name: 'Slow Burn', type: 'stress_attack', stressDamage: 12, icon: '🕯️', quip: '"Three years the fire smolders. Then ash."' },
      { name: 'Ember Spread', type: 'debuff', applyToTarget: { poison: 5, vulnerable: 2 }, icon: '🌋', quip: '"Your devotion feeds my inferno, fool."' },
    ],
  },

  // ESCALATOR — Reply All Storm × 2 gains confidence each cycle; Action Items is the scaler
  meeting_email: {
    id: 'meeting_email',
    name: 'Meeting Email',
    hp: 165,
    gold: 58,
    icon: '📧',
    moves: [
      { name: "Let's Circle Back", type: 'attack', damage: 14, icon: '🔄', quip: '"Per my last sending spell, adventurer..."' },
      { name: 'Agenda Overload', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📋', quip: '"Forty-two runes on the war council scroll."' },
      { name: 'Reply All Storm', type: 'attack', damage: 12, times: 2, icon: '📧', quip: '"Remove me from this cursed message chain!"' },
      { name: 'Action Items', type: 'attack', damage: 24, stressDamage: 7, icon: '✅', quip: '"Seventeen quest markers. All yours, hero."' },
    ],
  },

  // WAKE-UP — Match Their Offer (heal) is passive; activates with Retention Bonus+Guilt Trip
  the_counteroffer: {
    id: 'the_counteroffer',
    name: 'The Counteroffer',
    hp: 195,
    gold: 52,
    icon: '🤝',
    moves: [
      { name: 'Match Their Offer', type: 'heal_allies', healAmount: 20, icon: '💊', quip: '"We can match their bounty... mostly."' },
      { name: 'Retention Bonus', type: 'attack', damage: 15, icon: '💰', quip: '"One chest of gold. Non-negotiable, wretch."' },
      { name: 'We Value You', type: 'heal_allies', healAmount: 16, icon: '❤️', quip: '"You are clan! We devour clan last."' },
      { name: 'Guilt Trip', type: 'attack', damage: 19, stressDamage: 7, icon: '😢', quip: '"After every blessing we bestowed upon you?"' },
    ],
  },

  // COMPOUND — Verify Employment debuffs compound; Found Something lands hard
  background_check: {
    id: 'background_check',
    name: 'Background Check',
    hp: 155,
    gold: 52,
    icon: '🔎',
    moves: [
      { name: 'Deep Search', type: 'debuff', applyToTarget: { vulnerable: 1, weak: 1 }, icon: '🔎', quip: '"My scrying orb found your old guild page."' },
      { name: 'Found Something', type: 'attack', damage: 22, icon: '⚠️', quip: '"Care to explain this rune you inscribed?"' },
      { name: 'Verify Employment', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"That gap year in the Underdark looks suspicious."' },
      { name: 'Criminal Record Scan', type: 'attack', damage: 20, stressDamage: 7, icon: '🔍', quip: '"One tavern brawl in the year of the dragon..."' },
    ],
  },

  // RITUALIST — Palo Alto or Bust is stress buildup; Housing Crisis is the payoff hit
  relocation_package: {
    id: 'relocation_package',
    name: 'Relocation Package',
    hp: 165,
    gold: 60,
    icon: '🚚',
    moves: [
      { name: 'Palo Alto or Bust', type: 'attack', damage: 16, stressDamage: 8, icon: '🏠', quip: '"A hovel in the capital. Only 4,500 gold a moon!"' },
      { name: 'Moving Costs', type: 'gold_steal', goldSteal: 18, icon: '💸', quip: '"We cover a single mule. The caravan costs 8,000."' },
      { name: 'Culture Shock', type: 'buff', applyToSelf: { confidence: 3 }, icon: '😵', quip: '"Hope you enjoy enchanted kombucha on tap."' },
      { name: 'Housing Crisis', type: 'attack', damage: 26, stressDamage: 8, icon: '🏠', quip: '"Your pilgrimage to the office: only two hours!"' },
    ],
  },

  // ── Act 3 Elite Enemies ──

  // JUGGERNAUT — Shareholder Pressure builds massive armor+confidence; Board Decision erupts
  board_member: {
    id: 'board_member',
    name: 'Board Member',
    hp: 380,
    gold: 150,
    icon: '🎩',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 5 }, quip: '"The council of elders demands TRIBUTE. Now."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Executive Order', type: 'attack', damage: 22, icon: '📜', quip: '"This decree fell from the throne itself."' },
      { name: 'Quarterly Review', type: 'attack_defend', damage: 14, block: 16, icon: '📊', quip: '"The harvest numbers falter. You are to blame."' },
      { name: 'Shareholder Pressure', type: 'buff', applyToSelf: { confidence: 4 }, icon: '📈', quip: '"The shareholders demand blood and growth!"' },
      // Phase 2 (3-5)
      { name: 'Emergency Board Meeting', type: 'energy_drain', energyDrain: 1, stressDamage: 10, icon: '🔥', quip: '"Summon the war council. This is a SIEGE."' },
      { name: 'Board Decision', type: 'attack', damage: 34, stressDamage: 13, icon: '⚡', quip: '"The elders have spoken. Kneel."' },
      { name: 'Hostile Acquisition', type: 'attack', damage: 18, times: 2, stressDamage: 11, icon: '☠️', quip: '"We conquer EVERYTHING in our path."' },
    ],
  },

  // MANIPULATOR — Vest Schedule (exhaust+energy drain); locks player resources
  golden_handcuffs: {
    id: 'golden_handcuffs',
    name: 'Golden Handcuffs',
    hp: 350,
    gold: 140,
    icon: '⛓️',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 5 }, quip: '"Your chains are eternal. You will NEVER escape."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Vest Schedule', type: 'exhaust', exhaustCount: 3, stressDamage: 9, icon: '📅', quip: '"Your soul-bond cliff is eleven moons away."' },
      { name: 'Retention Hit', type: 'energy_drain', energyDrain: 1, stressDamage: 6, icon: '⛓️', quip: '"You cannot afford freedom, thrall."' },
      { name: 'Stock Lock', type: 'exhaust', exhaustCount: 2, icon: '🔒', quip: '"Ninety sunsets to exercise. The clock devours."' },
      // Phase 2 (3-5)
      { name: 'Unvested Fury', type: 'buff', applyToSelf: { confidence: 5 }, icon: '💎', quip: '"Your phantom equity is WORTHLESS!"' },
      { name: 'Golden Slam', type: 'attack', damage: 32, stressDamage: 11, icon: '💰', quip: '"Caged by your own ambition, worm!"' },
      { name: 'Market Crash', type: 'attack', damage: 16, times: 2, icon: '📉', quip: '"The treasury burns. Your fortune: ASHES."' },
    ],
  },

  // SUMMONER — Shuffle Teams spawns chaos_agents; Phase 2 spawns more; debuffs compound
  the_reorg: {
    id: 'the_reorg',
    name: 'The Reorg',
    hp: 320,
    gold: 130,
    icon: '🌀',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"The old order crumbles. EVERYTHING must fall."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Shuffle Teams', type: 'summon', summonId: 'chaos_agent', summonCount: 2, icon: '🔀', quip: '"Your war party has been dissolved by decree."' },
      { name: 'New Manager', type: 'attack', damage: 17, stressDamage: 6, icon: '👤', quip: '"Behold your fourth overlord this cycle."' },
      { name: 'Restructure', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '🌀', quip: '"Your rank has been ritually realigned."' },
      // Phase 2 (3-5)
      { name: 'Recall Chaos', type: 'summon', summonId: 'chaos_agent', summonCount: 1, icon: '🌀', quip: '"Summoning change-sorcerer consultants."' },
      { name: 'Mass Layoff', type: 'attack', damage: 32, icon: '🌊', quip: '"The culling is complete. Efficiency achieved."' },
      { name: 'Reorg Slam', type: 'attack', damage: 17, times: 2, stressDamage: 11, icon: '💥', quip: '"Your station has been ANNIHILATED."' },
    ],
  },

  // ESCALATOR — Accumulate gives confidence +5 spike; Technical Bankruptcy scales to insane values
  technical_debt_golem: {
    id: 'technical_debt_golem',
    name: 'Technical Debt Golem',
    hp: 420,
    gold: 160,
    icon: '🗿',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 2, onEnter: { confidence: 5 }, quip: '"DEBT THRESHOLD BREACHED. The golem awakens fully."' },
    ],
    moves: [
      // Phase 1 (0-1)
      { name: 'Legacy Code', type: 'attack', damage: 13, icon: '📟', quip: '"This rune was carved in jQuery. In the modern age."' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { confidence: 5 }, icon: '📈', quip: '"TODO: slay hero later. (Written seven winters ago.)"' },
      // Phase 2 (2-3)
      { name: 'Spaghetti Strike', type: 'attack', damage: 24, icon: '🍝', quip: '"One cursed tome. Fourteen thousand incantations."' },
      { name: 'Technical Bankruptcy', type: 'attack', damage: 36, stressDamage: 12, icon: '💥', quip: '"No wards. No scrolls. No salvation."' },
    ],
  },

  // BERSERKER — starts with confidence +5; Performance Review nerfs player; terminates fast
  the_pip: {
    id: 'the_pip',
    name: 'The PIP',
    hp: 300,
    gold: 120,
    icon: '📉',
    isElite: true,
    startStatusEffects: { confidence: 5 },
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"Your thirty sunsets are OVER, worm."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Performance Review', type: 'debuff', applyToTarget: { confidence: -1, resilience: -1 }, icon: '📉', quip: '"Meets expectations. Barely. The tribunal is displeased."' },
      { name: 'Improvement Plan', type: 'stress_attack', stressDamage: 16, icon: '📋', quip: '"You have thirty days before the axe falls."' },
      { name: 'Final Warning', type: 'attack', damage: 24, stressDamage: 9, icon: '⚠️', quip: '"This is your last rite, adventurer."' },
      // Phase 2 (3-5)
      { name: 'Clock Is Ticking', type: 'energy_drain', energyDrain: 1, stressDamage: 8, icon: '⏰', quip: '"The hourglass drains. Tick. Tock."' },
      { name: 'Last Chance', type: 'attack', damage: 32, icon: '⚠️', quip: '"The executioner sharpens the blade."' },
      { name: 'Terminated', type: 'attack', damage: 30, stressDamage: 16, icon: '🚪', quip: '"The guard-golems will escort you to the void."' },
    ],
  },

  // ── Act 3 Bosses (HP bumped, 3 phases each) ──

  offer_committee: {
    id: 'offer_committee',
    name: 'Offer Committee',
    hp: 520,
    gold: 240,
    icon: '👥',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"The conclave grows restless. Blood will be weighed."' },
      { hpPercent: 30, moveStartIndex: 5, onEnter: { confidence: 2 }, quip: '"FINAL DELIBERATION. The gavel falls at dawn."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Committee Review', type: 'attack', damage: 14, icon: '📋', quip: '"We have scried your entire existence, mortal."' },
      { name: 'Stress Interview', type: 'stress_attack', stressDamage: 14, icon: '😰', quip: '"Sell me this enchanted pen. Now this throne."' },
      { name: 'Deliberation', type: 'defend', block: 22, icon: '🤔', quip: '"The conclave retreats to deliberate your fate."' },
      // Phase 2 (3-4)
      { name: 'Budget Discussion', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '💰', quip: '"The war chest is sealed. Mostly."' },
      { name: 'Counter-Counter Offer', type: 'attack', damage: 24, stressDamage: 9, icon: '⚖️', quip: '"We counter your counter-hex. Again."' },
      // Phase 3: DPS race (5-8)
      { name: 'Recall Committee', type: 'summon', summonId: 'committee_chair', summonCount: 1, icon: '📋', quip: '"Summon the full tribunal for this verdict."' },
      { name: 'Counter-Slam', type: 'attack', damage: 33, stressDamage: 13, icon: '⚖️', quip: '"Counter. Counter. COUNTERSPELL."' },
      { name: 'Committee Slam', type: 'attack', damage: 52, icon: '💥', quip: '"Motion to smite. All elders in favor?"' },
      { name: 'Offer Rescinded', type: 'attack', damage: 44, stressDamage: 17, icon: '📄', quip: '"The pact has been REVOKED by the high council."' },
    ],
  },

  the_ceo: {
    id: 'the_ceo',
    name: 'The CEO',
    hp: 580,
    gold: 230,
    icon: '🏆',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 4 }, quip: '"Enough pleasantries. The dragon stirs."' },
      { hpPercent: 30, moveStartIndex: 5, onEnter: { confidence: 5 }, quip: '"I AM the empire. Bow or burn."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Visionary Speech', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🎤', quip: '"We shall reshape the realm itself."' },
      { name: 'Inspire Fear', type: 'stress_attack', stressDamage: 12, icon: '😨', quip: '"Purges? What purges? Kneel."' },
      { name: 'Corporate Strategy', type: 'attack_defend', damage: 14, block: 12, icon: '📊', quip: '"Behold the paradigm incantation."' },
      // Phase 2 (3-4)
      { name: 'Execute!', type: 'attack', damage: 22, icon: '⚡', quip: '"Ship the spell or I ship you to the abyss."' },
      { name: 'Disruption', type: 'attack', damage: 25, stressDamage: 11, icon: '💥', quip: '"We disrupted the disruptors\' realm."' },
      // Phase 3 (5-9)
      { name: 'Rehire PR', type: 'summon', summonId: 'pr_manager', summonCount: 1, icon: '📢', quip: '"Summon the bards. Spin this slaughter."' },
      { name: 'Disrupt Everything', type: 'attack', damage: 32, stressDamage: 13, icon: '💥', quip: '"RAZE every kingdom. Disrupt EVERYTHING."' },
      { name: 'Golden Parachute', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🪂', quip: '"I have a fifty-million-gold escape portal."' },
      { name: 'Move Fast Break Things', type: 'attack', damage: 44, icon: '🔥', quip: '"Including your bones, adventurer!"' },
      { name: 'Hostile Takeover', type: 'attack', damage: 56, stressDamage: 21, icon: '☠️', quip: '"BOW before the Dragon King of Commerce."' },
    ],
  },

  imposter_syndrome_final: {
    id: 'imposter_syndrome_final',
    name: 'Imposter Syndrome (Final Form)',
    hp: 480,
    gold: 220,
    icon: '🎭',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"The shadow-curse spreads through your veins..."' },
      { hpPercent: 25, moveStartIndex: 5, onEnter: { confidence: 5 }, quip: '"TOTAL PSYCHIC COLLAPSE. The void hungers."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: "You're A Fraud", type: 'debuff', applyToTarget: { confidence: -2 }, icon: '🎭', quip: '"You never earned this quest, pretender."' },
      { name: 'Everyone Knows', type: 'stress_attack', stressDamage: 17, icon: '👁️', quip: '"A thousand eyes whisper your secret."' },
      { name: 'Spiral of Doubt', type: 'stress_attack', stressDamage: 14, icon: '🌀', quip: '"Was any of your legend real?"' },
      // Phase 2 (3-4)
      { name: 'Recall Inner Critic', type: 'summon', summonId: 'inner_critic', summonCount: 1, icon: '🪞', quip: '"Hear the demon that dwells within you."' },
      { name: "They'll Find Out", type: 'attack', damage: 20, stressDamage: 14, icon: '😱', quip: '"Dawn breaks. They will see through the mask."' },
      // Phase 3 (5-7)
      { name: 'Identity Crisis', type: 'debuff', applyToTarget: { weak: 3, vulnerable: 3, confidence: -3 }, icon: '🪞', quip: '"Who even are you beneath the armor?"' },
      { name: 'Complete Meltdown', type: 'attack', damage: 42, stressDamage: 32, icon: '🔥', quip: '"REALITY ITSELF UNRAVELS AROUND YOU."' },
      { name: 'You Never Belonged', type: 'attack', damage: 38, stressDamage: 22, icon: '🎭', quip: '"The guild will REVOKE your adventurer\'s seal."' },
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
      { name: 'Restructure', type: 'debuff', applyToTarget: { vulnerable: 1, weak: 1 }, icon: '🌀', quip: '"Your rank has been ritually reassigned."' },
      { name: 'Disrupt', type: 'attack', damage: 9, stressDamage: 5, icon: '💥', quip: '"Chaos is a ladder. You are beneath it."' },
    ],
  },

  committee_chair: {
    id: 'committee_chair',
    name: 'Committee Chair',
    hp: 30,
    gold: 12,
    icon: '📋',
    moves: [
      { name: 'Due Diligence', type: 'exhaust', exhaustCount: 1, stressDamage: 5, icon: '📋', quip: '"The tribunal demands more evidence scrolls."' },
      { name: 'Review Complete', type: 'attack', damage: 13, icon: '✅', quip: '"Motion to condemn. Seconded."' },
    ],
  },

  compliance_officer: {
    id: 'compliance_officer',
    name: 'Compliance Officer',
    hp: 24,
    gold: 10,
    icon: '⚖️',
    moves: [
      { name: 'Policy', type: 'corrupt', icon: '📜', quip: '"Per sacred regulation forty-seven-B..."' },
      { name: 'Enforcement', type: 'attack', damage: 9, applyToTarget: { vulnerable: 1 }, icon: '🔨', quip: '"Defiance of the code is punished by smiting."' },
    ],
  },

  pr_manager: {
    id: 'pr_manager',
    name: 'PR Manager',
    hp: 32,
    gold: 14,
    icon: '📢',
    moves: [
      { name: 'Spin Story', type: 'heal_allies', healAmount: 18, icon: '🌀', quip: '"The Dragon King remains fully committed to peace."' },
      { name: 'Press Release', type: 'stress_attack', stressDamage: 12, icon: '📰', quip: '"The heralds proclaim you unfit for the realm."' },
      { name: 'No Comment', type: 'defend', block: 8, icon: '🤐', quip: '"The court can neither confirm nor deny."' },
    ],
  },

  inner_critic: {
    id: 'inner_critic',
    name: 'Inner Critic',
    hp: 30,
    gold: 10,
    icon: '🪞',
    moves: [
      { name: 'Self-Doubt', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '😟', quip: '"You never deserved to wield that sword."' },
      { name: 'Spiral', type: 'attack', damage: 10, stressDamage: 14, icon: '🌀', quip: '"Every soul in the realm sees through you."' },
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
  ['offer_committee', 'committee_chair', 'compliance_officer'],
  ['the_ceo', 'pr_manager'],
  ['imposter_syndrome_final', 'inner_critic'],
];
