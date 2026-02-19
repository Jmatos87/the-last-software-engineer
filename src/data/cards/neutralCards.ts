import type { CardDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// NEUTRAL CARDS — Available to all classes
// ═══════════════════════════════════════════════════════════════

export const neutralCards: Record<string, CardDef> = {

  // ── Neutral Starter ──
  coffee_break: {
    id: 'coffee_break', name: 'Coffee Break', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    description: 'Reduce 6 Stress. Your 4th cup today. The mug says "I love Mondays" ironically.',
    effects: { copium: 6 },
    upgradedEffects: { copium: 9 },
    upgradedDescription: 'Reduce 9 Stress.',
    icon: '☕',
  },

  // ── Neutral Common ──
  stack_overflow: {
    id: 'stack_overflow', name: 'Stack Overflow', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    description: 'Deal 10 damage. Copied the top answer.',
    effects: { damage: 10 },
    upgradedEffects: { damage: 14 },
    upgradedDescription: 'Deal 14 damage.',
    icon: '📚',
  },
  rubber_duck: {
    id: 'rubber_duck', name: 'Rubber Duck Debug', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Gain 6 block. Draw 1 card. Explain bug to duck. Bug disappears.',
    effects: { block: 6, draw: 1 },
    upgradedEffects: { block: 8, draw: 1 },
    upgradedDescription: 'Gain 8 block. Draw 1 card.',
    icon: '🦆',
  },
  deep_breath: {
    id: 'deep_breath', name: 'Deep Breath', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Reduce 8 Stress. WHY HAVEN\'T THEY EMAILED BACK.',
    effects: { copium: 8 },
    upgradedEffects: { copium: 11 },
    upgradedDescription: 'Cost 0. Reduce 11 Stress.',
    upgradedCost: 0,
    icon: '🌬️',
  },
  meditation: {
    id: 'meditation', name: 'Meditation', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Reduce 6 Stress. Draw 1 card. Namaste. LinkedIn is not.',
    effects: { copium: 6, draw: 1 },
    upgradedEffects: { copium: 8, draw: 1 },
    upgradedDescription: 'Cost 0. Reduce 8 Stress. Draw 1 card.',
    upgradedCost: 0,
    icon: '🧘',
  },
  git_stash: {
    id: 'git_stash', name: 'Git Stash', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Gain 4 block. Reduce 4 Stress. Stash changes. Stash feelings.',
    effects: { block: 4, copium: 4 },
    upgradedEffects: { block: 6, copium: 6 },
    upgradedDescription: 'Gain 6 block. Reduce 6 Stress.',
    icon: '📦',
  },
  // New neutral commons
  burnout: {
    id: 'burnout', name: 'Burnout', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    description: 'Deal 6 damage. Add 5 stress. Two more years of this.',
    effects: { damage: 6, addStress: 5 },
    upgradedEffects: { damage: 9, addStress: 4 },
    upgradedDescription: 'Deal 9 damage. Add 4 stress.',
    icon: '🔥',
  },
  linkedin_post: {
    id: 'linkedin_post', name: 'LinkedIn Post', type: 'skill', target: 'self', cost: 0, rarity: 'common',
    exhaust: true,
    description: 'Exhaust. Reduce 4 Stress. "Excited to announce..." — cope professionally.',
    effects: { copium: 4 },
    upgradedEffects: { copium: 7 },
    upgradedDescription: 'Exhaust. Reduce 7 Stress.',
    icon: '💼',
  },
  wfh_setup: {
    id: 'wfh_setup', name: 'WFH Setup', type: 'skill', target: 'self', cost: 2, rarity: 'common',
    description: 'Gain 10 block. Reduce 8 Stress. Four monitors. One crippling loneliness.',
    effects: { block: 10, copium: 8 },
    upgradedEffects: { block: 14, copium: 10 },
    upgradedDescription: 'Gain 14 block. Reduce 10 Stress.',
    icon: '🖥️',
  },
  meeting_recap: {
    id: 'meeting_recap', name: 'Meeting Recap', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Draw 3 cards. Gain 4 block. 45 minutes. Action items: survive.',
    effects: { draw: 3, block: 4 },
    upgradedEffects: { draw: 3, block: 6 },
    upgradedDescription: 'Draw 3. Gain 6 block.',
    icon: '📧',
  },

  // ── Neutral Rare (was Uncommon) ──
  pair_programming: {
    id: 'pair_programming', name: 'Pair Programming', type: 'attack', target: 'enemy', cost: 1, rarity: 'rare',
    description: 'Deal 6 damage x2. Two people, twice the pain.',
    effects: { damage: 6, times: 2 },
    upgradedEffects: { damage: 14, times: 2 },
    upgradedDescription: 'Cost 2. Deal 14 damage x2. Four people. Infinite opinions.',
    upgradedCost: 2,
    icon: '👥',
  },
  sprint_planning: {
    id: 'sprint_planning', name: 'Sprint Planning', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    description: 'Gain 1 energy. Draw 1 card. 45-minute meeting for 10-minute task.',
    effects: { energy: 1, draw: 1 },
    upgradedEffects: { energy: 1, draw: 2 },
    upgradedDescription: 'Cost 0. Gain 1 energy. Draw 2 cards.',
    upgradedCost: 0,
    icon: '📋',
  },
  work_life_balance: {
    id: 'work_life_balance', name: 'Work-Life Balance', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 10 block. Reduce 10 Stress. A mythical concept.',
    effects: { block: 10, copium: 10 },
    upgradedEffects: { block: 13, copium: 13 },
    upgradedDescription: 'Gain 13 block. Reduce 13 Stress.',
    icon: '⚖️',
  },
  therapy_session: {
    id: 'therapy_session', name: 'Therapy Session', type: 'skill', target: 'self', cost: 2, rarity: 'rare',
    description: 'Reduce 15 Stress. $200/hour broke.',
    effects: { copium: 15 },
    upgradedEffects: { copium: 20 },
    upgradedDescription: 'Reduce 20 Stress.',
    icon: '🛋️',
  },
  counter_offer: {
    id: 'counter_offer', name: 'Counter-Offer', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 3 Counter-Offer. I have a competing offer.',
    effects: { applyToSelf: { counterOffer: 3 } },
    upgradedEffects: { applyToSelf: { counterOffer: 5 } },
    upgradedDescription: 'Gain 5 Counter-Offer.',
    icon: '💼',
  },
  // New neutral rares
  stonks: {
    id: 'stonks', name: 'Stonks', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 15 gold. Gain 10 Savings Account (retain block). Numbers go up.',
    effects: { gainGold: 15, applyToSelf: { savingsAccount: 10 } },
    upgradedEffects: { gainGold: 20, applyToSelf: { savingsAccount: 15 } },
    upgradedDescription: 'Gain 20 gold. Gain 15 Savings Account.',
    icon: '📈',
  },
  acqui_hired: {
    id: 'acqui_hired', name: 'Acqui-Hired', type: 'skill', target: 'self', cost: 1, rarity: 'rare',
    exhaust: true,
    description: 'Exhaust. Gain 2 energy. Heal 10 HP. Gain 30 gold. You didn\'t join them. They joined you.',
    effects: { energy: 2, heal: 10, gainGold: 30 },
    upgradedEffects: { energy: 3, heal: 15, gainGold: 40 },
    upgradedDescription: 'Exhaust. Gain 3 energy. Heal 15 HP. Gain 40 gold.',
    icon: '💎',
  },
  ipo_day: {
    id: 'ipo_day', name: 'IPO Day', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 2 Networking. Gain 30 gold. Shares are underwater. Title is nice.',
    effects: { gainGold: 30, applyToSelf: { networking: 2 } },
    upgradedEffects: { gainGold: 40, applyToSelf: { networking: 3 } },
    upgradedDescription: 'Gain 3 Networking. Gain 40 gold.',
    icon: '🎉',
  },

  // ── Neutral Epic (was Rare) ──
  full_stack: {
    id: 'full_stack', name: 'Full Stack', type: 'attack', target: 'enemy', cost: 2, rarity: 'epic',
    description: 'Deal 12 damage. Gain 12 block. You do it all because they fired everyone.',
    effects: { damage: 12, block: 12 },
    upgradedEffects: { damage: 16, block: 16 },
    upgradedDescription: 'Deal 16 damage. Gain 16 block.',
    icon: '🏗️',
  },
  networking_event: {
    id: 'networking_event', name: 'Networking Event', type: 'power', target: 'self', cost: 1, rarity: 'epic',
    description: 'Gain 2 Networking (+1 card drawn/turn per stack). Let\'s grab coffee!',
    effects: { applyToSelf: { networking: 2 } },
    upgradedEffects: { applyToSelf: { networking: 3 } },
    upgradedDescription: 'Cost 0. Gain 3 Networking.',
    upgradedCost: 0,
    icon: '🤝',
  },
  emergency_fund: {
    id: 'emergency_fund', name: 'Emergency Fund', type: 'power', target: 'self', cost: 2, rarity: 'epic',
    description: 'Gain 10 Savings Account. 6 months of runway.',
    effects: { applyToSelf: { savingsAccount: 10 } },
    upgradedEffects: { applyToSelf: { savingsAccount: 15 } },
    upgradedDescription: 'Gain 15 Savings Account.',
    icon: '🏦',
  },
  hustle_culture: {
    id: 'hustle_culture', name: 'Hustle Culture', type: 'power', target: 'self', cost: 2, rarity: 'epic',
    description: 'Gain 1 energy each turn. Gain 3 stress each turn. Sleep is for the insured.',
    effects: { applyToSelf: { hustleCulture: 1 } },
    upgradedEffects: { applyToSelf: { hustleCulture: 1 }, energy: 1 },
    upgradedDescription: 'Gain 1 energy. Gain 1 energy each turn. Gain 3 stress each turn.',
    icon: '💪',
  },
  // New epics
  the_pivot: {
    id: 'the_pivot', name: 'The Pivot', type: 'skill', target: 'self', cost: 1, rarity: 'epic',
    exhaust: true,
    description: 'Exhaust. Exhaust 3 from draw pile. Draw 4 cards. Burn it down. Build it right.',
    effects: { exhaustFromDraw: 3, draw: 4 },
    upgradedEffects: { exhaustFromDraw: 3, draw: 5 },
    upgradedDescription: 'Exhaust. Exhaust 3, draw 5.',
    icon: '🔄',
  },
  yolo_deploy: {
    id: 'yolo_deploy', name: 'YOLO Deploy', type: 'attack', target: 'enemy', cost: 0, rarity: 'epic',
    exhaust: true,
    description: 'Deal 20 damage. Self-damage 10. Add 15 stress. Exhaust. It works on my machine.',
    effects: { damage: 20, selfDamage: 10, addStress: 15 },
    upgradedEffects: { damage: 28, selfDamage: 8, addStress: 12 },
    upgradedDescription: 'Deal 28 damage. Self-damage 8. Add 12 stress.',
    icon: '🚀',
  },

  // ── Neutral Legendary ──
  the_offer: {
    id: 'the_offer', name: 'The Offer', type: 'power', target: 'self', cost: 2, rarity: 'legendary',
    description: 'Gain 5 Regen. Gain 2 Confidence, 2 Resilience, 1 Networking. TC: Yes. Stock: Yes. Benefits: Yes. Remote: Yes. On-call: Saturdays.',
    effects: { applyToSelf: { regen: 5, confidence: 2, resilience: 2, networking: 1 } },
    upgradedEffects: { applyToSelf: { regen: 7, confidence: 3, resilience: 3, networking: 2 } },
    upgradedDescription: 'Cost 1. Gain 7 Regen. Gain 3 Confidence, 3 Resilience, 2 Networking.',
    upgradedCost: 1,
    icon: '🎯',
  },
  final_sprint: {
    id: 'final_sprint', name: 'Final Sprint', type: 'attack', target: 'enemy', cost: 2, rarity: 'legendary',
    exhaust: true,
    description: 'Exhaust your entire hand. Deal 15 damage per card exhausted to one enemy. Deadline is Monday. The enemy has 3 HP. Math checks out.',
    effects: { exhaustAllHand: true, damagePerCardExhausted: 15 },
    upgradedEffects: { exhaustAllHand: true, damagePerCardExhausted: 20 },
    upgradedDescription: 'Cost 1. Exhaust all hand. Deal 20 damage per card.',
    upgradedCost: 1,
    icon: '⚡',
  },

  // ── Neutral New Legendaries ──
  the_rejection_letter: {
    id: 'the_rejection_letter', name: 'The Rejection Letter', type: 'skill', target: 'self', cost: 1, rarity: 'legendary',
    exhaust: true,
    description: 'Exhaust. Gain 4 Regen. Reduce 35 Stress. Gain 1 Confidence. "We have decided to move forward with other candidates." You have decided to move forward with winning.',
    effects: { copium: 35, applyToSelf: { regen: 4, confidence: 1 } },
    upgradedEffects: { copium: 50, applyToSelf: { regen: 5, confidence: 2 } },
    upgradedDescription: 'Cost 0. Exhaust. Gain 5 Regen. Reduce 50 Stress. Gain 2 Confidence.',
    upgradedCost: 0,
    icon: '📨',
  },
  the_acquisition: {
    id: 'the_acquisition', name: 'The Acquisition', type: 'power', target: 'self', cost: 3, rarity: 'legendary',
    description: 'Gain 50 gold. Gain 2 Confidence. Gain 2 Resilience. Gain 2 Networking. You didn\'t sell out. You bought in.',
    effects: { gainGold: 50, applyToSelf: { confidence: 2, resilience: 2, networking: 2 } },
    upgradedEffects: { gainGold: 70, applyToSelf: { confidence: 3, resilience: 3, networking: 3 } },
    upgradedDescription: 'Cost 2. Gain 70 gold. Gain 3 Confidence. Gain 3 Resilience. Gain 3 Networking.',
    upgradedCost: 2,
    icon: '🤝',
  },

  // ── Curses ──
  ghosted_curse: {
    id: 'ghosted_curse', name: 'Ghosted', type: 'curse', target: 'self', cost: 1, rarity: 'curse',
    description: 'Unplayable. Clogs your hand. They never called back.',
    effects: {},
    icon: '💔',
  },
  rejected: {
    id: 'rejected', name: 'Rejected', type: 'curse', target: 'self', cost: 1, rarity: 'curse',
    description: 'Unplayable. Add 5 stress when drawn. Application Status: Under Review. Indefinitely.',
    effects: {},
    icon: '❌',
  },
  mandatory_overtime: {
    id: 'mandatory_overtime', name: 'Mandatory Overtime', type: 'curse', target: 'self', cost: 0, rarity: 'curse',
    description: 'Unplayable. Add 5 stress when drawn. "We\'re a startup. Everyone crunches."',
    effects: {},
    icon: '⏰',
  },
  nda: {
    id: 'nda', name: 'NDA', type: 'curse', target: 'self', cost: 2, rarity: 'curse',
    description: 'Unplayable. You cannot discuss the terms of your suffering.',
    effects: {},
    icon: '🤐',
  },
};
