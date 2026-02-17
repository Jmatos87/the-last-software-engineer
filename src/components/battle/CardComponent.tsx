import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { CardInstance, StatusEffect, ItemDef } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { calculateDamage, calculateBlock, calculateCopium } from '../../utils/battleEngine';
import { useMobile } from '../../hooks/useMobile';

function getEffectiveEffects(card: CardInstance, playerEffects: StatusEffect, items: ItemDef[], defenderEffects: StatusEffect) {
  const effects = card.upgraded && card.upgradedEffects ? card.upgradedEffects : card.effects;
  const result: Record<string, { base: number; effective: number }> = {};

  if (effects.damage) {
    const effective = calculateDamage(effects.damage, playerEffects, defenderEffects, items);
    result.damage = { base: effects.damage, effective };
  }
  if (effects.damageAll) {
    const effective = calculateDamage(effects.damageAll, playerEffects, defenderEffects, items);
    result.damageAll = { base: effects.damageAll, effective };
  }
  if (effects.block) {
    const effective = calculateBlock(effects.block, playerEffects, items);
    result.block = { base: effects.block, effective };
  }
  if (effects.copium) {
    const effective = calculateCopium(effects.copium, playerEffects, items);
    result.copium = { base: effects.copium, effective };
  }

  return result;
}

function renderDescription(card: CardInstance, playerEffects: StatusEffect, items: ItemDef[], defenderEffects: StatusEffect): React.ReactNode {
  const computed = getEffectiveEffects(card, playerEffects, items, defenderEffects);
  const desc = card.upgraded && card.upgradedDescription ? card.upgradedDescription : card.description;

  // Build replacement map: base value -> { effective, key }
  // We need to replace specific number occurrences that match card effect values
  const replacements: { pattern: RegExp; effective: number; base: number }[] = [];

  if (computed.damage) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.damage.base} damage(?!\\.? to ALL)`),
      effective: computed.damage.effective,
      base: computed.damage.base,
    });
  }
  if (computed.damageAll) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.damageAll.base} damage to ALL`),
      effective: computed.damageAll.effective,
      base: computed.damageAll.base,
    });
  }
  if (computed.block) {
    replacements.push({
      pattern: new RegExp(`(?:Gain |gain )${computed.block.base} [Bb]lock`),
      effective: computed.block.effective,
      base: computed.block.base,
    });
  }
  if (computed.copium) {
    replacements.push({
      pattern: new RegExp(`Reduce ${computed.copium.base} Stress`),
      effective: computed.copium.effective,
      base: computed.copium.base,
    });
  }

  // If nothing changed, return plain text
  const anyChanged = replacements.some(r => r.effective !== r.base);
  if (!anyChanged) return desc;

  // Build JSX by splitting on replacement patterns
  const parts: React.ReactNode[] = [];
  let remaining = desc;
  let key = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; match: string; effective: number; base: number } | null = null;

    for (const r of replacements) {
      const m = remaining.match(r.pattern);
      if (m && m.index !== undefined) {
        if (!earliest || m.index < earliest.index) {
          earliest = { index: m.index, match: m[0], effective: r.effective, base: r.base };
        }
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    // Text before match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    // Replace the number in the matched text
    const buffed = earliest.effective > earliest.base;
    const color = buffed ? 'var(--accent-green)' : 'var(--accent-red, #ef4444)';
    const replaced = earliest.match.replace(
      String(earliest.base),
      String(earliest.effective)
    );
    parts.push(
      <span key={key++} style={{ color, fontWeight: 'bold' }}>{replaced}</span>
    );

    remaining = remaining.slice(earliest.index + earliest.match.length);
  }

  return <>{parts}</>;
}

interface CardComponentProps {
  card: CardInstance;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, disabled, onClick, style }) => {
  const { compact } = useMobile();
  const isCurse = card.type === 'curse';
  const battle = useGameStore(s => s.battle);
  const items = useGameStore(s => s.run?.items ?? []);
  const playerEffects = battle?.playerStatusEffects ?? {};
  // If any enemy is vulnerable, show the buffed damage on attack cards
  const anyEnemyVulnerable = battle?.enemies.some(e => (e.statusEffects.vulnerable || 0) > 0);
  const defenderEffects: StatusEffect = anyEnemyVulnerable ? { vulnerable: 1 } : {};
  const dynamicDescription = battle
    ? renderDescription(card, playerEffects, items, defenderEffects)
    : (card.upgraded && card.upgradedDescription ? card.upgradedDescription : card.description);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.instanceId,
    disabled: disabled || isCurse,
    data: { card },
  });

  const borderColor = isCurse ? 'var(--accent-purple)'
    : card.type === 'attack' ? 'var(--card-attack)'
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
        width: compact ? 80 : 120,
        minHeight: compact ? 100 : 160,
        background: isDragging ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: compact ? 6 : 10,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 2 : 4,
        cursor: disabled || isCurse ? 'not-allowed' : 'grab',
        opacity: disabled ? 0.5 : isCurse ? 0.7 : isDragging ? 0.8 : 1,
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
          width: compact ? 18 : 24,
          height: compact ? 18 : 24,
          borderRadius: '50%',
          background: 'var(--energy-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? 10 : 14,
          fontWeight: 'bold',
          color: '#000',
        }}>
          {card.cost}
        </div>
        {!compact && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {card.type}
          </span>
        )}
      </div>

      {/* Icon */}
      <div style={{ fontSize: compact ? 18 : 28, textAlign: 'center', margin: compact ? '2px 0' : '4px 0' }}>
        {card.icon}
      </div>

      {/* Name */}
      <div style={{
        fontSize: compact ? 9 : 11,
        fontWeight: 'bold',
        textAlign: 'center',
        color: card.upgraded ? 'var(--accent-green)' : 'var(--text-primary)',
      }}>
        {card.name}
      </div>

      {/* Description (hidden on compact) */}
      {!compact && (
        <div style={{
          fontSize: 9,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.3,
          maxHeight: '2.6em',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {dynamicDescription}
        </div>
      )}

      {/* Keywords & Target */}
      <div style={{
        fontSize: compact ? 8 : 9,
        color: 'var(--text-muted)',
        textAlign: 'center',
        display: 'flex',
        gap: compact ? 2 : 4,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {card.target === 'enemy' ? '🎯' : card.target === 'self' ? '🙋' : '🌍'}
        {(card.exhaust || card.type === 'power') && (
          <span style={{ color: 'var(--accent-purple, #a855f7)' }}>Exhaust</span>
        )}
        {card.ethereal && (
          <span style={{ color: 'var(--text-muted)' }}>Ethereal</span>
        )}
      </div>
    </div>
  );
};

// Simplified version for drag overlay
export const CardOverlay: React.FC<{ card: CardInstance }> = ({ card }) => {
  const { compact } = useMobile();
  const borderColor = card.type === 'attack' ? 'var(--card-attack)'
    : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';

  return (
    <div style={{
      width: compact ? 80 : 120,
      minHeight: compact ? 100 : 160,
      background: 'var(--bg-card-hover)',
      border: `2px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: compact ? 6 : 10,
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 2 : 4,
      boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      transform: 'rotate(3deg) scale(1.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{
          width: compact ? 18 : 24, height: compact ? 18 : 24, borderRadius: '50%',
          background: 'var(--energy-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 10 : 14, fontWeight: 'bold', color: '#000',
        }}>{card.cost}</div>
      </div>
      <div style={{ fontSize: compact ? 18 : 28, textAlign: 'center' }}>{card.icon}</div>
      <div style={{ fontSize: compact ? 9 : 11, fontWeight: 'bold', textAlign: 'center' }}>{card.name}</div>
      {!compact && (
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center' }}>{card.description}</div>
      )}
    </div>
  );
};
