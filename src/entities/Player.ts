/**
 * Clase Player - Representa un jugador en el juego.
 * Gestiona estadísticas, vida, mana, gemas, runas, efectos de estado y ataques.
 */

import Phaser from 'phaser';
import { ClassType, ElementType } from '../utils/constants';
import { calculateStats, getGemConsumptionRate, getExperienceRequired } from '../utils/formulas';
import { StatusEffectManager } from '../utils/statusEffects';
import { PlayerStats } from '../types';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  // Propiedades base
  classType: ClassType;
  level: number;
  experience: number;

  // Estadísticas
  stats: PlayerStats;

  // Elemento y energía de gema
  element: ElementType;
  gemEnergy: number;
  gemConsumptionRate: number;

  // Runas (máximo 2)
  runes: Array<{ type: string; durationRemaining: number }>;

  // Efectos de estado
  statusEffectManager: StatusEffectManager;

  // Control de ataque
  isAttacking: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, classType: ClassType) {
    // Seleccionar textura según la clase
    let textureKey = 'warrior';
    switch (classType) {
      case ClassType.ARCHER:
        textureKey = 'archer';
        break;
      case ClassType.MAGE:
        textureKey = 'mage';
        break;
      default:
        textureKey = 'warrior';
    }

    // Verificar si la textura existe, si no crear una de fallback
    if (!scene.textures.exists(textureKey)) {
      console.warn(`Textura ${textureKey} no encontrada, usando fallback`);
      const graphics = scene.make.graphics({ x: 0, y: 0 });
      const color = Player.getClassColor(classType);
      graphics.fillStyle(color, 1);
      graphics.fillCircle(16, 16, 16);
      graphics.generateTexture(textureKey, 32, 32);
      graphics.destroy();
    }

    super(scene, x, y, textureKey);

    this.classType = classType;
    this.level = 1;
    this.experience = 0;
    this.element = ElementType.NEUTRAL;
    this.gemEnergy = 0;
    this.gemConsumptionRate = 0;
    this.runes = [];
    this.statusEffectManager = new StatusEffectManager();
    this.isAttacking = false;
    this.stats = { health: 0, maxHealth: 0, damage: 0, attackSpeed: 0, movement: 0, mana: 0, maxMana: 0 };

    this.setDisplaySize(32, 32);

    // Inicializar estadísticas
    this.updateStats();

    // Inicializar mana
    this.stats.mana = this.stats.maxMana;

    console.log(`✓ Jugador creado: ${classType} en (${x}, ${y})`);
  }

  /**
   * Obtiene el color de la clase (solo usado internamente si es necesario).
   */
  private static getClassColor(classType: ClassType): number {
    switch (classType) {
      case ClassType.WARRIOR:
        return 0xff4444; // Rojo
      case ClassType.ARCHER:
        return 0x44ff44; // Verde
      case ClassType.MAGE:
        return 0x4444ff; // Azul
      default:
        return 0xffffff; // Blanco
    }
  }

  /**
   * Actualiza las estadísticas según el nivel actual.
   */
  updateStats(): void {
    const stats = calculateStats(this.classType, this.level);
    this.stats = {
      ...stats,
      health: stats.maxHealth, // Inicializar con vida máxima
      mana: this.stats?.mana || stats.maxMana,
    };
    this.gemConsumptionRate = getGemConsumptionRate(this.level);
  }

  /**
   * Recoge una gema elemental.
   */
  collectGem(element: ElementType, energy: number = 100): void {
    this.element = element;
    this.gemEnergy = energy;
    this.gemConsumptionRate = getGemConsumptionRate(this.level);
  }

  /**
   * Actualiza el consumo de energía de la gema.
   */
  updateGemEnergy(deltaSeconds: number): void {
    if (this.element === ElementType.NEUTRAL) return;

    const consumption = this.gemConsumptionRate * deltaSeconds;
    this.gemEnergy -= consumption;

    if (this.gemEnergy <= 0) {
      this.gemEnergy = 0;
      this.element = ElementType.NEUTRAL;
    }
  }

  /**
   * Actualiza la regeneración de mana.
   */
  updateMana(deltaSeconds: number): void {
    const regenRate = 10; // puntos por segundo
    this.stats.mana = Math.min(this.stats.maxMana, this.stats.mana + regenRate * deltaSeconds);
  }

  /**
   * Gasta mana para un ataque especial.
   */
  spendMana(amount: number): boolean {
    if (this.stats.mana < amount) {
      return false; // Mana insuficiente
    }
    this.stats.mana -= amount;
    return true;
  }

  /**
   * Añade una runa (máximo 2).
   */
  addRune(type: string, duration: number): void {
    // Si ya hay 2 runas, reemplazar la que menos tiempo le queda
    if (this.runes.length >= 2) {
      const minRuneIndex = this.runes.reduce((minIdx, rune, idx) => {
        return rune.durationRemaining < this.runes[minIdx].durationRemaining ? idx : minIdx;
      }, 0);
      this.runes.splice(minRuneIndex, 1);
    }

    this.runes.push({ type, durationRemaining: duration });
  }

  /**
   * Actualiza las duraciones de las runas.
   */
  updateRunes(deltaSeconds: number = 0.016): void {
    this.runes = this.runes.filter((rune) => {
      rune.durationRemaining -= deltaSeconds * 1000; // Convertir a milisegundos
      return rune.durationRemaining > 0;
    });
  }

  /**
   * Actualiza los efectos de estado.
   */
  updateStatusEffects(): void {
    this.statusEffectManager.updateEffects();
  }

  /**
   * Recibe daño.
   */
  takeDamage(damage: number): void {
    this.stats.health -= damage;
    if (this.stats.health < 0) {
      this.stats.health = 0;
    }
  }

  /**
   * Sube de nivel.
   */
  levelUp(): void {
    this.level = Math.min(30, this.level + 1);
    this.experience = 0;
    this.updateStats();
    this.stats.health = this.stats.maxHealth; // Cura completa
    this.stats.mana = this.stats.maxMana * 0.5; // Regenera 50% de mana
  }

  /**
   * Añade experiencia.
   */
  addExperience(amount: number): void {
    if (this.level >= 30) return; // Nivel máximo

    this.experience += amount;
    const required = getExperienceRequired(this.level + 1);

    if (this.experience >= required) {
      this.levelUp();
    }
  }

  /**
   * Realiza un ataque básico.
   */
  performBasicAttack(): void {
    // Placeholder - será implementado en BasicAttack.ts
    console.log(`${this.classType} realiza ataque básico con elemento ${this.element}`);
  }

  /**
   * Realiza un ataque especial.
   */
  performSpecialAttack(): boolean {
    // Verificar elemento
    if (this.element === ElementType.NEUTRAL) {
      console.log('Sin elemento para ataque especial');
      return false;
    }

    // Placeholder - será implementado en SpecialAttacks.ts
    console.log(`${this.classType} realiza ataque especial ${this.element}`);
    return true;
  }

  /**
   * Muere y entra en estado inactivo.
   */
  die(): void {
    console.log(`${this.classType} ha muerto`);
    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Reaparece después de morir.
   */
  respawn(x: number, y: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.stats.health = this.stats.maxHealth;
    this.stats.mana = this.stats.maxMana;
    this.element = ElementType.NEUTRAL;
    this.gemEnergy = 0;
    this.runes = [];
    this.statusEffectManager.clear();
  }
}
