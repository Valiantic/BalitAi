// Fast corruption hotspot detection - no AI mapping needed!
import { NewsArticle, GeoLocation } from '../types/news';

// Predefined corruption hotspots in the Philippines with exact coordinates
export const CORRUPTION_HOTSPOTS = [
  // Metro Manila
  { name: 'Manila', lat: 14.5995, lng: 120.9842, region: 'NCR', severity: 'high' },
  { name: 'Quezon City', lat: 14.6760, lng: 121.0437, region: 'NCR', severity: 'high' },
  { name: 'Makati', lat: 14.5547, lng: 121.0244, region: 'NCR', severity: 'high' },
  { name: 'Pasig', lat: 14.5764, lng: 121.0851, region: 'NCR', severity: 'medium' },
  { name: 'Mandaluyong', lat: 14.5794, lng: 121.0359, region: 'NCR', severity: 'medium' },
  
  // Major Cities
  { name: 'Cebu City', lat: 10.3157, lng: 123.8854, region: 'Central Visayas', severity: 'high' },
  { name: 'Davao City', lat: 7.1907, lng: 125.4553, region: 'Davao', severity: 'high' },
  { name: 'Zamboanga City', lat: 6.9214, lng: 122.0790, region: 'Zamboanga Peninsula', severity: 'medium' },
  { name: 'Cagayan de Oro', lat: 8.4542, lng: 124.6319, region: 'Northern Mindanao', severity: 'medium' },
  { name: 'Iloilo City', lat: 10.7202, lng: 122.5621, region: 'Western Visayas', severity: 'medium' },
  
  // Provincial Capitals
  { name: 'Angeles City', lat: 15.1455, lng: 120.5930, region: 'Central Luzon', severity: 'high' },
  { name: 'San Fernando', lat: 15.0349, lng: 120.6859, region: 'Central Luzon', severity: 'medium' },
  { name: 'Baguio City', lat: 16.4023, lng: 120.5960, region: 'CAR', severity: 'low' },
  { name: 'Laoag City', lat: 18.1967, lng: 120.5929, region: 'Ilocos', severity: 'medium' },
  { name: 'Tuguegarao', lat: 17.6132, lng: 121.7270, region: 'Cagayan Valley', severity: 'medium' },
  
  // Visayas
  { name: 'Tacloban City', lat: 11.2421, lng: 125.0066, region: 'Eastern Visayas', severity: 'medium' },
  { name: 'Bacolod City', lat: 10.6260, lng: 122.9090, region: 'Western Visayas', severity: 'medium' },
  { name: 'Dumaguete', lat: 9.3077, lng: 123.3016, region: 'Central Visayas', severity: 'low' },
  
  // Mindanao
  { name: 'General Santos', lat: 6.1164, lng: 125.1716, region: 'SOCCSKSARGEN', severity: 'medium' },
  { name: 'Butuan City', lat: 8.9470, lng: 125.5456, region: 'Caraga', severity: 'medium' },
  { name: 'Cotabato City', lat: 7.2334, lng: 124.2422, region: 'BARMM', severity: 'high' },
  
  // Key Government Centers
  { name: 'Malacañang Palace', lat: 14.5929, lng: 120.9934, region: 'NCR', severity: 'high' },
  { name: 'Senate of the Philippines', lat: 14.5515, lng: 121.0501, region: 'NCR', severity: 'high' },
  { name: 'House of Representatives', lat: 14.5515, lng: 121.0501, region: 'NCR', severity: 'high' },
  { name: 'Supreme Court', lat: 14.5929, lng: 120.9794, region: 'NCR', severity: 'high' },
  { name: 'Sandiganbayan', lat: 14.5515, lng: 121.0501, region: 'NCR', severity: 'high' },
];

// Keywords that indicate corruption in different locations
const LOCATION_KEYWORDS = {
  'Manila': ['manila', 'city hall', 'city government', 'mayor manila'],
  'Quezon City': ['quezon city', 'qc', 'diliman'],
  'Makati': ['makati', 'ayala', 'cbd'],
  'Cebu City': ['cebu city', 'cebu', 'visayas'],
  'Davao City': ['davao', 'mindanao', 'duterte'],
  'Angeles City': ['angeles', 'pampanga', 'clark'],
  'Malacañang Palace': ['malacañang', 'palace', 'president', 'executive'],
  'Senate of the Philippines': ['senate', 'senator', 'upper chamber'],
  'House of Representatives': ['congress', 'congressman', 'representative', 'lower house'],
  'Supreme Court': ['supreme court', 'justice', 'judicial'],
  'Sandiganbayan': ['sandiganbayan', 'anti-graft', 'corruption court'],
};

// Government institutions that indicate specific hotspots
const INSTITUTION_HOTSPOTS = {
  'DOH': { name: 'Department of Health', lat: 14.5995, lng: 120.9842 },
  'DepEd': { name: 'Department of Education', lat: 14.5995, lng: 120.9842 },
  'DPWH': { name: 'Department of Public Works', lat: 14.5995, lng: 120.9842 },
  'DOF': { name: 'Department of Finance', lat: 14.5515, lng: 121.0501 },
  'BSP': { name: 'Bangko Sentral ng Pilipinas', lat: 14.5515, lng: 121.0501 },
  'BIR': { name: 'Bureau of Internal Revenue', lat: 14.5995, lng: 120.9842 },
  'BOC': { name: 'Bureau of Customs', lat: 14.5929, lng: 120.9794 },
  'COA': { name: 'Commission on Audit', lat: 14.5515, lng: 121.0501 },
  'Ombudsman': { name: 'Office of the Ombudsman', lat: 14.5515, lng: 121.0501 },
};

export interface CorruptionHotspot {
  location: GeoLocation;
  articles: NewsArticle[];
  severity: 'low' | 'medium' | 'high';
  corruptionScore: number;
}

/**
 * FAST corruption detection - instantly maps articles to predefined hotspots
 * No AI processing needed!
 */
export function detectCorruptionHotspots(articles: NewsArticle[]): CorruptionHotspot[] {
  const hotspotMap = new Map<string, CorruptionHotspot>();
  
  // Process each article for instant location detection
  articles.forEach(article => {
    const locations = findMatchingLocations(article);
    
    locations.forEach(location => {
      const key = `${location.lat}_${location.lng}`;
      
      if (!hotspotMap.has(key)) {
        hotspotMap.set(key, {
          location: {
            latitude: location.lat,
            longitude: location.lng,
            locationName: location.name,
            confidence: 95
          },
          articles: [],
          severity: location.severity as 'low' | 'medium' | 'high',
          corruptionScore: 0
        });
      }
      
      const hotspot = hotspotMap.get(key)!;
      hotspot.articles.push(article);
      
      // Calculate corruption score based on article content
      const articleScore = calculateArticleCorruptionScore(article);
      hotspot.corruptionScore += articleScore;
      
      // Update severity based on accumulated score
      if (hotspot.corruptionScore > 20) hotspot.severity = 'high';
      else if (hotspot.corruptionScore > 10) hotspot.severity = 'medium';
      else hotspot.severity = 'low';
    });
  });
  
  return Array.from(hotspotMap.values())
    .filter(hotspot => hotspot.articles.length > 0)
    .sort((a, b) => b.corruptionScore - a.corruptionScore);
}

/**
 * Find matching locations for an article using keyword detection
 */
function findMatchingLocations(article: NewsArticle) {
  const content = `${article.title} ${article.content || ''}`.toLowerCase();
  const matchedLocations = [];
  
  // Check for location keywords
  for (const [locationName, keywords] of Object.entries(LOCATION_KEYWORDS)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      const location = CORRUPTION_HOTSPOTS.find(h => h.name === locationName);
      if (location) {
        matchedLocations.push(location);
      }
    }
  }
  
  // Check for institution keywords
  for (const [institution, details] of Object.entries(INSTITUTION_HOTSPOTS)) {
    if (content.includes(institution.toLowerCase()) || 
        content.includes(details.name.toLowerCase())) {
      matchedLocations.push({
        name: details.name,
        lat: details.lat,
        lng: details.lng,
        region: 'NCR',
        severity: 'high'
      });
    }
  }
  
  // If no specific location found, default to Manila (most corruption cases)
  if (matchedLocations.length === 0) {
    const manila = CORRUPTION_HOTSPOTS.find(h => h.name === 'Manila');
    if (manila) {
      matchedLocations.push(manila);
    }
  }
  
  return matchedLocations;
}

/**
 * Calculate corruption severity score for an article
 */
function calculateArticleCorruptionScore(article: NewsArticle): number {
  const content = `${article.title} ${article.content || ''}`.toLowerCase();
  let score = 1; // Base score
  
  // High-impact keywords
  const highImpactKeywords = [
    'billion', 'million', 'plunder', 'malversation', 'graft',
    'embezzlement', 'kickback', 'bribery', 'fraud', 'scam'
  ];
  
  // Medium-impact keywords
  const mediumImpactKeywords = [
    'corruption', 'investigate', 'charges', 'accused', 'scandal',
    'irregularities', 'anomalies', 'ghost', 'overpricing'
  ];
  
  // Count keyword matches
  highImpactKeywords.forEach(keyword => {
    if (content.includes(keyword)) score += 3;
  });
  
  mediumImpactKeywords.forEach(keyword => {
    if (content.includes(keyword)) score += 1;
  });
  
  // Boost score for government officials
  if (content.includes('mayor') || content.includes('governor') || 
      content.includes('senator') || content.includes('congressman')) {
    score += 2;
  }
  
  return Math.min(score, 10); // Cap at 10
}

/**
 * Get all corruption hotspots for map display
 */
export function getAllHotspots(): Array<{name: string, lat: number, lng: number, severity: string}> {
  return CORRUPTION_HOTSPOTS;
}

/**
 * Create heatmap data from hotspots (for leaflet.heat)
 */
export function createHeatmapData(hotspots: CorruptionHotspot[]): [number, number, number][] {
  return hotspots.map(hotspot => [
    hotspot.location.latitude,
    hotspot.location.longitude,
    Math.min(hotspot.corruptionScore / 2, 5) // Normalize for heatmap
  ]);
}