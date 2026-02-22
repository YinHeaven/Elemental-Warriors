/**
 * Sistema de Acumulación Elemental - Lógica de 3 golpes.
 * Rastrea los golpes de cada elemento contra cada enemigo.
 * Al alcanzar 3 golpes, aplica un efecto de estado.
 */

import { ElementType, ACCUMULATION_CONFIG } from '../utils/constants';
import { calculateStatusEffectDuration } from '../utils/formulas';
import Player from '../entities/Player';

interface AccumulationTracker {
  element: ElementType;
  count: number;
  timestamp: number;
}

export class ElementalAccumulation {
  private accumulators: Map<number, AccumulationTracker> = new Map();

  /**
   * Registra un golpe contra un enemigo.
   * Si alcanza 3 golpes del mismo elemento en 3 segundos, aplica efecto.
   */
  recordHit(targetId: number, element: ElementType): boolean {
    if (element === ElementType.NEUTRAL) {
      return false; // Sin elemento, sin acumulación
    }

    const now = Date.now();
    const acc = this.accumulators.get(targetId);

    if (!acc || acc.element !== element || now - acc.timestamp > ACCUMULATION_CONFIG.RESET_DURATION) {
      // Nuevo contador o reset por timeout o elemento diferente
      this.accumulators.set(targetId, {
        element,
        count: 1,
        timestamp: now,
      });
      return false;
    } else {
      // Incrementar contador
      acc.count++;
      acc.timestamp = now;

      if (acc.count >= ACCUMULATION_CONFIG.HITS_NEEDED) {
        // Dispara el efecto
        this.accumulators.delete(targetId); // Reinicia
        return true;
      }
    }

    return false;
  }

  /**
   * Aplica el efecto de estado según el elemento.
   */
  triggerEffect(target: Player, element: ElementType, hasResistanceRune: boolean = false): void {
    switch (element) {
      case ElementType.FIRE:
        // Quemadura: 5 pts/seg durante 3 segundos
        const burnDuration = calculateStatusEffectDuration(
          ACCUMULATION_CONFIG.BURN_DURATION,
          hasResistanceRune
        );
        target.statusEffectManager.addEffect('burn', burnDuration, ACCUMULATION_CONFIG.BURN_DPS);
        break;

      case ElementType.ICE:
        // Congelación: 0.4 segundos
        const freezeDuration = calculateStatusEffectDuration(
          ACCUMULATION_CONFIG.FREEZE_DURATION,
          hasResistanceRune
        );
        target.statusEffectManager.addEffect('freeze', freezeDuration);
        break;

      case ElementType.LIGHTNING:
        // Parálisis: 0.2 segundos + pequeño DPS
        const paralyzeDuration = calculateStatusEffectDuration(
          ACCUMULATION_CONFIG.PARALYSIS_DURATION,
          hasResistanceRune
        );
        target.statusEffectManager.addEffect('paralysis', paralyzeDuration, ACCUMULATION_CONFIG.PARALYSIS_DPS);
        break;

      default:
        break;
    }
  }

  /**
   * Obtiene el número de golpes acumulados contra un enemigo.
   */
  getAccumulationCount(targetId: number): number {
    const acc = this.accumulators.get(targetId);
    if (!acc || Date.now() - acc.timestamp > ACCUMULATION_CONFIG.RESET_DURATION) {
      return 0;
    }
    return acc.count;
  }

  /**
   * Reinicia la acumulación de un enemigo.
   */
  reset(targetId: number): void {
    this.accumulators.delete(targetId);
  }

  /**
   * Limpia todos los acumuladores expirados.
   */
  cleanup(): void {
    const now = Date.now();
    for (const [id, acc] of this.accumulators.entries()) {
      if (now - acc.timestamp > ACCUMULATION_CONFIG.RESET_DURATION) {
        this.accumulators.delete(id);
      }
    }
  }

  /**
   * Limpia todos los acumuladores.
   */
  clear(): void {
    this.accumulators.clear();
  }
}
