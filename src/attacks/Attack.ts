/**
 * Clase base abstracta para ataques.
 * Define la interfaz y propiedades comunes de todos los ataques.
 */

import Phaser from 'phaser';
import { ClassType, ElementType } from '../utils/constants';
import Player from '../entities/Player';

export abstract class Attack {
  classType: ClassType;
  element: ElementType;
  baseDamage: number;
  knockback: number;
  range: number;
  canHitMultipleEnemies: boolean;

  constructor(
    classType: ClassType,
    element: ElementType,
    baseDamage: number,
    knockback: number,
    range: number,
    canHitMultipleEnemies: boolean = false
  ) {
    this.classType = classType;
    this.element = element;
    this.baseDamage = baseDamage;
    this.knockback = knockback;
    this.range = range;
    this.canHitMultipleEnemies = canHitMultipleEnemies;
  }

  /**
   * Ejecuta el ataque desde un jugador en una dirección específica.
   * Debe ser implementado por cada tipo de ataque.
   */
  abstract execute(
    from: Player,
    direction: Phaser.Math.Vector2,
    scene: Phaser.Scene,
    enemies: Player[]
  ): Player[]; // Retorna array de enemigos golpeados

  /**
   * Calcula el daño final considerando el elemento.
   */
  protected calculateDamage(baseDamage: number): number {
    let damage = baseDamage;

    // Bonus según elemento
    if (this.element === ElementType.FIRE) {
      damage *= 1.25; // +25% daño
    }

    return Math.round(damage);
  }

  /**
   * Aplica knockback a un enemigo.
   */
  protected applyKnockback(target: Player, direction: Phaser.Math.Vector2, knockbackForce: number): void {
    const targetSprite = target as any;
    if (targetSprite.body) {
      const knockbackVector = direction.clone().normalize().scale(knockbackForce * 10);
      targetSprite.setVelocity(knockbackVector.x, knockbackVector.y);
    }
  }
}
