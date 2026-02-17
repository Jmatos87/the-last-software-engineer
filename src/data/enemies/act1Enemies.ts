import type { EnemyDef } from '../../types';

// ════════════════════════════════════════════════
// ACT 1 — The Application Abyss
// ════════════════════════════════════════════════

export const act1Enemies: Record<string, EnemyDef> = {

  // ── Act 1 Common Enemies ──

  resume_ats: {
    id: 'resume_ats',
    name: 'Resume ATS Filter',
    hp: 30,
    icon: '🤖',
    moves: [
      { name: 'Keyword Scan', type: 'attack', damage: 6, icon: '🔍', quip: '"Hmm... no blockchain?"' },
      { name: 'Format Check', type: 'attack', damage: 5, icon: '📋', quip: '"PDF? We only take .docx."' },
      { name: 'Auto-Reject', type: 'attack', damage: 9, icon: '❌', quip: '"Better luck never!"' },
      { name: 'Parse Failure', type: 'discard', discardCount: 1, stressDamage: 4, icon: '🗑️', quip: '"Is this a resume or abstract art?"' },
    ],
  },

  legacy_ats: {
    id: 'legacy_ats',
    name: 'Legacy ATS',
    hp: 40,
    icon: '🖨️',
    moves: [
      { name: 'Connection Lost', type: 'attack', damage: 8, icon: '📡', quip: '"Server circa 2003 says hi."' },
      { name: 'System Error', type: 'attack', damage: 6, icon: '⚠️', quip: '"Have you tried IE6?"' },
      { name: 'Loading...', type: 'defend', block: 8, icon: '⏳', quip: '"Please wait 3-5 business days."' },
      { name: 'Timeout Slam', type: 'attack', damage: 10, icon: '💤', quip: '"Session expired. Start over."' },
    ],
  },

  ai_ats: {
    id: 'ai_ats',
    name: 'AI-Powered ATS',
    hp: 26,
    icon: '🧠',
    moves: [
      { name: 'Deep Scan', type: 'attack', damage: 7, icon: '🔬', quip: '"My neural net says no."' },
      { name: 'Pattern Match', type: 'attack', damage: 5, icon: '🎯', quip: '"You match 0.3% of candidates."' },
      { name: 'Neural Reject', type: 'discard', discardCount: 2, icon: '🗑️', quip: '"GPT wrote a better resume."' },
      { name: 'AI Assessment', type: 'attack', damage: 9, icon: '⚡', quip: '"I replaced the recruiter too."' },
    ],
  },

  recruiter_bot: {
    id: 'recruiter_bot',
    name: 'Recruiter Bot',
    hp: 34,
    icon: '🤳',
    moves: [
      { name: 'Cold Email', type: 'attack', damage: 5, icon: '📧', quip: '"Quick 15-min chat?"' },
      { name: 'Exciting Opportunity!', type: 'debuff', applyToTarget: { hope: 3 }, icon: '✨', quip: '"Perfect fit for your skillset!"' },
      { name: 'Let\'s Circle Back', type: 'attack', damage: 7, icon: '🔄', quip: '"Touching base per my last email."' },
      { name: 'Actually, It\'s Contract', type: 'attack', damage: 8, stressDamage: 4, icon: '📄', quip: '"But great for your portfolio!"' },
    ],
  },

  ghost_company: {
    id: 'ghost_company',
    name: 'Ghost Company',
    hp: 18,
    icon: '👻',
    hideIntent: true,
    moves: [
      { name: 'Form Letter', type: 'attack', damage: 5, icon: '📨', quip: '"We went with another candidate."' },
      { name: 'Radio Silence', type: 'attack', damage: 6, icon: '📵', quip: '"..."' },
      { name: 'Vanish', type: 'debuff', applyToTarget: { ghosted: 1 }, icon: '💨', quip: '"*seen at 3:47 PM*"' },
    ],
  },

  take_home: {
    id: 'take_home',
    name: 'Take-Home Assignment',
    hp: 36,
    icon: '📝',
    moves: [
      { name: 'Requirements Doc', type: 'attack', damage: 6, icon: '📄', quip: '"Oh, and add auth too."' },
      { name: 'Scope Creep', type: 'attack', damage: 8, icon: '📈', quip: '"Just one more feature..."' },
      { name: 'Edge Cases', type: 'attack', damage: 10, icon: '🔥', quip: '"What if the user is on a boat?"' },
      { name: 'Due Tomorrow', type: 'stress_attack', stressDamage: 8, icon: '⏰', quip: '"Should only take a few hours!"' },
    ],
  },

  cover_letter_shredder: {
    id: 'cover_letter_shredder',
    name: 'Cover Letter Shredder',
    hp: 28,
    icon: '✂️',
    moves: [
      { name: 'Shred!', type: 'exhaust', exhaustCount: 1, icon: '✂️', quip: '"Nobody reads these anyway."' },
      { name: 'Paper Cut', type: 'attack', damage: 7, icon: '📃', quip: '"Ow! That was my best paragraph!"' },
      { name: 'Confetti Storm', type: 'attack', damage: 5, stressDamage: 3, icon: '🎊', quip: '"Your passion is now confetti!"' },
    ],
  },

  keyword_stuffer: {
    id: 'keyword_stuffer',
    name: 'Keyword Stuffer',
    hp: 24,
    icon: '🔑',
    moves: [
      { name: 'SEO Boost', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '📈', quip: '"Leverage those core competencies!"' },
      { name: 'Buzzword Slap', type: 'attack', damage: 5, icon: '💬', quip: '"Synergize this!"' },
      { name: 'Synergy!', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '🤝', quip: '"Let\'s align our paradigms!"' },
      { name: 'Jargon Jab', type: 'attack', damage: 6, icon: '📝', quip: '"Circle back on that deliverable!"' },
    ],
  },

  job_board_troll: {
    id: 'job_board_troll',
    name: 'Job Board Troll',
    hp: 32,
    icon: '🧌',
    moves: [
      { name: 'Overqualified!', type: 'debuff', applyToTarget: { dexterity: -1 }, icon: '📜', quip: '"PhD for data entry? Pass."' },
      { name: 'Troll Smash', type: 'attack', damage: 7, icon: '👊', quip: '"Just learn to code lol"' },
      { name: 'Underqualified!', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '📋', quip: '"Only 9 years of React?"' },
      { name: 'Flame War', type: 'attack', damage: 8, icon: '🔥', quip: '"Tabs vs spaces... FIGHT!"' },
    ],
  },

  application_fee_scammer: {
    id: 'application_fee_scammer',
    name: 'Application Fee Scammer',
    hp: 20,
    icon: '💰',
    moves: [
      { name: 'Processing Fee', type: 'gold_steal', goldSteal: 8, icon: '💸', quip: '"Small fee to apply. Totally legit."' },
      { name: 'Admin Fee', type: 'gold_steal', goldSteal: 5, stressDamage: 3, icon: '🧾', quip: '"Background check costs extra."' },
      { name: 'Surcharge', type: 'attack', damage: 6, icon: '💳', quip: '"Convenience fee for the privilege!"' },
    ],
  },

  entry_level_5yrs: {
    id: 'entry_level_5yrs',
    name: '"Entry Level" (5 Yrs Exp)',
    hp: 35,
    icon: '📋',
    moves: [
      { name: 'Impossible Requirements', type: 'attack_defend', damage: 6, block: 4, icon: '📝', quip: '"10 years Swift. It\'s from 2014."' },
      { name: 'Must Know 12 Frameworks', type: 'attack', damage: 8, icon: '📚', quip: '"Also COBOL. Non-negotiable."' },
      { name: 'Fortify', type: 'defend', block: 8, icon: '🏗️', quip: '"Competitive salary. Trust us."' },
      { name: 'Gatekeep', type: 'attack', damage: 7, stressDamage: 3, icon: '🚧', quip: '"Entry level. Senior pay? Lol."' },
    ],
  },

  linkedin_notification_swarm: {
    id: 'linkedin_notification_swarm',
    name: 'LinkedIn Notification',
    hp: 16,
    icon: '🔔',
    moves: [
      { name: 'Ping!', type: 'attack', damage: 4, stressDamage: 2, icon: '🔔', quip: '"Someone viewed your profile!"' },
      { name: 'Buzz!', type: 'stress_attack', stressDamage: 5, icon: '📳', quip: '"37 new job alerts!"' },
      { name: 'Ding!', type: 'attack', damage: 5, icon: '🛎️', quip: '"Congrats on 5 years at—oh wait."' },
    ],
  },

  // ── Act 1 Elite Enemies ──

  unpaid_take_home: {
    id: 'unpaid_take_home',
    name: 'Unpaid Take-Home Assignment',
    hp: 88,
    icon: '💸',
    isElite: true,
    moves: [
      { name: 'Scope Creep', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈', quip: '"Oh also build the backend."' },
      { name: 'Crunch Time', type: 'attack', damage: 10, icon: '😰', quip: '"Due in 4 hours. No pressure!"' },
      { name: 'Pair Stress', type: 'attack', damage: 7, times: 2, icon: '😵', quip: '"This should be a weekend project!"' },
      { name: 'Full-Stack Assault', type: 'attack', damage: 14, icon: '💥', quip: '"Add CI/CD and deploy to prod."' },
      { name: 'Overscoped!', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"Oh, and write the documentation."' },
    ],
  },

  linkedin_influencer: {
    id: 'linkedin_influencer',
    name: 'LinkedIn Influencer',
    hp: 78,
    icon: '📱',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 3 }, quip: '"Time to go VIRAL."' },
    ],
    moves: [
      // Phase 1: Soft harassment (indices 0-2)
      { name: 'Viral Post', type: 'attack', damage: 10, icon: '📢', quip: '"Agree? 👇 Like & repost."' },
      { name: 'Humble Brag', type: 'debuff', applyToTarget: { cringe: 2 }, icon: '😬', quip: '"I turned down 47 offers this week."' },
      { name: 'Engagement Farming', type: 'attack_defend', damage: 7, block: 6, applyToSelf: { regen: 3 }, icon: '🌱', quip: '"I cried at my standing desk today."' },
      // Phase 2: Influencer rage mode (indices 3-5)
      { name: 'Personal Brand', type: 'buff', applyToSelf: { strength: 3 }, icon: '🤳', quip: '"I\'m building an EMPIRE."' },
      { name: 'Influencer Barrage', type: 'attack', damage: 5, times: 3, icon: '📱', quip: '"Like. Share. SUBSCRIBE."' },
      { name: 'Thought Leader Slam', type: 'attack', damage: 14, stressDamage: 6, icon: '💡', quip: '"I posted about hustle culture at 4 AM."' },
    ],
  },

  applicant_tracking_golem: {
    id: 'applicant_tracking_golem',
    name: 'Applicant Tracking Golem',
    hp: 95,
    icon: '⚙️',
    isElite: true,
    moves: [
      { name: 'Absorb Pattern', type: 'buff', applyToSelf: { strength: 1 }, icon: '🔄', quip: '"Optimizing rejection pipeline..."' },
      { name: 'System Slam', type: 'attack', damage: 12, icon: '⚙️', quip: '"Application #4,729 processed."' },
      { name: 'Data Crunch', type: 'attack', damage: 8, times: 2, icon: '💾', quip: '"Your data is now our data."' },
      { name: 'Process Queue', type: 'attack_defend', damage: 10, block: 8, icon: '📊', quip: '"You are #8,341 in the queue."' },
      { name: 'Pipeline Sync', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '🔗', quip: '"Syncing rejection pipelines..."' },
    ],
  },

  networking_event: {
    id: 'networking_event',
    name: 'The Networking Event',
    hp: 82,
    icon: '🍸',
    isElite: true,
    moves: [
      { name: 'Small Talk', type: 'stress_attack', stressDamage: 8, icon: '💬', quip: '"So... what do you do?"' },
      { name: 'Awkward Handshake', type: 'attack', damage: 9, stressDamage: 4, icon: '🤝', quip: '"*limp fish grip*"' },
      { name: 'Elevator Pitch', type: 'attack', damage: 11, icon: '🗣️', quip: '"I\'m disrupting disruption."' },
      { name: 'Exchange Cards', type: 'buff', applyToSelf: { strength: 3 }, icon: '📇', quip: '"Let\'s connect on LinkedIn!"' },
    ],
  },

  automated_rejection: {
    id: 'automated_rejection',
    name: 'Automated Rejection Letter',
    hp: 73,
    icon: '✉️',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 2 }, quip: '"INITIATING BATCH REJECTION PROTOCOL."' },
    ],
    moves: [
      // Phase 1: Standard rejection flow (indices 0-2)
      { name: 'Demoralize', type: 'debuff', applyToTarget: { strength: -1 }, icon: '😞', quip: '"Thank you for your interest."' },
      { name: 'Form Rejection', type: 'attack', damage: 10, stressDamage: 5, icon: '✉️', quip: '"Dear [CANDIDATE_NAME]..."' },
      { name: 'Not A Good Fit', type: 'attack', damage: 16, icon: '❌', quip: '"We\'re looking for a unicorn."' },
      // Phase 2: Automated rejection machine (indices 3-5)
      { name: 'Auto-Reject Mode', type: 'buff', applyToSelf: { strength: 3 }, icon: '⚙️', quip: '"PROCESSING 10,000 APPLICATIONS..."' },
      { name: 'Rejection Cascade', type: 'attack', damage: 6, times: 3, icon: '✉️', quip: '"Rejected. Rejected. Rejected."' },
      { name: 'Mass Rejection', type: 'attack', damage: 18, stressDamage: 8, icon: '❌', quip: '"Your entire career has been archived."' },
    ],
  },

  // ── Act 1 Bosses ──

  hr_phone_screen: {
    id: 'hr_phone_screen',
    name: 'HR Phone Screen',
    hp: 163,
    icon: '📞',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 2 }, quip: '"Gloves are off. Let\'s talk comp."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { strength: 3 }, quip: '"This interview is OVER."' },
    ],
    moves: [
      // Phase 1: soft questions (indices 0-2)
      { name: 'Tell Me About Yourself', type: 'attack', damage: 8, icon: '🎤', quip: '"Keep it under 30 seconds."' },
      { name: 'Why This Company?', type: 'attack', damage: 10, icon: '🏢', quip: '"Wrong answer."' },
      { name: 'Greatest Weakness?', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '😓', quip: '"Don\'t say perfectionism."' },
      // Phase 2: aggressive (indices 3-6)
      { name: 'Where Do You See Yourself?', type: 'attack', damage: 14, icon: '🔮', quip: '"In 5 years. Be specific."' },
      { name: 'Salary Expectations?', type: 'attack', damage: 16, stressDamage: 6, icon: '💵', quip: '"What\'s your current comp?"' },
      { name: 'We\'ll Be In Touch', type: 'attack', damage: 20, stressDamage: 10, icon: '☎️', quip: '"(Narrator: They weren\'t.)"' },
      { name: 'Benefits Bait', type: 'attack', damage: 12, stressDamage: 5, icon: '🎣', quip: '"We have unlimited PTO! (Don\'t use it.)"' },
      // Phase 3: final stand (indices 7-8)
      { name: 'No More Questions', type: 'buff', applyToSelf: { strength: 3 }, icon: '🔥', quip: '"I\'ve heard ENOUGH."' },
      { name: 'REJECTED', type: 'attack', damage: 24, stressDamage: 10, icon: '❌', quip: '"We went with another candidate. Forever."' },
    ],
  },

  ats_final_form: {
    id: 'ats_final_form',
    name: 'The ATS Final Form',
    hp: 182,
    icon: '🏗️',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 4, onEnter: { strength: 3 }, quip: '"THIS ISN\'T EVEN MY FINAL FORM."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { strength: 4 }, quip: '"CRITICAL FAILURE IMMINENT."' },
    ],
    moves: [
      // Phase 1: scans + discards (indices 0-3)
      { name: 'Full System Scan', type: 'attack', damage: 8, icon: '🔍', quip: '"Scanning for hope... none found."' },
      { name: 'Resume Shredder', type: 'discard', discardCount: 2, stressDamage: 4, icon: '🗑️', quip: '"Formatting: UNACCEPTABLE."' },
      { name: 'Keyword Purge', type: 'attack', damage: 10, icon: '⚡', quip: '"You said \'passionate.\' Cringe."' },
      { name: 'Database Overwrite', type: 'attack_defend', damage: 7, block: 10, icon: '💾', quip: '"Your file has been... updated."' },
      // Phase 2: raw power (indices 4-7)
      { name: 'TRANSFORM', type: 'buff', applyToSelf: { strength: 3 }, icon: '🔥', quip: '"MAXIMUM OVERDRIVE ENGAGED."' },
      { name: 'Maximum Overdrive', type: 'attack', damage: 18, icon: '💥', quip: '"REJECT. REJECT. REJECT."' },
      { name: 'Total Rejection', type: 'attack', damage: 14, times: 2, icon: '❌', quip: '"Application status: OBLITERATED."' },
      { name: 'System Crash', type: 'attack', damage: 26, stressDamage: 8, icon: '💀', quip: '"Fatal error: career not found."' },
      // Phase 3: final stand (indices 8-9)
      { name: 'TOTAL SYSTEM FAILURE', type: 'buff', applyToSelf: { strength: 4 }, icon: '⚠️', quip: '"ALL SYSTEMS: OVERDRIVE."' },
      { name: 'CAREER_NOT_FOUND', type: 'attack', damage: 28, stressDamage: 10, icon: '💀', quip: '"Fatal error: hope.exe not found."' },
    ],
  },

  ghosting_phantom: {
    id: 'ghosting_phantom',
    name: 'The Ghosting Phantom',
    hp: 143,
    icon: '👻',
    isBoss: true,
    hideIntent: true,
    phases: [
      { hpPercent: 40, moveStartIndex: 3, onEnter: { strength: 2 }, quip: '"You\'ll never hear from us again."' },
      { hpPercent: 25, moveStartIndex: 6, onEnter: { strength: 3 }, quip: '"You\'ll never hear from ANYONE again."' },
    ],
    moves: [
      // Phase 1: eerie (indices 0-2)
      { name: 'Haunt', type: 'attack', damage: 9, stressDamage: 5, icon: '👻', quip: '"Remember that interview? Me neither."' },
      { name: 'Read Receipt', type: 'attack', damage: 11, icon: '✓', quip: '"✓✓ Seen 3 weeks ago."' },
      { name: 'Gone Dark', type: 'stress_attack', stressDamage: 12, icon: '🌑', quip: '"*This number is no longer in service*"' },
      // Phase 2: aggressive + debuffs (indices 3-5)
      { name: 'Spectral Slash', type: 'attack', damage: 15, icon: '💫', quip: '"I was never even real."' },
      { name: 'Maybe Next Time', type: 'debuff', applyToTarget: { weak: 2, ghosted: 2 }, icon: '💨', quip: '"We\'ll definitely reach out soon!"' },
      { name: 'Full Ghosting', type: 'attack', damage: 21, stressDamage: 8, icon: '☠️', quip: '"The position has been filled... forever."' },
      // Phase 3: final stand (indices 6-7)
      { name: 'Eternal Silence', type: 'buff', applyToSelf: { strength: 3 }, icon: '🕳️', quip: '"The void is permanent."' },
      { name: 'Final Ghosting', type: 'attack', damage: 24, stressDamage: 12, icon: '☠️', quip: '"You never existed to us."' },
    ],
  },
};

// ── Act 1 Encounter Tables ──

export const act1Solos: string[][] = [
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

export const act1Duos: string[][] = [
  ['keyword_stuffer', 'resume_ats'],               // Buffer powers up striker
  ['recruiter_bot', 'ghost_company'],               // Hope debuff + hidden intent
  ['cover_letter_shredder', 'take_home'],           // Exhaust + stress pressure
  ['application_fee_scammer', 'job_board_troll'],   // Gold drain + vulnerable
  ['ai_ats', 'keyword_stuffer'],                    // Discard hand + buff damage
  ['entry_level_5yrs', 'recruiter_bot'],            // Tank + support debuffer
  ['linkedin_notification_swarm', 'linkedin_notification_swarm'], // Swarm, tests AoE
  ['legacy_ats', 'ghost_company'],                  // Block wall + hidden intent
];

export const act1Trios: string[][] = [
  ['keyword_stuffer', 'resume_ats', 'recruiter_bot'],                         // Buffer + striker + debuffer
  ['linkedin_notification_swarm', 'linkedin_notification_swarm', 'linkedin_notification_swarm'], // Stress swarm
  ['cover_letter_shredder', 'application_fee_scammer', 'ghost_company'],      // Resource drain trio
];

export const act1ElitePool: string[][] = [
  ['unpaid_take_home'],
  ['linkedin_influencer'],
  ['applicant_tracking_golem'],
  ['networking_event'],
  ['automated_rejection'],
];

export const act1BossPool: string[][] = [
  ['hr_phone_screen'],
  ['ats_final_form'],
  ['ghosting_phantom'],
];
