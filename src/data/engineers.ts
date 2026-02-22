import type { EngineerSlot } from '../types';

// ── Engineer Roster (Architect mechanic) ──
// Each engineer has a passive (fires every turn) and an evoke (fires on overflow or blueprint complete).

export const engineerRoster: Record<string, EngineerSlot> = {
  frontend_jr: {
    id: 'frontend_jr', name: 'Frontend Jr', icon: '💻',
    passiveEffect: { dodge: 2 },
    evokeEffect: { damageAll: 12, applyToAll: { bleed: 2 } },
    harmonicEffect: { applyToSelf: { dodge: 8 }, applyToAll: { bleed: 6 } },
  },
  frontend_sr: {
    id: 'frontend_sr', name: 'Frontend Sr', icon: '🎨',
    passiveEffect: { dodge: 3, bleedRandom: 1 },
    evokeEffect: { damageAll: 20, applyToAll: { bleed: 3 } },
    harmonicEffect: { applyToSelf: { dodge: 10 }, applyToAll: { bleed: 8 }, damageAll: 8 },
  },
  backend_jr: {
    id: 'backend_jr', name: 'Backend Jr', icon: '🖥️',
    passiveEffect: { queueBlock: 6 },
    evokeEffect: { queueBlock: 8, queueDamageAll: 8, queueChain: 8 },
    harmonicEffect: { queueBlock: 16, queueDamageAll: 16, queueChain: 16 },
  },
  backend_sr: {
    id: 'backend_sr', name: 'Backend Sr', icon: '⚙️',
    passiveEffect: { queueBlock: 10, queueDamageAll: 6 },
    evokeEffect: { queueBlock: 14, queueDamageAll: 14, queueChain: 14 },
    harmonicEffect: { queueBlock: 20, queueDamageAll: 20, queueChain: 20 },
  },
  ai_jr: {
    id: 'ai_jr', name: 'AI Jr', icon: '🤖',
    passiveEffect: { draw: 1 },
    evokeEffect: { damage: 10, damageScalesWithTokens: 2 },
    harmonicEffect: { damageAllScalesWithTokens: 3 },
  },
  ai_sr: {
    id: 'ai_sr', name: 'AI Sr', icon: '🧠',
    passiveEffect: { generateTokens: 2 },
    evokeEffect: { damageAllScalesWithTokens: 3 },
    harmonicEffect: { damageAllScalesWithTokens: 5 },
  },
  qa_engineer: {
    id: 'qa_engineer', name: 'QA Engineer', icon: '🔍',
    passiveEffect: { vulnerableRandom: 1 },
    evokeEffect: { applyToAll: { vulnerable: 3, weak: 2 } },
    harmonicEffect: { applyToAll: { vulnerable: 3, weak: 3 } },
  },
  devops_engineer: {
    id: 'devops_engineer', name: 'DevOps', icon: '⚡',
    passiveEffect: { energy: 1 },
    evokeEffect: { energy: 3, draw: 3 },
    harmonicEffect: { energy: 3, draw: 3 },
  },
  security_engineer: {
    id: 'security_engineer', name: 'Security', icon: '🔒',
    passiveEffect: { counterOffer: 1 },
    evokeEffect: { damageAllEqualsCounterOffer: true, gainCounterOfferDouble: true },
    harmonicEffect: { damageAllScalesWithCounterOffer: 3 },
  },
  data_engineer: {
    id: 'data_engineer', name: 'Data', icon: '📊',
    passiveEffect: { draw: 1 },
    evokeEffect: { draw: 3, shuffleDiscardToDraw: true },
    harmonicEffect: { draw: 10, shuffleDiscardToDraw: true },
  },
  principal_engineer: {
    id: 'principal_engineer', name: 'Principal', icon: '👑',
    passiveEffect: { resilience: 1 },
    evokeEffect: { doubleResilience: true },
    harmonicEffect: { doublePlayerStatus: true },
  },
};

export function generateBlueprint(): string[] {
  const ids = Object.keys(engineerRoster);
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}
