import { v4 as uuidv4 } from 'uuid';
import type { MapNode, NodeType, GameMap } from '../types';

const ROWS = 7;
const COLS = 3;

function pickNodeType(row: number): NodeType {
  if (row === 0) return 'battle';
  if (row === ROWS - 1) return 'boss';

  const rand = Math.random();

  // No elites in rows 1-2
  if (row <= 2) {
    if (rand < 0.6) return 'battle';
    if (rand < 0.75) return 'event';
    if (rand < 0.9) return 'shop';
    return 'rest';
  }

  // Rows 3-5: ensure variety, allow elites
  if (rand < 0.35) return 'battle';
  if (rand < 0.5) return 'elite';
  if (rand < 0.65) return 'event';
  if (rand < 0.8) return 'rest';
  if (rand < 0.95) return 'shop';
  return 'battle';
}

export function generateMap(): GameMap {
  const nodes: MapNode[] = [];

  // Create nodes
  for (let row = 0; row < ROWS; row++) {
    const colCount = row === ROWS - 1 ? 1 : COLS;
    for (let col = 0; col < colCount; col++) {
      const node: MapNode = {
        id: uuidv4(),
        row,
        col: row === ROWS - 1 ? 1 : col, // center only boss node
        type: pickNodeType(row),
        connections: [],
        visited: false,
      };
      nodes.push(node);
    }
  }

  // Ensure at least one rest in rows 3-5
  const restInMiddle = nodes.filter(n => n.row >= 3 && n.row <= 5 && n.type === 'rest');
  if (restInMiddle.length === 0) {
    const middleNodes = nodes.filter(n => n.row >= 3 && n.row <= 5);
    if (middleNodes.length > 0) {
      const pick = middleNodes[Math.floor(Math.random() * middleNodes.length)];
      pick.type = 'rest';
    }
  }

  // Connect nodes: each node connects to 1-2 nodes in the next row
  for (let row = 0; row < ROWS - 1; row++) {
    const currentRow = nodes.filter(n => n.row === row);
    const nextRow = nodes.filter(n => n.row === row + 1);

    if (nextRow.length === 0) continue;

    for (const node of currentRow) {
      if (nextRow.length === 1) {
        // Last row before boss — all converge
        node.connections.push(nextRow[0].id);
      } else if (row === 0) {
        // Row 0: each starting node connects to exactly 1 node in row 1
        // to create clearly distinct paths. Shuffle row 1 and assign 1:1.
        const idx = currentRow.indexOf(node);
        const shuffled = [...nextRow].sort(() => Math.random() - 0.5);
        node.connections.push(shuffled[idx % shuffled.length].id);
      } else {
        // Connect to at least 1, maybe 2
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
        // For row 0→1, pick a random starting node that doesn't already connect here
        const randomParent = currentRow[Math.floor(Math.random() * currentRow.length)];
        randomParent.connections.push(next.id);
      }
    }
  }

  return {
    nodes,
    currentNodeId: null,
    currentRow: -1,
  };
}
