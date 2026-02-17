import { act1Enemies } from './act1Enemies';
import { act2Enemies } from './act2Enemies';
import { act3Enemies } from './act3Enemies';

export const enemies = { ...act1Enemies, ...act2Enemies, ...act3Enemies };

export { getNormalEncounter, getEliteEncounter, getBossEncounter, normalEncounters, eliteEncounters, bossEncounters } from './encounters';
