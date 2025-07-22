
import { colord, extend } from 'colord';
import harmonies from 'colord/plugins/harmonies';

extend([harmonies]);

export type HarmonyType = 'analogous' | 'complementary' | 'split-complementary' | 'triadic' | 'tetradic' | 'monochromatic';

export const harmonyTypes: HarmonyType[] = ['analogous', 'complementary', 'split-complementary', 'triadic', 'tetradic', 'monochromatic'];

export function generateHarmonies(baseColor: string): Record<HarmonyType, string[]> {
  const c = colord(baseColor);

  return {
    analogous: c.harmonies('analogous').map(color => color.toHex()),
    complementary: c.harmonies('complementary').map(color => color.toHex()),
    'split-complementary': c.harmonies('split-complementary').map(color => color.toHex()),
    triadic: c.harmonies('triadic').map(color => color.toHex()),
    tetradic: c.harmonies('tetradic').map(color => color.toHex()),
    monochromatic: c.harmonies('monochromatic').map(color => color.toHex()),
  };
}

export const isValidHex = (color: string) => colord(color).isValid();
