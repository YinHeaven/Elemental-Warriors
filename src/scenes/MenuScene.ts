/**
 * Escena de menú principal - Selección de clase.
 * Permite al jugador elegir entre Guerrero, Arquero o Mago.
 */

import Phaser from 'phaser';
import { ClassType } from '../utils/constants';

export default class MenuScene extends Phaser.Scene {
  private selectedClass: ClassType | null = null;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Fondo
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // Título
    this.add.text(512, 100, 'ELEMENTAL WARRIORS', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(512, 160, 'Selecciona tu clase', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#cccccc',
      align: 'center',
    }).setOrigin(0.5);

    // Contenedor para las opciones de clases
    const classOptions = [
      {
        name: 'GUERRERO',
        description: 'Cuerpo a cuerpo, alta vida\ny ataque lento',
        value: ClassType.WARRIOR,
        x: 220,
      },
      {
        name: 'ARQUERO',
        description: 'Agil, ataque rapido\ny rango medio',
        value: ClassType.ARCHER,
        x: 512,
      },
      {
        name: 'MAGO',
        description: 'Energía alta, ataque especial\npoderoso',
        value: ClassType.MAGE,
        x: 804,
      },
    ];

    // Crear botones para cada clase
    classOptions.forEach((option) => {
      this.createClassButton(option.x, 350, option.name, option.description, option.value);
    });

    // Ayuda
    this.add.text(512, 700, 'Haz clic en una clase para continuar', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888',
      align: 'center',
    }).setOrigin(0.5);
  }

  /**
   * Crea un botón de selección de clase.
   */
  private createClassButton(x: number, y: number, name: string, description: string, classType: ClassType) {
    // Contenedor
    const container = this.add.container(x, y);

    // Fondo del botón
    const background = this.add.rectangle(0, 0, 150, 180, 0x333333, 0.8);
    background.setStrokeStyle(2, 0x666666);

    // Nombre de la clase
    const nameText = this.add.text(0, -70, name, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    // Descripción
    const descText = this.add.text(0, 20, description, {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: 140 },
    }).setOrigin(0.5);

    container.add([background, nameText, descText]);

    // Evento de clic
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerOverContainer(pointer, container)) {
        this.selectClass(classType);
      }
    });

    // Efecto hover
    background.setInteractive();
    background.on('pointerover', () => {
      background.setStrokeStyle(2, 0xffaa00);
      background.setFillStyle(0x444444, 0.9);
    });
    background.on('pointerout', () => {
      background.setStrokeStyle(2, 0x666666);
      background.setFillStyle(0x333333, 0.8);
    });
  }

  /**
   * Verifica si el puntero está sobre el contenedor.
   */
  private isPointerOverContainer(pointer: Phaser.Input.Pointer, container: Phaser.GameObjects.Container): boolean {
    const bounds = container.getBounds();
    return (
      pointer.x >= bounds.x &&
      pointer.x <= bounds.x + bounds.width &&
      pointer.y >= bounds.y &&
      pointer.y <= bounds.y + bounds.height
    );
  }

  /**
   * Selecciona una clase e inicia la escena principal.
   */
  private selectClass(classType: ClassType) {
    this.selectedClass = classType;
    // Guardar la clase seleccionada en el registro de la escena
    this.registry.set('selectedClass', classType);
    // Iniciar la escena principal
    this.scene.start('MainScene');
  }
}
