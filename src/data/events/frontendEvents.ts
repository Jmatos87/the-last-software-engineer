import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// FRONTEND DEV — "The Agile Shadow"
// DnD × Software Engineering — class events by act
// ═══════════════════════════════════════════════════════════════

export const frontendEvents: EventDef[] = [
  // ── ACT 1: Application Abyss ──
  {
    id: 'css_labyrinth',
    title: 'The CSS Labyrinth',
    icon: '🌀',
    act: 1,
    class: 'frontend',
    description: 'You enter a maze whose walls shift with every step. The floor is nested divs. The ceiling has `position: absolute` and hovers at an incorrect z-index. A sign reads: "CENTER THE ELEMENT TO ESCAPE." Previous adventurers scratched desperate CSS into the walls. Most of it doesn\'t work. One reads: "I tried float: center. It does not exist. Tell my family."',
    choices: [
      {
        text: 'Use flexbox — the sacred incantation',
        outcome: {
          addCard: 'random_rare',
          stress: -5,
          message: 'You whisper: "display: flex; justify-content: center; align-items: center." The walls snap into alignment. The labyrinth dissolves into clean whitespace. Flexbox saves the day. As always. You step out into the light, perfectly centered.',
        },
      },
      {
        text: 'CSS Grid — the nuclear option',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          hp: -8,
          message: 'You lay down a full grid system. Rows, columns, areas, gaps. The labyrinth doesn\'t just center — it reorganizes into a beautiful, semantic layout. The walls applaud. The ceiling finally has a correct z-index. Overkill. Glorious.',
        },
      },
      {
        text: 'Use a table — embrace the darkness',
        outcome: {
          hp: 10,
          stress: -10,
          gold: 15,
          message: 'It\'s 2026. You used a `<table>` for layout. You center-aligned a `<td>`. The maze collapses, embarrassed to exist around such primal energy. A senior dev watches in awe, slides you coins: "I\'ve been trying to do that for years."',
        },
      },
    ],
  },

  {
    id: 'framework_merchant',
    title: 'The Framework Merchant',
    icon: '🏪',
    act: 1,
    class: 'frontend',
    description: 'A traveling merchant blocks your path, their cart overflowing with glowing orbs labeled "REACT," "VUE," "SVELTE," and one mysterious sphere covered in dust. "Each framework grants unique powers," they grin. "But choose wisely — you can only carry one. And the migration cost is your sanity."',
    choices: [
      {
        text: 'Take the React orb',
        outcome: {
          addCard: 'random_rare',
          stress: 3,
          message: 'The React orb pulses with hooks and state. Power floods through you — and the crushing weight of choice paralysis. "Redux? Zustand? Context? Jotai?" The merchant is already gone. The decision tree has infinite branches.',
        },
      },
      {
        text: 'Take the dusty sphere (Vanilla JS)',
        outcome: {
          addCard: 'random_epic',
          hp: -10,
          stress: 8,
          message: 'The sphere is ice-cold. Text appears: "VANILLA JS." Raw DOM manipulation. No virtual DOM. No reactivity. Just you, the browser, and addEventListener. It\'s terrifying. Powerful. You feel the web as it was meant to be felt.',
        },
      },
      {
        text: 'Knock over the cart and flee',
        outcome: {
          addCard: 'random_common',
          addConsumable: 'random_common',
          hp: -5,
          message: 'Frameworks clash in your bag — React and Angular fighting, Svelte silently judging both. The resulting bundle is 4.7MB. But you got some useful scraps in the chaos.',
        },
      },
    ],
  },

  // ── ACT 2: Interview Gauntlet ──
  {
    id: 'bundle_size_basilisk',
    title: 'The Bundle Size Basilisk',
    icon: '🐍',
    act: 2,
    class: 'frontend',
    description: 'A massive serpent of bundled JavaScript coils in the chamber. Its body is 4.2MB uncompressed. Lighthouse scores plummet in its presence. Its eyes are spinning loading spinners. "I AM EVERY NPM PACKAGE YOU NEVER TREE-SHOOK," it hisses. "MOMENT.JS. LODASH. THAT CHART LIBRARY YOU USED ONCE FOR A DEMO."',
    choices: [
      {
        text: 'Tree-shake it into oblivion',
        outcome: {
          upgradeRandomCard: true,
          removeChosenCard: 1,
          hp: -8,
          message: 'Dead code falls away in great slabs — unused locales, redundant polyfills, the entirety of moment.js\'s timezone data. The basilisk shrieks and shrinks to 200KB. Your arms ache. The Lighthouse score hits 98.',
        },
      },
      {
        text: 'Lazy-load its segments',
        outcome: {
          addCard: 'random_rare',
          stress: 5,
          message: 'Dynamic imports split the basilisk into lazy chunks. It\'s still there, but deferred. Initial paint: 0.8 seconds. The basilisk is confused but alive. You can hear it loading in the background, segment by segment.',
        },
      },
      {
        text: '"Users have fast internet"',
        outcome: {
          gold: 25,
          stress: 10,
          message: 'You step over the basilisk and ship it. Somewhere in rural Kansas, a user waits 47 seconds for your page. You can\'t hear them over the bundler warnings. The gold is from your team\'s "velocity bonus."',
        },
      },
    ],
  },

  {
    id: 'accessibility_paladin',
    title: 'The Accessibility Paladin',
    icon: '⚔️',
    act: 2,
    class: 'frontend',
    description: 'A knight in shining armor blocks your path. Their shield bears the WCAG 2.1 crest. Their sword is a screen reader. "YOUR INTERFACE FAILS 73 CHECKS," they thunder. "THE ALT TEXTS ARE EMPTY. THE CONTRAST IS CRIMINAL. THE TAB ORDER IS AN ABOMINATION." Behind them, a scroll lists every violation.',
    choices: [
      {
        text: 'Fix everything properly',
        outcome: {
          upgradeRandomCard: true,
          removeChosenCard: 1,
          hp: -12,
          message: 'Semantic HTML replaces div soup. ARIA labels bloom. Contrast reaches AAA. The Paladin sheathes their sword. "Your interface... is beautiful." You collapse from exhaustion, but every user — every user — can now use what you built.',
        },
      },
      {
        text: '"Accessibility IS a feature, not a checkbox"',
        outcome: {
          addCard: 'random_rare',
          stress: -3,
          message: 'The Paladin pauses, then slowly smiles. "Finally. Someone who understands." They hand you a technique born from inclusive design — something that improves EVERYONE\'s experience. The Paladin nods and steps aside.',
        },
      },
      {
        text: 'Slap aria-label on everything',
        outcome: {
          gold: 15,
          stress: 8,
          message: 'You add `aria-label="button"` to every element. The Paladin\'s eye twitches violently. Violations drop from 73 to 71. They pay you to leave. Your conscience pays a different price.',
        },
      },
    ],
  },

  // ── ACT 3: Corporate Final Round ──
  {
    id: 'jquery_ruins',
    title: 'The jQuery Ruins',
    icon: '🏚️',
    act: 3,
    class: 'frontend',
    description: 'Ancient ruins stretch before you — a frontend codebase from 2014. jQuery selectors are carved into crumbling pillars. Backbone models lie in rubble. A CoffeeScript waterfall still flows. In the center, a legacy component has been running in production for nine years without a single update. It glows with eldritch stability.',
    choices: [
      {
        text: 'Migrate to modern React',
        outcome: {
          removeChosenCard: 2,
          addCard: 'random_epic',
          hp: -15,
          message: 'jQuery to React. Backbone to hooks. CoffeeScript to TypeScript. Each conversion is agony — edge cases, implicit behaviors, undocumented jQuery quirks. But the ruins transform into a crystal palace of components. The old gods are dead. Long live the new gods.',
        },
      },
      {
        text: 'Wrap it in an iframe',
        outcome: {
          addCard: 'random_rare',
          gold: 20,
          stress: 5,
          message: 'You erect an iframe around the ruins. Old and new coexist, separated by postMessage. It works. It\'s pragmatic. The purists hate it. The stakeholders don\'t care. The ruins persist inside their glass cage, still functioning.',
        },
      },
      {
        text: 'Learn from the ancients',
        outcome: {
          upgradeRandomCard: true,
          stress: -5,
          hp: 8,
          message: 'You study the ruins. The jQuery is... actually well-written. Clean. No framework churn. No weekly breaking changes. You absorb techniques that transcend any framework. The old code has wisdom the new code never will.',
        },
      },
    ],
  },

  {
    id: 'design_system_deity',
    title: 'The Design System Deity',
    icon: '🎨',
    act: 3,
    class: 'frontend',
    description: 'A radiant being descends — the Design System Deity, made of consistent spacing, harmonious tokens, and 8px grids. "YOUR COMPONENTS LACK CONSISTENCY," it declares. "BOW BEFORE THE SYSTEM. ACCEPT MY TOKENS. ABANDON YOUR ARTISANAL CSS." Its robes are exactly var(--robe-approved-divine).',
    choices: [
      {
        text: 'Submit to the Design System',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          stress: 5,
          message: 'Every color, shadow, and border-radius is standardized. Components snap into visual harmony. It\'s beautiful. Consistent. Constraining. The Deity smiles, and that smile is exactly var(--smile-approved-deity).',
        },
      },
      {
        text: 'Forge your own design language',
        outcome: {
          addCard: 'random_epic',
          hp: -10,
          stress: 8,
          message: 'You reject the tokens and craft your own. Hand-tuned CSS. Custom properties set by eye, not committee. The Deity screams as your rogue design tears through consistency. It\'s chaotic. Personal. Art.',
        },
      },
      {
        text: 'Negotiate — tokens for layout, freedom for motion',
        outcome: {
          addConsumable: 'random_rare',
          upgradeRandomCard: true,
          message: '"I\'ll use your tokens for structure but keep creative freedom for animations." The Deity considers heresy, then relents. "ACCEPTABLE. BUT YOUR EASING CURVES MUST BE CUBIC-BEZIER." Reasonable. Design needs structure AND soul.',
        },
      },
    ],
  },
];
