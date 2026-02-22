/**
 * Clase Wall - Representa una pared en el mapa.
 * Las paredes son obstáculos estáticos que bloquean el movimiento.
 */

import Phaser from 'phaser';

export default class Wall extends Phaser.Physics.Arcade.Sprite {
  wallWidth: number;
  wallHeight: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    // Crear una textura temporal para la pared
    const key = `wall_${x}_${y}`;

    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0x8b4513, 0.8); // Color marrón
      graphics.fillRect(0, 0, width, height);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    }

    super(scene, x, y, key);

    this.wallWidth = width;
    this.wallHeight = height;
  }

  /**
   * Obtiene el color de la pared (para debug)
   */
  static getWallColor(): number {
    return 0x8b4513; // Marrón
  }
}
