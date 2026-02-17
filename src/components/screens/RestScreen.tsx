import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardPreview } from '../common/CardPreview';
import type { CardDef } from '../../types';

export const RestScreen: React.FC = () => {
  const { run, rest, upgradeCard, train, reflectRemoveCard } = useGameStore();
  const [mode, setMode] = useState<'choose' | 'upgrade' | 'reflect'>('choose');
  const [preview, setPreview] = useState<{ card: CardDef; upgraded: CardDef; x: number; y: number } | null>(null);

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
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
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
          {run.act >= 2 && (
            <button
              onClick={train}
              style={{ padding: '16px 32px', fontSize: 16 }}
            >
              🏋️ Train (Gain Card)
            </button>
          )}
          {run.act >= 3 && (
            <button
              onClick={() => setMode('reflect')}
              disabled={run.deck.length <= 1}
              style={{ padding: '16px 32px', fontSize: 16 }}
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
          {preview && (
            <>
              <CardPreview card={preview.card} x={preview.x - 130} y={preview.y} label="Current" />
              <CardPreview card={preview.upgraded} x={preview.x + 130} y={preview.y} label="Upgraded" />
            </>
          )}
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
                  onMouseEnter={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const upgraded = {
                      ...card,
                      name: card.name + '+',
                      upgraded: true,
                      cost: card.upgradedCost ?? card.cost,
                      effects: card.upgradedEffects ?? card.effects,
                      description: card.upgradedDescription ?? card.description,
                    };
                    setPreview({ card, upgraded, x: rect.left + rect.width / 2, y: rect.top });
                    e.currentTarget.style.borderColor = 'var(--accent-green)';
                  }}
                  onMouseLeave={e => {
                    setPreview(null);
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                  style={{
                    padding: '6px 10px',
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: 12,
                    maxWidth: 140,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>{card.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</span>
                  <span style={{ color: 'var(--energy-color)', fontSize: 10 }}>({card.cost})</span>
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
            gap: 8,
            justifyContent: 'center',
            maxWidth: 600,
            maxHeight: 300,
            overflow: 'auto',
          }}>
            {run.deck.map(card => {
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              return (
                <div
                  key={card.instanceId}
                  onClick={() => reflectRemoveCard(card.instanceId)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red, #e74c3c)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
                  style={{
                    padding: '6px 10px',
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: 12,
                    maxWidth: 140,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>{card.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</span>
                  <span style={{ color: 'var(--energy-color)', fontSize: 10 }}>({card.cost})</span>
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
