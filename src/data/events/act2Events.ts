import type { EventDef } from '../../types';

export const act2Events: EventDef[] = [
  // ── ACT 2: THE INTERVIEW GAUNTLET ──
  // Theme: Deep in the dungeon. Trials, riddles, guardian challenges.
  // Technical interviews, whiteboard terrors, and corporate gauntlets.

  {
    id: 'whiteboard_dragon',
    title: 'The Whiteboard Dragon',
    icon: '🐉',
    act: 2,
    description: 'A massive whiteboard stretches across the chamber, covered in half-erased system designs. Before it coils a dragon made entirely of dry-erase markers and broken promises. It speaks in a voice like squeaking on glass: "SOLVE MY RIDDLE, OR SOLVE NOTHING EVER AGAIN." Smoke — or perhaps expo marker fumes — curls from its nostrils.',
    choices: [
      {
        text: 'Attempt the optimal solution',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          hp: -12,
          message: 'You approach the board. The dragon watches as you diagram a perfect O(n log n) solution. Sweat drips onto the marker tray. When you cap the marker, the dragon nods slowly. "ACCEPTABLE." It yields its treasure — but the mental toll was brutal.',
        },
      },
      {
        text: 'Brute force it',
        outcome: {
          addCard: 'random_common',
          stress: 5,
          message: 'You scrawl a nested-loop monstrosity across the entire board. O(n³). The dragon winces but concedes: "IT... WORKS. TECHNICALLY." It tosses you a consolation prize. You can feel its disappointment radiating like heat.',
        },
      },
      {
        text: '"I\'d Google this in production"',
        outcome: {
          gold: 25,
          stress: -5,
          message: 'The dragon freezes. Its marker-scales rattle. Then it begins to laugh — a horrible, squeaking cacophony. "FINALLY. HONESTY." It tosses gold coins at you while wiping tears of marker ink from its eyes. "GET OUT OF MY CAVE."',
        },
      },
    ],
  },

  {
    id: 'culture_fit_altar',
    title: 'The Culture Fit Altar',
    icon: '🏛️',
    act: 2,
    description: 'A pristine altar stands in a room decorated with motivational posters and bean bag chairs. The inscription reads: "PROVE YOUR CULTURAL ALIGNMENT." A spectral HR representative materializes, clipboard in hand, smile perfectly calibrated to 73% warmth. "Tell me about yourself," they whisper. "But make it authentic. And also exactly what we want to hear."',
    choices: [
      {
        text: '"I\'m passionate about disruption"',
        outcome: {
          addCard: 'random_rare',
          stress: 8,
          message: 'The altar glows approvingly. The HR specter marks something on their clipboard. "Wonderful. We love passion." A power surges through you — the hollow kind. You got what you wanted, but at what cost to your soul?',
        },
      },
      {
        text: '"I just want work-life balance"',
        outcome: {
          hp: 15,
          stress: -10,
          gold: -20,
          message: 'The HR specter\'s smile falters. The altar dims. "We... appreciate your honesty." They fade away, taking some of your gold as a "processing fee." But the weight lifts from your shoulders. You feel genuinely rested for the first time in weeks.',
        },
      },
      {
        text: 'Refuse to perform',
        outcome: {
          removeChosenCard: 1,
          stress: -5,
          message: 'You turn your back on the altar. "I\'m done performing." The HR specter gasps. The motivational posters curl and blacken. But as you walk away, you feel something unnecessary fall away from your deck. Lighter. Freer.',
        },
      },
    ],
  },

  {
    id: 'take_home_dungeon',
    title: 'The Take-Home Dungeon',
    icon: '📦',
    act: 2,
    description: 'A sealed chamber bears the inscription: "COMPLETE THIS CHALLENGE IN YOUR OWN TIME. ESTIMATED: 4 HOURS. (IT IS NOT 4 HOURS.)" Inside, a take-home assignment sits on a pedestal, glowing with deceptive simplicity. The last adventurer who entered is still here — they\'ve been working for six days. They haven\'t blinked in three.',
    choices: [
      {
        text: 'Give it your absolute best',
        outcome: {
          addCard: 'random_epic',
          hp: -15,
          stress: 10,
          message: 'You lose track of time. Hours bleed into days. You implement error handling, tests, a README, and a Docker config they didn\'t ask for. When you finally emerge, you\'re battered and exhausted — but clutching something magnificent.',
        },
      },
      {
        text: 'Minimum viable effort',
        outcome: {
          addCard: 'random_common',
          stress: 3,
          message: 'You write the bare minimum, push to a private repo, and walk out in two hours. The assignment weeps quietly behind you. "Is that... is that ALL you\'re going to..." It trails off as the door closes.',
        },
      },
      {
        text: 'Decline — your time has value',
        outcome: {
          gold: 30,
          stress: -8,
          message: 'You leave the take-home untouched and spend the time freelancing instead. The chamber rumbles with disapproval, but your bank account rumbles with approval. Your self-respect feels oddly intact.',
        },
      },
    ],
  },

  {
    id: 'glassdoor_oracle',
    title: 'The Glassdoor Oracle',
    icon: '🔮',
    act: 2,
    description: 'In a dim alcove, a fortune teller sits behind a crystal monitor. Reviews scroll across its surface — 2.3 stars, 4.8 stars, "Great culture but the CEO is a lizard person." The Oracle peers at you through glasses that are somehow both bifocals and VR headsets. "I see... your next employer," they rasp. "For a price."',
    choices: [
      {
        text: 'Pay for the full reading',
        outcome: {
          gold: -30,
          upgradeRandomCard: true,
          addConsumable: 'random_rare',
          message: 'The Oracle reveals everything: the real salary bands, the actual work-life balance, which manager will gaslight you. Armed with this forbidden knowledge, you prepare accordingly. The Oracle winks. "Also, the snacks are mid."',
        },
      },
      {
        text: 'Read only the 1-star reviews',
        outcome: {
          stress: 5,
          removeChosenCard: 1,
          message: '"CEO parks in handicapped spots." "They made us return to office then closed the office." "I was replaced by a Bash script." The horror clarifies your mind. You shed dead weight from your approach, laser-focused on what to avoid.',
        },
      },
      {
        text: 'Smash the crystal monitor',
        outcome: {
          gold: 20,
          hp: -8,
          message: 'You bring your fist down on the monitor. Glass and Glassdoor reviews scatter everywhere. The Oracle shrieks. You pocket some salvageable components and flee, stepping on a review that reads "Would not recommend — adventurer just smashed our equipment."',
        },
      },
    ],
  },

  {
    id: 'pair_programming_trial',
    title: 'The Pair Programming Trial',
    icon: '👥',
    act: 2,
    description: 'You enter a chamber with two desks, one keyboard, and a sign that reads "ONE DRIVER. ONE NAVIGATOR. NO EXCEPTIONS." A random adventurer is already seated. They crack their knuckles and gesture to the empty chair. "Hope you know Vim," they say, "because that\'s all that\'s installed." The door locks behind you.',
    choices: [
      {
        text: 'Drive — take the keyboard',
        outcome: {
          addCard: 'random_rare',
          stress: 8,
          hp: -5,
          message: 'You type while they backseat-code every keystroke. "Actually, I\'d use a reduce there." "That variable name is problematic." "Why aren\'t you using semicolons?" By the end, you\'ve produced something powerful — and developed a permanent eye twitch.',
        },
      },
      {
        text: 'Navigate — let them drive',
        outcome: {
          upgradeRandomCard: true,
          stress: 5,
          message: 'You watch them code in a style that defies all convention. Tabs AND spaces. Snake_case AND camelCase. In the SAME FILE. But somehow, against all reason, it works. You learn something disturbing about flexibility.',
        },
      },
      {
        text: 'Suggest mob programming with more people',
        outcome: {
          gold: -15,
          addCard: 'random_common',
          addConsumable: 'random_common',
          message: 'More adventurers pile in. The room becomes chaos. Seven people debate the naming of a single variable for forty minutes. But somehow, the collective produces two useful things. Democracy is messy but occasionally productive.',
        },
      },
    ],
  },

  {
    id: 'salary_negotiation_chamber',
    title: 'The Negotiation Chamber',
    icon: '💰',
    act: 2,
    description: 'A grand chamber with a long obsidian table. On one side sits a figure in impeccable armor labeled "TOTAL COMPENSATION." They slide a scroll across the table. The number written on it is... fine. Just fine. Not great. Not insulting. Painfully, strategically fine. "This is our best and final offer," they say, folding their hands. It is not their best and final offer.',
    choices: [
      {
        text: 'Counter aggressively — know your worth',
        outcome: {
          gold: 50,
          hp: -10,
          stress: 5,
          message: 'You slide the scroll back. "I have competing offers." A lie, but they don\'t know that. The figure\'s eye twitches. Numbers are scratched out, rewritten, scratched again. You walk away with significantly more gold, but the confrontation left marks.',
        },
      },
      {
        text: 'Accept gracefully',
        outcome: {
          gold: 20,
          stress: 8,
          message: 'You accept the offer with a smile and a handshake. The gold is decent. The figure looks relieved — and slightly disappointed? "You could have asked for more," they murmur as you leave. That sentence will haunt your dreams.',
        },
      },
      {
        text: 'Negotiate for non-monetary perks',
        outcome: {
          gold: 10,
          addConsumable: 'random_rare',
          stress: -5,
          message: '"I\'ll take the base, but I want remote work, unlimited PTO, and a learning budget." The figure blinks. Nobody has ever asked for this. They scribble furiously. You leave with modest gold but something far more valuable: flexibility.',
        },
      },
    ],
  },

  // ── CHAIN EVENT: Referral Scroll Part 2 ──
  {
    id: 'referral_scroll_2',
    title: 'The FAANG Embassy',
    icon: '📜',
    act: 2,
    condition: { requireFlag: 'has_referral_scroll' },
    description: 'You recognize the seal on a building ahead — the same crest as the referral scroll burning a hole in your bag. A FAANG embassy, here in the dungeon. The guard at the door spots your scroll and straightens. "You have an appointment?" they ask, suddenly respectful. Behind them, you can see halls of gold and legendary artifacts.',
    choices: [
      {
        text: 'Cash in the referral now',
        outcome: {
          addCard: 'random_epic',
          addItem: 'networking_badge',
          setFlag: 'referral_used',
          message: 'You present the scroll. The doors fly open. Inside, you\'re treated like royalty — free snacks, ergonomic everything, and they hand you a genuinely powerful artifact. "Welcome aboard," the guard says. The referral dissolves into golden motes. It was worth the wait.',
        },
      },
      {
        text: 'Hold out for the final round',
        outcome: {
          setFlag: 'has_referral_scroll_held',
          stress: -3,
          message: 'The guard raises an eyebrow. "You want to... wait? For the FINAL round?" You nod. The scroll pulses brighter, as if agreeing. Whatever awaits at the end of this dungeon, this scroll will open doors you can\'t imagine. Patience is its own form of power.',
        },
      },
      {
        text: 'Sell the referral to the highest bidder',
        outcome: {
          gold: 80,
          message: 'A crowd of recruiters materializes like vultures sensing carrion. A bidding war erupts. The final price is obscene. You walk away rich, trying not to think about the adventure you just sold.',
        },
      },
    ],
  },
];
