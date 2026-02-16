import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardComponent } from '../battle/CardComponent';

export const EventScreen: React.FC = () => {
  const pendingEvent = useGameStore(s => s.pendingEvent);
  const eventOutcome = useGameStore(s => s.eventOutcome);
  const makeEventChoice = useGameStore(s => s.makeEventChoice);
  const dismissEventOutcome = useGameStore(s => s.dismissEventOutcome);

  if (!pendingEvent) return null;

  // Show outcome after a choice is made
  if (eventOutcome) {
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
          fontSize: 16,
          lineHeight: 1.6,
          textAlign: 'center',
        }}>
          {eventOutcome.message}
        </p>

        {eventOutcome.cardAdded && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 'bold' }}>
              Card added to your deck:
            </span>
            <CardComponent card={eventOutcome.cardAdded} disabled />
          </div>
        )}

        <button
          onClick={dismissEventOutcome}
          style={{
            padding: '14px 40px',
            fontSize: 16,
            marginTop: 8,
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // Show choices
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
