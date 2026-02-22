# 📖 Guía de Personalización de Paredes - Elemental Warriors

## ¿Dónde está el archivo?

**Ruta del archivo:** `src/scenes/MainScene.ts`

**Función a editar:** `setupWalls()` (línea 179)

---

## 🧱 Cómo Agregar Paredes

### Sintaxis Básica

```typescript
this.addWall(x, y, width, height);
```

**Parámetros:**
- `x` → Posición **horizontal** (centro de la pared)
- `y` → Posición **vertical** (centro de la pared)
- `width` → Ancho de la pared en píxeles
- `height` → Alto de la pared en píxeles

---

## 📐 El Mapa

El mapa total es de **2000 x 2000 píxeles**

```
(0,0)  ←════════════════════════→ (2000,0)
  ↑                                  ↑
  ║     TU MAPA DE JUEGO             ║
  ║     (Rellena con paredes)        ║
  ↓                                  ↓
(0,2000) ←══════════════════════→ (2000,2000)
```

---

## 💡 Ejemplos Prácticos

### Pared Horizontal (Izquierda a Derecha)

```typescript
// Pared de 300 píxeles de ancho en la posición (500, 500)
this.addWall(500, 500, 300, 50);
//            ↑    ↑    ↑    ↑
//            x    y  ancho alto
```

**Resultado:** Una barra horizontal gruesa (ancho > alto)

---

### Pared Vertical (Arriba a Abajo)

```typescript
// Pared de 300 píxeles de alto en la posición (1500, 600)
this.addWall(1500, 600, 50, 300);
//            ↑    ↑   ↑   ↑
//            x    y  ancho alto
```

**Resultado:** Una barra vertical (alto > ancho)

---

## 🎯 Ejemplos de Patrones Comunes

### Sala Cerrada (Caja)

```typescript
// Crear una habitación cuadrada
// Centro en (1000, 1000), tamaño 400x400

// Pared superior
this.addWall(1000, 800, 400, 30);

// Pared inferior
this.addWall(1000, 1200, 400, 30);

// Pared izquierda
this.addWall(800, 1000, 30, 400);

// Pared derecha
this.addWall(1200, 1000, 30, 400);
```

---

### Laberinto Sencillo

```typescript
// Pasillo vertical
this.addWall(1000, 500, 100, 200);

// Obstáculo horizontal
this.addWall(800, 800, 300, 50);

// Pared de salida
this.addWall(1200, 1200, 50, 200);
```

---

### Divisor de Mapa

```typescript
// Divide el mapa en dos mitades
this.addWall(1000, 1000, 50, 2000);
```

---

## 🔧 Cómo Editar en tu Editor

### Paso 1: Abre el archivo
```bash
# Desde la terminal en tu carpeta del proyecto
code src/scenes/MainScene.ts

# O usa tu editor favorito (VS Code, WebStorm, etc.)
```

### Paso 2: Busca la función `setupWalls()`

Presiona `Ctrl + F` (Windows/Linux) o `Cmd + F` (Mac) y busca:
```
setupWalls()
```

### Paso 3: Agrega tus paredes

Dentro de la función, añade tus líneas de `this.addWall()`:

```typescript
private setupWalls() {
  if (!this.wallsGroup) return;

  // PAREDES DE LOS BORDES
  this.addWall(1000, 20, 2000, 40);
  this.addWall(1000, 1980, 2000, 40);
  this.addWall(20, 1000, 40, 2000);
  this.addWall(1980, 1000, 40, 2000);

  // TUS PAREDES PERSONALIZADAS AQUI:
  this.addWall(500, 500, 300, 50);    // Tu pared 1
  this.addWall(1500, 600, 50, 300);   // Tu pared 2
  // ... más paredes
}
```

### Paso 4: Guarda y Compila

```bash
# Compila el proyecto
npm run build

# O inicia el servidor de desarrollo
npm run dev
```

---

## 🎮 Cómo Testear

1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Abre en navegador:**
   ```
   http://localhost:8081
   ```

3. **Selecciona una clase y muévete con WASD**

4. **Si una pared no funciona:**
   - Revisa la consola (F12) para ver los logs
   - Verifica las coordenadas (x, y)
   - Recuerda que el mapa es 2000x2000

---

## 📝 Variables Útiles

| Variable | Valor | Descripción |
|----------|-------|-------------|
| Ancho mapa | 2000 | Límites horizontales (0-2000) |
| Alto mapa | 2000 | Límites verticales (0-2000) |
| Centro | (1000, 1000) | Punto central del mapa |
| Color pared | Marrón (#8b4513) | Color visual de las paredes |

---

## 🐛 Troubleshooting

### Error: "Property 'addWall' does not exist"
- Asegúrate de estar dentro de la clase `MainScene`
- El código debe estar en la función `setupWalls()`

### Las paredes no aparecen
- Verifica que las coordenadas estén dentro de 0-2000
- Revisa la consola (F12) para ver los logs: `🧱 Pared agregada en...`

### El jugador atraviesa las paredes
- Asegúrate de haber compilado: `npm run build`
- Reinicia el servidor: `npm run dev`

### Quiero comentar una pared sin borrarla
```typescript
// this.addWall(500, 500, 300, 50);  // ← comentada, no se mostrará
```

---

## 💾 Cambios Rápidos

### Sin compilar (Hot Reload)
Si tienes `npm run dev` corriendo, los cambios en `setupWalls()` se recargan automáticamente en algunos casos. Si no, haz:

```bash
# Guarda el archivo (Ctrl+S)
# Actualiza el navegador (F5)
```

### Compilación completa
```bash
npm run build
```

---

## 📚 Ejemplo Completo

Aquí está cómo se vería tu archivo `setupWalls()` con varias paredes:

```typescript
private setupWalls() {
  if (!this.wallsGroup) return;

  // BORDES DEL MAPA
  this.addWall(1000, 20, 2000, 40);       // Superior
  this.addWall(1000, 1980, 2000, 40);     // Inferior
  this.addWall(20, 1000, 40, 2000);       // Izquierda
  this.addWall(1980, 1000, 40, 2000);     // Derecha

  // MI LABERINTO PERSONALIZADO
  this.addWall(400, 600, 200, 40);        // Pasillo 1
  this.addWall(1600, 500, 40, 250);       // Pasillo 2
  this.addWall(1000, 1200, 300, 50);      // Obstáculo central
  this.addWall(700, 1500, 50, 200);       // Pared de salida

  console.log(`✓ ${this.wallsGroup.children.entries.length} paredes creadas`);
}
```

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si pongo una pared fuera del mapa?**
A: Se creará pero no será visible. Mantén los valores dentro de 0-2000.

**P: ¿Puedo cambiar el color de las paredes?**
A: Sí, edita `Wall.ts` línea 24: `graphics.fillStyle(0x8b4513, 0.8);` (cambia el número hex)

**P: ¿Las paredes afectan a los items (gemas)?**
A: No, solo bloquean al jugador. Los items pasan a través.

**P: ¿Cómo borro todas las paredes?**
A: Comenta todas las líneas `this.addWall()` o elimínalas. Las paredes de borde se mantendrán para evitar que salgas del mapa.

---

**¡Diviértete diseñando tu mapa! 🎮**
