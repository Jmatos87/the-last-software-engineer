import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// ARCHITECT — "The Resonance Weaver"
// DnD × Software Engineering — class events by act
// ═══════════════════════════════════════════════════════════════

export const architectEvents: EventDef[] = [
  // ── ACT 1: Application Abyss ──
  {
    id: 'blueprint_chamber',
    title: 'The Blueprint Chamber',
    icon: '📐',
    act: 1,
    class: 'architect',
    description: 'Behind a sealed door, you discover a chamber lined with architectural blueprints from a bygone era. System designs for products that conquered the world — and some that destroyed their creators. One blueprint glows faintly: a distributed system so elegant it makes your eyes water. Another is scorched black, labeled "MICROSERVICES — DO NOT REPEAT." A third is incomplete, waiting.',
    choices: [
      {
        text: 'Study the elegant design',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          hp: -5,
          message: 'You trace the elegant design for hours. Event sourcing with CQRS, but done RIGHT — bounded contexts that actually respect domain boundaries. The knowledge seeps into you. Your existing techniques sharpen. Something new crystallizes.',
        },
      },
      {
        text: 'Learn from the scorched blueprint',
        outcome: {
          removeChosenCard: 1,
          gold: 20,
          message: 'The scorched blueprint tells a cautionary tale: 47 microservices for a team of 6. You absorb the lesson. Complexity is not sophistication. You shed dead weight from your approach. The gold was wedged behind the frame, left by the last architect who learned this lesson.',
        },
      },
      {
        text: 'Complete the unfinished blueprint',
        outcome: {
          addCard: 'random_epic',
          hp: -12,
          stress: 8,
          message: 'You pick up the drafting pen and finish what someone else started. Hours pass. The system takes shape — something that hasn\'t been built yet, something that SHOULD be built. When you step back, the blueprint blazes with light. It\'s brilliant. It\'s yours now.',
        },
      },
    ],
  },

  {
    id: 'pattern_library',
    title: 'The Pattern Library',
    icon: '📚',
    act: 1,
    class: 'architect',
    description: 'A magical library where design patterns live as sentient entities. The Singleton sulks alone in a corner, insisting there can be only one visitor at a time. The Observer watches everyone silently. The Factory churns out copies of everything. The Strategy pattern keeps changing the subject. "Choose one to guide you," the librarian whispers. "But beware — each has a cost."',
    choices: [
      {
        text: 'Consult the Observer',
        outcome: {
          addCard: 'random_rare',
          stress: -5,
          message: 'The Observer has been watching the entire codebase. It knows where every event fires and every subscriber listens. It shares its knowledge freely, then vanishes — as Observers do. You feel more aware. More reactive. Less coupled.',
        },
      },
      {
        text: 'Challenge the Singleton to a debate',
        outcome: {
          upgradeRandomCard: true,
          stress: 5,
          message: '"You\'re an anti-pattern!" you shout. "I\'m a CLASSIC!" it screams back. The argument rages for twenty minutes. By the end, you both concede there are valid use cases. Your technique sharpens from the friction. The Singleton returns to its corner. Alone.',
        },
      },
      {
        text: 'Let the Factory build you something',
        outcome: {
          addCard: 'random_common',
          addConsumable: 'random_common',
          message: 'The Factory hums to life. It produces one card and one consumable, each a perfect copy of something useful. "I can make more," it offers eagerly. "I can make SO many more." You back away slowly.',
        },
      },
    ],
  },

  // ── ACT 2: Interview Gauntlet ──
  {
    id: 'microservices_hydra',
    title: 'The Microservices Hydra',
    icon: '🐲',
    act: 2,
    class: 'architect',
    description: 'A hydra blocks the path, each head a different microservice. Cut one and two more grow in its place, each with its own API contract, deployment pipeline, and Kubernetes namespace. The Slack thread about this creature reached 84 messages before someone asked "what are we even debating?" The CTO reacted with 👀. Nobody knows what that means.',
    choices: [
      {
        text: 'Split the monolith — embrace the hydra',
        outcome: {
          upgradeRandomCard: true,
          hp: -12,
          stress: 10,
          message: 'You draw your architecture diagram like a sword and carve. Service boundaries. API gateways. Kubernetes is now involved. You have seventeen dashboards. The original three engineers wouldn\'t recognize what they built. A technique improves. You are so, so tired.',
        },
      },
      {
        text: 'Defend the monolith — slay the hydra',
        outcome: {
          gold: 30,
          stress: -10,
          message: '"Majestic Monolith." You send one link. One blog post. The hydra\'s heads retract, confused by pragmatism. The CTO replies 💯. Dave says "oh that makes sense." The monolith lives. The peace is real. The consulting fee is justified.',
        },
      },
      {
        text: 'Modular monolith — negotiate a truce',
        outcome: {
          removeChosenCard: 1,
          hp: 10,
          message: '"Clear domain boundaries. Shared deployment. Extract services if and when needed." The hydra considers this. Its heads confer. "Yeah okay." The centrist option. Nobody loves it. Everyone accepts it. It ships in Q3. Pragmatism heals.',
        },
      },
    ],
  },

  {
    id: 'tech_debt_collector',
    title: 'The Technical Debt Collector',
    icon: '💳',
    act: 2,
    class: 'architect',
    description: 'A figure appears in the conference room doorway. They have a clipboard. The number on it is the estimated person-hours of technical debt in your codebase. You recognize it from quarterly planning — you helped write it. "Carryover from previous quarter," you\'d written. Every quarter. Since 2020. "You owe 47,000 lines of unrefactored code," the figure says. "Time to pay up."',
    choices: [
      {
        text: 'Pay the debt — full refactor sprint',
        outcome: {
          removeChosenCard: 1,
          hp: 15,
          stress: -10,
          message: 'You schedule a refactor sprint. "Load-bearing scaffolding for Q4 velocity." Approved. The 2,400-line class becomes 200 lines. The TODO comments vanish. Your soul lightens. You wrote no new TODOs. A miracle.',
        },
      },
      {
        text: 'Refinance — kick it down the road',
        outcome: {
          gold: 25,
          addCard: 'random_common',
          stress: 5,
          message: '"We\'ll tackle this next sprint." The debt gets a new ticket. A new priority. A new `// TODO: refactor properly`. The debt compounds. The interest is paid in velocity. Nothing has improved. But you gained something in the chaos.',
        },
      },
      {
        text: 'Declare bankruptcy — greenfield rewrite',
        outcome: {
          hp: -15,
          stress: -25,
          addCard: 'random_rare',
          message: 'You archive the repo. Create a new one. Greenfield. Clean. Two weeks of genuine excitement. Then someone adds a TODO comment. The cycle begins again. But for now — for this moment — the slate is clean and the code is beautiful.',
        },
      },
    ],
  },

  // ── ACT 3: Corporate Final Round ──
  {
    id: 'org_chart_labyrinth',
    title: 'The Org Chart Labyrinth',
    icon: '🏢',
    act: 3,
    class: 'architect',
    description: 'A maze made of org charts. Every turn is a reporting line. Dead ends are "TBD" teams. The walls shift when someone gets promoted. A VP sent a Friday 3 PM message: "Would love your thinking on restructuring eng." You know what this means. You\'ll design the document that changes everyone\'s team, title, and manager. Conway\'s Law isn\'t a metaphor here — it\'s load-bearing.',
    choices: [
      {
        text: 'Design the org to match the architecture',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_epic',
          hp: -15,
          message: 'You spend the weekend mapping system dependencies against Conway\'s Law. Four teams become two. One team becomes three. Your 24-page proposal ships unchanged. Teams stop arguing about ownership because boundaries match architecture. The HP cost is caring this much.',
        },
      },
      {
        text: 'Propose safe incremental changes',
        outcome: {
          gold: 40,
          stress: 5,
          message: 'Rename the TBD team. Clarify two charters. Suggest a quarterly sync. Nothing structural. Approved in eleven minutes. Spot bonus. The org problems remain, now documented as "addressed." The stress is knowing the difference.',
        },
      },
      {
        text: 'Refuse — recommend a working group instead',
        outcome: {
          removeChosenCard: 1,
          stress: -20,
          message: '"Org design should involve the people whose lives will change." A month later, the working group produces something better than you would have built alone. You shed a tendency to carry everyone else\'s architecture problems. Lighter.',
        },
      },
    ],
  },

  {
    id: 'rfc_colosseum',
    title: 'The RFC Colosseum',
    icon: '🏛️',
    act: 3,
    class: 'architect',
    description: 'A colosseum built from archived RFCs. The crowd is every engineer who ever replied "just one concern" in a document review. You must defend your proposal — a new approach to service contract versioning. The opposition is armed with "have you considered event sourcing?" and "what about mobile?" Your RFC is 47 pages. Your conviction is infinite. The mechanical-pencil engineer is already taking notes.',
    choices: [
      {
        text: 'Defend your RFC with conviction',
        outcome: {
          addCard: 'random_epic',
          stress: 10,
          hp: -8,
          message: 'You present for four hours. The event-sourcing question comes. You have a two-slide rebuttal. It LANDS. The mechanical-pencil engineer circles something twice — approvingly. "Interesting approach." The highest compliment. Your RFC becomes canon.',
        },
      },
      {
        text: 'Open-source it before they can kill it',
        outcome: {
          removeChosenCard: 1,
          addCard: 'random_rare',
          stress: -15,
          message: 'You publish the RFC and an implementation under the company GitHub. 800 stars in a week. Three production adoptions. The colosseum falls silent. Hard to kill what the community already loves. A card representing your old approach leaves. The RFC made it obsolete.',
        },
      },
      {
        text: 'Withdraw and iterate in private',
        outcome: {
          upgradeRandomCard: true,
          gold: 30,
          message: 'You table the RFC and offer paid consulting calls to the three companies that already reached out. $30 per session. The RFC gets sharper with each conversation. When you re-present next quarter, it\'s bulletproof. Sometimes retreat is strategy.',
        },
      },
    ],
  },
];
