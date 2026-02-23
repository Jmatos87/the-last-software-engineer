import { useState, useEffect, useRef } from 'react';
import act1Bg from '../../assets/act1-bg.png';
import act2Bg from '../../assets/act2-bg.png';
import act3Bg from '../../assets/act3-bg.png';
import { DndContext, DragOverlay, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import type { CardInstance, EnemyInstance } from '../../types';
import { CardComponent, CardOverlay } from './CardComponent';
import { EnemyDisplay } from './EnemyDisplay';
import { HeroCard } from './HeroCard';
import { EnergyOrb } from '../common/EnergyOrb';
import { CardPreview } from '../common/CardPreview';
import { TopBar } from '../common/TopBar';
import { useMobile } from '../../hooks/useMobile';

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
        <TopBar
          extra={<span>Turn {battle.turn}</span>}
          onUseConsumable={(id) => useConsumable(id)}
          onTargetEnemyConsumable={(id) => setTargetingConsumableId(id)}
          battleDisabled={enemyTurnPlaying || battleWon}
        />

        {/* Battle area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? 8 : 16,
          padding: compact ? '4px 8px 0' : '24px 40px 0',
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
          {/* Hero card */}
          <HeroCard heroAnim={heroAnim} />

          {/* VS divider */}
          <div style={{
            fontSize: compact ? 12 : 24,
            color: 'var(--text-muted)',
            fontWeight: 'bold',
          }}>
            VS
          </div>

          {/* Enemies */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}>
          {/* Detonation countdown pills — shown above enemies */}
          {battle.detonationQueue && battle.detonationQueue.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: compact ? 3 : 10,
            }}>
              {battle.detonationQueue.map((qe, i) => {
                const turns = qe.turnsUntilFire ?? 1;
                const color = turns >= 4 ? '#4a9eff'
                  : turns === 3 ? '#22d3ee'
                  : turns === 2 ? '#fbbf24'
                  : '#ef4444';
                const icon = qe.element === 'ice' ? '🧊'
                  : qe.element === 'fire' ? '🔥' : '⚡';
                const value = qe.blockAmount ?? qe.damageAllAmount ?? qe.chainAmount ?? qe.burnApply ?? 0;
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${color}`,
                    fontSize: compact ? 9 : 12,
                    color,
                    fontWeight: 'bold',
                  }}>
                    <span>{icon}</span>
                    <span>{value}</span>
                    <span style={{ opacity: 0.8, fontSize: compact ? 8 : 11 }}>in {turns}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{
            display: 'flex',
            gap: compact ? 6 : 12,
            flexWrap: 'nowrap',
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
