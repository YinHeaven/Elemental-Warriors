/**
 * Escena principal del juego - Elemental Warriors.
 * Gestiona el mapa, los jugadores, colisiones, spawn de objetos y lógica del juego.
 */

import Phaser from 'phaser';
import { ClassType, ElementType, SPECIAL_ATTACK_CONFIG } from '../utils/constants';
import Player from '../entities/Player';
import Wall from '../entities/Wall';
import { SpawnManager } from '../managers/SpawnManager';
import { ElementalAccumulation } from '../attacks/ElementalAccumulation';
import { createBasicAttack } from '../attacks/BasicAttack';
import { createSpecialAttack } from '../attacks/SpecialAttacks';

export default class MainScene extends Phaser.Scene {
  private player: Player | null = null;
  private allPlayers: Map<number, Player> = new Map(); // Para multijugador (futuro)
  private selectedClass: ClassType = ClassType.WARRIOR;
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private lastBasicAttackTime: number = 0;
  private lastSpecialAttackTime: number = 0;
  private spawnManager: SpawnManager | null = null;
  private wallsGroup: Phaser.Physics.Arcade.Group | null = null;
  private elementalAccumulation: ElementalAccumulation = new ElementalAccumulation();

  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    // Obtener la clase seleccionada del menú
    this.selectedClass = this.registry.get('selectedClass') || ClassType.WARRIOR;
  }

  preload() {
    // Cargar sprites de jugadores (32x32)
    this.load.image('warrior', 'assets/sprites/warrior.png');
    this.load.image('archer', 'assets/sprites/archer.png');
    this.load.image('mage', 'assets/sprites/mage.png');

    // Cargar gemas elementales (16x16)
    this.load.image('fire_gem', 'assets/gems/fire_gem.png');
    this.load.image('ice_gem', 'assets/gems/ice_gem.png');
    this.load.image('lightning_gem', 'assets/gems/lightning_gem.png');

    // Cargar items (12x12 y 16x16)
    this.load.image('exp_stone', 'assets/items/exp_stone.png');
    this.load.image('wind_stone', 'assets/items/wind_stone.png');

    // Cargar runas (16x16)
    this.load.image('rune_speed', 'assets/items/rune_speed.png');
    this.load.image('rune_attack_speed', 'assets/items/rune_attack_speed.png');
    this.load.image('rune_life', 'assets/items/rune_life.png');
    this.load.image('rune_energy', 'assets/items/rune_energy.png');
    this.load.image('rune_element', 'assets/items/rune_element.png');
    this.load.image('rune_accumulation', 'assets/items/rune_accumulation.png');
    this.load.image('rune_resistance', 'assets/items/rune_resistance.png');
  }

  create() {
    console.log('📍 MainScene.create() iniciado');

    // Fondo
    this.cameras.main.setBackgroundColor('#2a2a3a');

    // Crear gestor de spawn
    this.spawnManager = new SpawnManager(this);
    console.log('✓ SpawnManager creado');

    // Crear grupo de paredes
    this.wallsGroup = this.physics.add.group();
    this.setupWalls(); // Agregar paredes personalizadas
    console.log('✓ Grupo de paredes creado');

    // Crear jugador
    const startX = 1000;
    const startY = 1000;
    this.player = new Player(this, startX, startY, this.selectedClass);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setBounce(0, 0);
    console.log(`✓ Jugador agregado a la escena`);

    // Añadir el jugador al mapa de jugadores
    this.allPlayers.set(0, this.player); // ID 0 para el jugador principal

    // Configurar cámara para seguir al jugador
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 2000, 2000); // Tamaño del mapa
    console.log('✓ Cámara configurada');

    // Configurar controles
    this.setupControls();
    console.log('✓ Controles configurados');

    // Desactivar menú contextual del navegador (click derecho)
    this.input.mouse.disableContextMenu();

    // Configurar colisiones
    this.setupCollisions();
    console.log('✓ Colisiones configuradas');

    // UI básica de prueba
    this.createDebugUI();
    console.log('✓ MainScene.create() completado');
  }

  /**
   * Configura las colisiones del juego.
   */
  private setupCollisions() {
    if (!this.player || !this.spawnManager) return;

    // Colisiones con gemas
    this.physics.add.overlap(
      this.player,
      this.spawnManager.gems,
      (player: any, gem: any) => {
        (player as Player).collectGem(gem.element, gem.energy);
        gem.setOwner(0); // ID del jugador principal
        console.log(`Gema recogida: ${gem.element}`);
      }
    );

    // Colisiones con piedras de experiencia
    this.physics.add.overlap(
      this.player,
      this.spawnManager.expStones,
      (player: any, stone: any) => {
        (player as Player).addExperience(stone.experienceReward);
        stone.destroy();
        console.log(`+${stone.experienceReward} EXP`);
      }
    );

    // Colisiones con piedras de viento
    this.physics.add.overlap(
      this.player,
      this.spawnManager.windStones,
      (player: any, stone: any) => {
        const windDuration = stone.getDuration((player as Player).level);
        (player as Player).stats.movement *= 1.5; // Camiar dinamicamente
        stone.destroy();
        // Restaurar después de la duración
        this.time.delayedCall(windDuration, () => {
          if (this.player) {
            this.player.stats.movement /= 1.5;
          }
        });
        console.log(`+Velocidad durante ${windDuration / 1000}s`);
      }
    );

    // Colisiones con runas
    this.physics.add.overlap(
      this.player,
      this.spawnManager.runes,
      (player: any, rune: any) => {
        (player as Player).addRune(rune.runeType, rune.baseDuration);
        rune.destroy();
        console.log(`Runa adquirida: ${rune.runeType}`);
      }
    );

    // Colisiones con paredes
    if (this.wallsGroup) {
      this.physics.add.collider(this.player, this.wallsGroup);
    }
  }


  /**
   * Configura las paredes del mapa.
   * AQUÍ ES DONDE AGREGAS TUS PAREDES MANUALMENTE.
   * Usa: this.addWall(x, y, width, height)
   */
  private setupWalls() {
    if (!this.wallsGroup) return;

    // PAREDES DE LOS BORDES DEL MAPA
    this.addWall(1000, 20, 2000, 40);       // Pared superior
    this.addWall(1000, 1980, 2000, 40);     // Pared inferior
    this.addWall(20, 1000, 40, 2000);       // Pared izquierda
    this.addWall(1980, 1000, 40, 2000);     // Pared derecha

    // PAREDES DE EJEMPLO - COMENTADAS (descomenta si las quieres)
    // this.addWall(500, 500, 300, 50);        // Pared horizontal en (500, 500)
    // this.addWall(1500, 600, 50, 300);       // Pared vertical en (1500, 600)
    // this.addWall(800, 1200, 250, 40);       // Pared horizontal en (800, 1200)
    // this.addWall(1200, 1500, 40, 200);      // Pared vertical en (1200, 1500)

    // PAREDES PARA CREAR UN LABERINTO (opcional - comenta si no las quieres)
    // this.addWall(600, 800, 200, 30);
    // this.addWall(1300, 900, 30, 250);
    // this.addWall(1000, 1000, 150, 30);

    console.log(`✓ ${this.wallsGroup.children.entries.length} paredes creadas`);
  }

  /**
   * Agrega una pared al mapa.
   * @param x - Centro horizontal de la pared
   * @param y - Centro vertical de la pared
   * @param width - Ancho de la pared
   * @param height - Alto de la pared
   */
  private addWall(x: number, y: number, width: number, height: number) {
    if (!this.wallsGroup) return;

    const wall = new Wall(this, x, y, width, height);
    this.add.existing(wall);
    this.physics.add.existing(wall);

    // Configurar el body después de agregarlo a la física
    const body = wall.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);

    this.wallsGroup.add(wall);

    console.log(`🧱 Pared agregada en (${x}, ${y}) | Tamaño: ${width}x${height}`);
  }


  /**
   * Configura los controles del teclado y mouse.
   */
  private setupControls() {
    this.keys = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    // Mouse input
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        // Ataque básico
        this.performBasicAttack();
      } else if (pointer.button === 2) {
        // Ataque especial
        this.performSpecialAttack();
      }
    });

    // Movimiento del ratón para rotar el sprite
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.player) {
        const angle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          pointer.x + this.cameras.main.scrollX,
          pointer.y + this.cameras.main.scrollY
        );
        this.player.setRotation(angle + Math.PI / 2);
      }
    });
  }

  /**
   * Realiza un ataque básico.
   */
  private performBasicAttack() {
    if (!this.player) return;

    const now = this.time.now;
    const cooldown = 1000 / this.player.stats.attackSpeed; // milisegundos

    if (now - this.lastBasicAttackTime < cooldown) {
      return; // Cooldown aún activo
    }

    this.lastBasicAttackTime = now;

    // Crear ataque básico
    const basicAttack = createBasicAttack(this.player.classType, this.player.element);

    // Obtener dirección del cursor
    const direction = new Phaser.Math.Vector2();
    direction.x =
      this.input.mousePointer.x +
      this.cameras.main.scrollX -
      this.player.x;
    direction.y =
      this.input.mousePointer.y +
      this.cameras.main.scrollY -
      this.player.y;
    direction.normalize();

    // Ejecutar ataque
    const hitEnemies = basicAttack.execute(
      this.player,
      direction,
      this,
      Array.from(this.allPlayers.values()).filter((p) => p !== this.player && p.stats.health > 0)
    );

    // Registrar golpes en acumulación elemental
    for (const enemy of hitEnemies) {
      const triggered = this.elementalAccumulation.recordHit(enemy.level, this.player.element);
      if (triggered) {
        const hasResistanceRune = this.player.runes.some((r) => r.type === 'resistance');
        this.elementalAccumulation.triggerEffect(enemy, this.player.element, hasResistanceRune);
      }
    }

    console.log(`Ataque básico: ${basicAttack.canHitMultipleEnemies ? hitEnemies.length + ' enemigos' : '1 enemigo'}`);
  }

  /**
   * Realiza un ataque especial.
   */
  private performSpecialAttack() {
    if (!this.player) return;

    const now = this.time.now;
    const SPECIAL_COOLDOWN = 3000; // 3 segundos

    if (now - this.lastSpecialAttackTime < SPECIAL_COOLDOWN) {
      return; // Cooldown aún activo
    }

    if (this.player.element === ElementType.NEUTRAL) {
      console.log('Sin elemento para ataque especial');
      return;
    }

    // Obtener costo de mana
    const manaCost = this.getSpecialAttackManaCost(this.player.classType, this.player.element);
    if (!this.player.spendMana(manaCost)) {
      console.log('Mana insuficiente');
      return;
    }

    this.lastSpecialAttackTime = now;

    // Crear ataque especial
    const specialAttack = createSpecialAttack(this.player.classType, this.player.element);

    // Obtener dirección del cursor
    const direction = new Phaser.Math.Vector2();
    direction.x =
      this.input.mousePointer.x +
      this.cameras.main.scrollX -
      this.player.x;
    direction.y =
      this.input.mousePointer.y +
      this.cameras.main.scrollY -
      this.player.y;
    direction.normalize();

    // Ejecutar ataque
    const hitEnemies = specialAttack.execute(
      this.player,
      direction,
      this,
      Array.from(this.allPlayers.values()).filter((p) => p !== this.player && p.stats.health > 0)
    );

    // Registrar golpes en acumulación elemental
    for (const enemy of hitEnemies) {
      const triggered = this.elementalAccumulation.recordHit(enemy.level, this.player.element);
      if (triggered) {
        const hasResistanceRune = this.player.runes.some((r) => r.type === 'resistance');
        this.elementalAccumulation.triggerEffect(enemy, this.player.element, hasResistanceRune);
      }
    }

    console.log(`Ataque especial: ${hitEnemies.length} enemigos`);
  }

  /**
   * Obtiene el costo de mana de un ataque especial.
   */
  private getSpecialAttackManaCost(classType: ClassType, element: ElementType): number {
    const key = `${classType.toUpperCase()}_${element.toUpperCase()}`;
    const config = SPECIAL_ATTACK_CONFIG[key as keyof typeof SPECIAL_ATTACK_CONFIG];
    if (config && typeof config === 'object' && 'manaCost' in config) {
      return (config as any).manaCost;
    }
    return 30; // Default 30 mana
  }

  /**
   * Crea UI de debug para pruebas.
   */
  private createDebugUI() {
    if (!this.player) return;

    // Dibujar grilla en el mapa
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.lineStyle(1, 0x444444, 0.3);

    const gridSize = 200; // Grid de 200px
    for (let x = 0; x <= 2000; x += gridSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, 2000);
    }
    for (let y = 0; y <= 2000; y += gridSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(2000, y);
    }
    graphics.strokePath();

    // Agregar marcadores cada 500px
    graphics.lineStyle(1, 0x666666, 0.5);
    const markerSize = 10;
    for (let x = 0; x <= 2000; x += 500) {
      for (let y = 0; y <= 2000; y += 500) {
        graphics.fillStyle(0x666666, 0.3);
        graphics.fillRect(x - markerSize / 2, y - markerSize / 2, markerSize, markerSize);
      }
    }

    const padding = 10;
    const fontSize = '12px';
    const fontColor = '#ffffff';

    // Mostrar información del jugador
    const statsText = this.add.text(padding, padding, '', {
      fontSize,
      fontFamily: 'Arial',
      color: fontColor,
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 },
    });

    // Información adicional de posición
    const positionText = this.add.text(padding, 150, '', {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 },
    });

    // Actualizar cada frame
    this.events.on('update', () => {
      if (this.player) {
        statsText.setText([
          `⚔️  Clase: ${this.player.classType}`,
          `📊 Nivel: ${this.player.level}`,
          `❤️  Vida: ${Math.round(this.player.stats.health)}/${this.player.stats.maxHealth}`,
          `🔵 Mana: ${Math.round(this.player.stats.mana)}/${this.player.stats.maxMana}`,
          `✨ Elemento: ${this.player.element}`,
          `⚡ Energía Gema: ${Math.round(this.player.gemEnergy)}/${100}`,
          `👥 Gemas en mapa: ${this.spawnManager?.gems.children.entries.length || 0}`,
          `⭐ Piedras EXP: ${this.spawnManager?.expStones.children.entries.length || 0}`,
          `💨 Piedras Viento: ${this.spawnManager?.windStones.children.entries.length || 0}`,
        ]);

        positionText.setText([
          `Posición: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
          `Velocidad: ${this.player.body ? `(${Math.round((this.player.body as any).velocity.x)}, ${Math.round((this.player.body as any).velocity.y)})` : 'N/A'}`,
          `FPS: ${Math.round(this.game.loop.actualFps)}`,
        ]);
      }
    });

    // Hacer el texto fijo a la cámara
    statsText.setScrollFactor(0);
    positionText.setScrollFactor(0);
  }

  update(time: number = 0, delta: number = 0) {
    if (!this.player || !this.spawnManager) return;

    // Convert delta from milliseconds to seconds
    const deltaSeconds = delta / 1000;

    // Movimiento del jugador
    const velocity = new Phaser.Math.Vector2();

    if (this.keys['W']?.isDown) velocity.y -= 1;
    if (this.keys['S']?.isDown) velocity.y += 1;
    if (this.keys['A']?.isDown) velocity.x -= 1;
    if (this.keys['D']?.isDown) velocity.x += 1;

    // Normalizar y escalar por velocidad del jugador
    if (velocity.length() > 0) {
      velocity.normalize().scale(this.player.stats.movement * 10); // Multiplicar por 10 para píxeles/segundo
    }

    this.player.setVelocity(velocity.x, velocity.y);

    // Actualizar consumo de energía de gema
    if (this.player.element !== ElementType.NEUTRAL && this.player.gemEnergy > 0) {
      this.player.updateGemEnergy(deltaSeconds); // Convertir a segundos
    }

    // Actualizar regeneración de mana
    this.player.updateMana(deltaSeconds);

    // Actualizar efectos de estado
    this.player.updateStatusEffects();

    // Actualizar runas
    this.player.updateRunes();

    // Actualizar spawn de objetos
    this.spawnManager.update();

    // Limpiar acumuladores expirados
    this.elementalAccumulation.cleanup();
  }
}
