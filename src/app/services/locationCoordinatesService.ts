import { Coordinates, PhilippineCity } from '../types/map';

// Comprehensive database of Philippine cities with coordinates
const PHILIPPINE_CITIES_DB: PhilippineCity[] = [
  // National Capital Region (Metro Manila)
  { name: 'Manila', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.5995, lng: 120.9842 }, isCapital: true, isMajorCity: true, population: 1780148 },
  { name: 'Quezon City', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.6760, lng: 121.0437 }, isCapital: false, isMajorCity: true, population: 2936116 },
  { name: 'Makati', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.5547, lng: 121.0244 }, isCapital: false, isMajorCity: true, population: 582602 },
  { name: 'Taguig', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.5176, lng: 121.0509 }, isCapital: false, isMajorCity: true, population: 886722 },
  { name: 'Pasig', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.5764, lng: 121.0851 }, isCapital: false, isMajorCity: true, population: 755300 },
  { name: 'Mandaluyong', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.5794, lng: 121.0359 }, isCapital: false, isMajorCity: true, population: 386276 },
  { name: 'San Juan', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.6019, lng: 121.0355 }, isCapital: false, isMajorCity: true, population: 122180 },
  { name: 'Marikina', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.6507, lng: 121.1029 }, isCapital: false, isMajorCity: true, population: 450741 },
  { name: 'Caloocan', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.6488, lng: 120.9647 }, isCapital: false, isMajorCity: true, population: 1661584 },
  { name: 'Valenzuela', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.6958, lng: 120.9831 }, isCapital: false, isMajorCity: true, population: 714978 },
  { name: 'Las Piñas', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.4378, lng: 120.9947 }, isCapital: false, isMajorCity: true, population: 606293 },
  { name: 'Muntinlupa', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.3832, lng: 121.0409 }, isCapital: false, isMajorCity: true, population: 543445 },
  { name: 'Parañaque', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.4793, lng: 121.0198 }, isCapital: false, isMajorCity: true, population: 689992 },
  { name: 'Pasay', province: 'Metro Manila', region: 'NCR', coordinates: { lat: 14.5378, lng: 120.9896 }, isCapital: false, isMajorCity: true, population: 440656 },

  // Major Cities - Luzon
  { name: 'Baguio', province: 'Benguet', region: 'CAR', coordinates: { lat: 16.4023, lng: 120.5960 }, isCapital: false, isMajorCity: true, population: 366358 },
  { name: 'Angeles City', province: 'Pampanga', region: 'Region III', coordinates: { lat: 15.1455, lng: 120.5934 }, isCapital: false, isMajorCity: true, population: 411634 },
  { name: 'San Fernando', province: 'Pampanga', region: 'Region III', coordinates: { lat: 15.0392, lng: 120.6869 }, isCapital: true, isMajorCity: true, population: 327325 },
  { name: 'Olongapo', province: 'Zambales', region: 'Region III', coordinates: { lat: 14.8294, lng: 120.2824 }, isCapital: false, isMajorCity: true, population: 260317 },
  { name: 'Cabanatuan', province: 'Nueva Ecija', region: 'Region III', coordinates: { lat: 15.4859, lng: 120.9644 }, isCapital: false, isMajorCity: true, population: 327325 },
  { name: 'Laoag', province: 'Ilocos Norte', region: 'Region I', coordinates: { lat: 18.1987, lng: 120.5920 }, isCapital: true, isMajorCity: true, population: 111651 },
  { name: 'Vigan', province: 'Ilocos Sur', region: 'Region I', coordinates: { lat: 17.5747, lng: 120.3869 }, isCapital: true, isMajorCity: true, population: 53935 },
  { name: 'Dagupan', province: 'Pangasinan', region: 'Region I', coordinates: { lat: 16.0433, lng: 120.3433 }, isCapital: false, isMajorCity: true, population: 171271 },
  { name: 'Tuguegarao', province: 'Cagayan', region: 'Region II', coordinates: { lat: 17.6132, lng: 121.7270 }, isCapital: true, isMajorCity: true, population: 166334 },
  { name: 'Santiago', province: 'Isabela', region: 'Region II', coordinates: { lat: 16.6877, lng: 121.5465 }, isCapital: false, isMajorCity: true, population: 134830 },
  { name: 'Antipolo', province: 'Rizal', region: 'Region IV-A', coordinates: { lat: 14.5843, lng: 121.1794 }, isCapital: true, isMajorCity: true, population: 887399 },
  { name: 'Batangas City', province: 'Batangas', region: 'Region IV-B', coordinates: { lat: 13.7565, lng: 121.0583 }, isCapital: true, isMajorCity: true, population: 351437 },
  { name: 'Lipa', province: 'Batangas', region: 'Region IV-B', coordinates: { lat: 13.9411, lng: 121.1649 }, isCapital: false, isMajorCity: true, population: 372931 },
  { name: 'Lucena', province: 'Quezon', region: 'Region IV-A', coordinates: { lat: 13.9373, lng: 121.6017 }, isCapital: true, isMajorCity: true, population: 278924 },
  { name: 'Santa Rosa', province: 'Laguna', region: 'Region IV-A', coordinates: { lat: 14.3123, lng: 121.1114 }, isCapital: false, isMajorCity: true, population: 414812 },
  { name: 'Naga City', province: 'Camarines Sur', region: 'Region V', coordinates: { lat: 13.6218, lng: 123.1948 }, isCapital: false, isMajorCity: true, population: 209170 },
  { name: 'Legazpi', province: 'Albay', region: 'Region V', coordinates: { lat: 13.1391, lng: 123.7436 }, isCapital: true, isMajorCity: true, population: 209170 },

  // Major Cities - Visayas
  { name: 'Cebu City', province: 'Cebu', region: 'Region VII', coordinates: { lat: 10.3157, lng: 123.8854 }, isCapital: true, isMajorCity: true, population: 964169 },
  { name: 'Iloilo City', province: 'Iloilo', region: 'Region VI', coordinates: { lat: 10.7202, lng: 122.5621 }, isCapital: true, isMajorCity: true, population: 457626 },
  { name: 'Bacolod', province: 'Negros Occidental', region: 'Region VI', coordinates: { lat: 10.6740, lng: 122.9500 }, isCapital: true, isMajorCity: true, population: 600783 },
  { name: 'Tacloban', province: 'Leyte', region: 'Region VIII', coordinates: { lat: 11.2421, lng: 125.0066 }, isCapital: true, isMajorCity: true, population: 251881 },
  { name: 'Ormoc', province: 'Leyte', region: 'Region VIII', coordinates: { lat: 11.0058, lng: 124.6074 }, isCapital: false, isMajorCity: true, population: 230998 },
  { name: 'Roxas City', province: 'Capiz', region: 'Region VI', coordinates: { lat: 11.5877, lng: 122.7519 }, isCapital: true, isMajorCity: true, population: 179292 },
  { name: 'Kalibo', province: 'Aklan', region: 'Region VI', coordinates: { lat: 11.7043, lng: 122.3679 }, isCapital: true, isMajorCity: true, population: 89127 },

  // Major Cities - Mindanao
  { name: 'Davao City', province: 'Davao del Sur', region: 'Region XI', coordinates: { lat: 7.1907, lng: 125.4553 }, isCapital: true, isMajorCity: true, population: 1776949 },
  { name: 'Zamboanga City', province: 'Zamboanga del Sur', region: 'Region IX', coordinates: { lat: 6.9214, lng: 122.0790 }, isCapital: false, isMajorCity: true, population: 977234 },
  { name: 'Cagayan de Oro', province: 'Misamis Oriental', region: 'Region X', coordinates: { lat: 8.4542, lng: 124.6319 }, isCapital: true, isMajorCity: true, population: 728402 },
  { name: 'General Santos', province: 'South Cotabato', region: 'Region XII', coordinates: { lat: 6.1164, lng: 125.1716 }, isCapital: false, isMajorCity: true, population: 697315 },
  { name: 'Butuan', province: 'Agusan del Norte', region: 'Region XIII', coordinates: { lat: 8.9470, lng: 125.5361 }, isCapital: true, isMajorCity: true, population: 372910 },
  { name: 'Iligan', province: 'Lanao del Norte', region: 'Region X', coordinates: { lat: 8.2280, lng: 124.2452 }, isCapital: false, isMajorCity: true, population: 363115 },
  { name: 'Cotabato City', province: 'Maguindanao', region: 'ARMM', coordinates: { lat: 7.2231, lng: 124.2452 }, isCapital: false, isMajorCity: true, population: 325079 },
  { name: 'Marawi', province: 'Lanao del Sur', region: 'ARMM', coordinates: { lat: 8.0038, lng: 124.2928 }, isCapital: true, isMajorCity: true, population: 201785 },

  // Island Provinces
  { name: 'Puerto Princesa', province: 'Palawan', region: 'Region IV-B', coordinates: { lat: 9.7392, lng: 118.7353 }, isCapital: true, isMajorCity: true, population: 307079 },
  { name: 'Tagaytay', province: 'Cavite', region: 'Region IV-A', coordinates: { lat: 14.1053, lng: 120.9621 }, isCapital: false, isMajorCity: true, population: 85330 },
];

export class LocationCoordinatesService {
  /**
   * Get coordinates for a given location name
   */
  static getCoordinates(locationName: string): Coordinates | null {
    const normalizedInput = locationName.toLowerCase().trim();
    
    // Try exact match first
    const exactMatch = PHILIPPINE_CITIES_DB.find(city => 
      city.name.toLowerCase() === normalizedInput ||
      city.province.toLowerCase() === normalizedInput
    );
    
    if (exactMatch) {
      return exactMatch.coordinates;
    }

    // Try partial match
    const partialMatch = PHILIPPINE_CITIES_DB.find(city =>
      city.name.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(city.name.toLowerCase()) ||
      city.province.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(city.province.toLowerCase())
    );

    if (partialMatch) {
      return partialMatch.coordinates;
    }

    // Handle special cases and aliases
    const aliases: Record<string, string> = {
      'metro manila': 'Manila',
      'ncr': 'Manila',
      'national capital region': 'Manila',
      'qc': 'Quezon City',
      'baguio city': 'Baguio',
      'tagaytay city': 'Tagaytay',
      'cebu': 'Cebu City',
      'davao': 'Davao City',
      'iloilo': 'Iloilo City',
      'cdo': 'Cagayan de Oro',
      'gensan': 'General Santos',
      'zamboanga': 'Zamboanga City'
    };

    const aliasMatch = aliases[normalizedInput];
    if (aliasMatch) {
      return this.getCoordinates(aliasMatch);
    }

    return null;
  }

  /**
   * Get city information including province and region
   */
  static getCityInfo(locationName: string): PhilippineCity | null {
    const normalizedInput = locationName.toLowerCase().trim();
    
    // Try exact match first
    const exactMatch = PHILIPPINE_CITIES_DB.find(city => 
      city.name.toLowerCase() === normalizedInput ||
      city.province.toLowerCase() === normalizedInput
    );
    
    if (exactMatch) {
      return exactMatch;
    }

    // Try partial match
    const partialMatch = PHILIPPINE_CITIES_DB.find(city =>
      city.name.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(city.name.toLowerCase()) ||
      city.province.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(city.province.toLowerCase())
    );

    return partialMatch || null;
  }

  /**
   * Get all major cities within a region
   */
  static getMajorCitiesInRegion(region: string): PhilippineCity[] {
    return PHILIPPINE_CITIES_DB.filter(city => 
      city.region.toLowerCase() === region.toLowerCase() && city.isMajorCity
    );
  }

  /**
   * Get cities within a certain radius of coordinates (in kilometers)
   */
  static getCitiesWithinRadius(
    center: Coordinates, 
    radiusKm: number
  ): PhilippineCity[] {
    return PHILIPPINE_CITIES_DB.filter(city => {
      const distance = this.calculateDistance(center, city.coordinates);
      return distance <= radiusKm;
    });
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * 
      Math.cos(this.toRadians(coord2.lat)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get all available cities (useful for autocomplete or suggestions)
   */
  static getAllCities(): PhilippineCity[] {
    return [...PHILIPPINE_CITIES_DB];
  }

  /**
   * Get major cities only
   */
  static getMajorCities(): PhilippineCity[] {
    return PHILIPPINE_CITIES_DB.filter(city => city.isMajorCity);
  }

  /**
   * Search cities by name with fuzzy matching
   */
  static searchCities(query: string, limit: number = 10): PhilippineCity[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return this.getMajorCities().slice(0, limit);
    }

    const results: Array<{ city: PhilippineCity; score: number }> = [];

    for (const city of PHILIPPINE_CITIES_DB) {
      let score = 0;
      const cityName = city.name.toLowerCase();
      const provinceName = city.province.toLowerCase();

      // Exact matches get highest score
      if (cityName === normalizedQuery || provinceName === normalizedQuery) {
        score = 100;
      }
      // Starts with query
      else if (cityName.startsWith(normalizedQuery) || provinceName.startsWith(normalizedQuery)) {
        score = 80;
      }
      // Contains query
      else if (cityName.includes(normalizedQuery) || provinceName.includes(normalizedQuery)) {
        score = 60;
      }

      // Boost score for major cities
      if (city.isMajorCity) {
        score += 10;
      }

      // Boost score for capitals
      if (city.isCapital) {
        score += 5;
      }

      if (score > 0) {
        results.push({ city, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(result => result.city);
  }

  /**
   * Validate if coordinates are within Philippines bounds
   */
  static isWithinPhilippinesBounds(coordinates: Coordinates): boolean {
    const { lat, lng } = coordinates;
    
    // Philippines bounds (approximate)
    const bounds = {
      north: 21.120611,
      south: 4.646923,
      east: 126.603249,
      west: 116.931366
    };

    return lat >= bounds.south && 
           lat <= bounds.north && 
           lng >= bounds.west && 
           lng <= bounds.east;
  }

  /**
   * Get the best matching city for vague location references
   */
  static getBestMatch(locationName: string): PhilippineCity | null {
    const results = this.searchCities(locationName, 1);
    return results.length > 0 ? results[0] : null;
  }
}