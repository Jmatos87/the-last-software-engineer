import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// Consumable Events — Neutral + Class-Specific
// ═══════════════════════════════════════════════════════════════

export const consumableEvents: EventDef[] = [
  // ── Neutral Consumable Events ──

  {
    id: 'vending_machine_glitch',
    title: 'Vending Machine Glitch',
    description: 'The office vending machine is glitching out. Items are dispensing at random. The "Out of Order" sign fell off years ago.',
    icon: '🎰',
    choices: [
      {
        text: 'Grab everything you can (+2 common consumables, +10 stress)',
        outcome: { addConsumable: 'random_common_x2', stress: 10, message: 'You shoved your arms in and grabbed wildly. Two items fell out. Security is watching.' },
      },
      {
        text: 'Take one carefully (+1 common consumable, +20 gold)',
        outcome: { addConsumable: 'random_common', gold: 20, message: 'One item dispensed cleanly. You also found $20 in the coin return.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'You resist the temptation. The machine beeps sadly.' },
      },
    ],
  },
  {
    id: 'senior_devs_desk',
    title: "The Senior Dev's Desk",
    description: 'A recently-departed senior dev left their desk fully stocked. Energy drinks, debugging tools, mysterious unlabeled bottles. Their loss is your gain.',
    icon: '🧰',
    choices: [
      {
        text: 'Raid the good stuff (+1 uncommon consumable)',
        outcome: { addConsumable: 'random_uncommon', message: 'You found something premium hidden in the back drawer. Nice.' },
      },
      {
        text: 'Leave a thank-you note (+25 gold)',
        outcome: { gold: 25, message: 'You left a sticky note and took the petty cash from the pencil cup.' },
      },
      {
        text: 'Meditate at the empty desk (Heal 15 HP, -10 stress)',
        outcome: { hp: 15, stress: -10, message: 'You sat in their ergonomic chair and felt at peace. The Herman Miller embraced you.' },
      },
    ],
  },
  {
    id: 'conference_swag_table',
    title: 'Conference Swag Table',
    description: 'A tech conference left behind a table of swag. Branded stress balls, energy drinks with startup logos, and one suspiciously premium item in the back.',
    icon: '🎁',
    choices: [
      {
        text: 'Fill your bag (+2 common consumables, +5 stress)',
        outcome: { addConsumable: 'random_common_x2', stress: 5, message: 'You grabbed two items while elbowing past other scavengers. Conference networking at its finest.' },
      },
      {
        text: 'Go for the premium item (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You reached past the branded pens and grabbed the good stuff. A rare find.' },
      },
      {
        text: 'Sell your conference badge (+35 gold)',
        outcome: { gold: 35, message: 'Someone paid $35 for your "VIP All-Access" badge. It was general admission.' },
      },
    ],
  },
  {
    id: 'code_archaeology',
    title: 'Code Archaeology',
    description: 'While refactoring, you discover ancient code with a comment: "DO NOT DELETE — contains powerful secrets." The code is from 2009.',
    icon: '🏺',
    choices: [
      {
        text: 'Study the ancient code (+1 uncommon consumable + upgrade random card, -10 HP)',
        outcome: { addConsumable: 'random_uncommon', upgradeRandomCard: true, hp: -10, message: 'The code was jQuery spaghetti, but hidden within was wisdom. And a useful utility.' },
      },
      {
        text: 'Refactor it (Remove chosen card, heal 15 HP)',
        outcome: { removeChosenCard: 1, hp: 15, message: 'You cleaned up the code and felt spiritually renewed. Technical debt: reduced.' },
      },
      {
        text: 'Add a TODO comment (+20 gold)',
        outcome: { gold: 20, message: '"// TODO: refactor this someday" — you, continuing the tradition since 2009.' },
      },
    ],
  },

  // ── Class-Specific Consumable Events ──

  {
    id: 'npm_free_tier',
    title: 'NPM Free Tier Runs Out',
    description: 'Your npm free tier just expired. Private packages are locked. But wait — there are emergency supplies in the .npm cache.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'Raid the cache (+1 uncommon consumable, +5 stress)',
        outcome: { addConsumable: 'random_uncommon', stress: 5, message: 'You found a perfectly preserved debugging tool in node_modules/.cache. Don\'t ask questions.' },
      },
      {
        text: 'Pay for premium (Lose 30 gold, +2 common consumables)',
        outcome: { gold: -30, addConsumable: 'random_common_x2', message: 'npm Premium unlocked. Two emergency supplies delivered. Your wallet weeps.' },
      },
      {
        text: 'Go open source (+20 gold)',
        outcome: { gold: 20, message: 'You published everything as open source. Someone donated $20. The community provides.' },
      },
    ],
  },
  {
    id: 'staging_is_down',
    title: 'Staging is Down (Again)',
    description: 'The staging environment crashed at 2 AM. But in the wreckage, the monitoring dashboard shows some salvageable resources.',
    icon: '🔥',
    class: 'backend',
    choices: [
      {
        text: 'Salvage from the wreckage (+1 uncommon consumable)',
        outcome: { addConsumable: 'random_uncommon', message: 'You pulled a useful tool from the smoldering Docker containers. It still works.' },
      },
      {
        text: 'Fix staging properly (Upgrade random card, -8 HP)',
        outcome: { upgradeRandomCard: true, hp: -8, message: 'You fixed staging AND learned something. Sleep deprivation is a hell of a teacher.' },
      },
      {
        text: 'Just use production (-15 stress, gain 10 stress)',
        outcome: { stress: 10, gold: 25, message: '"Testing in production" isn\'t a sin, it\'s a lifestyle. +25 gold from the chaos.' },
      },
    ],
  },
  {
    id: 'vendor_demo_kit',
    title: 'Vendor Demo Emergency Kit',
    description: 'A vendor left their demo emergency kit in the conference room. It contains premium supplies labeled "FOR EXECUTIVE DEMOS ONLY."',
    icon: '🧳',
    class: 'architect',
    choices: [
      {
        text: 'Take the premium supplies (+1 rare consumable, +10 stress)',
        outcome: { addConsumable: 'random_rare', stress: 10, message: 'You grabbed something powerful. The vendor will be very confused tomorrow.' },
      },
      {
        text: 'Return it for a favor (+30 gold, +1 common consumable)',
        outcome: { gold: 30, addConsumable: 'random_common', message: 'The vendor was grateful. They gave you gold and a sample from their stash.' },
      },
      {
        text: 'Study the demo architecture (Upgrade random card)',
        outcome: { upgradeRandomCard: true, message: 'Their demo was actually well-architected. You learned something. Shocking.' },
      },
    ],
  },
  {
    id: 'eval_cache_hit',
    title: 'The Eval Cache Hit',
    description: 'Your evaluation pipeline hit an unexpected cache. Pre-computed results from a previous experiment are intact. The data is pristine.',
    icon: '🗃️',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Extract the cached resources (+1 uncommon consumable, +1 common consumable)',
        outcome: { addConsumable: 'random_uncommon', message: 'You extracted useful tools from the cache. Efficiency at its finest.' },
      },
      {
        text: 'Retrain with cached data (Upgrade random card, -6 HP)',
        outcome: { upgradeRandomCard: true, hp: -6, message: 'The cached data accelerated your training run. GPU hours saved. Brain cells lost.' },
      },
      {
        text: 'Sell the compute credits (+40 gold)',
        outcome: { gold: 40, message: 'You sold the unused compute credits. Someone else can train their model.' },
      },
    ],
  },
];
