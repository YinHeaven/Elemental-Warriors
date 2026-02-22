/**
 * Clase Gem - Representa una gema elemental en el juego.
 * Puede estar en el suelo o ser llevada por un jugador.
 */

import Phaser from 'phaser';
import { ElementType, GEM_CONFIG } from '../utils/constants';

export default class Gem extends Phaser.Physics.Arcade.Sprite {
  element: ElementType;
  energy: number;
  ownerId: number | null;

  constructor(scene: Phaser.Scene, x: number, y: number, element: ElementType) {
    // Seleccionar textura según elemento
    let textureKey = 'fire_gem';
    switch (element) {
      case ElementType.ICE:
        textureKey = 'ice_gem';
        break;
      case ElementType.LIGHTNING:
        textureKey = 'lightning_gem';
        break;
      default:
        textureKey = 'fire_gem';
    }

    super(scene, x, y, textureKey);

    this.element = element;
    this.energy = GEM_CONFIG.MAX_ENERGY;
    this.ownerId = null;
    this.setDisplaySize(16, 16);
  }

  /**
   * Obtiene el color de la gema según el elemento (static para uso futuro).
   */
  private static getElementColor(element: ElementType): number {
    switch (element) {
      case ElementType.FIRE:
        return 0xff5500; // Naranja
      case ElementType.ICE:
        return 0x00ddff; // Cian
      case ElementType.LIGHTNING:
        return 0xffff00; // Amarillo
      default:
        return 0xcccccc; // Gris
    }
  }

  /**
   * Asigna un dueño a la gema.
   */
  setOwner(playerId: number): void {
    this.ownerId = playerId;
    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Suelta la gema al suelo.
   */
  drop(x: number, y: number): void {
    this.ownerId = null;
    this.energy = GEM_CONFIG.MAX_ENERGY; // Reinicia energía
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
  }

  /**
   * Actualiza el consumo de energía de la gema.
   */
  updateEnergy(consumptionRate: number, deltaSeconds: number): void {
    if (this.ownerId !== null) {
      // La gema está siendo llevada, consumir energía
      const consumption = consumptionRate * deltaSeconds;
      this.energy -= consumption;

      if (this.energy < 0) {
        this.energy = 0;
      }
    }
  }

  /**
   * Gasta energía adicional (por ataque especial).
   */
  consumeExtra(amount: number): void {
    this.energy -= amount;
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  /**
   * Obtiene el estado serializado de la gema.
   */
  serialize() {
    return {
      element: this.element,
      energy: this.energy,
      x: this.x,
      y: this.y,
    };
  }
}
