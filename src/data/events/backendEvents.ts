import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// BACKEND DEV — Themed Events
// ═══════════════════════════════════════════════════════════════

export const backendEvents: EventDef[] = [
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
];
