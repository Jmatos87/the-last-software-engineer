import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Tooltip } from '../common/Tooltip';
import type { ConsumableInstance } from '../../types';

interface ConsumableBarProps {
  onTargetEnemy: (consumableInstanceId: string) => void;
  disabled?: boolean;
}

export const ConsumableBar: React.FC<ConsumableBarProps> = ({ onTargetEnemy, disabled }) => {
  const run = useGameStore(s => s.run);
  const useConsumable = useGameStore(s => s.useConsumable);
  const discardConsumable = useGameStore(s => s.discardConsumable);

  if (!run) return null;

  const slots: (ConsumableInstance | null)[] = [];
  for (let i = 0; i < run.maxConsumables; i++) {
    slots.push(run.consumables[i] || null);
  }

  const rarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'var(--text-secondary)';
      case 'uncommon': return 'var(--accent-blue)';
      case 'rare': return 'var(--accent-yellow)';
      default: return 'var(--border-color)';
    }
  };

  const handleClick = (consumable: ConsumableInstance) => {
    if (disabled) return;
    if (consumable.target === 'enemy') {
      onTargetEnemy(consumable.instanceId);
    } else {
      useConsumable(consumable.instanceId);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
    }}>
      {slots.map((consumable, i) => (
        consumable ? (
          <Tooltip key={consumable.instanceId} content={
            <div style={{ textAlign: 'left', maxWidth: 200 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, color: rarityColor(consumable.rarity) }}>
                {consumable.icon} {consumable.name}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.4 }}>
                {consumable.description}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 4 }}>
                {consumable.target === 'enemy' ? 'Click → select target' : 'Click to use'}
              </div>
              <div
                onClick={e => { e.stopPropagation(); discardConsumable(consumable.instanceId); }}
                style={{ color: 'var(--accent-red)', fontSize: 10, marginTop: 4, cursor: 'pointer' }}
              >
                [Discard]
              </div>
            </div>
          }>
            <div
              className="consumable-slot filled"
              onClick={() => handleClick(consumable)}
              style={{
                borderColor: rarityColor(consumable.rarity),
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <span style={{ fontSize: 18 }}>{consumable.icon}</span>
            </div>
          </Tooltip>
        ) : (
          <div
            key={`empty-${i}`}
            className="consumable-slot"
          >
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>+</span>
          </div>
        )
      ))}
    </div>
  );
};
