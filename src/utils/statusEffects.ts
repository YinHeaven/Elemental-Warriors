/**
 * Gestión de efectos de estado (quemadura, congelación, parálisis).
 * Define las propiedades y duración de cada efecto.
 */

import { ACCUMULATION_CONFIG } from './constants';

export interface StatusEffectInstance {
  type: 'burn' | 'freeze' | 'paralysis';
  duration: number; // en milisegundos
  dps?: number; // daño por segundo (para quemadura y parálisis)
  startTime: number;
}

export class StatusEffectManager {
  private effects: Map<string, StatusEffectInstance> = new Map();

  /**
   * Añade o actualiza un efecto de estado.
   */
  addEffect(effectType: 'burn' | 'freeze' | 'paralysis', durationMs: number, dps?: number): void {
    const effect: StatusEffectInstance = {
      type: effectType,
      duration: durationMs,
      dps,
      startTime: Date.now(),
    };
    this.effects.set(effectType, effect);
  }

  /**
   * Obtiene un efecto de estado activo.
   */
  getEffect(effectType: string): StatusEffectInstance | undefined {
    return this.effects.get(effectType);
  }

  /**
   * Verifica si un efecto está activo y aún tiene duración.
   */
  isEffectActive(effectType: string): boolean {
    const effect = this.effects.get(effectType);
    if (!effect) return false;
    return Date.now() - effect.startTime < effect.duration;
  }

  /**
   * Obtiene el tiempo restante de un efecto.
   */
  getRemainingTime(effectType: string): number {
    const effect = this.effects.get(effectType);
    if (!effect) return 0;
    const elapsed = Date.now() - effect.startTime;
    return Math.max(0, effect.duration - elapsed);
  }

  /**
   * Remueve un efecto de estado.
   */
  removeEffect(effectType: string): void {
    this.effects.delete(effectType);
  }

  /**
   * Limpia efectos expirados.
   */
  updateEffects(): void {
    const now = Date.now();
    for (const [key, effect] of this.effects.entries()) {
      if (now - effect.startTime >= effect.duration) {
        this.effects.delete(key);
      }
    }
  }

  /**
   * Obtiene todos los efectos activos.
   */
  getActiveEffects(): StatusEffectInstance[] {
    this.updateEffects();
    return Array.from(this.effects.values()).filter(
      (effect) => Date.now() - effect.startTime < effect.duration
    );
  }

  /**
   * Limpia todos los efectos.
   */
  clear(): void {
    this.effects.clear();
  }
}

/**
 * Calcula el daño por segundo de un efecto de estado.
 */
export function getStatusEffectDPS(effectType: string): number {
  switch (effectType) {
    case 'burn':
      return ACCUMULATION_CONFIG.BURN_DPS;
    case 'paralysis':
      return ACCUMULATION_CONFIG.PARALYSIS_DPS;
    default:
      return 0;
  }
}
