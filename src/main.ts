/**
 * Punto de entrada principal de Elemental Warriors.
 * Inicializa Phaser con la configuración y lanza el juego.
 */

import Phaser from 'phaser';
import config from './config';

// Crear instancia del juego
const game = new Phaser.Game(config);

// Log de inicio
console.log('Elemental Warriors iniciado');
