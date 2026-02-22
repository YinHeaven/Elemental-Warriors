# Elemental Warriors

Un juego .io en tiempo real desarrollado con **Phaser 3** y **TypeScript**. Combina combate elemental, recolección de gemas y progresión de niveles en un mapa variado.

## Instalación y Setup

### Requisitos Previos
- Node.js 14+ instalado
- npm o yarn

### Instrucciones

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Compilar para producción:
   ```bash
   npm run build
   ```

## Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada
├── config.ts                  # Configuración de Phaser
├── scenes/
│   ├── MenuScene.ts          # Menú de selección de clase
│   └── MainScene.ts          # Escena principal del juego
├── entities/
│   ├── Player.ts             # Clase jugador
│   ├── Gem.ts                # Gemas elementales
│   ├── ExpStone.ts           # Piedras de experiencia
│   ├── WindStone.ts          # Piedras de viento
│   └── Rune.ts               # Runas (buffs temporales)
├── attacks/
│   ├── Attack.ts             # Clase base para ataques
│   ├── BasicAttack.ts        # Ataques normales por clase
│   ├── SpecialAttacks.ts     # Ataques especiales (9 combinaciones)
│   └── ElementalAccumulation.ts  # Lógica de acumulación (3 golpes)
├── managers/
│   └── SpawnManager.ts       # Gestor de aparición de objetos
├── utils/
│   ├── constants.ts          # Constantes y valores de balance
│   ├── formulas.ts           # Cálculos de estadísticas
│   └── statusEffects.ts      # Gestión de efectos de estado
└── types/
    └── index.ts              # Tipos TypeScript globales
```

## Assets Requeridos

### Estructura de Directorios

```
public/assets/
├── players/
│   ├── warrior.png (32x32 spritesheet, 8 frames)
│   ├── archer.png (32x32 spritesheet, 8 frames)
│   ├── mage.png (32x32 spritesheet, 8 frames)
│   ├── warrior_menu.png (64x64)
│   ├── archer_menu.png (64x64)
│   └── mage_menu.png (64x64)
├── gems/
│   ├── fire_gem.png (16x16)
│   ├── ice_gem.png (16x16)
│   └── lightning_gem.png (16x16)
├── items/
│   ├── exp_stone.png (12x12)
│   ├── wind_stone.png (12x12)
│   └── runes/ (múltiples según tipos)
│       ├── speed_rune.png
│       ├── attackSpeed_rune.png
│       ├── life_rune.png
│       ├── energy_rune.png
│       ├── element_rune.png
│       ├── accumulation_rune.png
│       └── resistance_rune.png
├── tilemaps/
│   ├── map.json (exportado desde Tiled)
│   └── tileset.png (32x32 tiles)
└── projectiles/
    ├── arrow.png (8x8)
    ├── fire_projectile.png (12x12)
    └── lightning_projectile.png (12x12)
```

### Especificaciones de Assets

**Personajes (Spritesheets):**
- Tamaño: 32x32 píxeles por frame
- Frames: 4 (caminar arriba, abajo, izquierda, derecha) + 2 (ataque) + 2 (especial)
- Total: 8 frames horizontales o vertical

**Gemas:**
- Tamaño: 16x16 píxeles
- Requiere: Flama para fuego, cristal azul para hielo, rayo para electricidad

**Objetos:**
- Piedra de Exp: 12x12 píxeles (color amarillo/dorado)
- Piedra de Viento: 12x12 píxeles (color azul claro)
- Runas: 16x16 píxeles (color según tipo)

**Tilemaps:**
- Tileset: 32x32 píxeles por tile
- Capas requeridas en Tiled:
  - `Background`: Suelo decorativo (sin colisiones)
  - `Obstacles`: Rocas, árboles (con colisiones)
  - `Shrubs`: Matorrales (sin colisiones, solo visual)
  - `Water`: Agua (sin colisiones, ralentiza movimiento)

**Proyectiles:**
- Flecha: 8x8 píxeles
- Proyectil de fuego: 12x12 píxeles
- Proyectil de electricidad: 12x12 píxeles

## Clases en el Juego

### Guerrero
- **Vida máxima (Nivel 1):** 150 | (Nivel 30): 600
- **Daño (Nivel 1):** 10 | (Nivel 30): 25
- **Velocidad de ataque:** 0.8 - 1.0 ataques/segundo
- **Velocidad de movimiento:** 2.5 píxeles/fotograma
- **Ataque básico:** Media luna cuerpo a cuerpo
- **Especiales:** Onda de Fuego, Golpe Congelador, Choque Eléctrico

### Arquero
- **Vida máxima (Nivel 1):** 100 | (Nivel 30): 350
- **Daño (Nivel 1):** 8 | (Nivel 30): 20
- **Velocidad de ataque:** 1.4 - 1.8 ataques/segundo
- **Velocidad de movimiento:** 3.2 píxeles/fotograma
- **Ataque básico:** Flecha proyectil
- **Especiales:** Lluvia de Flechas, Flecha de Hielo, Volley Eléctrico

### Mago
- **Vida máxima (Nivel 1):** 90 | (Nivel 30): 330
- **Daño (Nivel 1):** 12 | (Nivel 30): 24
- **Velocidad de ataque:** 1.0 - 1.3 ataques/segundo
- **Velocidad de movimiento:** 2.8 píxeles/fotograma
- **Mana máximo (Nivel 1):** 150 | (Nivel 30): 350
- **Ataque básico:** Proyectil mágico azul
- **Especiales:** Bola de Fuego, Nova de Hielo, Descarga Encadenada

## Elementos y Mecánicas

### Elementos Disponibles
- **Fuego:** +25% daño, puede causar quemadura
- **Hielo:** Ralentiza movimiento al 50%, puede congelar
- **Electricidad:** Pequeño knockback adicional, puede paralizar

### Sistema de Acumulación Elemental
Golpear a un enemigo 3 veces con el mismo elemento en 3 segundos activa:
- **Quemadura (Fuego):** 5 pts/seg durante 3 segundos
- **Congelación (Hielo):** 0.4 segundos de inmovilidad
- **Parálisis (Electricidad):** 0.2 segundos + 3 pts/seg

### Gemas Elementales
- **Duración base:** 10 segundos (nivel 1) hasta 36 segundos (nivel 30)
- **Energía:** 100 puntos
- **Tasa de consumo escalada:** Aumenta con el nivel
- **Drop:** Al morir con gema, reaparece con 100% energía

### Runas (Buffs Temporales)
| Runa | Efecto | Duración | Rareza |
|------|--------|----------|--------|
| Velocidad | +20% movimiento | 2 min | Común |
| Furia | +20% velocidad ataque | 2 min | Común |
| Vida | +30% vida máxima | 2.5 min | Rara |
| Energía | +30% mana, +50% regen | 2.5 min | Rara |
| Elemento | -20% consumo gema | 3 min | Épica |
| Acumulación | Golpes cuentan doble | 2 min | Rara |
| Resistencia | -30% duración efectos | 2 min | Común |

**Límite:** Máximo 2 runas activas simultáneamente

### Piedras de Viento
- **Efecto:** +50% velocidad de movimiento
- **Duración:** 1 segundo (nivel 1) a 6 segundos (nivel 30)

### Sistema de Experiencia
| Acción | EXP |
|--------|-----|
| Recoger Piedra de Exp | 10 |
| Matar sin elemento | 50 |
| Matar con elemento | 80 |

**Progresión:** Aumenta exponencialmente (×1.15 por nivel)

## Desarrollo

### Convenciones de Código
- **Código:** Inglés (variables, funciones, clases)
- **Comentarios:** Español (JSDoc y explicaciones)
- **Strict TypeScript:** Habilitado en tsconfig.json
- **Carpetas:** Organizadas por funcionalidad

### Próximos Pasos
- [ ] Crear assets visuales
- [ ] Integrar tilemap desde Tiled
- [ ] Añadir efectos de partículas
- [ ] Sistema de sonido
- [ ] UI completa (barras, contadores)
- [ ] Sesiones multijugador (opcional)
- [ ] Balance final y testing

## Licencia

Este proyecto es de código abierto. Contribuciones bienvenidas.

---

**Nota:** Los assets actualmente se generan como formas geométricas simples (rectángulos, círculos) para permitir desarrollo sin depender de archivos externos. Reemplaza los rutas comentadas en el código al proporcionar assets reales.
