import type { EnemyDef } from '../../types';
import hrPhoneScreenPortrait from '../../assets/act1/hr-phone-screen.png';
import atsFinalFormPortrait from '../../assets/act1/ats-final-form.png';
import ghostingPhantomPortrait from '../../assets/act1/ghosting-phantom.png';
import takeHomePortrait from '../../assets/act1/take-home-assignment.png';
import resumeAtsPortrait from '../../assets/act1/resume-ats.png';
import recruiterBotPortrait from '../../assets/act1/recruiter-bot.png';
import coverLetterShredderPortrait from '../../assets/act1/cover-letter-shredder.png';
import jobBoardTrollPortrait from '../../assets/act1/job-board-troll.png';
import applicationFeeScammerPortrait from '../../assets/act1/application-fee-scammer.png';
import linkedinSwarmPortrait from '../../assets/act1/linkedin-swarm.png';
import applicantTrackingGolemPortrait from '../../assets/act1/applicant-tracking-golem.png';
import linkedinInfluencerPortrait from '../../assets/act1/linkedin-influencer.png';
import networkingEventPortrait from '../../assets/act1/networking-event.png';
import automatedRejectionPortrait from '../../assets/act1/automated-rejection.png';

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
    portrait: resumeAtsPortrait,
    moves: [
      { name: 'Keyword Scan', type: 'attack', damage: 9, icon: '🔍', quip: '"Your scroll lacks the blockchain enchantment..."' },
      { name: 'Pattern Match', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🧠', quip: '"The rejection runes grow stronger..."' },
      { name: 'Format Error', type: 'attack', damage: 13, icon: '📋', quip: '"A parchment scroll? I only read .docx tomes."' },
      { name: 'Deep Scan', type: 'buff', applyToSelf: { confidence: 2 }, icon: '🔬', quip: '"Channeling the neural rejection ward..."' },
      { name: 'AUTO-REJECT', type: 'attack', damage: 22, icon: '❌', quip: '"The gates seal forever, applicant!"' },
    ],
  },

  // WAKE-UP — cycle escalates from 6 dmg to 20 dmg; killing it fast matters
  recruiter_bot: {
    id: 'recruiter_bot',
    name: 'Recruiter Bot',
    hp: 68,
    gold: 22,
    icon: '🤳',
    portrait: recruiterBotPortrait,
    moves: [
      { name: 'Cold Email', type: 'attack', damage: 6, stressDamage: 4, icon: '📧', quip: '"A brief audience, mortal? Just fifteen minutes of your soul."' },
      { name: 'Exciting Opportunity!', type: 'attack', damage: 11, applyToTarget: { hope: 2 }, icon: '✨', quip: '"The stars foretell a perfect fit for thee!"' },
      { name: "Let's Circle Back", type: 'attack', damage: 15, stressDamage: 6, icon: '🔄', quip: '"Per my last raven, we must circle back."' },
      { name: "Actually, It's Contract", type: 'attack', damage: 20, stressDamage: 8, icon: '📄', quip: '"Tis but a cursed contract. Great for thy portfolio!"' },
    ],
  },


  // COMPOUND — exhaust + vulnerable stacks compound across cycles
  cover_letter_shredder: {
    id: 'cover_letter_shredder',
    name: 'Cover Letter Shredder',
    hp: 64,
    gold: 20,
    icon: '✂️',
    portrait: coverLetterShredderPortrait,
    moves: [
      { name: 'Shred!', type: 'exhaust', exhaustCount: 2, icon: '✂️', quip: '"No mortal reads these scrolls anyway."' },
      { name: 'Paper Cut', type: 'attack', damage: 14, applyToTarget: { vulnerable: 1 }, icon: '📃', quip: '"That was your finest incantation! Gone."' },
      { name: 'Confetti Storm', type: 'attack', damage: 11, stressDamage: 5, applyToTarget: { vulnerable: 2 }, icon: '🎊', quip: '"Your passion is but confetti in the wind!"' },
    ],
  },

  // COMPOUND — debuffs compound; resilience drain makes player block less effective
  job_board_troll: {
    id: 'job_board_troll',
    name: 'Job Board Troll',
    hp: 65,
    gold: 22,
    icon: '🧌',
    portrait: jobBoardTrollPortrait,
    moves: [
      { name: 'Overqualified!', type: 'debuff', applyToTarget: { resilience: -1, vulnerable: 1 }, icon: '📜', quip: '"A doctorate for data entry? Begone, wizard!"' },
      { name: 'Troll Smash', type: 'attack', damage: 13, icon: '👊', quip: '"Simply master the arcane arts, fool."' },
      { name: 'Underqualified!', type: 'debuff', applyToTarget: { vulnerable: 2, weak: 1 }, icon: '📋', quip: '"Only nine winters of React sorcery?"' },
      { name: 'Flame War', type: 'attack', damage: 18, stressDamage: 6, icon: '🔥', quip: '"Tabs versus spaces — TO THE DEATH!"' },
    ],
  },

  // WILDCARD — hideIntent; gold drain is the real threat, Surcharge is a nasty surprise
  application_fee_scammer: {
    id: 'application_fee_scammer',
    name: 'Application Fee Scammer',
    hp: 62,
    gold: 28,
    icon: '💰',
    portrait: applicationFeeScammerPortrait,
    moves: [
      { name: 'Processing Fee', type: 'gold_steal', goldSteal: 16, icon: '💸', quip: '"A modest tithe to enter. Perfectly legitimate."' },
      { name: 'Admin Fee', type: 'gold_steal', goldSteal: 12, stressDamage: 6, icon: '🧾', quip: '"The background scrying costs extra, traveler."' },
      { name: 'Surcharge', type: 'attack', damage: 20, icon: '💳', quip: '"A convenience toll for the privilege of my dungeon!"' },
    ],
  },

  // COMPOUND — stress compounds each cycle; Ding! escalates
  linkedin_notification_swarm: {
    id: 'linkedin_notification_swarm',
    name: 'LinkedIn Notification',
    hp: 26,
    gold: 10,
    icon: '🔔',
    portrait: linkedinSwarmPortrait,
    moves: [
      { name: 'Ping!', type: 'attack', damage: 9, stressDamage: 5, icon: '🔔', quip: '"A dark spirit has viewed thy profile!"' },
      { name: 'Buzz!', type: 'stress_attack', stressDamage: 9, icon: '📳', quip: '"Thirty-seven new quest alerts swarm thee!"' },
      { name: 'Ding!', type: 'attack', damage: 13, stressDamage: 6, icon: '🛎️', quip: '"Hail thy five-year oath at — oh wait."' },
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
    portrait: applicantTrackingGolemPortrait,
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"SUMMONING CONSTRUCTS. REJECTION WARDS AMPLIFIED."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'System Slam', type: 'attack', damage: 14, icon: '⚙️', quip: '"Application four thousand seven hundred and twenty-nine. Processed."' },
      { name: 'Absorb Pattern', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🔄', quip: '"Absorbing thy failures to fuel my wards..."' },
      { name: 'Data Crunch', type: 'attack', damage: 10, times: 2, icon: '💾', quip: '"Your essence belongs to the archive now."' },
      // Phase 2 (3-6) — summon on first move of phase 2
      { name: 'Deploy Minions', type: 'summon', summonId: 'ats_minion', summonCount: 2, icon: '🤖', quip: '"INITIATING THE PARALLEL REJECTION RITUAL."' },
      { name: 'Process Queue', type: 'attack_defend', damage: 14, block: 12, icon: '📊', quip: '"Thou art number eight thousand in the summoning queue."' },
      { name: 'Firewall Upload', type: 'attack', damage: 18, icon: '🔗', quip: '"The warding flame is raised. You shall not pass."' },
      { name: 'Backup Minion', type: 'summon', summonId: 'ats_minion', summonCount: 1, icon: '🤖', quip: '"Rise, contingency construct!"' },
    ],
  },

  // ESCALATOR — gains confidence permanently every turn; Influencer Barrage is murder late
  linkedin_influencer: {
    id: 'linkedin_influencer',
    name: 'LinkedIn Influencer',
    hp: 105,
    gold: 70,
    icon: '📱',
    portrait: linkedinInfluencerPortrait,
    isElite: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 3, onEnter: { confidence: 2 }, quip: '"The time has come to go LEGENDARY."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Viral Post', type: 'attack', damage: 13, icon: '📢', quip: '"Agree, mortals? Bow and repost."' },
      { name: 'Humble Brag', type: 'buff', applyToSelf: { confidence: 2 }, icon: '😬', quip: '"I turned down forty-seven guild offers this fortnight."' },
      { name: 'Engagement Farming', type: 'attack_defend', damage: 8, block: 6, applyToSelf: { regen: 2 }, icon: '🌱', quip: '"I wept at my standing altar today. So brave."' },
      // Phase 2 (3-5)
      { name: 'Personal Brand', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤳', quip: '"I am building an EMPIRE of influence!"' },
      { name: 'Influencer Barrage', type: 'attack', damage: 7, times: 3, icon: '📱', quip: '"Like. Share. SUBMIT TO MY DOMINION."' },
      { name: 'Thought Leader Slam', type: 'attack', damage: 18, stressDamage: 8, icon: '💡', quip: '"I posted a hustle manifesto at the fourth bell."' },
    ],
  },

  // JUGGERNAUT — Phase 1 builds block+confidence; Phase 2 erupts with massive scaled hits
  unpaid_take_home: {
    id: 'unpaid_take_home',
    name: 'Unpaid Take-Home Assignment',
    hp: 115,
    gold: 76,
    icon: '💸',
    portrait: takeHomePortrait,
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 2, onEnter: { confidence: 3, resilience: 1 }, quip: '"Oh, and conjure microservices. And a CI/CD ritual circle."' },
    ],
    moves: [
      // Phase 1 (0-1)
      { name: 'Overscoped!', type: 'exhaust', exhaustCount: 2, stressDamage: 8, icon: '📋', quip: '"Oh, and inscribe the documentation scrolls too."' },
      { name: 'Crunch Time', type: 'attack', damage: 16, icon: '😰', quip: '"Due in four hourglasses. No pressure, hero!"' },
      // Phase 2 (2-4)
      { name: 'Scope Creep', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📈', quip: '"Oh, also forge the entire backend realm."' },
      { name: 'Pair Stress', type: 'attack', damage: 10, times: 2, stressDamage: 5, icon: '😵', quip: '"A mere weekend quest, surely!"' },
      { name: 'Full-Stack Assault', type: 'attack', damage: 24, icon: '💥', quip: '"Bind the CI/CD runes and deploy to production!"' },
    ],
  },

  // MANIPULATOR — energy drain + corrupt; drains resources and poisons your deck
  networking_event: {
    id: 'networking_event',
    name: 'The Networking Event',
    hp: 100,
    gold: 72,
    icon: '🍸',
    portrait: networkingEventPortrait,
    isElite: true,
    moves: [
      { name: 'Small Talk', type: 'energy_drain', energyDrain: 1, stressDamage: 10, icon: '💬', quip: '"So... what manner of adventurer art thou?"' },
      { name: 'Awkward Handshake', type: 'attack', damage: 12, stressDamage: 5, icon: '🤝', quip: '"*extends a clammy gauntlet*"' },
      { name: 'Elevator Pitch', type: 'corrupt', stressDamage: 4, icon: '🗣️', quip: '"I am disrupting disruption. Take my calling rune."' },
      { name: 'Exchange Cards', type: 'buff', applyToSelf: { confidence: 3 }, icon: '📇', quip: '"Let us forge a pact on LinkedIn, mortal!"' },
      { name: 'Thought Leadership', type: 'attack', damage: 18, icon: '💡', quip: '"Thus did I close my Series A campaign."' },
    ],
  },

  // BERSERKER — starts with confidence +4; DPS race from turn 1
  automated_rejection: {
    id: 'automated_rejection',
    name: 'Automated Rejection Letter',
    hp: 120,
    gold: 65,
    icon: '✉️',
    portrait: automatedRejectionPortrait,
    isElite: true,
    startStatusEffects: { confidence: 4 },
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"INITIATING THE MASS BANISHMENT RITUAL."' },
    ],
    moves: [
      // Phase 1 (0-2)
      { name: 'Demoralize', type: 'debuff', applyToTarget: { confidence: -1 }, icon: '😞', quip: '"The realm thanks thee for thy futile interest."' },
      { name: 'Form Rejection', type: 'attack', damage: 12, stressDamage: 5, icon: '✉️', quip: '"Dear [CANDIDATE_NAME], thy quest ends here..."' },
      { name: 'Not A Good Fit', type: 'attack', damage: 20, icon: '❌', quip: '"We seek a unicorn. Thou art but a mule."' },
      // Phase 2 (3-5) — now at confidence +7
      { name: 'Auto-Reject Mode', type: 'buff', applyToSelf: { confidence: 2 }, icon: '⚙️', quip: '"PROCESSING TEN THOUSAND SUPPLICANTS..."' },
      { name: 'Rejection Cascade', type: 'attack', damage: 7, times: 4, icon: '✉️', quip: '"Banished. Banished. Banished. Banished."' },
      { name: 'Mass Rejection', type: 'attack', damage: 22, stressDamage: 10, icon: '❌', quip: '"Thy entire lineage has been archived."' },
    ],
  },

  // ── Act 1 Bosses ──

  hr_phone_screen: {
    id: 'hr_phone_screen',
    name: 'HR Phone Screen',
    hp: 210,
    gold: 120,
    icon: '📞',
    portrait: hrPhoneScreenPortrait,
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"The gauntlets come off. Let us parley compensation."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { confidence: 3 }, quip: '"This tribunal is OVER, applicant!"' },
    ],
    moves: [
      // Phase 1: soft questions (0-2)
      { name: 'Tell Me About Yourself', type: 'attack', damage: 9, icon: '🎤', quip: '"Recite thy tale. Keep it under thirty heartbeats."' },
      { name: 'Why This Company?', type: 'attack', damage: 12, icon: '🏢', quip: '"Incorrect incantation, mortal."' },
      { name: 'Greatest Weakness?', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 2 }, icon: '😓', quip: '"Do not utter perfectionism, whelp."' },
      // Phase 2: aggressive (3-6)
      { name: 'Where Do You See Yourself?', type: 'attack', damage: 15, icon: '🔮', quip: '"In five winters. Be precise, hero."' },
      { name: 'Recall Hold Music', type: 'summon', summonId: 'hold_music', summonCount: 1, icon: '🎵', quip: '"Hold, while I summon a greater authority."' },
      { name: 'Salary Expectations?', type: 'attack', damage: 18, stressDamage: 7, icon: '💵', quip: '"Reveal thy current bounty, adventurer."' },
      { name: "We'll Be In Touch", type: 'attack', damage: 22, stressDamage: 10, icon: '☎️', quip: '"(The narrator whispers: They never were.)"' },
      // Phase 3: pure DPS race (7-8)
      { name: 'Benefits Bait', type: 'attack', damage: 24, stressDamage: 8, icon: '🎣', quip: '"Last chance. Accept the pact or receive nothing."' },
      { name: 'REJECTED', type: 'attack', damage: 30, stressDamage: 12, icon: '❌', quip: '"We chose another champion. For all eternity."' },
    ],
  },

  ats_final_form: {
    id: 'ats_final_form',
    name: 'The ATS Final Form',
    hp: 245,
    gold: 130,
    icon: '🏗️',
    portrait: atsFinalFormPortrait,
    isBoss: true,
    phases: [
      { hpPercent: 60, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"THIS IS NOT EVEN MY FINAL FORM, MORTAL."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { confidence: 4 }, quip: '"CRITICAL ARCANE FAILURE IMMINENT."' },
    ],
    moves: [
      // Phase 1: scans + discards (0-3)
      { name: 'Full System Scan', type: 'attack', damage: 10, icon: '🔍', quip: '"Scanning for hope... the divination finds none."' },
      { name: 'Resume Shredder', type: 'discard', discardCount: 2, stressDamage: 5, icon: '🗑️', quip: '"Thy scroll formatting is HERESY."' },
      { name: 'Keyword Purge', type: 'attack', damage: 13, icon: '⚡', quip: '"You inscribed \'passionate.\' How cringe, mortal."' },
      { name: 'Database Overwrite', type: 'attack_defend', damage: 9, block: 10, icon: '💾', quip: '"Thy record in the Great Archive has been... altered."' },
      // Phase 2: raw power (4-7)
      { name: 'TRANSFORM', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🔥', quip: '"MAXIMUM ARCANE OVERDRIVE ENGAGED."' },
      { name: 'Deploy Validator', type: 'summon', summonId: 'resume_validator', summonCount: 1, icon: '📄', quip: '"Rise, validation construct! Serve thy master."' },
      { name: 'Total Rejection', type: 'attack', damage: 16, times: 2, icon: '❌', quip: '"Application status: OBLITERATED FROM ALL PLANES."' },
      { name: 'System Crash', type: 'attack', damage: 30, stressDamage: 11, icon: '💀', quip: '"Fatal curse: career.exe has perished."' },
      // Phase 3: DPS race (8-9)
      { name: 'Reboot Crush', type: 'attack', damage: 26, stressDamage: 9, icon: '💀', quip: '"Rebooting... to smite thee more swiftly."' },
      { name: 'CAREER_NOT_FOUND', type: 'attack', damage: 34, stressDamage: 13, icon: '💀', quip: '"Fatal error: hope.exe was never compiled."' },
    ],
  },

  ghosting_phantom: {
    id: 'ghosting_phantom',
    name: 'The Ghosting Phantom',
    hp: 200,
    gold: 110,
    icon: '👻',
    portrait: ghostingPhantomPortrait,
    isBoss: true,
    hideIntent: true,
    phases: [
      { hpPercent: 40, moveStartIndex: 3, onEnter: { confidence: 3 }, quip: '"Thou shalt never hear from us again, mortal."' },
      { hpPercent: 25, moveStartIndex: 6, onEnter: { confidence: 4 }, quip: '"Thou shalt never hear from ANYONE again."' },
    ],
    moves: [
      // Phase 1: eerie (0-2)
      { name: 'Haunt', type: 'attack', damage: 10, stressDamage: 5, icon: '👻', quip: '"Remember that audience with us? Neither do we."' },
      { name: 'Read Receipt', type: 'attack', damage: 13, icon: '✓', quip: '"Thy raven was seen three moons ago. No reply."' },
      { name: 'Gone Dark', type: 'stress_attack', stressDamage: 13, icon: '🌑', quip: '"*this sending stone is no longer enchanted*"' },
      // Phase 2: aggressive (3-5)
      { name: 'Conjure Echo', type: 'summon', summonId: 'ghost_echo', summonCount: 1, icon: '👻', quip: '"Thou shalt never truly be alone, fool."' },
      { name: 'Spectral Slash', type: 'attack', damage: 17, icon: '💫', quip: '"I was never even corporeal, hero."' },
      { name: 'Full Ghosting', type: 'attack', damage: 28, stressDamage: 11, icon: '☠️', quip: '"The position hath been sealed... for all eternity."' },
      // Phase 3: DPS race (6-7)
      { name: 'Eternal Silence', type: 'attack', damage: 24, stressDamage: 11, icon: '🕳️', quip: '"The inbox shall never answer. Not in this age."' },
      { name: 'Final Ghosting', type: 'attack', damage: 30, stressDamage: 15, icon: '☠️', quip: '"You never existed in our realm, applicant."' },
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
      { name: 'Format Check', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"Wrong tome binding, applicant."' },
      { name: 'Keyword Error', type: 'attack', damage: 7, stressDamage: 3, icon: '❌', quip: '"Missing runes: blockchain, synergy, agile."' },
    ],
  },

  hold_music: {
    id: 'hold_music',
    name: 'Hold Music',
    hp: 25,
    gold: 8,
    icon: '🎵',
    moves: [
      { name: 'Please Hold', type: 'energy_drain', energyDrain: 1, stressDamage: 7, icon: '📞', quip: '"Thy summons is important to the council."' },
      { name: 'Elevator Music', type: 'stress_attack', stressDamage: 10, icon: '🎶', quip: '"...the enchanted lute intensifies..."' },
      { name: 'Transfer', type: 'buff_allies', applyToTarget: { confidence: 1 }, icon: '🔀', quip: '"Allow me to portal thee elsewhere."' },
    ],
  },

  resume_validator: {
    id: 'resume_validator',
    name: 'Resume Validator',
    hp: 22,
    gold: 6,
    icon: '📄',
    moves: [
      { name: 'Format Error', type: 'exhaust', exhaustCount: 1, icon: '📋', quip: '"Parchment rejected. Again, mortal."' },
      { name: 'Validation Failed', type: 'corrupt', stressDamage: 5, icon: '🐛', quip: '"Resubmit thy scroll from the beginning."' },
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
      { name: 'Whisper', type: 'exhaust', exhaustCount: 1, icon: '💨', quip: '"*thou hearest only the abyss*"' },
      { name: 'Fade', type: 'stress_attack', stressDamage: 8, icon: '🌑', quip: '"*still only silence from the void*"' },
    ],
  },
};

// ── Act 1 Encounter Tables ──

export const act1Solos: string[][] = [
  ['resume_ats'],
  ['recruiter_bot'],
  ['cover_letter_shredder'],
  ['job_board_troll'],
  ['application_fee_scammer'],
  ['linkedin_notification_swarm'],
];

export const act1Duos: string[][] = [
  ['resume_ats', 'recruiter_bot'],                  // Buff + escalate
  ['application_fee_scammer', 'job_board_troll'],   // Gold drain + vulnerable
  ['cover_letter_shredder', 'recruiter_bot'],        // Exhaust + pressure
  ['linkedin_notification_swarm', 'linkedin_notification_swarm'], // Swarm, tests AoE
];

export const act1Trios: string[][] = [
  ['resume_ats', 'recruiter_bot', 'cover_letter_shredder'],                                      // Buff + escalate + exhaust
  ['linkedin_notification_swarm', 'linkedin_notification_swarm', 'linkedin_notification_swarm'], // Stress swarm
  ['cover_letter_shredder', 'application_fee_scammer', 'job_board_troll'],                       // Resource drain trio
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
