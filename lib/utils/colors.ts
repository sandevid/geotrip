import type { FacilityCategory } from './filters';

/**
 * Color mapping for facility categories
 * Using vibrant colors for better visibility
 */
export const KATEGORI_COLORS: Record<FacilityCategory, string> = {
  Hotel: '#EF4444',        // Red-500
  Niaga: '#F59E0B',        // Amber-500
  Kesehatan: '#10B981',    // Emerald-500
  Pendidikan: '#3B82F6',   // Blue-500
  Peribadatan: '#8B5CF6',  // Violet-500
  Pemerintah: '#6366F1',   // Indigo-500
  ATM: '#EC4899',          // Pink-500
  SPBU: '#F97316',         // Orange-500
  Bengkel: '#84CC16',      // Lime-500
  Lapangan: '#06B6D4',     // Cyan-500
  Hiburan: '#A855F7',      // Purple-500
};

/**
 * Icon mapping for facility categories
 */
export const KATEGORI_ICONS: Record<FacilityCategory, string> = {
  Hotel: '🏨',
  Niaga: '🏪',
  Kesehatan: '🏥',
  Pendidikan: '🏫',
  Peribadatan: '🕌',
  Pemerintah: '🏛️',
  ATM: '🏧',
  SPBU: '⛽',
  Bengkel: '🔧',
  Lapangan: '⚽',
  Hiburan: '🎭',
};

/**
 * Get icon for a facility category
 * @param category Facility category
 * @returns Icon emoji string
 */
export function getCategoryIcon(category: string): string {
  return KATEGORI_ICONS[category as FacilityCategory] || '📍';
}

/**
 * Get color for a facility category
 * @param category Facility category
 * @returns Hex color string
 */
export function getCategoryColor(category: string): string {
  return KATEGORI_COLORS[category as FacilityCategory] || '#6B7280'; // Gray-500 as fallback
}

/**
 * Get all category colors as an array of objects
 * @returns Array of category-color pairs
 */
export function getCategoryColorList(): Array<{ category: FacilityCategory; color: string }> {
  return Object.entries(KATEGORI_COLORS).map(([category, color]) => ({
    category: category as FacilityCategory,
    color,
  }));
}

/**
 * Generate CSS custom properties for category colors
 * @returns CSS string with custom properties
 */
export function generateCategoryColorCSS(): string {
  return Object.entries(KATEGORI_COLORS)
    .map(([category, color]) => `--color-${category.toLowerCase()}: ${color};`)
    .join('\n');
}

/**
 * Wisata marker color (gold accent)
 */
export const WISATA_MARKER_COLOR = '#CBA35C'; // Gold accent (primary destination)

/**
 * Default marker color for unknown categories (navy)
 */
export const DEFAULT_MARKER_COLOR = '#64748B'; // Slate-500