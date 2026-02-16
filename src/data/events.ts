import type { EventDef } from '../types';

export const events: EventDef[] = [
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
        text: 'Accept mentoring (Remove a random card)',
        outcome: { removeRandomCard: true, message: 'Your deck feels leaner and more focused.' },
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
        outcome: { addItem: 'on_call_rotation', hp: -5, message: 'The pager vibrates ominously. +2 Dexterity, but you\'ll never sleep again.' },
      },
      {
        text: 'Meditate among the servers (Heal 20 HP)',
        outcome: { hp: 20, message: 'The hum of servers calms your mind.' },
      },
    ],
  },
  // Frontend Dev — themed events
  {
    id: 'npm_black_hole',
    title: 'The NPM Black Hole',
    description: 'Your node_modules folder has achieved sentience and is demanding more dependencies.',
    icon: '📦',
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
];
