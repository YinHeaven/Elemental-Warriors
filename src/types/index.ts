/**
 * Tipos globales de TypeScript para Elemental Warriors.
 */

import { ClassType, ElementType } from '../utils/constants';

export interface PlayerStats {
  maxHealth: number;
  health: number;
  damage: number;
  attackSpeed: number; // ataques por segundo
  movement: number; // píxeles por segundo
  maxMana: number;
  mana: number;
}

export interface PlayerData {
  classType: ClassType;
  level: number;
  experience: number;
  stats: PlayerStats;
  element: ElementType;
  gemEnergy: number;
  position: { x: number; y: number };
}

export interface GemData {
  element: ElementType;
  energy: number;
  ownerId?: number;
  position: { x: number; y: number };
}

export interface RuneData {
  type: string;
  rarity: string;
  duration: number;
  effects: Record<string, number | string>;
}

export interface GameConfig {
  width: number;
  height: number;
  mapWidth: number;
  mapHeight: number;
  tileSize: number;
}
