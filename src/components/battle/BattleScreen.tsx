import React, { useState } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';
import type { CardInstance } from '../../types';
import { CardComponent, CardOverlay } from './CardComponent';
import { EnemyDisplay } from './EnemyDisplay';
import { HpBar } from '../common/HpBar';
import { EnergyOrb } from '../common/EnergyOrb';
import { StatusEffects } from '../common/StatusEffects';
import { CardPreview } from '../common/CardPreview';

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

  if (!run || !battle) return null;

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as CardInstance | undefined;
    if (card) setDraggedCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedCard(null);
    const { active, over } = event;
    if (!over) return;

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
        <div style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>{run.character.icon}</span>
            <span style={{ fontSize: 14 }}>{run.character.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>Turn {battle.turn}</span>
            {run.items.map(item => (
              <span key={item.id} title={`${item.name}: ${item.description}`}>{item.icon}</span>
            ))}
          </div>
        </div>

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
            <div style={{ fontSize: 56 }}>{run.character.icon}</div>
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
          }}>
            {battle.enemies.map(enemy => (
              <EnemyDisplay
                key={enemy.instanceId}
                enemy={enemy}
                isTargeted={draggedCard?.target === 'enemy' || draggedCard?.target === 'all_enemies'}
                playerStatusEffects={battle.playerStatusEffects}
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
            onClick={endTurn}
            style={{ padding: '12px 20px', fontSize: 14, whiteSpace: 'nowrap' }}
          >
            End Turn
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
