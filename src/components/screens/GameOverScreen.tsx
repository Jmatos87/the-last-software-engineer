import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMobile } from '../../hooks/useMobile';

export const GameOverScreen: React.FC = () => {
  const { compact } = useMobile();
  const { run, restart } = useGameStore();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: compact ? 12 : 24,
      padding: compact ? 16 : 32,
    }} className="animate-fade-in">
      <div style={{ fontSize: compact ? 36 : 64 }}>💀</div>
      <h1 style={{ fontSize: compact ? 22 : 32, color: 'var(--accent-red)' }}>GAME OVER</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
        {run && run.stress >= run.maxStress
          ? 'Mental breakdown! The job search has claimed another victim.'
          : 'Your code has been deprecated.'}
      </p>
      {run && (
        <div style={{
          background: 'var(--bg-card)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>
            {run.character.icon} {run.character.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Floor {run.map.currentRow + 1} | {run.deck.length} cards | 💰 {run.gold}
          </p>
        </div>
      )}
      <button
        className="primary"
        onClick={restart}
        style={{ padding: '14px 32px', fontSize: 16 }}
      >
        {'>'} Try Again _
      </button>
    </div>
  );
};
