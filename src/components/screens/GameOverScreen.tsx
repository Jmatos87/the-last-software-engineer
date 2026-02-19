import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMobile } from '../../hooks/useMobile';

export const GameOverScreen: React.FC = () => {
  const { compact } = useMobile();
  const { run, restart } = useGameStore();

  const stressDeath = run && run.stress >= run.maxStress;
  const actLabel = run ? `Act ${run.act}` : '';
  const floorLabel = run ? `Floor ${run.map.currentRow + 1}` : '';

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: compact ? 'flex-start' : 'center',
      gap: compact ? 10 : 24,
      padding: compact ? '12px 16px' : 48,
      maxWidth: 600,
      margin: '0 auto',
    }} className="animate-fade-in">

      <div style={{ fontSize: compact ? 28 : 60 }}>📋</div>

      <h1 style={{
        fontSize: compact ? 18 : 28,
        color: 'var(--text-primary)',
        margin: 0,
        textAlign: 'center',
      }}>
        Application Rejected
      </h1>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: compact ? 12 : 15,
        textAlign: 'center',
        fontStyle: 'italic',
        margin: 0,
      }}>
        {stressDeath
          ? '"We appreciate your enthusiasm, but we\'ve decided to move in a different direction."'
          : '"After careful consideration, we have chosen to pursue other candidates at this time."'}
      </p>

      {run && (
        <div style={{
          background: 'var(--bg-card)',
          padding: compact ? 10 : 20,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          width: '100%',
          maxWidth: 380,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Run Summary
          </p>
          <p style={{ fontSize: compact ? 13 : 15, marginBottom: 8 }}>
            {run.character.icon} {run.character.name}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 16px',
            fontSize: compact ? 12 : 13,
            color: 'var(--text-secondary)',
            marginBottom: run.items.length > 0 ? 8 : 0,
          }}>
            <span>Reached</span><span style={{ color: 'var(--text-primary)' }}>{actLabel}, {floorLabel}</span>
            <span>Cards</span><span style={{ color: 'var(--text-primary)' }}>{run.deck.length}</span>
            <span>Gold</span><span style={{ color: 'var(--text-primary)' }}>💰 {run.gold}</span>
            <span>HP left</span><span style={{ color: 'var(--text-primary)' }}>{run.hp}/{run.maxHp}</span>
            <span>Stress</span><span style={{ color: run.stress >= run.maxStress * 0.75 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{run.stress}/{run.maxStress}</span>
          </div>
          {run.items.length > 0 && (
            <p style={{ fontSize: 16, marginTop: 4 }}>
              {run.items.map(i => i.icon).join(' ')}
            </p>
          )}
        </div>
      )}

      <p style={{
        color: 'var(--text-primary)',
        fontSize: compact ? 12 : 15,
        textAlign: 'center',
        lineHeight: 1.8,
        maxWidth: 460,
        margin: 0,
      }}>
        This run is over — but you are not. Every rejection in the real world
        feels exactly like this: arbitrary, exhausting, and deeply unfair.
        {!compact && " It's not a reflection of your ability. It never was."}
      </p>

      {!compact && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 1.8,
          maxWidth: 460,
          fontStyle: 'italic',
          margin: 0,
        }}>
          Apply again. Adjust your deck. Try a different path. That's true in the
          game, and it's true out there too.
        </p>
      )}

      <button
        className="primary"
        onClick={restart}
        style={{ padding: compact ? '10px 24px' : '14px 36px', fontSize: 15 }}
      >
        Apply Again
      </button>
    </div>
  );
};
