/**
 * Clase ExpStone - Representa una piedra de experiencia.
 * Al recogerla, el jugador obtiene experiencia.
 */

import Phaser from 'phaser';

export default class ExpStone extends Phaser.Physics.Arcade.Sprite {
  experienceReward: number;

  constructor(scene: Phaser.Scene, x: number, y: number, experienceReward: number = 10) {
    super(scene, x, y, 'exp_stone');
    this.experienceReward = experienceReward;
    this.setDisplaySize(12, 12);
  }

  /**
   * Serializa el estado de la piedra de experiencia.
   */
  serialize() {
    return {
      experienceReward: this.experienceReward,
      x: this.x,
      y: this.y,
    };
  }
}
