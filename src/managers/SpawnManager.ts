/**
 * Gestor de Spawn - Controla la aparición de gemas, piedras y runas en el mapa.
 */

import Phaser from 'phaser';
import { SPAWN_CONFIG, ElementType } from '../utils/constants';
import Gem from '../entities/Gem';
import ExpStone from '../entities/ExpStone';
import WindStone from '../entities/WindStone';
import Rune from '../entities/Rune';
import { RuneType, RuneRarity } from '../utils/constants';

export class SpawnManager {
  private scene: Phaser.Scene;
  private mapWidth: number = 2000;
  private mapHeight: number = 2000;

  // Contadores de spawn
  private gemsCount: number = 0;
  private expStonesCount: number = 0;
  private windStonesCount: number = 0;
  private runesCount: number = 0;

  // Contadores de frames
  private gemsFrameCounter: number = 0;
  private expStonesFrameCounter: number = 0;
  private windStonesFrameCounter: number = 0;
  private runesFrameCounter: number = 0;

  // Grupos de física
  public gems: Phaser.Physics.Arcade.Group;
  public expStones: Phaser.Physics.Arcade.Group;
  public windStones: Phaser.Physics.Arcade.Group;
  public runes: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Crear grupos de física
    this.gems = scene.physics.add.group();
    this.expStones = scene.physics.add.group();
    this.windStones = scene.physics.add.group();
    this.runes = scene.physics.add.group();
  }

  /**
   * Actualiza los contadores de spawn y crea nuevos objetos si es necesario.
   */
  update(): void {
    this.updateGems();
    this.updateExpStones();
    this.updateWindStones();
    this.updateRunes();
  }

  /**
   * Actualiza el spawn de gemas.
   */
  private updateGems(): void {
    this.gemsFrameCounter++;
    if (this.gemsFrameCounter >= SPAWN_CONFIG.GEMS.interval && this.gemsCount < SPAWN_CONFIG.GEMS.max) {
      this.spawnGem();
      this.gemsFrameCounter = 0;
    }
  }

  /**
   * Actualiza el spawn de piedras de experiencia.
   */
  private updateExpStones(): void {
    this.expStonesFrameCounter++;
    if (
      this.expStonesFrameCounter >= SPAWN_CONFIG.EXP_STONES.interval &&
      this.expStonesCount < SPAWN_CONFIG.EXP_STONES.max
    ) {
      this.spawnExpStone();
      this.expStonesFrameCounter = 0;
    }
  }

  /**
   * Actualiza el spawn de piedras de viento.
   */
  private updateWindStones(): void {
    this.windStonesFrameCounter++;
    if (
      this.windStonesFrameCounter >= SPAWN_CONFIG.WIND_STONES.interval &&
      this.windStonesCount < SPAWN_CONFIG.WIND_STONES.max
    ) {
      this.spawnWindStone();
      this.windStonesFrameCounter = 0;
    }
  }

  /**
   * Actualiza el spawn de runas.
   */
  private updateRunes(): void {
    this.runesFrameCounter++;
    if (this.runesFrameCounter >= SPAWN_CONFIG.RUNES.interval && this.runesCount < SPAWN_CONFIG.RUNES.max) {
      this.spawnRune();
      this.runesFrameCounter = 0;
    }
  }

  /**
   * Spawna una gema elemental en posición aleatoria.
   */
  private spawnGem(): void {
    const position = this.getRandomSafePosition();
    const element = this.getRandomElement();
    const gem = new Gem(this.scene, position.x, position.y, element);

    // Agregar a la escena y physics group
    this.scene.add.existing(gem);
    this.scene.physics.add.existing(gem);

    this.gems.add(gem);
    this.gemsCount++;

    console.log(`✨ Gema spawneada: ${element} en (${position.x.toFixed(0)}, ${position.y.toFixed(0)}) | Total: ${this.gemsCount}`);

    // Destruir cuando se salga del mapa o sea recolectada
    gem.once('destroy', () => {
      this.gemsCount--;
      console.log(`💥 Gema destruida | Total restantes: ${this.gemsCount}`);
    });
  }

  /**
   * Spawna una piedra de experiencia.
   */
  private spawnExpStone(): void {
    const position = this.getRandomSafePosition();
    const stone = new ExpStone(this.scene, position.x, position.y, 10);

    // Agregar a la escena y physics group
    this.scene.add.existing(stone);
    this.scene.physics.add.existing(stone);

    this.expStones.add(stone);
    this.expStonesCount++;

    console.log(`⭐ Piedra de EXP spawneada en (${position.x.toFixed(0)}, ${position.y.toFixed(0)}) | Total: ${this.expStonesCount}`);

    stone.once('destroy', () => {
      this.expStonesCount--;
    });
  }

  /**
   * Spawna una piedra de viento.
   */
  private spawnWindStone(): void {
    const position = this.getRandomSafePosition();
    const stone = new WindStone(this.scene, position.x, position.y, 1); // Nivel 1 por defecto

    // Agregar a la escena y physics group
    this.scene.add.existing(stone);
    this.scene.physics.add.existing(stone);

    this.windStones.add(stone);
    this.windStonesCount++;

    console.log(`💨 Piedra de Viento spawneada en (${position.x.toFixed(0)}, ${position.y.toFixed(0)}) | Total: ${this.windStonesCount}`);

    stone.once('destroy', () => {
      this.windStonesCount--;
    });
  }

  /**
   * Spawna una runa aleatoria.
   */
  private spawnRune(): void {
    const position = this.getRandomSafePosition();
    const runeType = this.getRandomRuneType();
    const rarity = this.getRandomRarity();
    const rune = new Rune(this.scene, position.x, position.y, runeType, rarity);

    // Agregar a la escena y physics group
    this.scene.add.existing(rune);
    this.scene.physics.add.existing(rune);

    this.runes.add(rune);
    this.runesCount++;

    console.log(`🔮 Runa spawneada (${runeType}, ${rarity}) en (${position.x.toFixed(0)}, ${position.y.toFixed(0)}) | Total: ${this.runesCount}`);

    rune.once('destroy', () => {
      this.runesCount--;
    });
  }

  /**
   * Obtiene una posición aleatoria segura (no sobre obstáculos).
   */
  private getRandomSafePosition(): { x: number; y: number } {
    let position = { x: 0, y: 0 };
    let attempts = 0;

    do {
      position.x =
        Phaser.Math.Between(SPAWN_CONFIG.MAP_PADDING, this.mapWidth - SPAWN_CONFIG.MAP_PADDING) || 1000;
      position.y =
        Phaser.Math.Between(SPAWN_CONFIG.MAP_PADDING, this.mapHeight - SPAWN_CONFIG.MAP_PADDING) || 1000;
      attempts++;
    } while (attempts < 5); // Intentar hasta 5 veces

    return position;
  }

  /**
   * Obtiene un elemento aleatorio.
   */
  private getRandomElement(): ElementType {
    const rand = Math.random();
    if (rand < 0.33) return ElementType.FIRE;
    if (rand < 0.66) return ElementType.ICE;
    return ElementType.LIGHTNING;
  }

  /**
   * Obtiene un tipo de runa aleatorio.
   */
  private getRandomRuneType(): RuneType {
    const types = Object.values(RuneType);
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Obtiene una rareza aleatoria.
   */
  private getRandomRarity(): RuneRarity {
    const rand = Math.random();
    if (rand < 0.4) return RuneRarity.COMMON;
    if (rand < 0.8) return RuneRarity.RARE;
    return RuneRarity.EPIC;
  }

  /**
   * Limpia todos los objetos.
   */
  destroy(): void {
    this.gems.clear(true, true);
    this.expStones.clear(true, true);
    this.windStones.clear(true, true);
    this.runes.clear(true, true);
  }
}
