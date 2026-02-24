import type { EventDef } from '../../types';

export const act3Events: EventDef[] = [
  // ── ACT 3: CORPORATE FINAL ROUND ──
  // Theme: The final dungeon floor. Dragon hoards, throne rooms, dark revelations.
  // Offers, negotiations, imposter syndrome, and the existential question.

  {
    id: 'offer_table',
    title: 'The Offer Table',
    icon: '📋',
    act: 3,
    description: 'A round table of obsidian fills a grand chamber. Upon it lie three sealed envelopes, each bearing a different corporate crest. A disembodied voice echoes: "CHOOSE YOUR DESTINY. EACH PATH LEADS TO POWER — AND EACH EXACTS A PRICE." The envelopes pulse with different energies. One feels warm. One feels cold. One feels... sentient.',
    choices: [
      {
        text: 'Open the golden envelope (startup)',
        outcome: {
          addCard: 'random_epic',
          gold: -30,
          stress: 8,
          message: 'Inside: an offer from a Series A startup. The equity is massive. The salary is... aspirational. The role is "Head of Everything." It\'s thrilling and terrifying in equal measure. You feel the power of unlimited scope — and unlimited responsibility.',
        },
      },
      {
        text: 'Open the silver envelope (FAANG)',
        outcome: {
          gold: 60,
          addCard: 'random_rare',
          stress: 5,
          message: 'Inside: a FAANG offer. The compensation is staggering. The leveling is precise. You\'ll be L5, IC track, with a "clear path to L6." The gold flows like water. But something about it feels... corporate. Processed. You are a number now, and the number is high.',
        },
      },
      {
        text: 'Open the iron envelope (consultancy)',
        outcome: {
          upgradeRandomCard: true,
          gold: 30,
          hp: -10,
          message: 'Inside: a consultancy offer. "Travel 80%. Bill 120%. Sleep 40%." The money is good and the skills you\'ll gain are real — forged in the fires of client-site combat. Your body will suffer, but your résumé will be unbreakable.',
        },
      },
      {
        text: 'Flip the table',
        outcome: {
          removeChosenCard: 2,
          stress: -15,
          message: 'You flip the table. Envelopes scatter. The disembodied voice sputters: "You can\'t — that\'s not an OPTION—" But you\'re already walking away, lighter than you\'ve felt in ages. Some offers are prisons with golden bars. You choose freedom.',
        },
      },
    ],
  },

  {
    id: 'imposter_mirror',
    title: 'The Imposter\'s Mirror',
    icon: '🪞',
    act: 3,
    description: 'A full-length mirror stands alone in an empty room. As you approach, your reflection changes — it\'s you, but at your worst. Forgetting basic syntax in an interview. Pushing to production on Friday. Confusing Git rebase with Git reset. The reflection grins. "We both know you don\'t belong here," it whispers. "Everyone else has a CS degree."',
    choices: [
      {
        text: 'Confront the reflection directly',
        outcome: {
          upgradeRandomCard: true,
          removeChosenCard: 1,
          hp: -10,
          message: 'You step forward. "I EARNED this." The mirror cracks. Your reflection screams — then shatters into a thousand imposter syndromes, each one smaller than the last. You emerge bloodied but transformed. The doubt isn\'t gone, but it\'s no longer in charge.',
        },
      },
      {
        text: '"You\'re right. I Googled half of everything."',
        outcome: {
          stress: -15,
          hp: 10,
          message: 'The reflection freezes. It expected defiance, not... agreement. "I Google everything," you continue. "I copy from Stack Overflow. I use ChatGPT. And I STILL shipped features." The mirror dissolves. The room fills with warm light. Honesty, it turns out, is the hardest spell to cast.',
        },
      },
      {
        text: 'Smash the mirror with your keyboard',
        outcome: {
          addCard: 'random_rare',
          stress: 5,
          hp: -8,
          message: 'You swing your mechanical keyboard like a war hammer. The mirror explodes in a shower of glass and self-doubt. Something powerful crystallizes from the fragments — forged from the energy of refusing to be diminished. Your knuckles bleed. Worth it.',
        },
      },
    ],
  },

  {
    id: 'golden_parachute',
    title: 'The Golden Parachute',
    icon: '🪂',
    act: 3,
    description: 'A vault door stands ajar, revealing mountains of gold and a single, magnificent golden parachute hanging from the ceiling. A plaque reads: "FOR EXECUTIVES ONLY. GUARANTEED SOFT LANDING REGARDLESS OF PERFORMANCE." The parachute glitters with the compressed wealth of a thousand laid-off engineers.',
    choices: [
      {
        text: 'Take the parachute for yourself',
        outcome: {
          gold: 80,
          maxHp: -15,
          message: 'You grab the golden parachute. It\'s heavier than it looks — because it\'s lined with the broken dreams of everyone who built the thing that made the gold possible. Your max HP drops from the weight of complicity, but the gold... the gold is very real.',
        },
      },
      {
        text: 'Redistribute the gold',
        outcome: {
          gold: 25,
          hp: 20,
          stress: -10,
          message: 'You open the vault doors wide and invite everyone in. The gold gets split a dozen ways. Your share is modest, but the gratitude is overwhelming. Other adventurers heal your wounds, share supplies, and for one brief moment, the dungeon feels like a community.',
        },
      },
      {
        text: 'Burn it all down',
        outcome: {
          addCard: 'random_epic',
          stress: -8,
          hp: -5,
          message: 'You set the parachute on fire. Golden silk burns with a satisfying crackle. As the vault goes up, something crystallizes in the heat — a technique born from righteous anger. The fire alarm wails. You walk away from the explosion in slow motion.',
        },
      },
    ],
  },

  {
    id: 'exit_interview_throne',
    title: 'The Exit Interview Throne',
    icon: '👑',
    act: 3,
    description: 'A throne room, corporate in decor but ancient in energy. The throne is occupied by the VP of Human Resources, who has been conducting exit interviews for ten thousand years. "Sit," they say, gesturing to a chair that\'s slightly too low — deliberately. "Before you leave this dungeon, we need to discuss your... experience." Their pen hovers over a form older than time.',
    choices: [
      {
        text: 'Stay diplomatic — protect the reference',
        outcome: {
          gold: 30,
          removeChosenCard: 1,
          message: '"The culture was great, the leadership was strong, and I learned a lot." Each word costs a piece of your soul. The VP nods, stamps your form, and slides you a modest severance. You lose something real from your deck — your honesty, perhaps. But the reference is intact.',
        },
      },
      {
        text: 'Tell the whole, unvarnished truth',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          stress: 10,
          message: '"The CEO is a narcissist, the codebase is held together by duct tape and prayers, and the \'unlimited PTO\' is a lie." The VP\'s pen snaps. The room shakes. But as you speak your truth, power flows through you — the kind that comes from having nothing left to lose.',
        },
      },
      {
        text: 'Just... leave. No interview needed.',
        outcome: {
          hp: 10,
          stress: -12,
          gold: 25,
          message: 'You stand up, nod politely, and walk out. The VP sputters. "But the FORM — the PROCESS—" Their voice fades as the door closes. On your way out, a disgruntled employee slips you an envelope. "Nobody\'s walked out in years," they whisper. "You deserve this."',
        },
      },
    ],
  },

  {
    id: 'work_life_rift',
    title: 'The Work-Life Rift',
    icon: '🌀',
    act: 3,
    description: 'A shimmering portal hangs in the air, flickering between two realities. Through one side, you see yourself at a standing desk at 11 PM, crushing it, shipping features, rising through the ranks — alone. Through the other, you see yourself at a park, laptop closed, laughing with friends who don\'t know what a "sprint retrospective" is. Both versions look at you. Both reach out their hand.',
    choices: [
      {
        text: 'Reach for the standing desk',
        outcome: {
          addCard: 'random_epic',
          upgradeRandomCard: true,
          stress: 15,
          hp: -10,
          message: 'You choose ambition. The rift surges with power. Late nights, weekend deploys, the intoxicating rush of shipping at 2 AM. You emerge stronger, sharper, and deeply, fundamentally exhausted. The park version of you fades with a sad wave.',
        },
      },
      {
        text: 'Reach for the park',
        outcome: {
          hp: 25,
          stress: -20,
          removeChosenCard: 1,
          message: 'You choose peace. The rift floods with warm sunlight. Your phone has no Slack notifications. Your calendar is empty. You shed something from your deck — a technique you no longer need. You heal in ways that have nothing to do with hit points.',
        },
      },
      {
        text: 'Walk between both — hybrid model',
        outcome: {
          gold: 25,
          addConsumable: 'random_rare',
          message: 'You refuse to choose. "I want both." The rift wobbles, confused. It was designed as a binary. But you force your way into the middle, and the universe grudgingly accommodates. Three days in, two days out. Not perfect. But real.',
        },
      },
    ],
  },

  {
    id: 'legacy_codebase_dragon',
    title: 'The Legacy Codebase Dragon',
    icon: '🐲',
    act: 3,
    description: 'In the deepest chamber lies a dragon made of spaghetti code. Its scales are nested callbacks. Its breath is unhandled exceptions. It guards a legendary treasure — the Original Source, written by a founder who left five years ago. No documentation exists. "NONE SHALL REFACTOR ME," it roars. "I AM TECHNICAL DEBT INCARNATE."',
    choices: [
      {
        text: 'Refactor it — all of it',
        outcome: {
          addCard: 'random_epic',
          removeChosenCard: 2,
          hp: -15,
          message: 'You draw your IDE like a sword and charge. Hours of combat follow. You extract interfaces, break circular dependencies, add TypeScript types where there were none. The dragon thrashes, then dissolves into clean, modular components. You\'re broken. But the code is beautiful.',
        },
      },
      {
        text: 'Wrap it in a facade and walk away',
        outcome: {
          addCard: 'random_rare',
          gold: 20,
          stress: 8,
          message: 'You wrap the dragon in a clean API facade. It\'s still spaghetti underneath, but now it\'s spaghetti behind an interface. The dragon settles down, confused but contained. "THIS IS... ACCEPTABLE?" it mutters. The treasure is accessible now. The mess is someone else\'s problem.',
        },
      },
      {
        text: 'Rewrite from scratch',
        outcome: {
          removeChosenCard: 1,
          upgradeRandomCard: true,
          addCard: 'random_rare',
          stress: 5,
          hp: -8,
          message: 'You burn the dragon to the ground and start over. It takes everything you have. But the new code rises from the ashes — clean, tested, documented. The founder\'s ghost watches from the shadows, nodding in grudging approval.',
        },
      },
    ],
  },

  // ── CHAIN EVENT: Referral Scroll Part 3 ──
  {
    id: 'referral_scroll_3',
    title: 'The FAANG Citadel',
    icon: '📜',
    act: 3,
    condition: { requireFlag: 'has_referral_scroll_held' },
    description: 'The final chamber before the last boss opens into a magnificent citadel. The FAANG crest blazes above the gates. Guards bow as you approach — the referral scroll in your bag is singing now, resonating with the power of this place. "You held it this long?" the gatekeeper whispers, awed. "The scroll has appreciated in value. Considerably."',
    choices: [
      {
        text: 'Present the scroll with full ceremony',
        outcome: {
          addCard: 'random_epic',
          gold: 100,
          upgradeRandomCard: true,
          setFlag: 'referral_used',
          message: 'The gates open. Trumpets sound. The scroll blazes with golden fire as it\'s received by the citadel\'s inner council. In return, you receive an artifact of tremendous power, a vault of gold, and an upgrade to your best technique. Patience, it turns out, is the most overpowered strategy.',
        },
      },
      {
        text: 'Trade it for the legendary artifact',
        outcome: {
          addItem: 'golden_keyboard',
          setFlag: 'referral_used',
          message: 'You trade the scroll for something the citadel values even more than gold — the Golden Keyboard, a legendary artifact passed down through generations of engineers. Its keys glow with compiled wisdom. The gatekeeper nods. "A fair trade. Both sides profit."',
        },
      },
    ],
  },
];
