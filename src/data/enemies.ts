import type { EnemyDef } from '../types';

export const enemies: Record<string, EnemyDef> = {
  null_pointer: {
    id: 'null_pointer',
    name: 'Null Pointer',
    hp: 28,
    icon: '🔇',
    moves: [
      { name: 'Null Reference', type: 'attack', damage: 6, icon: '💢' },
      { name: 'Void Return', type: 'defend', block: 6, icon: '🛡️' },
      { name: 'Segfault', type: 'attack', damage: 10, icon: '⚠️' },
    ],
  },
  memory_leak: {
    id: 'memory_leak',
    name: 'Memory Leak',
    hp: 35,
    icon: '💧',
    moves: [
      { name: 'Allocate', type: 'buff', applyToSelf: { strength: 1 }, icon: '📈' },
      { name: 'Overflow', type: 'attack', damage: 8, icon: '💥' },
      { name: 'Heap Corruption', type: 'attack', damage: 5, times: 2, icon: '🔨' },
    ],
  },
  regex_gremlin: {
    id: 'regex_gremlin',
    name: 'Regex Gremlin',
    hp: 24,
    icon: '👹',
    moves: [
      { name: 'Backtrack', type: 'attack', damage: 4, times: 2, icon: '↩️' },
      { name: 'Catastrophic Match', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🌀' },
      { name: 'Greedy Match', type: 'attack', damage: 12, icon: '🔥' },
    ],
  },
  infinite_loop: {
    id: 'infinite_loop',
    name: 'Infinite Loop',
    hp: 30,
    icon: '🔁',
    moves: [
      { name: 'While True', type: 'attack', damage: 5, icon: '⚡' },
      { name: 'Stack Frame', type: 'attack_defend', damage: 4, block: 4, icon: '📚' },
      { name: 'Recursion', type: 'attack', damage: 7, icon: '♾️' },
    ],
  },
  // Elite
  legacy_codebase: {
    id: 'legacy_codebase',
    name: 'Legacy Codebase',
    hp: 70,
    icon: '📜',
    isElite: true,
    moves: [
      { name: 'Spaghetti Code', type: 'attack', damage: 8, times: 2, icon: '🍝' },
      { name: 'Tech Debt', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈' },
      { name: 'Dependency Hell', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '⛓️' },
      { name: 'Merge Conflict', type: 'attack', damage: 18, icon: '💥' },
    ],
  },
  race_condition: {
    id: 'race_condition',
    name: 'Race Condition',
    hp: 60,
    icon: '🏃',
    isElite: true,
    moves: [
      { name: 'Deadlock', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🔒' },
      { name: 'Thread Collision', type: 'attack', damage: 6, times: 3, icon: '💫' },
      { name: 'Priority Inversion', type: 'attack_defend', damage: 12, block: 8, icon: '🔀' },
    ],
  },
  // Boss
  ai_overlord: {
    id: 'ai_overlord',
    name: 'The AI Overlord',
    hp: 120,
    icon: '🤖',
    isBoss: true,
    moves: [
      { name: 'Train Model', type: 'buff', applyToSelf: { strength: 3 }, icon: '🧠' },
      { name: 'Neural Network', type: 'attack', damage: 8, times: 3, icon: '🕸️' },
      { name: 'Gradient Descent', type: 'attack', damage: 20, icon: '📉' },
      { name: 'Overfit', type: 'attack_defend', damage: 15, block: 15, icon: '📊' },
      { name: 'AGI Achieved', type: 'attack', damage: 30, icon: '🌟' },
    ],
  },
};

export const normalEncounters: string[][] = [
  ['null_pointer'],
  ['memory_leak'],
  ['regex_gremlin'],
  ['infinite_loop'],
  ['null_pointer', 'regex_gremlin'],
  ['memory_leak', 'infinite_loop'],
];

export const eliteEncounters: string[][] = [
  ['legacy_codebase'],
  ['race_condition'],
];

export const bossEncounters: string[][] = [
  ['ai_overlord'],
];
