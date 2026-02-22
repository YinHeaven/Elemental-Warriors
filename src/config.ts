/**
 * Configuración principal de Phaser para Elemental Warriors.
 */

import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: 'parent',
  },
  scene: [MenuScene, MainScene],
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
};

export default config;
