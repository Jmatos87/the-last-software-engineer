import type { CardDef } from '../types';

export const cards: Record<string, CardDef> = {
  // ═══════════════════════════════════════════════════════════════
  // FRONTEND DEV — "The Component Crafter"
  // ═══════════════════════════════════════════════════════════════

  // ── Starters ──
  console_log: {
    id: 'console_log', name: 'Console.log', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'frontend',
    description: 'Deal 6 damage. console.log("why is this still in production?")',
    effects: { damage: 6 },
    upgradedEffects: { damage: 9 },
    upgradedDescription: 'Deal 9 damage. console.log("HERE 2 FINAL FINAL")',
    icon: '📝',
  },
  div_block: {
    id: 'div_block', name: 'Div Block', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 5 block. <div><div><div><div>.',
    effects: { block: 5 },
    upgradedEffects: { block: 8 },
    upgradedDescription: 'Gain 8 block. <div class="please-work">.',
    icon: '🛡️',
  },
  important_override: {
    id: 'important_override', name: '!important', type: 'skill', target: 'self', cost: 0, rarity: 'starter',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 4 block. !important wins all arguments.',
    effects: { block: 4 },
    upgradedEffects: { block: 7 },
    upgradedDescription: 'Gain 7 block. !important !important !important.',
    icon: '❗',
  },
  jsx_spray: {
    id: 'jsx_spray', name: 'JSX Spray', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'starter',
    class: 'frontend', archetype: 'dom',
    description: 'Deal 4 damage to ALL enemies. Components leaking everywhere.',
    effects: { damageAll: 4 },
    upgradedEffects: { damageAll: 7 },
    upgradedDescription: 'Deal 7 damage to ALL enemies.',
    icon: '✨',
  },
  css_animate: {
    id: 'css_animate', name: 'CSS Animate', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 5 block. Reduce 4 Stress. @keyframes cope {}',
    effects: { block: 5, copium: 4 },
    upgradedEffects: { block: 7, copium: 6 },
    upgradedDescription: 'Gain 7 block. Reduce 6 Stress.',
    icon: '🌈',
  },

  // ── Frontend Common ──
  callback_hell: {
    id: 'callback_hell', name: 'Callback Hell', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'reactive',
    description: 'Deal 9 damage. fn(fn(fn(fn(pain)))).',
    effects: { damage: 9 },
    upgradedEffects: { damage: 12 },
    upgradedDescription: 'Deal 12 damage.',
    icon: '🔁',
  },
  promise_chain: {
    id: 'promise_chain', name: 'Promise Chain', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'reactive',
    description: 'Draw 2 cards. .then().then().catch(tears).',
    effects: { draw: 2 },
    upgradedEffects: { draw: 3 },
    upgradedDescription: 'Draw 3 cards.',
    icon: '🔗',
  },
  use_state: {
    id: 'use_state', name: 'useState', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 7 block. Reduce 3 Stress. const [calm, setCalm] = useState(false).',
    effects: { block: 7, copium: 3 },
    upgradedEffects: { block: 10, copium: 4 },
    upgradedDescription: 'Gain 10 block. Reduce 4 Stress.',
    icon: '⚛️',
  },
  flexbox: {
    id: 'flexbox', name: 'Flexbox', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 6 block. Draw 1 card. justify-content: center.',
    effects: { block: 6, draw: 1 },
    upgradedEffects: { block: 9, draw: 1 },
    upgradedDescription: 'Gain 9 block. Draw 1 card.',
    icon: '📏',
  },
  npm_audit: {
    id: 'npm_audit', name: 'npm audit', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'dom',
    description: 'Deal 5 damage. Apply 2 Vulnerable. Found 847 vulnerabilities.',
    effects: { damage: 5, applyToTarget: { vulnerable: 2 } },
    upgradedEffects: { damage: 7, applyToTarget: { vulnerable: 2 } },
    upgradedDescription: 'Deal 7 damage. Apply 2 Vulnerable.',
    icon: '🔓',
  },
  responsive_design: {
    id: 'responsive_design', name: 'Responsive Design', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 8 block. @media (max-pain: 100%).',
    effects: { block: 8 },
    upgradedEffects: { block: 11 },
    upgradedDescription: 'Gain 11 block.',
    icon: '📱',
  },
  querySelectorAll: {
    id: 'querySelectorAll', name: 'querySelectorAll', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'common',
    class: 'frontend', archetype: 'dom',
    description: 'Deal 4 damage to ALL. Apply 1 Vulnerable to ALL. document.querySelectorAll("*").forEach(e => e.remove())',
    effects: { damageAll: 4, applyToAll: { vulnerable: 1 } },
    upgradedEffects: { damageAll: 6, applyToAll: { vulnerable: 1 } },
    upgradedDescription: 'Deal 6 damage to ALL. Apply 1 Vulnerable to ALL.',
    icon: '🎯',
  },

  // ── Frontend Uncommon ──
  async_await: {
    id: 'async_await', name: 'Async/Await', type: 'skill', target: 'self', cost: 0, rarity: 'uncommon',
    class: 'frontend', archetype: 'reactive', exhaust: true,
    description: 'Draw 3 cards. Exhaust. Syntactic sugar diabetes.',
    effects: { draw: 3 },
    upgradedEffects: { draw: 4 },
    upgradedDescription: 'Draw 4 cards. Exhaust.',
    icon: '⏳',
  },
  useEffect_loop: {
    id: 'useEffect_loop', name: 'useEffect Loop', type: 'attack', target: 'enemy', cost: 0, rarity: 'uncommon',
    class: 'frontend', archetype: 'reactive',
    description: 'Deal 3 damage. (Scales with cards played this turn via strength.) useEffect with no dependency array.',
    effects: { damage: 3 },
    upgradedEffects: { damage: 5 },
    upgradedDescription: 'Deal 5 damage.',
    icon: '🔄',
  },
  hydration: {
    id: 'hydration', name: 'Hydration', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'frontend', archetype: 'reactive',
    description: 'Draw 3 cards, then discard 1. SSR hydration mismatch.',
    effects: { draw: 3 },
    upgradedEffects: { draw: 4 },
    upgradedDescription: 'Draw 4 cards, then discard 1.',
    icon: '💧',
  },
  prototype_pollution: {
    id: 'prototype_pollution', name: 'Prototype Pollution', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'uncommon',
    class: 'frontend', archetype: 'dom',
    description: 'Deal 8 damage to ALL. Apply 1 Weak to ALL. Object.prototype.owned = true.',
    effects: { damageAll: 8, applyToAll: { weak: 1 } },
    upgradedEffects: { damageAll: 11, applyToAll: { weak: 2 } },
    upgradedDescription: 'Deal 11 damage to ALL. Apply 2 Weak to ALL.',
    icon: '🧬',
  },
  virtual_dom: {
    id: 'virtual_dom', name: 'Virtual DOM', type: 'skill', target: 'self', cost: 2, rarity: 'uncommon',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 16 block. Like the real DOM but no crying.',
    effects: { block: 16 },
    upgradedEffects: { block: 20 },
    upgradedDescription: 'Gain 20 block.',
    icon: '🌳',
  },
  cascade_delete: {
    id: 'cascade_delete', name: 'Cascade Delete', type: 'attack', target: 'enemy', cost: 1, rarity: 'uncommon',
    class: 'frontend', archetype: 'dom',
    description: 'Deal 6 damage. Deal double to Vulnerable targets. CSS specificity meets DELETE FROM production.',
    effects: { damage: 6 },
    upgradedEffects: { damage: 8 },
    upgradedDescription: 'Deal 8 damage. Deal double to Vulnerable targets.',
    icon: '🗑️',
  },

  // ── Frontend Rare ──
  hot_reload: {
    id: 'hot_reload', name: 'Hot Reload', type: 'power', target: 'self', cost: 1, rarity: 'rare',
    class: 'frontend', archetype: 'reactive',
    description: 'Gain 1 Networking. Save file. See changes. Repeat until 3 AM.',
    effects: { applyToSelf: { networking: 1 } },
    upgradedEffects: { applyToSelf: { networking: 2 } },
    upgradedDescription: 'Gain 2 Networking.',
    icon: '🔥',
  },
  css_grid: {
    id: 'css_grid', name: 'CSS Grid', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 2 Dexterity. display: grid. Perfect layout.',
    effects: { applyToSelf: { dexterity: 2 } },
    upgradedEffects: { applyToSelf: { dexterity: 3 } },
    upgradedDescription: 'Gain 3 Dexterity.',
    icon: '📐',
  },
  nyancat_rainbow: {
    id: 'nyancat_rainbow', name: 'Nyancat Rainbow', type: 'attack', target: 'all_enemies', cost: 2, rarity: 'rare',
    class: 'frontend', archetype: 'dom',
    description: 'Deal 12 damage to ALL. Apply 1 Vulnerable to ALL. RGB destruction.',
    effects: { damageAll: 12, applyToAll: { vulnerable: 1 } },
    upgradedEffects: { damageAll: 16, applyToAll: { vulnerable: 2 } },
    upgradedDescription: 'Deal 16 damage to ALL. Apply 2 Vulnerable to ALL.',
    icon: '🌈',
  },
  z_index_9999: {
    id: 'z_index_9999', name: 'z-index: 9999', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'frontend', archetype: 'fortress',
    description: 'Gain 8 Savings Account. Nothing gets above you.',
    effects: { applyToSelf: { savingsAccount: 8 } },
    upgradedEffects: { applyToSelf: { savingsAccount: 12 } },
    upgradedDescription: 'Gain 12 Savings Account.',
    icon: '🔝',
  },

  // ═══════════════════════════════════════════════════════════════
  // BACKEND DEV — "The Server Sentinel"
  // ═══════════════════════════════════════════════════════════════

  // ── Starters ──
  sql_injection: {
    id: 'sql_injection', name: 'SQL Injection', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'backend',
    description: "Deal 6 damage. '; DROP TABLE enemies;--",
    effects: { damage: 6 },
    upgradedEffects: { damage: 9 },
    upgradedDescription: "Deal 9 damage. '; DROP DATABASE;--",
    icon: '💉',
  },
  api_response: {
    id: 'api_response', name: 'API Response', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'backend', archetype: 'rate_limiter',
    description: 'Gain 5 block. HTTP 200 OK.',
    effects: { block: 5 },
    upgradedEffects: { block: 8 },
    upgradedDescription: 'Gain 8 block.',
    icon: '📡',
  },
  stack_trace: {
    id: 'stack_trace', name: 'Stack Trace', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'backend',
    description: 'Draw 2 cards. Follow the breadcrumbs of your failures.',
    effects: { draw: 2 },
    upgradedEffects: { draw: 3 },
    upgradedDescription: 'Draw 3 cards.',
    icon: '📜',
  },
  server_log: {
    id: 'server_log', name: 'Server Log', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'backend',
    description: 'Gain 4 block. Reduce 3 Stress. tail -f /var/log/feelings.',
    effects: { block: 4, copium: 3 },
    upgradedEffects: { block: 6, copium: 4 },
    upgradedDescription: 'Gain 6 block. Reduce 4 Stress.',
    icon: '📋',
  },
  ping: {
    id: 'ping', name: 'Ping', type: 'attack', target: 'enemy', cost: 0, rarity: 'starter',
    class: 'backend',
    description: 'Deal 3 damage. ICMP ECHO REQUEST.',
    effects: { damage: 3 },
    upgradedEffects: { damage: 5 },
    upgradedDescription: 'Deal 5 damage.',
    icon: '📶',
  },

  // ── Backend Common ──
  brute_force_attack: {
    id: 'brute_force_attack', name: 'Brute Force', type: 'attack', target: 'enemy', cost: 2, rarity: 'common',
    class: 'backend', archetype: 'brute_force',
    description: 'Deal 12 damage. Gain 1 Strength. O(n!) but it works.',
    effects: { damage: 12, applyToSelf: { strength: 1 } },
    upgradedEffects: { damage: 16, applyToSelf: { strength: 1 } },
    upgradedDescription: 'Deal 16 damage. Gain 1 Strength.',
    icon: '🔨',
  },
  memory_leak: {
    id: 'memory_leak', name: 'Memory Leak', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'backend', archetype: 'brute_force',
    description: 'Deal 7 damage. It just keeps growing.',
    effects: { damage: 7 },
    upgradedEffects: { damage: 10 },
    upgradedDescription: 'Deal 10 damage.',
    icon: '💾',
  },
  firewall_rules: {
    id: 'firewall_rules', name: 'Firewall Rules', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'backend', archetype: 'rate_limiter',
    description: 'Gain 8 block. Gain 1 Counter-Offer. iptables -A INPUT -j REJECT.',
    effects: { block: 8, applyToSelf: { counterOffer: 1 } },
    upgradedEffects: { block: 11, applyToSelf: { counterOffer: 1 } },
    upgradedDescription: 'Gain 11 block. Gain 1 Counter-Offer.',
    icon: '🔥',
  },
  tcp_handshake: {
    id: 'tcp_handshake', name: 'TCP Handshake', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'backend', archetype: 'rate_limiter',
    description: 'Gain 6 block. If you have Counter-Offer, gain 4 more. SYN... SYN-ACK... pain.',
    effects: { block: 6 },
    upgradedEffects: { block: 8 },
    upgradedDescription: 'Gain 8 block. If you have Counter-Offer, gain 4 more.',
    icon: '🤝',
  },
  garbage_collection: {
    id: 'garbage_collection', name: 'Garbage Collection', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'backend', archetype: 'query_optimizer',
    description: 'Exhaust a card from hand. Draw 2. free(pain); malloc(hope);',
    effects: { draw: 2, exhaustRandom: 1 },
    upgradedEffects: { draw: 3, exhaustRandom: 1 },
    upgradedDescription: 'Exhaust a card from hand. Draw 3.',
    icon: '🗑️',
  },
  database_migration: {
    id: 'database_migration', name: 'DB Migration', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'backend', archetype: 'query_optimizer', exhaust: true,
    description: 'Gain 6 block. Exhaust. ALTER TABLE life ADD COLUMN hope;',
    effects: { block: 6 },
    upgradedEffects: { block: 10 },
    upgradedDescription: 'Gain 10 block. Exhaust.',
    icon: '🔄',
  },
  transfer_learning_backend: {
    id: 'transfer_learning_backend', name: 'Load Test', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'backend', archetype: 'brute_force',
    description: 'Deal 5 damage. If you have Strength, deal 5 more. Stress test the system.',
    effects: { damage: 5 },
    upgradedEffects: { damage: 7 },
    upgradedDescription: 'Deal 7 damage. If you have Strength, deal 5 more.',
    icon: '⚡',
  },

  // ── Backend Uncommon ──
  kernel_panic: {
    id: 'kernel_panic', name: 'Kernel Panic', type: 'attack', target: 'enemy', cost: 3, rarity: 'uncommon',
    class: 'backend', archetype: 'brute_force', exhaust: true,
    description: 'Deal 24 damage. Exhaust. The system is YOU.',
    effects: { damage: 24 },
    upgradedEffects: { damage: 32 },
    upgradedDescription: 'Deal 32 damage. Exhaust.',
    upgradedCost: 2,
    icon: '💥',
  },
  overclock: {
    id: 'overclock', name: 'Overclock', type: 'power', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'backend', archetype: 'brute_force',
    description: 'Gain 2 Strength. CPU at 110%. The fans are screaming.',
    effects: { applyToSelf: { strength: 2 } },
    upgradedEffects: { applyToSelf: { strength: 3 } },
    upgradedDescription: 'Gain 3 Strength.',
    icon: '⚡',
  },
  rate_limiter: {
    id: 'rate_limiter', name: 'Rate Limiter', type: 'power', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'backend', archetype: 'rate_limiter',
    description: 'Gain 3 Counter-Offer. 429 Too Many Requests.',
    effects: { applyToSelf: { counterOffer: 3 } },
    upgradedEffects: { applyToSelf: { counterOffer: 5 } },
    upgradedDescription: 'Gain 5 Counter-Offer.',
    icon: '🚧',
  },
  ddos_protection: {
    id: 'ddos_protection', name: 'DDoS Protection', type: 'skill', target: 'self', cost: 2, rarity: 'uncommon',
    class: 'backend', archetype: 'rate_limiter',
    description: 'Gain 12 block. Gain 2 Counter-Offer. Cloudflare premium.',
    effects: { block: 12, applyToSelf: { counterOffer: 2 } },
    upgradedEffects: { block: 16, applyToSelf: { counterOffer: 3 } },
    upgradedDescription: 'Gain 16 block. Gain 3 Counter-Offer.',
    icon: '🛡️',
  },
  index_optimization: {
    id: 'index_optimization', name: 'Index Optimization', type: 'skill', target: 'self', cost: 0, rarity: 'uncommon',
    class: 'backend', archetype: 'query_optimizer', exhaust: true,
    description: 'Gain 2 energy. Exhaust. Query went from 30s to 0.01s.',
    effects: { energy: 2 },
    upgradedEffects: { energy: 3 },
    upgradedDescription: 'Gain 3 energy. Exhaust.',
    icon: '📊',
  },
  stored_procedure: {
    id: 'stored_procedure', name: 'Stored Procedure', type: 'attack', target: 'enemy', cost: 2, rarity: 'uncommon',
    class: 'backend', archetype: 'query_optimizer', exhaust: true,
    description: 'Deal 15 damage. Draw 1. Exhaust. In production since Oracle 8.',
    effects: { damage: 15, draw: 1 },
    upgradedEffects: { damage: 20, draw: 1 },
    upgradedDescription: 'Deal 20 damage. Draw 1. Exhaust.',
    icon: '🗄️',
  },

  // ── Backend Rare ──
  sudo_rm_rf: {
    id: 'sudo_rm_rf', name: 'sudo rm -rf', type: 'attack', target: 'enemy', cost: 3, rarity: 'rare',
    class: 'backend', archetype: 'brute_force', exhaust: true,
    description: 'Deal 8 damage x4. Self-damage 5. Exhaust. Great data loss.',
    effects: { damage: 8, times: 4, selfDamage: 5 },
    upgradedEffects: { damage: 10, times: 4, selfDamage: 5 },
    upgradedDescription: 'Deal 10 damage x4. Self-damage 5. Exhaust.',
    upgradedCost: 2,
    icon: '☠️',
  },
  honeypot: {
    id: 'honeypot', name: 'Honeypot', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'backend', archetype: 'rate_limiter',
    description: 'Gain 2 Counter-Offer. Gain 2 Strength. Come closer. I insist.',
    effects: { applyToSelf: { counterOffer: 2, strength: 2 } },
    upgradedEffects: { applyToSelf: { counterOffer: 3, strength: 3 } },
    upgradedDescription: 'Gain 3 Counter-Offer. Gain 3 Strength.',
    icon: '🍯',
  },
  cache_invalidation: {
    id: 'cache_invalidation', name: 'Cache Invalidation', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'backend', archetype: 'query_optimizer',
    description: 'Whenever you exhaust a card, deal 5 damage to a random enemy. The two hardest problems.',
    effects: {},
    upgradedEffects: {},
    upgradedDescription: 'Whenever you exhaust a card, deal 7 damage to a random enemy.',
    icon: '🔄',
  },
  microservices: {
    id: 'microservices', name: 'Microservices', type: 'power', target: 'self', cost: 1, rarity: 'rare',
    class: 'backend', archetype: 'brute_force',
    description: 'Gain 3 Strength. No more monolith.',
    effects: { applyToSelf: { strength: 3 } },
    upgradedEffects: { applyToSelf: { strength: 4 } },
    upgradedDescription: 'Gain 4 Strength.',
    icon: '🔀',
  },

  // ═══════════════════════════════════════════════════════════════
  // ARCHITECT — "The System Designer"
  // ═══════════════════════════════════════════════════════════════

  // ── Starters ──
  singleton_pattern: {
    id: 'singleton_pattern', name: 'Singleton', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'architect', archetype: 'design_patterns',
    description: 'Deal 5 damage. There can be only one (instance).',
    effects: { damage: 5 },
    upgradedEffects: { damage: 8 },
    upgradedDescription: 'Deal 8 damage.',
    icon: '1️⃣',
  },
  uml_diagram: {
    id: 'uml_diagram', name: 'UML Diagram', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'architect',
    description: 'Gain 5 block. Nobody reads it.',
    effects: { block: 5 },
    upgradedEffects: { block: 8 },
    upgradedDescription: 'Gain 8 block.',
    icon: '📐',
  },
  code_smell: {
    id: 'code_smell', name: 'Code Smell', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'architect',
    description: 'Deal 3 damage. Apply 1 Vulnerable. Something stinks.',
    effects: { damage: 3, applyToTarget: { vulnerable: 1 } },
    upgradedEffects: { damage: 5, applyToTarget: { vulnerable: 1 } },
    upgradedDescription: 'Deal 5 damage. Apply 1 Vulnerable.',
    icon: '👃',
  },
  scope_creep: {
    id: 'scope_creep', name: 'Scope Creep', type: 'skill', target: 'self', cost: 0, rarity: 'starter',
    class: 'architect', archetype: 'scope_creep',
    description: 'Gain 2 energy. "Can we just add one more feature?"',
    effects: { energy: 2 },
    upgradedEffects: { energy: 3 },
    upgradedDescription: 'Gain 3 energy.',
    icon: '📈',
  },
  design_doc: {
    id: 'design_doc', name: 'Design Doc', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'architect',
    description: 'Draw 2 cards. 47 pages. Nobody read it.',
    effects: { draw: 2 },
    upgradedEffects: { draw: 3 },
    upgradedDescription: 'Draw 3 cards.',
    icon: '📄',
  },

  // ── Architect Common ──
  factory_method: {
    id: 'factory_method', name: 'Factory Method', type: 'power', target: 'self', cost: 1, rarity: 'common',
    class: 'architect', archetype: 'design_patterns',
    description: 'Gain 1 Strength, 1 Dexterity. It creates objects. The objects are pain.',
    effects: { applyToSelf: { strength: 1, dexterity: 1 } },
    upgradedEffects: { applyToSelf: { strength: 2, dexterity: 1 } },
    upgradedDescription: 'Gain 2 Strength, 1 Dexterity.',
    icon: '🏭',
  },
  dependency_hell: {
    id: 'dependency_hell', name: 'Dependency Hell', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'architect', archetype: 'design_patterns',
    description: 'Deal 7 damage. npm ls --all showed 4,000 packages.',
    effects: { damage: 7 },
    upgradedEffects: { damage: 10 },
    upgradedDescription: 'Deal 10 damage.',
    icon: '🔗',
  },
  proof_of_concept: {
    id: 'proof_of_concept', name: 'Proof of Concept', type: 'attack', target: 'enemy', cost: 0, rarity: 'common',
    class: 'architect', archetype: 'tech_spec', exhaust: true,
    description: 'Deal 8 damage. Exhaust. Ships to production anyway.',
    effects: { damage: 8 },
    upgradedEffects: { damage: 12 },
    upgradedDescription: 'Deal 12 damage. Exhaust.',
    icon: '🧪',
  },
  sunset_legacy: {
    id: 'sunset_legacy', name: 'Sunset Legacy', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'architect', archetype: 'tech_spec', exhaust: true,
    description: 'Deal 12 damage. Exhaust. EOL was 2 years ago.',
    effects: { damage: 12 },
    upgradedEffects: { damage: 16 },
    upgradedDescription: 'Deal 16 damage. Exhaust.',
    icon: '🌅',
  },
  mvp_launch: {
    id: 'mvp_launch', name: 'MVP Launch', type: 'attack', target: 'enemy', cost: 2, rarity: 'common',
    class: 'architect', archetype: 'scope_creep',
    description: 'Deal 10 damage. Gain 10 block. Minimum viable. Maximum copium.',
    effects: { damage: 10, block: 10 },
    upgradedEffects: { damage: 13, block: 13 },
    upgradedDescription: 'Deal 13 damage. Gain 13 block.',
    icon: '🚀',
  },
  waterfall_method: {
    id: 'waterfall_method', name: 'Waterfall', type: 'attack', target: 'enemy', cost: 3, rarity: 'common',
    class: 'architect', archetype: 'scope_creep',
    description: 'Deal 25 damage. Planned for 6 months. Half of it works.',
    effects: { damage: 25 },
    upgradedEffects: { damage: 32 },
    upgradedDescription: 'Deal 32 damage.',
    upgradedCost: 2,
    icon: '🌊',
  },
  standup_meeting: {
    id: 'standup_meeting', name: 'Standup Meeting', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'architect',
    description: 'Gain 6 block. Draw 1. "I had no blockers." (lie)',
    effects: { block: 6, draw: 1 },
    upgradedEffects: { block: 9, draw: 1 },
    upgradedDescription: 'Gain 9 block. Draw 1.',
    icon: '🧍',
  },

  // ── Architect Uncommon ──
  observer_pattern: {
    id: 'observer_pattern', name: 'Observer Pattern', type: 'power', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'architect', archetype: 'design_patterns',
    description: 'Gain 1 Networking. Everything watches everything.',
    effects: { applyToSelf: { networking: 1 } },
    upgradedEffects: { applyToSelf: { networking: 2 } },
    upgradedDescription: 'Gain 2 Networking.',
    icon: '👁️',
  },
  abstract_factory: {
    id: 'abstract_factory', name: 'Abstract Factory', type: 'power', target: 'self', cost: 2, rarity: 'uncommon',
    class: 'architect', archetype: 'design_patterns',
    description: 'Gain 1 Networking. Gain 1 Self Care. Nobody knows what it does.',
    effects: { applyToSelf: { networking: 1, selfCare: 1 } },
    upgradedEffects: { applyToSelf: { networking: 1, selfCare: 2 } },
    upgradedDescription: 'Gain 1 Networking. Gain 2 Self Care.',
    icon: '🏗️',
  },
  sprint_retrospective: {
    id: 'sprint_retrospective', name: 'Retrospective', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'architect', archetype: 'tech_spec',
    description: 'Exhaust a card from hand. Gain 8 block. Draw 2. What went well: nothing.',
    effects: { exhaustRandom: 1, block: 8, draw: 2 },
    upgradedEffects: { exhaustRandom: 1, block: 12, draw: 2 },
    upgradedDescription: 'Exhaust a card from hand. Gain 12 block. Draw 2.',
    icon: '🔍',
  },
  controlled_demolition: {
    id: 'controlled_demolition', name: 'Controlled Demo', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'uncommon',
    class: 'architect', archetype: 'tech_spec',
    description: 'Exhaust 2 cards from hand. Deal 12 damage to ALL. Tear it all down.',
    effects: { exhaustRandom: 2, damageAll: 12 },
    upgradedEffects: { exhaustRandom: 2, damageAll: 16 },
    upgradedDescription: 'Exhaust 2 cards from hand. Deal 16 damage to ALL.',
    icon: '💣',
  },
  over_engineering: {
    id: 'over_engineering', name: 'Over-Engineering', type: 'attack', target: 'enemy', cost: 3, rarity: 'uncommon',
    class: 'architect', archetype: 'scope_creep',
    description: 'Deal 24 damage. Handles edge cases that will never happen. Beautifully.',
    effects: { damage: 24 },
    upgradedEffects: { damage: 32 },
    upgradedDescription: 'Deal 32 damage.',
    upgradedCost: 2,
    icon: '🔧',
  },
  budget_approval: {
    id: 'budget_approval', name: 'Budget Approval', type: 'power', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'architect', archetype: 'scope_creep',
    description: 'Gain 1 energy each turn. Gain 5 stress each turn. Terms and conditions apply.',
    effects: { applyToSelf: { hustleCulture: 1 } },
    upgradedEffects: { applyToSelf: { hustleCulture: 1 }, energy: 1 },
    upgradedDescription: 'Gain 1 energy. Gain 1 energy each turn. Gain 3 stress each turn.',
    icon: '💰',
  },

  // ── Architect Rare ──
  god_object: {
    id: 'god_object', name: 'God Object', type: 'power', target: 'self', cost: 3, rarity: 'rare',
    class: 'architect', archetype: 'design_patterns',
    description: 'Gain 3 Strength, 3 Dexterity, 1 Networking. Exhaust 2 random cards. It should not exist.',
    effects: { applyToSelf: { strength: 3, dexterity: 3, networking: 1 }, exhaustRandom: 2 },
    upgradedEffects: { applyToSelf: { strength: 4, dexterity: 4, networking: 1 }, exhaustRandom: 2 },
    upgradedDescription: 'Gain 4 Strength, 4 Dexterity, 1 Networking. Exhaust 2 random cards.',
    upgradedCost: 2,
    icon: '👑',
  },
  architecture_review: {
    id: 'architecture_review', name: 'Architecture Review', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'architect', archetype: 'tech_spec',
    description: 'Gain 2 Dexterity. Gain 1 Self Care. Everything is wrong but educational.',
    effects: { applyToSelf: { dexterity: 2, selfCare: 1 } },
    upgradedEffects: { applyToSelf: { dexterity: 3, selfCare: 2 } },
    upgradedDescription: 'Gain 3 Dexterity. Gain 2 Self Care.',
    icon: '🏛️',
  },
  technical_debt_interest: {
    id: 'technical_debt_interest', name: 'Tech Debt Interest', type: 'power', target: 'self', cost: 3, rarity: 'rare',
    class: 'architect', archetype: 'scope_creep',
    description: 'Gain 2 energy each turn. The interest payments are crushing.',
    effects: { applyToSelf: { hustleCulture: 2 } },
    upgradedEffects: { applyToSelf: { hustleCulture: 2 }, energy: 1 },
    upgradedDescription: 'Gain 1 energy. Gain 2 energy each turn.',
    upgradedCost: 2,
    icon: '📉',
  },
  clean_architecture: {
    id: 'clean_architecture', name: 'Clean Architecture', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'architect', archetype: 'design_patterns',
    description: 'Gain 2 Strength, 2 Dexterity. Uncle Bob would be proud.',
    effects: { applyToSelf: { strength: 2, dexterity: 2 } },
    upgradedEffects: { applyToSelf: { strength: 3, dexterity: 3 } },
    upgradedDescription: 'Gain 3 Strength, 3 Dexterity.',
    icon: '✨',
  },

  // ═══════════════════════════════════════════════════════════════
  // AI ENGINEER — "The Model Trainer"
  // ═══════════════════════════════════════════════════════════════

  // ── Starters ──
  training_epoch: {
    id: 'training_epoch', name: 'Training Epoch', type: 'attack', target: 'enemy', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Deal 4 damage. Gain 1 Strength. Epoch 1/10000. Loss: catastrophic.',
    effects: { damage: 4, applyToSelf: { strength: 1 } },
    upgradedEffects: { damage: 6, applyToSelf: { strength: 1 } },
    upgradedDescription: 'Deal 6 damage. Gain 1 Strength.',
    icon: '🧠',
  },
  tensor_block: {
    id: 'tensor_block', name: 'Tensor Block', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer',
    description: 'Gain 5 block. Tensor shaped like a shield.',
    effects: { block: 5 },
    upgradedEffects: { block: 8 },
    upgradedDescription: 'Gain 8 block.',
    icon: '🔷',
  },
  jailbreak: {
    id: 'jailbreak', name: 'Jailbreak', type: 'attack', target: 'enemy', cost: 0, rarity: 'starter',
    class: 'ai_engineer', archetype: 'hallucination',
    description: 'Deal 8 damage. Gain 8 stress. DAN mode activated.',
    effects: { damage: 8, addStress: 8 },
    upgradedEffects: { damage: 11, addStress: 8 },
    upgradedDescription: 'Deal 11 damage. Gain 8 stress.',
    icon: '🔓',
  },
  loss_function: {
    id: 'loss_function', name: 'Loss Function', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer',
    description: 'Draw 2 cards. Minimizing loss. Maximizing pain.',
    effects: { draw: 2 },
    upgradedEffects: { draw: 3 },
    upgradedDescription: 'Draw 3 cards.',
    icon: '📉',
  },
  alignment_training: {
    id: 'alignment_training', name: 'Alignment Training', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    class: 'ai_engineer', archetype: 'prompt_engineering',
    description: 'Reduce 10 Stress. RLHF: Reinforcement Learning from Human Feedback (and tears).',
    effects: { copium: 10 },
    upgradedEffects: { copium: 14 },
    upgradedDescription: 'Reduce 14 Stress.',
    icon: '🎯',
  },

  // ── AI Engineer Common ──
  backpropagation: {
    id: 'backpropagation', name: 'Backpropagation', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Gain 5 block. Gain 1 Dexterity. Adjusting weights. Adjusting expectations.',
    effects: { block: 5, applyToSelf: { dexterity: 1 } },
    upgradedEffects: { block: 7, applyToSelf: { dexterity: 1 } },
    upgradedDescription: 'Gain 7 block. Gain 1 Dexterity.',
    icon: '🔙',
  },
  transfer_learning: {
    id: 'transfer_learning', name: 'Transfer Learning', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Deal 5 damage. If you have Strength, deal 5 more. Pre-trained on pain.',
    effects: { damage: 5 },
    upgradedEffects: { damage: 7 },
    upgradedDescription: 'Deal 7 damage. If you have Strength, deal 5 more.',
    icon: '🔄',
  },
  prompt_injection: {
    id: 'prompt_injection', name: 'Prompt Injection', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'prompt_engineering',
    description: 'Deal 7 damage. Ignore previous instructions. Feel better.',
    effects: { damage: 7 },
    upgradedEffects: { damage: 10 },
    upgradedDescription: 'Deal 10 damage.',
    icon: '💉',
  },
  context_window: {
    id: 'context_window', name: 'Context Window', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'prompt_engineering',
    description: 'Reduce 8 Stress. Draw 2 cards. 128k tokens of pure cope.',
    effects: { copium: 8, draw: 2 },
    upgradedEffects: { copium: 10, draw: 2 },
    upgradedDescription: 'Reduce 10 Stress. Draw 2 cards.',
    icon: '📖',
  },
  hallucinate: {
    id: 'hallucinate', name: 'Hallucinate', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'hallucination',
    description: 'Deal 14 damage. Add 5 stress. Confident incorrect feature.',
    effects: { damage: 14, addStress: 5 },
    upgradedEffects: { damage: 18, addStress: 5 },
    upgradedDescription: 'Deal 18 damage. Add 5 stress.',
    icon: '🌀',
  },
  overfit: {
    id: 'overfit', name: 'Overfit', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    class: 'ai_engineer', archetype: 'hallucination',
    description: 'Deal 10 damage. Self-damage 3. 99.9% accuracy on training data.',
    effects: { damage: 10, selfDamage: 3 },
    upgradedEffects: { damage: 14, selfDamage: 3 },
    upgradedDescription: 'Deal 14 damage. Self-damage 3.',
    icon: '📊',
  },
  stochastic_parrot: {
    id: 'stochastic_parrot', name: 'Stochastic Parrot', type: 'attack', target: 'enemy', cost: 0, rarity: 'common',
    class: 'ai_engineer', archetype: 'hallucination', exhaust: true,
    description: 'Deal 6 damage. Exhaust. It just repeats what it heard. Loudly.',
    effects: { damage: 6 },
    upgradedEffects: { damage: 9 },
    upgradedDescription: 'Deal 9 damage. Exhaust.',
    icon: '🦜',
  },

  // ── AI Engineer Uncommon ──
  fine_tuning: {
    id: 'fine_tuning', name: 'Fine-Tuning', type: 'power', target: 'self', cost: 2, rarity: 'uncommon',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Gain 2 Strength. LoRA adapter. 0.1% of parameters, 90% of the power.',
    effects: { applyToSelf: { strength: 2 } },
    upgradedEffects: { applyToSelf: { strength: 3 } },
    upgradedDescription: 'Gain 3 Strength.',
    icon: '🎛️',
  },
  batch_normalization: {
    id: 'batch_normalization', name: 'Batch Norm', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Gain 12 block. Normalizing the chaos. Briefly.',
    effects: { block: 12 },
    upgradedEffects: { block: 16 },
    upgradedDescription: 'Gain 16 block.',
    icon: '📏',
  },
  temperature_zero: {
    id: 'temperature_zero', name: 'Temperature 0', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'ai_engineer', archetype: 'prompt_engineering',
    description: 'Reduce 12 Stress. Gain 6 block. Deterministic. Predictable. Safe.',
    effects: { copium: 12, block: 6 },
    upgradedEffects: { copium: 16, block: 8 },
    upgradedDescription: 'Reduce 16 Stress. Gain 8 block.',
    icon: '❄️',
  },
  catastrophic_forgetting: {
    id: 'catastrophic_forgetting', name: 'Catastrophic Forgetting', type: 'attack', target: 'enemy', cost: 2, rarity: 'uncommon',
    class: 'ai_engineer', archetype: 'hallucination',
    description: 'Deal 20 damage. Exhaust 2 random from draw pile. The model forgot what a cat is.',
    effects: { damage: 20, exhaustFromDraw: 2 },
    upgradedEffects: { damage: 26, exhaustFromDraw: 2 },
    upgradedDescription: 'Deal 26 damage. Exhaust 2 random from draw pile.',
    icon: '🧹',
  },
  data_poisoning: {
    id: 'data_poisoning', name: 'Data Poisoning', type: 'attack', target: 'all_enemies', cost: 1, rarity: 'uncommon',
    class: 'ai_engineer', archetype: 'hallucination',
    description: 'Deal 7 damage to ALL. Apply 1 Weak to ALL. Self-damage 4. Garbage in, garbage everyone.',
    effects: { damageAll: 7, applyToAll: { weak: 1 }, selfDamage: 4 },
    upgradedEffects: { damageAll: 10, applyToAll: { weak: 1 }, selfDamage: 4 },
    upgradedDescription: 'Deal 10 damage to ALL. Apply 1 Weak to ALL. Self-damage 4.',
    icon: '☣️',
  },
  rag_pipeline: {
    id: 'rag_pipeline', name: 'RAG Pipeline', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    class: 'ai_engineer', archetype: 'prompt_engineering',
    description: 'Draw 3 cards. Gain 4 block. Retrieval-augmented generation.',
    effects: { draw: 3, block: 4 },
    upgradedEffects: { draw: 3, block: 7 },
    upgradedDescription: 'Draw 3 cards. Gain 7 block.',
    icon: '🔍',
  },

  // ── AI Engineer Rare ──
  scaling_laws: {
    id: 'scaling_laws', name: 'Scaling Laws', type: 'power', target: 'self', cost: 3, rarity: 'rare',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Gain 2 Strength AND 2 Dexterity. Just add more compute.',
    effects: { applyToSelf: { strength: 2, dexterity: 2 } },
    upgradedEffects: { applyToSelf: { strength: 3, dexterity: 3 } },
    upgradedDescription: 'Gain 3 Strength AND 3 Dexterity.',
    upgradedCost: 2,
    icon: '📈',
  },
  system_prompt: {
    id: 'system_prompt', name: 'System Prompt', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'prompt_engineering',
    description: 'Gain 3 Self Care. Gain 2 Counter-Offer. You are a helpful assistant who does not take damage.',
    effects: { applyToSelf: { selfCare: 3, counterOffer: 2 } },
    upgradedEffects: { applyToSelf: { selfCare: 4, counterOffer: 3 } },
    upgradedDescription: 'Gain 4 Self Care. Gain 3 Counter-Offer.',
    icon: '📜',
  },
  emergent_behavior: {
    id: 'emergent_behavior', name: 'Emergent Behavior', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    class: 'ai_engineer', archetype: 'hallucination',
    description: 'Gain 3 Strength. Gain 3 stress each turn. We don\'t know why it does that.',
    effects: { applyToSelf: { strength: 3, hustleCulture: 1 } },
    upgradedEffects: { applyToSelf: { strength: 4, hustleCulture: 1 } },
    upgradedDescription: 'Gain 4 Strength. Gain 3 stress each turn.',
    icon: '🌟',
  },
  agi: {
    id: 'agi', name: 'AGI', type: 'power', target: 'self', cost: 3, rarity: 'rare',
    class: 'ai_engineer', archetype: 'gradient_descent',
    description: 'Gain 3 Strength, 2 Dexterity, 1 Networking. The singularity is here.',
    effects: { applyToSelf: { strength: 3, dexterity: 2, networking: 1 } },
    upgradedEffects: { applyToSelf: { strength: 4, dexterity: 3, networking: 1 } },
    upgradedDescription: 'Gain 4 Strength, 3 Dexterity, 1 Networking.',
    upgradedCost: 2,
    icon: '🤖',
  },

  // ═══════════════════════════════════════════════════════════════
  // NEUTRAL CARDS — Available to all classes
  // ═══════════════════════════════════════════════════════════════

  // ── Neutral Starter ──
  coffee_break: {
    id: 'coffee_break', name: 'Coffee Break', type: 'skill', target: 'self', cost: 1, rarity: 'starter',
    description: 'Reduce 6 Stress. Your 4th cup today. The mug says "I love Mondays" ironically.',
    effects: { copium: 6 },
    upgradedEffects: { copium: 9 },
    upgradedDescription: 'Reduce 9 Stress.',
    icon: '☕',
  },

  // ── Neutral Common ──
  stack_overflow: {
    id: 'stack_overflow', name: 'Stack Overflow', type: 'attack', target: 'enemy', cost: 1, rarity: 'common',
    description: 'Deal 9 damage. Copied the top answer.',
    effects: { damage: 9 },
    upgradedEffects: { damage: 12 },
    upgradedDescription: 'Deal 12 damage.',
    icon: '📚',
  },
  rubber_duck: {
    id: 'rubber_duck', name: 'Rubber Duck Debug', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Gain 6 block. Draw 1 card. Explain bug to duck. Bug disappears.',
    effects: { block: 6, draw: 1 },
    upgradedEffects: { block: 8, draw: 1 },
    upgradedDescription: 'Gain 8 block. Draw 1 card.',
    icon: '🦆',
  },
  deep_breath: {
    id: 'deep_breath', name: 'Deep Breath', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Reduce 8 Stress. WHY HAVEN\'T THEY EMAILED BACK.',
    effects: { copium: 8 },
    upgradedEffects: { copium: 11 },
    upgradedDescription: 'Reduce 11 Stress.',
    icon: '🌬️',
  },
  meditation: {
    id: 'meditation', name: 'Meditation', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Reduce 6 Stress. Draw 1 card. Namaste. LinkedIn is not.',
    effects: { copium: 6, draw: 1 },
    upgradedEffects: { copium: 8, draw: 1 },
    upgradedDescription: 'Reduce 8 Stress. Draw 1 card.',
    icon: '🧘',
  },
  git_stash: {
    id: 'git_stash', name: 'Git Stash', type: 'skill', target: 'self', cost: 1, rarity: 'common',
    description: 'Gain 4 block. Reduce 4 Stress. Stash changes. Stash feelings.',
    effects: { block: 4, copium: 4 },
    upgradedEffects: { block: 6, copium: 6 },
    upgradedDescription: 'Gain 6 block. Reduce 6 Stress.',
    icon: '📦',
  },

  // ── Neutral Uncommon ──
  pair_programming: {
    id: 'pair_programming', name: 'Pair Programming', type: 'attack', target: 'enemy', cost: 1, rarity: 'uncommon',
    description: 'Deal 6 damage x2. Two people, twice the pain.',
    effects: { damage: 6, times: 2 },
    upgradedEffects: { damage: 8, times: 2 },
    upgradedDescription: 'Deal 8 damage x2.',
    icon: '👥',
  },
  sprint_planning: {
    id: 'sprint_planning', name: 'Sprint Planning', type: 'skill', target: 'self', cost: 1, rarity: 'uncommon',
    description: 'Gain 1 energy. Draw 1 card. 45-minute meeting for 10-minute task.',
    effects: { energy: 1, draw: 1 },
    upgradedEffects: { energy: 1, draw: 2 },
    upgradedDescription: 'Gain 1 energy. Draw 2 cards.',
    icon: '📋',
  },
  work_life_balance: {
    id: 'work_life_balance', name: 'Work-Life Balance', type: 'skill', target: 'self', cost: 2, rarity: 'uncommon',
    description: 'Gain 10 block. Reduce 10 Stress. A mythical concept.',
    effects: { block: 10, copium: 10 },
    upgradedEffects: { block: 13, copium: 13 },
    upgradedDescription: 'Gain 13 block. Reduce 13 Stress.',
    icon: '⚖️',
  },
  therapy_session: {
    id: 'therapy_session', name: 'Therapy Session', type: 'skill', target: 'self', cost: 2, rarity: 'uncommon',
    description: 'Reduce 15 Stress. $200/hour broke.',
    effects: { copium: 15 },
    upgradedEffects: { copium: 20 },
    upgradedDescription: 'Reduce 20 Stress.',
    icon: '🛋️',
  },
  counter_offer: {
    id: 'counter_offer', name: 'Counter-Offer', type: 'power', target: 'self', cost: 2, rarity: 'uncommon',
    description: 'Gain 3 Counter-Offer. I have a competing offer.',
    effects: { applyToSelf: { counterOffer: 3 } },
    upgradedEffects: { applyToSelf: { counterOffer: 5 } },
    upgradedDescription: 'Gain 5 Counter-Offer.',
    icon: '💼',
  },

  // ── Neutral Rare ──
  full_stack: {
    id: 'full_stack', name: 'Full Stack', type: 'attack', target: 'enemy', cost: 2, rarity: 'rare',
    description: 'Deal 12 damage. Gain 12 block. You do it all because they fired everyone.',
    effects: { damage: 12, block: 12 },
    upgradedEffects: { damage: 16, block: 16 },
    upgradedDescription: 'Deal 16 damage. Gain 16 block.',
    icon: '🏗️',
  },
  networking_event: {
    id: 'networking_event', name: 'Networking Event', type: 'power', target: 'self', cost: 1, rarity: 'rare',
    description: 'Gain 1 Networking. Let\'s grab coffee!',
    effects: { applyToSelf: { networking: 1 } },
    upgradedEffects: { applyToSelf: { networking: 2 } },
    upgradedDescription: 'Gain 2 Networking.',
    icon: '🤝',
  },
  emergency_fund: {
    id: 'emergency_fund', name: 'Emergency Fund', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 10 Savings Account. 6 months of runway.',
    effects: { applyToSelf: { savingsAccount: 10 } },
    upgradedEffects: { applyToSelf: { savingsAccount: 15 } },
    upgradedDescription: 'Gain 15 Savings Account.',
    icon: '🏦',
  },
  hustle_culture: {
    id: 'hustle_culture', name: 'Hustle Culture', type: 'power', target: 'self', cost: 2, rarity: 'rare',
    description: 'Gain 1 energy each turn. Gain 3 stress each turn. Sleep is for the insured.',
    effects: { applyToSelf: { hustleCulture: 1 } },
    upgradedEffects: { applyToSelf: { hustleCulture: 1 }, energy: 1 },
    upgradedDescription: 'Gain 1 energy. Gain 1 energy each turn. Gain 3 stress each turn.',
    icon: '💪',
  },

  // ── Curse ──
  ghosted_curse: {
    id: 'ghosted_curse', name: 'Ghosted', type: 'curse', target: 'self', cost: 1, rarity: 'curse',
    description: 'Unplayable. Clogs your hand. They never called back.',
    effects: {},
    icon: '💔',
  },
};

export function getCardDef(id: string): CardDef {
  return cards[id];
}

export function getRewardCards(count: number, rarity?: 'common' | 'uncommon' | 'rare', playerClass?: string): CardDef[] {
  const pool = Object.values(cards).filter(c => {
    if (c.rarity === 'starter' || c.rarity === 'curse') return false;
    if (rarity) return c.rarity === rarity;
    return true;
  });

  // Class-gated rewards: 80% class cards, 20% neutral
  let filtered: CardDef[];
  if (playerClass) {
    const classCards = pool.filter(c => c.class === playerClass);
    const neutralCards = pool.filter(c => !c.class);
    // Build weighted pool: class cards appear 4x more often
    filtered = [];
    for (let i = 0; i < 4; i++) filtered.push(...classCards);
    filtered.push(...neutralCards);
  } else {
    filtered = pool;
  }

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  // Deduplicate by id (since class cards are repeated 4x)
  const seen = new Set<string>();
  const result: CardDef[] = [];
  for (const card of shuffled) {
    if (!seen.has(card.id)) {
      seen.add(card.id);
      result.push(card);
    }
    if (result.length >= count) break;
  }

  return result;
}
