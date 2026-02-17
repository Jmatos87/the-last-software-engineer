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

  // ════════════════════════════════════════════════
  // ACT 2 — The Interview Gauntlet
  // ════════════════════════════════════════════════

  // ── Act 2 Common Enemies (HP +8-10, key damage bumps) ──

  whiteboard_demon: {
    id: 'whiteboard_demon',
    name: 'Whiteboard Demon',
    hp: 53,
    icon: '📊',
    moves: [
      { name: 'Solve in O(n)', type: 'attack', damage: 10, icon: '📊', quip: '"Now do it without extra space."' },
      { name: 'Time Complexity', type: 'attack', damage: 8, stressDamage: 4, icon: '⏱️', quip: '"That\'s O(n²). Unacceptable."' },
      { name: 'Edge Case', type: 'attack', damage: 14, icon: '🔥', quip: '"What if the array is empty?"' },
      { name: 'Optimize This', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '📉', quip: '"Can you do better?"' },
    ],
  },

  leetcode_goblin: {
    id: 'leetcode_goblin',
    name: 'LeetCode Goblin',
    hp: 43,
    icon: '👺',
    moves: [
      { name: 'Easy Problem', type: 'attack', damage: 6, icon: '🟢', quip: '"This one\'s a warmup."' },
      { name: 'Medium Problem', type: 'attack', damage: 8, icon: '🟡', quip: '"Just invert a binary tree."' },
      { name: 'Hard Problem', type: 'attack', damage: 13, icon: '🔴', quip: '"This one\'s a classic!"' },
      { name: 'Time Limit Exceeded', type: 'stress_attack', stressDamage: 7, icon: '⏰', quip: '"Your solution timed out. Again."' },
    ],
  },

  culture_fit_enforcer: {
    id: 'culture_fit_enforcer',
    name: 'Culture Fit Enforcer',
    hp: 48,
    icon: '😊',
    moves: [
      { name: 'We\'re Like Family', type: 'stress_attack', stressDamage: 8, icon: '👨‍👩‍👧‍👦', quip: '"A dysfunctional one, but still!"' },
      { name: 'Red Flag', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩', quip: '"We work hard AND play hard."' },
      { name: 'Pizza Parties!', type: 'stress_attack', stressDamage: 6, icon: '🍕', quip: '"Instead of raises this quarter!"' },
      { name: 'Forced Fun', type: 'attack', damage: 8, stressDamage: 4, icon: '🎉', quip: '"Mandatory team karaoke at 6 AM!"' },
    ],
  },

  behavioral_question_bot: {
    id: 'behavioral_question_bot',
    name: 'Behavioral Question Bot',
    hp: 46,
    icon: '🎭',
    moves: [
      { name: 'Tell Me About A Time...', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🕐', quip: '"Use the STAR method, please."' },
      { name: 'Why Should We Hire You?', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🤔', quip: '"Convince me you exist."' },
      { name: 'Where Do You See Yourself?', type: 'stress_attack', stressDamage: 7, icon: '🔮', quip: '"Not here, apparently."' },
      { name: 'Competency Check', type: 'attack', damage: 9, icon: '✅', quip: '"Hmm, insufficient leadership."' },
    ],
  },

  pair_programmer_enemy: {
    id: 'pair_programmer_enemy',
    name: 'The Pair Programmer',
    hp: 50,
    icon: '👥',
    moves: [
      { name: 'Copy That', type: 'attack_defend', damage: 7, block: 7, icon: '📋', quip: '"I would\'ve used a reducer here."' },
      { name: 'Actually...', type: 'attack', damage: 11, icon: '☝️', quip: '"Well, actually, it\'s O(log n)."' },
      { name: 'Let Me Drive', type: 'attack', damage: 8, stressDamage: 3, icon: '⌨️', quip: '"*types furiously on your keyboard*"' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '👀', quip: '"47 comments on your PR."' },
    ],
  },

  trivia_quizmaster: {
    id: 'trivia_quizmaster',
    name: 'Trivia Quizmaster',
    hp: 38,
    icon: '❓',
    moves: [
      { name: 'Pop Quiz!', type: 'attack', damage: 10, icon: '❓', quip: '"What\'s the max heap size in V8?"' },
      { name: 'Trick Question', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🃏', quip: '"Trick question — there\'s no answer."' },
      { name: 'Bonus Round', type: 'attack', damage: 7, icon: '⭐', quip: '"Now in Haskell."' },
      { name: 'Stumped!', type: 'stress_attack', stressDamage: 6, icon: '😶', quip: '"The silence speaks volumes."' },
    ],
  },

  recruiter_middleman: {
    id: 'recruiter_middleman',
    name: 'Recruiter Middleman',
    hp: 44,
    icon: '🤵',
    moves: [
      { name: 'Shield Candidates', type: 'buff_allies', applyToTarget: { dexterity: 1 }, icon: '🛡️', quip: '"I\'ll prep you for the prep call."' },
      { name: 'Stall', type: 'defend', block: 10, icon: '⏳', quip: '"The hiring manager is OOO."' },
      { name: 'Pipeline Management', type: 'buff_allies', applyToTarget: { strength: 1 }, icon: '📊', quip: '"You\'re in our talent pipeline!"' },
      { name: 'The Runaround', type: 'stress_attack', stressDamage: 5, icon: '🔄', quip: '"Let me transfer you to..."' },
    ],
  },

  take_home_v2: {
    id: 'take_home_v2',
    name: 'Take-Home Project v2',
    hp: 56,
    icon: '💻',
    moves: [
      { name: 'MVP Sprint', type: 'attack', damage: 8, icon: '🏃', quip: '"Ship it by Monday."' },
      { name: 'Feature Creep', type: 'buff', applyToSelf: { strength: 1 }, icon: '📈', quip: '"Oh, also add dark mode."' },
      { name: 'Deploy Pressure', type: 'attack', damage: 13, stressDamage: 4, icon: '🚀', quip: '"Deploy to prod. No staging."' },
      { name: 'Stack Overflow', type: 'attack_defend', damage: 9, block: 5, icon: '📚', quip: '"Closed as duplicate."' },
    ],
  },

  the_lowballer: {
    id: 'the_lowballer',
    name: 'The Lowballer',
    hp: 42,
    icon: '💵',
    moves: [
      { name: 'We Offer Exposure', type: 'gold_steal', goldSteal: 8, stressDamage: 4, icon: '💸', quip: '"Think of the experience!"' },
      { name: 'Budget Cuts', type: 'gold_steal', goldSteal: 6, icon: '✂️', quip: '"Market conditions, you understand."' },
      { name: 'Take It Or Leave It', type: 'attack', damage: 12, icon: '🤷', quip: '"Final offer. Non-negotiable."' },
      { name: 'Equity Instead', type: 'stress_attack', stressDamage: 7, icon: '📉', quip: '"0.001% pre-dilution. Generous!"' },
    ],
  },

  zoom_fatigue: {
    id: 'zoom_fatigue',
    name: 'Zoom Fatigue',
    hp: 52,
    icon: '😴',
    moves: [
      { name: 'Buffer...', type: 'exhaust', exhaustCount: 1, icon: '🔄', quip: '"Can everyone see my screen?"' },
      { name: 'You\'re On Mute', type: 'attack', damage: 8, icon: '🔇', quip: '"You\'re still on mute."' },
      { name: 'Camera Off Despair', type: 'stress_attack', stressDamage: 6, icon: '📷', quip: '"We prefer cameras on."' },
      { name: 'Technical Difficulties', type: 'exhaust', exhaustCount: 1, stressDamage: 3, icon: '⚠️', quip: '"Sorry, my internet—*bzzt*"' },
    ],
  },

  reference_checker: {
    id: 'reference_checker',
    name: 'Reference Checker',
    hp: 40,
    icon: '🔍',
    moves: [
      { name: 'Background Scan', type: 'attack', damage: 8, icon: '🔍', quip: '"Interesting GitHub history..."' },
      { name: 'Inconsistency Found', type: 'attack', damage: 14, icon: '⚠️', quip: '"This date doesn\'t match."' },
      { name: 'Verify Credentials', type: 'debuff', applyToTarget: { weak: 2 }, icon: '📋', quip: '"Your \'degree\' from where now?"' },
      { name: 'Call References', type: 'attack', damage: 9, stressDamage: 3, icon: '📞', quip: '"Your old boss was... candid."' },
    ],
  },

  scheduling_nightmare: {
    id: 'scheduling_nightmare',
    name: 'Scheduling Nightmare',
    hp: 48,
    icon: '📅',
    moves: [
      { name: 'Reschedule', type: 'stress_attack', stressDamage: 6, icon: '📅', quip: '"Something came up. Next week?"' },
      { name: 'Double-Booked', type: 'attack', damage: 10, icon: '📆', quip: '"Oops, we have two of you."' },
      { name: 'Time Zone Chaos', type: 'attack', damage: 7, stressDamage: 4, icon: '🌐', quip: '"Was that PST or EST? Or IST?"' },
      { name: 'Calendar Tetris', type: 'debuff', applyToTarget: { weak: 1, vulnerable: 1 }, icon: '🧩', quip: '"Only slot is 4 AM Thursday."' },
    ],
  },

  // ── Act 2 Elite Enemies (HP +20, damage bumps) ──

  senior_dev_interrogator: {
    id: 'senior_dev_interrogator',
    name: 'Senior Dev Interrogator',
    hp: 133,
    icon: '🧓',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { strength: 3 }, quip: '"You call yourself a SENIOR?"' },
    ],
    moves: [
      // Phase 1: Interrogation (indices 0-3)
      { name: 'Explain Your Process', type: 'attack', damage: 10, stressDamage: 5, icon: '🔬', quip: '"Walk me through every decision."' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀', quip: '"I see you used var. In 2026."' },
      { name: 'Deep Dive', type: 'attack', damage: 14, icon: '🤿', quip: '"Let\'s go three levels deeper."' },
      { name: 'Years of Experience', type: 'buff', applyToSelf: { strength: 3 }, icon: '📅', quip: '"I\'ve been doing this since Perl."' },
      // Phase 2: Gloves off (indices 4-6)
      { name: '"I\'ve Seen Everything"', type: 'buff', applyToSelf: { strength: 3 }, icon: '📅', quip: '"I\'ve been doing this since before you were born."' },
      { name: 'Pop Quiz', type: 'attack', damage: 8, times: 2, icon: '❓', quip: '"What\'s the time complexity? NOW."' },
      { name: 'Code Review: FAILED', type: 'attack', damage: 16, stressDamage: 5, icon: '🧹', quip: '"This code is an embarrassment."' },
    ],
  },

  whiteboard_hydra: {
    id: 'whiteboard_hydra',
    name: 'The Whiteboard Hydra',
    hp: 123,
    icon: '🐉',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { strength: 3 }, quip: '"For every answer, THREE more questions."' },
    ],
    moves: [
      // Phase 1: Standard whiteboard hell (indices 0-3)
      { name: 'Follow-Up Question', type: 'attack', damage: 9, icon: '❓', quip: '"But what about concurrency?"' },
      { name: 'Multi-Part Problem', type: 'attack', damage: 7, times: 2, icon: '📝', quip: '"Part A... and Part B."' },
      { name: 'Whiteboard Barrage', type: 'attack', damage: 12, stressDamage: 4, icon: '📊', quip: '"Now diagram the entire system."' },
      { name: 'Grow Heads', type: 'buff', applyToSelf: { strength: 3 }, icon: '🐲', quip: '"One more follow-up question..."' },
      // Phase 2: Hydra unleashed (indices 4-6)
      { name: 'Hydra Awakens', type: 'buff', applyToSelf: { strength: 3 }, icon: '🐲', quip: '"The whiteboard is INFINITE."' },
      { name: 'Infinite Follow-Ups', type: 'attack', damage: 5, times: 4, icon: '❓', quip: '"Part C, D, E, F..."' },
      { name: 'Erase Everything', type: 'attack', damage: 16, stressDamage: 5, icon: '🧽', quip: '"Start over. From the BEGINNING."' },
    ],
  },

  hr_gatekeeper: {
    id: 'hr_gatekeeper',
    name: 'HR Gatekeeper',
    hp: 118,
    icon: '🚪',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 4 }, quip: '"COMPLIANCE MODE ACTIVATED."' },
    ],
    moves: [
      // Phase 1: Bureaucratic wall (indices 0-2)
      { name: 'Bureaucracy Wall', type: 'defend', block: 15, icon: '🧱', quip: '"Fill out form HR-7B first."' },
      { name: 'Red Tape', type: 'stress_attack', stressDamage: 8, icon: '📎', quip: '"That requires three approvals."' },
      { name: 'Policy Enforcement', type: 'attack_defend', damage: 10, block: 8, icon: '📋', quip: '"Per section 4, subsection C..."' },
      // Phase 2: Gatekeeper goes offensive (indices 3-5)
      { name: 'Policy Overhaul', type: 'buff', applyToSelf: { strength: 3 }, icon: '📋', quip: '"New policy: ZERO TOLERANCE."' },
      { name: 'Compliance Hammer', type: 'attack', damage: 16, icon: '🔨', quip: '"Non-compliant resources will be PURGED."' },
      { name: 'Access Permanently Denied', type: 'attack', damage: 20, stressDamage: 8, icon: '🚫', quip: '"Your badge has been DEACTIVATED."' },
    ],
  },

  the_algorithm: {
    id: 'the_algorithm',
    name: 'The Algorithm',
    hp: 145,
    icon: '🧮',
    isElite: true,
    moves: [
      { name: 'Analyze Pattern', type: 'buff', applyToSelf: { strength: 2, dexterity: 1 }, icon: '📊', quip: '"Training on your weaknesses..."' },
      { name: 'Optimized Strike', type: 'attack', damage: 12, icon: '⚡', quip: '"Calculated. Precise. Devastating."' },
      { name: 'Recursive Loop', type: 'attack', damage: 8, times: 2, icon: '🔄', quip: '"while(true) { reject(); }"' },
      { name: 'Machine Learning', type: 'attack_defend', damage: 11, block: 6, icon: '🤖', quip: '"I learned from 10M rejections."' },
      { name: 'Neural Overload', type: 'attack', damage: 22, stressDamage: 8, icon: '🧠', quip: '"Processing power: MAXIMUM."' },
    ],
  },

  crunch_time_manager: {
    id: 'crunch_time_manager',
    name: 'Crunch Time Manager',
    hp: 128,
    icon: '⏰',
    isElite: true,
    moves: [
      { name: 'Need This By EOD', type: 'attack', damage: 10, stressDamage: 6, icon: '⏰', quip: '"EOD means 5 PM my time zone."' },
      { name: 'Overtime Mandate', type: 'buff', applyToSelf: { strength: 3 }, icon: '📈', quip: '"We\'re all pulling extra hours!"' },
      { name: 'Weekend Work', type: 'attack', damage: 13, stressDamage: 5, icon: '📅', quip: '"Just a quick Saturday deploy."' },
      { name: 'Sprint Review', type: 'attack', damage: 15, icon: '🏃', quip: '"Why is this ticket still open?"' },
      { name: 'All-Hands Pressure', type: 'attack', damage: 25, stressDamage: 10, icon: '💥', quip: '"The board is watching."' },
    ],
  },

  // ── Act 2 Bosses (HP bumped, phases added) ──

  panel_interview_hydra: {
    id: 'panel_interview_hydra',
    name: 'Panel Interview Hydra',
    hp: 258,
    icon: '🐲',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 3, dexterity: 1 }, quip: '"The panel has reached a consensus."' },
      { hpPercent: 25, moveStartIndex: 6, onEnter: { strength: 4 }, quip: '"The panel is UNANIMOUS."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'Technical Question', type: 'attack', damage: 10, icon: '🔧', quip: '"Explain polymorphism. In Latin."' },
      { name: 'Stress Question', type: 'stress_attack', stressDamage: 10, icon: '😰', quip: '"We all disagree. Convince us."' },
      { name: 'Panel Buff', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈', quip: '"*whispering among themselves*"' },
      // Phase 2 (indices 3-5)
      { name: 'Cross-Examination', type: 'attack', damage: 14, stressDamage: 5, icon: '⚔️', quip: '"That contradicts what you said."' },
      { name: 'Group Deliberation', type: 'defend', block: 15, icon: '🤔', quip: '"We need to align internally."' },
      { name: 'Final Verdict', type: 'attack', damage: 26, stressDamage: 10, icon: '⚖️', quip: '"The panel has decided."' },
      // Phase 3: final stand (indices 6-8)
      { name: 'Panel Frenzy', type: 'buff', applyToSelf: { strength: 4 }, icon: '🔥', quip: '"We\'re ALL against you now."' },
      { name: 'Cross-Examination Barrage', type: 'attack', damage: 10, times: 3, icon: '⚔️', quip: '"Answer. Answer. ANSWER."' },
      { name: 'Unanimous Rejection', type: 'attack', damage: 28, stressDamage: 12, icon: '⚖️', quip: '"Motion to reject. ALL in favor."' },
    ],
  },

  live_coding_challenge: {
    id: 'live_coding_challenge',
    name: 'The Live Coding Challenge',
    hp: 238,
    icon: '⌨️',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { strength: 2 }, quip: '"Time is running out..."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { strength: 4 }, quip: '"COMPILATION: FAILED."' },
    ],
    moves: [
      // Phase 1 (indices 0-3)
      { name: 'Timer Start', type: 'attack', damage: 8, icon: '⏱️', quip: '"You have 45 minutes. Go."' },
      { name: 'Syntax Error', type: 'attack', damage: 10, stressDamage: 4, icon: '🔴', quip: '"Missing semicolon on line 1."' },
      { name: 'Runtime Exception', type: 'attack', damage: 12, icon: '💥', quip: '"undefined is not a function."' },
      { name: 'Compiler Fury', type: 'buff', applyToSelf: { strength: 4 }, icon: '🔥', quip: '"142 errors found."' },
      // Phase 2 (indices 4-6)
      { name: 'Stack Overflow', type: 'attack', damage: 14, stressDamage: 6, icon: '📚', quip: '"Maximum call stack exceeded."' },
      { name: 'Segfault', type: 'attack', damage: 18, icon: '💀', quip: '"Core dumped. So did your career."' },
      { name: 'TIME\'S UP!', type: 'attack', damage: 30, stressDamage: 14, icon: '⏰', quip: '"Pencils down. Step away."' },
      // Phase 3: final stand (indices 7-8)
      { name: 'Total Compile Failure', type: 'buff', applyToSelf: { strength: 4 }, icon: '🔴', quip: '"9,999 ERRORS FOUND."' },
      { name: 'FAILED', type: 'attack', damage: 32, stressDamage: 14, icon: '💀', quip: '"Interview status: TERMINATED."' },
    ],
  },

  vp_of_engineering: {
    id: 'vp_of_engineering',
    name: 'The VP of Engineering',
    hp: 278,
    icon: '👔',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { strength: 4 }, quip: '"Now the real interview begins."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { strength: 5 }, quip: '"You\'re DONE here."' },
    ],
    moves: [
      // Phase 1: "casual chat" (indices 0-3)
      { name: 'Let\'s Chat Casually', type: 'debuff', applyToTarget: { weak: 2 }, icon: '☕', quip: '"This isn\'t an interview. Relax."' },
      { name: 'Culture Assessment', type: 'stress_attack', stressDamage: 8, icon: '🏢', quip: '"How do you handle ambiguity?"' },
      { name: 'Subtle Probe', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🔍', quip: '"Interesting... very interesting."' },
      { name: 'Strategic Vision', type: 'attack', damage: 10, icon: '🎯', quip: '"What\'s your 5-year roadmap?"' },
      // Phase 2: "technical deep-dive" (indices 4-7)
      { name: 'Technical Deep-Dive', type: 'buff', applyToSelf: { strength: 3 }, icon: '🤿', quip: '"Gloves off."' },
      { name: 'Architecture Review', type: 'attack', damage: 16, icon: '🏗️', quip: '"This doesn\'t scale."' },
      { name: 'Scale Question', type: 'attack', damage: 14, stressDamage: 6, icon: '📊', quip: '"What if we have a billion users?"' },
      { name: 'Executive Decision', type: 'attack', damage: 30, stressDamage: 12, icon: '⚡', quip: '"I\'ve seen enough."' },
      // Phase 3: final stand (indices 8-9)
      { name: 'You\'re Fired', type: 'buff', applyToSelf: { strength: 5 }, icon: '🔥', quip: '"Pack your things."' },
      { name: 'Severance Denied', type: 'attack', damage: 34, stressDamage: 15, icon: '☠️', quip: '"And you owe US money."' },
    ],
  },

  // ════════════════════════════════════════════════
  // ACT 3 — Corporate Final Round
  // ════════════════════════════════════════════════

  // ── Act 3 Common Enemies (HP +15-20, massive damage bumps) ──

  system_design_titan: {
    id: 'system_design_titan',
    name: 'System Design Titan',
    hp: 70,
    icon: '🏛️',
    moves: [
      { name: 'Let\'s Talk Scalability', type: 'attack_defend', damage: 10, block: 8, icon: '📐', quip: '"Draw the architecture. All of it."' },
      { name: 'Load Balancer', type: 'defend', block: 14, icon: '⚖️', quip: '"Distributing incoming damage..."' },
      { name: 'Distributed Slam', type: 'attack', damage: 15, icon: '🌐', quip: '"Across 47 microservices!"' },
      { name: 'Microservice Barrage', type: 'attack', damage: 9, times: 2, icon: '🔧', quip: '"Each one a separate repo."' },
    ],
  },

  salary_negotiator: {
    id: 'salary_negotiator',
    name: 'Salary Negotiator',
    hp: 60,
    icon: '💼',
    moves: [
      { name: 'Lowball Offer', type: 'gold_steal', goldSteal: 18, icon: '💸', quip: '"Best we can do. Economy, y\'know."' },
      { name: 'Market Rate Denial', type: 'attack', damage: 12, stressDamage: 5, icon: '📉', quip: '"Our internal bands are different."' },
      { name: 'Benefits Package', type: 'gold_steal', goldSteal: 12, stressDamage: 3, icon: '📦', quip: '"Free snacks count as comp, right?"' },
      { name: 'Final Offer', type: 'attack', damage: 17, icon: '🤝', quip: '"Take it or we move on."' },
    ],
  },

  imposter_syndrome_common: {
    id: 'imposter_syndrome_common',
    name: 'Imposter Syndrome',
    hp: 55,
    icon: '🎭',
    moves: [
      { name: 'You Don\'t Belong', type: 'stress_attack', stressDamage: 10, icon: '😰', quip: '"They\'ll realize any day now."' },
      { name: 'Self Doubt', type: 'debuff', applyToTarget: { weak: 2 }, icon: '😟', quip: '"You just got lucky so far."' },
      { name: 'Anxiety Spike', type: 'stress_attack', stressDamage: 12, icon: '😱', quip: '"Everyone else is smarter."' },
      { name: 'Spiral', type: 'attack', damage: 10, stressDamage: 6, icon: '🌀', quip: '"Google your own name lately?"' },
    ],
  },

  benefits_mimic: {
    id: 'benefits_mimic',
    name: 'Benefits Package Mimic',
    hp: 65,
    icon: '📦',
    moves: [
      { name: 'Looks Great!', type: 'defend', block: 5, icon: '✨', quip: '"Unlimited PTO! (Don\'t use it.)"' },
      { name: 'SURPRISE!', type: 'attack', damage: 22, stressDamage: 6, icon: '💥', quip: '"$5000 deductible! Gotcha!"' },
      { name: 'Fine Print', type: 'attack', damage: 12, icon: '📜', quip: '"Dental is extra. Way extra."' },
      { name: 'Reset Trap', type: 'defend', block: 5, icon: '📦', quip: '"Vision starts after 12 months."' },
    ],
  },

  equity_phantom: {
    id: 'equity_phantom',
    name: 'The Equity Phantom',
    hp: 50,
    icon: '💎',
    moves: [
      { name: 'Vesting Cliff', type: 'exhaust', exhaustCount: 1, stressDamage: 4, icon: '📅', quip: '"Only 3 more years to go!"' },
      { name: 'Paper Money', type: 'attack', damage: 11, icon: '📄', quip: '"Worth millions! On paper."' },
      { name: 'Dilution', type: 'debuff', applyToTarget: { strength: -1 }, icon: '💧', quip: '"New funding round! Your share: 0.0001%"' },
      { name: 'Golden Cage', type: 'exhaust', exhaustCount: 1, icon: '🔒', quip: '"Leave now and lose it all."' },
    ],
  },

  non_compete_clause: {
    id: 'non_compete_clause',
    name: 'Non-Compete Clause',
    hp: 63,
    icon: '📜',
    moves: [
      { name: 'Legal Binding', type: 'exhaust', exhaustCount: 2, icon: '⚖️', quip: '"You signed page 47. Remember?"' },
      { name: 'Cease & Desist', type: 'attack', damage: 13, icon: '🚫', quip: '"Our lawyers will be in touch."' },
      { name: 'Restriction', type: 'debuff', applyToTarget: { weak: 2, dexterity: -1 }, icon: '🔗', quip: '"No working in tech for 2 years."' },
      { name: 'Court Order', type: 'attack', damage: 17, stressDamage: 5, icon: '⚖️', quip: '"See you in court. We have 40 lawyers."' },
    ],
  },

  the_pivot: {
    id: 'the_pivot',
    name: 'The Pivot',
    hp: 57,
    icon: '🔄',
    moves: [
      { name: 'Pivoting to AI', type: 'attack', damage: 14, icon: '🤖', quip: '"We\'re an AI company now."' },
      { name: 'Pivoting to Blockchain', type: 'buff', applyToSelf: { strength: 2 }, icon: '⛓️', quip: '"Web3 is definitely still a thing."' },
      { name: 'Pivoting to Cloud', type: 'attack_defend', damage: 10, block: 10, icon: '☁️', quip: '"Everything is serverless now."' },
      { name: 'Pivoting to... Pivot', type: 'stress_attack', stressDamage: 8, icon: '🔄', quip: '"Our core business is pivoting."' },
    ],
  },

  burnout_ember: {
    id: 'burnout_ember',
    name: 'Burnout Ember',
    hp: 53,
    icon: '🔥',
    moves: [
      { name: 'Smolder', type: 'debuff', applyToTarget: { poison: 4 }, icon: '🔥', quip: '"You love what you do, right?"' },
      { name: 'Flare Up', type: 'attack', damage: 10, stressDamage: 5, icon: '💥', quip: '"Sunday scaries are normal."' },
      { name: 'Slow Burn', type: 'stress_attack', stressDamage: 10, icon: '🕯️', quip: '"It\'s just a phase. For 3 years."' },
      { name: 'Ember Spread', type: 'debuff', applyToTarget: { poison: 3, vulnerable: 1 }, icon: '🌋', quip: '"Your passion is your problem."' },
    ],
  },

  meeting_email: {
    id: 'meeting_email',
    name: 'Meeting → Email',
    hp: 67,
    icon: '📧',
    moves: [
      { name: 'Let\'s Circle Back', type: 'attack', damage: 12, icon: '🔄', quip: '"Per my last email..."' },
      { name: 'Agenda Overload', type: 'exhaust', exhaustCount: 1, stressDamage: 4, icon: '📋', quip: '"42-item agenda for a 30-min call."' },
      { name: 'Reply All Storm', type: 'attack', damage: 10, times: 2, icon: '📧', quip: '"Please remove me from this thread."' },
      { name: 'Action Items', type: 'attack', damage: 16, icon: '✅', quip: '"You own all 17 action items."' },
    ],
  },

  the_counteroffer: {
    id: 'the_counteroffer',
    name: 'The Counteroffer',
    hp: 61,
    icon: '🤝',
    moves: [
      { name: 'Match Their Offer', type: 'heal_allies', healAmount: 10, icon: '💊', quip: '"We can match... mostly."' },
      { name: 'Retention Bonus', type: 'attack', damage: 12, icon: '💰', quip: '"One-time payment. Non-negotiable."' },
      { name: 'We Value You', type: 'heal_allies', healAmount: 8, icon: '❤️', quip: '"You\'re like family! (See Act 2.)"' },
      { name: 'Guilt Trip', type: 'attack', damage: 11, stressDamage: 5, icon: '😢', quip: '"After everything we\'ve done?"' },
    ],
  },

  background_check: {
    id: 'background_check',
    name: 'Background Check',
    hp: 59,
    icon: '🔎',
    moves: [
      { name: 'Deep Search', type: 'attack', damage: 12, icon: '🔎', quip: '"Found your MySpace page."' },
      { name: 'Found Something', type: 'attack', damage: 17, icon: '⚠️', quip: '"Care to explain this tweet?"' },
      { name: 'Verify Employment', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"That gap year looks suspicious."' },
      { name: 'Criminal Record Scan', type: 'attack', damage: 13, stressDamage: 5, icon: '🔍', quip: '"One parking ticket in 2019..."' },
    ],
  },

  relocation_package: {
    id: 'relocation_package',
    name: 'Relocation Package',
    hp: 65,
    icon: '🚚',
    moves: [
      { name: 'Palo Alto or Bust', type: 'attack', damage: 14, stressDamage: 6, icon: '🏠', quip: '"1BR for $4,500/month. Steal!"' },
      { name: 'Moving Costs', type: 'gold_steal', goldSteal: 15, icon: '💸', quip: '"We cover $500. Movers cost $8K."' },
      { name: 'Culture Shock', type: 'stress_attack', stressDamage: 10, icon: '😵', quip: '"Hope you like kombucha on tap."' },
      { name: 'Housing Crisis', type: 'attack', damage: 18, icon: '🏠', quip: '"Your commute is only 2 hours!"' },
    ],
  },

  // ── Act 3 Elite Enemies (HP +30, damage bumps — mini-bosses) ──

  board_member: {
    id: 'board_member',
    name: 'The Board Member',
    hp: 160,
    icon: '🎩',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 4 }, quip: '"The board demands RESULTS. NOW."' },
    ],
    moves: [
      // Phase 1: Board politics (indices 0-2)
      { name: 'Executive Order', type: 'attack', damage: 16, icon: '📜', quip: '"This came from the top."' },
      { name: 'Quarterly Review', type: 'attack_defend', damage: 12, block: 14, icon: '📊', quip: '"Numbers are down. Your fault."' },
      { name: 'Shareholder Pressure', type: 'buff', applyToSelf: { strength: 3 }, icon: '📈', quip: '"The shareholders demand growth!"' },
      // Phase 2: Hostile board (indices 3-5)
      { name: 'Emergency Board Meeting', type: 'buff', applyToSelf: { strength: 4 }, icon: '🔥', quip: '"This is a CRISIS."' },
      { name: 'Board Decision', type: 'attack', damage: 22, stressDamage: 8, icon: '⚡', quip: '"The board has spoken."' },
      { name: 'Hostile Acquisition', type: 'attack', damage: 12, times: 2, stressDamage: 6, icon: '☠️', quip: '"We\'re taking EVERYTHING."' },
    ],
  },

  golden_handcuffs: {
    id: 'golden_handcuffs',
    name: 'Golden Handcuffs',
    hp: 150,
    icon: '⛓️',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 4 }, quip: '"You\'ll NEVER leave."' },
    ],
    moves: [
      // Phase 1: Resource drain (indices 0-2)
      { name: 'Vest Schedule', type: 'exhaust', exhaustCount: 2, stressDamage: 5, icon: '📅', quip: '"Your cliff is in 11 months."' },
      { name: 'Retention Hit', type: 'attack', damage: 15, icon: '⛓️', quip: '"You can\'t afford to leave."' },
      { name: 'Stock Lock', type: 'exhaust', exhaustCount: 2, icon: '🔒', quip: '"90-day exercise window. Good luck."' },
      // Phase 2: Golden fury (indices 3-5)
      { name: 'Unvested Fury', type: 'buff', applyToSelf: { strength: 4 }, icon: '💎', quip: '"Your equity is WORTHLESS."' },
      { name: 'Golden Slam', type: 'attack', damage: 20, stressDamage: 5, icon: '💰', quip: '"Trapped by your own success!"' },
      { name: 'Market Crash', type: 'attack', damage: 10, times: 2, icon: '📉', quip: '"Portfolio value: ZERO."' },
    ],
  },

  the_reorg: {
    id: 'the_reorg',
    name: 'The Reorg',
    hp: 140,
    icon: '🌀',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 3 }, quip: '"EVERYTHING must go."' },
    ],
    moves: [
      // Phase 1: Corporate chaos (indices 0-2)
      { name: 'Shuffle Teams', type: 'discard', discardCount: 3, icon: '🔀', quip: '"Your team no longer exists."' },
      { name: 'New Manager', type: 'attack', damage: 14, stressDamage: 5, icon: '👤', quip: '"Meet your 4th manager this year."' },
      { name: 'Restructure', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '🌀', quip: '"Your role has been \'realigned.\'"' },
      // Phase 2: Scorched earth (indices 3-5)
      { name: 'Scorched Earth', type: 'buff', applyToSelf: { strength: 4 }, icon: '🔥', quip: '"Burn the org chart."' },
      { name: 'Mass Layoff', type: 'attack', damage: 20, icon: '🌊', quip: '"Efficiency optimization complete."' },
      { name: 'Reorg Slam', type: 'attack', damage: 10, times: 2, stressDamage: 6, icon: '💥', quip: '"Your role has been ELIMINATED."' },
    ],
  },

  technical_debt_golem: {
    id: 'technical_debt_golem',
    name: 'Technical Debt Golem',
    hp: 170,
    icon: '🗿',
    isElite: true,
    moves: [
      { name: 'Legacy Code', type: 'attack', damage: 10, icon: '📟', quip: '"This was written in jQuery. In 2024."' },
      { name: 'Accumulate', type: 'buff', applyToSelf: { strength: 3 }, icon: '📈', quip: '"TODO: fix later (2019)"' },
      { name: 'Spaghetti Strike', type: 'attack', damage: 14, icon: '🍝', quip: '"One file. 14,000 lines."' },
      { name: 'Technical Bankruptcy', type: 'attack', damage: 20, stressDamage: 6, icon: '💥', quip: '"No tests. No docs. No hope."' },
    ],
  },

  the_pip: {
    id: 'the_pip',
    name: 'The PIP',
    hp: 130,
    icon: '📉',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 3 }, quip: '"Your 30 days are UP."' },
    ],
    moves: [
      // Phase 1: Performance warning (indices 0-2)
      { name: 'Performance Review', type: 'debuff', applyToTarget: { strength: -1, dexterity: -1 }, icon: '📉', quip: '"Meets expectations. Barely."' },
      { name: 'Improvement Plan', type: 'stress_attack', stressDamage: 10, icon: '📋', quip: '"You have 30 days."' },
      { name: 'Final Warning', type: 'attack', damage: 16, stressDamage: 6, icon: '⚠️', quip: '"This is your last chance."' },
      // Phase 2: Termination mode (indices 3-5)
      { name: 'Clock Is Ticking', type: 'buff', applyToSelf: { strength: 3 }, icon: '⏰', quip: '"Tick. Tock."' },
      { name: 'Last Chance', type: 'attack', damage: 20, icon: '⚠️', quip: '"This is it."' },
      { name: 'Terminated', type: 'attack', damage: 25, stressDamage: 12, icon: '🚪', quip: '"Security will escort you out."' },
    ],
  },

  // ── Act 3 Bosses (HP bumped, 3 phases each) ──

  offer_committee: {
    id: 'offer_committee',
    name: 'The Offer Committee',
    hp: 300,
    icon: '👥',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { strength: 3 }, quip: '"The committee is getting serious."' },
      { hpPercent: 30, moveStartIndex: 5, onEnter: { strength: 5 }, quip: '"FINAL DELIBERATION."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'Committee Review', type: 'attack', damage: 12, icon: '📋', quip: '"We\'ve reviewed your... everything."' },
      { name: 'Stress Interview', type: 'stress_attack', stressDamage: 12, icon: '😰', quip: '"Sell me this pen. Now this desk."' },
      { name: 'Deliberation', type: 'defend', block: 20, icon: '🤔', quip: '"We need to discuss amongst ourselves."' },
      // Phase 2 (indices 3-4)
      { name: 'Budget Discussion', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '💰', quip: '"Headcount is frozen. Mostly."' },
      { name: 'Counter-Counter Offer', type: 'attack', damage: 20, stressDamage: 8, icon: '⚖️', quip: '"We counter your counter. Again."' },
      // Phase 3 (indices 5-7)
      { name: 'Unanimous Decision', type: 'buff', applyToSelf: { strength: 2 }, icon: '📈', quip: '"The committee is aligned."' },
      { name: 'Committee Slam', type: 'attack', damage: 32, icon: '💥', quip: '"Motion to reject. All in favor?"' },
      { name: 'Offer Rescinded', type: 'attack', damage: 28, stressDamage: 10, icon: '📄', quip: '"The offer has been WITHDRAWN."' },
    ],
  },

  the_ceo: {
    id: 'the_ceo',
    name: 'The CEO',
    hp: 280,
    icon: '🏆',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { strength: 3 }, quip: '"Enough pleasantries."' },
      { hpPercent: 30, moveStartIndex: 5, onEnter: { strength: 5 }, quip: '"I AM the company."' },
    ],
    moves: [
      // Phase 1: "Vision" (indices 0-2)
      { name: 'Visionary Speech', type: 'buff', applyToSelf: { strength: 2 }, icon: '🎤', quip: '"We\'re changing the world."' },
      { name: 'Inspire Fear', type: 'stress_attack', stressDamage: 10, icon: '😨', quip: '"Layoffs? What layoffs?"' },
      { name: 'Corporate Strategy', type: 'attack_defend', damage: 12, block: 10, icon: '📊', quip: '"It\'s a paradigm shift."' },
      // Phase 2: "Execution" (indices 3-4)
      { name: 'Execute!', type: 'attack', damage: 18, icon: '⚡', quip: '"Ship it or I ship you out."' },
      { name: 'Disruption', type: 'attack', damage: 16, stressDamage: 8, icon: '💥', quip: '"We disrupted the disruptors."' },
      // Phase 3: "Hostile" (indices 5-8)
      { name: 'Move Fast Break Things', type: 'attack', damage: 22, icon: '🔥', quip: '"Including your career!"' },
      { name: 'Golden Parachute', type: 'buff', applyToSelf: { strength: 3 }, icon: '🪂', quip: '"I have a $50M exit package."' },
      { name: 'Hostile Takeover', type: 'attack', damage: 34, stressDamage: 14, icon: '☠️', quip: '"Bow before the brand."' },
      { name: 'Scorched Earth', type: 'attack', damage: 26, stressDamage: 10, icon: '🔥', quip: '"If I can\'t have it, NO ONE can."' },
    ],
  },

  imposter_syndrome_final: {
    id: 'imposter_syndrome_final',
    name: 'Imposter Syndrome (Final Form)',
    hp: 250,
    icon: '🎭',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { strength: 3 }, quip: '"The doubt is spreading..."' },
      { hpPercent: 25, moveStartIndex: 5, onEnter: { strength: 5 }, quip: '"COMPLETE MELTDOWN IMMINENT."' },
    ],
    moves: [
      // Phase 1 (indices 0-2)
      { name: 'You\'re A Fraud', type: 'debuff', applyToTarget: { strength: -2 }, icon: '🎭', quip: '"You don\'t deserve this offer."' },
      { name: 'Everyone Knows', type: 'stress_attack', stressDamage: 15, icon: '👁️', quip: '"They\'re all whispering about you."' },
      { name: 'Spiral of Doubt', type: 'stress_attack', stressDamage: 12, icon: '🌀', quip: '"Was any of it real?"' },
      // Phase 2 (indices 3-4)
      { name: 'They\'ll Find Out', type: 'attack', damage: 12, stressDamage: 10, icon: '😱', quip: '"Day one. They\'ll know."' },
      { name: 'Crushing Anxiety', type: 'stress_attack', stressDamage: 18, icon: '💀', quip: '"You can\'t even breathe right."' },
      // Phase 3 (indices 5-7)
      { name: 'Identity Crisis', type: 'debuff', applyToTarget: { weak: 3, vulnerable: 3, strength: -1 }, icon: '🪞', quip: '"Who even are you anymore?"' },
      { name: 'Complete Meltdown', type: 'attack', damage: 26, stressDamage: 30, icon: '🔥', quip: '"EVERYTHING IS FALLING APART."' },
      { name: 'You Never Belonged', type: 'attack', damage: 22, stressDamage: 15, icon: '🎭', quip: '"They\'re going to REVOKE your degree."' },
    ],
  },
};

// ════════════════════════════════════════════════
// Encounter Tables — organized by Act
// ════════════════════════════════════════════════

// ── Act 1 — Teaching fights ──
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
  ['keyword_stuffer', 'resume_ats'],               // Buffer powers up striker
  ['recruiter_bot', 'ghost_company'],               // Hope debuff + hidden intent
  ['cover_letter_shredder', 'take_home'],           // Exhaust + stress pressure
  ['application_fee_scammer', 'job_board_troll'],   // Gold drain + vulnerable
  ['ai_ats', 'keyword_stuffer'],                    // Discard hand + buff damage
  ['entry_level_5yrs', 'recruiter_bot'],            // Tank + support debuffer
  ['linkedin_notification_swarm', 'linkedin_notification_swarm'], // Swarm, tests AoE
  ['legacy_ats', 'ghost_company'],                  // Block wall + hidden intent
];

const act1Trios: string[][] = [
  ['keyword_stuffer', 'resume_ats', 'recruiter_bot'],                         // Buffer + striker + debuffer
  ['linkedin_notification_swarm', 'linkedin_notification_swarm', 'linkedin_notification_swarm'], // Stress swarm
  ['cover_letter_shredder', 'application_fee_scammer', 'ghost_company'],      // Resource drain trio
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

// ── Act 2 — Punish fights ──
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
  ['whiteboard_demon', 'trivia_quizmaster'],            // Double vulnerable stacking
  ['recruiter_middleman', 'take_home_v2'],              // Support buffs DPS
  ['culture_fit_enforcer', 'behavioral_question_bot'],  // Stress pincer attack
  ['pair_programmer_enemy', 'reference_checker'],       // Double weak lock
  ['the_lowballer', 'zoom_fatigue'],                    // Gold drain + exhaust
  ['leetcode_goblin', 'leetcode_goblin'],               // Pure DPS race
  ['scheduling_nightmare', 'culture_fit_enforcer'],     // Debuff + stress
  ['whiteboard_demon', 'pair_programmer_enemy'],        // Vulnerable + boosted follow-up
];

const act2Trios: string[][] = [
  ['recruiter_middleman', 'whiteboard_demon', 'take_home_v2'],                       // Buffed assault
  ['leetcode_goblin', 'leetcode_goblin', 'leetcode_goblin'],                         // Grind rush
  ['culture_fit_enforcer', 'behavioral_question_bot', 'scheduling_nightmare'],       // Stress gauntlet
  ['the_lowballer', 'zoom_fatigue', 'reference_checker'],                            // Resource siege
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

// ── Act 3 — Brutal fights ──
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
  ['the_counteroffer', 'salary_negotiator'],              // Heal + gold drain (must kill healer)
  ['imposter_syndrome_common', 'burnout_ember'],          // Stress bomb + poison
  ['non_compete_clause', 'equity_phantom'],               // Deck destruction (3 exhaust/cycle)
  ['system_design_titan', 'the_pivot'],                   // Tank + escalator (Pivot stacks str)
  ['meeting_email', 'background_check'],                  // Exhaust + burst damage
  ['benefits_mimic', 'relocation_package'],               // Surprise burst + gold drain
  ['burnout_ember', 'burnout_ember'],                     // Poison swarm (6-8 poison/cycle)
  ['the_pivot', 'burnout_ember'],                         // Strength scaling + DoT
];

const act3Trios: string[][] = [
  ['imposter_syndrome_common', 'burnout_ember', 'equity_phantom'],                // Stress + poison + exhaust
  ['system_design_titan', 'the_pivot', 'the_counteroffer'],                       // Tank + scale + heal
  ['salary_negotiator', 'relocation_package', 'benefits_mimic'],                  // Economic siege
  ['non_compete_clause', 'background_check', 'meeting_email'],                    // Deck annihilation (4 exhaust/cycle)
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
