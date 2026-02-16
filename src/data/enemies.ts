import type { EnemyDef } from '../types';

export const enemies: Record<string, EnemyDef> = {

  // ════════════════════════════════════════════════
  // ACT 1 — The Application Abyss
  // ════════════════════════════════════════════════

  // ── Act 1 Common Enemies ──

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

  ghost_company: {
    id: 'ghost_company',
    name: 'Ghost Company',
    hp: 22,
    icon: '👻',
    hideIntent: true,
    moves: [
      { name: 'Form Letter', type: 'attack', damage: 5, icon: '📨' },
      { name: 'Radio Silence', type: 'attack', damage: 6, icon: '📵' },
      { name: 'Vanish', type: 'debuff', applyToTarget: { ghosted: 1 }, icon: '💨' },
    ],
  },

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

  cover_letter_shredder: {
    id: 'cover_letter_shredder',
    name: 'Cover Letter Shredder',
    hp: 28,
    icon: '✂️',
    moves: [
      { name: 'Shred!', type: 'exhaust', exhaustCount: 1, icon: '✂️' },
      { name: 'Paper Cut', type: 'attack', damage: 7, icon: '📃' },
      { name: 'Confetti Storm', type: 'attack', damage: 5, stressDamage: 3, icon: '🎊' },
    ],
  },

  keyword_stuffer: {
    id: 'keyword_stuffer',
    name: 'Keyword Stuffer',
    hp: 24,
    icon: '🔑',
    moves: [
      { name: 'SEO Boost', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '📈' },
      { name: 'Buzzword Slap', type: 'attack', damage: 5, icon: '💬' },
      { name: 'Synergy!', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '🤝' },
      { name: 'Jargon Jab', type: 'attack', damage: 6, icon: '📝' },
    ],
  },

  job_board_troll: {
    id: 'job_board_troll',
    name: 'Job Board Troll',
    hp: 32,
    icon: '🧌',
    moves: [
      { name: 'Overqualified!', type: 'debuff', applyToTarget: { dexterity: -1 }, icon: '📜' },
      { name: 'Troll Smash', type: 'attack', damage: 7, icon: '👊' },
      { name: 'Underqualified!', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '📋' },
      { name: 'Flame War', type: 'attack', damage: 8, icon: '🔥' },
    ],
  },

  application_fee_scammer: {
    id: 'application_fee_scammer',
    name: 'Application Fee Scammer',
    hp: 20,
    icon: '💰',
    moves: [
      { name: 'Processing Fee', type: 'gold_steal', goldSteal: 8, icon: '💸' },
      { name: 'Admin Fee', type: 'gold_steal', goldSteal: 5, stressDamage: 3, icon: '🧾' },
      { name: 'Surcharge', type: 'attack', damage: 6, icon: '💳' },
    ],
  },

  entry_level_5yrs: {
    id: 'entry_level_5yrs',
    name: '"Entry Level" (5 Yrs Exp)',
    hp: 38,
    icon: '📋',
    moves: [
      { name: 'Impossible Requirements', type: 'attack_defend', damage: 6, block: 4, icon: '📝' },
      { name: 'Must Know 12 Frameworks', type: 'attack', damage: 8, icon: '📚' },
      { name: 'Fortify', type: 'defend', block: 8, icon: '🏗️' },
      { name: 'Gatekeep', type: 'attack', damage: 7, stressDamage: 3, icon: '🚧' },
    ],
  },

  linkedin_notification_swarm: {
    id: 'linkedin_notification_swarm',
    name: 'LinkedIn Notification',
    hp: 18,
    icon: '🔔',
    moves: [
      { name: 'Ping!', type: 'attack', damage: 4, stressDamage: 2, icon: '🔔' },
      { name: 'Buzz!', type: 'stress_attack', stressDamage: 5, icon: '📳' },
      { name: 'Ding!', type: 'attack', damage: 5, icon: '🛎️' },
    ],
  },

  // ── Act 1 Elite Enemies ──

  unpaid_take_home: {
    id: 'unpaid_take_home',
    name: 'Unpaid Take-Home Assignment',
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

  applicant_tracking_golem: {
    id: 'applicant_tracking_golem',
    name: 'Applicant Tracking Golem',
    hp: 80,
    icon: '⚙️',
    isElite: true,
    moves: [
      { name: 'Absorb Pattern', type: 'buff', applyToSelf: { strength: 1 }, icon: '🔄' },
      { name: 'System Slam', type: 'attack', damage: 12, icon: '⚙️' },
      { name: 'Data Crunch', type: 'attack', damage: 8, times: 2, icon: '💾' },
      { name: 'Process Queue', type: 'attack_defend', damage: 10, block: 8, icon: '📊' },
    ],
  },

  networking_event: {
    id: 'networking_event',
    name: 'The Networking Event',
    hp: 70,
    icon: '🍸',
    isElite: true,
    moves: [
      { name: 'Small Talk', type: 'stress_attack', stressDamage: 6, icon: '💬' },
      { name: 'Awkward Handshake', type: 'attack', damage: 9, stressDamage: 4, icon: '🤝' },
      { name: 'Elevator Pitch', type: 'attack', damage: 11, icon: '🗣️' },
      { name: 'Exchange Cards', type: 'buff', applyToSelf: { strength: 2 }, icon: '📇' },
    ],
  },

  automated_rejection: {
    id: 'automated_rejection',
    name: 'Automated Rejection Letter',
    hp: 60,
    icon: '✉️',
    isElite: true,
    moves: [
      { name: 'Demoralize', type: 'debuff', applyToTarget: { strength: -1 }, icon: '😞' },
      { name: 'Form Rejection', type: 'attack', damage: 10, stressDamage: 5, icon: '✉️' },
      { name: 'We\'ll Keep You On File', type: 'stress_attack', stressDamage: 8, icon: '📁' },
      { name: 'Not A Good Fit', type: 'attack', damage: 13, icon: '❌' },
    ],
  },

  // ── Act 1 Bosses ──

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

  ats_final_form: {
    id: 'ats_final_form',
    name: 'The ATS Final Form',
    hp: 160,
    icon: '🏗️',
    isBoss: true,
    moves: [
      // Phase 1: scans + discards
      { name: 'Full System Scan', type: 'attack', damage: 8, icon: '🔍' },
      { name: 'Resume Shredder', type: 'discard', discardCount: 2, stressDamage: 4, icon: '🗑️' },
      { name: 'Keyword Purge', type: 'attack', damage: 10, icon: '⚡' },
      { name: 'Database Overwrite', type: 'attack_defend', damage: 7, block: 10, icon: '💾' },
      // Phase 2: raw power (cycles into these as fight goes on)
      { name: 'TRANSFORM', type: 'buff', applyToSelf: { strength: 3 }, icon: '🔥' },
      { name: 'Maximum Overdrive', type: 'attack', damage: 16, icon: '💥' },
      { name: 'Total Rejection', type: 'attack', damage: 12, times: 2, icon: '❌' },
      { name: 'System Crash', type: 'attack', damage: 20, stressDamage: 8, icon: '💀' },
    ],
  },

  ghosting_phantom: {
    id: 'ghosting_phantom',
    name: 'The Ghosting Phantom',
    hp: 120,
    icon: '👻',
    isBoss: true,
    hideIntent: true,
    moves: [
      { name: 'Haunt', type: 'attack', damage: 9, stressDamage: 5, icon: '👻' },
      { name: 'Read Receipt', type: 'attack', damage: 11, icon: '✓' },
      { name: 'Gone Dark', type: 'stress_attack', stressDamage: 12, icon: '🌑' },
      { name: 'Spectral Slash', type: 'attack', damage: 13, icon: '💫' },
      { name: 'Maybe Next Time', type: 'debuff', applyToTarget: { weak: 2, ghosted: 2 }, icon: '💨' },
      { name: 'Full Ghosting', type: 'attack', damage: 15, stressDamage: 8, icon: '☠️' },
    ],
  },

  // ════════════════════════════════════════════════
  // ACT 2 — The Interview Gauntlet
  // ════════════════════════════════════════════════

  // ── Act 2 Common Enemies ──

  whiteboard_demon: {
    id: 'whiteboard_demon',
    name: 'Whiteboard Demon',
    hp: 45,
    icon: '📊',
    moves: [
      { name: 'Solve in O(n)', type: 'attack', damage: 10, icon: '📊' },
      { name: 'Time Complexity', type: 'attack', damage: 8, stressDamage: 4, icon: '⏱️' },
      { name: 'Edge Case', type: 'attack', damage: 12, icon: '🔥' },
      { name: 'Optimize This', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '📉' },
    ],
  },

  leetcode_goblin: {
    id: 'leetcode_goblin',
    name: 'LeetCode Goblin',
    hp: 35,
    icon: '👺',
    moves: [
      { name: 'Easy Problem', type: 'attack', damage: 6, icon: '🟢' },
      { name: 'Medium Problem', type: 'attack', damage: 8, icon: '🟡' },
      { name: 'Hard Problem', type: 'attack', damage: 11, icon: '🔴' },
      { name: 'Time Limit Exceeded', type: 'stress_attack', stressDamage: 7, icon: '⏰' },
    ],
  },

  culture_fit_enforcer: {
    id: 'culture_fit_enforcer',
    name: 'Culture Fit Enforcer',
    hp: 40,
    icon: '😊',
    moves: [
      { name: 'We\'re Like Family', type: 'stress_attack', stressDamage: 8, icon: '👨‍👩‍👧‍👦' },
      { name: 'Red Flag', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩' },
      { name: 'Pizza Parties!', type: 'stress_attack', stressDamage: 6, icon: '🍕' },
      { name: 'Forced Fun', type: 'attack', damage: 8, stressDamage: 4, icon: '🎉' },
    ],
  },

  behavioral_question_bot: {
    id: 'behavioral_question_bot',
    name: 'Behavioral Question Bot',
    hp: 38,
    icon: '🎭',
    moves: [
      { name: 'Tell Me About A Time...', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🕐' },
      { name: 'Why Should We Hire You?', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🤔' },
      { name: 'Where Do You See Yourself?', type: 'stress_attack', stressDamage: 7, icon: '🔮' },
      { name: 'Competency Check', type: 'attack', damage: 9, icon: '✅' },
    ],
  },

  pair_programmer_enemy: {
    id: 'pair_programmer_enemy',
    name: 'The Pair Programmer',
    hp: 42,
    icon: '👥',
    moves: [
      { name: 'Copy That', type: 'attack_defend', damage: 7, block: 7, icon: '📋' },
      { name: 'Actually...', type: 'attack', damage: 9, icon: '☝️' },
      { name: 'Let Me Drive', type: 'attack', damage: 8, stressDamage: 3, icon: '⌨️' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '👀' },
    ],
  },

  trivia_quizmaster: {
    id: 'trivia_quizmaster',
    name: 'Trivia Quizmaster',
    hp: 30,
    icon: '❓',
    moves: [
      { name: 'Pop Quiz!', type: 'attack', damage: 10, icon: '❓' },
      { name: 'Trick Question', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🃏' },
      { name: 'Bonus Round', type: 'attack', damage: 7, icon: '⭐' },
      { name: 'Stumped!', type: 'stress_attack', stressDamage: 6, icon: '😶' },
    ],
  },

  recruiter_middleman: {
    id: 'recruiter_middleman',
    name: 'Recruiter Middleman',
    hp: 36,
    icon: '🤵',
    moves: [
      { name: 'Shield Candidates', type: 'buff_allies', applyToTarget: { dexterity: 1 }, icon: '🛡️' },
      { name: 'Stall', type: 'defend', block: 10, icon: '⏳' },
      { name: 'Pipeline Management', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '📊' },
      { name: 'The Runaround', type: 'stress_attack', stressDamage: 5, icon: '🔄' },
    ],
  },

  take_home_v2: {
    id: 'take_home_v2',
    name: 'Take-Home Project v2',
    hp: 50,
    icon: '💻',
    moves: [
      { name: 'MVP Sprint', type: 'attack', damage: 8, icon: '🏃' },
      { name: 'Feature Creep', type: 'buff', applyToSelf: { strength: 1 }, icon: '📈' },
      { name: 'Deploy Pressure', type: 'attack', damage: 11, stressDamage: 4, icon: '🚀' },
      { name: 'Stack Overflow', type: 'attack_defend', damage: 9, block: 5, icon: '📚' },
    ],
  },

  the_lowballer: {
    id: 'the_lowballer',
    name: 'The Lowballer',
    hp: 34,
    icon: '💵',
    moves: [
      { name: 'We Offer Exposure', type: 'gold_steal', goldSteal: 8, stressDamage: 4, icon: '💸' },
      { name: 'Budget Cuts', type: 'gold_steal', goldSteal: 6, icon: '✂️' },
      { name: 'Take It Or Leave It', type: 'attack', damage: 9, icon: '🤷' },
      { name: 'Equity Instead', type: 'stress_attack', stressDamage: 7, icon: '📉' },
    ],
  },

  zoom_fatigue: {
    id: 'zoom_fatigue',
    name: 'Zoom Fatigue',
    hp: 44,
    icon: '😴',
    moves: [
      { name: 'Buffer...', type: 'exhaust', exhaustCount: 1, icon: '🔄' },
      { name: 'You\'re On Mute', type: 'attack', damage: 8, icon: '🔇' },
      { name: 'Camera Off Despair', type: 'stress_attack', stressDamage: 6, icon: '📷' },
      { name: 'Technical Difficulties', type: 'exhaust', exhaustCount: 1, stressDamage: 3, icon: '⚠️' },
    ],
  },

  reference_checker: {
    id: 'reference_checker',
    name: 'Reference Checker',
    hp: 32,
    icon: '🔍',
    moves: [
      { name: 'Background Scan', type: 'attack', damage: 8, icon: '🔍' },
      { name: 'Inconsistency Found', type: 'attack', damage: 12, icon: '⚠️' },
      { name: 'Verify Credentials', type: 'debuff', applyToTarget: { weak: 2 }, icon: '📋' },
      { name: 'Call References', type: 'attack', damage: 9, stressDamage: 3, icon: '📞' },
    ],
  },

  scheduling_nightmare: {
    id: 'scheduling_nightmare',
    name: 'Scheduling Nightmare',
    hp: 40,
    icon: '📅',
    moves: [
      { name: 'Reschedule', type: 'stress_attack', stressDamage: 6, icon: '📅' },
      { name: 'Double-Booked', type: 'attack', damage: 10, icon: '📆' },
      { name: 'Time Zone Chaos', type: 'attack', damage: 7, stressDamage: 4, icon: '🌐' },
      { name: 'Calendar Tetris', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '🧩' },
    ],
  },

  // ── Act 2 Elite Enemies ──

  senior_dev_interrogator: {
    id: 'senior_dev_interrogator',
    name: 'Senior Dev Interrogator',
    hp: 100,
    icon: '🧓',
    isElite: true,
    moves: [
      { name: 'Explain Your Process', type: 'attack', damage: 10, stressDamage: 5, icon: '🔬' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀' },
      { name: 'Deep Dive', type: 'attack', damage: 14, icon: '🤿' },
      { name: 'Years of Experience', type: 'buff', applyToSelf: { strength: 2 }, icon: '📅' },
    ],
  },

  whiteboard_hydra: {
    id: 'whiteboard_hydra',
    name: 'The Whiteboard Hydra',
    hp: 90,
    icon: '🐉',
    isElite: true,
    moves: [
      { name: 'Follow-Up Question', type: 'attack', damage: 9, icon: '❓' },
      { name: 'Multi-Part Problem', type: 'attack', damage: 7, times: 2, icon: '📝' },
      { name: 'Whiteboard Barrage', type: 'attack', damage: 12, stressDamage: 4, icon: '📊' },
      { name: 'Grow Heads', type: 'buff', applyToSelf: { strength: 2 }, icon: '🐲' },
    ],
  },

  hr_gatekeeper: {
    id: 'hr_gatekeeper',
    name: 'HR Gatekeeper',
    hp: 85,
    icon: '🚪',
    isElite: true,
    moves: [
      { name: 'Bureaucracy Wall', type: 'defend', block: 15, icon: '🧱' },
      { name: 'Red Tape', type: 'stress_attack', stressDamage: 8, icon: '📎' },
      { name: 'Policy Enforcement', type: 'attack_defend', damage: 10, block: 8, icon: '📋' },
      { name: 'Access Denied', type: 'attack', damage: 14, stressDamage: 5, icon: '🚫' },
    ],
  },

  the_algorithm: {
    id: 'the_algorithm',
    name: 'The Algorithm',
    hp: 110,
    icon: '🧮',
    isElite: true,
    moves: [
      { name: 'Analyze Pattern', type: 'buff', applyToSelf: { strength: 1, dexterity: 1 }, icon: '📊' },
      { name: 'Optimized Strike', type: 'attack', damage: 12, icon: '⚡' },
      { name: 'Recursive Loop', type: 'attack', damage: 8, times: 2, icon: '🔄' },
      { name: 'Machine Learning', type: 'attack_defend', damage: 11, block: 6, icon: '🤖' },
      { name: 'Neural Overload', type: 'attack', damage: 16, stressDamage: 6, icon: '🧠' },
    ],
  },

  crunch_time_manager: {
    id: 'crunch_time_manager',
    name: 'Crunch Time Manager',
    hp: 95,
    icon: '⏰',
    isElite: true,
    moves: [
      { name: 'Need This By EOD', type: 'attack', damage: 10, stressDamage: 6, icon: '⏰' },
      { name: 'Overtime Mandate', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈' },
      { name: 'Weekend Work', type: 'attack', damage: 13, stressDamage: 5, icon: '📅' },
      { name: 'Sprint Review', type: 'attack', damage: 15, icon: '🏃' },
      { name: 'All-Hands Pressure', type: 'attack', damage: 18, stressDamage: 8, icon: '💥' },
    ],
  },

  // ── Act 2 Bosses ──

  panel_interview_hydra: {
    id: 'panel_interview_hydra',
    name: 'Panel Interview Hydra',
    hp: 200,
    icon: '🐲',
    isBoss: true,
    moves: [
      // Three "interviewers" — cycling attack patterns
      { name: 'Technical Question', type: 'attack', damage: 10, icon: '🔧' },
      { name: 'Stress Question', type: 'stress_attack', stressDamage: 10, icon: '😰' },
      { name: 'Panel Buff', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈' },
      { name: 'Cross-Examination', type: 'attack', damage: 14, stressDamage: 5, icon: '⚔️' },
      { name: 'Group Deliberation', type: 'defend', block: 15, icon: '🤔' },
      { name: 'Final Verdict', type: 'attack', damage: 18, stressDamage: 8, icon: '⚖️' },
    ],
  },

  live_coding_challenge: {
    id: 'live_coding_challenge',
    name: 'The Live Coding Challenge',
    hp: 180,
    icon: '⌨️',
    isBoss: true,
    moves: [
      { name: 'Timer Start', type: 'attack', damage: 8, icon: '⏱️' },
      { name: 'Syntax Error', type: 'attack', damage: 10, stressDamage: 4, icon: '🔴' },
      { name: 'Runtime Exception', type: 'attack', damage: 12, icon: '💥' },
      { name: 'Compiler Fury', type: 'buff', applyToSelf: { strength: 3 }, icon: '🔥' },
      { name: 'Stack Overflow', type: 'attack', damage: 14, stressDamage: 6, icon: '📚' },
      { name: 'Segfault', type: 'attack', damage: 18, icon: '💀' },
      { name: 'TIME\'S UP!', type: 'attack', damage: 22, stressDamage: 12, icon: '⏰' },
    ],
  },

  vp_of_engineering: {
    id: 'vp_of_engineering',
    name: 'The VP of Engineering',
    hp: 220,
    icon: '👔',
    isBoss: true,
    moves: [
      // Phase 1: "casual chat" — debuffs
      { name: 'Let\'s Chat Casually', type: 'debuff', applyToTarget: { weak: 2 }, icon: '☕' },
      { name: 'Culture Assessment', type: 'stress_attack', stressDamage: 8, icon: '🏢' },
      { name: 'Subtle Probe', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🔍' },
      { name: 'Strategic Vision', type: 'attack', damage: 10, icon: '🎯' },
      // Phase 2: "technical deep-dive" — raw damage
      { name: 'Technical Deep-Dive', type: 'buff', applyToSelf: { strength: 3 }, icon: '🤿' },
      { name: 'Architecture Review', type: 'attack', damage: 16, icon: '🏗️' },
      { name: 'Scale Question', type: 'attack', damage: 14, stressDamage: 6, icon: '📊' },
      { name: 'Executive Decision', type: 'attack', damage: 20, stressDamage: 10, icon: '⚡' },
    ],
  },

  // ════════════════════════════════════════════════
  // ACT 3 — Corporate Final Round
  // ════════════════════════════════════════════════

  // ── Act 3 Common Enemies ──

  system_design_titan: {
    id: 'system_design_titan',
    name: 'System Design Titan',
    hp: 55,
    icon: '🏛️',
    moves: [
      { name: 'Let\'s Talk Scalability', type: 'attack_defend', damage: 8, block: 6, icon: '📐' },
      { name: 'Load Balancer', type: 'defend', block: 12, icon: '⚖️' },
      { name: 'Distributed Slam', type: 'attack', damage: 12, icon: '🌐' },
      { name: 'Microservice Barrage', type: 'attack', damage: 7, times: 2, icon: '🔧' },
    ],
  },

  salary_negotiator: {
    id: 'salary_negotiator',
    name: 'Salary Negotiator',
    hp: 45,
    icon: '💼',
    moves: [
      { name: 'Lowball Offer', type: 'gold_steal', goldSteal: 15, icon: '💸' },
      { name: 'Market Rate Denial', type: 'attack', damage: 10, stressDamage: 5, icon: '📉' },
      { name: 'Benefits Package', type: 'gold_steal', goldSteal: 10, stressDamage: 3, icon: '📦' },
      { name: 'Final Offer', type: 'attack', damage: 14, icon: '🤝' },
    ],
  },

  imposter_syndrome_common: {
    id: 'imposter_syndrome_common',
    name: 'Imposter Syndrome',
    hp: 40,
    icon: '🎭',
    moves: [
      { name: 'You Don\'t Belong', type: 'stress_attack', stressDamage: 10, icon: '😰' },
      { name: 'Self Doubt', type: 'debuff', applyToTarget: { weak: 2 }, icon: '😟' },
      { name: 'Anxiety Spike', type: 'stress_attack', stressDamage: 12, icon: '😱' },
      { name: 'Spiral', type: 'attack', damage: 8, stressDamage: 6, icon: '🌀' },
    ],
  },

  benefits_mimic: {
    id: 'benefits_mimic',
    name: 'Benefits Package Mimic',
    hp: 50,
    icon: '📦',
    moves: [
      { name: 'Looks Great!', type: 'defend', block: 5, icon: '✨' },
      { name: 'SURPRISE!', type: 'attack', damage: 18, stressDamage: 6, icon: '💥' },
      { name: 'Fine Print', type: 'attack', damage: 10, icon: '📜' },
      { name: 'Reset Trap', type: 'defend', block: 5, icon: '📦' },
    ],
  },

  equity_phantom: {
    id: 'equity_phantom',
    name: 'The Equity Phantom',
    hp: 35,
    icon: '💎',
    moves: [
      { name: 'Vesting Cliff', type: 'exhaust', exhaustCount: 1, stressDamage: 4, icon: '📅' },
      { name: 'Paper Money', type: 'attack', damage: 9, icon: '📄' },
      { name: 'Dilution', type: 'debuff', applyToTarget: { strength: -1 }, icon: '💧' },
      { name: 'Golden Cage', type: 'exhaust', exhaustCount: 1, icon: '🔒' },
    ],
  },

  non_compete_clause: {
    id: 'non_compete_clause',
    name: 'Non-Compete Clause',
    hp: 48,
    icon: '📜',
    moves: [
      { name: 'Legal Binding', type: 'exhaust', exhaustCount: 2, icon: '⚖️' },
      { name: 'Cease & Desist', type: 'attack', damage: 11, icon: '🚫' },
      { name: 'Restriction', type: 'debuff', applyToTarget: { weak: 2, dexterity: -1 }, icon: '🔗' },
      { name: 'Court Order', type: 'attack', damage: 14, stressDamage: 5, icon: '⚖️' },
    ],
  },

  the_pivot: {
    id: 'the_pivot',
    name: 'The Pivot',
    hp: 42,
    icon: '🔄',
    moves: [
      { name: 'Pivoting to AI', type: 'attack', damage: 12, icon: '🤖' },
      { name: 'Pivoting to Blockchain', type: 'buff', applyToSelf: { strength: 2 }, icon: '⛓️' },
      { name: 'Pivoting to Cloud', type: 'attack_defend', damage: 8, block: 8, icon: '☁️' },
      { name: 'Pivoting to... Pivot', type: 'stress_attack', stressDamage: 8, icon: '🔄' },
    ],
  },

  burnout_ember: {
    id: 'burnout_ember',
    name: 'Burnout Ember',
    hp: 38,
    icon: '🔥',
    moves: [
      { name: 'Smolder', type: 'debuff', applyToTarget: { poison: 3 }, icon: '🔥' },
      { name: 'Flare Up', type: 'attack', damage: 8, stressDamage: 5, icon: '💥' },
      { name: 'Slow Burn', type: 'stress_attack', stressDamage: 10, icon: '🕯️' },
      { name: 'Ember Spread', type: 'debuff', applyToTarget: { poison: 2, vulnerable: 1 }, icon: '🌋' },
    ],
  },

  meeting_email: {
    id: 'meeting_email',
    name: 'Meeting → Email',
    hp: 52,
    icon: '📧',
    moves: [
      { name: 'Let\'s Circle Back', type: 'attack', damage: 10, icon: '🔄' },
      { name: 'Agenda Overload', type: 'exhaust', exhaustCount: 1, stressDamage: 4, icon: '📋' },
      { name: 'Reply All Storm', type: 'attack', damage: 8, times: 2, icon: '📧' },
      { name: 'Action Items', type: 'attack', damage: 13, icon: '✅' },
    ],
  },

  the_counteroffer: {
    id: 'the_counteroffer',
    name: 'The Counteroffer',
    hp: 46,
    icon: '🤝',
    moves: [
      { name: 'Match Their Offer', type: 'heal_allies', healAmount: 8, icon: '💊' },
      { name: 'Retention Bonus', type: 'attack', damage: 10, icon: '💰' },
      { name: 'We Value You', type: 'heal_allies', healAmount: 6, icon: '❤️' },
      { name: 'Guilt Trip', type: 'attack', damage: 9, stressDamage: 5, icon: '😢' },
    ],
  },

  background_check: {
    id: 'background_check',
    name: 'Background Check',
    hp: 44,
    icon: '🔎',
    moves: [
      { name: 'Deep Search', type: 'attack', damage: 10, icon: '🔎' },
      { name: 'Found Something', type: 'attack', damage: 14, icon: '⚠️' },
      { name: 'Verify Employment', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋' },
      { name: 'Criminal Record Scan', type: 'attack', damage: 11, stressDamage: 5, icon: '🔍' },
    ],
  },

  relocation_package: {
    id: 'relocation_package',
    name: 'Relocation Package',
    hp: 50,
    icon: '🚚',
    moves: [
      { name: 'Palo Alto or Bust', type: 'attack', damage: 12, stressDamage: 6, icon: '🏠' },
      { name: 'Moving Costs', type: 'gold_steal', goldSteal: 12, icon: '💸' },
      { name: 'Culture Shock', type: 'stress_attack', stressDamage: 10, icon: '😵' },
      { name: 'Housing Crisis', type: 'attack', damage: 15, icon: '🏠' },
    ],
  },

  // ── Act 3 Elite Enemies ──

  board_member: {
    id: 'board_member',
    name: 'The Board Member',
    hp: 130,
    icon: '🎩',
    isElite: true,
    moves: [
      { name: 'Executive Order', type: 'attack', damage: 14, icon: '📜' },
      { name: 'Quarterly Review', type: 'attack_defend', damage: 10, block: 12, icon: '📊' },
      { name: 'Shareholder Pressure', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈' },
      { name: 'Board Decision', type: 'attack', damage: 18, stressDamage: 6, icon: '⚡' },
    ],
  },

  golden_handcuffs: {
    id: 'golden_handcuffs',
    name: 'Golden Handcuffs',
    hp: 120,
    icon: '⛓️',
    isElite: true,
    moves: [
      { name: 'Vest Schedule', type: 'exhaust', exhaustCount: 1, stressDamage: 5, icon: '📅' },
      { name: 'Retention Hit', type: 'attack', damage: 13, icon: '⛓️' },
      { name: 'Stock Lock', type: 'exhaust', exhaustCount: 1, icon: '🔒' },
      { name: 'Golden Slam', type: 'attack', damage: 16, stressDamage: 5, icon: '💰' },
    ],
  },

  the_reorg: {
    id: 'the_reorg',
    name: 'The Reorg',
    hp: 110,
    icon: '🌀',
    isElite: true,
    moves: [
      { name: 'Shuffle Teams', type: 'discard', discardCount: 3, icon: '🔀' },
      { name: 'New Manager', type: 'attack', damage: 12, stressDamage: 5, icon: '👤' },
      { name: 'Restructure', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '🌀' },
      { name: 'Layoff Wave', type: 'attack', damage: 17, stressDamage: 8, icon: '🌊' },
    ],
  },

  technical_debt_golem: {
    id: 'technical_debt_golem',
    name: 'Technical Debt Golem',
    hp: 140,
    icon: '🗿',
    isElite: true,
    moves: [
      { name: 'Legacy Code', type: 'attack', damage: 8, icon: '📟' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { strength: 3 }, icon: '📈' },
      { name: 'Spaghetti Strike', type: 'attack', damage: 12, icon: '🍝' },
      { name: 'Technical Bankruptcy', type: 'attack', damage: 16, stressDamage: 6, icon: '💥' },
    ],
  },

  the_pip: {
    id: 'the_pip',
    name: 'The PIP',
    hp: 100,
    icon: '📉',
    isElite: true,
    moves: [
      { name: 'Performance Review', type: 'debuff', applyToTarget: { strength: -1, dexterity: -1 }, icon: '📉' },
      { name: 'Improvement Plan', type: 'stress_attack', stressDamage: 10, icon: '📋' },
      { name: 'Final Warning', type: 'attack', damage: 14, stressDamage: 6, icon: '⚠️' },
      { name: 'Terminated', type: 'attack', damage: 20, stressDamage: 10, icon: '🚪' },
    ],
  },

  // ── Act 3 Bosses ──

  offer_committee: {
    id: 'offer_committee',
    name: 'The Offer Committee',
    hp: 260,
    icon: '👥',
    isBoss: true,
    moves: [
      { name: 'Committee Review', type: 'attack', damage: 12, icon: '📋' },
      { name: 'Stress Interview', type: 'stress_attack', stressDamage: 12, icon: '😰' },
      { name: 'Deliberation', type: 'defend', block: 20, icon: '🤔' },
      { name: 'Budget Discussion', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '💰' },
      { name: 'Unanimous Decision', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈' },
      { name: 'Counter-Counter Offer', type: 'attack', damage: 18, stressDamage: 8, icon: '⚖️' },
      { name: 'Committee Slam', type: 'attack', damage: 22, icon: '💥' },
    ],
  },

  the_ceo: {
    id: 'the_ceo',
    name: 'The CEO',
    hp: 240,
    icon: '🏆',
    isBoss: true,
    moves: [
      // Phase 1: "Vision" — buffs and light attacks
      { name: 'Visionary Speech', type: 'buff', applyToSelf: { strength: 2 }, icon: '🎤' },
      { name: 'Inspire Fear', type: 'stress_attack', stressDamage: 10, icon: '😨' },
      { name: 'Corporate Strategy', type: 'attack_defend', damage: 10, block: 10, icon: '📊' },
      // Phase 2: "Execution" — heavy damage
      { name: 'Execute!', type: 'attack', damage: 16, icon: '⚡' },
      { name: 'Disruption', type: 'attack', damage: 14, stressDamage: 6, icon: '💥' },
      // Phase 3: "Disruption" — chaos
      { name: 'Move Fast Break Things', type: 'attack', damage: 20, icon: '🔥' },
      { name: 'Golden Parachute', type: 'buff', applyToSelf: { strength: 3 }, icon: '🪂' },
      { name: 'Hostile Takeover', type: 'attack', damage: 24, stressDamage: 12, icon: '☠️' },
    ],
  },

  imposter_syndrome_final: {
    id: 'imposter_syndrome_final',
    name: 'Imposter Syndrome (Final Form)',
    hp: 200,
    icon: '🎭',
    isBoss: true,
    moves: [
      { name: 'You\'re A Fraud', type: 'debuff', applyToTarget: { strength: -2 }, icon: '🎭' },
      { name: 'Everyone Knows', type: 'stress_attack', stressDamage: 15, icon: '👁️' },
      { name: 'Spiral of Doubt', type: 'stress_attack', stressDamage: 12, icon: '🌀' },
      { name: 'They\'ll Find Out', type: 'attack', damage: 10, stressDamage: 10, icon: '😱' },
      { name: 'Crushing Anxiety', type: 'stress_attack', stressDamage: 18, icon: '💀' },
      { name: 'Identity Crisis', type: 'debuff', applyToTarget: { weak: 3, vulnerable: 3, strength: -1 }, icon: '🪞' },
      { name: 'Complete Meltdown', type: 'attack', damage: 15, stressDamage: 20, icon: '🔥' },
    ],
  },
};

// ════════════════════════════════════════════════
// Encounter Tables — organized by Act
// ════════════════════════════════════════════════

// ── Act 1 ──
const act1Solos: string[][] = [
  ['resume_ats'],
  ['legacy_ats'],
  ['ai_ats'],
  ['recruiter_bot'],
  ['ghost_company'],
  ['take_home'],
  ['cover_letter_shredder'],
  ['keyword_stuffer'],
  ['job_board_troll'],
  ['application_fee_scammer'],
  ['entry_level_5yrs'],
  ['linkedin_notification_swarm'],
];

const act1Duos: string[][] = [
  ['resume_ats', 'recruiter_bot'],
  ['ghost_company', 'recruiter_bot'],
  ['ai_ats', 'ghost_company'],
  ['take_home', 'resume_ats'],
  ['cover_letter_shredder', 'keyword_stuffer'],
  ['job_board_troll', 'application_fee_scammer'],
  ['linkedin_notification_swarm', 'linkedin_notification_swarm'],
  ['entry_level_5yrs', 'recruiter_bot'],
];

const act1Trios: string[][] = [
  ['resume_ats', 'recruiter_bot', 'ghost_company'],
  ['linkedin_notification_swarm', 'linkedin_notification_swarm', 'linkedin_notification_swarm'],
  ['keyword_stuffer', 'resume_ats', 'ai_ats'],
];

const act1ElitePool: string[][] = [
  ['unpaid_take_home'],
  ['linkedin_influencer'],
  ['applicant_tracking_golem'],
  ['networking_event'],
  ['automated_rejection'],
];

const act1BossPool: string[][] = [
  ['hr_phone_screen'],
  ['ats_final_form'],
  ['ghosting_phantom'],
];

// ── Act 2 ──
const act2Solos: string[][] = [
  ['whiteboard_demon'],
  ['leetcode_goblin'],
  ['culture_fit_enforcer'],
  ['behavioral_question_bot'],
  ['pair_programmer_enemy'],
  ['trivia_quizmaster'],
  ['recruiter_middleman'],
  ['take_home_v2'],
  ['the_lowballer'],
  ['zoom_fatigue'],
  ['reference_checker'],
  ['scheduling_nightmare'],
];

const act2Duos: string[][] = [
  ['whiteboard_demon', 'leetcode_goblin'],
  ['culture_fit_enforcer', 'behavioral_question_bot'],
  ['pair_programmer_enemy', 'trivia_quizmaster'],
  ['recruiter_middleman', 'whiteboard_demon'],
  ['the_lowballer', 'zoom_fatigue'],
  ['reference_checker', 'scheduling_nightmare'],
  ['leetcode_goblin', 'leetcode_goblin'],
  ['take_home_v2', 'culture_fit_enforcer'],
];

const act2Trios: string[][] = [
  ['leetcode_goblin', 'leetcode_goblin', 'leetcode_goblin'],
  ['whiteboard_demon', 'pair_programmer_enemy', 'trivia_quizmaster'],
  ['culture_fit_enforcer', 'behavioral_question_bot', 'scheduling_nightmare'],
  ['recruiter_middleman', 'reference_checker', 'the_lowballer'],
];

const act2ElitePool: string[][] = [
  ['senior_dev_interrogator'],
  ['whiteboard_hydra'],
  ['hr_gatekeeper'],
  ['the_algorithm'],
  ['crunch_time_manager'],
];

const act2BossPool: string[][] = [
  ['panel_interview_hydra'],
  ['live_coding_challenge'],
  ['vp_of_engineering'],
];

// ── Act 3 ──
const act3Solos: string[][] = [
  ['system_design_titan'],
  ['salary_negotiator'],
  ['imposter_syndrome_common'],
  ['benefits_mimic'],
  ['equity_phantom'],
  ['non_compete_clause'],
  ['the_pivot'],
  ['burnout_ember'],
  ['meeting_email'],
  ['the_counteroffer'],
  ['background_check'],
  ['relocation_package'],
];

const act3Duos: string[][] = [
  ['system_design_titan', 'salary_negotiator'],
  ['imposter_syndrome_common', 'burnout_ember'],
  ['benefits_mimic', 'equity_phantom'],
  ['non_compete_clause', 'the_pivot'],
  ['meeting_email', 'the_counteroffer'],
  ['background_check', 'relocation_package'],
  ['salary_negotiator', 'the_counteroffer'],
  ['burnout_ember', 'burnout_ember'],
];

const act3Trios: string[][] = [
  ['imposter_syndrome_common', 'burnout_ember', 'equity_phantom'],
  ['system_design_titan', 'the_pivot', 'non_compete_clause'],
  ['salary_negotiator', 'the_counteroffer', 'relocation_package'],
  ['meeting_email', 'background_check', 'benefits_mimic'],
];

const act3ElitePool: string[][] = [
  ['board_member'],
  ['golden_handcuffs'],
  ['the_reorg'],
  ['technical_debt_golem'],
  ['the_pip'],
];

const act3BossPool: string[][] = [
  ['offer_committee'],
  ['the_ceo'],
  ['imposter_syndrome_final'],
];

// ════════════════════════════════════════════════
// Encounter selection helpers
// ════════════════════════════════════════════════

/** Get solo encounters for a given act (early zone battles) */
function getEarlyEncounters(act: number): string[][] {
  switch (act) {
    case 2: return act2Solos;
    case 3: return act3Solos;
    default: return act1Solos;
  }
}

/** Get harder encounters for a given act (mid/late zone battles) */
function getMidLateEncounters(act: number): string[][] {
  switch (act) {
    case 2: return [...act2Solos, ...act2Duos, ...act2Trios];
    case 3: return [...act3Solos, ...act3Duos, ...act3Trios];
    default: return [...act1Solos, ...act1Duos, ...act1Trios];
  }
}

/** Pick a normal encounter based on act and map row (zone) */
export function getNormalEncounter(act: number, row: number, totalRows: number): string[] {
  const earlyThreshold = Math.floor(totalRows * 0.25);

  if (row < earlyThreshold) {
    // Early zone: solos only
    const pool = getEarlyEncounters(act);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Mid/late zone: full pool
  const pool = getMidLateEncounters(act);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Pick an elite encounter for a given act */
export function getEliteEncounter(act: number): string[] {
  const pool = act === 3 ? act3ElitePool : act === 2 ? act2ElitePool : act1ElitePool;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Pick a boss encounter for a given act */
export function getBossEncounter(act: number): string[] {
  const pool = act === 3 ? act3BossPool : act === 2 ? act2BossPool : act1BossPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Legacy exports for backwards compatibility
export const normalEncounters = [...act1Solos, ...act1Duos, ...act1Trios];
export const eliteEncounters = act1ElitePool;
export const bossEncounters = act1BossPool;
