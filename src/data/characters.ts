import type { CharacterDef } from '../types';

export const characters: CharacterDef[] = [
  {
    id: 'frontend_dev',
    name: 'Frontend Dev',
    title: 'The Component Crafter',
    hp: 75,
    energy: 3,
    description: 'A master of DOM manipulation. Wields Console.log and Div Blocks.',
    starterDeckIds: [
      'console_log', 'console_log', 'console_log', 'console_log', 'console_log',
      'div_block', 'div_block', 'div_block',
      'refactor',
      'deploy_to_prod',
    ],
    icon: '💻',
    available: true,
  },
  {
    id: 'backend_dev',
    name: 'Backend Dev',
    title: 'The API Architect',
    hp: 85,
    energy: 3,
    description: 'Excels at building robust systems. Prefers strength over speed.',
    starterDeckIds: [],
    icon: '🖥️',
    available: false,
  },
  {
    id: 'devops_engineer',
    name: 'DevOps Engineer',
    title: 'The Pipeline Builder',
    hp: 70,
    energy: 3,
    description: 'Automates everything. Masters of block and scaling.',
    starterDeckIds: [],
    icon: '⚙️',
    available: false,
  },
];
