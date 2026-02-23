import type { EventDef } from '../../types';

export const act1Events: EventDef[] = [
  // ── ACT 1: THE APPLICATION ABYSS ──
  // Theme: You're a fresh adventurer entering the job market dungeon.
  // Tavern rumors, wanted boards, mysterious strangers — but it's all résumés and applications.

  {
    id: 'resume_forge',
    title: 'The Résumé Forge',
    icon: '🔨',
    act: 1,
    description: 'You stumble upon a dimly lit workshop where a grizzled artisan hunches over a glowing anvil. But instead of steel, they\'re hammering keywords into résumés. Sparks of "synergy" and "leverage" fly with each strike. "Sit down, adventurer," they growl, adjusting their bifocals. "Let me see what you\'ve got."',
    choices: [
      {
        text: 'Let them reforge your résumé',
        outcome: {
          upgradeRandomCard: true,
          gold: -10,
          message: 'The artisan strikes your résumé three times. "Full-stack," they mutter. CLANG. "Agile." CLANG. "Passionate." Your résumé glows with an otherworldly light. You feel... optimized.',
        },
      },
      {
        text: 'Pay for the premium package',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          gold: -40,
          message: 'For the premium rate, the artisan adds "blockchain" and "AI" in golden script, then binds it in genuine unicorn leather. "This\'ll get past any ATS golem," they promise. The résumé practically hums with arcane energy.',
        },
      },
      {
        text: 'Steal their templates and run',
        outcome: {
          addCard: 'random_common',
          hp: -8,
          message: 'You grab a stack of templates and bolt for the door. A stapler whistles past your ear. A paper cutter embeds itself in the doorframe. You escape with a few useful formats — and a nasty paper cut.',
        },
      },
      {
        text: 'Politely decline and chat',
        outcome: {
          hp: 10,
          stress: -5,
          message: 'You chat over coffee instead. The artisan shares war stories about the recession of \'08 — "I reforged 47 résumés in a single night. Most of them made it." You feel oddly comforted by their weathered resilience.',
        },
      },
    ],
  },

  {
    id: 'job_board_tavern',
    title: 'The Job Board Tavern',
    icon: '🍺',
    act: 1,
    description: 'A weathered tavern sits at the crossroads, its walls plastered with job postings. Most are yellowed with age and false promises. A bard in the corner sings a mournful ballad about "competitive salary, DOE." The barkeep slides you a drink and nods toward the wall. "Take your pick, adventurer. But read the fine print."',
    choices: [
      {
        text: 'Take the listing with no salary range',
        outcome: {
          gold: 35,
          stress: 8,
          message: 'The listing leads to an unmarked door. Inside, a figure in a power suit slides gold across the table. "We don\'t post ranges because we pay above market," they whisper. It\'s... actually true? You pocket the gold, rattled by the experience.',
        },
      },
      {
        text: 'Take the boring enterprise listing',
        outcome: {
          gold: 20,
          stress: 5,
          message: 'The enterprise role is exactly what you\'d expect. The onboarding alone takes three hours. But the gold is steady and the benefits are real. Your soul dims slightly as you fill out Form W-4096.',
        },
      },
      {
        text: 'Ask the barkeep for insider info',
        outcome: {
          gold: -15,
          removeChosenCard: 1,
          message: 'The barkeep leans close, breath smelling of hops and honesty. "That one? Acqui-hire. That one? Layoffs next quarter. But this one..." They point to a listing you\'d missed. "This one\'s real." You tear away the dead weight from your deck.',
        },
      },
      {
        text: 'Just drink',
        outcome: {
          hp: 8,
          stress: 5,
          message: 'You drink until the listings blur into a pleasant smear of "fast-paced environment" and "rockstar developer." When you look up, the bard is crying. You join them. It\'s therapeutic, in its way.',
        },
      },
    ],
  },

  {
    id: 'referral_scroll',
    title: 'The Referral Scroll',
    icon: '📜',
    act: 1,
    description: 'A developer stumbles toward you through the dungeon corridors, clutching a glowing scroll. Their badge reads "FAANG — Level 7." They\'re covered in rejection-letter wounds. "Take it," they gasp, pressing the scroll into your hands. "My referral... still valid... I didn\'t make it past the fifth round..." They collapse into a pile of unread emails.',
    choices: [
      {
        text: 'Use the referral immediately',
        outcome: {
          addCard: 'random_rare',
          message: 'You present the scroll at the nearest recruiter\'s desk. Their eyes widen — the seal is still warm. "A Level 7 referral? Right this way." Doors open that were previously invisible. Power flows through you.',
        },
      },
      {
        text: 'Hold onto it for later',
        outcome: {
          setFlag: 'has_referral_scroll',
          message: 'You tuck the scroll carefully into your bag. It thrums with potential, warm against your back. Someone at FAANG owes a favor — and the deeper you go, the more valuable that favor becomes. This could be worth far more later...',
        },
      },
      {
        text: 'Sell it to a recruiter on the black market',
        outcome: {
          gold: 50,
          message: 'A shady figure in a hoodie labeled "TECHNICAL RECRUITER — STEALTH MODE" materializes from behind a potted plant. They pay handsomely for the scroll, no questions asked. You try not to think about what they\'ll do with it.',
        },
      },
    ],
  },

  {
    id: 'linkedin_crypt',
    title: 'The LinkedIn Crypt',
    icon: '💀',
    act: 1,
    description: 'You descend into an ancient crypt. The walls are lined with LinkedIn profiles of developers who "pivoted to entrepreneurship" and were never heard from again. Their endorsements still glow faintly — "Leadership," "Blockchain," "Agile Methodology." The deeper you go, the older the profiles get. Some still say "Seeking new opportunities."',
    choices: [
      {
        text: 'Loot the abandoned profiles',
        outcome: {
          gold: 25,
          hp: -10,
          message: 'You pry loose cryptocurrency wallets and unclaimed referral bonuses from the profiles. The ghosts moan — not in anger, but in the hollow way of people who never updated their headshot. Something cold brushes your shoulder. Worth it, probably.',
        },
      },
      {
        text: 'Harvest their endorsements',
        outcome: {
          addCard: 'random_common',
          stress: 8,
          message: 'You absorb their "Skill: JavaScript (99+ endorsements)" into your own profile. You feel... inflated. Like a balloon animal at a children\'s party. Technically impressive. Spiritually empty.',
        },
      },
      {
        text: 'Pay respects and leave',
        outcome: {
          hp: 10,
          stress: -8,
          message: 'You light a candle for each fallen profile. The ghosts seem grateful. One whispers a LeetCode solution. Another shares the salary they were too afraid to negotiate for. You leave feeling strangely at peace.',
        },
      },
    ],
  },

  {
    id: 'coffee_golem',
    title: 'The Coffee Golem',
    icon: '☕',
    act: 1,
    description: 'A towering construct of coffee cups and espresso machines blocks the corridor. Steam hisses from its joints. Its eyes — two glowing Keurig pods — fix on you. "WHAT BREW DO YOU DESIRE, MORTAL?" it bellows, its voice a gurgling percolation. A menu floats in the steam above its head.',
    choices: [
      {
        text: 'Triple espresso shot',
        outcome: {
          hp: -5,
          stress: 8,
          addCard: 'random_rare',
          message: 'The espresso hits your bloodstream like a DDoS attack. Your hands vibrate. Your eyes see code in the Matrix. Everything is FAST and LOUD and HAPPENING. You write a new technique in 0.3 seconds. Your heart rate is... concerning.',
        },
      },
      {
        text: 'Calming chamomile',
        outcome: {
          hp: 15,
          stress: -10,
          message: 'The tea is warm and gentle. You remember a time before standups. Before sprints. Before Jira. The Golem watches you sip, its Keurig-eyes softening. "GOOD CHOICE, MORTAL. REST IS NOT WEAKNESS."',
        },
      },
      {
        text: 'Mystery blend',
        outcome: {
          addCard: 'random_epic',
          hp: -12,
          stress: 10,
          message: 'The Golem\'s eyes flicker red. "THIS ONE... IS EXPERIMENTAL." The brew is black as deployment night and thick as legacy code. Your vision tunnels. When you come to, there\'s something powerful in your hand that wasn\'t there before. Your nose is bleeding.',
        },
      },
      {
        text: 'Fight it for the premium beans',
        outcome: {
          hp: -15,
          gold: 40,
          message: 'You tackle the Golem. Scalding coffee sprays everywhere. You wrestle a K-cup from its chest cavity while it screams in binary. The premium beans inside are worth a fortune on the open market. Your burns will heal. Probably.',
        },
      },
    ],
  },

  {
    id: 'open_source_tavern',
    title: 'The Open Source Tavern',
    icon: '🍻',
    act: 1,
    description: 'A rundown tavern operates entirely on donations. The sign reads "CONTRIBUTIONS WELCOME — MIT LICENSE." Inside, exhausted open-source maintainers nurse drinks and review pull requests by candlelight. One of them has 47,000 GitHub stars and zero sponsors. They look up as you enter with hollow, bloodshot eyes.',
    choices: [
      {
        text: 'Submit a meaningful PR',
        outcome: {
          removeChosenCard: 1,
          addCard: 'random_rare',
          message: 'You fix a critical bug that\'s been open for three years. The maintainers weep with gratitude. One hands you something powerful from beneath the bar. "Take it," they whisper. "You earned it. Nobody else even tried."',
        },
      },
      {
        text: 'Drop a star and move on',
        outcome: {
          gold: 15,
          message: 'You star the repo, write "Great project!" in the discussions, and walk out. A maintainer watches from the window, a single tear rolling down their face. You find some loose gold by the door. It feels hollow.',
        },
      },
      {
        text: 'Fork everything and run',
        outcome: {
          addCard: 'random_common',
          addConsumable: 'random_common',
          stress: 5,
          message: 'You clone every repository, stuff them in your bag, and sprint into the night. The maintainers curse you, but the MIT license binds their hands. Technically legal. Morally questionable. Practically useful.',
        },
      },
    ],
  },
];
