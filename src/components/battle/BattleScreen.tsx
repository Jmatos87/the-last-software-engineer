import React, { useState, useEffect, useRef } from 'react';
import { engineerRoster } from '../../data/engineers';
import type { EngineerPassive } from '../../types';
import act1Bg from '../../assets/act1-bg.png';
import act2Bg from '../../assets/act2-bg.png';
import act3Bg from '../../assets/act3-bg.png';
import { DndContext, DragOverlay, useDroppable, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import type { CardInstance, Deployment, EnemyInstance } from '../../types';
import { CardComponent, CardOverlay } from './CardComponent';
import { EnemyDisplay } from './EnemyDisplay';
import { ConsumableBar } from './ConsumableBar';
import { HpBar } from '../common/HpBar';
import { EnergyOrb } from '../common/EnergyOrb';
import { StatusEffects } from '../common/StatusEffects';
import { CardPreview } from '../common/CardPreview';
import { TopBar } from '../common/TopBar';
import { useMobile } from '../../hooks/useMobile';

function formatEngineerPassive(p: EngineerPassive): string {
  const parts: string[] = [];
  if (p.energy) parts.push(`+${p.energy}⚡`);
  if (p.draw) parts.push(`+${p.draw}draw`);
  if (p.block) parts.push(`+${p.block}blk`);
  if (p.dodge) parts.push(`+${p.dodge}dge`);
  if (p.resilience) parts.push(`+${p.resilience}res`);
  if (p.counterOffer) parts.push(`+${p.counterOffer}ctr`);
  if (p.generateTokens) parts.push(`+${p.generateTokens}tok`);
  if (p.queueBlock) parts.push(`⏳${p.queueBlock}blk`);
  if (p.queueDamageAll) parts.push(`⏳${p.queueDamageAll}AoE`);
  if (p.vulnerableRandom) parts.push(`vuln`);
  if (p.bleedRandom) parts.push(`bleed`);
  return parts.join(' ');
}

const DeploymentPanel: React.FC<{ deployments: Deployment[] }> = ({ deployments }) => {
  if (deployments.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
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
            padding: '3px 7px',
            fontSize: 11,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            minWidth: 56,
          }}>
            <span>{dep.icon} {dep.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>{parts.join(' ')}</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{dep.turnsLeft}t left</span>
          </div>
        );
      })}
    </div>
  );
};

const PlayerStatusPanel: React.FC = () => {
  const run = useGameStore(s => s.run);
  const battle = useGameStore(s => s.battle);
  const { setNodeRef, isOver } = useDroppable({
    id: 'self-target',
    data: { selfTarget: true },
  });

  if (!run || !battle) return null;

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: '8px 12px',
        background: isOver ? 'rgba(74, 222, 128, 0.1)' : 'var(--bg-card)',
        border: `2px solid ${isOver ? 'var(--accent-green)' : 'var(--border-color)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 140,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
        {battle.playerBlock > 0 && (
          <span style={{ fontSize: 12, color: 'var(--block-color)', whiteSpace: 'nowrap' }}>
            🛡️{battle.playerBlock}
          </span>
        )}
        <div style={{ flex: 1 }}>
          <HpBar current={run.hp} max={run.maxHp} height={10} label="HP" />
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <HpBar current={run.stress} max={run.maxStress} height={10} color="var(--accent-purple)" label="STRESS" />
      </div>
      <StatusEffects effects={battle.playerStatusEffects} />
    </div>
  );
};

export const BattleScreen: React.FC = () => {
  const { run, battle, playCard, endTurn, useConsumable } = useGameStore();
  const { compact } = useMobile();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);
  const [draggedCard, setDraggedCard] = useState<CardInstance | null>(null);
  const [preview, setPreview] = useState<{ card: CardInstance; x: number; y: number } | null>(null);
  const [heroAnim, setHeroAnim] = useState<'' | 'animate-shake' | 'animate-stress'>('');
  const [attackingEnemyId, setAttackingEnemyId] = useState<string | null>(null);
  const [speechBubbles, setSpeechBubbles] = useState<Record<string, string>>({});
  const [dyingEnemies, setDyingEnemies] = useState<EnemyInstance[]>([]);
  const [fleeingEnemies, setFleeingEnemies] = useState<EnemyInstance[]>([]);
  const [enemyTurnPlaying, setEnemyTurnPlaying] = useState(false);
  const [targetingConsumableId, setTargetingConsumableId] = useState<string | null>(null);
  const prevHpRef = useRef<number | null>(null);
  const prevStressRef = useRef<number | null>(null);
  const prevEnemiesRef = useRef<EnemyInstance[]>([]);
  const fleeingIdsRef = useRef<Set<string>>(new Set());

  // Track enemy disappearances — distinguish deaths from flee
  useEffect(() => {
    if (!battle) { prevEnemiesRef.current = []; return; }
    const currentIds = new Set(battle.enemies.map(e => e.instanceId));
    const gone = prevEnemiesRef.current.filter(e => !currentIds.has(e.instanceId));
    if (gone.length > 0) {
      const fled = gone.filter(e => fleeingIdsRef.current.has(e.instanceId));
      const died = gone.filter(e => !fleeingIdsRef.current.has(e.instanceId));
      if (died.length > 0) {
        setDyingEnemies(prev => [...prev, ...died]);
        setTimeout(() => {
          setDyingEnemies(prev => prev.filter(d => !died.some(dd => dd.instanceId === d.instanceId)));
        }, 600);
      }
      if (fled.length > 0) {
        setFleeingEnemies(prev => [...prev, ...fled]);
        setTimeout(() => {
          setFleeingEnemies(prev => prev.filter(f => !fled.some(ff => ff.instanceId === f.instanceId)));
          fled.forEach(e => fleeingIdsRef.current.delete(e.instanceId));
        }, 700);
      }
    }
    prevEnemiesRef.current = battle.enemies;
  }, [battle?.enemies]);

  useEffect(() => {
    if (!run) return;
    if (prevHpRef.current !== null && run.hp < prevHpRef.current) {
      setHeroAnim('animate-shake');
      const t = setTimeout(() => setHeroAnim(''), 400);
      return () => clearTimeout(t);
    }
    prevHpRef.current = run.hp;
  }, [run?.hp]);

  useEffect(() => {
    if (!run) return;
    if (prevStressRef.current !== null && run.stress > prevStressRef.current) {
      setHeroAnim('animate-stress');
      const t = setTimeout(() => setHeroAnim(''), 500);
      return () => clearTimeout(t);
    }
    prevStressRef.current = run.stress;
  }, [run?.stress]);

  if (!run || !battle) return null;

  const battleWon = battle.enemies.length === 0;

  const handleEndTurn = async () => {
    if (enemyTurnPlaying || battleWon) return;
    setEnemyTurnPlaying(true);

    // Snapshot enemies that will attack (have attack-type moves)
    const attackingEnemies = battle.enemies.filter(e => {
      const t = e.currentMove.type;
      return t === 'attack' || t === 'dual_attack' || t === 'attack_defend' || t === 'stress_attack' || t === 'discard';
    });

    // Detect which enemies will vanish (Ghost Company on move index 2 with debuff type)
    const willVanish = battle.enemies.filter(e =>
      e.id === 'ghost_company' && e.moveIndex === 2 && e.currentMove.type === 'debuff'
    );
    willVanish.forEach(e => fleeingIdsRef.current.add(e.instanceId));

    // Stagger attack animations with speech bubbles
    for (const enemy of attackingEnemies) {
      const quip = enemy.currentMove.quip;
      setAttackingEnemyId(enemy.instanceId);
      if (quip) {
        const eid = enemy.instanceId;
        setSpeechBubbles(prev => ({ ...prev, [eid]: quip }));
        setTimeout(() => setSpeechBubbles(prev => {
          const next = { ...prev };
          delete next[eid];
          return next;
        }), 3500);
      }
      await new Promise(r => setTimeout(r, 600));
      setAttackingEnemyId(null);
      await new Promise(r => setTimeout(r, 150));
    }

    // Resolve the actual turn (deaths/flees will be caught by the useEffect above)
    endTurn();
    setEnemyTurnPlaying(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as CardInstance | undefined;
    if (card) setDraggedCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedCard(null);
    const { active, over } = event;
    if (!over || enemyTurnPlaying || battleWon) return;

    const card = active.data.current?.card as CardInstance | undefined;
    if (!card) return;

    if (!battle.nextCardCostZero && card.cost > battle.energy) return;

    const overData = over.data.current;

    if (card.target === 'enemy' || card.target === 'all_enemies') {
      const enemyInstanceId = overData?.enemyInstanceId;
      if (enemyInstanceId) {
        playCard(card.instanceId, enemyInstanceId);
      }
    } else if (card.target === 'self') {
      if (over.id === 'self-target' || overData?.selfTarget || overData?.enemyInstanceId) {
        playCard(card.instanceId);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
      }}>
        {/* Top bar */}
        <TopBar extra={<span>Turn {battle.turn}</span>} />

        {/* Battle area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? 24 : 80,
          padding: compact ? '12px 12px 0' : '24px 40px 0',
          position: 'relative',
          ...(run?.act === 1 && {
            backgroundImage: `url(${act1Bg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }),
          ...(run?.act === 2 && {
            backgroundImage: `url(${act2Bg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }),
          ...(run?.act === 3 && {
            backgroundImage: `url(${act3Bg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }),
        }}>
          {/* Player side */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}>
            {/* Spacer matching enemy speech bubble placeholder so icons align horizontally */}
            <div style={{ minHeight: compact ? 23 : 38 }} />
            <div className={heroAnim} style={{ fontSize: compact ? 32 : 56 }}>{run.character.icon}</div>
            <PlayerStatusPanel />
            {run.character.id === 'frontend_dev' && battle && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                {/* Flow State meter */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>FLOW</span>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {Array.from({ length: 8 }, (_, i) => {
                      const flow = battle.flow ?? 0;
                      const isFilled = i < flow;
                      const isAlmostOverflow = flow >= 6;
                      const color = isAlmostOverflow ? '#f87171' : '#a78bfa';
                      return (
                        <div key={i} style={{
                          width: compact ? 6 : 8,
                          height: compact ? 12 : 16,
                          borderRadius: 2,
                          background: isFilled ? color : 'transparent',
                          border: `1px solid ${color}`,
                          opacity: isFilled ? 1 : 0.25,
                          transition: 'all 0.15s',
                        }} />
                      );
                    })}
                  </div>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 'bold',
                    color: (battle.flow ?? 0) >= 6 ? '#f87171' : '#a78bfa',
                  }}>
                    {(battle.flow ?? 0) >= 6 ? `⚡ FLOW ${battle.flow ?? 0}` : `🌊 ${battle.flow ?? 0}`}
                  </span>
                </div>
              </div>
            )}
            {run.character.id === 'ai_engineer' && battle && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                {/* Temperature gauge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>TEMPERATURE</span>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {Array.from({ length: 11 }, (_, i) => {
                      const isCold = i <= 3;
                      const isHot = i >= 7;
                      const color = isCold ? '#60a5fa' : isHot ? '#f87171' : '#4ade80';
                      const isActive = i === (battle.temperature ?? 5);
                      return (
                        <div key={i} style={{
                          width: compact ? 6 : 8,
                          height: compact ? 12 : 16,
                          borderRadius: 2,
                          background: isActive ? color : 'transparent',
                          border: `1px solid ${color}`,
                          opacity: isActive ? 1 : 0.3,
                          transition: 'all 0.2s',
                        }} />
                      );
                    })}
                  </div>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 'bold',
                    color: (battle.temperature ?? 5) <= 3 ? '#60a5fa' : (battle.temperature ?? 5) >= 7 ? '#f87171' : '#4ade80',
                  }}>
                    {(battle.temperature ?? 5) <= 3 ? '❄️ COLD' : (battle.temperature ?? 5) >= 7 ? '🔥 HOT' : `🌡️ ${battle.temperature ?? 5}`}
                  </span>
                </div>
                {/* Token counter */}
                {(battle.tokens ?? 0) > 0 && (
                  <div style={{
                    background: 'rgba(245,158,11,0.15)',
                    border: '1px solid rgba(245,158,11,0.5)',
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: compact ? 10 : 12,
                    color: '#f59e0b',
                    fontWeight: 'bold',
                  }}>
                    🪙 {battle.tokens} TOKENS
                  </div>
                )}
              </div>
            )}
            {run.character.id === 'backend_dev' && battle && (battle.detonationQueue || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>SCHEDULED</span>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 160 }}>
                  {(battle.detonationQueue || []).map((qe, i) => {
                    const color = qe.element === 'ice' ? '#60a5fa' : qe.element === 'fire' ? '#f87171' : '#fbbf24';
                    const icon = qe.element === 'ice' ? '🧊' : qe.element === 'fire' ? '🔥' : '⚡';
                    const val = qe.blockAmount ?? qe.damageAllAmount ?? qe.chainAmount ?? 0;
                    const suffix = qe.blockAmount ? ' blk' : qe.chainAmount ? '/ea' : '';
                    return (
                      <div key={i} style={{
                        background: `rgba(0,0,0,0.5)`,
                        border: `1px solid ${color}`,
                        borderRadius: 6,
                        padding: '2px 6px',
                        fontSize: 10,
                        color,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}>
                        {icon} {val}{suffix}
                        {qe.burnApply ? ` +${qe.burnApply}🔥` : ''}
                      </div>
                    );
                  })}
                </div>
                {/* Batch bonus indicator */}
                {new Set((battle.detonationQueue || []).map(q => q.element)).size >= 2 && (
                  <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 'bold' }}>
                    {new Set((battle.detonationQueue || []).map(q => q.element)).size >= 3 ? '💥 SYSTEM MELTDOWN ×2.0' : '⚡ BATCH BONUS ×1.5'}
                  </div>
                )}
              </div>
            )}
            {/* Architect — Engineer Slots + Blueprint */}
            {run.character.id === 'architect' && battle && (
              <div className="architect-slots-display">
                <div className="engineer-slots">
                  {(battle.engineerSlots || []).length === 0 && (
                    <span className="no-slots-hint">No engineers slotted</span>
                  )}
                  {(() => {
                    const slots = battle.engineerSlots || [];
                    const isHarmonic = slots.length >= 2 && slots.every(s => s.id === slots[0]?.id);
                    const resonantIndices = new Set<number>();
                    for (let i = 0; i < slots.length - 1; i++) {
                      if (slots[i].id === slots[i + 1].id) {
                        resonantIndices.add(i);
                        resonantIndices.add(i + 1);
                      }
                    }
                    return slots.map((slot, i) => (
                      <div key={i} className={`engineer-slot-badge ${isHarmonic ? 'slot-harmonic' : resonantIndices.has(i) ? 'slot-resonant' : ''}`}>
                        <span className="slot-icon">{slot.icon}</span>
                        <span className="slot-name">{slot.name}</span>
                        <span className="slot-passive">{formatEngineerPassive(slot.passiveEffect)}</span>
                      </div>
                    ));
                  })()}
                  <span className="slot-count-badge">
                    {(battle.engineerSlots || []).length}/{battle.maxEngineerSlots || 3} slots
                  </span>
                </div>
                <div className="blueprint-display">
                  <span className="blueprint-label">BLUEPRINT:</span>
                  {(battle.blueprint || []).map((engineerId, i) => (
                    <React.Fragment key={i}>
                      <span className={`blueprint-step ${i < (battle.blueprintProgress || 0) ? 'matched' : 'pending'}`}>
                        {engineerRoster[engineerId]?.icon ?? '?'} {engineerRoster[engineerId]?.name ?? engineerId}
                      </span>
                      {i < (battle.blueprint || []).length - 1 && <span style={{ margin: '0 3px', color: '#6b7280' }}>→</span>}
                    </React.Fragment>
                  ))}
                  <span className="blueprint-progress">({battle.blueprintProgress || 0}/{(battle.blueprint || []).length})</span>
                </div>
              </div>
            )}
            <ConsumableBar
              onTargetEnemy={(cId) => setTargetingConsumableId(cId)}
              disabled={enemyTurnPlaying || battleWon}
            />
            {battle.deployments?.length > 0 && (
              <DeploymentPanel deployments={battle.deployments} />
            )}
            {battle.nextCardCostZero && (
              <div style={{
                background: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.5)',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#fbbf24',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                ⚡ Next card is FREE
              </div>
            )}
          </div>

          {/* VS divider */}
          <div style={{
            fontSize: compact ? 16 : 24,
            color: 'var(--text-muted)',
            fontWeight: 'bold',
          }}>
            VS
          </div>

          {/* Enemies */}
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            zIndex: targetingConsumableId ? 10 : undefined,
          }}>
            {battle.enemies.map(enemy => (
              <div
                key={enemy.instanceId}
                onClick={() => {
                  if (targetingConsumableId) {
                    useConsumable(targetingConsumableId, enemy.instanceId);
                    setTargetingConsumableId(null);
                  }
                }}
                style={{ cursor: targetingConsumableId ? 'crosshair' : undefined }}
              >
                <EnemyDisplay
                  enemy={enemy}
                  isTargeted={draggedCard?.target === 'enemy' || draggedCard?.target === 'all_enemies' || !!targetingConsumableId}
                  playerStatusEffects={battle.playerStatusEffects}
                  isAttacking={attackingEnemyId === enemy.instanceId}
                  speechBubble={speechBubbles[enemy.instanceId] || null}
                />
              </div>
            ))}
            {dyingEnemies.map(enemy => (
              <EnemyDisplay
                key={`dying-${enemy.instanceId}`}
                enemy={enemy}
                playerStatusEffects={battle.playerStatusEffects}
                isDying
              />
            ))}
            {fleeingEnemies.map(enemy => (
              <EnemyDisplay
                key={`flee-${enemy.instanceId}`}
                enemy={enemy}
                playerStatusEffects={battle.playerStatusEffects}
                isFleeing
              />
            ))}
          </div>
        </div>

        {/* Hand area */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: compact ? '6px 8px' : '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: compact ? 6 : 12,
        }}>
          {/* Draw pile */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: compact ? 2 : 4,
            minWidth: compact ? 34 : 50,
          }}>
            <div style={{
              width: compact ? 28 : 40,
              height: compact ? 36 : 50,
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-blue)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: compact ? 11 : 14,
              fontWeight: 'bold',
            }}>
              {battle.drawPile.length}
            </div>
            <span style={{ fontSize: compact ? 7 : 9, color: 'var(--text-muted)' }}>DRAW</span>
          </div>

          {/* Energy orb */}
          <EnergyOrb current={battle.energy} max={battle.maxEnergy} />

          {/* Hand */}
          <div style={{
            flex: 1,
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
            overflowX: 'auto',
            padding: '4px 0',
          }}>
            {battle.hand.map(card => (
              <div
                key={card.instanceId}
                onMouseEnter={compact ? undefined : e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={compact ? undefined : () => setPreview(null)}
              >
                <CardComponent
                  card={card}
                  disabled={!battle.nextCardCostZero && card.cost > battle.energy}
                />
              </div>
            ))}
            {battle.hand.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 20 }}>
                No cards in hand
              </div>
            )}
          </div>

          {/* End turn button */}
          <button
            className="danger"
            onClick={handleEndTurn}
            disabled={enemyTurnPlaying || battleWon}
            style={{ padding: compact ? '6px 12px' : '12px 20px', fontSize: compact ? 11 : 14, whiteSpace: 'nowrap', opacity: (enemyTurnPlaying || battleWon) ? 0.5 : 1 }}
          >
            {battleWon ? 'Victory!' : enemyTurnPlaying ? 'Enemy Turn...' : 'End Turn'}
          </button>

          {/* Discard pile */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: compact ? 2 : 4,
            minWidth: compact ? 34 : 50,
          }}>
            <div style={{
              width: compact ? 28 : 40,
              height: compact ? 36 : 50,
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-red)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: compact ? 11 : 14,
              fontWeight: 'bold',
            }}>
              {battle.discardPile.length}
            </div>
            <span style={{ fontSize: compact ? 7 : 9, color: 'var(--text-muted)' }}>DISCARD</span>
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {draggedCard ? <CardOverlay card={draggedCard} /> : null}
      </DragOverlay>

      {targetingConsumableId && (
        <div
          onClick={() => setTargetingConsumableId(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5,
            cursor: 'not-allowed',
          }}
        />
      )}

      {targetingConsumableId && (
        <div style={{
          position: 'fixed',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent-yellow)',
          color: '#000',
          padding: '4px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          fontWeight: 'bold',
          zIndex: 10,
        }}>
          Select target enemy (click to cancel)
        </div>
      )}

      {preview && (
        <CardPreview card={preview.card} x={preview.x} y={preview.y} />
      )}
    </DndContext>
  );
};
