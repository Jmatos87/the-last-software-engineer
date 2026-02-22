import type { EnemyDef } from '../../types';

// ════════════════════════════════════════════════
// ACT 1 — The Application Abyss
// ════════════════════════════════════════════════

export const act1Enemies: Record<string, EnemyDef> = {

  // ── Act 1 Common Enemies ──
  // Archetypes: Ritualist (StS), Wake-Up (RoP), Escalator (MT), Wildcard (Inscryption), Compound (DD)

  // RITUALIST — buffs self, then releases scaled hit
  resume_ats: {
    id: 'resume_ats',
    name: 'Resume ATS Filter',
    hp: 65,
    gold: 20,
    icon: '🤖',
    moves: [
      { name: 'Keyword Scan', type: 'attack', damage: 9, icon: '🔍', quip: '"Hmm... no blockchain?"' },
      { name: 'Pattern Match', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🧠', quip: '"Updating rejection model..."' },
      { name: 'Format Error', type: 'attack', damage: 13, icon: '📋', quip: '"PDF? We only take .docx."' },
      { name: 'Deep Scan', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🔬', quip: '"Running neural rejection layer..."' },
      { name: 'AUTO-REJECT', type: 'attack', damage: 22, icon: '❌', quip: '"Better luck never!"' },
    ],
  },

  // RITUALIST — defend-then-strike, Timeout Slam scales off confidence
  legacy_ats: {
    id: 'legacy_ats',
    name: 'Legacy ATS',
    hp: 72,
    gold: 26,
    icon: '🖨️',
    moves: [
      { name: 'Connection Lost', type: 'attack', damage: 11, icon: '📡', quip: '"Server circa 2003 says hi."' },
      { name: 'Loading...', type: 'buff', applyToSelf: { confidence: 3 }, icon: '⏳', quip: '"Please wait 3-5 business days."' },
      { name: 'System Error', type: 'attack', damage: 9, stressDamage: 5, icon: '⚠️', quip: '"Have you tried IE6?"' },
      { name: 'Timeout Slam', type: 'attack', damage: 22, icon: '💤', quip: '"Session expired. Start over."' },
    ],
  },

  // WILDCARD — hideIntent; alternates scan/debuff/surprise exhaust+attack
  ai_ats: {
    id: 'ai_ats',
    name: 'AI-Powered ATS',
    hp: 60,
    gold: 18,
    icon: '🧠',
    moves: [
      { name: 'Deep Scan', type: 'attack', damage: 9, icon: '🔬', quip: '"My neural net says no."' },
      { name: 'Pattern Match', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🎯', quip: '"You match 0.3% of candidates."' },
      { name: 'Neural Reject', type: 'exhaust', exhaustCount: 2, icon: '🗑️', quip: '"GPT wrote a better resume."' },
      { name: 'AI Assessment', type: 'attack', damage: 16, stressDamage: 6, icon: '⚡', quip: '"I replaced the recruiter too."' },
    ],
  },

  // WAKE-UP — cycle escalates from 6 dmg to 20 dmg; killing it fast matters
  recruiter_bot: {
    id: 'recruiter_bot',
    name: 'Recruiter Bot',
    hp: 68,
    gold: 22,
    icon: '🤳',
    moves: [
      { name: 'Cold Email', type: 'attack', damage: 6, stressDamage: 4, icon: '📧', quip: '"Quick 15-min chat?"' },
      { name: 'Exciting Opportunity!', type: 'attack', damage: 11, applyToTarget: { hope: 2 }, icon: '✨', quip: '"Perfect fit for your skillset!"' },
      { name: "Let's Circle Back", type: 'attack', damage: 15, stressDamage: 6, icon: '🔄', quip: '"Touching base per my last email."' },
      { name: "Actually, It's Contract", type: 'attack', damage: 20, stressDamage: 8, icon: '📄', quip: '"But great for your portfolio!"' },
    ],
  },

  // WILDCARD — hideIntent; gold drain then surprise high attack on Vanish turn
  ghost_company: {
    id: 'ghost_company',
    name: 'Ghost Company',
    hp: 60,
    gold: 8,
    icon: '👻',
    hideIntent: true,
    moves: [
      { name: 'Radio Silence', type: 'stress_attack', stressDamage: 9, icon: '📵', quip: '"..."' },
      { name: 'Form Letter', type: 'attack', damage: 13, icon: '📨', quip: '"We went with another candidate."' },
      { name: 'Vanish', type: 'debuff', applyToTarget: { ghosted: 2, weak: 1 }, icon: '💨', quip: '"*seen at 3:47 PM*"' },
    ],
  },

  // COMPOUND — poison re-applies each cycle; vulnerable compounds; stress cascade at end
  take_home: {
    id: 'take_home',
    name: 'Take-Home Assignment',
    hp: 75,
    gold: 24,
    icon: '📝',
    moves: [
      { name: 'Requirements Doc', type: 'debuff', applyToTarget: { poison: 3 }, icon: '📄', quip: '"Oh, and add auth too."' },
      { name: 'Scope Creep', type: 'attack', damage: 13, applyToTarget: { poison: 2 }, icon: '📈', quip: '"Just one more feature..."' },
      { name: 'Edge Cases', type: 'attack', damage: 17, applyToTarget: { vulnerable: 2 }, icon: '🔥', quip: '"What if the user is on a boat?"' },
      { name: 'Due Tomorrow', type: 'stress_attack', stressDamage: 18, icon: '⏰', quip: '"Should only take a few hours!"' },
    ],
  },

  // COMPOUND — exhaust + vulnerable stacks compound across cycles
  cover_letter_shredder: {
    id: 'cover_letter_shredder',
    name: 'Cover Letter Shredder',
    hp: 64,
    gold: 20,
    icon: '✂️',
    moves: [
      { name: 'Shred!', type: 'exhaust', exhaustCount: 2, icon: '✂️', quip: '"Nobody reads these anyway."' },
      { name: 'Paper Cut', type: 'attack', damage: 14, applyToTarget: { vulnerable: 1 }, icon: '📃', quip: '"Ow! That was my best paragraph!"' },
      { name: 'Confetti Storm', type: 'attack', damage: 11, stressDamage: 5, applyToTarget: { vulnerable: 2 }, icon: '🎊', quip: '"Your passion is now confetti!"' },
    ],
  },

  // ESCALATOR — gains confidence via Synergy! buff; also buffs allies in group fights
  keyword_stuffer: {
    id: 'keyword_stuffer',
    name: 'Keyword Stuffer',
    hp: 68,
    gold: 16,
    icon: '🔑',
    moves: [
      { name: 'SEO Boost', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '📈', quip: '"Leverage those core competencies!"' },
      { name: 'Buzzword Slap', type: 'attack', damage: 10, icon: '💬', quip: '"Synergize this!"' },
      { name: 'Synergy!', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤝', quip: '"Let\'s align our paradigms!"' },
      { name: 'Jargon Jab', type: 'attack', damage: 14, icon: '📝', quip: '"Circle back on that deliverable!"' },
    ],
  },

  // COMPOUND — debuffs compound; resilience drain makes player block less effective
  job_board_troll: {
    id: 'job_board_troll',
    name: 'Job Board Troll',
    hp: 65,
    gold: 22,
    icon: '🧌',
    moves: [
      { name: 'Overqualified!', type: 'debuff', applyToTarget: { resilience: -1, vulnerable: 1 }, icon: '📜', quip: '"PhD for data entry? Pass."' },
      { name: 'Troll Smash', type: 'attack', damage: 13, icon: '👊', quip: '"Just learn to code lol"' },
      { name: 'Underqualified!', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"Only 9 years of React?"' },
      { name: 'Flame War', type: 'attack', damage: 18, stressDamage: 6, icon: '🔥', quip: '"Tabs vs spaces... FIGHT!"' },
    ],
  },

  // WILDCARD — hideIntent; gold drain is the real threat, Surcharge is a nasty surprise
  application_fee_scammer: {
    id: 'application_fee_scammer',
    name: 'Application Fee Scammer',
    hp: 62,
    gold: 28,
    icon: '💰',
    moves: [
      { name: 'Processing Fee', type: 'gold_steal', goldSteal: 16, icon: '💸', quip: '"Small fee to apply. Totally legit."' },
      { name: 'Admin Fee', type: 'gold_steal', goldSteal: 12, stressDamage: 6, icon: '🧾', quip: '"Background check costs extra."' },
      { name: 'Surcharge', type: 'attack', damage: 20, icon: '💳', quip: '"Convenience fee for the privilege!"' },
    ],
  },

  // ESCALATOR — gains confidence via attack_defend (applyToSelf) and Fortify (buff)
  entry_level_5yrs: {
    id: 'entry_level_5yrs',
    name: '"Entry Level" (5 Yrs Exp)',
    hp: 70,
    gold: 24,
    icon: '📋',
    moves: [
      { name: 'Impossible Requirements', type: 'attack_defend', damage: 10, block: 5, applyToSelf: { confidence: 1 }, icon: '📝', quip: '"10 years Swift. It\'s from 2014."' },
      { name: 'Must Know 12 Frameworks', type: 'attack', damage: 17, icon: '📚', quip: '"Also COBOL. Non-negotiable."' },
      { name: 'Fortify', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🏗️', quip: '"Competitive salary. Trust us."' },
      { name: 'Gatekeep', type: 'attack', damage: 14, stressDamage: 5, icon: '🚧', quip: '"Entry level. Senior pay? Lol."' },
    ],
  },

  // COMPOUND — stress compounds each cycle; Ding! escalates
  linkedin_notification_swarm: {
    id: 'linkedin_notification_swarm',
    name: 'LinkedIn Notification',
    hp: 26,
    gold: 10,
    icon: '🔔',
    moves: [
      { name: 'Ping!', type: 'attack', damage: 9, stressDamage: 5, icon: '🔔', quip: '"Someone viewed your profile!"' },
      { name: 'Buzz!', type: 'stress_attack', stressDamage: 9, icon: '📳', quip: '"37 new job alerts!"' },
      { name: 'Ding!', type: 'attack', damage: 13, stressDamage: 6, icon: '🛎️', quip: '"Congrats on 5 years at—oh wait."' },
    ],
  },

  // ── Act 1 Elite Enemies ──

  // SUMMONER — summons ats_minion × 2 at 50% HP; re-summons one more in phase 2 cycle
  applicant_tracking_golem: {
    id: 'applicant_tracking_golem',
    name: 'Applicant Tracking Golem',
    hp: 110,
    gold: 82,
    icon: '⚙️',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"SUMMONING BACKUP. REJECTION ENHANCED."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'System Slam', type: 'attack', damage: 14, icon: '⚙️', quip: '"Application #4,729 processed."' },
      { name: 'Absorb Pattern', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🔄', quip: '"Optimizing rejection pipeline..."' },
      { name: 'Data Crunch', type: 'attack', damage: 10, times: 2, icon: '💾', quip: '"Your data is now our data."' },
      // Phase 2 (3-6) — summon on first move of phase 2
      { name: 'Deploy Minions', type: 'summon', summonId: 'ats_minion', summonCount: 2, icon: '🤖', quip: '"INITIATING PARALLEL REJECTION PROTOCOL."' },
      { name: 'Process Queue', type: 'attack_defend', damage: 14, block: 12, icon: '📊', quip: '"You are #8,341 in the queue."' },
      { name: 'Firewall Upload', type: 'attack', damage: 18, icon: '🔗', quip: '"Firewall engaged. You\'re locked out."' },
      { name: 'Backup Minion', type: 'summon', summonId: 'ats_minion', summonCount: 1, icon: '🤖', quip: '"Deploying contingency unit."' },
    ],
  },

  // ESCALATOR — gains confidence permanently every turn; Influencer Barrage is murder late
  linkedin_influencer: {
    id: 'linkedin_influencer',
    name: 'LinkedIn Influencer',
    hp: 105,
    gold: 70,
    icon: '📱',
    isElite: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"Time to go VIRAL."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Viral Post', type: 'attack', damage: 13, icon: '📢', quip: '"Agree? 👇 Like & repost."' },
      { name: 'Humble Brag', type: 'buff', applyToSelf: { confidence: 2 }, icon: '😬', quip: '"I turned down 47 offers this week."' },
      { name: 'Engagement Farming', type: 'attack_defend', damage: 8, block: 6, applyToSelf: { regen: 2 }, icon: '🌱', quip: '"I cried at my standing desk today."' },
      // Phase 2 (3-5)
      { name: 'Personal Brand', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤳', quip: '"I\'m building an EMPIRE."' },
      { name: 'Influencer Barrage', type: 'attack', damage: 7, times: 3, icon: '📱', quip: '"Like. Share. SUBSCRIBE."' },
      { name: 'Thought Leader Slam', type: 'attack', damage: 18, stressDamage: 8, icon: '💡', quip: '"I posted about hustle culture at 4 AM."' },
    ],
  },

  // JUGGERNAUT — Phase 1 builds block+confidence; Phase 2 erupts with massive scaled hits
  unpaid_take_home: {
    id: 'unpaid_take_home',
    name: 'Unpaid Take-Home Assignment',
    hp: 115,
    gold: 76,
    icon: '💸',
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 2, onEnter: { confidence: 3, resilience: 1 }, quip: '"Oh, and add microservices. And CI/CD."' },
    ],
    moves: [
      // Phase 1 (0-1)
      { name: 'Overscoped!', type: 'exhaust', exhaustCount: 2, stressDamage: 8, icon: '📋', quip: '"Oh, and write the documentation."' },
      { name: 'Crunch Time', type: 'attack', damage: 16, icon: '😰', quip: '"Due in 4 hours. No pressure!"' },
      // Phase 2 (2-4)
      { name: 'Scope Creep', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📈', quip: '"Oh also build the backend."' },
      { name: 'Pair Stress', type: 'attack', damage: 10, times: 2, stressDamage: 5, icon: '😵', quip: '"This should be a weekend project!"' },
      { name: 'Full-Stack Assault', type: 'attack', damage: 24, icon: '💥', quip: '"Add CI/CD and deploy to prod."' },
    ],
  },

  // MANIPULATOR — energy drain + corrupt; drains resources and poisons your deck
  networking_event: {
    id: 'networking_event',
    name: 'The Networking Event',
    hp: 100,
    gold: 72,
    icon: '🍸',
    isElite: true,
    moves: [
      { name: 'Small Talk', type: 'energy_drain', energyDrain: 1, stressDamage: 10, icon: '💬', quip: '"So... what do you do?"' },
      { name: 'Awkward Handshake', type: 'attack', damage: 12, stressDamage: 5, icon: '🤝', quip: '"*limp fish grip*"' },
      { name: 'Elevator Pitch', type: 'corrupt', stressDamage: 4, icon: '🗣️', quip: '"I\'m disrupting disruption. Here\'s my card."' },
      { name: 'Exchange Cards', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📇', quip: '"Let\'s connect on LinkedIn!"' },
      { name: 'Thought Leadership', type: 'attack', damage: 18, icon: '💡', quip: '"This is how I closed my Series A."' },
    ],
  },

  // BERSERKER — starts with confidence +4; DPS race from turn 1
  automated_rejection: {
    id: 'automated_rejection',
    name: 'Automated Rejection Letter',
    hp: 120,
    gold: 65,
    icon: '✉️',
    isElite: true,
    startStatusEffects: { confidence: 4 },
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"INITIATING BATCH REJECTION PROTOCOL."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Demoralize', type: 'debuff', applyToTarget: { confidence: -1 }, icon: '😞', quip: '"Thank you for your interest."' },
      { name: 'Form Rejection', type: 'attack', damage: 12, stressDamage: 5, icon: '✉️', quip: '"Dear [CANDIDATE_NAME]..."' },
      { name: 'Not A Good Fit', type: 'attack', damage: 20, icon: '❌', quip: '"We\'re looking for a unicorn."' },
      // Phase 2 (3-5) — now at confidence +7
      { name: 'Auto-Reject Mode', type: 'buff', applyToSelf: { confidence: 2 }, icon: '⚙️', quip: '"PROCESSING 10,000 APPLICATIONS..."' },
      { name: 'Rejection Cascade', type: 'attack', damage: 7, times: 4, icon: '✉️', quip: '"Rejected. Rejected. Rejected. Rejected."' },
      { name: 'Mass Rejection', type: 'attack', damage: 22, stressDamage: 10, icon: '❌', quip: '"Your entire career has been archived."' },
    ],
  },

  // ── Act 1 Bosses ──

  hr_phone_screen: {
    id: 'hr_phone_screen',
    name: 'HR Phone Screen',
    hp: 210,
    gold: 120,
    icon: '📞',
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"Gloves are off. Let\'s talk comp."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { confidence: 3 }, quip: '"This interview is OVER."' },
    ],
    moves: [
      // Phase 1: soft questions (0-2)
      { name: 'Tell Me About Yourself', type: 'attack', damage: 9, icon: '🎤', quip: '"Keep it under 30 seconds."' },
      { name: 'Why This Company?', type: 'attack', damage: 12, icon: '🏢', quip: '"Wrong answer."' },
      { name: 'Greatest Weakness?', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '😓', quip: '"Don\'t say perfectionism."' },
      // Phase 2: aggressive (3-6)
      { name: 'Where Do You See Yourself?', type: 'attack', damage: 15, icon: '🔮', quip: '"In 5 years. Be specific."' },
      { name: 'Recall Hold Music', type: 'summon', summonId: 'hold_music', summonCount: 1, icon: '🎵', quip: '"Please hold while I escalate this."' },
      { name: 'Salary Expectations?', type: 'attack', damage: 18, stressDamage: 7, icon: '💵', quip: '"What\'s your current comp?"' },
      { name: "We'll Be In Touch", type: 'attack', damage: 22, stressDamage: 10, icon: '☎️', quip: '"(Narrator: They weren\'t.)"' },
      // Phase 3: pure DPS race (7-8)
      { name: 'Benefits Bait', type: 'attack', damage: 24, stressDamage: 8, icon: '🎣', quip: '"Last chance. Take the offer or get nothing."' },
      { name: 'REJECTED', type: 'attack', damage: 30, stressDamage: 12, icon: '❌', quip: '"We went with another candidate. Forever."' },
    ],
  },

  ats_final_form: {
    id: 'ats_final_form',
    name: 'The ATS Final Form',
    hp: 245,
    gold: 130,
    icon: '🏗️',
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"THIS ISN\'T EVEN MY FINAL FORM."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { confidence: 4 }, quip: '"CRITICAL FAILURE IMMINENT."' },
    ],
    moves: [
      // Phase 1: scans + discards (0-3)
      { name: 'Full System Scan', type: 'attack', damage: 10, icon: '🔍', quip: '"Scanning for hope... none found."' },
      { name: 'Resume Shredder', type: 'discard', discardCount: 2, stressDamage: 5, icon: '🗑️', quip: '"Formatting: UNACCEPTABLE."' },
      { name: 'Keyword Purge', type: 'attack', damage: 13, icon: '⚡', quip: '"You said \'passionate.\' Cringe."' },
      { name: 'Database Overwrite', type: 'attack_defend', damage: 9, block: 10, icon: '💾', quip: '"Your file has been... updated."' },
      // Phase 2: raw power (4-7)
      { name: 'TRANSFORM', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🔥', quip: '"MAXIMUM OVERDRIVE ENGAGED."' },
      { name: 'Deploy Validator', type: 'summon', summonId: 'resume_validator', summonCount: 1, icon: '📄', quip: '"Re-initializing validation subsystem."' },
      { name: 'Total Rejection', type: 'attack', damage: 16, times: 2, icon: '❌', quip: '"Application status: OBLITERATED."' },
      { name: 'System Crash', type: 'attack', damage: 30, stressDamage: 11, icon: '💀', quip: '"Fatal error: career not found."' },
      // Phase 3: DPS race (8-9)
      { name: 'Reboot Crush', type: 'attack', damage: 26, stressDamage: 9, icon: '💀', quip: '"Rebooting... to destroy you faster."' },
      { name: 'CAREER_NOT_FOUND', type: 'attack', damage: 34, stressDamage: 13, icon: '💀', quip: '"Fatal error: hope.exe not found."' },
    ],
  },

  ghosting_phantom: {
    id: 'ghosting_phantom',
    name: 'The Ghosting Phantom',
    hp: 200,
    gold: 110,
    icon: '👻',
    isBoss: true,
    hideIntent: true,
    phases: [
      { hpPercent: 40, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"You\'ll never hear from us again."' },
      { hpPercent: 25, moveStartIndex: 6, onEnter: { confidence: 4 }, quip: '"You\'ll never hear from ANYONE again."' },
    ],
    moves: [
      // Phase 1: eerie (0-2)
      { name: 'Haunt', type: 'attack', damage: 10, stressDamage: 5, icon: '👻', quip: '"Remember that interview? Me neither."' },
      { name: 'Read Receipt', type: 'attack', damage: 13, icon: '✓', quip: '"✓✓ Seen 3 weeks ago."' },
      { name: 'Gone Dark', type: 'stress_attack', stressDamage: 13, icon: '🌑', quip: '"*This number is no longer in service*"' },
      // Phase 2: aggressive (3-5)
      { name: 'Conjure Echo', type: 'summon', summonId: 'ghost_echo', summonCount: 1, icon: '👻', quip: '"You\'ll never be truly alone."' },
      { name: 'Spectral Slash', type: 'attack', damage: 17, icon: '💫', quip: '"I was never even real."' },
      { name: 'Full Ghosting', type: 'attack', damage: 28, stressDamage: 11, icon: '☠️', quip: '"The position has been filled... forever."' },
      // Phase 3: DPS race (6-7)
      { name: 'Eternal Silence', type: 'attack', damage: 24, stressDamage: 11, icon: '🕳️', quip: '"The inbox will never reply. Ever."' },
      { name: 'Final Ghosting', type: 'attack', damage: 30, stressDamage: 15, icon: '☠️', quip: '"You never existed to us."' },
    ],
  },

  // ── Act 1 Minions (spawned by elites/bosses) ──

  ats_minion: {
    id: 'ats_minion',
    name: 'ATS Minion',
    hp: 18,
    gold: 0,
    icon: '🤖',
    moves: [
      { name: 'Format Check', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"Wrong file type."' },
      { name: 'Keyword Error', type: 'attack', damage: 7, stressDamage: 3, icon: '❌', quip: '"Missing: blockchain, synergy, agile."' },
    ],
  },

  hold_music: {
    id: 'hold_music',
    name: 'Hold Music',
    hp: 25,
    gold: 8,
    icon: '🎵',
    moves: [
      { name: 'Please Hold', type: 'energy_drain', energyDrain: 1, stressDamage: 7, icon: '📞', quip: '"Your call is important to us."' },
      { name: 'Elevator Music', type: 'stress_attack', stressDamage: 10, icon: '🎶', quip: '"...Muzak intensifies..."' },
      { name: 'Transfer', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '🔀', quip: '"Let me connect you."' },
    ],
  },

  resume_validator: {
    id: 'resume_validator',
    name: 'Resume Validator',
    hp: 22,
    gold: 6,
    icon: '📄',
    moves: [
      { name: 'Format Error', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"PDF rejected. Again."' },
      { name: 'Validation Failed', type: 'corrupt', stressDamage: 5, icon: '🐛', quip: '"Resubmit from scratch."' },
    ],
  },

  ghost_echo: {
    id: 'ghost_echo',
    name: 'Ghost Echo',
    hp: 18,
    gold: 5,
    icon: '👻',
    hideIntent: true,
    moves: [
      { name: 'Whisper', type: 'exhaust', exhaustCount: 1, icon: '💨', quip: '"*you hear nothing*"' },
      { name: 'Fade', type: 'stress_attack', stressDamage: 8, icon: '🌑', quip: '"*still nothing*"' },
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
  ['hr_phone_screen', 'hold_music'],
  ['ats_final_form', 'resume_validator'],
  ['ghosting_phantom', 'ghost_echo', 'ghost_echo'],
];
