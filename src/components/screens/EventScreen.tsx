import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardPreview } from '../common/CardPreview';
import { useMobile } from '../../hooks/useMobile';
import type { CardInstance } from '../../types';

export const EventScreen: React.FC = () => {
  const { compact } = useMobile();
  const pendingEvent = useGameStore(s => s.pendingEvent);
  const eventOutcome = useGameStore(s => s.eventOutcome);
  const makeEventChoice = useGameStore(s => s.makeEventChoice);
  const dismissEventOutcome = useGameStore(s => s.dismissEventOutcome);
  const pendingRemoveCount = useGameStore(s => s.pendingRemoveCount);
  const confirmRemoveEventCard = useGameStore(s => s.confirmRemoveEventCard);
  const run = useGameStore(s => s.run);
  const [preview, setPreview] = useState<{ card: CardInstance; x: number; y: number } | null>(null);

  if (!pendingEvent) return null;

  // Show card picker for removeChosenCard
  if (pendingRemoveCount && pendingRemoveCount > 0 && run) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: compact ? 'flex-start' : 'center',
        gap: compact ? 12 : 24,
        padding: compact ? 16 : 32,
        maxWidth: 700,
        margin: '0 auto',
        overflow: compact ? 'auto' : undefined,
      }} className="animate-fade-in">
        <div style={{ fontSize: compact ? 36 : 64 }}>{pendingEvent.icon}</div>
        <h2 style={{ fontSize: 22, color: 'var(--accent-yellow)' }}>{pendingEvent.title}</h2>
        <p style={{
          color: 'var(--accent-red)',
          fontSize: 16,
          fontWeight: 'bold',
        }}>
          Choose {pendingRemoveCount} card{pendingRemoveCount > 1 ? 's' : ''} to remove:
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {run.deck.map(card => {
            const borderColor = card.type === 'attack' ? 'var(--card-attack)'
              : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
            return (
              <div
                key={card.instanceId}
                onClick={() => confirmRemoveEventCard(card.instanceId)}
                onMouseEnter={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => setPreview(null)}
                style={{
                  padding: '6px 10px',
                  background: 'var(--bg-card)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 12,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {card.icon} {card.name}
              </div>
            );
          })}
        </div>

        {preview && (
          <CardPreview card={preview.card} x={preview.x} y={preview.y} />
        )}
      </div>
    );
  }

  // Show outcome after a choice is made
  if (eventOutcome) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: compact ? 'flex-start' : 'center',
        gap: compact ? 12 : 24,
        padding: compact ? 16 : 32,
        maxWidth: 600,
        margin: '0 auto',
        overflow: compact ? 'auto' : undefined,
      }} className="animate-fade-in">
        <div style={{ fontSize: compact ? 36 : 64 }}>{pendingEvent.icon}</div>
        <h2 style={{ fontSize: compact ? 16 : 22, color: 'var(--accent-yellow)' }}>{pendingEvent.title}</h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: compact ? 13 : 16,
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

        {eventOutcome.cardsRemoved && eventOutcome.cardsRemoved.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 13, color: 'var(--hp-color)', fontWeight: 'bold' }}>
              Cards removed from your deck:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {eventOutcome.cardsRemoved.map((card: CardInstance, idx: number) => {
                const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                  : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
                return (
                  <div
                    key={idx}
                    style={{
                      width: 120,
                      padding: 10,
                      background: 'var(--bg-card)',
                      border: `2px solid ${borderColor}`,
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      opacity: 0.7,
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{card.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 'bold', textDecoration: 'line-through' }}>{card.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {eventOutcome.consumableAdded && (() => {
          const c = eventOutcome.consumableAdded!;
          const rarityColor = c.rarity === 'rare' ? 'var(--accent-yellow)' : c.rarity === 'uncommon' ? 'var(--accent-blue)' : 'var(--text-secondary)';
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 13, color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                Consumable added:
              </span>
              <div style={{
                padding: '8px 16px',
                background: 'var(--bg-card)',
                border: `2px solid ${rarityColor}`,
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div style={{ fontSize: 12, fontWeight: 'bold', marginTop: 4 }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.rarity}</div>
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
      justifyContent: compact ? 'flex-start' : 'center',
      gap: compact ? 12 : 24,
      padding: compact ? 16 : 32,
      maxWidth: 600,
      margin: '0 auto',
      overflow: compact ? 'auto' : undefined,
    }} className="animate-fade-in">
      <div style={{ fontSize: compact ? 36 : 64 }}>{pendingEvent.icon}</div>
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
