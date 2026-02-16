import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const RestScreen: React.FC = () => {
  const { run, rest, upgradeCard, returnToMap } = useGameStore();
  const [mode, setMode] = useState<'choose' | 'upgrade'>('choose');

  if (!run) return null;

  const healAmount = Math.floor(run.maxHp * 0.3);
  const upgradableCards = run.deck.filter(c => !c.upgraded);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: 32,
    }} className="animate-fade-in">
      <div style={{ fontSize: 64 }}>🔥</div>
      <h2 style={{ fontSize: 24, color: 'var(--accent-orange)' }}>Rest Site</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        HP: {run.hp}/{run.maxHp}
      </p>

      {mode === 'choose' ? (
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={rest}
            className="success"
            style={{ padding: '16px 32px', fontSize: 16 }}
          >
            😴 Rest (Heal {healAmount} HP)
          </button>
          <button
            onClick={() => setMode('upgrade')}
            disabled={upgradableCards.length === 0}
            style={{ padding: '16px 32px', fontSize: 16 }}
          >
            ⬆️ Upgrade a Card
          </button>
        </div>
      ) : (
        <>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Choose a card to upgrade:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            maxWidth: 600,
            maxHeight: 300,
            overflow: 'auto',
          }}>
            {upgradableCards.map(card => {
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              return (
                <div
                  key={card.instanceId}
                  onClick={() => upgradeCard(card.instanceId)}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: 12,
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = borderColor}
                >
                  <span>{card.icon} {card.name}</span>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {card.description}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setMode('choose')} style={{ fontSize: 13 }}>
            ← Back
          </button>
        </>
      )}
    </div>
  );
};
