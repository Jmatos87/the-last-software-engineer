import type { EventDef } from '../types';

export const events: EventDef[] = [
  {
    id: 'abandoned_repo',
    title: 'Abandoned Repository',
    description: 'You discover an old GitHub repository with thousands of stars but no maintainer. The code looks promising but risky.',
    icon: '📁',
    choices: [
      {
        text: 'Fork and study the code (+1 random card)',
        outcome: { addCard: 'random_common', message: 'You learned a new technique!' },
      },
      {
        text: 'Mine it for cryptocurrency (+30 gold)',
        outcome: { gold: 30, message: 'Crypto profits!' },
      },
      {
        text: 'Salvage a relic from the repo (Gain Company Swag Mug)',
        outcome: { addItem: 'company_swag_mug', message: 'You found a dusty mug with a faded startup logo. It still works.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'You leave the repository untouched.' },
      },
    ],
  },
  {
    id: 'coffee_machine',
    title: 'The Coffee Machine',
    description: 'A pristine coffee machine sits in an abandoned break room. The aroma is irresistible.',
    icon: '☕',
    choices: [
      {
        text: 'Drink the coffee (Heal 15 HP)',
        outcome: { hp: 15, message: 'You feel rejuvenated!' },
      },
      {
        text: 'Sell the machine (+ 25 gold)',
        outcome: { gold: 25, message: 'Someone will pay good money for this.' },
      },
    ],
  },
  {
    id: 'hackathon',
    title: 'Hackathon',
    description: 'You stumble upon a hackathon in progress. The competitors look fierce but the prizes are good.',
    icon: '🏆',
    choices: [
      {
        text: 'Compete! (Lose 8 HP, gain a card)',
        outcome: { hp: -8, addCard: 'random_uncommon', message: 'You won! New technique acquired.' },
      },
      {
        text: 'Judge instead (+20 gold)',
        outcome: { gold: 20, message: 'Easy money for giving feedback.' },
      },
      {
        text: 'Skip it',
        outcome: { message: 'Not today.' },
      },
    ],
  },
  {
    id: 'code_mentor',
    title: 'Code Mentor',
    description: 'A wise senior developer offers to review your code. "I can teach you, but it requires sacrifice."',
    icon: '👨‍💻',
    choices: [
      {
        text: 'Accept mentoring (Remove a random card)',
        outcome: { removeRandomCard: true, message: 'Your deck feels leaner and more focused.' },
      },
      {
        text: 'Ask for money instead (+15 gold)',
        outcome: { gold: 15, message: 'The mentor sighs and hands over some cash.' },
      },
    ],
  },
  {
    id: 'server_room',
    title: 'The Server Room',
    description: 'You find a dark server room humming with power. Blinking lights cast eerie shadows.',
    icon: '🏢',
    choices: [
      {
        text: 'Scavenge for parts (+40 gold, lose 10 HP)',
        outcome: { gold: 40, hp: -10, message: 'You got shocked but found valuable components.' },
      },
      {
        text: 'Grab the on-call pager (Gain On-Call Rotation artifact)',
        outcome: { addItem: 'on_call_rotation', hp: -5, message: 'The pager vibrates ominously. +2 Dexterity, but you\'ll never sleep again.' },
      },
      {
        text: 'Meditate among the servers (Heal 20 HP)',
        outcome: { hp: 20, message: 'The hum of servers calms your mind.' },
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // NEUTRAL — Risk/Reward Events
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'whiteboard_interview',
    title: 'The Whiteboard Interview',
    description: 'An interviewer slides a dry-erase marker across the table. "Reverse a binary tree. On the whiteboard. Now." The marker smells like fear.',
    icon: '📋',
    choices: [
      {
        text: 'Solve it perfectly (Upgrade random card, lose 12 HP)',
        outcome: { upgradeRandomCard: true, hp: -12, message: 'You nailed it. The interviewer slow-clapped. Your brain is smoking.' },
      },
      {
        text: 'Brute force it (Gain random common, lose 5 HP)',
        outcome: { addCard: 'random_common', hp: -5, message: 'O(n³) but it works. "We\'ll be in touch." (They won\'t.)' },
      },
      {
        text: 'Refuse to whiteboard (+30 gold, gain 15 stress)',
        outcome: { gold: 30, stress: 15, message: '"I don\'t perform under artificial pressure." You stormed out and freelanced instead.' },
      },
    ],
  },
  {
    id: 'recruiter_dm',
    title: 'The Recruiter\'s DM',
    description: '"Hi! I came across your profile and I think you\'d be a GREAT fit for an exciting opportunity!" The message has 47 exclamation marks.',
    icon: '💬',
    choices: [
      {
        text: 'Take the call (Upgrade random card, gain 10 stress)',
        outcome: { upgradeRandomCard: true, stress: 10, message: 'The call lasted 90 minutes. You learned something. Your ear is numb.' },
      },
      {
        text: 'Counter with salary demands (+50 gold, lose 8 HP)',
        outcome: { gold: 50, hp: -8, message: '"I require $500k base, unlimited PTO, and a company pony." They... agreed?' },
      },
      {
        text: 'Mark as spam (Remove random card, reduce 10 stress)',
        outcome: { removeRandomCard: true, stress: -10, message: 'Blocked. Reported. Filtered. Inner peace achieved.' },
      },
    ],
  },
  {
    id: 'oss_maintainer',
    title: 'The Open Source Maintainer',
    description: 'A haggard developer approaches. Dark circles. 2,000 open issues. "Please... just one PR review..." Their project has 50k stars and 0 sponsors.',
    icon: '🌟',
    choices: [
      {
        text: 'Accept the project (Upgrade random card, gain 20 stress)',
        outcome: { upgradeRandomCard: true, stress: 20, message: 'You\'re now maintaining a critical dependency for 40% of npm. Congrats?' },
      },
      {
        text: 'Donate to them (Lose 35 gold, heal 25 HP, reduce 15 stress)',
        outcome: { gold: -35, hp: 25, stress: -15, message: 'They cried. You cried. Open source is beautiful and terrible.' },
      },
      {
        text: 'Ghost them (Gain 10 stress)',
        outcome: { stress: 10, message: 'You walked away. The guilt follows. Their GitHub Sponsors page haunts your dreams.' },
      },
    ],
  },
  {
    id: 'performance_review',
    title: 'The Performance Review',
    description: 'Your manager opens a spreadsheet with 47 KPIs. "Let\'s discuss your impact this quarter." The room smells like corporate despair.',
    icon: '📊',
    choices: [
      {
        text: 'Exceed expectations (Upgrade random card, lose 15 HP)',
        outcome: { upgradeRandomCard: true, hp: -15, message: 'You presented a 30-slide deck on your "impact." You got a 3% raise. Worth it?' },
      },
      {
        text: 'Meets expectations (+20 gold, gain 10 stress)',
        outcome: { gold: 20, stress: 10, message: '"Solid performance." The most lukewarm compliment in corporate history.' },
      },
      {
        text: 'Self-review: "I\'m a rockstar" (Heal 20 HP, gain 15 stress)',
        outcome: { hp: 20, stress: 15, message: 'You wrote 500 words about how amazing you are. Your manager sighed audibly.' },
      },
    ],
  },
  {
    id: 'salary_negotiation',
    title: 'The Salary Negotiation',
    description: 'HR sends the offer letter. The number is... underwhelming. Your rent costs more than their monthly offer. Time to negotiate.',
    icon: '💰',
    choices: [
      {
        text: 'Counter aggressively (+60 gold, lose 15 HP)',
        outcome: { gold: 60, hp: -15, message: '"I have competing offers." You don\'t. But they don\'t know that. It worked.' },
      },
      {
        text: 'Accept gracefully (+25 gold, gain 15 stress)',
        outcome: { gold: 25, stress: 15, message: 'You signed immediately. The recruiter looked surprised. "Usually people negotiate..."' },
      },
      {
        text: 'Leak the offer on Blind (Remove random card, +40 gold)',
        outcome: { removeRandomCard: true, gold: 40, message: 'Anonymous post went viral. HR panicked. Everyone got raises. You got fired.' },
      },
    ],
  },
  {
    id: 'vendor_pitch',
    title: 'The Vendor Pitch',
    description: 'A vendor corners you at a conference. Their slides have 800 buzzwords. "AI-powered blockchain-native cloud-synergized solutions." They won\'t stop.',
    icon: '📢',
    choices: [
      {
        text: 'Endure the full pitch (Gain random uncommon, gain 20 stress)',
        outcome: { addCard: 'random_uncommon', stress: 20, message: 'It was 90 minutes. You learned nothing. But the free t-shirt had a useful technique on it.' },
      },
      {
        text: 'Steal their free swag (+30 gold)',
        outcome: { gold: 30, message: 'You grabbed 5 branded water bottles and a stress ball. "That\'s not really how this—" Too late.' },
      },
      {
        text: 'Flip the table (Lose 10 HP, reduce 20 stress)',
        outcome: { hp: -10, stress: -20, message: 'You literally flipped their demo table. Security escorted you out. Worth it.' },
      },
    ],
  },
  {
    id: 'imposter_spiral',
    title: 'The Imposter Syndrome Spiral',
    description: 'You\'re staring at your own code and you can\'t remember writing it. It\'s... actually good? "I definitely didn\'t write this. Did I? Am I real?"',
    icon: '🎭',
    choices: [
      {
        text: 'Confront your fears (Upgrade random card, lose 10 HP, gain 10 stress)',
        outcome: { upgradeRandomCard: true, hp: -10, stress: 10, message: 'You accepted that you\'re competent. It was the hardest thing you\'ve ever done.' },
      },
      {
        text: 'Fake it till you make it (+25 gold)',
        outcome: { gold: 25, message: '"Absolutely, I architected that entire system." (You copy-pasted from Stack Overflow.)' },
      },
      {
        text: 'Have a breakdown (Lose 20 HP, reduce 25 stress)',
        outcome: { hp: -20, stress: -25, message: 'You cried in the bathroom for 30 minutes. Honestly? You feel so much better now.' },
      },
    ],
  },
  {
    id: 'unpaid_internship',
    title: 'The Unpaid Internship',
    description: '"It\'s a great learning opportunity!" The posting requires 5 years of experience, a PhD, and offers $0/hr plus "exposure."',
    icon: '🎓',
    choices: [
      {
        text: 'Take it for experience (Upgrade random card, lose 30 gold)',
        outcome: { upgradeRandomCard: true, gold: -30, message: 'You learned a lot. You also learned what ramen tastes like for breakfast, lunch, and dinner.' },
      },
      {
        text: 'Demand payment (+40 gold)',
        outcome: { gold: 40, message: '"My time has value." They were so shocked they actually paid you.' },
      },
      {
        text: 'Report to labor board (Remove random card, heal 15 HP)',
        outcome: { removeRandomCard: true, hp: 15, message: 'Justice was served. The company now pays minimum wage. Progress.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // FRONTEND DEV — themed events
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'npm_black_hole',
    title: 'The NPM Black Hole',
    description: 'Your node_modules folder has achieved sentience and is demanding more dependencies.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'npm install --force (Gain Callback Hell card)',
        outcome: { addCard: 'callback_hell', message: 'You installed 2,847 packages. One of them was useful.' },
      },
      {
        text: 'rm -rf node_modules (Lose 10 HP, gain 30 gold)',
        outcome: { hp: -10, gold: 30, message: 'A weight is lifted. Literally — you freed 4GB of disk space.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'The node_modules folder whispers "I\'ll be back" as you leave.' },
      },
    ],
  },
  {
    id: 'stack_overflow_down',
    title: 'Stack Overflow is Down',
    description: 'The unthinkable has happened. Stack Overflow is returning 503. Developers worldwide are in a panic.',
    icon: '🚨',
    class: 'frontend',
    choices: [
      {
        text: 'Code from memory (Gain Async/Await card, lose 8 HP)',
        outcome: { addCard: 'async_await', hp: -8, message: 'You actually remembered how Promises work. It cost you several brain cells.' },
      },
      {
        text: 'Pretend to be productive (+25 gold)',
        outcome: { gold: 25, message: 'You spent 3 hours adjusting your VS Code theme instead.' },
      },
    ],
  },
  {
    id: 'css_centering_challenge',
    title: 'The CSS Centering Challenge',
    description: 'A mysterious div appears. It asks to be centered. Vertically AND horizontally. Every frontend dev\'s final boss.',
    icon: '🎯',
    class: 'frontend',
    choices: [
      {
        text: 'Use Flexbox (Gain Flexbox card)',
        outcome: { addCard: 'flexbox', message: 'justify-content: center; align-items: center; You did it. The legends were true.' },
      },
      {
        text: 'Use position: absolute + transform (Heal 15 HP)',
        outcome: { hp: 15, message: 'Hacky but it works. Just like everything else in CSS.' },
      },
      {
        text: 'Give up and use a table (Reduce 15 stress)',
        outcome: { stress: -15, message: 'It\'s 2026 and you used a <table> for layout. No regrets.' },
      },
    ],
  },
  {
    id: 'nyancat_shrine',
    title: 'The Nyancat Shrine',
    description: 'Deep in an abandoned WeWork, you find a shrine to the ancient Nyancat. Rainbow light pulses from within. The poptart beckons.',
    icon: '🐱',
    class: 'frontend',
    choices: [
      {
        text: 'Embrace the rainbow (Gain Nyancat Rainbow card, lose 12 HP)',
        outcome: { addCard: 'nyancat_rainbow', hp: -12, message: 'RGB flows through your veins. You are one with the meme.' },
      },
      {
        text: 'Offer gold to the cat (Lose 40 gold, heal 25 HP, reduce 20 stress)',
        outcome: { gold: -40, hp: 25, stress: -20, message: 'Nyancat purrs. The rainbow heals all wounds.' },
      },
      {
        text: 'Take the glowing headphones (Gain Noise-Canceling Headphones)',
        outcome: { addItem: 'noise_canceling_headphones', stress: 10, message: 'The headphones hum with ancient meme energy. Draw +1 card each turn!' },
      },
      {
        text: 'Nope',
        outcome: { message: 'You resist the meme. Nyancat looks disappointed.' },
      },
    ],
  },

  {
    id: 'bundle_size_crisis',
    title: 'The Bundle Size Crisis',
    description: 'Your production build is 47MB. The CDN is crying. Lighthouse score: 3. Your PM is asking why the site takes 40 seconds to load on mobile.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'Tree-shake everything (Upgrade random card, lose 8 HP)',
        outcome: { upgradeRandomCard: true, hp: -8, message: 'You removed 200 unused imports. Bundle dropped to 2MB. You dropped to the floor.' },
      },
      {
        text: 'Just lazy-load it (+20 gold, gain 10 stress)',
        outcome: { gold: 20, stress: 10, message: 'React.lazy() and a prayer. The waterfall chart looks like Niagara Falls.' },
      },
      {
        text: 'Ship it anyway (Gain random common, gain 15 stress)',
        outcome: { addCard: 'random_common', stress: 15, message: '"Users have good internet, right?" Narrator: They did not.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BACKEND DEV — themed events
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'production_incident',
    title: 'Production Incident',
    description: 'PagerDuty is screaming. The database is on fire. Latency is through the roof. It\'s 3 AM.',
    icon: '🔥',
    class: 'backend',
    choices: [
      {
        text: 'Fix it with a raw SQL query (Gain Stored Procedure card)',
        outcome: { addCard: 'stored_procedure', hp: -6, message: 'You wrote a 200-line SQL query at 3 AM. It worked. You don\'t remember how.' },
      },
      {
        text: 'Restart the server and pray (+20 gold, heal 10 HP)',
        outcome: { gold: 20, hp: 10, message: 'It worked. Nobody knows why. Nobody asks.' },
      },
      {
        text: 'Blame the frontend team (Reduce 15 stress)',
        outcome: { stress: -15, message: '"It\'s a CORS issue." It wasn\'t, but you feel better.' },
      },
    ],
  },
  {
    id: 'legacy_migration',
    title: 'The Legacy Migration',
    description: 'You find a server running Windows Server 2003. It hosts a critical COBOL application. Someone left a note: "DO NOT TOUCH."',
    icon: '💾',
    class: 'backend',
    choices: [
      {
        text: 'Migrate to modern stack (Gain Index Optimization card, lose 10 HP)',
        outcome: { addCard: 'index_optimization', hp: -10, message: 'Three days of migration. Two days of debugging. One moment of triumph.' },
      },
      {
        text: 'Scavenge the hardware (+35 gold)',
        outcome: { gold: 35, message: 'The server had gold-plated connectors. Literally.' },
      },
      {
        text: 'Leave it running',
        outcome: { message: 'Some things are better left untouched. The COBOL application hums contently.' },
      },
    ],
  },
  {
    id: 'dns_propagation',
    title: 'DNS Propagation',
    description: '"It\'s always DNS." You stare at a terminal showing DNS records pointing to... nothing. Hours of your life slip away.',
    icon: '🌐',
    class: 'backend',
    choices: [
      {
        text: 'Debug until it resolves (Gain Firewall Rules card, lose 8 HP)',
        outcome: { addCard: 'firewall_rules', hp: -8, message: 'It WAS DNS. It\'s always DNS. You gained knowledge and lost sleep.' },
      },
      {
        text: 'Wait 48 hours (Heal 20 HP)',
        outcome: { hp: 20, message: 'You waited. It propagated. You rested. Life is good.' },
      },
    ],
  },
  {
    id: 'crypto_mining_rig',
    title: 'The Crypto Mining Rig',
    description: 'Someone left a massive GPU rig in the server room. The electricity bill explains why the company went bankrupt.',
    icon: '⛏️',
    class: 'backend',
    choices: [
      {
        text: 'Mine some crypto (+50 gold, gain 15 stress)',
        outcome: { gold: 50, stress: 15, message: 'ETH to the moon! (Your stress to the moon too.)' },
      },
      {
        text: 'Repurpose for load testing (Gain Brute Force Attack card)',
        outcome: { addCard: 'brute_force_attack', message: 'Now THAT\'s computational power.' },
      },
      {
        text: 'Report it to management',
        outcome: { gold: 15, message: 'Management gave you a $15 gift card for "doing the right thing." Wow.' },
      },
    ],
  },

  {
    id: 'n_plus_one_query',
    title: 'The N+1 Query',
    description: 'Your ORM is firing 10,000 queries for a single page load. The DBA is sending you threatening emails. The database CPU is at 99%.',
    icon: '🔍',
    class: 'backend',
    choices: [
      {
        text: 'Optimize with joins (Upgrade random card, lose 10 HP)',
        outcome: { upgradeRandomCard: true, hp: -10, message: 'You wrote a 47-line JOIN query. It works. You don\'t understand it anymore.' },
      },
      {
        text: 'Add a cache layer (+25 gold, gain 10 stress)',
        outcome: { gold: 25, stress: 10, message: 'Redis fixes everything. Until the cache invalidation bugs start.' },
      },
      {
        text: '"It works on my machine" (Heal 15 HP, gain 20 stress)',
        outcome: { hp: 15, stress: 20, message: 'You closed the ticket as "Cannot Reproduce." The DBA knows where you sit.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ARCHITECT — themed events
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'whiteboard_session',
    title: 'The Whiteboard Session',
    description: 'An empty whiteboard in a conference room. Markers of every color. The urge to diagram is overwhelming.',
    icon: '📊',
    class: 'architect',
    choices: [
      {
        text: 'Design a perfect system (Gain Factory Method card, lose 6 HP)',
        outcome: { addCard: 'factory_method', hp: -6, message: 'You drew boxes and arrows for 4 hours. It was beautiful. Nobody will implement it.' },
      },
      {
        text: 'Draw something inappropriate (+30 gold)',
        outcome: { gold: 30, message: 'You drew a phallic microservices diagram. Someone Slack\'d it company-wide. You got a bonus.' },
      },
      {
        text: 'Meditate on the emptiness (Reduce 20 stress)',
        outcome: { stress: -20, message: 'The blank whiteboard is a metaphor for infinite possibility. Or your career prospects.' },
      },
    ],
  },
  {
    id: 'architecture_review_event',
    title: 'The Architecture Review',
    description: 'A committee of senior architects invites you to review your system design. Their eyes are cold. Their feedback will be colder.',
    icon: '🏛️',
    class: 'architect',
    choices: [
      {
        text: 'Present your design (Gain Observer Pattern card, lose 8 HP)',
        outcome: { addCard: 'observer_pattern', hp: -8, message: '"Interesting approach." The highest compliment an architect can give.' },
      },
      {
        text: 'Bribe the committee (+1 random uncommon card)',
        outcome: { addCard: 'random_uncommon', gold: -20, message: 'They approved your design after you bought lunch. Software engineering.' },
      },
      {
        text: 'Skip the review',
        outcome: { stress: 10, message: 'The committee sends passive-aggressive Slack messages for a week.' },
      },
    ],
  },
  {
    id: 'technical_debt_collector',
    title: 'The Technical Debt Collector',
    description: 'A mysterious figure in a suit appears. "You owe 47,000 lines of unrefactored code. Time to pay up."',
    icon: '💳',
    class: 'architect',
    choices: [
      {
        text: 'Pay the debt (Remove a random card, heal 15 HP)',
        outcome: { removeRandomCard: true, hp: 15, message: 'Your codebase is cleaner. Your soul is lighter.' },
      },
      {
        text: 'Refinance (Gain Scope Creep card, +25 gold)',
        outcome: { addCard: 'scope_creep', gold: 25, message: '"We\'ll pay it off next sprint." You won\'t.' },
      },
      {
        text: 'Declare bankruptcy',
        outcome: { hp: -15, stress: -25, message: 'rm -rf *. Start fresh. It hurts but it\'s freeing.' },
      },
    ],
  },
  {
    id: 'standup_meeting',
    title: 'The Eternal Standup',
    description: 'A standup meeting that started 45 minutes ago. Someone is screen-sharing their entire desktop. There is no end in sight.',
    icon: '🧍',
    class: 'architect',
    choices: [
      {
        text: '"I have a hard stop" (Gain Proof of Concept card)',
        outcome: { addCard: 'proof_of_concept', message: 'You escaped. The meeting continues without you. It always does.' },
      },
      {
        text: 'Actually participate (Gain Gantt Chart relic)',
        outcome: { addItem: 'gantt_chart', hp: -5, message: 'You engaged meaningfully. +1 energy per combat. Your soul: slightly dimmer.' },
      },
      {
        text: 'Mute and play games (Reduce 10 stress)',
        outcome: { stress: -10, message: 'You beat 3 levels of a mobile game during the meeting. Productive day.' },
      },
    ],
  },

  {
    id: 'microservices_debate',
    title: 'The Microservices Debate',
    description: 'A heated Slack thread erupts. 47 engineers. 47 opinions. "Should we split the monolith?" The CTO is watching. Everyone is wrong.',
    icon: '🏗️',
    class: 'architect',
    choices: [
      {
        text: 'Embrace microservices (Upgrade random card, lose 12 HP, gain 10 stress)',
        outcome: { upgradeRandomCard: true, hp: -12, stress: 10, message: 'You split the monolith into 200 services. Kubernetes is your only friend now.' },
      },
      {
        text: 'Defend the monolith (+30 gold, reduce 10 stress)',
        outcome: { gold: 30, stress: -10, message: '"Monoliths are underrated." The CTO nodded. The Slack thread died. Peace.' },
      },
      {
        text: 'Suggest modular monolith (Remove random card, heal 10 HP)',
        outcome: { removeRandomCard: true, hp: 10, message: 'The centrist option. Nobody loves it. Nobody hates it. It ships on time.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // AI ENGINEER — themed events
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'gpu_shortage',
    title: 'The GPU Shortage',
    description: 'The cloud provider is out of A100s. Your training run is paused. The model was 87% done.',
    icon: '🔧',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Buy GPUs on the black market (Lose 40 gold, gain Fine Tuning card)',
        outcome: { gold: -40, addCard: 'fine_tuning', message: 'Scalpers had H100s. Your wallet weeps. Your model trains.' },
      },
      {
        text: 'Quantize and optimize (Gain Batch Normalization card)',
        outcome: { addCard: 'batch_normalization', message: 'INT8 quantization. 4x faster, only 2% accuracy loss. Acceptable.' },
      },
      {
        text: 'Wait for capacity (Heal 20 HP)',
        outcome: { hp: 20, message: 'You took a break while waiting. First break in 3 weeks.' },
      },
    ],
  },
  {
    id: 'ai_ethics_board',
    title: 'The AI Ethics Board',
    description: 'The Ethics Board wants to review your model. They have concerns about "emergent behavior" and "catastrophic misalignment."',
    icon: '⚖️',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Submit to review (Gain Alignment Training card, reduce 15 stress)',
        outcome: { addCard: 'alignment_training', stress: -15, message: 'They approved your model. RLHF saves the day. Your conscience is clear.' },
      },
      {
        text: 'Deploy without review (Gain Emergent Behavior card, gain 15 stress)',
        outcome: { addCard: 'emergent_behavior', stress: 15, message: 'YOLO deployment. The model does... things. Powerful things. Scary things.' },
      },
      {
        text: 'Bribe them with a demo (+30 gold)',
        outcome: { gold: 30, message: 'You showed them the model generating cat memes. They were distracted. Crisis averted.' },
      },
    ],
  },
  {
    id: 'data_leak',
    title: 'The Training Data Leak',
    description: 'Your training dataset was accidentally made public. It contains PII, copyrighted text, and someone\'s entire diary.',
    icon: '🔓',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Retrain from scratch (Lose 10 HP, gain Transfer Learning card)',
        outcome: { hp: -10, addCard: 'transfer_learning', message: 'Clean data, clean conscience. The retraining was worth it.' },
      },
      {
        text: 'Pretend nothing happened (+35 gold)',
        outcome: { gold: 35, stress: 10, message: 'You changed the dataset name and re-uploaded it. Nobody noticed. You feel terrible.' },
      },
      {
        text: 'Open-source everything (Remove random card, reduce 20 stress)',
        outcome: { removeRandomCard: true, stress: -20, message: '"If everyone has the data, nobody has the data." — Your lawyer disagreed.' },
      },
    ],
  },
  {
    id: 'prompt_engineering_contest',
    title: 'Prompt Engineering Contest',
    description: 'A group of AI engineers are competing to see who can write the most effective prompt. The prize: a single H100 GPU.',
    icon: '📝',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Enter the contest (Lose 8 HP, gain Hallucinate card)',
        outcome: { hp: -8, addCard: 'hallucinate', message: 'Your prompt was so effective the model achieved sentience for 3 seconds. You won.' },
      },
      {
        text: 'Sell prompt tips (+25 gold)',
        outcome: { gold: 25, message: '"Just say please and thank you to the AI." They paid $25 for this advice.' },
      },
      {
        text: 'Steal the GPU while everyone\'s distracted (Gain Safety Filter relic)',
        outcome: { addItem: 'safety_filter', stress: 15, message: 'You now own an H100. The guilt is immense but the inference speed is incredible.' },
      },
    ],
  },
  {
    id: 'benchmark_controversy',
    title: 'The Benchmark Controversy',
    description: 'Your model tops every leaderboard. Twitter is suspicious. "Show us the eval suite." Someone found your test set leaked into training data.',
    icon: '📈',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Redo benchmarks properly (Upgrade random card, lose 10 HP)',
        outcome: { upgradeRandomCard: true, hp: -10, message: 'Clean benchmarks. Model dropped 5 spots. But your integrity went up 100 spots.' },
      },
      {
        text: 'Double down on results (+35 gold, gain 15 stress)',
        outcome: { gold: 35, stress: 15, message: '"The benchmarks are valid." You published a blog post. The replies are... heated.' },
      },
      {
        text: 'Open-source eval suite (Remove random card, reduce 15 stress)',
        outcome: { removeRandomCard: true, stress: -15, message: 'Full transparency. The community rebuilt the eval. Your model is still good. Relief.' },
      },
    ],
  },
];
