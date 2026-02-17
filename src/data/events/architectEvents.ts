import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// ARCHITECT — Themed Events
// ═══════════════════════════════════════════════════════════════

export const architectEvents: EventDef[] = [
  {
    id: 'whiteboard_session',
    title: 'The Whiteboard Session',
    description: 'An empty whiteboard in a conference room. Markers of every color. The urge to diagram is overwhelming.',
    icon: '📊',
    class: 'architect',
    choices: [
      {
        text: 'Design a perfect system (Gain Factory Method card, lose 6 HP)',
        outcome: { addCard: 'factory_method', hp: -6, message: 'You drew boxes and arrows for 4 hours. It was beautiful. Nobody will implement it.' },
      },
      {
        text: 'Draw something inappropriate (+30 gold)',
        outcome: { gold: 30, message: 'You drew a phallic microservices diagram. Someone Slack\'d it company-wide. You got a bonus.' },
      },
      {
        text: 'Meditate on the emptiness (Reduce 20 stress)',
        outcome: { stress: -20, message: 'The blank whiteboard is a metaphor for infinite possibility. Or your career prospects.' },
      },
    ],
  },
  {
    id: 'architecture_review_event',
    title: 'The Architecture Review',
    description: 'A committee of senior architects invites you to review your system design. Their eyes are cold. Their feedback will be colder.',
    icon: '🏛️',
    class: 'architect',
    choices: [
      {
        text: 'Present your design (Gain Observer Pattern card, lose 8 HP)',
        outcome: { addCard: 'observer_pattern', hp: -8, message: '"Interesting approach." The highest compliment an architect can give.' },
      },
      {
        text: 'Bribe the committee (+1 random uncommon card)',
        outcome: { addCard: 'random_uncommon', gold: -20, message: 'They approved your design after you bought lunch. Software engineering.' },
      },
      {
        text: 'Skip the review',
        outcome: { stress: 10, message: 'The committee sends passive-aggressive Slack messages for a week.' },
      },
    ],
  },
  {
    id: 'technical_debt_collector',
    title: 'The Technical Debt Collector',
    description: 'A mysterious figure in a suit appears. "You owe 47,000 lines of unrefactored code. Time to pay up."',
    icon: '💳',
    class: 'architect',
    choices: [
      {
        text: 'Pay the debt (Remove a chosen card, heal 15 HP)',
        outcome: { removeChosenCard: 1, hp: 15, message: 'Your codebase is cleaner. Your soul is lighter.' },
      },
      {
        text: 'Refinance (Gain Scope Creep card, +25 gold)',
        outcome: { addCard: 'scope_creep', gold: 25, message: '"We\'ll pay it off next sprint." You won\'t.' },
      },
      {
        text: 'Declare bankruptcy',
        outcome: { hp: -15, stress: -25, message: 'rm -rf *. Start fresh. It hurts but it\'s freeing.' },
      },
    ],
  },
  {
    id: 'standup_meeting',
    title: 'The Eternal Standup',
    description: 'A standup meeting that started 45 minutes ago. Someone is screen-sharing their entire desktop. There is no end in sight.',
    icon: '🧍',
    class: 'architect',
    choices: [
      {
        text: '"I have a hard stop" (Gain Proof of Concept card)',
        outcome: { addCard: 'proof_of_concept', message: 'You escaped. The meeting continues without you. It always does.' },
      },
      {
        text: 'Actually participate (Gain Gantt Chart relic)',
        outcome: { addItem: 'gantt_chart', hp: -5, message: 'You engaged meaningfully. +1 energy per combat. Your soul: slightly dimmer.' },
      },
      {
        text: 'Mute and play games (Reduce 10 stress)',
        outcome: { stress: -10, message: 'You beat 3 levels of a mobile game during the meeting. Productive day.' },
      },
    ],
  },
  {
    id: 'microservices_debate',
    title: 'The Microservices Debate',
    description: 'A heated Slack thread erupts. 47 engineers. 47 opinions. "Should we split the monolith?" The CTO is watching. Everyone is wrong.',
    icon: '🏗️',
    class: 'architect',
    choices: [
      {
        text: 'Embrace microservices (Upgrade random card, lose 12 HP, gain 10 stress)',
        outcome: { upgradeRandomCard: true, hp: -12, stress: 10, message: 'You split the monolith into 200 services. Kubernetes is your only friend now.' },
      },
      {
        text: 'Defend the monolith (+30 gold, reduce 10 stress)',
        outcome: { gold: 30, stress: -10, message: '"Monoliths are underrated." The CTO nodded. The Slack thread died. Peace.' },
      },
      {
        text: 'Suggest modular monolith (Remove chosen card, heal 10 HP)',
        outcome: { removeChosenCard: 1, hp: 10, message: 'The centrist option. Nobody loves it. Nobody hates it. It ships on time.' },
      },
    ],
  },
];
