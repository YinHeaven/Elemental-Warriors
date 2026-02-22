/**
 * Enumerados y constantes globales para Elemental Warriors.
 * Defines tipos de clase, elementos, runas, efectos de estado y valores de balance.
 */

export enum ClassType {
  WARRIOR = 'warrior',
  ARCHER = 'archer',
  MAGE = 'mage',
}

export enum ElementType {
  FIRE = 'fire',
  ICE = 'ice',
  LIGHTNING = 'lightning',
  NEUTRAL = 'neutral',
}

export enum RuneType {
  SPEED = 'speed',
  ATTACK_SPEED = 'attackSpeed',
  LIFE = 'life',
  ENERGY = 'energy',
  ELEMENT = 'element',
  ACCUMULATION = 'accumulation',
  RESISTANCE = 'resistance',
}

export enum StatusEffect {
  BURN = 'burn',
  FREEZE = 'freeze',
  PARALYSIS = 'paralysis',
  NONE = 'none',
}

export enum RuneRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
}

// =================================================================
// ESTADÍSTICAS BASE Y CRECIMIENTO
// =================================================================

export const STATS_CONFIG = {
  WARRIOR: {
    level1: { maxHealth: 150, damage: 10, attackSpeed: 0.8, movement: 20.5, maxMana: 80 },
    level30: { maxHealth: 600, damage: 25, attackSpeed: 1.0, movement: 20.5, maxMana: 150 },
  },
  ARCHER: {
    level1: { maxHealth: 100, damage: 8, attackSpeed: 1.4, movement: 30.2, maxMana: 100 },
    level30: { maxHealth: 350, damage: 20, attackSpeed: 1.8, movement: 30.2, maxMana: 180 },
  },
  MAGE: {
    level1: { maxHealth: 90, damage: 12, attackSpeed: 1.0, movement: 20.8, maxMana: 150 },
    level30: { maxHealth: 330, damage: 24, attackSpeed: 1.3, movement: 20.8, maxMana: 350 },
  },
};

// =================================================================
// GEMAS Y ENERGÍA
// =================================================================

export const GEM_CONFIG = {
  MAX_ENERGY: 100,
  BASE_CONSUMPTION_RATE: 10, // puntos/segundo en nivel 1
  ELEMENT_DISTRIBUTION: { [ElementType.FIRE]: 0.33, [ElementType.ICE]: 0.33, [ElementType.LIGHTNING]: 0.34 },
};

// =================================================================
// SPAWN DE OBJETOS
// =================================================================

export const SPAWN_CONFIG = {
  GEMS: { max: 8, interval: 180 }, // ~3 segundos a 60fps
  EXP_STONES: { max: 15, interval: 60 }, // ~1 segundo
  WIND_STONES: { max: 3, interval: 480 }, // ~8 segundos
  RUNES: { max: 2, interval: 1200 }, // ~20 segundos
  MAP_PADDING: 100, // píxeles de offset desde los bordes
};

// =================================================================
// EXPERIENCIA Y NIVELES
// =================================================================

export const EXPERIENCE_CONFIG = {
  EXP_BASE_STONE: 10,
  EXP_KILL_WITHOUT_ELEMENT: 50,
  EXP_KILL_WITH_ELEMENT: 80,
  LEVEL_UP_EXP_MULTIPLIER: 1.15, // Crecimiento exponencial suave
};

// =================================================================
// ATAQUES BÁSICOS
// =================================================================

export const BASIC_ATTACK_CONFIG = {
  WARRIOR: {
    range: 50,
    knockback: 200,
    elementalDamageBonus: { [ElementType.FIRE]: 0.25, [ElementType.ICE]: 0, [ElementType.LIGHTNING]: 0 },
  },
  ARCHER: {
    projectileSpeed: 400,
    knockback: 100,
    elementalDamageBonus: { [ElementType.FIRE]: 0.15, [ElementType.ICE]: 0, [ElementType.LIGHTNING]: 0 },
  },
  MAGE: {
    projectileSpeed: 350,
    knockback: 80,
    elementalDamageBonus: { [ElementType.FIRE]: 0.2, [ElementType.ICE]: 0, [ElementType.LIGHTNING]: 0 },
  },
};

// =================================================================
// ATAQUES ESPECIALES
// =================================================================

export const SPECIAL_ATTACK_CONFIG = {
  COOLDOWN: 3000, // milisegundos
  WARRIOR_FIRE: { damage: 20, manaCost: 30, range: 70, knockback: 250 },
  WARRIOR_ICE: { damage: 15, manaCost: 25, range: 60, knockback: 150, freezeDuration: 500 },
  WARRIOR_LIGHTNING: { damage: 18, manaCost: 28, range: 65, knockback: 180, paralyzeDuration: 300, dps: 2 },
  ARCHER_FIRE: { damage: 15, manaCost: 35, count: 3, knockback: 120 },
  ARCHER_ICE: { damage: 18, manaCost: 32, splashRadius: 80, knockback: 130 },
  ARCHER_LIGHTNING: { damage: 16, manaCost: 30, count: 2, knockback: 110 },
  MAGE_FIRE: { damage: 25, manaCost: 40, splashRadius: 100, knockback: 200 },
  MAGE_ICE: { damage: 20, manaCost: 38, splashRadius: 120, knockback: 180, freezeDuration: 700 },
  MAGE_LIGHTNING: { damage: 22, manaCost: 42, maxChains: 2, knockback: 160 },
};

// =================================================================
// ACUMULACIÓN ELEMENTAL
// =================================================================

export const ACCUMULATION_CONFIG = {
  HITS_NEEDED: 3,
  RESET_DURATION: 3000, // milisegundos
  BURN_DPS: 5,
  BURN_DURATION: 3000,
  FREEZE_DURATION: 400,
  PARALYSIS_DURATION: 200,
  PARALYSIS_DPS: 3,
};

// =================================================================
// PIEDRAS DE VIENTO
// =================================================================

export const WIND_STONE_CONFIG = {
  MOVEMENT_BONUS: 0.5, // +50% velocidad
  BASE_DURATION: 1000, // 1 segundo en nivel 1
  MAX_DURATION: 6000, // 6 segundos en nivel 30
};

// =================================================================
// RUNAS
// =================================================================

export const RUNE_CONFIG = {
  MAX_ACTIVE: 2,
  TYPES: {
    [RuneType.SPEED]: {
      movementBonus: 0.2,
      duration: 120000, // 2 minutos
      rarity: RuneRarity.COMMON,
      effects: { movementBonus: 0.2 },
    },
    [RuneType.ATTACK_SPEED]: {
      attackSpeedBonus: 0.2,
      duration: 120000,
      rarity: RuneRarity.COMMON,
      effects: { attackSpeedBonus: 0.2 },
    },
    [RuneType.LIFE]: {
      maxHealthBonus: 0.3,
      duration: 150000, // 2.5 minutos
      rarity: RuneRarity.RARE,
      effects: { maxHealthBonus: 0.3 },
    },
    [RuneType.ENERGY]: {
      maxManaBonus: 0.3,
      manaRegenBonus: 0.5,
      duration: 150000,
      rarity: RuneRarity.RARE,
      effects: { maxManaBonus: 0.3, manaRegenBonus: 0.5 },
    },
    [RuneType.ELEMENT]: {
      gemConsumptionReduction: 0.2,
      duration: 180000, // 3 minutos
      rarity: RuneRarity.EPIC,
      effects: { gemConsumptionReduction: 0.2 },
    },
    [RuneType.ACCUMULATION]: {
      accumulationMultiplier: 0.5, // Cuenta como 1.5 golpes en lugar de 1
      duration: 120000,
      rarity: RuneRarity.RARE,
      effects: { accumulationMultiplier: 0.5 },
    },
    [RuneType.RESISTANCE]: {
      statusEffectDurationReduction: 0.3,
      duration: 120000,
      rarity: RuneRarity.COMMON,
      effects: { statusEffectDurationReduction: 0.3 },
    },
  },
};

// =================================================================
// MANA Y ENERGÍA
// =================================================================

export const MANA_CONFIG = {
  REGEN_PER_SECOND: 10, // puntos por segundo
};

// =================================================================
// EFECTOS VISUALES
// =================================================================

export const VISUAL_CONFIG = {
  SHRUB_ALPHA_IN_BUSH: 0.5,
  WIND_STONE_GLOW_INTENSITY: 1.2,
  GEM_GLOW_INTENSITY: 0.8,
};
