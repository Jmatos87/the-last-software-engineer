import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const EventScreen: React.FC = () => {
  const { pendingEvent, makeEventChoice } = useGameStore();

  if (!pendingEvent) return null;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: 32,
      maxWidth: 600,
      margin: '0 auto',
    }} className="animate-fade-in">
      <div style={{ fontSize: 64 }}>{pendingEvent.icon}</div>
      <h2 style={{ fontSize: 22, color: 'var(--accent-yellow)' }}>{pendingEvent.title}</h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 14,
        lineHeight: 1.6,
        textAlign: 'center',
      }}>
        {pendingEvent.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {pendingEvent.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => makeEventChoice(i)}
            style={{
              padding: '14px 20px',
              fontSize: 14,
              textAlign: 'left',
              width: '100%',
            }}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};
