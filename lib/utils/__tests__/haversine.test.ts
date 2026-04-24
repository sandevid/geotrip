import { calculateDistance, formatDistance, isValidCoordinate } from '../haversine';

describe('Haversine Distance Calculation', () => {
  describe('calculateDistance', () => {
    test('should return 0 for same coordinates', () => {
      const distance = calculateDistance(-6.9175, 107.6191, -6.9175, 107.6191);
      expect(distance).toBe(0);
    });

    test('should calculate distance between known coordinate pairs with 0.5% accuracy', () => {
      // Test case 1: Semarang to Jakarta (approximately 429 km)
      const semarangLat = -6.9667;
      const semarangLon = 110.4167;
      const jakartaLat = -6.2088;
      const jakartaLon = 106.8456;
      
      const distance1 = calculateDistance(semarangLat, semarangLon, jakartaLat, jakartaLon);
      const expected1 = 429000; // 429 km in meters
      const tolerance1 = expected1 * 0.005; // 0.5% tolerance
      
      expect(distance1).toBeGreaterThan(expected1 - tolerance1);
      expect(distance1).toBeLessThan(expected1 + tolerance1);
    });

    test('should calculate distance between Umbul Sidomukti and Sam Poo Kong', () => {
      // Umbul Sidomukti coordinates
      const umbulLat = -7.2094;
      const umbulLon = 110.2083;
      
      // Sam Poo Kong coordinates  
      const samPooLat = -6.9667;
      const samPooLon = 110.4167;
      
      const distance = calculateDistance(umbulLat, umbulLon, samPooLat, samPooLon);
      const expected = 35000; // Approximately 35 km
      const tolerance = expected * 0.005; // 0.5% tolerance
      
      expect(distance).toBeGreaterThan(expected - tolerance);
      expect(distance).toBeLessThan(expected + tolerance);
    });

    test('should calculate short distances accurately', () => {
      // Test case: 1 km distance
      const lat1 = -6.9175;
      const lon1 = 107.6191;
      const lat2 = -6.9084; // Approximately 1 km north
      const lon2 = 107.6191;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      const expected = 1000; // 1 km in meters
      const tolerance = expected * 0.005; // 0.5% tolerance
      
      expect(distance).toBeGreaterThan(expected - tolerance);
      expect(distance).toBeLessThan(expected + tolerance);
    });

    test('should handle antipodal points correctly', () => {
      // Test antipodal points (opposite sides of Earth)
      const lat1 = 0;
      const lon1 = 0;
      const lat2 = 0;
      const lon2 = 180;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      
      // Should be approximately half Earth's circumference (20,015 km)
      expect(distance).toBeCloseTo(20015000, -3); // Within 1000m tolerance
    });

    test('should handle edge coordinates', () => {
      // North Pole to South Pole
      const distance1 = calculateDistance(90, 0, -90, 0);
      expect(distance1).toBeCloseTo(20015000, -3);
      
      // Equator crossing
      const distance2 = calculateDistance(0, -180, 0, 180);
      expect(distance2).toBeCloseTo(20015000, -3);
    });
  });

  describe('formatDistance', () => {
    test('should format meters correctly', () => {
      expect(formatDistance(500)).toBe('500m');
      expect(formatDistance(999)).toBe('999m');
    });

    test('should format kilometers correctly', () => {
      expect(formatDistance(1000)).toBe('1.0km');
      expect(formatDistance(1500)).toBe('1.5km');
      expect(formatDistance(2345)).toBe('2.3km');
    });

    test('should round meters to nearest integer', () => {
      expect(formatDistance(123.7)).toBe('124m');
      expect(formatDistance(456.2)).toBe('456m');
    });
  });

  describe('isValidCoordinate', () => {
    test('should validate correct coordinates', () => {
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate(-6.9175, 107.6191)).toBe(true);
      expect(isValidCoordinate(90, 180)).toBe(true);
      expect(isValidCoordinate(-90, -180)).toBe(true);
    });

    test('should reject invalid coordinates', () => {
      expect(isValidCoordinate(91, 0)).toBe(false); // Latitude > 90
      expect(isValidCoordinate(-91, 0)).toBe(false); // Latitude < -90
      expect(isValidCoordinate(0, 181)).toBe(false); // Longitude > 180
      expect(isValidCoordinate(0, -181)).toBe(false); // Longitude < -180
      expect(isValidCoordinate(NaN, 0)).toBe(false); // NaN latitude
      expect(isValidCoordinate(0, NaN)).toBe(false); // NaN longitude
    });

    test('should reject non-number inputs', () => {
      expect(isValidCoordinate('0' as any, 0)).toBe(false);
      expect(isValidCoordinate(0, '0' as any)).toBe(false);
      expect(isValidCoordinate(null as any, 0)).toBe(false);
      expect(isValidCoordinate(0, undefined as any)).toBe(false);
    });
  });
});