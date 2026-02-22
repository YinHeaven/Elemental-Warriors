import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Crear carpetas si no existen
const dirs = [
  'public/assets/sprites',
  'public/assets/gems',
  'public/assets/items'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Crea una imagen PNG y la guarda
 */
function createAndSaveImage(filename, width, height, drawFn) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo transparente
  ctx.clearRect(0, 0, width, height);

  // Llamar función de dibujo
  drawFn(ctx, width, height);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`✓ Creada: ${filename}`);
}

// ============== JUGADORES (32x32) ==============

// Guerrero (rojo)
createAndSaveImage('public/assets/sprites/warrior.png', 32, 32, (ctx, w, h) => {
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;
  ctx.stroke();
});

// Arquero (verde)
createAndSaveImage('public/assets/sprites/archer.png', 32, 32, (ctx, w, h) => {
  ctx.fillStyle = '#44ff44';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.stroke();
});

// Mago (azul)
createAndSaveImage('public/assets/sprites/mage.png', 32, 32, (ctx, w, h) => {
  ctx.fillStyle = '#4444ff';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0000ff';
  ctx.lineWidth = 2;
  ctx.stroke();
});

// ============== GEMAS (16x16) ==============

// Gema de Fuego (naranja)
createAndSaveImage('public/assets/gems/fire_gem.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#ff5500';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(w / 2 - 2, h / 2 - 2, 3, 0, Math.PI * 2);
  ctx.fill();
});

// Gema de Hielo (cian)
createAndSaveImage('public/assets/gems/ice_gem.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#00ddff';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00ffff';
  ctx.beginPath();
  ctx.arc(w / 2 + 2, h / 2 + 2, 3, 0, Math.PI * 2);
  ctx.fill();
});

// Gema de Rayo (amarillo)
createAndSaveImage('public/assets/gems/lightning_gem.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffff88';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
  ctx.fill();
});

// ============== ITEMS ==============

// Piedra de Experiencia (12x12)
createAndSaveImage('public/assets/items/exp_stone.png', 12, 12, (ctx, w, h) => {
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(2, 2, 8, 8);
  ctx.fillStyle = '#ffdd00';
  ctx.fillRect(3, 3, 6, 6);
});

// Piedra de Viento (12x12)
createAndSaveImage('public/assets/items/wind_stone.png', 12, 12, (ctx, w, h) => {
  ctx.fillStyle = '#00ddff';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00ffff';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
  ctx.fill();
});

// ============== RUNAS (16x16) ==============

// Runa de Velocidad (verde)
createAndSaveImage('public/assets/items/rune_speed.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#00aa00';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#00aa00';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('V', 6, 11);
});

// Runa de Furia (rojo)
createAndSaveImage('public/assets/items/rune_attack_speed.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#aa0000';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#aa0000';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('A', 6, 11);
});

// Runa de Vida (rosa)
createAndSaveImage('public/assets/items/rune_life.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#ff88dd';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#ff0088';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#ff0088';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('L', 6, 11);
});

// Runa de Energía (azul claro)
createAndSaveImage('public/assets/items/rune_energy.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#88ddff';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#0088ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#0088ff';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('E', 6, 11);
});

// Runa de Elemento (naranja)
createAndSaveImage('public/assets/items/rune_element.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#ffaa44';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#ff6600';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#ff6600';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('F', 6, 11);
});

// Runa de Acumulación (púrpura)
createAndSaveImage('public/assets/items/rune_accumulation.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#dd88ff';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#aa00ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#aa00ff';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('X', 6, 11);
});

// Runa de Resistencia (gris)
createAndSaveImage('public/assets/items/rune_resistance.png', 16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  ctx.fillStyle = '#666666';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('R', 6, 11);
});

console.log('\n✅ ¡Todas las imágenes han sido creadas exitosamente!');
console.log('Las imágenes están en la carpeta public/assets/');
