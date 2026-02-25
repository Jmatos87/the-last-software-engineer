import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import { HpBar } from '../common/HpBar';
import { StatusEffects } from '../common/StatusEffects';
import { useMobile } from '../../hooks/useMobile';
import type { Deployment, QueuedEffect } from '../../types';

const DeploymentPanel: React.FC<{ deployments: Deployment[] }> = ({ deployments }) => {
  if (deployments.length === 0) return null;
  const { compact } = useMobile();
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
      {deployments.map((dep, i) => {
        const parts: string[] = [];
        if (dep.attackPerTurn) parts.push(`⚔️${dep.attackPerTurn}`);
        if (dep.blockPerTurn) parts.push(`🛡️${dep.blockPerTurn}`);
        if (dep.poisonPerTurn) parts.push(`☠️${dep.poisonPerTurn}`);
        return (
          <div key={i} style={{
            background: 'rgba(74,158,255,0.1)',
            border: '1px solid rgba(74,158,255,0.4)',
            borderRadius: 6,
            padding: compact ? '2px 5px' : '3px 7px',
            fontSize: compact ? 8 : 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}>
            <span>{dep.icon} {dep.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>{parts.join(' ')}</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{dep.turnsLeft}t</span>
          </div>
        );
      })}
    </div>
  );
};

interface HeroCardProps {
  heroAnim: '' | 'animate-shake' | 'animate-stress';
  detonationQueue?: QueuedEffect[];
}

export const HeroCard: React.FC<HeroCardProps> = ({ heroAnim, detonationQueue }) => {
  const run = useGameStore(s => s.run);
  const battle = useGameStore(s => s.battle);
  const { compact } = useMobile();
  const { setNodeRef, isOver } = useDroppable({
    id: 'self-target',
    data: { selfTarget: true },
  });

  if (!run || !battle) return null;

  const charId = run.character.id;

  const cardClasses = [
    'entity-card',
    'hero',
    isOver && 'is-over',
  ].filter(Boolean).join(' ');

  // Flow gauge (Frontend)
  const flowGauge = charId === 'frontend_dev' ? (() => {
    const flow = battle.flow ?? 0;
    const isAlmostOverflow = flow >= 6;
    const color = isAlmostOverflow ? '#f87171' : '#a78bfa';
    return (
      <div className="hero-gauge-col">
        <span style={{
          fontSize: compact ? 6 : 12,
          lineHeight: 1,
          color,
        }}>
          {isAlmostOverflow ? '⚡' : '🌊'}
        </span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
          {Array.from({ length: 8 }, (_, i) => {
            const isFilled = i < flow;
            return (
              <div key={i} className="gauge-pip" style={{
                width: compact ? 6 : 10,
                height: compact ? 3 : 5,
                background: isFilled ? color : 'transparent',
                border: `1px solid ${color}`,
                opacity: isFilled ? 1 : 0.25,
              }} />
            );
          })}
        </div>
        <span style={{
          fontSize: compact ? 6 : 12,
          fontWeight: 'bold',
          color,
          lineHeight: 1,
        }}>
          {flow}
        </span>
      </div>
    );
  })() : null;

  // Temperature gauge (AI Engineer)
  const tempGauge = charId === 'ai_engineer' ? (() => {
    const temp = battle.temperature ?? 5;
    const tempColor = temp <= 3 ? '#60a5fa' : temp >= 7 ? '#f87171' : '#4ade80';
    return (
      <div className="hero-gauge-col">
        <span style={{
          fontSize: compact ? 6 : 12,
          lineHeight: 1,
          color: tempColor,
        }}>
          {temp <= 3 ? '❄️' : temp >= 7 ? '🔥' : '🌡️'}
        </span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
          {Array.from({ length: 11 }, (_, i) => {
            const isCold = i <= 3;
            const isHot = i >= 7;
            const pipColor = isCold ? '#60a5fa' : isHot ? '#f87171' : '#4ade80';
            const isActive = i === temp;
            return (
              <div key={i} className="gauge-pip" style={{
                width: compact ? 6 : 10,
                height: compact ? 3 : 4,
                background: isActive ? pipColor : 'transparent',
                border: `1px solid ${pipColor}`,
                opacity: isActive ? 1 : 0.3,
              }} />
            );
          })}
        </div>
        <span style={{
          fontSize: compact ? 6 : 12,
          fontWeight: 'bold',
          color: tempColor,
          lineHeight: 1,
        }}>
          {temp}
        </span>
      </div>
    );
  })() : null;

  const gauge = flowGauge || tempGauge;

  return (
    <div ref={setNodeRef} className={cardClasses}>
      <div className={`hero-content-col ${heroAnim}`}>
        {/* Hero icon / portrait */}
        <div className="portrait-frame hero">
          {run.character.portrait ? (
            <img
              src={run.character.portrait}
              alt={run.character.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: compact ? 'top' : 'center', transform: 'scale(1.3)' }}
            />
          ) : (
            <span style={{ fontSize: compact ? 32 : 72, lineHeight: 1 }}>
              {run.character.icon}
            </span>
          )}
        </div>

        {/* Name */}
        <div style={{
          fontSize: compact ? 9 : 13,
          fontWeight: 'bold',
          color: 'var(--accent-blue)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}>
          {run.character.name}
        </div>

        <div className="card-separator" />

        {/* Bars section: optional gauge to the left of HP/stress */}
        <div style={{ display: 'flex', gap: compact ? 3 : 6, width: '100%', alignItems: 'stretch' }}>
          {gauge}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: compact ? 2 : 4 }}>
            {/* Block + HP bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 2 : 4 }}>
              {battle.playerBlock > 0 && (
                <span style={{ fontSize: compact ? 8 : 12, color: 'var(--block-color)', whiteSpace: 'nowrap' }}>
                  🛡️{battle.playerBlock}
                </span>
              )}
              <div style={{ flex: 1 }}>
                <HpBar current={run.hp} max={run.maxHp} height={compact ? 5 : 8} />
              </div>
            </div>
            {/* Stress bar */}
            <HpBar current={run.stress} max={run.maxStress} height={compact ? 4 : 7} color="var(--accent-purple)" />
            {/* Status effects — inside HP/stress column so they sit right below */}
            <StatusEffects effects={battle.playerStatusEffects} />
          </div>
        </div>

        {/* Ice detonation countdown pills */}
        {detonationQueue && (() => {
          const iceQueue = detonationQueue.filter(qe => qe.element === 'ice');
          if (iceQueue.length === 0) return null;
          return (
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              {iceQueue.map((qe, i) => {
                const turns = qe.turnsUntilFire ?? 1;
                const color = turns >= 4 ? '#4a9eff' : turns === 3 ? '#22d3ee' : turns === 2 ? '#fbbf24' : '#ef4444';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    padding: compact ? '1px 4px' : '1px 6px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${color}`,
                    fontSize: compact ? 8 : 12,
                    color, fontWeight: 'bold',
                  }}>
                    <span>🧊</span>
                    <span>{qe.blockAmount ?? 0}</span>
                    <span style={{ opacity: 0.7 }}>T{turns}</span>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Pipeline Data counter — AI Engineer */}
        {charId === 'ai_engineer' && (battle.pipelineData ?? 0) > 0 && (
          <div style={{
            background: 'rgba(96,165,250,0.15)',
            border: '1px solid rgba(96,165,250,0.5)',
            borderRadius: 4,
            padding: compact ? '1px 4px' : '2px 6px',
            fontSize: compact ? 7 : 12,
            color: '#60a5fa',
            fontWeight: 'bold',
          }}>
            📊 {battle.pipelineData}
          </div>
        )}

        {/* Deployments */}
        {battle.deployments?.length > 0 && (
          <DeploymentPanel deployments={battle.deployments} />
        )}

        {/* Next card free indicator */}
        {battle.nextCardCostZero && (
          <div style={{
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.5)',
            borderRadius: 4,
            padding: compact ? '1px 4px' : '2px 6px',
            fontSize: compact ? 7 : 12,
            color: '#fbbf24',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            ⚡ FREE
          </div>
        )}
      </div>
    </div>
  );
};
