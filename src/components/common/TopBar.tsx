import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { HpBar } from './HpBar';
import { Tooltip } from './Tooltip';

export const TopBar: React.FC<{ extra?: React.ReactNode }> = ({ extra }) => {
  const run = useGameStore(s => s.run);
  const restart = useGameStore(s => s.restart);
  const [showQuitModal, setShowQuitModal] = useState(false);
  if (!run) return null;

  return (
    <div style={{
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      flexShrink: 0,
    }}>
      {/* Character */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{run.character.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 'bold' }}>{run.character.name}</span>
      </div>

      {/* HP bar */}
      <div style={{ width: 120 }}>
        <HpBar current={run.hp} max={run.maxHp} height={10} label="HP" />
      </div>

      {/* Stress bar */}
      <div style={{ width: 100 }}>
        <HpBar current={run.stress} max={run.maxStress} height={10} color="var(--accent-purple)" label="STRESS" />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, fontSize: 13, alignItems: 'center' }}>
        <span style={{ color: 'var(--gold-color)' }}>💰 {run.gold}</span>
        <span style={{ color: 'var(--accent-purple)' }}>Act {run.act}</span>
        <span style={{ color: 'var(--text-secondary)' }}>📦 {run.deck.length}</span>
      </div>

      {/* Relics */}
      {run.items.length > 0 && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 4 }}>
          {run.items.map(item => (
            <Tooltip key={item.id} content={
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: 'var(--gold-color)' }}>
                  {item.icon} {item.name}
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.description}
                </div>
              </div>
            }>
              <span style={{ fontSize: 18, cursor: 'help' }}>{item.icon}</span>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Optional extra content (e.g. turn counter) */}
      {extra && (
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)' }}>
          {extra}
        </div>
      )}

      {/* Restart run */}
      <button
        onClick={() => setShowQuitModal(true)}
        style={{
          marginLeft: extra ? 8 : 'auto',
          padding: '4px 10px',
          fontSize: 11,
          background: 'transparent',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        ✕ Quit Run
      </button>

      {/* Quit confirmation modal */}
      {showQuitModal && (
        <div
          onClick={() => setShowQuitModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '32px 40px',
              textAlign: 'center',
              maxWidth: 360,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚪</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Abandon Run?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '0 0 24px' }}>
              All progress will be lost. You'll return to class select.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowQuitModal(false)}
                style={{ padding: '8px 24px', fontSize: 14 }}
              >
                Keep Going
              </button>
              <button
                onClick={restart}
                className="danger"
                style={{ padding: '8px 24px', fontSize: 14 }}
              >
                Quit Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
