import Color from 'color';

export interface ColorHarmony {
  type: 'complementary' | 'analogous' | 'triadic' | 'neutral';
  colors: string[];
}

/**
 * Converts HEX color to HSL
 */
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const color = Color(hex);
  return color.hsl().object();
};

/**
 * Converts HSL to HEX
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  return Color.hsl(h, s, l).hex();
};

/**
 * Get complementary color (opposite on color wheel - 180 degrees)
 */
export const getComplementaryColor = (hex: string): string => {
  const hsl = hexToHsl(hex);
  const complementaryHue = (hsl.h + 180) % 360;
  return hslToHex(complementaryHue, hsl.s, hsl.l);
};

/**
 * Get analogous colors (adjacent on color wheel - ±30 degrees)
 */
export const getAnalogousColors = (hex: string): string[] => {
  const hsl = hexToHsl(hex);
  const analogous1 = (hsl.h + 30) % 360;
  const analogous2 = (hsl.h - 30 + 360) % 360;

  return [
    hslToHex(analogous1, hsl.s, hsl.l),
    hslToHex(analogous2, hsl.s, hsl.l)
  ];
};

/**
 * Get triadic colors (120 degrees apart on color wheel)
 */
export const getTriadicColors = (hex: string): string[] => {
  const hsl = hexToHsl(hex);
  const triadic1 = (hsl.h + 120) % 360;
  const triadic2 = (hsl.h + 240) % 360;

  return [
    hslToHex(triadic1, hsl.s, hsl.l),
    hslToHex(triadic2, hsl.s, hsl.l)
  ];
};

/**
 * Get neutral colors (black, white, grays, beige)
 */
export const getNeutralColors = (): string[] => {
  return [
    '#000000', // Black
    '#FFFFFF', // White
    '#808080', // Gray
    '#C0C0C0', // Silver
    '#696969', // Dim Gray
    '#D3D3D3', // Light Gray
    '#F5F5DC', // Beige
    '#FAEBD7', // Antique White
    '#2F4F4F', // Dark Slate Gray
    '#708090'  // Slate Gray
  ];
};

/**
 * Check if a color is neutral (low saturation or specific neutral hues)
 */
export const isNeutralColor = (hex: string): boolean => {
  const hsl = hexToHsl(hex);
  const color = Color(hex);

  // Low saturation = neutral
  if (hsl.s < 15) {
    return true;
  }

  // Beige/brown range (hue 20-40 with moderate saturation)
  if (hsl.h >= 20 && hsl.h <= 40 && hsl.s < 40) {
    return true;
  }

  return false;
};

/**
 * Calculate color distance/similarity using Delta E formula (simplified)
 * Returns a value between 0 (identical) and ~100 (very different)
 */
export const colorDistance = (hex1: string, hex2: string): number => {
  const color1 = Color(hex1);
  const color2 = Color(hex2);

  const lab1 = color1.lab().array();
  const lab2 = color2.lab().array();

  const deltaL = lab1[0] - lab2[0];
  const deltaA = lab1[1] - lab2[1];
  const deltaB = lab1[2] - lab2[2];

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
};

/**
 * Main function to get all compatible colors for a given color
 */
export const getCompatibleColors = (hex: string): ColorHarmony[] => {
  const harmonies: ColorHarmony[] = [];

  // 1. Complementary harmony
  harmonies.push({
    type: 'complementary',
    colors: [getComplementaryColor(hex)]
  });

  // 2. Analogous harmony
  harmonies.push({
    type: 'analogous',
    colors: getAnalogousColors(hex)
  });

  // 3. Triadic harmony
  harmonies.push({
    type: 'triadic',
    colors: getTriadicColors(hex)
  });

  // 4. Neutral harmony (always compatible)
  harmonies.push({
    type: 'neutral',
    colors: getNeutralColors()
  });

  return harmonies;
};

/**
 * Check if two colors are compatible based on color theory
 * @param threshold - Distance threshold (lower = more strict matching)
 */
export const areColorsCompatible = (
  color1: string,
  color2: string,
  threshold: number = 30
): boolean => {
  // Neutrals go with everything
  if (isNeutralColor(color1) || isNeutralColor(color2)) {
    return true;
  }

  // Get all compatible colors for color1
  const harmonies = getCompatibleColors(color1);

  // Check if color2 is close to any harmony color
  for (const harmony of harmonies) {
    for (const harmonyColor of harmony.colors) {
      const distance = colorDistance(color2, harmonyColor);
      if (distance < threshold) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Get a flat list of all compatible color HEX codes
 */
export const getAllCompatibleColorHexCodes = (hex: string): string[] => {
  const harmonies = getCompatibleColors(hex);
  const allColors = new Set<string>();

  harmonies.forEach(harmony => {
    harmony.colors.forEach(color => allColors.add(color.toUpperCase()));
  });

  return Array.from(allColors);
};
