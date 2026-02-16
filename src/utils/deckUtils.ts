import { v4 as uuidv4 } from 'uuid';
import type { CardDef, CardInstance } from '../types';

export function createCardInstance(def: CardDef, upgraded = false): CardInstance {
  return {
    ...def,
    instanceId: uuidv4(),
    upgraded,
    ...(upgraded && def.upgradedEffects
      ? {
          effects: def.upgradedEffects,
          description: def.upgradedDescription || def.description,
          name: def.name + '+',
        }
      : {}),
  };
}

export function shuffleDeck<T>(deck: T[]): T[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function drawCards(
  drawPile: CardInstance[],
  discardPile: CardInstance[],
  count: number
): { drawn: CardInstance[]; newDrawPile: CardInstance[]; newDiscardPile: CardInstance[] } {
  const drawn: CardInstance[] = [];
  let pile = [...drawPile];
  let discard = [...discardPile];

  for (let i = 0; i < count; i++) {
    if (pile.length === 0) {
      if (discard.length === 0) break;
      pile = shuffleDeck(discard);
      discard = [];
    }
    drawn.push(pile.pop()!);
  }

  return { drawn, newDrawPile: pile, newDiscardPile: discard };
}
