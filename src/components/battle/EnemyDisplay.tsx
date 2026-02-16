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
}

export const EnemyDisplay: React.FC<EnemyDisplayProps> = ({ enemy, isTargeted, playerStatusEffects, isAttacking, isDying, isFleeing }) => {
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

  const intentIcon = enemy.currentMove.icon;
  const move = enemy.currentMove;

  // Calculate actual damage after modifiers (strength, weak, vulnerable)
  const calcDmg = move.damage
    ? calculateDamage(move.damage, enemy.statusEffects, playerStatusEffects)
    : 0;
  const calcStressDmg = move.stressDamage
    ? calculateStressDamage(move.stressDamage, enemy.statusEffects, playerStatusEffects, enemy.id)
    : 0;

  const intentDesc = (() => {
    const parts: string[] = [move.name + ':'];
    if (calcDmg) parts.push(`${calcDmg}${move.times && move.times > 1 ? `x${move.times}` : ''} dmg`);
    if (calcStressDmg) parts.push(`${calcStressDmg}${move.times && move.times > 1 ? `x${move.times}` : ''} stress`);
    if (move.discardCount) parts.push(`discard ${move.discardCount}`);
    if (move.exhaustCount) parts.push(`exhaust ${move.exhaustCount}`);
    if (move.goldSteal) parts.push(`steal ${move.goldSteal}g`);
    if (move.healAmount) parts.push(`heal allies ${move.healAmount}`);
    if (move.block) parts.push(`${move.block} block`);
    if (move.applyToSelf?.strength) parts.push(`+${move.applyToSelf.strength} str`);
    if (move.applyToSelf?.regen) parts.push(`+${move.applyToSelf.regen} regen`);
    if (move.applyToTarget?.vulnerable) parts.push(`${move.applyToTarget.vulnerable} vuln`);
    if (move.applyToTarget?.weak) parts.push(`${move.applyToTarget.weak} weak`);
    if (move.applyToTarget?.hope) parts.push(`${move.applyToTarget.hope} hope`);
    if (move.applyToTarget?.cringe) parts.push(`${move.applyToTarget.cringe} cringe`);
    if (move.applyToTarget?.ghosted) parts.push(`${move.applyToTarget.ghosted} ghosted`);
    return parts.join(' ');
  })();

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
      {/* Intent */}
      <Tooltip text={intentDesc}>
        <div style={{
          padding: '4px 8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          cursor: 'help',
        }}>
          <span>{intentIcon}</span>
          {calcDmg > 0 && (
            <span style={{ color: 'var(--accent-red)' }}>
              ⚔️{calcDmg}{move.times && move.times > 1 ? `x${move.times}` : ''}
            </span>
          )}
          {calcStressDmg > 0 && (
            <span style={{ color: 'var(--accent-purple)' }}>
              😰{calcStressDmg}{move.times && move.times > 1 ? `x${move.times}` : ''}
            </span>
          )}
          {move.discardCount && (
            <span style={{ color: 'var(--accent-yellow)' }}>
              🗑️{move.discardCount}
            </span>
          )}
          {move.exhaustCount && (
            <span style={{ color: 'var(--accent-orange)' }}>
              🔥{move.exhaustCount}
            </span>
          )}
          {move.goldSteal && (
            <span style={{ color: 'var(--gold-color)' }}>
              💸{move.goldSteal}
            </span>
          )}
          {move.healAmount && (
            <span style={{ color: 'var(--accent-green)' }}>
              💊{move.healAmount}
            </span>
          )}
          {move.block && (
            <span style={{ color: 'var(--block-color)' }}>{move.block}</span>
          )}
        </div>
      </Tooltip>

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
    </div>
  );
};
