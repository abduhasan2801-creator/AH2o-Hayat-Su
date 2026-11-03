export type Season = 'summer' | 'winter' | 'spring' | 'autumn';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'athlete';

export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: Gender;
  season: Season;
  activityLevel: ActivityLevel;
}

export interface CalculationResult {
  dailyTargetMl: number;
  glassesCount: number;
  baseWeightNeed: number;
  seasonAdjustmentMl: number;
  activityAdjustmentMl: number;
  heightAdjustmentMl: number;
  portionMl: number;
}

export const defaultProfile: UserProfile = {
  age: 28,
  weight: 70,
  height: 175,
  gender: 'male',
  season: 'summer', // default seasonal setting
  activityLevel: 'moderate',
};

/**
 * Calculates optimal water intake based on age, weight, height, season, and activity
 */
export function calculateHydration(profile: UserProfile): CalculationResult {
  const { age, weight, height, gender, season, activityLevel } = profile;

  // 1. Base hydration by weight & age
  let mlPerKg = 35;
  if (age < 18) {
    mlPerKg = 40;
  } else if (age >= 18 && age < 30) {
    mlPerKg = 38;
  } else if (age >= 30 && age <= 55) {
    mlPerKg = 35;
  } else {
    mlPerKg = 30;
  }

  const baseWeightNeed = Math.round(weight * mlPerKg);

  // 2. Height & Body Surface Area adjustment
  // Reference height is 170cm
  const heightDiff = height - 170;
  const heightAdjustmentMl = Math.round(heightDiff * 5); // ~50ml per 10cm difference

  // 3. Gender baseline adjustment
  const genderAdjustment = gender === 'male' ? 150 : 0;

  // Subtotal before season and activity
  const preliminaryBase = Math.max(1200, baseWeightNeed + heightAdjustmentMl + genderAdjustment);

  // 4. Season multiplier & adjustment
  // Summer: +20% due to sweating and heat index
  // Spring: +5% for detox and mild warming
  // Autumn: +5% for dry wind and skin hydration
  // Winter: 1.0 (baseline, essential for kidney and metabolic function)
  let seasonMultiplier = 1.0;
  if (season === 'summer') {
    seasonMultiplier = 1.20;
  } else if (season === 'spring') {
    seasonMultiplier = 1.05;
  } else if (season === 'autumn') {
    seasonMultiplier = 1.05;
  } else if (season === 'winter') {
    seasonMultiplier = 1.0;
  }

  const seasonAdjustmentMl = Math.round(preliminaryBase * (seasonMultiplier - 1));

  // 5. Activity level adjustment
  let activityMultiplier = 1.0;
  if (activityLevel === 'moderate') {
    activityMultiplier = 1.10;
  } else if (activityLevel === 'active') {
    activityMultiplier = 1.25;
  } else if (activityLevel === 'athlete') {
    activityMultiplier = 1.35;
  }

  const activityAdjustmentMl = Math.round(preliminaryBase * (activityMultiplier - 1));

  // Total daily intake rounded to nearest 50ml
  const total = preliminaryBase + seasonAdjustmentMl + activityAdjustmentMl;
  const dailyTargetMl = Math.round(total / 50) * 50;

  // Recommended single portion size (usually ~200 - 250ml)
  const portionMl = 250;
  const glassesCount = Math.round(dailyTargetMl / portionMl);

  return {
    dailyTargetMl,
    glassesCount,
    baseWeightNeed,
    seasonAdjustmentMl,
    activityAdjustmentMl,
    heightAdjustmentMl,
    portionMl,
  };
}

/**
 * Determine default current season based on current month in Northern Hemisphere
 */
export function getCurrentCalendarSeason(): Season {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
  if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return 'autumn'; // Sep, Oct, Nov
  return 'winter'; // Dec, Jan, Feb
}
