/**
 * Calculate distance between two coordinates using Haversine formula
 * 
 * The Haversine formula determines the great-circle distance between two points 
 * on a sphere given their latitude and longitude coordinates.
 * 
 * @param lat1 Latitude of point 1 (decimal degrees)
 * @param lon1 Longitude of point 1 (decimal degrees)
 * @param lat2 Latitude of point 2 (decimal degrees)
 * @param lon2 Longitude of point 2 (decimal degrees)
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Handle edge case: same coordinates
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  // Earth's radius in meters
  const R = 6371000;

  // Convert degrees to radians
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in meters
  const distance = R * c;

  // Handle edge case: antipodal points (opposite sides of Earth)
  // Maximum distance on Earth is approximately 20,015 km
  if (distance > 20015000) {
    return 20015000;
  }

  return distance;
}

/**
 * Convert meters to kilometers with appropriate decimal places
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    const km = meters / 1000;
    return `${km.toFixed(1)}km`;
  }
}

/**
 * Validate coordinate values
 * @param lat Latitude (-90 to 90)
 * @param lon Longitude (-180 to 180)
 * @returns true if coordinates are valid
 */
export function isValidCoordinate(lat: number, lon: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}