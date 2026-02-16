import React, { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { MapNode, NodeType } from '../../types';
import { HpBar } from '../common/HpBar';

const nodeIcons: Record<NodeType, string> = {
  battle: '⚔️',
  elite: '💀',
  rest: '🔥',
  event: '❓',
  shop: '$',
  boss: '👑',
};

const nodeColors: Record<NodeType, string> = {
  battle: 'var(--accent-red)',
  elite: 'var(--accent-purple)',
  rest: 'var(--accent-green)',
  event: 'var(--accent-yellow)',
  shop: 'var(--gold-color)',
  boss: 'var(--accent-orange)',
};

export const MapScreen: React.FC = () => {
  const { run, navigateToNode } = useGameStore();
  if (!run) return null;

  const { map } = run;
  const rows = useMemo(() => {
    const grouped: MapNode[][] = [];
    for (const node of map.nodes) {
      if (!grouped[node.row]) grouped[node.row] = [];
      grouped[node.row].push(node);
    }
    return grouped;
  }, [map.nodes]);

  const isReachable = (node: MapNode): boolean => {
    if (node.visited) return false;
    if (map.currentRow === -1) return node.row === 0;
    const currentNode = map.nodes.find(n => n.id === map.currentNodeId);
    if (!currentNode) return false;
    return currentNode.connections.includes(node.id);
  };

  const getNodePosition = (node: MapNode, nodesInRow: MapNode[]) => {
    const idx = nodesInRow.indexOf(node);
    const total = nodesInRow.length;
    const spacing = 120;
    const offset = -(total - 1) * spacing / 2;
    return offset + idx * spacing;
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{run.character.icon}</span>
          <span>{run.character.name}</span>
          <div style={{ width: 120 }}>
            <HpBar current={run.hp} max={run.maxHp} height={10} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
          <span style={{ color: 'var(--gold-color)' }}>💰 {run.gold}</span>
          <span style={{ color: 'var(--text-secondary)' }}>📦 {run.deck.length} cards</span>
          {run.items.map(item => (
            <span key={item.id} title={`${item.name}: ${item.description}`}>{item.icon}</span>
          ))}
        </div>
      </div>

      {/* Map area - scrollable, boss at top */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
      }}>
        <svg
          width="500"
          height={rows.length * 100 + 40}
          style={{ overflow: 'visible' }}
        >
          {/* Draw connections first */}
          {map.nodes.map(node =>
            node.connections.map(connId => {
              const target = map.nodes.find(n => n.id === connId);
              if (!target) return null;
              const fromRow = rows[node.row] || [];
              const toRow = rows[target.row] || [];
              const x1 = 250 + getNodePosition(node, fromRow);
              const y1 = (rows.length - 1 - node.row) * 100 + 40;
              const x2 = 250 + getNodePosition(target, toRow);
              const y2 = (rows.length - 1 - target.row) * 100 + 40;
              const visited = node.visited && target.visited;
              return (
                <line
                  key={`${node.id}-${connId}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={visited ? 'var(--accent-blue)' : 'var(--border-color)'}
                  strokeWidth={visited ? 2 : 1}
                  strokeDasharray={visited ? 'none' : '4 4'}
                  opacity={0.6}
                />
              );
            })
          )}

          {/* Draw nodes */}
          {rows.map((rowNodes, _rowIdx) =>
            rowNodes.map(node => {
              const x = 250 + getNodePosition(node, rowNodes);
              const y = (rows.length - 1 - node.row) * 100 + 40;
              const reachable = isReachable(node);
              const current = map.currentNodeId === node.id;
              const color = nodeColors[node.type];

              return (
                <g
                  key={node.id}
                  onClick={() => reachable && navigateToNode(node.id)}
                  style={{ cursor: reachable ? 'pointer' : 'default' }}
                >
                  {/* Glow for reachable */}
                  {reachable && (
                    <circle cx={x} cy={y} r={28} fill="none" stroke={color} strokeWidth={2} opacity={0.5}>
                      <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x} cy={y} r={22}
                    fill={node.visited ? 'var(--bg-secondary)' : current ? color : 'var(--bg-card)'}
                    stroke={reachable ? color : node.visited ? 'var(--text-muted)' : 'var(--border-color)'}
                    strokeWidth={reachable || current ? 2 : 1}
                    opacity={node.visited && !current ? 0.5 : 1}
                  />
                  <text
                    x={x} y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={node.type === 'boss' ? 20 : 16}
                    style={{ pointerEvents: 'none' }}
                  >
                    {nodeIcons[node.type]}
                  </text>
                  {/* Label below */}
                  <text
                    x={x} y={y + 36}
                    textAnchor="middle"
                    fontSize={9}
                    fill="var(--text-muted)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.type.toUpperCase()}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
};
