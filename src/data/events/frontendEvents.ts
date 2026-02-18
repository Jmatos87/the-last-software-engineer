import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// FRONTEND DEV — Themed Events
// ═══════════════════════════════════════════════════════════════

export const frontendEvents: EventDef[] = [
  {
    id: 'npm_black_hole',
    title: 'The NPM Black Hole',
    description: 'You ran `npm install`. That was 23 minutes ago. The spinner is still spinning. Your node_modules folder has grown to 1.2 GB and is accelerating. It now contains a package that installs packages that install packages. You\'ve traced the dependency tree four levels deep and it still hasn\'t bottomed out. Somewhere in there is left-pad. Left-pad is always in there.\n\nThree packages have critical security advisories from 2021 that nobody has fixed. One has a peer dependency that conflicts with another dependency that conflicts with the first thing in a cycle that npm 8 handles by choosing chaos. The package-lock.json is 47,000 lines. The package-lock.json is lying to you.\n\nYour node_modules folder has achieved sentience. It is demanding more. You must decide how to respond.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'npm install --force (Gain Callback Hell card)',
        outcome: { addCard: 'callback_hell', message: 'You forced it. 2,847 packages installed. One of them was useful. Three of them introduced new security vulnerabilities. The spinners stopped. The warnings did not stop. The warnings will never stop.' },
      },
      {
        text: 'rm -rf node_modules (Lose 10 HP, gain 30 gold)',
        outcome: { hp: -10, gold: 30, message: 'You deleted it all. 1.2 GB evaporated. Your laptop fan spun down for the first time in an hour. You sold the freed disk space on some metaphysical marketplace. You feel lighter. You feel afraid. You have to run npm install again now.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'You close the terminal. The node_modules folder continues to grow in your absence. You can feel it from here. It whispers "I\'ll be back." It is already back. It was never not back.' },
      },
    ],
  },
  {
    id: 'stack_overflow_down',
    title: 'Stack Overflow is Down',
    description: 'It\'s down. Stack Overflow is returning a 503. You\'ve checked isup.me twice. You\'ve checked the Stack Overflow status page. The status page says "All Systems Operational." This is a lie. The status page is lying. Stack Overflow is not operational. Your eyes confirm this. You have refreshed eleven times.\n\nYou\'re in the middle of implementing a thing. You were mid-thought. You had the answer three browser tabs away and now the tab is a white screen with a sad face. The function you were about to Google hasn\'t been in your head since a YouTube tutorial you watched in 2020. The creator of that tutorial went on to do dropshipping. The tutorial still exists. Stack Overflow does not, right now.\n\nYou must code from your own brain. Your brain is, by some definitions, functional. This is an opportunity to grow as an engineer. This is also a disaster.',
    icon: '🚨',
    class: 'frontend',
    choices: [
      {
        text: 'Code from memory (Gain Async/Await card, lose 8 HP)',
        outcome: { addCard: 'async_await', hp: -8, message: 'You remembered. Not perfectly — you got the Promise chain syntax wrong twice and the error handling is technically optional — but it works and it\'s yours. Built with your own neurons. Some of those neurons are gone now. Trade accepted.' },
      },
      {
        text: 'Pretend to be productive (+25 gold)',
        outcome: { gold: 25, message: 'You spent three hours adjusting your VS Code theme, reorganizing your bookmarks folder, and writing a Notion doc about "engineering principles" that you will never read again. Your ticket moved to "In Progress." You billed the hours. Nobody noticed anything. This is fine. This is development.' },
      },
    ],
  },
  {
    id: 'css_centering_challenge',
    title: 'The CSS Centering Challenge',
    description: 'A div needs to be centered. Vertically. And horizontally. Inside a container whose height is determined at runtime. On a page that requires IE11 support because one client has a locked-down IT policy and a 2014 Dell. You know what you\'re about to do is wrong. You know there\'s a correct way. You cannot remember the correct way. You never fully learned the correct way. You copy-pasted it every time.\n\nYou open MDN. You open a Stack Overflow answer from 2011 that has 14,000 upvotes. The accepted answer says `margin: auto`. That\'s not the right answer for this situation. The second answer, with 8,000 upvotes, involves `position: absolute` and a transform. The third answer says flexbox. The fourth answer says grid. The fifth answer says to use JavaScript. The comments on the fifth answer are a war crime.\n\nThere is a div. It must be centered. A decision must be made.',
    icon: '🎯',
    class: 'frontend',
    choices: [
      {
        text: 'Use Flexbox (Gain Flexbox card)',
        outcome: { addCard: 'flexbox', message: '`display: flex; justify-content: center; align-items: center;` — you typed it from memory this time. No Stack Overflow. No MDN. Pure muscle memory forged in the fires of a thousand misaligned divs. The div is centered. You did that. Flex.' },
      },
      {
        text: 'Use position: absolute + transform (Heal 15 HP)',
        outcome: { hp: 15, message: '`position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` — technically correct, spiritually wrong, functionally perfect. You feel the CSS gods judging you. They can judge all they want. The div is centered. The client is happy. You sleep fine.' },
      },
      {
        text: 'Give up and use a table (Reduce 15 stress)',
        outcome: { stress: -15, message: 'It\'s 2026. You used a `<table>` for layout. You center-aligned a `<td>`. The div — now a `<td>` — is perfectly centered. You\'ve made peace with who you are. The comments section of your PR will be chaotic. The feature ships on time. No regrets. Actually some regrets. No, no regrets.' },
      },
    ],
  },
  {
    id: 'nyancat_shrine',
    title: 'The Nyancat Shrine',
    description: 'You found it. Nested four directories deep in `/assets/legacy/old/final_final_v2/`, there is a folder called `/nyancat/`. Inside: 47 files, a custom CSS keyframe animation library, a full Web Audio API implementation of the original track, and a `README.txt` (not .md — .txt) that says only: "never delete this. — Kevin, 2016."\n\nThe git log shows Kevin added it in a commit called "you\'ll thank me later" and left the company eight months later to "pursue personal projects." Kevin\'s LinkedIn now says he\'s a ceramics artist in Vermont. He seems genuinely happy. The file has not been touched since. It still works. Better than anything else in this codebase. The rainbow animation runs at a silky 60fps. You don\'t know how. Kevin knew how.\n\nRainbow light pulses from the nyancat GIF in a continuous loop. The poptart body phases in and out of existence. You feel called upon to make a decision about this shrine.',
    icon: '🐱',
    class: 'frontend',
    choices: [
      {
        text: 'Embrace the rainbow (Gain Nyancat Rainbow card, lose 12 HP)',
        outcome: { addCard: 'nyancat_rainbow', hp: -12, message: 'You ran the animation at full brightness for forty-five minutes while staring at it. RGB flows through your veins. You understand Kevin now. You understand the poptart. You are the poptart. You will never fully return from this.' },
      },
      {
        text: 'Offer gold to the cat (Lose 40 gold, heal 25 HP, reduce 20 stress)',
        outcome: { gold: -40, hp: 25, stress: -20, message: 'You left $40 at the keyboard as tribute. The ambient sound of the nyancat MIDI filled the room. Your stress dissolved. Your health returned. You don\'t know how to explain what happened here. You don\'t have to. Kevin would understand.' },
      },
      {
        text: 'Take the glowing headphones (Gain Noise-Canceling Headphones)',
        outcome: { addItem: 'noise_canceling_headphones', stress: 10, message: 'Resting on the shrine\'s monitor, plugged into nothing, were the headphones. Sony WH-1000XM5s. The noise cancellation activated the moment you put them on. The world went quiet. The nyancat continued silently behind you, judging from a distance. The stress of obtaining them was worth it.' },
      },
      {
        text: 'Nope',
        outcome: { message: 'You close the folder. You close VS Code. You go make tea. Some things are beyond you. Kevin knew. You\'re not Kevin. The shrine remains, undisturbed, carrying its purpose forward through the years. Nyan. Nyan. Nyan.' },
      },
    ],
  },
  {
    id: 'bundle_size_crisis',
    title: 'The Bundle Size Crisis',
    description: 'The Lighthouse score is 31. The little circle is red, which you\'ve come to understand is Lighthouse\'s way of saying "you have done something wrong in your life." The main bundle is 4.7 MB uncompressed. The audit report has a section called "Opportunities" that is longer than the section called "Passing Audits." By a lot.\n\nYour PM sent you a screenshot of the Google PageSpeed result and the text "thoughts?" You have thoughts. The thoughts are: you imported moment.js in 2022 for timezone formatting and never switched to date-fns. You imported lodash for one function — `_.cloneDeep` — which could be replaced with `JSON.parse(JSON.stringify())` and you knew this then, as you know it now, and you did it anyway because you were in a hurry and "we\'ll fix it later." Later is now.\n\nThe build artifact weighs more than most published novels. Something must be done.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'Tree-shake everything (Upgrade random card, lose 8 HP)',
        outcome: { upgradeRandomCard: true, hp: -8, message: 'You removed moment.js, switched to date-fns/esm, converted the lodash import to three targeted functions, and lazy-loaded three entire feature routes. Bundle dropped from 4.7 MB to 890 KB. Lighthouse score: 84. Your brain: 40% operational. The PM sent a thumbs up. It was enough.' },
      },
      {
        text: 'Just lazy-load it (+20 gold, gain 10 stress)',
        outcome: { gold: 20, stress: 10, message: 'React.lazy() and Suspense around the three biggest routes. The bundle didn\'t shrink — it just loads in more pieces now. The waterfall chart looks like a geological cross-section. The Lighthouse score improved to 48. The PM stopped asking questions. You have been paid for this. You feel things.' },
      },
      {
        text: 'Ship it anyway (Gain random common, gain 15 stress)',
        outcome: { addCard: 'random_common', stress: 15, message: '"Users on fast connections won\'t notice." You pushed to production. Three users on slow connections noticed immediately. Their feedback was detailed and personal. You gained a card out of the chaos and a renewed relationship with the concept of performance budgets.' },
      },
    ],
  },
];
