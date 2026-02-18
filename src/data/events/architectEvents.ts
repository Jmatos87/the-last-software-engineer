import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// ARCHITECT — Themed Events
// ═══════════════════════════════════════════════════════════════

export const architectEvents: EventDef[] = [
  {
    id: 'whiteboard_session',
    title: 'The Whiteboard Session',
    description: 'You\'ve been given the whiteboard. The whole whiteboard. An expanse of white, bordered by a gray frame, watched over by seven engineers who have been in this room for forty minutes and are running on inadequate coffee and a shared desire for someone else to start drawing. "Just sketch out the system," they said. "High-level. No pressure."\n\nYou pick up the marker. You draw a box. The box is a service. The service needs to talk to something. You draw another box. The two boxes need a queue between them. You draw the queue. The queue implies a consumer. The consumer is a service. You draw the service. The service needs a database. There are now six boxes on the board and you\'ve been drawing for ninety seconds.\n\nSomeone in the back asks "should we be thinking about the mobile experience here?" This is a data pipeline. There is no mobile experience. You are the architect. Only you can end this.',
    icon: '📊',
    class: 'architect',
    choices: [
      {
        text: 'Design a perfect system (Gain Factory Method card, lose 6 HP)',
        outcome: { addCard: 'factory_method', hp: -6, message: 'You drew for four hours. You filled two whiteboards. You photographed everything before it could be erased. The system is elegant, scalable, and theoretically perfect. Nobody will implement it exactly as designed. That\'s architecture. You still feel good about the boxes.' },
      },
      {
        text: 'Draw something inappropriate (+30 gold)',
        outcome: { gold: 30, message: 'You drew a microservices diagram that looked, from a certain angle, deeply inappropriate. Someone Slacked it with a laughing emoji. It reached the CTO. The CTO thought it was commentary on the company\'s org structure and awarded you a "culture champion" bonus. You did not correct them.' },
      },
      {
        text: 'Meditate on the emptiness (Reduce 20 stress)',
        outcome: { stress: -20, message: 'You stood before the blank whiteboard for three full minutes without speaking. The room fell silent. Someone cleared their throat. You remained still. Eventually you capped the marker and said: "The best architecture is the one we don\'t build." You left. The blank board remained. Two engineers started drawing something. It\'s probably fine.' },
      },
    ],
  },
  {
    id: 'architecture_review_event',
    title: 'The Architecture Review',
    description: 'The Architecture Review Board convenes quarterly. You are presenting today. Your deck is 24 slides. You prepared for three days. The board has four members: one who always asks "have you considered event sourcing?", one who says "we need to think about mobile" regardless of the domain, one who is visibly asleep but wakes up during the Q&A, and one who takes notes with a mechanical pencil and has never once spoken positively about anything presented in this room.\n\nSlide 5 is the current state diagram. The diagram is so complex it had to be exported as a 4K PNG to remain legible. The board members are zooming in on different parts of it independently. Nobody is looking at the same thing. The one with the mechanical pencil is writing something. It is not short.\n\n"Interesting approach," one board member will say. This is the highest compliment they give. You are aiming for "interesting approach." You will settle for "we\'ll take it under advisement." You have forty minutes. Begin.',
    icon: '🏛️',
    class: 'architect',
    choices: [
      {
        text: 'Present your design (Gain Observer Pattern card, lose 8 HP)',
        outcome: { addCard: 'observer_pattern', hp: -8, message: '"Interesting approach." They said it. The mechanical pencil engineer circled something twice. The event sourcing question was asked, as always, and you had prepared a two-slide rebuttal. It landed. The sleeping one woke up during Q&A and asked a genuinely good question. You answered it well. You\'re exhausted and respected.' },
      },
      {
        text: 'Bribe the committee (+1 random rare card)',
        outcome: { addCard: 'random_rare', gold: -20, message: 'You announced that lunch was on you — "just a small thank-you for the board\'s time." You ordered from the good place, not the pizza place. $20 well spent. The review took twelve minutes. Everything was "approved pending documentation." The mechanical pencil wrote nothing. You gain a card in the glow of institutional goodwill.' },
      },
      {
        text: 'Skip the review',
        outcome: { stress: 10, message: 'You sent a Loom video instead. A twelve-minute recording of you walking through the slides, narrated in a tone that suggests you have all the time in the world. The board watched it asynchronously over three days. Three passive-aggressive Slack threads appeared. The decision was eventually "tabled for next quarter." This is technically a win.' },
      },
    ],
  },
  {
    id: 'technical_debt_collector',
    title: 'The Technical Debt Collector',
    description: 'You were making a small change — a two-line fix, max — and you found the thing. Not A thing. THE thing. The function that has // TODO comments from three different people, none of whom work here anymore. The class that\'s 2,400 lines long because "we\'ll split it later." The config file that references a server called `prod-old-2` that appears in zero other documents and yet the app crashes without it.\n\nA figure appears in the conference room doorway. They have a clipboard. The clipboard has a number on it. The number is the estimated person-hours of technical debt currently living in your codebase. You recognize the number from the quarterly planning doc. You helped write the quarterly planning doc. You wrote "carryover from previous quarter" next to this number. Every quarter. Since 2020.\n\n"You owe 47,000 lines of unrefactored code," the figure says. "Time to pay up." The clipboard glows ominously.',
    icon: '💳',
    class: 'architect',
    choices: [
      {
        text: 'Pay the debt (Remove a chosen card, heal 15 HP)',
        outcome: { removeChosenCard: 1, hp: 15, message: 'You scheduled a refactor sprint. You defended it in planning with the phrase "this is load-bearing scaffolding for Q4 velocity." It was approved. The work was hard. The codebase is cleaner. The function is 200 lines now instead of 2,400. Your soul is lighter. The TODO comments are gone. You wrote no new ones. A miracle.' },
      },
      {
        text: 'Refinance (Gain Scope Creep card, +25 gold)',
        outcome: { addCard: 'scope_creep', gold: 25, message: '"We\'ll tackle this in the next sprint." The debt gets a new ticket, a new priority, a new comment that says `// TODO: refactor this properly`. The Scope Creep card joins your deck. The debt compounds. The interest is paid in velocity. You gained gold and a useful card and absolutely nothing has improved.' },
      },
      {
        text: 'Declare bankruptcy',
        outcome: { hp: -15, stress: -25, message: 'You archived the repository. You created a new one. Greenfield. Clean. You told the team "we\'re doing this right this time." The stress evaporated. The next two weeks were genuinely exciting. Around week three, someone added a // TODO comment. The cycle has begun again. At least you feel lighter.' },
      },
    ],
  },
  {
    id: 'standup_meeting',
    title: 'The Eternal Standup',
    description: 'The standup started at 10:02 AM with the phrase "before we get into updates, I just want to address something from yesterday\'s retro real quick." It is now 10:49 AM. The something has not been addressed. Dave is screen-sharing his entire desktop, including a browser tab titled "How to talk to your manager about burnout" that he hasn\'t noticed is visible.\n\nYou gave your update at 10:07 AM. "Yesterday: the thing. Today: the other thing. No blockers." Twenty-three seconds. Perfect standup. Nobody acknowledged it. Dave has been talking since 10:09 AM. Dave\'s blocker is that he needs to schedule a meeting to discuss a dependency on a team that is two floors up in the same building. The PM is typing notes. The notes will be shared. Nobody will read the notes.\n\nThe calendar shows your next meeting starts in four minutes. The standup room is booked through noon. Dave is bringing up a new point.',
    icon: '🧍',
    class: 'architect',
    choices: [
      {
        text: '"I have a hard stop" (Gain Proof of Concept card)',
        outcome: { addCard: 'proof_of_concept', message: 'You said it with exactly the right energy. Not aggressive — just informational, the way someone says it who has meetings that matter. You left the room. Dave was mid-sentence. The meeting continued for 47 more minutes without you. You built a proof of concept in that time. The contrast was instructive.' },
      },
      {
        text: 'Actually participate (Gain Gantt Chart relic)',
        outcome: { addItem: 'gantt_chart', hp: -5, message: 'You engaged. You asked questions. You helped Dave articulate his blocker and offered to walk over and talk to the dependency team after. This was the right thing to do. It resolved three issues. It took 40 minutes. The Gantt Chart materialized in your hand because you are now the kind of person who fixes things in meetings. The power is yours.' },
      },
      {
        text: 'Mute and play games (Reduce 10 stress)',
        outcome: { stress: -10, message: 'Camera on, mic off, Stardew Valley in a different window. You harvested turnips during the retro discussion, cleared a mine level during the blocker breakdown, and came back to the call just in time to say "sounds good" to something. Three levels cleared. Zero stress about the standup. Sustainable architecture for the soul.' },
      },
    ],
  },
  {
    id: 'microservices_debate',
    title: 'The Microservices Debate',
    description: 'The Slack thread began with a casual "should we maybe think about service boundaries?" and has now accumulated 84 messages, two competing Figma diagrams, a poll with four options and no clear winner, and a reply from someone in a different timezone who missed the whole conversation and asked "sorry what\'s happening?" at the bottom.\n\nThe monolith has been running for four years. It works. It has handled 2 billion requests. It was written by three engineers and has been maintained by eleven since then, at various levels of understanding. But it doesn\'t scale, someone says. It does scale, someone else says. The first someone says it doesn\'t scale correctly. The debate has become philosophical. The CTO reacted with a 👀 to a message forty messages in. Nobody knows what that means. Everyone is afraid of what it means.\n\nMicroservices or monolith. The oldest question in a developer\'s heart. You must weigh in. The thread has your name in it. Someone tagged you. There is no escape.',
    icon: '🏗️',
    class: 'architect',
    choices: [
      {
        text: 'Embrace microservices (Upgrade random card, lose 12 HP, gain 10 stress)',
        outcome: { upgradeRandomCard: true, hp: -12, stress: 10, message: 'You wrote a 2,000-word Confluence document on "The Path to Service-Oriented Architecture." It was thorough and persuasive and cited Martin Fowler three times. The monolith was split. It took eight months. Kubernetes is now involved. You have seventeen dashboards. The original three engineers would not recognize what they created. A card is upgraded. The system is "modern." You are so tired.' },
      },
      {
        text: 'Defend the monolith (+30 gold, reduce 10 stress)',
        outcome: { gold: 30, stress: -10, message: '"Majestic Monolith. Modular. Deployable as a unit, separable by contract." You sent one link. One blog post. The thread stopped. The CTO replied with "💯." Dave said "oh that makes sense actually." It was over. The monolith lives. You saved it. Gold was transferred for your consulting insight. The peace is real.' },
      },
      {
        text: 'Suggest modular monolith (Remove chosen card, heal 10 HP)',
        outcome: { removeChosenCard: 1, hp: 10, message: '"Modular monolith. Clear domain boundaries, shared deployment, ability to extract services if and when the need actually arises." The thread went quiet for four minutes. Then: "yeah okay." The centrist option. Nobody loves it. Nobody wars over it. It ships in Q3 as planned. You removed a card you never needed. Pragmatism healed you.' },
      },
    ],
  },
  {
    id: 'viral_rfc',
    title: 'The Viral RFC',
    description: 'You wrote an internal RFC eight months ago proposing a new approach to service contract versioning. It was clear, well-reasoned, and referenced three papers from industry practitioners. The proposal committee said "interesting, let\'s table it for now." You tabled it. It sat in Confluence.\n\nSomehow it leaked. Not your doing — someone shared a screenshot of the key diagram in a tech Slack community, and within 72 hours engineers at four other companies had replied with variations of "we\'ve been trying to articulate this exact thing for months." A newsletter mentioned it. A podcast mentioned it. You are now receiving LinkedIn connection requests at a rate that your inbox was not designed to handle.\n\nYour company knows it was yours. They have opinions about what should happen next. So does the industry. These opinions are in direct conflict.',
    icon: '📡',
    class: 'architect',
    choices: [
      {
        text: 'Publish it (+1 epic card, gain 15 stress)',
        outcome: { addCard: 'random_epic', stress: 15, message: 'You cleaned it up, added implementation examples, and published it with your name on it. The blog post got 40,000 views in a week. You were invited to speak at two conferences. Your company initially called it an "unauthorized disclosure" and then, once the response was clearly positive, called it an "example of our thought leadership culture." You now have a reputation that precedes you. The stress is maintaining it.' },
      },
      {
        text: 'Keep it internal, sell consulting (+40 gold, upgrade random card)',
        outcome: { gold: 40, upgradeRandomCard: true, message: 'You declined the public exposure and instead offered the full RFC — implementation guide, worked examples, the failure modes section that didn\'t make it into the original — as a consulting engagement. Three companies hired you for afternoon calls. Each call was $40 of the company\'s consulting budget which they routed through your employer. The RFC is still not public. The knowledge transferred. The card it informed in your own practice got sharper.' },
      },
      {
        text: 'Open-source the implementation (Remove chosen card, +1 rare card, reduce 20 stress)',
        outcome: { removeChosenCard: 1, addCard: 'random_rare', stress: -20, message: 'You published the RFC and an open-source implementation under your company\'s GitHub org (with legal\'s surprisingly quick approval, once they understood the PR value). The repo has 800 stars. Three companies have production adoptions. You removed a card from your deck that represented a pattern the RFC made obsolete — if you\'re going to argue a better way, you should use it. The stress reduction is the relief of saying the thing you meant in public.' },
      },
    ],
  },
  {
    id: 'org_redesign',
    title: 'The Org Redesign',
    description: 'The VP sent a message on a Friday at 3 PM. The message says: "Would love to get your thinking on how we could restructure the eng org to better support our product goals. Free for a quick sync Monday?" You have been in this industry long enough to know that "quick sync" on this topic means "I want you to produce the document that will change everyone\'s reporting structure, titles, and team memberships, which I will then present as a leadership initiative."\n\nYou also know this: org design is real engineering. The structure of the teams determines the structure of the software they build. Conway\'s Law isn\'t a metaphor, it\'s a load-bearing principle. The current org has four teams that own overlapping domains, two people with the same title who perform different jobs, and one team whose charter has been "TBD" for seven months. Whoever designs the new structure is, functionally, writing the next two years of the company\'s architecture.\n\nMonday is in two days. The org has 43 people. The VP is waiting.',
    icon: '🏢',
    class: 'architect',
    choices: [
      {
        text: 'Design something real (Upgrade random card, +1 relic, lose 15 HP)',
        outcome: { upgradeRandomCard: true, addItem: 'circuit_breaker', hp: -15, message: 'You spent the weekend doing it right — interviewing team leads, mapping system dependencies against Conway\'s Law, identifying the four teams that should be two and the one team that should be three. Your proposal was 24 pages with an appendix. The VP presented it unchanged. The org shipped in Q2. The teams stopped arguing about ownership because the boundaries were designed to match the architecture. The relic is what you earned from being the person who makes systems hold together under pressure. The HP cost is what it took to care that much.' },
      },
      {
        text: 'Propose something safe (+40 gold, gain 10 stress)',
        outcome: { gold: 40, stress: 10, message: 'You proposed minor adjustments — renamed the TBD team, clarified two overlapping charters, suggested a quarterly cross-team sync ritual. Nothing structural. Nothing that would require difficult conversations about reporting lines. The VP approved it in eleven minutes. You received a "thank you for the thoughtful analysis" Slack and a spot bonus. The org problems remain. The org problems are now documented as "addressed." The stress is knowing the difference.' },
      },
      {
        text: 'Refuse the assignment (Remove chosen card, reduce 20 stress)',
        outcome: { removeChosenCard: 1, stress: -20, message: '"I don\'t think I\'m the right person for this. Org design should involve the people whose lives will change — I\'d recommend a working group with team lead representation and an external facilitator." The VP paused. The VP said "hm." A month later, a working group was formed. It did not include you. The design they produced was better than what you would have built alone, which proved your point. A card representing your tendency to carry other people\'s architecture problems left your deck.' },
      },
    ],
  },
];
