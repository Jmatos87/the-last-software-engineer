import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// FRONTEND DEV — Themed Events
// ═══════════════════════════════════════════════════════════════

export const frontendEvents: EventDef[] = [
  {
    id: 'npm_black_hole',
    title: 'The NPM Black Hole',
    description: 'Your node_modules folder has achieved sentience and is demanding more dependencies.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'npm install --force (Gain Callback Hell card)',
        outcome: { addCard: 'callback_hell', message: 'You installed 2,847 packages. One of them was useful.' },
      },
      {
        text: 'rm -rf node_modules (Lose 10 HP, gain 30 gold)',
        outcome: { hp: -10, gold: 30, message: 'A weight is lifted. Literally — you freed 4GB of disk space.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'The node_modules folder whispers "I\'ll be back" as you leave.' },
      },
    ],
  },
  {
    id: 'stack_overflow_down',
    title: 'Stack Overflow is Down',
    description: 'The unthinkable has happened. Stack Overflow is returning 503. Developers worldwide are in a panic.',
    icon: '🚨',
    class: 'frontend',
    choices: [
      {
        text: 'Code from memory (Gain Async/Await card, lose 8 HP)',
        outcome: { addCard: 'async_await', hp: -8, message: 'You actually remembered how Promises work. It cost you several brain cells.' },
      },
      {
        text: 'Pretend to be productive (+25 gold)',
        outcome: { gold: 25, message: 'You spent 3 hours adjusting your VS Code theme instead.' },
      },
    ],
  },
  {
    id: 'css_centering_challenge',
    title: 'The CSS Centering Challenge',
    description: 'A mysterious div appears. It asks to be centered. Vertically AND horizontally. Every frontend dev\'s final boss.',
    icon: '🎯',
    class: 'frontend',
    choices: [
      {
        text: 'Use Flexbox (Gain Flexbox card)',
        outcome: { addCard: 'flexbox', message: 'justify-content: center; align-items: center; You did it. The legends were true.' },
      },
      {
        text: 'Use position: absolute + transform (Heal 15 HP)',
        outcome: { hp: 15, message: 'Hacky but it works. Just like everything else in CSS.' },
      },
      {
        text: 'Give up and use a table (Reduce 15 stress)',
        outcome: { stress: -15, message: 'It\'s 2026 and you used a <table> for layout. No regrets.' },
      },
    ],
  },
  {
    id: 'nyancat_shrine',
    title: 'The Nyancat Shrine',
    description: 'Deep in an abandoned WeWork, you find a shrine to the ancient Nyancat. Rainbow light pulses from within. The poptart beckons.',
    icon: '🐱',
    class: 'frontend',
    choices: [
      {
        text: 'Embrace the rainbow (Gain Nyancat Rainbow card, lose 12 HP)',
        outcome: { addCard: 'nyancat_rainbow', hp: -12, message: 'RGB flows through your veins. You are one with the meme.' },
      },
      {
        text: 'Offer gold to the cat (Lose 40 gold, heal 25 HP, reduce 20 stress)',
        outcome: { gold: -40, hp: 25, stress: -20, message: 'Nyancat purrs. The rainbow heals all wounds.' },
      },
      {
        text: 'Take the glowing headphones (Gain Noise-Canceling Headphones)',
        outcome: { addItem: 'noise_canceling_headphones', stress: 10, message: 'The headphones hum with ancient meme energy. Draw +1 card each turn!' },
      },
      {
        text: 'Nope',
        outcome: { message: 'You resist the meme. Nyancat looks disappointed.' },
      },
    ],
  },
  {
    id: 'bundle_size_crisis',
    title: 'The Bundle Size Crisis',
    description: 'Your production build is 47MB. The CDN is crying. Lighthouse score: 3. Your PM is asking why the site takes 40 seconds to load on mobile.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'Tree-shake everything (Upgrade random card, lose 8 HP)',
        outcome: { upgradeRandomCard: true, hp: -8, message: 'You removed 200 unused imports. Bundle dropped to 2MB. You dropped to the floor.' },
      },
      {
        text: 'Just lazy-load it (+20 gold, gain 10 stress)',
        outcome: { gold: 20, stress: 10, message: 'React.lazy() and a prayer. The waterfall chart looks like Niagara Falls.' },
      },
      {
        text: 'Ship it anyway (Gain random common, gain 15 stress)',
        outcome: { addCard: 'random_common', stress: 15, message: '"Users have good internet, right?" Narrator: They did not.' },
      },
    ],
  },
];
