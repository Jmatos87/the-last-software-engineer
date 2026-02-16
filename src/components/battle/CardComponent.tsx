import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { CardInstance } from '../../types';

interface CardComponentProps {
  card: CardInstance;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, disabled, onClick, style }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.instanceId,
    disabled,
    data: { card },
  });

  const borderColor = card.type === 'attack' ? 'var(--card-attack)'
    : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';

  const transformStyle = transform
    ? `translate(${transform.x}px, ${transform.y}px)`
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{
        width: 120,
        minHeight: 160,
        background: isDragging ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        cursor: disabled ? 'not-allowed' : 'grab',
        opacity: disabled ? 0.5 : isDragging ? 0.8 : 1,
        transform: transformStyle,
        transition: transform ? undefined : 'all var(--transition-fast)',
        zIndex: isDragging ? 100 : 1,
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Cost */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--energy-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000',
        }}>
          {card.cost}
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {card.type}
        </span>
      </div>

      {/* Icon */}
      <div style={{ fontSize: 28, textAlign: 'center', margin: '4px 0' }}>
        {card.icon}
      </div>

      {/* Name */}
      <div style={{
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        color: card.upgraded ? 'var(--accent-green)' : 'var(--text-primary)',
      }}>
        {card.name}
      </div>

      {/* Description */}
      <div style={{
        fontSize: 10,
        color: 'var(--text-secondary)',
        textAlign: 'center',
        flex: 1,
      }}>
        {card.description}
      </div>

      {/* Target indicator */}
      <div style={{
        fontSize: 9,
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        {card.target === 'enemy' ? '🎯 Target' : card.target === 'self' ? '🙋 Self' : '🌍 All'}
      </div>
    </div>
  );
};

// Simplified version for drag overlay
export const CardOverlay: React.FC<{ card: CardInstance }> = ({ card }) => {
  const borderColor = card.type === 'attack' ? 'var(--card-attack)'
    : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';

  return (
    <div style={{
      width: 120,
      minHeight: 160,
      background: 'var(--bg-card-hover)',
      border: `2px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      transform: 'rotate(3deg) scale(1.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--energy-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 'bold', color: '#000',
        }}>{card.cost}</div>
      </div>
      <div style={{ fontSize: 28, textAlign: 'center' }}>{card.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}>{card.name}</div>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center' }}>{card.description}</div>
    </div>
  );
};
