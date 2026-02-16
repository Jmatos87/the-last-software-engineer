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
];
