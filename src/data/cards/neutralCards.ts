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
    description: 'Deal 9 damage. Copied the top answer.',
    effects: { damage: 9 },
    upgradedEffects: { damage: 12 },
    upgradedDescription: 'Deal 12 damage.',
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
    upgradedDescription: 'Reduce 11 Stress.',
    icon: '🌬️',
  },
  meditation: {
    id: 'meditation', name: 'Meditation', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Reduce 6 Stress. Draw 1 card. Namaste. LinkedIn is not.',
    effects: { copium: 6, draw: 1 },
    upgradedEffects: { copium: 8, draw: 1 },
    upgradedDescription: 'Reduce 8 Stress. Draw 1 card.',
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

  // ── Neutral Uncommon ──
  pair_programming: {
    id: 'pair_programming', name: 'Pair Programming', type: 'attack', target: 'enemy', cost: 1, rarity: 'uncommon',
    description: 'Deal 6 damage x2. Two people, twice the pain.',
    effects: { damage: 6, times: 2 },
    upgradedEffects: { damage: 8, times: 2 },
    upgradedDescription: 'Deal 8 damage x2.',
    icon: '👥',
  },
  sprint_planning: {
    id: 'sprint_planning', name: 'Sprint Planning', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    description: 'Gain 1 energy. Draw 1 card. 45-minute meeting for 10-minute task.',
    effects: { energy: 1, draw: 1 },
    upgradedEffects: { energy: 1, draw: 2 },
    upgradedDescription: 'Gain 1 energy. Draw 2 cards.',
    icon: '📋',
  },
  work_life_balance: {
    id: 'work_life_balance', name: 'Work-Life Balance', type: 'skill', target: 'self', cost: 2, rarity: 'uncommon',
    description: 'Gain 10 block. Reduce 10 Stress. A mythical concept.',
    effects: { block: 10, copium: 10 },
    upgradedEffects: { block: 13, copium: 13 },
    upgradedDescription: 'Gain 13 block. Reduce 13 Stress.',
    icon: '⚖️',
  },
  therapy_session: {
    id: 'therapy_session', name: 'Therapy Session', type: 'skill', target: 'self', cost: 2, rarity: 'uncommon',
    description: 'Reduce 15 Stress. $200/hour broke.',
    effects: { copium: 15 },
    upgradedEffects: { copium: 20 },
    upgradedDescription: 'Reduce 20 Stress.',
    icon: '🛋️',
  },
  counter_offer: {
    id: 'counter_offer', name: 'Counter-Offer', type: 'power', target: 'self', cost: 2, rarity: 'uncommon',
    description: 'Gain 3 Counter-Offer. I have a competing offer.',
    effects: { applyToSelf: { counterOffer: 3 } },
    upgradedEffects: { applyToSelf: { counterOffer: 5 } },
    upgradedDescription: 'Gain 5 Counter-Offer.',
    icon: '💼',
  },

  // ── Neutral Rare ──
  full_stack: {
    id: 'full_stack', name: 'Full Stack', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    description: 'Deal 12 damage. Gain 12 block. You do it all because they fired everyone.',
    effects: { damage: 12, block: 12 },
    upgradedEffects: { damage: 16, block: 16 },
    upgradedDescription: 'Deal 16 damage. Gain 16 block.',
    icon: '🏗️',
  },
  networking_event: {
    id: 'networking_event', name: 'Networking Event', type: 'power', target: 'self', cost: 1, rarity: 'rare',
    description: 'Gain 1 Networking. Let\'s grab coffee!',
    effects: { applyToSelf: { networking: 1 } },
    upgradedEffects: { applyToSelf: { networking: 2 } },
    upgradedDescription: 'Gain 2 Networking.',
    icon: '🤝',
  },
  emergency_fund: {
    id: 'emergency_fund', name: 'Emergency Fund', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 10 Savings Account. 6 months of runway.',
    effects: { applyToSelf: { savingsAccount: 10 } },
    upgradedEffects: { applyToSelf: { savingsAccount: 15 } },
    upgradedDescription: 'Gain 15 Savings Account.',
    icon: '🏦',
  },
  hustle_culture: {
    id: 'hustle_culture', name: 'Hustle Culture', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 1 energy each turn. Gain 3 stress each turn. Sleep is for the insured.',
    effects: { applyToSelf: { hustleCulture: 1 } },
    upgradedEffects: { applyToSelf: { hustleCulture: 1 }, energy: 1 },
    upgradedDescription: 'Gain 1 energy. Gain 1 energy each turn. Gain 3 stress each turn.',
    icon: '💪',
  },

  // ── Curse ──
  ghosted_curse: {
    id: 'ghosted_curse', name: 'Ghosted', type: 'curse', target: 'self', cost: 1, rarity: 'curse',
    description: 'Unplayable. Clogs your hand. They never called back.',
    effects: {},
    icon: '💔',
  },
};
