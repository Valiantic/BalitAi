import { LocationExtractionResult } from '../types/map';

// Comprehensive list of major Philippine cities and provinces
const PHILIPPINE_LOCATIONS = [
  // National Capital Region (Metro Manila)
  'Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'San Juan',
  'Marikina', 'Caloocan', 'Malabon', 'Navotas', 'Valenzuela', 'Las Piñas', 'Muntinlupa',
  'Parañaque', 'Pasay', 'Pateros',
  
  // Major Cities Nationwide
  'Cebu City', 'Davao City', 'Zamboanga City', 'Cagayan de Oro', 'General Santos',
  'Butuan', 'Iligan', 'Cotabato City', 'Marawi', 'Tacloban', 'Ormoc', 'Bacolod',
  'Iloilo City', 'Kalibo', 'Roxas City', 'Puerto Princesa', 'Tagaytay', 'Antipolo',
  'Cabanatuan', 'Olongapo', 'Angeles City', 'San Fernando', 'Baguio', 'Dagupan',
  'Laoag', 'Vigan', 'Tuguegarao', 'Cauayan', 'Santiago', 'Baler', 'Batangas City',
  'Lipa', 'Lucena', 'Santa Rosa', 'Biñan', 'San Pablo', 'Naga City', 'Legazpi',
  'Sorsogon City', 'Masbate City', 'Catbalogan', 'Calbayog', 'Borongan',
  
  // Provinces
  'Luzon', 'Visayas', 'Mindanao', 'Abra', 'Agusan del Norte', 'Agusan del Sur',
  'Aklan', 'Albay', 'Antique', 'Apayao', 'Aurora', 'Basilan', 'Bataan', 'Batanes',
  'Batangas', 'Benguet', 'Bohol', 'Bukidnon', 'Bulacan', 'Cagayan', 'Camarines Norte',
  'Camarines Sur', 'Camiguin', 'Capiz', 'Catanduanes', 'Cavite', 'Cebu', 'Compostela Valley',
  'Cotabato', 'Davao del Norte', 'Davao del Sur', 'Davao Oriental', 'Dinagat Islands',
  'Eastern Samar', 'Guimaras', 'Ifugao', 'Ilocos Norte', 'Ilocos Sur', 'Iloilo',
  'Isabela', 'Kalinga', 'Laguna', 'Lanao del Norte', 'Lanao del Sur', 'La Union',
  'Leyte', 'Maguindanao', 'Marinduque', 'Masbate', 'Misamis Occidental', 'Misamis Oriental',
  'Mountain Province', 'Negros Occidental', 'Negros Oriental', 'Northern Samar',
  'Nueva Ecija', 'Nueva Vizcaya', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan',
  'Pampanga', 'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon', 'Samar',
  'Sarangani', 'Siquijor', 'Sorsogon', 'South Cotabato', 'Southern Leyte',
  'Sultan Kudarat', 'Sulu', 'Surigao del Norte', 'Surigao del Sur', 'Tarlac',
  'Tawi-Tawi', 'Zambales', 'Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'
];

// Common corruption-related keywords that might indicate location relevance
const CORRUPTION_KEYWORDS = [
  'corruption', 'graft', 'embezzlement', 'fraud', 'bribery', 'kickback',
  'anomaly', 'irregularity', 'malversation', 'plunder', 'scandal',
  'investigation', 'allegations', 'charges', 'filed', 'case',
  'mayor', 'governor', 'congressman', 'senator', 'official',
  'government', 'municipal', 'provincial', 'barangay', 'city hall',
  'provincial capitol', 'municipality', 'LGU', 'local government'
];

// Government institutions and offices that might indicate location
const GOVERNMENT_OFFICES = [
  'DOH', 'DepEd', 'DPWH', 'DOF', 'DBM', 'COA', 'Sandiganbayan',
  'Ombudsman', 'BIR', 'BOC', 'BSP', 'SEC', 'SSS', 'GSIS',
  'PAGCOR', 'PCSO', 'LTO', 'LTFRB', 'DENR', 'DOT', 'DTI'
];

export class LocationExtractionService {
  /**
   * Extract location information from news article content
   */
  static extractLocations(
    title: string, 
    content: string, 
    summary?: string
  ): LocationExtractionResult {
    const text = `${title} ${content} ${summary || ''}`.toLowerCase();
    const foundLocations: string[] = [];
    let totalConfidence = 0;
    let matches = 0;

    // Check for exact location matches
    for (const location of PHILIPPINE_LOCATIONS) {
      const locationLower = location.toLowerCase();
      
      // Look for exact matches with word boundaries
      const regex = new RegExp(`\\b${locationLower}\\b`, 'gi');
      const locationMatches = text.match(regex);
      
      if (locationMatches && locationMatches.length > 0) {
        foundLocations.push(location);
        
        // Higher confidence for title matches
        if (title.toLowerCase().includes(locationLower)) {
          totalConfidence += 0.9;
        } else if (summary && summary.toLowerCase().includes(locationLower)) {
          totalConfidence += 0.7;
        } else {
          totalConfidence += 0.5;
        }
        
        matches++;
      }
    }

    // Check for government office mentions that might indicate national relevance
    const hasGovernmentOffice = GOVERNMENT_OFFICES.some(office => 
      text.includes(office.toLowerCase())
    );

    // If no specific location found but has government office, default to Manila
    if (foundLocations.length === 0 && hasGovernmentOffice) {
      foundLocations.push('Manila');
      totalConfidence += 0.3;
      matches++;
    }

    // Calculate average confidence
    const confidence = matches > 0 ? Math.min(totalConfidence / matches, 1) : 0;

    return {
      locations: [...new Set(foundLocations)], // Remove duplicates
      confidence,
      method: 'keyword'
    };
  }

  /**
   * Extract and validate corruption-related content
   */
  static validateCorruptionRelevance(title: string, content: string, summary?: string): number {
    const text = `${title} ${content} ${summary || ''}`.toLowerCase();
    let score = 0;
    let maxScore = 0;

    for (const keyword of CORRUPTION_KEYWORDS) {
      maxScore += 1;
      
      if (text.includes(keyword)) {
        // Higher weight for title mentions
        if (title.toLowerCase().includes(keyword)) {
          score += 1;
        } else if (summary && summary.toLowerCase().includes(keyword)) {
          score += 0.8;
        } else {
          score += 0.5;
        }
      }
    }

    return Math.min(score / Math.max(maxScore * 0.3, 1), 1); // Normalize to 0-1
  }

  /**
   * Categorize corruption type based on content
   */
  static categorizeCorruptionType(title: string, content: string, summary?: string): string[] {
    const text = `${title} ${content} ${summary || ''}`.toLowerCase();
    const types: string[] = [];

    const corruptionTypes = {
      'Embezzlement': ['embezzlement', 'malversation', 'misappropriation'],
      'Bribery': ['bribery', 'bribe', 'payoff', 'kickback'],
      'Fraud': ['fraud', 'fake', 'falsification', 'dummy'],
      'Graft': ['graft', 'anomaly', 'irregularity'],
      'Plunder': ['plunder', 'large-scale'],
      'Electoral': ['electoral', 'election', 'voting', 'ballot'],
      'Procurement': ['procurement', 'bidding', 'contract', 'supply'],
      'Infrastructure': ['infrastructure', 'construction', 'road', 'building'],
      'Health': ['health', 'medical', 'hospital', 'medicine'],
      'Education': ['education', 'school', 'deped', 'student']
    };

    for (const [type, keywords] of Object.entries(corruptionTypes)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        types.push(type);
      }
    }

    return types.length > 0 ? types : ['General Corruption'];
  }

  /**
   * Determine severity based on content and keywords
   */
  static determineSeverity(
    title: string, 
    content: string, 
    summary?: string
  ): 'low' | 'medium' | 'high' | 'critical' {
    const text = `${title} ${content} ${summary || ''}`.toLowerCase();
    
    const severityKeywords = {
      critical: ['plunder', 'billions', 'senator', 'governor', 'major scandal'],
      high: ['millions', 'mayor', 'congressman', 'investigation filed', 'arrested'],
      medium: ['thousands', 'suspended', 'charges filed', 'allegations'],
      low: ['irregularity', 'minor', 'administrative']
    };

    for (const [level, keywords] of Object.entries(severityKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return level as 'low' | 'medium' | 'high' | 'critical';
      }
    }

    return 'medium'; // Default severity
  }

  /**
   * Check if location string contains a valid Philippine location
   */
  static isValidPhilippineLocation(location: string): boolean {
    return PHILIPPINE_LOCATIONS.some(validLocation => 
      location.toLowerCase().includes(validLocation.toLowerCase()) ||
      validLocation.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * Get similar or related locations for better matching
   */
  static getSimilarLocations(location: string): string[] {
    const similar: string[] = [];
    const locationLower = location.toLowerCase();

    // Find locations that contain the search term or vice versa
    for (const validLocation of PHILIPPINE_LOCATIONS) {
      const validLower = validLocation.toLowerCase();
      
      if (validLower.includes(locationLower) || locationLower.includes(validLower)) {
        similar.push(validLocation);
      }
    }

    return similar;
  }
}