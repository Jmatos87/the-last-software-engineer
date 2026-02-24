import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// SHRINE EVENTS — Available in any act, once per run
// Pure utility events, rare enough to feel like lucky finds
// ═══════════════════════════════════════════════════════════════

export const shrineEvents: EventDef[] = [
  {
    id: 'rubber_duck_shrine',
    title: 'The Rubber Duck Shrine',
    icon: '🦆',
    description: 'A small alcove in the corridor holds a single rubber duck on a velvet cushion. It\'s the legendary Debugging Duck — the one that needs no response, only your explanation. A plaque reads: "SPEAK YOUR PROBLEM ALOUD. THE DUCK WILL NOT ANSWER. THE ANSWER WILL COME FROM WITHIN." Previous visitors have left offerings: a mechanical keyboard keycap, a torn page from Clean Code, and a very small bottle of whiskey.',
    choices: [
      {
        text: 'Explain your entire build to the duck',
        outcome: {
          removeChosenCard: 1,
          stress: -10,
          message: 'You sit before the duck and explain everything. Every card. Every synergy. Every weakness. Halfway through, you stop. "Wait. THAT\'s the dead weight." You remove the card that was holding you back. The duck says nothing. The duck didn\'t need to.',
        },
      },
      {
        text: 'Ask the duck about your career',
        outcome: {
          hp: 20,
          stress: -15,
          message: 'You pour your heart out to the duck. Imposter syndrome. The job market. Whether any of this matters. The duck stares with its painted eyes, utterly non-judgmental. You cry a little. You feel so much better. The duck is still there when you leave. It will always be there.',
        },
      },
      {
        text: 'Take the duck with you',
        outcome: {
          addConsumable: 'random_rare',
          message: 'You pocket the duck. It\'s warm. Comforting. The alcove doesn\'t seem upset — there are drawers full of replacement ducks behind the cushion. Someone planned for this. Someone who understood that rubber duck debugging saves more code than any linter ever will.',
        },
      },
    ],
  },

  {
    id: 'refactoring_altar',
    title: 'The Refactoring Altar',
    icon: '✨',
    description: 'An altar of polished obsidian hums with transformative energy. The inscription reads: "PLACE WHAT YOU HAVE. RECEIVE WHAT YOU NEED." Previous offerings lie scattered: a copy of "Design Patterns" (1994 edition, worn smooth), a commit message that says "fixed stuff," and an entire legacy codebase compressed into a small glowing orb.',
    choices: [
      {
        text: 'Sacrifice a card — transform it into something better',
        outcome: {
          removeChosenCard: 1,
          addCard: 'random_epic',
          message: 'You place a card on the altar. It dissolves, then reconstitutes — same energy, different form. Better form. The altar knows what you need more than you do. Refactoring isn\'t destruction. It\'s evolution.',
        },
      },
      {
        text: 'Offer gold for an upgrade',
        outcome: {
          gold: -30,
          upgradeRandomCard: true,
          message: 'You place gold on the altar. One of your existing techniques sharpens, as if it was always meant to be this strong. The altar takes the gold and whispers: "Technical debt can be paid in any currency."',
        },
      },
      {
        text: 'Meditate before the altar',
        outcome: {
          hp: 10,
          stress: -10,
          upgradeRandomCard: true,
          message: 'You don\'t sacrifice anything. You just sit. The altar\'s energy washes over you, refactoring your thoughts. One technique improves on its own. Your body heals. Your stress fades. Sometimes the best refactor is rest.',
        },
      },
    ],
  },

  {
    id: 'free_lunch_inn',
    title: 'The Free Lunch Inn',
    icon: '🍕',
    description: 'A cozy inn with a hand-painted sign: "THE FREE LUNCH — ALL YOU CAN EAT." Inside, the fire crackles, the pizza is unlimited, and the WiFi password is "thereisnofreelunch." The innkeeper winks. "There IS a free lunch," they say. "The economists were wrong. Sit. Eat. Choose your gift." Three chests sit by the fireplace, each glowing a different color.',
    choices: [
      {
        text: 'Open the green chest (Healing)',
        outcome: {
          hp: 30,
          stress: -15,
          message: 'The chest contains: two slices of pizza that actually taste like something, a warm blanket, and the knowledge that not everything costs something. You eat. You rest. You heal in ways that hit points barely capture.',
        },
      },
      {
        text: 'Open the blue chest (Power)',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          message: 'The chest contains: a technique honed by the inn\'s founder, who was a legendary engineer before they opened this place. "I retired to make pizza," they say. "The code was the warm-up." You absorb their wisdom.',
        },
      },
      {
        text: 'Open the gold chest (Wealth)',
        outcome: {
          gold: 60,
          addConsumable: 'random_common',
          message: 'The chest contains: a small fortune in gold and a useful tool. The innkeeper shrugs. "Venture capital money. Someone left it here in 2021 and never came back. It\'s yours now."',
        },
      },
    ],
  },

  {
    id: 'meditation_room',
    title: 'The Meditation Room',
    icon: '🧘',
    description: 'A perfectly silent room. No Slack notifications. No email. No standups. No retrospectives. No one-on-ones. No "quick syncs." Just silence, a cushion, and a window overlooking a garden that has never heard of agile methodology. A sign on the door reads: "THERE ARE NO BLOCKERS HERE." The door closes behind you with a satisfying click.',
    choices: [
      {
        text: 'Meditate on your build',
        outcome: {
          upgradeRandomCard: true,
          stress: -20,
          message: 'You sit. You breathe. You think about your deck without anxiety. A technique improves — not through force, but through clarity. The stress doesn\'t just decrease — it transforms into something useful. Perspective.',
        },
      },
      {
        text: 'Simply rest — no thinking, no optimizing',
        outcome: {
          hp: 25,
          stress: -25,
          addConsumable: 'random_common',
          message: 'You lie on the cushion and do absolutely nothing. No coding. No planning. No thinking about the meta. For the first time in this run, you exist without purpose. When you rise, you find something useful left on the cushion by the last occupant.',
        },
      },
      {
        text: 'Journal about your run so far',
        outcome: {
          removeChosenCard: 1,
          hp: 15,
          stress: -10,
          message: 'You write about every fight. Every choice. Every mistake. The journaling reveals a pattern — a card that\'s been dead weight, a strategy that\'s been working despite you, not because of you. You make a change. The writing made it obvious.',
        },
      },
    ],
  },
];
