import { v4 as uuidv4 } from 'uuid';
import type { MapNode, NodeType, GameMap } from '../types';

const ROWS = 12;
const MIN_COLS = 2;
const MAX_COLS = 4;

interface MapGenConfig {
  act: number;
  maxElitesPerPath: number;
}

function getConfig(act: number): MapGenConfig {
  return {
    act,
    maxElitesPerPath: act === 1 ? 1 : act === 2 ? 2 : 3,
  };
}

function pickNodeType(row: number, totalRows: number, _act: number): NodeType {
  if (row === 0) return 'battle';
  if (row === totalRows - 1) return 'boss';

  const earlyEnd = Math.floor(totalRows * 0.25);
  const lateStart = Math.floor(totalRows * 0.75);
  const rand = Math.random();

  // Early zone: no elites
  if (row < earlyEnd) {
    if (rand < 0.55) return 'battle';
    if (rand < 0.7) return 'event';
    if (rand < 0.85) return 'shop';
    return 'rest';
  }

  // Late zone: guarantee rest access, harder battles
  if (row >= lateStart) {
    if (rand < 0.4) return 'battle';
    if (rand < 0.55) return 'elite';
    if (rand < 0.7) return 'rest';
    if (rand < 0.85) return 'event';
    return 'shop';
  }

  // Mid zone: elites appear, full variety
  if (rand < 0.35) return 'battle';
  if (rand < 0.50) return 'elite';
  if (rand < 0.65) return 'event';
  if (rand < 0.80) return 'rest';
  if (rand < 0.92) return 'shop';
  return 'battle';
}

function colCountForRow(row: number, totalRows: number): number {
  if (row === 0) return 3; // always 3 starting paths
  if (row === totalRows - 1) return 1; // single boss
  // Vary between MIN_COLS and MAX_COLS, with more variance in mid rows
  const mid = Math.floor(totalRows / 2);
  const distFromMid = Math.abs(row - mid);
  const maxForRow = distFromMid < 3 ? MAX_COLS : 3;
  return MIN_COLS + Math.floor(Math.random() * (maxForRow - MIN_COLS + 1));
}

export function generateMap(act: number = 1): GameMap {
  const config = getConfig(act);
  const totalRows = ROWS;
  const nodes: MapNode[] = [];

  // Create nodes
  for (let row = 0; row < totalRows; row++) {
    const colCount = colCountForRow(row, totalRows);
    for (let col = 0; col < colCount; col++) {
      const node: MapNode = {
        id: uuidv4(),
        row,
        col: row === totalRows - 1 ? 1 : col, // center boss
        type: pickNodeType(row, totalRows, act),
        connections: [],
        visited: false,
      };
      nodes.push(node);
    }
  }

  // ── Guarantees ──

  // Ensure at least 1 rest in mid zone
  const midStart = Math.floor(totalRows * 0.25);
  const midEnd = Math.floor(totalRows * 0.75);
  const restInMid = nodes.filter(n => n.row >= midStart && n.row < midEnd && n.type === 'rest');
  if (restInMid.length === 0) {
    const midNodes = nodes.filter(n => n.row >= midStart && n.row < midEnd && n.type !== 'boss');
    if (midNodes.length > 0) {
      midNodes[Math.floor(Math.random() * midNodes.length)].type = 'rest';
    }
  }

  // Ensure at least 1 rest in late zone (pre-boss)
  const restInLate = nodes.filter(n => n.row >= midEnd && n.row < totalRows - 1 && n.type === 'rest');
  if (restInLate.length === 0) {
    const lateNodes = nodes.filter(n => n.row >= midEnd && n.row < totalRows - 1 && n.type !== 'boss');
    if (lateNodes.length > 0) {
      lateNodes[Math.floor(Math.random() * lateNodes.length)].type = 'rest';
    }
  }

  // ── Elite placement constraints ──
  // Elites never in early zone
  const earlyEnd = Math.floor(totalRows * 0.25);
  nodes.filter(n => n.row < earlyEnd && n.type === 'elite').forEach(n => { n.type = 'battle'; });

  // ── Connect nodes ──
  for (let row = 0; row < totalRows - 1; row++) {
    const currentRow = nodes.filter(n => n.row === row);
    const nextRow = nodes.filter(n => n.row === row + 1);

    if (nextRow.length === 0) continue;

    for (const node of currentRow) {
      if (nextRow.length === 1) {
        // All converge to boss
        node.connections.push(nextRow[0].id);
      } else if (row === 0) {
        // Row 0: each starting node connects to 1 node to create distinct paths
        const idx = currentRow.indexOf(node);
        const shuffled = [...nextRow].sort(() => Math.random() - 0.5);
        node.connections.push(shuffled[idx % shuffled.length].id);
      } else {
        // Connect to 1-2 nodes in next row
        const connectCount = Math.random() < 0.5 ? 1 : 2;
        const available = [...nextRow].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(connectCount, available.length); i++) {
          node.connections.push(available[i].id);
        }
      }
    }

    // Ensure every next row node has at least one incoming connection
    for (const next of nextRow) {
      const hasIncoming = currentRow.some(n => n.connections.includes(next.id));
      if (!hasIncoming) {
        const randomParent = currentRow[Math.floor(Math.random() * currentRow.length)];
        randomParent.connections.push(next.id);
      }
    }
  }

  // ── Elite per-path enforcement ──
  // Walk each path from row 0 to boss and enforce max elites
  const startNodes = nodes.filter(n => n.row === 0);
  for (const start of startNodes) {
    enforceElitesOnPath(start, nodes, config.maxElitesPerPath);
  }

  return {
    nodes,
    currentNodeId: null,
    currentRow: -1,
  };
}

function enforceElitesOnPath(start: MapNode, allNodes: MapNode[], maxElites: number) {
  // BFS/DFS walk from start, tracking elite count
  const visited = new Set<string>();
  const queue: { node: MapNode; eliteCount: number; lastEliteRow: number }[] = [
    { node: start, eliteCount: 0, lastEliteRow: -10 }
  ];

  while (queue.length > 0) {
    const { node, eliteCount, lastEliteRow } = queue.shift()!;
    if (visited.has(node.id)) continue;
    visited.add(node.id);

    // Check if this elite violates constraints
    if (node.type === 'elite') {
      const tooClose = node.row - lastEliteRow < 3; // at least 2 rows between elites
      const tooMany = eliteCount >= maxElites;

      if (tooClose || tooMany) {
        node.type = 'battle'; // downgrade to normal battle
      }
    }

    const newEliteCount = node.type === 'elite' ? eliteCount + 1 : eliteCount;
    const newLastEliteRow = node.type === 'elite' ? node.row : lastEliteRow;

    for (const connId of node.connections) {
      const next = allNodes.find(n => n.id === connId);
      if (next && !visited.has(next.id)) {
        queue.push({ node: next, eliteCount: newEliteCount, lastEliteRow: newLastEliteRow });
      }
    }
  }
}
