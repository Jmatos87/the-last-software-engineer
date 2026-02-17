import React from 'react';
import type { CardDef, CardInstance } from '../../types';

interface CardPreviewProps {
  card: CardDef | CardInstance;
  x: number;
  y: number;
  label?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, x, y, label }) => {
  const borderColor = card.type === 'curse' ? 'var(--accent-purple)'
    : card.type === 'attack' ? 'var(--card-attack)'
    : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';

  const isUpgraded = 'upgraded' in card && card.upgraded;

  const previewWidth = 240;
  const previewHeight = 340;

  // Center horizontally above the card, clamp to viewport
  let left = x - previewWidth / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - previewWidth - 8));

  // Position above the card, flip below if no room
  let top = y - previewHeight - 12;
  if (top < 8) {
    top = y + 12;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {label && (
        <div style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 'bold',
          color: 'var(--text-secondary)',
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          {label}
        </div>
      )}
      <div
        style={{
          width: previewWidth,
          minHeight: previewHeight,
          background: 'var(--bg-card)',
          border: `3px solid ${borderColor}`,
          borderRadius: 'var(--radius-lg, 12px)',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          animation: 'fade-in 0.1s ease-out',
        }}
      >
        {/* Cost + Type */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--energy-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          }}>
            {card.cost}
          </div>
          <span style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {card.type}
          </span>
        </div>

        {/* Icon */}
        <div style={{ fontSize: 48, textAlign: 'center', margin: '4px 0' }}>
          {card.icon}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          color: isUpgraded ? 'var(--accent-green)' : 'var(--text-primary)',
        }}>
          {card.name}
        </div>

        {/* Rarity */}
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          {card.rarity}
        </div>

        {/* Description */}
        {(() => {
          const desc = ('upgraded' in card && card.upgraded && card.upgradedDescription)
            ? card.upgradedDescription : card.description;
          // Split: first sentence is the mechanical effect, rest is flavor
          const dotIdx = desc.indexOf('. ');
          const mechanic = dotIdx >= 0 ? desc.slice(0, dotIdx + 1) : desc;
          const flavor = dotIdx >= 0 ? desc.slice(dotIdx + 2) : '';
          return (
            <div style={{
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 1.5,
              flex: 1,
              padding: '6px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{mechanic}</div>
              {flavor && (
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontStyle: 'italic' }}>{flavor}</div>
              )}
            </div>
          );
        })()}

        {/* Target indicator */}
        <div style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          textAlign: 'center',
          borderTop: '1px solid var(--border-color)',
          paddingTop: 8,
        }}>
          {card.target === 'enemy' ? '🎯 Target Enemy' : card.target === 'self' ? '🙋 Self' : '🌍 All Enemies'}
        </div>
      </div>
    </div>
  );
};
