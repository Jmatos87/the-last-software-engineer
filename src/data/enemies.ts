import type { EnemyDef } from '../types';

export const enemies: Record<string, EnemyDef> = {
  // ── Common Enemies ──

  // Resume ATS: 3 attacks, 1 discard+stress (75/25)
  resume_ats: {
    id: 'resume_ats',
    name: 'Resume ATS Filter',
    hp: 30,
    icon: '🤖',
    moves: [
      { name: 'Keyword Scan', type: 'attack', damage: 6, icon: '🔍' },
      { name: 'Format Check', type: 'attack', damage: 5, icon: '📋' },
      { name: 'Auto-Reject', type: 'attack', damage: 9, icon: '❌' },
      { name: 'Parse Failure', type: 'discard', discardCount: 1, stressDamage: 4, icon: '🗑️' },
    ],
  },

  // Legacy ATS: 3 attacks, 1 defend (75/25)
  legacy_ats: {
    id: 'legacy_ats',
    name: 'Legacy ATS',
    hp: 40,
    icon: '🖨️',
    moves: [
      { name: 'Connection Lost', type: 'attack', damage: 8, icon: '📡' },
      { name: 'System Error', type: 'attack', damage: 6, icon: '⚠️' },
      { name: 'Loading...', type: 'defend', block: 8, icon: '⏳' },
      { name: 'Timeout Slam', type: 'attack', damage: 10, icon: '💤' },
    ],
  },

  // AI-Powered ATS: 3 attacks, 1 discard (75/25)
  ai_ats: {
    id: 'ai_ats',
    name: 'AI-Powered ATS',
    hp: 26,
    icon: '🧠',
    moves: [
      { name: 'Deep Scan', type: 'attack', damage: 7, icon: '🔬' },
      { name: 'Pattern Match', type: 'attack', damage: 5, icon: '🎯' },
      { name: 'Neural Reject', type: 'discard', discardCount: 2, icon: '🗑️' },
      { name: 'AI Assessment', type: 'attack', damage: 9, icon: '⚡' },
    ],
  },

  // Recruiter Bot: 3 attacks, 1 debuff (75/25)
  recruiter_bot: {
    id: 'recruiter_bot',
    name: 'Recruiter Bot',
    hp: 34,
    icon: '🤳',
    moves: [
      { name: 'Cold Email', type: 'attack', damage: 5, icon: '📧' },
      { name: 'Exciting Opportunity!', type: 'debuff', applyToTarget: { hope: 3 }, icon: '✨' },
      { name: 'Let\'s Circle Back', type: 'attack', damage: 7, icon: '🔄' },
      { name: 'Actually, It\'s Contract', type: 'attack', damage: 8, stressDamage: 4, icon: '📄' },
    ],
  },

  // Ghost Company: 3 attacks, 1 debuff+vanish (75/25)
  ghost_company: {
    id: 'ghost_company',
    name: 'Ghost Company',
    hp: 22,
    icon: '👻',
    moves: [
      { name: 'Form Letter', type: 'attack', damage: 5, icon: '📨' },
      { name: 'Radio Silence', type: 'attack', damage: 6, icon: '📵' },
      { name: 'Vanish', type: 'debuff', applyToTarget: { ghosted: 1 }, icon: '💨' },
    ],
  },

  // Take-Home: 3 attacks (escalating), 1 stress (75/25)
  take_home: {
    id: 'take_home',
    name: 'Take-Home Assignment',
    hp: 36,
    icon: '📝',
    moves: [
      { name: 'Requirements Doc', type: 'attack', damage: 6, icon: '📄' },
      { name: 'Scope Creep', type: 'attack', damage: 8, icon: '📈' },
      { name: 'Edge Cases', type: 'attack', damage: 10, icon: '🔥' },
      { name: 'Due Tomorrow', type: 'stress_attack', stressDamage: 8, icon: '⏰' },
    ],
  },

  // ── Elite Enemies ──

  // Unpaid Take-Home: 3 attacks, 1 buff (75/25)
  unpaid_take_home: {
    id: 'unpaid_take_home',
    name: 'Unpaid Take-Home',
    hp: 75,
    icon: '💸',
    isElite: true,
    moves: [
      { name: 'Scope Creep', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈' },
      { name: 'Crunch Time', type: 'attack', damage: 10, icon: '😰' },
      { name: 'Pair Stress', type: 'attack', damage: 7, times: 2, icon: '😵' },
      { name: 'Full-Stack Assault', type: 'attack', damage: 14, icon: '💥' },
    ],
  },

  // LinkedIn Influencer: 3 attacks, 1 buff (75/25)
  linkedin_influencer: {
    id: 'linkedin_influencer',
    name: 'LinkedIn Influencer',
    hp: 65,
    icon: '📱',
    isElite: true,
    moves: [
      { name: 'Viral Post', type: 'attack', damage: 10, icon: '📢' },
      { name: 'Humble Brag', type: 'debuff', applyToTarget: { cringe: 2 }, icon: '😬' },
      { name: '#Blessed', type: 'attack', damage: 8, icon: '🙏' },
      { name: 'Engagement Farming', type: 'attack_defend', damage: 7, block: 6, applyToSelf: { regen: 2 }, icon: '🌱' },
    ],
  },

  // ── Boss ──

  // HR Phone Screen: 5 attacks, 1 debuff (83/17 — boss gets extra mean)
  hr_phone_screen: {
    id: 'hr_phone_screen',
    name: 'HR Phone Screen',
    hp: 140,
    icon: '📞',
    isBoss: true,
    moves: [
      { name: 'Tell Me About Yourself', type: 'attack', damage: 8, icon: '🎤' },
      { name: 'Why This Company?', type: 'attack', damage: 10, icon: '🏢' },
      { name: 'Greatest Weakness?', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '😓' },
      { name: 'Where Do You See Yourself?', type: 'attack', damage: 12, icon: '🔮' },
      { name: 'Salary Expectations?', type: 'attack', damage: 14, stressDamage: 6, icon: '💵' },
      { name: 'We\'ll Be In Touch', type: 'attack', damage: 18, stressDamage: 10, icon: '☎️' },
    ],
  },
};

export const normalEncounters: string[][] = [
  // Solo encounters
  ['resume_ats'],
  ['legacy_ats'],
  ['ai_ats'],
  ['recruiter_bot'],
  ['ghost_company'],
  ['take_home'],
  // Duo combos
  ['resume_ats', 'recruiter_bot'],
  ['ghost_company', 'recruiter_bot'],
  ['ai_ats', 'ghost_company'],
  ['take_home', 'resume_ats'],
  // Trio — the application gauntlet
  ['resume_ats', 'recruiter_bot', 'ghost_company'],
];

export const eliteEncounters: string[][] = [
  ['unpaid_take_home'],
  ['linkedin_influencer'],
];

export const bossEncounters: string[][] = [
  ['hr_phone_screen'],
];
