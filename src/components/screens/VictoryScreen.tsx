import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const VictoryScreen: React.FC = () => {
  const { run, restart } = useGameStore();

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
      <div style={{ fontSize: 64 }}>🏆</div>
      <h1 style={{
        fontSize: 32,
        background: 'linear-gradient(135deg, var(--accent-yellow), var(--accent-orange))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        VICTORY!
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16, textAlign: 'center' }}>
        You defeated The AI Overlord!<br />
        Humanity's code lives on... for now.
      </p>
      {run && (
        <div style={{
          background: 'var(--bg-card)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--accent-yellow)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            {run.character.icon} {run.character.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            HP: {run.hp}/{run.maxHp} | {run.deck.length} cards | 💰 {run.gold}
          </p>
          {run.items.length > 0 && (
            <p style={{ fontSize: 14, marginTop: 4 }}>
              Items: {run.items.map(i => i.icon).join(' ')}
            </p>
          )}
        </div>
      )}
      <button
        className="primary"
        onClick={restart}
        style={{ padding: '14px 32px', fontSize: 16 }}
      >
        {'>'} Play Again _
      </button>
    </div>
  );
};
