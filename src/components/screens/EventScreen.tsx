import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardPreview } from '../common/CardPreview';
import type { CardInstance } from '../../types';

export const EventScreen: React.FC = () => {
  const pendingEvent = useGameStore(s => s.pendingEvent);
  const eventOutcome = useGameStore(s => s.eventOutcome);
  const makeEventChoice = useGameStore(s => s.makeEventChoice);
  const dismissEventOutcome = useGameStore(s => s.dismissEventOutcome);
  const [preview, setPreview] = useState<{ card: CardInstance; x: number; y: number } | null>(null);

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

        {eventOutcome.cardAdded && (() => {
          const card = eventOutcome.cardAdded!;
          const borderColor = card.type === 'attack' ? 'var(--card-attack)'
            : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 'bold' }}>
                Card added to your deck:
              </span>
              <div
                style={{
                  width: 140,
                  padding: 14,
                  background: 'var(--bg-card)',
                  border: `2px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'all var(--transition-fast)',
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 11 }}>
                  <span style={{ color: 'var(--energy-color)' }}>⚡{card.cost}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{card.rarity}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {eventOutcome.cardUpgraded && (() => {
          const card = eventOutcome.cardUpgraded!;
          const borderColor = card.type === 'attack' ? 'var(--card-attack)'
            : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 'bold' }}>
                Card upgraded:
              </span>
              <div
                style={{
                  width: 140,
                  padding: 14,
                  background: 'var(--bg-card)',
                  border: `2px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'all var(--transition-fast)',
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 11 }}>
                  <span style={{ color: 'var(--energy-color)' }}>⚡{card.cost}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{card.rarity}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {eventOutcome.cardRemoved && (() => {
          const card = eventOutcome.cardRemoved!;
          const borderColor = card.type === 'attack' ? 'var(--card-attack)'
            : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 13, color: 'var(--hp-color)', fontWeight: 'bold' }}>
                Card removed from your deck:
              </span>
              <div
                style={{
                  width: 140,
                  padding: 14,
                  background: 'var(--bg-card)',
                  border: `2px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'default',
                  opacity: 0.7,
                  transition: 'all var(--transition-fast)',
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
                <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4, textDecoration: 'line-through' }}>{card.name}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 11 }}>
                  <span style={{ color: 'var(--energy-color)' }}>⚡{card.cost}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{card.rarity}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {preview && (
          <CardPreview card={preview.card} x={preview.x} y={preview.y} />
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
