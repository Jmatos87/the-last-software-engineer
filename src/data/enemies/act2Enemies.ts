import type { EnemyDef } from '../../types';
import leetcodeGoblinPortrait from '../../assets/act2/leet-code-goblin.png';
import cultureFitEnforcerPortrait from '../../assets/act2/culture-fit-enforcer.png';
import behavioralQuestionBotPortrait from '../../assets/act2/behavioral-question-bot.png';
import pairProgrammerEnemyPortrait from '../../assets/act2/pair-programming-enemy.png';
import triviaQuizmasterPortrait from '../../assets/act2/trivia-quiz-master.png';
import zoomFatiguePortrait from '../../assets/act2/zoom-fatigue.png';
import seniorDevInterrogatorPortrait from '../../assets/act2/senior-dev-interrogator.png';
import whiteboardHydraPortrait from '../../assets/act2/whiteboard-hydra.png';
import liveCodingChallengePortrait from '../../assets/act2/live-coding-challenge.png';
import vpOfEngineeringPortrait from '../../assets/act2/vp-of-engineering.png';

// ════════════════════════════════════════════════
// ACT 2 — The Interview Gauntlet
// ════════════════════════════════════════════════

export const act2Enemies: Record<string, EnemyDef> = {

  // ── Act 2 Common Enemies ──

  // RITUALIST — literal escalating difficulty: Easy < Medium < Hard
  leetcode_goblin: {
    id: 'leetcode_goblin',
    name: 'LeetCode Goblin',
    hp: 100,
    gold: 34,
    icon: '👺',
    portrait: leetcodeGoblinPortrait,
    moves: [
      { name: 'Easy Problem', type: 'attack', damage: 9, icon: '🟢', quip: '"A simple ward to start. Heh heh."' },
      { name: 'Medium Problem', type: 'attack', damage: 14, icon: '🟡', quip: '"Invert the cursed tree! Quickly now!"' },
      { name: 'Hard Problem', type: 'attack', damage: 20, icon: '🔴', quip: '"A legendary riddle. Many have perished here."' },
      { name: 'Time Limit Exceeded', type: 'stress_attack', stressDamage: 11, icon: '⏰', quip: '"The hourglass ran dry. Again, fool."' },
    ],
  },

  // WAKE-UP — soft opener, then grows to Forced Fun (big hit)
  culture_fit_enforcer: {
    id: 'culture_fit_enforcer',
    name: 'Culture Fit Enforcer',
    hp: 105,
    gold: 36,
    icon: '😊',
    portrait: cultureFitEnforcerPortrait,
    moves: [
      { name: "We're Like Family", type: 'stress_attack', stressDamage: 9, icon: '👨‍👩‍👧‍👦', quip: '"We are a clan bound by oath. Mostly dysfunction."' },
      { name: 'Red Flag', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🚩', quip: '"We toil hard AND revel hard in these halls."' },
      { name: 'Pizza Parties!', type: 'attack', damage: 12, stressDamage: 6, icon: '🍕', quip: '"Feast rations instead of gold this moon!"' },
      { name: 'Forced Fun', type: 'attack', damage: 18, stressDamage: 8, icon: '🎉', quip: '"Mandatory revelry at dawn. No exceptions."' },
    ],
  },

  // COMPOUND — debuffs compound each cycle; Competency Check lands on double-debuffed player
  behavioral_question_bot: {
    id: 'behavioral_question_bot',
    name: 'Behavioral Question Bot',
    hp: 120,
    gold: 36,
    icon: '🎭',
    portrait: behavioralQuestionBotPortrait,
    moves: [
      { name: 'Tell Me About A Time...', type: 'debuff', applyToTarget: { weak: 2 }, icon: '🕐', quip: '"Recount your deeds using the sacred STAR method."' },
      { name: 'Why Should We Hire You?', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🤔', quip: '"Convince this tribunal you are worthy of breath."' },
      { name: 'Where Do You See Yourself?', type: 'stress_attack', stressDamage: 9, icon: '🔮', quip: '"Gaze into the scrying orb. Not here, clearly."' },
      { name: 'Competency Check', type: 'attack', damage: 18, icon: '✅', quip: '"The scrolls reveal... insufficient valor."' },
    ],
  },

  // COMPOUND — Code Review applies weak; attacks scale off it
  pair_programmer_enemy: {
    id: 'pair_programmer_enemy',
    name: 'The Pair Programmer',
    hp: 110,
    gold: 38,
    icon: '👥',
    portrait: pairProgrammerEnemyPortrait,
    moves: [
      { name: 'Copy That', type: 'attack_defend', damage: 10, block: 7, icon: '📋', quip: '"I would have used a different sigil here."' },
      { name: 'Actually...', type: 'attack', damage: 16, icon: '☝️', quip: '"Well actually, that rune is logarithmic."' },
      { name: 'Let Me Drive', type: 'attack', damage: 13, stressDamage: 5, icon: '⌨️', quip: '"*seizes your enchanted quill mid-stroke*"' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀', quip: '"Forty-seven grievances inscribed on your scroll."' },
    ],
  },

  // ESCALATOR — Trick Question gives confidence; Pop Quiz scales dangerously
  trivia_quizmaster: {
    id: 'trivia_quizmaster',
    name: 'Trivia Quizmaster',
    hp: 100,
    gold: 30,
    icon: '❓',
    portrait: triviaQuizmasterPortrait,
    moves: [
      { name: 'Pop Quiz!', type: 'attack', damage: 15, icon: '❓', quip: '"Name the max heap rune capacity of V8!"' },
      { name: 'Trick Question', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🃏', quip: '"A trick! There was never an answer, fool."' },
      { name: 'Bonus Round', type: 'attack', damage: 12, icon: '⭐', quip: '"Now solve it in the Haskell tongue."' },
      { name: 'Stumped!', type: 'stress_attack', stressDamage: 10, icon: '😶', quip: '"Your silence echoes through the chamber."' },
    ],
  },

  // WILDCARD — hideIntent; exhaust disrupts then Technical Difficulties surprise combo
  zoom_fatigue: {
    id: 'zoom_fatigue',
    name: 'Zoom Fatigue',
    hp: 120,
    gold: 38,
    icon: '😴',
    portrait: zoomFatiguePortrait,
    moves: [
      { name: 'Buffer...', type: 'exhaust', exhaustCount: 1, stressDamage: 5, icon: '🔄', quip: '"Can all spirits see my scrying mirror?"' },
      { name: "You're On Mute", type: 'attack', damage: 14, icon: '🔇', quip: '"Your voice is still silenced, adventurer."' },
      { name: 'Camera Off Despair', type: 'stress_attack', stressDamage: 8, icon: '📷', quip: '"We prefer all familiars visible."' },
      { name: 'Technical Difficulties', type: 'exhaust', exhaustCount: 2, stressDamage: 5, icon: '⚠️', quip: '"Apologies, the ley lines are disrupted—*bzzt*"' },
      { name: 'Reconnecting...', type: 'attack', damage: 18, icon: '🔌', quip: '"The portal reopens. Where were we?"' },
    ],
  },

  // ── Act 2 Elite Enemies ──

  // JUGGERNAUT — Phase 1 interrogates; Phase 2 erupts with scaled Pop Quiz ×3 and Code Review FAILED
  senior_dev_interrogator: {
    id: 'senior_dev_interrogator',
    name: 'Senior Dev Interrogator',
    hp: 240,
    gold: 110,
    icon: '🧓',
    portrait: seniorDevInterrogatorPortrait,
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"You dare call yourself a SENIOR mage?"' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: 'Explain Your Process', type: 'attack', damage: 13, stressDamage: 5, icon: '🔬', quip: '"Recount every arcane decision you made."' },
      { name: 'Code Review', type: 'debuff', applyToTarget: { weak: 2, vulnerable: 1 }, icon: '👀', quip: '"I see you used var. In this age? Pathetic."' },
      { name: 'Deep Dive', type: 'attack', damage: 15, icon: '🤿', quip: '"We descend three dungeon levels deeper."' },
      { name: 'Years of Experience', type: 'buff', applyToSelf: { confidence: 4 }, icon: '📅', quip: '"I\'ve wielded code since the Perl Dynasty."' },
      // Phase 2 (4-6)
      { name: '"I\'ve Seen Everything"', type: 'buff', applyToSelf: { confidence: 2 }, icon: '📅', quip: '"I\'ve walked these halls since before your birth."' },
      { name: 'Pop Quiz', type: 'attack', damage: 8, times: 3, icon: '❓', quip: '"Name the time complexity! NOW, whelp!"' },
      { name: 'Code Review: FAILED', type: 'attack', damage: 20, stressDamage: 8, icon: '🧹', quip: '"This spellwork is an abomination."' },
    ],
  },

  // SUMMONER — Grow Heads summons a question_fragment; Phase 2 spawns another
  whiteboard_hydra: {
    id: 'whiteboard_hydra',
    name: 'The Whiteboard Hydra',
    hp: 220,
    gold: 100,
    icon: '🐉',
    portrait: whiteboardHydraPortrait,
    isElite: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 3 }, quip: '"Slay one question, THREE more shall rise!"' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: 'Follow-Up Question', type: 'attack', damage: 9, icon: '❓', quip: '"But what of concurrency, little one?"' },
      { name: 'Multi-Part Problem', type: 'attack', damage: 7, times: 2, icon: '📝', quip: '"Part the First... and Part the Second."' },
      { name: 'Grow Heads', type: 'summon', summonId: 'question_fragment', summonCount: 1, icon: '🐲', quip: '"Another head sprouts with a new riddle..."' },
      { name: 'Whiteboard Barrage', type: 'attack', damage: 12, stressDamage: 4, icon: '📊', quip: '"Diagram the entire realm. Now."' },
      // Phase 2 (4-6)
      { name: 'Hydra Awakens', type: 'summon', summonId: 'question_fragment', summonCount: 1, icon: '🐲', quip: '"The whiteboard stretches into INFINITY!"' },
      { name: 'Infinite Follow-Ups', type: 'attack', damage: 5, times: 4, icon: '❓', quip: '"Part C, D, E, F — they never end!"' },
      { name: 'Erase Everything', type: 'attack', damage: 18, stressDamage: 7, exhaustCount: 1, icon: '🧽', quip: '"Begin again. From the VERY beginning."' },
    ],
  },


  // ── Act 2 Bosses (HP bumped, phases added) ──

  live_coding_challenge: {
    id: 'live_coding_challenge',
    name: 'The Live Coding Challenge',
    hp: 380,
    gold: 175,
    icon: '⌨️',
    portrait: liveCodingChallengePortrait,
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 3 }, quip: '"The sands of the hourglass grow thin..."' },
      { hpPercent: 25, moveStartIndex: 7, onEnter: { confidence: 4 }, quip: '"COMPILATION RITUAL: FAILED."' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: 'Timer Start', type: 'attack', damage: 9, icon: '⏱️', quip: '"You have forty-five candle-marks. Begin."' },
      { name: 'Syntax Error', type: 'attack', damage: 12, stressDamage: 4, icon: '🔴', quip: '"A missing sigil on the very first rune."' },
      { name: 'Runtime Exception', type: 'attack', damage: 14, icon: '💥', quip: '"Undefined is not a known incantation."' },
      { name: 'Compiler Fury', type: 'buff', applyToSelf: { confidence: 4 }, icon: '🔥', quip: '"One hundred and forty-two heresies found."' },
      // Phase 2 (4-6)
      { name: 'Spawn Test Case', type: 'summon', summonId: 'test_case', summonCount: 1, icon: '🐛', quip: '"The trial suite awakens... forty-seven failures."' },
      { name: 'Segfault', type: 'attack', damage: 19, icon: '💀', quip: '"Core dumped. As was your destiny."' },
      { name: "TIME'S UP!", type: 'attack', damage: 33, stressDamage: 14, icon: '⏰', quip: '"Quills down. Step away from the altar."' },
      // Phase 3: DPS race (7-8)
      { name: "TIME'S UP! (Overtime)", type: 'attack', damage: 38, stressDamage: 16, icon: '⏰', quip: '"The hourglass shattered long ago, fool."' },
      { name: 'FAILED', type: 'attack', damage: 44, stressDamage: 18, icon: '💀', quip: '"Trial status: SOUL TERMINATED."' },
    ],
  },

  vp_of_engineering: {
    id: 'vp_of_engineering',
    name: 'The VP of Engineering',
    hp: 440,
    gold: 195,
    icon: '👔',
    portrait: vpOfEngineeringPortrait,
    isBoss: true,
    phases: [
      { hpPercent: 50, moveStartIndex: 4, onEnter: { confidence: 4 }, quip: '"Now the TRUE trial begins, adventurer."' },
      { hpPercent: 25, moveStartIndex: 8, onEnter: { confidence: 5 }, quip: '"You are FINISHED in these lands."' },
    ],
    moves: [
      // Phase 1 (0-3)
      { name: "Let's Chat Casually", type: 'debuff', applyToTarget: { weak: 2 }, icon: '☕', quip: '"This isn\'t a trial. Lower your guard."' },
      { name: 'Culture Assessment', type: 'stress_attack', stressDamage: 9, icon: '🏢', quip: '"How do you navigate the fog of ambiguity?"' },
      { name: 'Subtle Probe', type: 'debuff', applyToTarget: { vulnerable: 2 }, icon: '🔍', quip: '"Interesting... most interesting indeed."' },
      { name: 'Strategic Vision', type: 'attack', damage: 12, icon: '🎯', quip: '"What does your five-year prophecy foretell?"' },
      // Phase 2 (4-7)
      { name: 'Technical Deep-Dive', type: 'buff', applyToSelf: { confidence: 3 }, icon: '🤿', quip: '"The gauntlets come off."' },
      { name: 'Architecture Review', type: 'attack', damage: 20, icon: '🏗️', quip: '"This fortress design does not scale."' },
      { name: 'Scale Question', type: 'attack', damage: 16, stressDamage: 6, icon: '📊', quip: '"What if a billion souls storm the gates?"' },
      { name: 'Executive Decision', type: 'attack', damage: 35, stressDamage: 13, icon: '⚡', quip: '"I have seen enough of your craft."' },
      // Phase 3: DPS race (8-10)
      { name: 'Recall Assistant', type: 'summon', summonId: 'executive_assistant', summonCount: 1, icon: '💼', quip: '"Fetch me a full report on this challenger."' },
      { name: "You're Fired", type: 'attack', damage: 34, stressDamage: 14, icon: '🔥', quip: '"Gather your belongings. BEGONE."' },
      { name: 'Severance Denied', type: 'attack', damage: 46, stressDamage: 19, icon: '☠️', quip: '"And you owe the kingdom gold."' },
    ],
  },

  // ── Act 2 Minions (spawned by elites/bosses) ──

  question_fragment: {
    id: 'question_fragment',
    name: 'Follow-Up Question',
    hp: 20,
    gold: 0,
    icon: '❓',
    moves: [
      { name: 'Follow-Up', type: 'debuff', applyToTarget: { weak: 1 }, icon: '❓', quip: '"But what of the edge cases, traveler?"' },
      { name: 'Part B', type: 'attack', damage: 9, icon: '📝', quip: '"Now solve it in constant mana space."' },
    ],
  },

  test_case: {
    id: 'test_case',
    name: 'Test Case',
    hp: 20,
    gold: 6,
    icon: '🐛',
    moves: [
      { name: 'Bug Report', type: 'corrupt', icon: '🐛', quip: '"Seven failures plague your spellwork."' },
      { name: 'Edge Case', type: 'attack', damage: 10, stressDamage: 4, icon: '🔴', quip: '"What if the input is pure void?"' },
    ],
  },

  executive_assistant: {
    id: 'executive_assistant',
    name: 'Executive Assistant',
    hp: 28,
    gold: 12,
    icon: '💼',
    moves: [
      { name: 'Calendar Block', type: 'energy_drain', energyDrain: 1, icon: '📅', quip: '"The overlord is in back-to-back war councils."' },
      { name: 'Redirect', type: 'gold_steal', goldSteal: 12, icon: '💸', quip: '"Billing this tithe to your guild."' },
      { name: 'Status Update', type: 'heal_allies', healAmount: 15, icon: '📊', quip: '"Favorable omens for the high council."' },
    ],
  },
};

// ── Act 2 Encounter Tables ──

export const act2Solos: string[][] = [
  ['leetcode_goblin'],
  ['culture_fit_enforcer'],
  ['behavioral_question_bot'],
  ['pair_programmer_enemy'],
  ['trivia_quizmaster'],
  ['zoom_fatigue'],
];

export const act2Duos: string[][] = [
  ['culture_fit_enforcer', 'behavioral_question_bot'],  // Stress pincer attack
  ['leetcode_goblin', 'leetcode_goblin'],               // Pure DPS race
  ['pair_programmer_enemy', 'zoom_fatigue'],            // Weak lock + exhaust
  ['trivia_quizmaster', 'behavioral_question_bot'],     // Double stress
  ['leetcode_goblin', 'pair_programmer_enemy'],         // DPS + debuff
];

export const act2Trios: string[][] = [
  ['leetcode_goblin', 'leetcode_goblin', 'leetcode_goblin'],                    // Grind rush
  ['culture_fit_enforcer', 'behavioral_question_bot', 'zoom_fatigue'],          // Stress gauntlet
  ['leetcode_goblin', 'pair_programmer_enemy', 'trivia_quizmaster'],            // Mixed pressure
];

export const act2ElitePool: string[][] = [
  ['senior_dev_interrogator'],
  ['whiteboard_hydra'],
];

export const act2BossPool: string[][] = [
  ['live_coding_challenge', 'test_case'],
  ['vp_of_engineering', 'executive_assistant'],
];
