import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { CardInstance, StatusEffect, ItemDef } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { calculateDamage, calculateBlock, calculateCopium } from '../../utils/battleEngine';
import { useMobile } from '../../hooks/useMobile';

function getEffectiveEffects(card: CardInstance, playerEffects: StatusEffect, items: ItemDef[], defenderEffects: StatusEffect, dodgeScalesDamage: number = 0, pipelineData: number = 0) {
  const effects = card.upgraded && card.upgradedEffects ? card.upgradedEffects : card.effects;
  const result: Record<string, { base: number; effective: number }> = {};
  const isSkill = card.type === 'skill';
  const dodgeBonus = dodgeScalesDamage * (playerEffects.dodge || 0);
  const pipelineDmgBonus = (effects.damagePerPipeline || 0) * pipelineData;
  const pipelineAoeDmgBonus = (effects.damageAllPerPipeline || 0) * pipelineData;
  const pipelineBlockBonus = (effects.blockPerPipeline || 0) * pipelineData;

  if (effects.damage) {
    const effective = calculateDamage(effects.damage + dodgeBonus + pipelineDmgBonus, playerEffects, defenderEffects, items);
    result.damage = { base: effects.damage, effective };
  } else if (pipelineDmgBonus > 0) {
    // Cards with ONLY damagePerPipeline and no base damage (e.g. data_explosion)
    const effective = calculateDamage(pipelineDmgBonus + dodgeBonus, playerEffects, defenderEffects, items);
    result.pipelineDamage = { base: effects.damagePerPipeline || 0, effective };
  }
  if (effects.damageAll) {
    const effective = calculateDamage(effects.damageAll + dodgeBonus + pipelineAoeDmgBonus, playerEffects, defenderEffects, items);
    result.damageAll = { base: effects.damageAll, effective };
  } else if (pipelineAoeDmgBonus > 0) {
    const effective = calculateDamage(pipelineAoeDmgBonus + dodgeBonus, playerEffects, defenderEffects, items);
    result.pipelineDamageAll = { base: effects.damageAllPerPipeline || 0, effective };
  }
  if (effects.block) {
    // Base block through calculateBlock (resilience, bonusBlock, skillBlockMultiplier)
    // Pipeline block bonus added raw — matches engine behavior
    const effective = calculateBlock(effects.block, playerEffects, items, isSkill) + pipelineBlockBonus;
    result.block = { base: effects.block, effective };
  }
  if (effects.damageIfFlowHigh) {
    const effective = calculateDamage(effects.damageIfFlowHigh, playerEffects, defenderEffects, items);
    result.damageIfFlowHigh = { base: effects.damageIfFlowHigh, effective };
  }
  if (effects.damageAllIfFlowHigh) {
    const effective = calculateDamage(effects.damageAllIfFlowHigh, playerEffects, defenderEffects, items);
    result.damageAllIfFlowHigh = { base: effects.damageAllIfFlowHigh, effective };
  }
  if (effects.damageIfHot) {
    const effective = calculateDamage(effects.damageIfHot, playerEffects, defenderEffects, items);
    result.damageIfHot = { base: effects.damageIfHot, effective };
  }
  if (effects.damageAllIfHot) {
    const effective = calculateDamage(effects.damageAllIfHot, playerEffects, defenderEffects, items);
    result.damageAllIfHot = { base: effects.damageAllIfHot, effective };
  }
  // blockIfCold: conditional block preview (parity with damageIfHot)
  if (effects.blockIfCold) {
    const effective = calculateBlock(effects.blockIfCold, playerEffects, items, isSkill);
    result.blockIfCold = { base: effects.blockIfCold, effective };
  }
  if (effects.copium) {
    const effective = calculateCopium(effects.copium, playerEffects, items);
    result.copium = { base: effects.copium, effective };
  }
  // Per-slot scaling (Architect)
  if (effects.damagePerSlot) {
    const effective = calculateDamage(effects.damagePerSlot, playerEffects, defenderEffects, items);
    result.damagePerSlot = { base: effects.damagePerSlot, effective };
  }
  if (effects.damageAllPerSlot) {
    const effective = calculateDamage(effects.damageAllPerSlot, playerEffects, defenderEffects, items);
    result.damageAllPerSlot = { base: effects.damageAllPerSlot, effective };
  }
  if (effects.blockPerSlot) {
    const effective = calculateBlock(effects.blockPerSlot, playerEffects, items, isSkill);
    result.blockPerSlot = { base: effects.blockPerSlot, effective };
  }
  // Per-dodge scaling (Frontend)
  if (effects.damagePerDodge) {
    const effective = calculateDamage(effects.damagePerDodge, playerEffects, defenderEffects, items);
    result.damagePerDodge = { base: effects.damagePerDodge, effective };
  }
  // Per-bleed scaling (Frontend)
  if (effects.damagePerBleed) {
    const effective = calculateDamage(effects.damagePerBleed, playerEffects, defenderEffects, items);
    result.damagePerBleed = { base: effects.damagePerBleed, effective };
  }
  // Per-burn scaling (Backend)
  if (effects.damagePerBurn) {
    const effective = calculateDamage(effects.damagePerBurn, playerEffects, defenderEffects, items);
    result.damagePerBurn = { base: effects.damagePerBurn, effective };
  }
  // Conditional enemy-intent damage (AI Engineer)
  if (effects.damageIfEnemyAttacks) {
    const effective = calculateDamage(effects.damageIfEnemyAttacks, playerEffects, defenderEffects, items);
    result.damageIfEnemyAttacks = { base: effects.damageIfEnemyAttacks, effective };
  }
  if (effects.damageIfEnemyBuffs) {
    const effective = calculateDamage(effects.damageIfEnemyBuffs, playerEffects, defenderEffects, items);
    result.damageIfEnemyBuffs = { base: effects.damageIfEnemyBuffs, effective };
  }
  // Per-card-exhausted (Neutral)
  if (effects.damagePerCardExhausted) {
    const effective = calculateDamage(effects.damagePerCardExhausted, playerEffects, defenderEffects, items);
    result.damagePerCardExhausted = { base: effects.damagePerCardExhausted, effective };
  }

  return result;
}

function renderDescription(card: CardInstance, playerEffects: StatusEffect, items: ItemDef[], defenderEffects: StatusEffect, dodgeScalesDamage: number = 0, pipelineData: number = 0): React.ReactNode {
  const computed = getEffectiveEffects(card, playerEffects, items, defenderEffects, dodgeScalesDamage, pipelineData);
  const desc = card.upgraded && card.upgradedDescription ? card.upgradedDescription : card.description;

  // Build replacement map: base value -> { effective, key }
  // We need to replace specific number occurrences that match card effect values
  const replacements: { pattern: RegExp; effective: number; base: number }[] = [];

  if (computed.damage) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.damage.base}(?: damage(?!\\.? to ALL)|\\.)`),
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
  // Pipeline-only damage cards (no base damage, only damagePerPipeline)
  if (computed.pipelineDamage) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.pipelineDamage.base} damage per`),
      effective: computed.pipelineDamage.effective,
      base: computed.pipelineDamage.base,
    });
  }
  if (computed.pipelineDamageAll) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.pipelineDamageAll.base} damage per`),
      effective: computed.pipelineDamageAll.effective,
      base: computed.pipelineDamageAll.base,
    });
  }
  if (computed.damageIfFlowHigh) {
    replacements.push({
      pattern: new RegExp(`deal ${computed.damageIfFlowHigh.base} more(?! to ALL)`),
      effective: computed.damageIfFlowHigh.effective,
      base: computed.damageIfFlowHigh.base,
    });
  }
  if (computed.damageAllIfFlowHigh) {
    replacements.push({
      pattern: new RegExp(`deal ${computed.damageAllIfFlowHigh.base} more to ALL`),
      effective: computed.damageAllIfFlowHigh.effective,
      base: computed.damageAllIfFlowHigh.base,
    });
  }
  if (computed.damageIfHot) {
    replacements.push({
      pattern: new RegExp(`deal ${computed.damageIfHot.base} more(?! to ALL)`),
      effective: computed.damageIfHot.effective,
      base: computed.damageIfHot.base,
    });
  }
  if (computed.damageAllIfHot) {
    replacements.push({
      pattern: new RegExp(`deal ${computed.damageAllIfHot.base} more to ALL`),
      effective: computed.damageAllIfHot.effective,
      base: computed.damageAllIfHot.base,
    });
  }
  if (computed.block) {
    replacements.push({
      pattern: new RegExp(`(?:Gain |gain )${computed.block.base} [Bb]lock`),
      effective: computed.block.effective,
      base: computed.block.base,
    });
  }
  // blockIfCold: conditional block preview (parity with damageIfHot)
  if (computed.blockIfCold) {
    replacements.push({
      pattern: new RegExp(`\\+${computed.blockIfCold.base} block`),
      effective: computed.blockIfCold.effective,
      base: computed.blockIfCold.base,
    });
  }
  if (computed.copium) {
    replacements.push({
      pattern: new RegExp(`Reduce ${computed.copium.base} Stress`),
      effective: computed.copium.effective,
      base: computed.copium.base,
    });
  }
  // Per-slot damage: "Deal N damage per slotted engineer"
  if (computed.damagePerSlot) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.damagePerSlot.base} damage per slotted`),
      effective: computed.damagePerSlot.effective,
      base: computed.damagePerSlot.base,
    });
  }
  if (computed.damageAllPerSlot) {
    replacements.push({
      pattern: new RegExp(`Deal ${computed.damageAllPerSlot.base} damage per slotted`),
      effective: computed.damageAllPerSlot.effective,
      base: computed.damageAllPerSlot.base,
    });
  }
  // Per-slot block: "Gain N block per slotted"
  if (computed.blockPerSlot) {
    replacements.push({
      pattern: new RegExp(`(?:Gain |gain )${computed.blockPerSlot.base} block per slotted`),
      effective: computed.blockPerSlot.effective,
      base: computed.blockPerSlot.base,
    });
  }
  // Per-dodge damage: "N damage per...Dodge" or "N per Dodge"
  if (computed.damagePerDodge) {
    replacements.push({
      pattern: new RegExp(`${computed.damagePerDodge.base} (?:damage )?per (?:current )?[Dd]odge`),
      effective: computed.damagePerDodge.effective,
      base: computed.damagePerDodge.base,
    });
  }
  // Per-bleed damage: "N more per Bleed" or "N damage per Bleed"
  if (computed.damagePerBleed) {
    replacements.push({
      pattern: new RegExp(`${computed.damagePerBleed.base} (?:more|damage) per Bleed`),
      effective: computed.damagePerBleed.effective,
      base: computed.damagePerBleed.base,
    });
  }
  // Per-burn damage: "stacks x N"
  if (computed.damagePerBurn) {
    replacements.push({
      pattern: new RegExp(`stacks x ${computed.damagePerBurn.base}`),
      effective: computed.damagePerBurn.effective,
      base: computed.damagePerBurn.base,
    });
  }
  // Conditional damage on enemy attack: "+N" or "deal N"
  if (computed.damageIfEnemyAttacks) {
    replacements.push({
      pattern: new RegExp(`(?:\\+|deal )${computed.damageIfEnemyAttacks.base}(?!\\d)`),
      effective: computed.damageIfEnemyAttacks.effective,
      base: computed.damageIfEnemyAttacks.base,
    });
  }
  // Conditional damage on enemy buff: "+N"
  if (computed.damageIfEnemyBuffs) {
    replacements.push({
      pattern: new RegExp(`\\+${computed.damageIfEnemyBuffs.base}(?!\\d)`),
      effective: computed.damageIfEnemyBuffs.effective,
      base: computed.damageIfEnemyBuffs.base,
    });
  }
  // Per-card-exhausted damage: "N damage per card"
  if (computed.damagePerCardExhausted) {
    replacements.push({
      pattern: new RegExp(`${computed.damagePerCardExhausted.base} damage per card`),
      effective: computed.damagePerCardExhausted.effective,
      base: computed.damagePerCardExhausted.base,
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
  const dodgeScalesDamage = battle?.dodgeScalesDamage ?? 0;
  // If any enemy is vulnerable, show the buffed damage on attack cards
  const anyEnemyVulnerable = battle?.enemies.some(e => (e.statusEffects.vulnerable || 0) > 0);
  const defenderEffects: StatusEffect = anyEnemyVulnerable ? { vulnerable: 1 } : {};
  const pipelineData = battle?.pipelineData ?? 0;
  const dynamicDescription = battle
    ? renderDescription(card, playerEffects, items, defenderEffects, dodgeScalesDamage, pipelineData)
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
        width: compact ? 68 : 120,
        minHeight: compact ? 82 : 160,
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
          width: compact ? 16 : 24,
          height: compact ? 16 : 24,
          borderRadius: '50%',
          background: 'var(--energy-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? 9 : 14,
          fontWeight: 'bold',
          color: '#000',
        }}>
          {battle?.nextCardCostZero ? 0 : Math.max(0, card.cost - (battle?.nextCardCostReduction || 0))}
        </div>
        {!compact && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {card.type}
          </span>
        )}
      </div>

      {/* Icon */}
      <div style={{ fontSize: compact ? 14 : 28, textAlign: 'center', margin: compact ? '1px 0' : '4px 0' }}>
        {card.icon}
      </div>

      {/* Name */}
      <div style={{
        fontSize: compact ? 8 : 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: card.upgraded ? 'var(--accent-green)' : 'var(--text-primary)',
      }}>
        {card.name}
      </div>

      {/* Description (hidden on compact) */}
      {!compact && (
        <div style={{
          fontSize: 12,
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
        fontSize: compact ? 7 : 12,
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
  const nextCardFree = useGameStore(s => s.battle?.nextCardCostZero ?? false);
  const nextCardCostReduction = useGameStore(s => s.battle?.nextCardCostReduction ?? 0);
  const borderColor = card.type === 'attack' ? 'var(--card-attack)'
    : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';

  return (
    <div style={{
      width: compact ? 68 : 120,
      minHeight: compact ? 82 : 160,
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
          width: compact ? 16 : 24, height: compact ? 16 : 24, borderRadius: '50%',
          background: 'var(--energy-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 9 : 14, fontWeight: 'bold', color: '#000',
        }}>{nextCardFree ? 0 : Math.max(0, card.cost - (nextCardCostReduction || 0))}</div>
      </div>
      <div style={{ fontSize: compact ? 14 : 28, textAlign: 'center' }}>{card.icon}</div>
      <div style={{ fontSize: compact ? 8 : 12, fontWeight: 'bold', textAlign: 'center' }}>{card.name}</div>
      {!compact && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>{card.description}</div>
      )}
    </div>
  );
};
