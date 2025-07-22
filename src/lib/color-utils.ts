
import { colord, extend } from 'colord';
import harmonies from 'colord/plugins/harmonies';
import random from 'colord/plugins/random';

extend([harmonies, random]);

export type HarmonyType = 'analogous' | 'complementary' | 'split-complementary' | 'triadic';

export const harmonyTypes: HarmonyType[] = ['analogous', 'complementary', 'split-complementary', 'triadic'];

export function generateHarmonies(baseColor: string): Record<HarmonyType, string[]> {
  const base = colord(baseColor);
  const baseHsl = base.toHsl();

  const processHarmony = (harmonyType: HarmonyType): string[] => {
    return base.harmonies(harmonyType).map(color => {
      // Adjust saturation and lightness to be closer to the base color for better aesthetics
      const colorHsl = color.toHsl();
      colorHsl.s = (colorHsl.s + baseHsl.s) / 2; // Average saturation
      colorHsl.l = (colorHsl.l + baseHsl.l) / 2; // Average lightness
      return colord(colorHsl).toHex();
    });
  };

  return {
    analogous: processHarmony('analogous'),
    complementary: processHarmony('complementary'),
    'split-complementary': processHarmony('split-complementary'),
    triadic: processHarmony('triadic'),
  };
}

export const isValidHex = (color: string) => colord(color).isValid();
