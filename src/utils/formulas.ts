/**
 * Fórmulas para cálculo de estadísticas, experiencia y consumo de energía.
 */

import { ClassType, STATS_CONFIG, EXPERIENCE_CONFIG, GEM_CONFIG, WIND_STONE_CONFIG } from './constants';

/**
 * Calcula estadísticas de un jugador en un nivel específico.
 * @param classType - Tipo de clase (WARRIOR, ARCHER, MAGE)
 * @param level - Nivel actual (1-30)
 * @returns Objeto con estadísticas calculadas
 */
export function calculateStats(classType: ClassType, level: number) {
  const config = STATS_CONFIG[classType.toUpperCase() as keyof typeof STATS_CONFIG];
  const level1 = config.level1;
  const level30 = config.level30;

  // Interpolación lineal entre nivel 1 y 30
  const progress = (level - 1) / 29;

  return {
    maxHealth: Math.round(level1.maxHealth + (level30.maxHealth - level1.maxHealth) * progress),
    damage: Math.round((level1.damage + (level30.damage - level1.damage) * progress) * 10) / 10,
    attackSpeed: Math.round((level1.attackSpeed + (level30.attackSpeed - level1.attackSpeed) * progress) * 100) / 100,
    movement: Math.round(level1.movement * 10) / 10, // Constante por clase
    maxMana: Math.round(level1.maxMana + (level30.maxMana - level1.maxMana) * progress),
  };
}

/**
 * Calcula la experiencia requerida para subir a un nivel específico.
 * @param level - Nivel objetivo (2-30)
 * @returns Experiencia necesaria
 */
export function getExperienceRequired(level: number): number {
  if (level < 2 || level > 30) return 0;
  return Math.floor(100 * Math.pow(EXPERIENCE_CONFIG.LEVEL_UP_EXP_MULTIPLIER, level - 2));
}

/**
 * Calcula la tasa de consumo de energía de gema según el nivel del jugador.
 * @param level - Nivel del jugador (1-30)
 * @returns Tasa de consumo en puntos/segundo
 */
export function getGemConsumptionRate(level: number): number {
  const baseRate = GEM_CONFIG.BASE_CONSUMPTION_RATE;
  return baseRate / (1 + 0.1 * (level - 1));
}

/**
 * Calcula la duración de la gema en segundos basada en su energía actual y nivel del jugador.
 * @param gemEnergy - Energía actual de la gema (0-100)
 * @param level - Nivel del jugador
 * @returns Duración en segundos
 */
export function getGemDuration(gemEnergy: number, level: number): number {
  const consumptionRate = getGemConsumptionRate(level);
  return gemEnergy / consumptionRate;
}

/**
 * Calcula la duración del buff de piedra de viento según el nivel.
 * @param level - Nivel del jugador (1-30)
 * @returns Duración en milisegundos
 */
export function getWindStoneDuration(level: number): number {
  const baseDurationMs = WIND_STONE_CONFIG.BASE_DURATION;
  const maxDurationMs = WIND_STONE_CONFIG.MAX_DURATION;
  const progress = (level - 1) / 29;
  return Math.round(baseDurationMs + (maxDurationMs - baseDurationMs) * progress);
}

/**
 * Calcula el daño final después de aplicar bonificadores de elemento.
 * @param baseDamage - Daño base del ataque
 * @param element - Tipo de elemento
 * @param elementalBonus - Objeto con bonificadores por elemento
 * @returns Daño final
 */
export function calculateDamageWithElement(
  baseDamage: number,
  element: string,
  elementalBonus: Record<string, number>
): number {
  const bonus = elementalBonus[element] || 0;
  return Math.round(baseDamage * (1 + bonus));
}

/**
 * Calcula la duración real de efectos de estado considerando runas de resistencia.
 * @param baseDuration - Duración base en milisegundos
 * @param hasResistanceRune - Si el jugador tiene Runa de Resistencia
 * @returns Duración final en milisegundos
 */
export function calculateStatusEffectDuration(baseDuration: number, hasResistanceRune: boolean): number {
  if (!hasResistanceRune) return baseDuration;
  // Reduce un 30% si tiene la runa
  return Math.round(baseDuration * 0.7);
}
