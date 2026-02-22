/**
 * Ataques Especiales - 9 combinaciones (3 clases x 3 elementos).
 */

import Phaser from 'phaser';
import { ClassType, ElementType, SPECIAL_ATTACK_CONFIG, ACCUMULATION_CONFIG } from '../utils/constants';
import { Attack } from './Attack';
import Player from '../entities/Player';

// ============================================================================
// GUERRERO - ATAQUES ESPECIALES
// ============================================================================

export class WarriorFireSpecial extends Attack {
  constructor() {
    super(ClassType.WARRIOR, ElementType.FIRE, SPECIAL_ATTACK_CONFIG.WARRIOR_FIRE.damage, SPECIAL_ATTACK_CONFIG.WARRIOR_FIRE.knockback, SPECIAL_ATTACK_CONFIG.WARRIOR_FIRE.range, true);
  }

  execute(from: Player, direction: Phaser.Math.Vector2, _scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

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
        enemy.statusEffectManager.addEffect('burn', ACCUMULATION_CONFIG.BURN_DURATION, ACCUMULATION_CONFIG.BURN_DPS);
        this.applyKnockback(enemy, direction, this.knockback);
      }
    }
    return hitEnemies;
  }
}

export class WarriorIceSpecial extends Attack {
  constructor() {
    super(ClassType.WARRIOR, ElementType.ICE, SPECIAL_ATTACK_CONFIG.WARRIOR_ICE.damage, SPECIAL_ATTACK_CONFIG.WARRIOR_ICE.knockback, SPECIAL_ATTACK_CONFIG.WARRIOR_ICE.range, false);
  }

  execute(from: Player, direction: Phaser.Math.Vector2, _scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

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
        enemy.statusEffectManager.addEffect('freeze', SPECIAL_ATTACK_CONFIG.WARRIOR_ICE.freezeDuration);
        this.applyKnockback(enemy, direction, this.knockback);
        break;
      }
    }
    return hitEnemies;
  }
}

export class WarriorLightningSpecial extends Attack {
  constructor() {
    super(
      ClassType.WARRIOR,
      ElementType.LIGHTNING,
      SPECIAL_ATTACK_CONFIG.WARRIOR_LIGHTNING.damage,
      SPECIAL_ATTACK_CONFIG.WARRIOR_LIGHTNING.knockback,
      SPECIAL_ATTACK_CONFIG.WARRIOR_LIGHTNING.range,
      false
    );
  }

  execute(from: Player, direction: Phaser.Math.Vector2, _scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

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
        enemy.statusEffectManager.addEffect(
          'paralysis',
          SPECIAL_ATTACK_CONFIG.WARRIOR_LIGHTNING.paralyzeDuration,
          SPECIAL_ATTACK_CONFIG.WARRIOR_LIGHTNING.dps
        );
        this.applyKnockback(enemy, direction, this.knockback);
        break;
      }
    }
    return hitEnemies;
  }
}

// ============================================================================
// ARQUERO - ATAQUES ESPECIALES
// ============================================================================

export class ArcherFireSpecial extends Attack {
  constructor() {
    super(ClassType.ARCHER, ElementType.FIRE, SPECIAL_ATTACK_CONFIG.ARCHER_FIRE.damage, SPECIAL_ATTACK_CONFIG.ARCHER_FIRE.knockback, 1000, false);
  }

  execute(from: Player, direction: Phaser.Math.Vector2, scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const projectileCount = SPECIAL_ATTACK_CONFIG.ARCHER_FIRE.count;
    const damage = from.stats.damage + this.baseDamage;

    for (let i = 0; i < projectileCount; i++) {
      const angleOffset = (i - (projectileCount - 1) / 2) * 0.3;
      const projectileDir = direction.clone().rotate(angleOffset);

      const projectile = scene.add.ellipse((from as any).x || 0, (from as any).y || 0, 8, 2, 0xff6600);
      scene.physics.add.existing(projectile);
      const projBody = projectile.body as Phaser.Physics.Arcade.Body;
      const velocity = projectileDir.clone().normalize().scale(SPECIAL_ATTACK_CONFIG.ARCHER_FIRE.knockback * 10);
      projBody.setVelocity(velocity.x, velocity.y);

      scene.time.delayedCall(4000, () => {
        if (projectile.active) projectile.destroy();
      });
    }

    for (const enemy of enemies) {
      const dist = Phaser.Math.Distance.Between(
        ((from as any).x || 0) + direction.x * 200,
        ((from as any).y || 0) + direction.y * 200,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (dist < 80 && !hitEnemies.includes(enemy)) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
      }
    }

    return hitEnemies;
  }
}

export class ArcherIceSpecial extends Attack {
  constructor() {
    super(ClassType.ARCHER, ElementType.ICE, SPECIAL_ATTACK_CONFIG.ARCHER_ICE.damage, SPECIAL_ATTACK_CONFIG.ARCHER_ICE.knockback, 1000, false);
  }

  execute(from: Player, direction: Phaser.Math.Vector2, scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

    const projectile = scene.add.ellipse((from as any).x || 0, (from as any).y || 0, 10, 3, 0x00ccff);
    scene.physics.add.existing(projectile);
    const projBody = projectile.body as Phaser.Physics.Arcade.Body;
    const velocity = direction.clone().normalize().scale(400 * 10);
    projBody.setVelocity(velocity.x, velocity.y);

    for (const enemy of enemies) {
      const dist = Phaser.Math.Distance.Between(
        (from as any).x || 0,
        (from as any).y || 0,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (dist < SPECIAL_ATTACK_CONFIG.ARCHER_ICE.splashRadius && !hitEnemies.includes(enemy)) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
        enemy.statusEffectManager.addEffect('freeze', 500);
      }
    }

    scene.time.delayedCall(3000, () => {
      if (projectile.active) projectile.destroy();
    });

    return hitEnemies;
  }
}

export class ArcherLightningSpecial extends Attack {
  constructor() {
    super(ClassType.ARCHER, ElementType.LIGHTNING, SPECIAL_ATTACK_CONFIG.ARCHER_LIGHTNING.damage, SPECIAL_ATTACK_CONFIG.ARCHER_LIGHTNING.knockback, 1000, false);
  }

  execute(from: Player, direction: Phaser.Math.Vector2, scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const projectileCount = SPECIAL_ATTACK_CONFIG.ARCHER_LIGHTNING.count;
    const damage = from.stats.damage + this.baseDamage;

    for (let i = 0; i < projectileCount; i++) {
      const angleOffset = (i - 0.5) * 0.2;
      const projectileDir = direction.clone().rotate(angleOffset);

      const projectile = scene.add.ellipse((from as any).x || 0, (from as any).y || 0, 6, 2, 0xffff00);
      scene.physics.add.existing(projectile);
      const projBody = projectile.body as Phaser.Physics.Arcade.Body;
      const velocity = projectileDir.clone().normalize().scale(SPECIAL_ATTACK_CONFIG.ARCHER_LIGHTNING.knockback * 10);
      projBody.setVelocity(velocity.x, velocity.y);

      scene.time.delayedCall(3500, () => {
        if (projectile.active) projectile.destroy();
      });
    }

    for (const enemy of enemies) {
      const dist = Phaser.Math.Distance.Between(
        (from as any).x || 0,
        (from as any).y || 0,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (dist < 200 && !hitEnemies.includes(enemy)) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
      }
    }

    return hitEnemies;
  }
}

// ============================================================================
// MAGO - ATAQUES ESPECIALES
// ============================================================================

export class MageFireSpecial extends Attack {
  constructor() {
    super(ClassType.MAGE, ElementType.FIRE, SPECIAL_ATTACK_CONFIG.MAGE_FIRE.damage, SPECIAL_ATTACK_CONFIG.MAGE_FIRE.knockback, 1000, true);
  }

  execute(from: Player, direction: Phaser.Math.Vector2, scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

    const projectile = scene.add.circle((from as any).x || 0, (from as any).y || 0, 12, 0xff8800);
    scene.physics.add.existing(projectile);
    const projBody = projectile.body as Phaser.Physics.Arcade.Body;
    const velocity = direction.clone().normalize().scale(SPECIAL_ATTACK_CONFIG.MAGE_FIRE.knockback * 10);
    projBody.setVelocity(velocity.x, velocity.y);

    scene.time.delayedCall(2000, () => {
      for (const enemy of enemies) {
        const dist = Phaser.Math.Distance.Between(
          projectile.x,
          projectile.y,
          (enemy as any).x || 0,
          (enemy as any).y || 0
        );
        if (dist < SPECIAL_ATTACK_CONFIG.MAGE_FIRE.splashRadius && !hitEnemies.includes(enemy)) {
          hitEnemies.push(enemy);
          enemy.takeDamage(damage);
          enemy.statusEffectManager.addEffect('burn', 3000, ACCUMULATION_CONFIG.BURN_DPS);
        }
      }
      if (projectile.active) projectile.destroy();
    });

    return hitEnemies;
  }
}

export class MageIceSpecial extends Attack {
  constructor() {
    super(ClassType.MAGE, ElementType.ICE, SPECIAL_ATTACK_CONFIG.MAGE_ICE.damage, SPECIAL_ATTACK_CONFIG.MAGE_ICE.knockback, 1000, true);
  }

  execute(from: Player, _direction: Phaser.Math.Vector2, _scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

    const splashRadius = SPECIAL_ATTACK_CONFIG.MAGE_ICE.splashRadius;

    for (const enemy of enemies) {
      const dist = Phaser.Math.Distance.Between(
        (from as any).x || 0,
        (from as any).y || 0,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (dist < splashRadius) {
        hitEnemies.push(enemy);
        enemy.takeDamage(damage);
        enemy.statusEffectManager.addEffect('freeze', SPECIAL_ATTACK_CONFIG.MAGE_ICE.freezeDuration);
      }
    }

    return hitEnemies;
  }
}

export class MageLightningSpecial extends Attack {
  constructor() {
    super(ClassType.MAGE, ElementType.LIGHTNING, SPECIAL_ATTACK_CONFIG.MAGE_LIGHTNING.damage, SPECIAL_ATTACK_CONFIG.MAGE_LIGHTNING.knockback, 1000, true);
  }

  execute(from: Player, _direction: Phaser.Math.Vector2, _scene: Phaser.Scene, enemies: Player[]): Player[] {
    const hitEnemies: Player[] = [];
    const damage = from.stats.damage + this.baseDamage;

    let mainTarget: Player | null = null;
    let minDist = Infinity;

    for (const enemy of enemies) {
      const dist = Phaser.Math.Distance.Between(
        (from as any).x || 0,
        (from as any).y || 0,
        (enemy as any).x || 0,
        (enemy as any).y || 0
      );
      if (dist < minDist) {
        minDist = dist;
        mainTarget = enemy;
      }
    }

    if (mainTarget) {
      hitEnemies.push(mainTarget);
      mainTarget.takeDamage(damage);

      const maxChains = SPECIAL_ATTACK_CONFIG.MAGE_LIGHTNING.maxChains;
      let chainsCount = 0;

      for (const enemy of enemies) {
        if (enemy === mainTarget || chainsCount >= maxChains) continue;

        const dist = Phaser.Math.Distance.Between(
          (mainTarget as any).x || 0,
          (mainTarget as any).y || 0,
          (enemy as any).x || 0,
          (enemy as any).y || 0
        );
        if (dist < 150) {
          hitEnemies.push(enemy);
          enemy.takeDamage(Math.round(damage * 0.7));
          chainsCount++;
        }
      }
    }

    return hitEnemies;
  }
}

// ============================================================================
// FACTORY PARA CREAR ATAQUES ESPECIALES
// ============================================================================

export function createSpecialAttack(classType: ClassType, element: ElementType): Attack {
  switch (classType) {
    case ClassType.WARRIOR:
      switch (element) {
        case ElementType.FIRE:
          return new WarriorFireSpecial();
        case ElementType.ICE:
          return new WarriorIceSpecial();
        case ElementType.LIGHTNING:
          return new WarriorLightningSpecial();
        default:
          throw new Error(`Elemento desconocido: ${element}`);
      }

    case ClassType.ARCHER:
      switch (element) {
        case ElementType.FIRE:
          return new ArcherFireSpecial();
        case ElementType.ICE:
          return new ArcherIceSpecial();
        case ElementType.LIGHTNING:
          return new ArcherLightningSpecial();
        default:
          throw new Error(`Elemento desconocido: ${element}`);
      }

    case ClassType.MAGE:
      switch (element) {
        case ElementType.FIRE:
          return new MageFireSpecial();
        case ElementType.ICE:
          return new MageIceSpecial();
        case ElementType.LIGHTNING:
          return new MageLightningSpecial();
        default:
          throw new Error(`Elemento desconocido: ${element}`);
      }

    default:
      throw new Error(`Clase desconocida: ${classType}`);
  }
}
