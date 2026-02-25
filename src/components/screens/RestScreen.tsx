import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMobile } from '../../hooks/useMobile';

export const RestScreen: React.FC = () => {
  const { compact } = useMobile();
  const { run, rest, upgradeCard, train, reflectRemoveCard } = useGameStore();
  const [mode, setMode] = useState<'choose' | 'upgrade' | 'reflect'>('choose');

  if (!run) return null;

  const healAmount = Math.floor(run.maxHp * 0.3);
  const upgradableCards = run.deck.filter(c => !c.upgraded);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: compact ? 'flex-start' : 'center',
      gap: compact ? 12 : 24,
      padding: compact ? 16 : 32,
      overflow: compact ? 'auto' : undefined,
    }} className="animate-fade-in">
      <div style={{ fontSize: compact ? 36 : 64 }}>🔥</div>
      <h2 style={{ fontSize: compact ? 18 : 24, color: 'var(--accent-orange)' }}>Rest Site</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        HP: {run.hp}/{run.maxHp}
      </p>

      {mode === 'choose' ? (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={rest}
            className="success"
            style={{ padding: compact ? '10px 20px' : '16px 32px', fontSize: compact ? 13 : 16 }}
          >
            😴 Rest (Heal {healAmount} HP)
          </button>
          <button
            onClick={() => setMode('upgrade')}
            disabled={upgradableCards.length === 0}
            style={{ padding: compact ? '10px 20px' : '16px 32px', fontSize: compact ? 13 : 16 }}
          >
            ⬆️ Upgrade a Card
          </button>
          {run.act >= 2 && (
            <button
              onClick={train}
              style={{ padding: compact ? '10px 20px' : '16px 32px', fontSize: compact ? 13 : 16 }}
            >
              🏋️ Train (Gain Card)
            </button>
          )}
          {run.act >= 3 && (
            <button
              onClick={() => setMode('reflect')}
              disabled={run.deck.length <= 1}
              style={{ padding: compact ? '10px 20px' : '16px 32px', fontSize: compact ? 13 : 16 }}
            >
              🧘 Reflect (Remove Card)
            </button>
          )}
        </div>
      ) : mode === 'upgrade' ? (
        <>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Choose a card to upgrade:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            maxWidth: 700,
            maxHeight: compact ? undefined : 400,
            overflow: 'auto',
          }}>
            {upgradableCards.map(card => {
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              const upgDesc = card.upgradedDescription ?? card.description;
              const upgCost = card.upgradedCost ?? card.cost;
              return (
                <div
                  key={card.instanceId}
                  onClick={() => upgradeCard(card.instanceId)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
                  style={{
                    width: compact ? 110 : 140,
                    padding: compact ? 8 : 10,
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{card.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>{card.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--energy-color)', marginBottom: 4 }}>⚡{card.cost} → ⚡{upgCost}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: 4 }}>{card.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--accent-green)', lineHeight: 1.3 }}>→ {upgDesc}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setMode('choose')} style={{ fontSize: 13 }}>
            ← Back
          </button>
        </>
      ) : (
        <>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Choose a card to remove from your deck:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            maxWidth: 700,
            maxHeight: compact ? undefined : 400,
            overflow: 'auto',
          }}>
            {run.deck.map(card => {
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              return (
                <div
                  key={card.instanceId}
                  onClick={() => reflectRemoveCard(card.instanceId)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
                  style={{
                    width: compact ? 110 : 130,
                    padding: compact ? 8 : 10,
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{card.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>{card.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--energy-color)', marginBottom: 4 }}>⚡{card.cost}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{card.description}</div>
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
