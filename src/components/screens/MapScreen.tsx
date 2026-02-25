import React, { useEffect, useMemo, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { MapNode, NodeType } from '../../types';
import { TopBar } from '../common/TopBar';
import { useMobile } from '../../hooks/useMobile';

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
  const { compact } = useMobile();
  if (!run) return null;

  const mapRef = useRef<HTMLDivElement>(null);

  const { map } = run;
  const spacing = compact ? 80 : 120;
  const centerX = compact ? 180 : 250;
  const rowH = compact ? 65 : 100;
  const nodeR = compact ? 16 : 22;
  const glowR = compact ? 22 : 28;
  const svgW = compact ? 360 : 500;

  // Scroll to bottom on mount so the player sees their starting position
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.scrollTop = mapRef.current.scrollHeight;
    }
  }, [map]);

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
      <TopBar />

      {/* Map area - scrollable, boss at top */}
      <div ref={mapRef} style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: compact ? '8px 0' : '20px 0',
      }}>
        <svg
          width={svgW}
          height={rows.length * rowH + 40}
          style={{ overflow: 'visible' }}
        >
          {/* Draw connections first */}
          {map.nodes.map(node =>
            node.connections.map(connId => {
              const target = map.nodes.find(n => n.id === connId);
              if (!target) return null;
              const fromRow = rows[node.row] || [];
              const toRow = rows[target.row] || [];
              const x1 = centerX + getNodePosition(node, fromRow);
              const y1 = (rows.length - 1 - node.row) * rowH + 40;
              const x2 = centerX + getNodePosition(target, toRow);
              const y2 = (rows.length - 1 - target.row) * rowH + 40;
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
          {rows.map((rowNodes) =>
            rowNodes.map(node => {
              const x = centerX + getNodePosition(node, rowNodes);
              const y = (rows.length - 1 - node.row) * rowH + 40;
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
                    <circle cx={x} cy={y} r={glowR} fill="none" stroke={color} strokeWidth={2} opacity={0.5}>
                      <animate attributeName="r" values={`${glowR};${glowR + 4};${glowR}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x} cy={y} r={nodeR}
                    fill={node.visited ? 'var(--bg-secondary)' : current ? color : 'var(--bg-card)'}
                    stroke={reachable ? color : node.visited ? 'var(--text-muted)' : 'var(--border-color)'}
                    strokeWidth={reachable || current ? 2 : 1}
                    opacity={node.visited && !current ? 0.5 : 1}
                  />
                  <text
                    x={x} y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={compact ? (node.type === 'boss' ? 16 : 12) : (node.type === 'boss' ? 20 : 16)}
                    style={{ pointerEvents: 'none' }}
                  >
                    {nodeIcons[node.type]}
                  </text>
                  {/* Label below */}
                  <text
                    x={x} y={y + (compact ? 26 : 36)}
                    textAnchor="middle"
                    fontSize={compact ? 7 : 12}
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
