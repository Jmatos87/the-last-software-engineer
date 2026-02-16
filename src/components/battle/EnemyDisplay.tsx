import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { EnemyInstance, StatusEffect } from '../../types';
import { calculateDamage, calculateStressDamage } from '../../utils/battleEngine';
import { HpBar } from '../common/HpBar';
import { StatusEffects } from '../common/StatusEffects';
import { Tooltip } from '../common/Tooltip';

interface EnemyDisplayProps {
  enemy: EnemyInstance;
  isTargeted?: boolean;
  playerStatusEffects: StatusEffect;
  isAttacking?: boolean;
  isDying?: boolean;
  isFleeing?: boolean;
  speechBubble?: string | null;
}

export const EnemyDisplay: React.FC<EnemyDisplayProps> = ({ enemy, isTargeted, playerStatusEffects, isAttacking, isDying, isFleeing, speechBubble }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `enemy-${enemy.instanceId}`,
    data: { enemyInstanceId: enemy.instanceId },
  });

  const [shaking, setShaking] = useState(false);
  const [prevHp, setPrevHp] = useState(enemy.currentHp);

  useEffect(() => {
    if (enemy.currentHp < prevHp) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
    setPrevHp(enemy.currentHp);
  }, [enemy.currentHp]);

  const move = enemy.currentMove;
  const hidden = !!enemy.hideIntent;

  // Calculate actual damage after modifiers (strength, weak, vulnerable)
  const calcDmg = move.damage
    ? calculateDamage(move.damage, enemy.statusEffects, playerStatusEffects)
    : 0;
  const calcStressDmg = move.stressDamage
    ? calculateStressDamage(move.stressDamage, enemy.statusEffects, playerStatusEffects, enemy.id)
    : 0;

  // For buff/buff_allies moves, applyToTarget means buffing self/allies, not debuffing the player
  const isBuff = move.type === 'buff' || move.type === 'buff_allies';

  // Status effect display info — covers every key in StatusEffect
  const effectMeta: Record<string, { icon: string; name: string; desc: string; color: string }> = {
    vulnerable: { icon: '💔', name: 'Vulnerable', desc: 'take 50% more damage', color: 'var(--accent-red)' },
    weak: { icon: '😵', name: 'Weak', desc: 'deal 25% less damage', color: 'var(--accent-orange)' },
    poison: { icon: '☠️', name: 'Poison', desc: 'lose HP each turn', color: 'var(--accent-purple)' },
    hope: { icon: '✨', name: 'Hope', desc: 'explodes into stress when it expires', color: 'var(--accent-yellow)' },
    cringe: { icon: '😬', name: 'Cringe', desc: 'stress healing is halved', color: 'var(--accent-orange)' },
    ghosted: { icon: '👻', name: 'Ghosted', desc: 'curse card added each turn', color: 'var(--accent-purple)' },
    strength: { icon: '😤', name: 'Strength', desc: '+1 damage per attack per stack', color: 'var(--accent-red)' },
    dexterity: { icon: '🧠', name: 'Dexterity', desc: '+1 block per stack', color: 'var(--accent-blue)' },
    regen: { icon: '🌿', name: 'Regen', desc: 'heal HP each turn', color: 'var(--accent-green)' },
    selfCare: { icon: '🛁', name: 'Self Care', desc: 'reduce stress each turn', color: 'var(--accent-green)' },
    networking: { icon: '🤝', name: 'Networking', desc: 'draw extra cards each turn', color: 'var(--accent-blue)' },
    savingsAccount: { icon: '🏦', name: 'Savings Account', desc: 'retain block between turns', color: 'var(--accent-yellow)' },
    counterOffer: { icon: '💼', name: 'Counter-Offer', desc: 'deal damage back when hit', color: 'var(--accent-orange)' },
    hustleCulture: { icon: '💪', name: 'Hustle Culture', desc: '+1 energy, +3 stress per turn', color: 'var(--accent-red)' },
  };

  // Helper: build inline icon + tooltip line for a status effect entry
  const addEffect = (
    effects: StatusEffect,
    parts: { text: string; color: string }[],
    lines: string[],
    prefix: string,
  ) => {
    for (const [key, value] of Object.entries(effects)) {
      if (value === undefined || value === 0) continue;
      const meta = effectMeta[key];
      if (!meta) continue;
      const sign = value > 0 ? '+' : '';
      parts.push({ text: `${meta.icon}${sign}${value}`, color: meta.color });
      lines.push(`${prefix} ${sign}${value} ${meta.name} (${meta.desc})`);
    }
  };

  // Build intent parts (inline icons) and tooltip lines together
  const intentParts: { text: string; color: string }[] = [];
  const tooltipLines: string[] = [move.name];

  if (calcDmg > 0) {
    const dmgText = `${calcDmg}${move.times && move.times > 1 ? `x${move.times}` : ''}`;
    intentParts.push({ text: `⚔️${dmgText}`, color: 'var(--accent-red)' });
    tooltipLines.push(`Deal ${calcDmg}${move.times && move.times > 1 ? ` x${move.times}` : ''} damage`);
  }
  if (calcStressDmg > 0) {
    const stressText = `${calcStressDmg}${move.times && move.times > 1 ? `x${move.times}` : ''}`;
    intentParts.push({ text: `😰${stressText}`, color: 'var(--accent-purple)' });
    tooltipLines.push(`Inflict ${calcStressDmg}${move.times && move.times > 1 ? ` x${move.times}` : ''} stress`);
  }
  if (move.block) {
    intentParts.push({ text: `🛡️${move.block}`, color: 'var(--block-color)' });
    tooltipLines.push(`Gain ${move.block} block`);
  }
  if (move.discardCount) {
    intentParts.push({ text: `🗑️${move.discardCount}`, color: 'var(--accent-yellow)' });
    tooltipLines.push(`Force you to discard ${move.discardCount} card${move.discardCount > 1 ? 's' : ''}`);
  }
  if (move.exhaustCount) {
    intentParts.push({ text: `🔥${move.exhaustCount}`, color: 'var(--accent-orange)' });
    tooltipLines.push(`Exhaust ${move.exhaustCount} of your cards (removed from combat)`);
  }
  if (move.goldSteal) {
    intentParts.push({ text: `💸${move.goldSteal}g`, color: 'var(--gold-color)' });
    tooltipLines.push(`Steal ${move.goldSteal} of your gold`);
  }
  if (move.healAmount) {
    intentParts.push({ text: `💊${move.healAmount}`, color: 'var(--accent-green)' });
    tooltipLines.push(`Heal all allies for ${move.healAmount} HP`);
  }

  // Self buffs
  if (move.applyToSelf) {
    addEffect(move.applyToSelf, intentParts, tooltipLines, 'Gain');
  }

  // applyToTarget — context depends on move type
  if (move.applyToTarget) {
    if (isBuff) {
      const who = move.type === 'buff_allies' ? 'Buff allies' : 'Gain';
      addEffect(move.applyToTarget, intentParts, tooltipLines, who);
    } else {
      addEffect(move.applyToTarget, intentParts, tooltipLines, 'Apply');
    }
  }

  const intentTooltip = tooltipLines.join(' · ');

  return (
    <div
      ref={setNodeRef}
      className={isFleeing ? 'animate-enemy-flee' : isDying ? 'animate-enemy-death' : isAttacking ? 'animate-enemy-attack' : shaking ? 'animate-shake' : ''}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 12,
        background: isOver ? 'rgba(248, 113, 113, 0.1)' : 'transparent',
        border: `2px solid ${isOver ? 'var(--accent-red)' : isTargeted ? 'var(--accent-yellow)' : 'transparent'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'all var(--transition-fast)',
        minWidth: 100,
      }}
    >
      {/* Speech bubble placeholder — fixed height so layout doesn't shift */}
      <div style={{ minHeight: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {speechBubble && (
          <div className="animate-speech-bubble" style={{
            position: 'relative',
            background: 'var(--bg-card)',
            border: '1px solid var(--accent-yellow)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px',
            fontSize: 11,
            color: 'var(--text-primary)',
            fontStyle: 'italic',
            maxWidth: 160,
            width: 'max-content',
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {speechBubble}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--accent-yellow)',
            }} />
          </div>
        )}
      </div>

      {/* Enemy icon */}
      <div style={{
        fontSize: enemy.isBoss ? 64 : enemy.isElite ? 52 : 44,
        lineHeight: 1,
        filter: shaking ? 'brightness(2)' : 'none',
        transition: 'filter 0.2s',
      }}>
        {enemy.icon}
      </div>

      {/* Name */}
      <div style={{
        fontSize: 12,
        fontWeight: 'bold',
        color: enemy.isBoss ? 'var(--accent-orange)' : enemy.isElite ? 'var(--accent-purple)' : 'var(--text-primary)',
      }}>
        {enemy.name}
      </div>

      {/* Block */}
      {enemy.block > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          color: 'var(--block-color)',
        }}>
          🛡️ {enemy.block}
        </div>
      )}

      {/* HP bar */}
      <div style={{ width: 100 }}>
        <HpBar current={enemy.currentHp} max={enemy.maxHp} height={8} />
      </div>

      {/* Status effects */}
      <StatusEffects effects={enemy.statusEffects} />

      {/* Intent — below HP */}
      {hidden ? (
        <div style={{
          padding: '4px 10px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 13,
          color: 'var(--text-muted)',
          fontStyle: 'italic',
        }}>
          ❓ ???
        </div>
      ) : (
        <Tooltip text={intentTooltip}>
          <div style={{
            padding: '4px 8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 140,
            cursor: 'help',
          }}>
            <span>{move.icon}</span>
            {intentParts.map((part, i) => (
              <span key={i} style={{ color: part.color, whiteSpace: 'nowrap' }}>
                {part.text}
              </span>
            ))}
          </div>
        </Tooltip>
      )}
    </div>
  );
};
