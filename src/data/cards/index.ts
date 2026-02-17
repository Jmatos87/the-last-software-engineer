import { frontendCards } from './frontendCards';
import { backendCards } from './backendCards';
import { architectCards } from './architectCards';
import { aiEngineerCards } from './aiEngineerCards';
import { neutralCards } from './neutralCards';

export const cards = { ...frontendCards, ...backendCards, ...architectCards, ...aiEngineerCards, ...neutralCards };

export { getCardDef, getRewardCards } from './helpers';
