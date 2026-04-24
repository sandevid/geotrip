import { calculateDistance } from './haversine';
import type { Tables } from '@/lib/types/database';

type Fasilitas = Tables<'fasilitas'>;

/**
 * Available radius options for filtering facilities
 */
export const RADIUS_OPTIONS = [
  { value: 250, label: '250m' },
  { value: 500, label: '500m' },
  { value: 750, label: '750m' },
  { value: 1000, label: '1km' },
  { value: 1500, label: '1.5km' },
  { value: 2000, label: '2km' },
  { value: 2500, label: '2.5km' },
  { value: 3000, label: '3km' },
  { value: null, label: 'Semua' },
] as const;

/**
 * Available facility categories
 */
export const FACILITY_CATEGORIES = [
  'Hotel',
  'Niaga',
  'Kesehatan',
  'Pendidikan',
  'Peribadatan',
  'Pemerintah',
  'ATM',
  'SPBU',
  'Bengkel',
  'Lapangan',
  'Hiburan',
] as const;

export type RadiusOption = typeof RADIUS_OPTIONS[number]['value'];
export type FacilityCategory = typeof FACILITY_CATEGORIES[number];

/**
 * Filter facilities by radius from a reference point
 * @param facilities Array of facilities to filter
 * @param refLat Reference latitude (wisata location)
 * @param refLon Reference longitude (wisata location)
 * @param radiusMeters Maximum distance in meters (null = no radius filter)
 * @returns Filtered facilities within radius
 */
export function filterByRadius(
  facilities: Fasilitas[],
  refLat: number,
  refLon: number,
  radiusMeters: number | null
): Fasilitas[] {
  // If no radius filter, return all facilities
  if (radiusMeters === null) {
    return facilities;
  }

  return facilities.filter((facility) => {
    const distance = calculateDistance(
      refLat,
      refLon,
      facility.latitude,
      facility.longitude
    );
    return distance <= radiusMeters;
  });
}

/**
 * Filter facilities by category
 * @param facilities Array of facilities to filter
 * @param selectedCategories Array of selected categories (empty = all categories)
 * @returns Filtered facilities matching selected categories
 */
export function filterByCategory(
  facilities: Fasilitas[],
  selectedCategories: string[]
): Fasilitas[] {
  // If no categories selected, return all facilities
  if (selectedCategories.length === 0) {
    return facilities;
  }

  return facilities.filter((facility) =>
    selectedCategories.includes(facility.kategori)
  );
}

/**
 * Combined filter: radius + category
 * @param facilities Array of facilities to filter
 * @param refLat Reference latitude (wisata location)
 * @param refLon Reference longitude (wisata location)
 * @param radiusMeters Maximum distance in meters (null = no radius filter)
 * @param selectedCategories Array of selected categories (empty = all categories)
 * @returns Filtered facilities matching both radius and category criteria
 */
export function filterFasilitas(
  facilities: Fasilitas[],
  refLat: number,
  refLon: number,
  radiusMeters: number | null,
  selectedCategories: string[]
): Fasilitas[] {
  // Apply category filter first (cheaper operation)
  let filtered = filterByCategory(facilities, selectedCategories);
  
  // Then apply radius filter (more expensive due to distance calculation)
  filtered = filterByRadius(filtered, refLat, refLon, radiusMeters);
  
  return filtered;
}

/**
 * Calculate distance for each facility from reference point and add to facility object
 * @param facilities Array of facilities
 * @param refLat Reference latitude
 * @param refLon Reference longitude
 * @returns Facilities with calculated distance property
 */
export function addDistanceToFacilities(
  facilities: Fasilitas[],
  refLat: number,
  refLon: number
): (Fasilitas & { distance: number })[] {
  return facilities.map((facility) => ({
    ...facility,
    distance: calculateDistance(
      refLat,
      refLon,
      facility.latitude,
      facility.longitude
    ),
  }));
}

/**
 * Sort facilities by distance from reference point
 * @param facilities Array of facilities with distance property
 * @param ascending Sort order (true = nearest first, false = farthest first)
 * @returns Sorted facilities
 */
export function sortByDistance<T extends { distance: number }>(
  facilities: T[],
  ascending: boolean = true
): T[] {
  return [...facilities].sort((a, b) => {
    return ascending ? a.distance - b.distance : b.distance - a.distance;
  });
}

/**
 * Get facility count for each radius option
 * @param facilities Array of facilities
 * @param refLat Reference latitude
 * @param refLon Reference longitude
 * @param selectedCategories Currently selected categories
 * @returns Object mapping radius values to facility counts
 */
export function getFacilityCountByRadius(
  facilities: Fasilitas[],
  refLat: number,
  refLon: number,
  selectedCategories: string[]
): Record<string, number> {
  // First apply category filter
  const categoryFiltered = filterByCategory(facilities, selectedCategories);
  
  const counts: Record<string, number> = {};
  
  RADIUS_OPTIONS.forEach(({ value, label }) => {
    const radiusFiltered = filterByRadius(
      categoryFiltered,
      refLat,
      refLon,
      value
    );
    counts[label] = radiusFiltered.length;
  });
  
  return counts;
}

/**
 * Get facility count for each category
 * @param facilities Array of facilities
 * @param refLat Reference latitude
 * @param refLon Reference longitude
 * @param radiusMeters Current radius filter
 * @returns Object mapping category names to facility counts
 */
export function getFacilityCountByCategory(
  facilities: Fasilitas[],
  refLat: number,
  refLon: number,
  radiusMeters: number | null
): Record<string, number> {
  // First apply radius filter
  const radiusFiltered = filterByRadius(facilities, refLat, refLon, radiusMeters);
  
  const counts: Record<string, number> = {};
  
  FACILITY_CATEGORIES.forEach((category) => {
    const categoryFiltered = radiusFiltered.filter(
      (facility) => facility.kategori === category
    );
    counts[category] = categoryFiltered.length;
  });
  
  return counts;
}