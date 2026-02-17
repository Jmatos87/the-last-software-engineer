import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// NEUTRAL — General + Risk/Reward Events
// ═══════════════════════════════════════════════════════════════

export const neutralEvents: EventDef[] = [
  {
    id: 'abandoned_repo',
    title: 'Abandoned Repository',
    description: 'You discover an old GitHub repository with thousands of stars but no maintainer. The code looks promising but risky.',
    icon: '📁',
    choices: [
      {
        text: 'Fork and study the code (+1 random card)',
        outcome: { addCard: 'random_common', message: 'You learned a new technique!' },
      },
      {
        text: 'Mine it for cryptocurrency (+30 gold)',
        outcome: { gold: 30, message: 'Crypto profits!' },
      },
      {
        text: 'Salvage a relic from the repo (Gain Company Swag Mug)',
        outcome: { addItem: 'company_swag_mug', message: 'You found a dusty mug with a faded startup logo. It still works.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'You leave the repository untouched.' },
      },
    ],
  },
  {
    id: 'coffee_machine',
    title: 'The Coffee Machine',
    description: 'A pristine coffee machine sits in an abandoned break room. The aroma is irresistible.',
    icon: '☕',
    choices: [
      {
        text: 'Drink the coffee (Heal 15 HP)',
        outcome: { hp: 15, message: 'You feel rejuvenated!' },
      },
      {
        text: 'Sell the machine (+ 25 gold)',
        outcome: { gold: 25, message: 'Someone will pay good money for this.' },
      },
    ],
  },
  {
    id: 'hackathon',
    title: 'Hackathon',
    description: 'You stumble upon a hackathon in progress. The competitors look fierce but the prizes are good.',
    icon: '🏆',
    choices: [
      {
        text: 'Compete! (Lose 8 HP, gain a card)',
        outcome: { hp: -8, addCard: 'random_uncommon', message: 'You won! New technique acquired.' },
      },
      {
        text: 'Judge instead (+20 gold)',
        outcome: { gold: 20, message: 'Easy money for giving feedback.' },
      },
      {
        text: 'Skip it',
        outcome: { message: 'Not today.' },
      },
    ],
  },
  {
    id: 'code_mentor',
    title: 'Code Mentor',
    description: 'A wise senior developer offers to review your code. "I can teach you, but it requires sacrifice."',
    icon: '👨‍💻',
    choices: [
      {
        text: 'Accept mentoring (Remove a chosen card)',
        outcome: { removeChosenCard: 1, message: 'Your deck feels leaner and more focused.' },
      },
      {
        text: 'Ask for money instead (+15 gold)',
        outcome: { gold: 15, message: 'The mentor sighs and hands over some cash.' },
      },
    ],
  },
  {
    id: 'server_room',
    title: 'The Server Room',
    description: 'You find a dark server room humming with power. Blinking lights cast eerie shadows.',
    icon: '🏢',
    choices: [
      {
        text: 'Scavenge for parts (+40 gold, lose 10 HP)',
        outcome: { gold: 40, hp: -10, message: 'You got shocked but found valuable components.' },
      },
      {
        text: 'Grab the on-call pager (Gain On-Call Rotation artifact)',
        outcome: { addItem: 'on_call_rotation', hp: -5, message: 'The pager vibrates ominously. +2 Resilience, but you\'ll never sleep again.' },
      },
      {
        text: 'Meditate among the servers (Heal 20 HP)',
        outcome: { hp: 20, message: 'The hum of servers calms your mind.' },
      },
    ],
  },

  // ── Risk/Reward Events ──

  {
    id: 'whiteboard_interview',
    title: 'The Whiteboard Interview',
    description: 'An interviewer slides a dry-erase marker across the table. "Reverse a binary tree. On the whiteboard. Now." The marker smells like fear.',
    icon: '📋',
    choices: [
      {
        text: 'Solve it perfectly (Upgrade random card, lose 12 HP)',
        outcome: { upgradeRandomCard: true, hp: -12, message: 'You nailed it. The interviewer slow-clapped. Your brain is smoking.' },
      },
      {
        text: 'Brute force it (Gain random common, lose 5 HP)',
        outcome: { addCard: 'random_common', hp: -5, message: 'O(n³) but it works. "We\'ll be in touch." (They won\'t.)' },
      },
      {
        text: 'Refuse to whiteboard (+30 gold, gain 15 stress)',
        outcome: { gold: 30, stress: 15, message: '"I don\'t perform under artificial pressure." You stormed out and freelanced instead.' },
      },
    ],
  },
  {
    id: 'recruiter_dm',
    title: 'The Recruiter\'s DM',
    description: '"Hi! I came across your profile and I think you\'d be a GREAT fit for an exciting opportunity!" The message has 47 exclamation marks.',
    icon: '💬',
    choices: [
      {
        text: 'Take the call (Upgrade random card, gain 10 stress)',
        outcome: { upgradeRandomCard: true, stress: 10, message: 'The call lasted 90 minutes. You learned something. Your ear is numb.' },
      },
      {
        text: 'Counter with salary demands (+50 gold, lose 8 HP)',
        outcome: { gold: 50, hp: -8, message: '"I require $500k base, unlimited PTO, and a company pony." They... agreed?' },
      },
      {
        text: 'Mark as spam (Remove chosen card, reduce 10 stress)',
        outcome: { removeChosenCard: 1, stress: -10, message: 'Blocked. Reported. Filtered. Inner peace achieved.' },
      },
    ],
  },
  {
    id: 'oss_maintainer',
    title: 'The Open Source Maintainer',
    description: 'A haggard developer approaches. Dark circles. 2,000 open issues. "Please... just one PR review..." Their project has 50k stars and 0 sponsors.',
    icon: '🌟',
    choices: [
      {
        text: 'Accept the project (Upgrade random card, gain 20 stress)',
        outcome: { upgradeRandomCard: true, stress: 20, message: 'You\'re now maintaining a critical dependency for 40% of npm. Congrats?' },
      },
      {
        text: 'Donate to them (Lose 35 gold, heal 25 HP, reduce 15 stress)',
        outcome: { gold: -35, hp: 25, stress: -15, message: 'They cried. You cried. Open source is beautiful and terrible.' },
      },
      {
        text: 'Ghost them (Gain 10 stress)',
        outcome: { stress: 10, message: 'You walked away. The guilt follows. Their GitHub Sponsors page haunts your dreams.' },
      },
    ],
  },
  {
    id: 'performance_review',
    title: 'The Performance Review',
    description: 'Your manager opens a spreadsheet with 47 KPIs. "Let\'s discuss your impact this quarter." The room smells like corporate despair.',
    icon: '📊',
    choices: [
      {
        text: 'Exceed expectations (Upgrade random card, lose 15 HP)',
        outcome: { upgradeRandomCard: true, hp: -15, message: 'You presented a 30-slide deck on your "impact." You got a 3% raise. Worth it?' },
      },
      {
        text: 'Meets expectations (+20 gold, gain 10 stress)',
        outcome: { gold: 20, stress: 10, message: '"Solid performance." The most lukewarm compliment in corporate history.' },
      },
      {
        text: 'Self-review: "I\'m a rockstar" (Heal 20 HP, gain 15 stress)',
        outcome: { hp: 20, stress: 15, message: 'You wrote 500 words about how amazing you are. Your manager sighed audibly.' },
      },
    ],
  },
  {
    id: 'salary_negotiation',
    title: 'The Salary Negotiation',
    description: 'HR sends the offer letter. The number is... underwhelming. Your rent costs more than their monthly offer. Time to negotiate.',
    icon: '💰',
    choices: [
      {
        text: 'Counter aggressively (+60 gold, lose 15 HP)',
        outcome: { gold: 60, hp: -15, message: '"I have competing offers." You don\'t. But they don\'t know that. It worked.' },
      },
      {
        text: 'Accept gracefully (+25 gold, gain 15 stress)',
        outcome: { gold: 25, stress: 15, message: 'You signed immediately. The recruiter looked surprised. "Usually people negotiate..."' },
      },
      {
        text: 'Leak the offer on Blind (Remove chosen card, +40 gold)',
        outcome: { removeChosenCard: 1, gold: 40, message: 'Anonymous post went viral. HR panicked. Everyone got raises. You got fired.' },
      },
    ],
  },
  {
    id: 'vendor_pitch',
    title: 'The Vendor Pitch',
    description: 'A vendor corners you at a conference. Their slides have 800 buzzwords. "AI-powered blockchain-native cloud-synergized solutions." They won\'t stop.',
    icon: '📢',
    choices: [
      {
        text: 'Endure the full pitch (Gain random uncommon, gain 20 stress)',
        outcome: { addCard: 'random_uncommon', stress: 20, message: 'It was 90 minutes. You learned nothing. But the free t-shirt had a useful technique on it.' },
      },
      {
        text: 'Steal their free swag (+30 gold)',
        outcome: { gold: 30, message: 'You grabbed 5 branded water bottles and a stress ball. "That\'s not really how this—" Too late.' },
      },
      {
        text: 'Flip the table (Lose 10 HP, reduce 20 stress)',
        outcome: { hp: -10, stress: -20, message: 'You literally flipped their demo table. Security escorted you out. Worth it.' },
      },
    ],
  },
  {
    id: 'imposter_spiral',
    title: 'The Imposter Syndrome Spiral',
    description: 'You\'re staring at your own code and you can\'t remember writing it. It\'s... actually good? "I definitely didn\'t write this. Did I? Am I real?"',
    icon: '🎭',
    choices: [
      {
        text: 'Confront your fears (Upgrade random card, lose 10 HP, gain 10 stress)',
        outcome: { upgradeRandomCard: true, hp: -10, stress: 10, message: 'You accepted that you\'re competent. It was the hardest thing you\'ve ever done.' },
      },
      {
        text: 'Fake it till you make it (+25 gold)',
        outcome: { gold: 25, message: '"Absolutely, I architected that entire system." (You copy-pasted from Stack Overflow.)' },
      },
      {
        text: 'Have a breakdown (Lose 20 HP, reduce 25 stress)',
        outcome: { hp: -20, stress: -25, message: 'You cried in the bathroom for 30 minutes. Honestly? You feel so much better now.' },
      },
    ],
  },
  {
    id: 'unpaid_internship',
    title: 'The Unpaid Internship',
    description: '"It\'s a great learning opportunity!" The posting requires 5 years of experience, a PhD, and offers $0/hr plus "exposure."',
    icon: '🎓',
    choices: [
      {
        text: 'Take it for experience (Upgrade random card, lose 30 gold)',
        outcome: { upgradeRandomCard: true, gold: -30, message: 'You learned a lot. You also learned what ramen tastes like for breakfast, lunch, and dinner.' },
      },
      {
        text: 'Demand payment (+40 gold)',
        outcome: { gold: 40, message: '"My time has value." They were so shocked they actually paid you.' },
      },
      {
        text: 'Report to labor board (Remove chosen card, heal 15 HP)',
        outcome: { removeChosenCard: 1, hp: 15, message: 'Justice was served. The company now pays minimum wage. Progress.' },
      },
    ],
  },
];
