import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardPreview } from '../common/CardPreview';
import type { CardDef } from '../../types';

export const BattleRewardScreen: React.FC = () => {
  const { pendingRewards, pickRewardCard, skipRewardCards, run } = useGameStore();
  const [preview, setPreview] = useState<{ card: CardDef; x: number; y: number } | null>(null);

  if (!pendingRewards || !run) return null;

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
      <h2 style={{ fontSize: 24, color: 'var(--accent-green)' }}>Victory!</h2>

      {/* Gold collected */}
      {pendingRewards.gold > 0 && (
        <span style={{ color: 'var(--gold-color)', fontSize: 16 }}>
          💰 +{pendingRewards.gold} gold (Total: {run.gold})
        </span>
      )}

      {/* Card choices */}
      {pendingRewards.cardChoices.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Choose a card to add to your deck:</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {pendingRewards.cardChoices.map(card => {
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              return (
                <div
                  key={card.id}
                  onClick={() => pickRewardCard(card.id)}
                  style={{
                    width: 140,
                    padding: 14,
                    background: 'var(--bg-card)',
                    border: `2px solid ${borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    setPreview(null);
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{card.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    {card.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 11 }}>
                    <span style={{ color: 'var(--energy-color)' }}>⚡{card.cost}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{card.rarity}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={skipRewardCards} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Skip card reward →
          </button>
        </>
      )}

      {preview && (
        <CardPreview card={preview.card} x={preview.x} y={preview.y} />
      )}
    </div>
  );
};
