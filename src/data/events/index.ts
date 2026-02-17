import { neutralEvents } from './neutralEvents';
import { frontendEvents } from './frontendEvents';
import { backendEvents } from './backendEvents';
import { architectEvents } from './architectEvents';
import { aiEngineerEvents } from './aiEngineerEvents';
import { consumableEvents } from './consumableEvents';

export const events = [
  ...neutralEvents,
  ...frontendEvents,
  ...backendEvents,
  ...architectEvents,
  ...aiEngineerEvents,
  ...consumableEvents,
];
