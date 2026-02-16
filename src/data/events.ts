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
        text: 'Meditate among the servers (Heal 20 HP)',
        outcome: { hp: 20, message: 'The hum of servers calms your mind.' },
      },
    ],
  },
];
