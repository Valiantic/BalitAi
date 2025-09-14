import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeoLocation } from '../types/news';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Philippine provinces and their approximate coordinates
const PHILIPPINE_LOCATIONS: Record<string, { lat: number; lng: number; region: string }> = {
  // NCR
  'manila': { lat: 14.5995, lng: 120.9842, region: 'NCR' },
  'quezon city': { lat: 14.6760, lng: 121.0437, region: 'NCR' },
  'makati': { lat: 14.5547, lng: 121.0244, region: 'NCR' },
  'pasig': { lat: 14.5764, lng: 121.0851, region: 'NCR' },
  'taguig': { lat: 14.5176, lng: 121.0509, region: 'NCR' },
  'parañaque': { lat: 14.4793, lng: 121.0198, region: 'NCR' },
  'las piñas': { lat: 14.4378, lng: 120.9942, region: 'NCR' },
  'muntinlupa': { lat: 14.3832, lng: 121.0409, region: 'NCR' },
  'pasay': { lat: 14.5378, lng: 120.9896, region: 'NCR' },
  'caloocan': { lat: 14.6488, lng: 120.9668, region: 'NCR' },
  'malabon': { lat: 14.6650, lng: 120.9564, region: 'NCR' },
  'navotas': { lat: 14.6691, lng: 120.9405, region: 'NCR' },
  'valenzuela': { lat: 14.7000, lng: 120.9833, region: 'NCR' },
  'marikina': { lat: 14.6507, lng: 121.1029, region: 'NCR' },
  'san juan': { lat: 14.6019, lng: 121.0355, region: 'NCR' },
  'mandaluyong': { lat: 14.5832, lng: 121.0409, region: 'NCR' },
  
  // Luzon provinces
  'bataan': { lat: 14.6417, lng: 120.4664, region: 'Central Luzon' },
  'batangas': { lat: 13.7565, lng: 121.0583, region: 'CALABARZON' },
  'bulacan': { lat: 14.7942, lng: 120.8794, region: 'Central Luzon' },
  'cavite': { lat: 14.2456, lng: 120.8781, region: 'CALABARZON' },
  'laguna': { lat: 14.2691, lng: 121.4786, region: 'CALABARZON' },
  'nueva ecija': { lat: 15.5784, lng: 120.9842, region: 'Central Luzon' },
  'pampanga': { lat: 15.0794, lng: 120.6200, region: 'Central Luzon' },
  'rizal': { lat: 14.6037, lng: 121.3084, region: 'CALABARZON' },
  'tarlac': { lat: 15.4817, lng: 120.5979, region: 'Central Luzon' },
  'zambales': { lat: 15.1373, lng: 119.9710, region: 'Central Luzon' },
  'aurora': { lat: 15.7594, lng: 121.5611, region: 'Central Luzon' },
  'pangasinan': { lat: 15.8983, lng: 120.2935, region: 'Ilocos Region' },
  'la union': { lat: 16.6159, lng: 120.3209, region: 'Ilocos Region' },
  'ilocos norte': { lat: 18.1967, lng: 120.5929, region: 'Ilocos Region' },
  'ilocos sur': { lat: 17.5650, lng: 120.3863, region: 'Ilocos Region' },
  'abra': { lat: 17.5947, lng: 120.7436, region: 'Cordillera Administrative Region' },
  'benguet': { lat: 16.4156, lng: 120.5964, region: 'Cordillera Administrative Region' },
  'ifugao': { lat: 16.9434, lng: 121.1267, region: 'Cordillera Administrative Region' },
  'kalinga': { lat: 17.3500, lng: 121.1000, region: 'Cordillera Administrative Region' },
  'mountain province': { lat: 17.1000, lng: 121.0000, region: 'Cordillera Administrative Region' },
  'apayao': { lat: 18.0127, lng: 121.0668, region: 'Cordillera Administrative Region' },
  
  // Visayas
  'cebu': { lat: 10.3157, lng: 123.8854, region: 'Central Visayas' },
  'bohol': { lat: 9.8349, lng: 124.1438, region: 'Central Visayas' },
  'negros occidental': { lat: 10.6310, lng: 122.9549, region: 'Western Visayas' },
  'negros oriental': { lat: 9.3068, lng: 123.3054, region: 'Central Visayas' },
  'iloilo': { lat: 10.7202, lng: 122.5621, region: 'Western Visayas' },
  'capiz': { lat: 11.3889, lng: 122.6277, region: 'Western Visayas' },
  'antique': { lat: 10.7117, lng: 121.9408, region: 'Western Visayas' },
  'aklan': { lat: 11.5564, lng: 122.0188, region: 'Western Visayas' },
  'guimaras': { lat: 10.5739, lng: 122.5792, region: 'Western Visayas' },
  'leyte': { lat: 11.2456, lng: 124.8525, region: 'Eastern Visayas' },
  'southern leyte': { lat: 10.3547, lng: 125.1268, region: 'Eastern Visayas' },
  'eastern samar': { lat: 11.6085, lng: 125.5136, region: 'Eastern Visayas' },
  'western samar': { lat: 12.0035, lng: 124.6037, region: 'Eastern Visayas' },
  'northern samar': { lat: 12.5486, lng: 124.6319, region: 'Eastern Visayas' },
  'biliran': { lat: 11.4654, lng: 124.4756, region: 'Eastern Visayas' },
  'siquijor': { lat: 9.2068, lng: 123.5086, region: 'Central Visayas' },
  
  // Mindanao
  'davao del sur': { lat: 6.7763, lng: 125.2281, region: 'Davao Region' },
  'davao del norte': { lat: 7.6139, lng: 125.6917, region: 'Davao Region' },
  'davao occidental': { lat: 6.4180, lng: 125.7781, region: 'Davao Region' },
  'davao oriental': { lat: 7.0077, lng: 126.3094, region: 'Davao Region' },
  'davao de oro': { lat: 7.6667, lng: 126.0833, region: 'Davao Region' },
  'cotabato': { lat: 7.2231, lng: 124.2472, region: 'SOCCSKSARGEN' },
  'south cotabato': { lat: 6.3619, lng: 124.8925, region: 'SOCCSKSARGEN' },
  'sultan kudarat': { lat: 6.7000, lng: 124.2500, region: 'SOCCSKSARGEN' },
  'sarangani': { lat: 5.9297, lng: 125.2068, region: 'SOCCSKSARGEN' },
  'agusan del norte': { lat: 8.9472, lng: 125.5361, region: 'Caraga' },
  'agusan del sur': { lat: 8.3500, lng: 126.0000, region: 'Caraga' },
  'surigao del norte': { lat: 9.7840, lng: 125.4811, region: 'Caraga' },
  'surigao del sur': { lat: 8.6167, lng: 126.3167, region: 'Caraga' },
  'dinagat islands': { lat: 10.1167, lng: 126.3500, region: 'Caraga' },
  'bukidnon': { lat: 8.1571, lng: 125.1297, region: 'Northern Mindanao' },
  'camiguin': { lat: 9.1739, lng: 124.7108, region: 'Northern Mindanao' },
  'lanao del norte': { lat: 8.2464, lng: 123.8479, region: 'Northern Mindanao' },
  'misamis occidental': { lat: 8.5167, lng: 123.7333, region: 'Northern Mindanao' },
  'misamis oriental': { lat: 8.9000, lng: 124.6167, region: 'Northern Mindanao' },
  'zamboanga del norte': { lat: 8.5500, lng: 123.2667, region: 'Zamboanga Peninsula' },
  'zamboanga del sur': { lat: 7.8403, lng: 123.2924, region: 'Zamboanga Peninsula' },
  'zamboanga sibugay': { lat: 7.7667, lng: 122.7833, region: 'Zamboanga Peninsula' },
  'basilan': { lat: 6.4364, lng: 121.9739, region: 'BARMM' },
  'sulu': { lat: 6.0500, lng: 121.0000, region: 'BARMM' },
  'tawi-tawi': { lat: 5.1333, lng: 119.9333, region: 'BARMM' },
  'maguindanao': { lat: 6.9000, lng: 124.2500, region: 'BARMM' },
  'lanao del sur': { lat: 7.8333, lng: 124.3333, region: 'BARMM' },
};

export async function extractLocationFromArticle(
  title: string, 
  content: string
): Promise<GeoLocation | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are a Philippine geography expert. Extract the PRIMARY location mentioned in this corruption news article.
      
      Title: ${title}
      Content: ${content}
      
      STRICT INSTRUCTIONS:
      1. Find the MAIN location where the corruption incident occurred
      2. Focus on cities, provinces, or specific areas in the Philippines
      3. Ignore generic terms like "Philippines", "country", "nation"
      4. Return ONLY ONE primary location, not multiple locations
      5. Use proper Philippine location names (e.g., "Quezon City" not "QC")
      6. IMPORTANT: Return ONLY valid JSON, no markdown code blocks or extra text
      
      Return a JSON response with this exact format:
      {
        "locationName": "Primary location name (city/province)",
        "province": "Province name if different from locationName",
        "region": "Region name",
        "confidence": 85
      }
      
      If no specific Philippine location is mentioned, return:
      {
        "locationName": null,
        "province": null,
        "region": null,
        "confidence": 0
      }
      
      RESPOND WITH ONLY THE JSON OBJECT, NO OTHER TEXT OR FORMATTING.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response text by removing markdown code blocks if present
      let cleanedText = text.trim();
      
      // Remove markdown code blocks (```json ... ``` or ``` ... ```)
      const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
      const match = cleanedText.match(codeBlockRegex);
      if (match) {
        cleanedText = match[1].trim();
      }
      
      // Also handle cases where there might be extra text before/after JSON
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      console.log('Cleaned location response:', cleanedText);
      
      const locationData = JSON.parse(cleanedText);
      
      if (!locationData.locationName || locationData.confidence < 30) {
        return null;
      }
      
      // Find coordinates for the location
      const coordinates = findPhilippineCoordinates(locationData.locationName);
      
      if (!coordinates) {
        console.log(`Location "${locationData.locationName}" not found in Philippine coordinates database`);
        return null;
      }
      
      return {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        locationName: locationData.locationName,
        province: locationData.province || locationData.locationName,
        region: locationData.region || coordinates.region,
        confidence: locationData.confidence
      };
      
    } catch (parseError) {
      console.error('Error parsing location JSON:', parseError);
      return null;
    }
    
  } catch (error) {
    console.error('Error extracting location with Gemini:', error);
    return null;
  }
}

function findPhilippineCoordinates(locationName: string): { lat: number; lng: number; region: string } | null {
  const normalizedLocation = locationName.toLowerCase().trim();
  
  // Direct match
  if (PHILIPPINE_LOCATIONS[normalizedLocation]) {
    return PHILIPPINE_LOCATIONS[normalizedLocation];
  }
  
  // Partial match - find if the location is contained in our database
  for (const [key, value] of Object.entries(PHILIPPINE_LOCATIONS)) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return value;
    }
  }
  
  // Special cases for common variations
  const locationMappings: Record<string, string> = {
    'qc': 'quezon city',
    'metro manila': 'manila',
    'ncr': 'manila',
    'baguio': 'benguet',
    'tagaytay': 'cavite',
    'antipolo': 'rizal',
    'san fernando': 'pampanga', // Default to Pampanga's San Fernando
    'angeles': 'pampanga',
    'olongapo': 'zambales',
    'bago': 'negros occidental',
    'bacolod': 'negros occidental',
    'iloilo city': 'iloilo',
    'cebu city': 'cebu',
    'davao city': 'davao del sur',
    'cagayan de oro': 'misamis oriental',
    'butuan': 'agusan del norte',
    'zamboanga city': 'zamboanga del sur',
    'general santos': 'south cotabato',
    'cotabato city': 'cotabato',
  };
  
  if (locationMappings[normalizedLocation]) {
    const mappedLocation = locationMappings[normalizedLocation];
    return PHILIPPINE_LOCATIONS[mappedLocation] || null;
  }
  
  return null;
}

// Utility function to calculate the weight for heatmap based on corruption severity
export function calculateCorruptionWeight(article: {
  title: string;
  content: string;
  summary?: string;
}): number {
  const text = `${article.title} ${article.content} ${article.summary || ''}`.toLowerCase();
  
  // High severity indicators
  const highSeverityKeywords = [
    'plunder', 'billion', 'scandal', 'mastermind', 'syndicate',
    'millions', 'graft charges', 'ombudsman', 'sandiganbayan'
  ];
  
  // Medium severity indicators
  const mediumSeverityKeywords = [
    'corruption', 'bribery', 'kickback', 'anomaly', 'irregularity',
    'investigation', 'charges', 'suspended', 'dismissed'
  ];
  
  // Low severity indicators
  const lowSeverityKeywords = [
    'complaint', 'allegation', 'inquiry', 'review', 'audit'
  ];
  
  let weight = 1; // Base weight
  
  // Check for high severity (weight: 3-5)
  for (const keyword of highSeverityKeywords) {
    if (text.includes(keyword)) {
      weight = Math.max(weight, 4);
    }
  }
  
  // Check for medium severity (weight: 2-3)
  for (const keyword of mediumSeverityKeywords) {
    if (text.includes(keyword)) {
      weight = Math.max(weight, 2.5);
    }
  }
  
  // Check for low severity (weight: 1-2)
  for (const keyword of lowSeverityKeywords) {
    if (text.includes(keyword)) {
      weight = Math.max(weight, 1.5);
    }
  }
  
  return weight;
}

// Get all articles for a specific location
export function getArticlesByLocation<T extends { geoLocation?: GeoLocation }>(
  articles: T[],
  targetLocation: GeoLocation,
  radiusKm: number = 50
): T[] {
  return articles.filter(article => {
    if (!article.geoLocation) return false;
    
    const distance = calculateDistance(
      article.geoLocation.latitude,
      article.geoLocation.longitude,
      targetLocation.latitude,
      targetLocation.longitude
    );
    
    return distance <= radiusKm;
  });
}

// Calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}