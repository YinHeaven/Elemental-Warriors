/**
 * Ataques Básicos por clase - Guerrero, Arquero, Mago.
 */

import Phaser from 'phaser';
import { ClassType, ElementType, BASIC_ATTACK_CONFIG } from '../utils/constants';
import { calculateDamageWithElement } from '../utils/formulas';
import { Attack } from './Attack';
import Player from '../entities/Player';

/**
 * Ataque básico del Guerrero - Media luna cuerpo a cuerpo.
 */
export class WarriorBasicAttack extends Attack {
  constructor(element: ElementType) {
    super(
      ClassType.WARRIOR,
      element,
      10,
      BASIC_ATTACK_CONFIG.WARRIOR.knockback,
      BASIC_ATTACK_CONFIG.WARRIOR.range,
      true // Puede golpear múltiples enemigos en el rango
    );
  }

  execute(
    from: Player,
    direction: Phaser.Math.Vector2,
    scene: Phaser.Scene,
    enemies: Player[]
  ): Player[] {
    const hitEnemies: Player[] = [];
    const damage = calculateDamageWithElement(
      from.stats.damage + this.baseDamage,
      this.element,
      BASIC_ATTACK_CONFIG.WARRIOR.elementalDamageBonus
    );

    // Encontrar enemigos en rango
    for (const enemy of enemies) {
      const distance = Phaser.Math.Distance.Between(
        (from as any).x || 0,
        (from as any).y || 0,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (distance <= this.range) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
        this.applyKnockback(enemy, direction, this.knockback);
      }
    }

    return hitEnemies;
  }
}

/**
 * Ataque básico del Arquero - Flecha básica proyectil.
 */
export class ArcherBasicAttack extends Attack {
  constructor(element: ElementType) {
    super(
      ClassType.ARCHER,
      element,
      8,
      BASIC_ATTACK_CONFIG.ARCHER.knockback,
      1000, // Rango infinito (proyectil)
      false // Un solo golpe por flecha
    );
  }

  execute(
    from: Player,
    direction: Phaser.Math.Vector2,
    scene: Phaser.Scene,
    enemies: Player[]
  ): Player[] {
    const hitEnemies: Player[] = [];
    const damage = calculateDamageWithElement(
      from.stats.damage + this.baseDamage,
      this.element,
      BASIC_ATTACK_CONFIG.ARCHER.elementalDamageBonus
    );

    // Crear proyectil
    const projectile = scene.add.ellipse(
      (from as any).x || 0,
      (from as any).y || 0,
      8,
      2,
      0xccaa00
    ) as unknown as Phaser.Physics.Arcade.Sprite;

    // Configurar física del proyectil
    scene.physics.add.existing(projectile);
    const projBody = projectile.body as Phaser.Physics.Arcade.Body;
    const velocity = direction.clone().normalize().scale(BASIC_ATTACK_CONFIG.ARCHER.projectileSpeed * 10);
    projBody.setVelocity(velocity.x, velocity.y);

    // Simular colisión con enemigos (simplificado)
    for (const enemy of enemies) {
      const distToEnemy = Phaser.Math.Distance.Between(
        projectile.x,
        projectile.y,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (distToEnemy < 40) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
        this.applyKnockback(enemy, direction, this.knockback);
        projectile.destroy();
        break;
      }
    }

    // Destruir proyectil después de cierto tiempo
    scene.time.delayedCall(5000, () => {
      if (projectile.active) {
        projectile.destroy();
      }
    });

    return hitEnemies;
  }
}

/**
 * Ataque básico del Mago - Proyectil mágico azul.
 */
export class MageBasicAttack extends Attack {
  constructor(element: ElementType) {
    super(
      ClassType.MAGE,
      element,
      12,
      BASIC_ATTACK_CONFIG.MAGE.knockback,
      1000, // Rango infinito (proyectil)
      false // Un solo golpe por proyectil
    );
  }

  execute(
    from: Player,
    direction: Phaser.Math.Vector2,
    scene: Phaser.Scene,
    enemies: Player[]
  ): Player[] {
    const hitEnemies: Player[] = [];
    const damage = calculateDamageWithElement(
      from.stats.damage + this.baseDamage,
      this.element,
      BASIC_ATTACK_CONFIG.MAGE.elementalDamageBonus
    );

    // Crear proyectil mágico
    const projectile = scene.add.circle(
      (from as any).x || 0,
      (from as any).y || 0,
      6,
      0x4488ff
    ) as unknown as Phaser.Physics.Arcade.Sprite;

    // Configurar física del proyectil
    scene.physics.add.existing(projectile);
    const projBody = projectile.body as Phaser.Physics.Arcade.Body;
    const velocity = direction.clone().normalize().scale(BASIC_ATTACK_CONFIG.MAGE.projectileSpeed * 10);
    projBody.setVelocity(velocity.x, velocity.y);

    // Simular colisión con enemigos (simplificado)
    for (const enemy of enemies) {
      const distToEnemy = Phaser.Math.Distance.Between(
        projectile.x,
        projectile.y,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (distToEnemy < 35) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
        this.applyKnockback(enemy, direction, this.knockback);
        projectile.destroy();
        break;
      }
    }

    // Destruir proyectil después de cierto tiempo
    scene.time.delayedCall(4000, () => {
      if (projectile.active) {
        projectile.destroy();
      }
    });

    return hitEnemies;
  }
}

/**
 * Factory para crear ataques básicos según la clase.
 */
export function createBasicAttack(classType: ClassType, element: ElementType): Attack {
  switch (classType) {
    case ClassType.WARRIOR:
      return new WarriorBasicAttack(element);
    case ClassType.ARCHER:
      return new ArcherBasicAttack(element);
    case ClassType.MAGE:
      return new MageBasicAttack(element);
    default:
      throw new Error(`Clase desconocida: ${classType}`);
  }
}
