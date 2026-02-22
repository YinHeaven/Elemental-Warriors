/**
 * Clase WindStone - Representa una piedra de viento.
 * Al recogerla, el jugador obtiene un buff de velocidad.
 */

import Phaser from 'phaser';
import { WIND_STONE_CONFIG } from '../utils/constants';
import { getWindStoneDuration } from '../utils/formulas';

export default class WindStone extends Phaser.Physics.Arcade.Sprite {
  baseDuration: number; // en milisegundos

  constructor(scene: Phaser.Scene, x: number, y: number, level: number = 1) {
    super(scene, x, y, 'wind_stone');
    this.baseDuration = getWindStoneDuration(level);
    this.setDisplaySize(12, 12);
  }

  /**
   * Obtiene la duración del buff según el nivel.
   */
  getDuration(level: number): number {
    return getWindStoneDuration(level);
  }

  /**
   * Serializa el estado de la piedra de viento.
   */
  serialize() {
    return {
      baseDuration: this.baseDuration,
      x: this.x,
      y: this.y,
    };
  }
}
