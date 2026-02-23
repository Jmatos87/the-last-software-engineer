import React from 'react';
import type { StatusEffect } from '../../types';
import { Tooltip } from './Tooltip';
import { useMobile } from '../../hooks/useMobile';

interface StatusEffectsProps {
  effects: StatusEffect;
}

const effectInfo: Record<string, { icon: string; label: string; unit: string; color: string }> = {
  // Debuffs (temporary — decrement each turn)
  vulnerable: { icon: '💔', label: 'Vulnerable — Take 50% more damage', unit: 'turns', color: 'var(--accent-red)' },
  weak: { icon: '😵', label: 'Weak — Deal 25% less damage', unit: 'turns', color: 'var(--accent-orange)' },
  poison: { icon: '☠️', label: 'Poison — Lose HP each turn, then decrements', unit: 'damage', color: 'var(--accent-purple)' },
  hope: { icon: '✨', label: 'Hope — False promise... explodes into stress when it expires', unit: 'turns', color: 'var(--accent-yellow)' },
  cringe: { icon: '😬', label: 'Cringe — Stress healing is halved', unit: 'turns', color: 'var(--accent-orange)' },
  ghosted: { icon: '👻', label: 'Ghosted — A curse card is added to your deck each turn', unit: 'turns', color: 'var(--accent-purple)' },
  // Buffs (permanent — persist until removed)
  confidence: { icon: '😤', label: 'Confidence — +1 damage per attack per stack', unit: 'stacks', color: 'var(--accent-red)' },
  resilience: { icon: '🧠', label: 'Resilience — +1 block & stress reduction per stack', unit: 'stacks', color: 'var(--accent-blue)' },
  regen: { icon: '🌿', label: 'Touch Grass — Heal HP equal to stacks each turn', unit: 'stacks', color: 'var(--accent-green)' },
  selfCare: { icon: '🛁', label: 'Self Care — Reduce stress equal to stacks each turn', unit: 'stacks', color: 'var(--accent-green)' },
  networking: { icon: '🤝', label: 'Networking — Draw extra cards each turn', unit: 'stacks', color: 'var(--accent-blue)' },
  savingsAccount: { icon: '🏦', label: 'Savings Account — Retain block between turns (up to stacks)', unit: 'stacks', color: 'var(--accent-yellow)' },
  counterOffer: { icon: '💼', label: 'Counter-Offer — Deal damage back when hit', unit: 'stacks', color: 'var(--accent-orange)' },
  hustleCulture: { icon: '💪', label: 'Hustle Culture — +1 energy per turn, but +3 stress per stack', unit: 'stacks', color: 'var(--accent-red)' },
  primed: { icon: '🎯', label: 'Primed — Detonation timers were reduced when applied', unit: 'turns', color: '#f97316' },
};

export const StatusEffects: React.FC<StatusEffectsProps> = ({ effects }) => {
  const { compact } = useMobile();
  const entries = Object.entries(effects).filter(([, v]) => v && v > 0);
  if (entries.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: compact ? 2 : 4, flexWrap: 'wrap' }}>
      {entries.map(([key, value]) => {
        const info = effectInfo[key];
        if (!info) return null;
        return (
          <Tooltip key={key} text={`${info.label} (${value} ${info.unit})`}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: compact ? '1px 3px' : '2px 6px',
              background: 'var(--bg-primary)',
              border: `1px solid ${info.color}`,
              borderRadius: 'var(--radius-sm)',
              fontSize: compact ? 9 : 11,
              color: info.color,
            }}>
              <span>{info.icon}</span>
              <span>{value}</span>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};
