/**
 * Clase Rune - Representa una runa (buff temporal).
 * Proporciona efectos temporales que duran hasta 3 minutos.
 */

import Phaser from 'phaser';
import { RuneType, RuneRarity, RUNE_CONFIG } from '../utils/constants';

export default class Rune extends Phaser.Physics.Arcade.Sprite {
  runeType: RuneType;
  rarity: RuneRarity;
  baseDuration: number; // en milisegundos
  durationRemaining: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    runeType: RuneType,
    rarity: RuneRarity = RuneRarity.COMMON
  ) {
    // Seleccionar textura según tipo de runa
    const textureKey = `rune_${runeType.toLowerCase()}`;

    super(scene, x, y, textureKey);

    this.runeType = runeType;
    this.rarity = rarity;
    this.baseDuration = RUNE_CONFIG.TYPES[runeType].duration;
    this.durationRemaining = this.baseDuration;
    this.setDisplaySize(16, 16);
  }

  /**
   * Obtiene el color de la runa según su tipo (solo para referencia).
   */
  private static getRuneColor(runeType: RuneType): number {
    switch (runeType) {
      case RuneType.SPEED:
        return 0x00ff00; // Verde
      case RuneType.ATTACK_SPEED:
        return 0xff8800; // Naranja
      case RuneType.LIFE:
        return 0xff0000; // Rojo
      case RuneType.ENERGY:
        return 0x0088ff; // Azul
      case RuneType.ELEMENT:
        return 0xff00ff; // Magenta
      case RuneType.ACCUMULATION:
        return 0xffff00; // Amarillo
      case RuneType.RESISTANCE:
        return 0x884400; // Marrón oscuro
      default:
        return 0xcccccc; // Gris
    }
  }

  /**
   * Obtiene los efectos aplicados por esta runa.
   */
  getEffects(): Record<string, number | string> {
    return RUNE_CONFIG.TYPES[this.runeType].effects || {};
  }

  /**
   * Actualiza la duración restante de la runa.
   */
  updateDuration(deltaSeconds: number): void {
    this.durationRemaining -= deltaSeconds * 1000; // Convertir a milisegundos
  }

  /**
   * Verifica si la runa aún está activa.
   */
  isActive(): boolean {
    return this.durationRemaining > 0;
  }

  /**
   * Serializa el estado de la runa.
   */
  serialize() {
    return {
      runeType: this.runeType,
      rarity: this.rarity,
      baseDuration: this.baseDuration,
      durationRemaining: this.durationRemaining,
      x: this.x,
      y: this.y,
    };
  }
}
