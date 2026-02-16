import React from 'react';
import type { StatusEffect } from '../../types';
import { Tooltip } from './Tooltip';

interface StatusEffectsProps {
  effects: StatusEffect;
}

const effectInfo: Record<string, { icon: string; label: string; color: string }> = {
  vulnerable: { icon: '💔', label: 'Vulnerable', color: 'var(--accent-red)' },
  weak: { icon: '😵', label: 'Weak', color: 'var(--accent-orange)' },
  strength: { icon: '💪', label: 'Strength', color: 'var(--accent-red)' },
  dexterity: { icon: '🏃', label: 'Dexterity', color: 'var(--accent-green)' },
  regen: { icon: '💚', label: 'Regen', color: 'var(--accent-green)' },
  poison: { icon: '☠️', label: 'Poison', color: 'var(--accent-purple)' },
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
