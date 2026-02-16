import React from 'react';
import type { StatusEffect } from '../../types';
import { Tooltip } from './Tooltip';

interface StatusEffectsProps {
  effects: StatusEffect;
}

const effectInfo: Record<string, { icon: string; label: string; color: string }> = {
  // Debuffs
  vulnerable: { icon: '💔', label: 'Vulnerable — Take 50% more damage', color: 'var(--accent-red)' },
  weak: { icon: '😵', label: 'Weak — Deal 25% less damage', color: 'var(--accent-orange)' },
  poison: { icon: '☠️', label: 'Poison', color: 'var(--accent-purple)' },
  hope: { icon: '✨', label: 'Hope — Beware false promises...', color: 'var(--accent-yellow)' },
  cringe: { icon: '😬', label: 'Cringe — Reduces stress healing', color: 'var(--accent-orange)' },
  ghosted: { icon: '👻', label: 'Ghosted — Adds curse cards each turn', color: 'var(--accent-purple)' },
  // Buffs
  strength: { icon: '😤', label: 'Rage Apply — +1 damage per stack', color: 'var(--accent-red)' },
  dexterity: { icon: '🧠', label: 'Emotional Intelligence — +1 block & stress reduction per stack', color: 'var(--accent-blue)' },
  regen: { icon: '🌿', label: 'Touch Grass — Heal HP each turn', color: 'var(--accent-green)' },
  selfCare: { icon: '🛁', label: 'Self Care — Reduce stress each turn', color: 'var(--accent-green)' },
  networking: { icon: '🤝', label: 'Networking — Draw extra cards each turn', color: 'var(--accent-blue)' },
  savingsAccount: { icon: '🏦', label: 'Savings Account — Retain block between turns', color: 'var(--accent-yellow)' },
  counterOffer: { icon: '💼', label: 'Counter-Offer — Deal damage back when attacked', color: 'var(--accent-orange)' },
  hustleCulture: { icon: '💪', label: 'Hustle Culture — +1 energy, +3 stress per turn', color: 'var(--accent-red)' },
};

export const StatusEffects: React.FC<StatusEffectsProps> = ({ effects }) => {
  const entries = Object.entries(effects).filter(([, v]) => v && v > 0);
  if (entries.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {entries.map(([key, value]) => {
        const info = effectInfo[key];
        if (!info) return null;
        return (
          <Tooltip key={key} text={`${info.label}: ${value}`}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '2px 6px',
              background: 'var(--bg-primary)',
              border: `1px solid ${info.color}`,
              borderRadius: 'var(--radius-sm)',
              fontSize: 11,
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
