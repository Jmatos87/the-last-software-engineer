import React, { useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import type { CardInstance, EnemyInstance } from '../../types';
import { CardComponent, CardOverlay } from './CardComponent';
import { EnemyDisplay } from './EnemyDisplay';
import { HpBar } from '../common/HpBar';
import { EnergyOrb } from '../common/EnergyOrb';
import { StatusEffects } from '../common/StatusEffects';
import { CardPreview } from '../common/CardPreview';
import { TopBar } from '../common/TopBar';

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
  const { run, battle, playCard, endTurn } = useGameStore();
  const [draggedCard, setDraggedCard] = useState<CardInstance | null>(null);
  const [preview, setPreview] = useState<{ card: CardInstance; x: number; y: number } | null>(null);
  const [heroAnim, setHeroAnim] = useState<'' | 'animate-shake' | 'animate-stress'>('');
  const [attackingEnemyId, setAttackingEnemyId] = useState<string | null>(null);
  const [dyingEnemies, setDyingEnemies] = useState<EnemyInstance[]>([]);
  const [fleeingEnemies, setFleeingEnemies] = useState<EnemyInstance[]>([]);
  const [enemyTurnPlaying, setEnemyTurnPlaying] = useState(false);
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

    // Stagger attack animations
    for (const enemy of attackingEnemies) {
      setAttackingEnemyId(enemy.instanceId);
      await new Promise(r => setTimeout(r, 400));
      setAttackingEnemyId(null);
      await new Promise(r => setTimeout(r, 100));
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

    if (card.cost > battle.energy) return;

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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
          gap: 80,
          padding: '0 40px',
          position: 'relative',
        }}>
          {/* Player side */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}>
            <div className={heroAnim} style={{ fontSize: 56 }}>{run.character.icon}</div>
            <PlayerStatusPanel />
          </div>

          {/* VS divider */}
          <div style={{
            fontSize: 24,
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
          }}>
            {battle.enemies.map(enemy => (
              <EnemyDisplay
                key={enemy.instanceId}
                enemy={enemy}
                isTargeted={draggedCard?.target === 'enemy' || draggedCard?.target === 'all_enemies'}
                playerStatusEffects={battle.playerStatusEffects}
                isAttacking={attackingEnemyId === enemy.instanceId}
              />
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
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          {/* Draw pile */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            minWidth: 50,
          }}>
            <div style={{
              width: 40,
              height: 50,
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-blue)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
              {battle.drawPile.length}
            </div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>DRAW</span>
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
                onMouseEnter={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => setPreview(null)}
              >
                <CardComponent
                  card={card}
                  disabled={card.cost > battle.energy}
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
            style={{ padding: '12px 20px', fontSize: 14, whiteSpace: 'nowrap', opacity: (enemyTurnPlaying || battleWon) ? 0.5 : 1 }}
          >
            {battleWon ? 'Victory!' : enemyTurnPlaying ? 'Enemy Turn...' : 'End Turn'}
          </button>

          {/* Discard pile */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            minWidth: 50,
          }}>
            <div style={{
              width: 40,
              height: 50,
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-red)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
              {battle.discardPile.length}
            </div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>DISCARD</span>
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {draggedCard ? <CardOverlay card={draggedCard} /> : null}
      </DragOverlay>

      {preview && (
        <CardPreview card={preview.card} x={preview.x} y={preview.y} />
      )}
    </DndContext>
  );
};
