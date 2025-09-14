import { GeoLocation } from '../types/news';

// Pre-generated location mappings for common corruption-related keywords and institutions
// This helps speed up the mapping process by providing immediate location matches
export const CORRUPTION_LOCATION_KEYWORDS: Record<string, GeoLocation> = {
  // Government institutions and their locations
  'malacañang': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'palace': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 90 },
  'senate': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'congress': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'house of representatives': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'supreme court': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'ombudsman': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'sandiganbayan': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'comelec': { latitude: 14.6019, longitude: 121.0355, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'doj': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'department of justice': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'bir': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'bureau of internal revenue': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'boc': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'bureau of customs': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'bsp': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'bangko sentral': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'dfa': { latitude: 14.5832, longitude: 121.0409, locationName: 'Pasay', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'department of foreign affairs': { latitude: 14.5832, longitude: 121.0409, locationName: 'Pasay', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'dilg': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'pnp': { latitude: 14.6488, longitude: 120.9668, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },
  'philippine national police': { latitude: 14.6488, longitude: 120.9668, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 95 },

  // Major cities and provinces commonly in corruption news
  'manila': { latitude: 14.5995, longitude: 120.9842, locationName: 'Manila', province: 'Metro Manila', region: 'NCR', confidence: 100 },
  'quezon city': { latitude: 14.6760, longitude: 121.0437, locationName: 'Quezon City', province: 'Metro Manila', region: 'NCR', confidence: 100 },
  'makati': { latitude: 14.5547, longitude: 121.0244, locationName: 'Makati', province: 'Metro Manila', region: 'NCR', confidence: 100 },
  'pasig': { latitude: 14.5764, longitude: 121.0851, locationName: 'Pasig', province: 'Metro Manila', region: 'NCR', confidence: 100 },
  'taguig': { latitude: 14.5176, longitude: 121.0509, locationName: 'Taguig', province: 'Metro Manila', region: 'NCR', confidence: 100 },
  'cebu': { latitude: 10.3157, longitude: 123.8854, locationName: 'Cebu City', province: 'Cebu', region: 'Central Visayas', confidence: 100 },
  'davao': { latitude: 7.0731, longitude: 125.6128, locationName: 'Davao City', province: 'Davao del Sur', region: 'Davao Region', confidence: 100 },
  'iloilo': { latitude: 10.7202, longitude: 122.5621, locationName: 'Iloilo City', province: 'Iloilo', region: 'Western Visayas', confidence: 100 },
  'bacolod': { latitude: 10.6770, longitude: 122.9501, locationName: 'Bacolod', province: 'Negros Occidental', region: 'Western Visayas', confidence: 100 },
  'cagayan de oro': { latitude: 8.4542, longitude: 124.6319, locationName: 'Cagayan de Oro', province: 'Misamis Oriental', region: 'Northern Mindanao', confidence: 100 },
  'zamboanga': { latitude: 6.9214, longitude: 122.0790, locationName: 'Zamboanga City', province: 'Zamboanga del Sur', region: 'Zamboanga Peninsula', confidence: 100 },
  'baguio': { latitude: 16.4023, longitude: 120.5960, locationName: 'Baguio', province: 'Benguet', region: 'Cordillera Administrative Region', confidence: 100 },
  'bataan': { latitude: 14.6417, longitude: 120.4664, locationName: 'Balanga', province: 'Bataan', region: 'Central Luzon', confidence: 95 },
  'bulacan': { latitude: 14.7942, longitude: 120.8794, locationName: 'Malolos', province: 'Bulacan', region: 'Central Luzon', confidence: 95 },
  'cavite': { latitude: 14.2456, longitude: 120.8781, locationName: 'Trece Martires', province: 'Cavite', region: 'CALABARZON', confidence: 95 },
  'laguna': { latitude: 14.2691, longitude: 121.4786, locationName: 'Santa Cruz', province: 'Laguna', region: 'CALABARZON', confidence: 95 },
  'pampanga': { latitude: 15.0794, longitude: 120.6200, locationName: 'San Fernando', province: 'Pampanga', region: 'Central Luzon', confidence: 95 },
  'nueva ecija': { latitude: 15.5784, longitude: 120.9842, locationName: 'Palayan', province: 'Nueva Ecija', region: 'Central Luzon', confidence: 95 },
  'pangasinan': { latitude: 15.8983, longitude: 120.2935, locationName: 'Lingayen', province: 'Pangasinan', region: 'Ilocos Region', confidence: 95 },
  'albay': { latitude: 13.1391, longitude: 123.7437, locationName: 'Legazpi', province: 'Albay', region: 'Bicol Region', confidence: 95 },
  'camarines sur': { latitude: 13.6218, longitude: 123.1945, locationName: 'Pili', province: 'Camarines Sur', region: 'Bicol Region', confidence: 95 },
  'leyte': { latitude: 11.2456, longitude: 124.8525, locationName: 'Tacloban', province: 'Leyte', region: 'Eastern Visayas', confidence: 95 },
  'bohol': { latitude: 9.8349, longitude: 124.1438, locationName: 'Tagbilaran', province: 'Bohol', region: 'Central Visayas', confidence: 95 },
  'negros occidental': { latitude: 10.6310, longitude: 122.9549, locationName: 'Bacolod', province: 'Negros Occidental', region: 'Western Visayas', confidence: 95 },
  'negros oriental': { latitude: 9.3068, longitude: 123.3054, locationName: 'Dumaguete', province: 'Negros Oriental', region: 'Central Visayas', confidence: 95 },
  'cotabato': { latitude: 7.2231, longitude: 124.2472, locationName: 'Kidapawan', province: 'Cotabato', region: 'SOCCSKSARGEN', confidence: 95 },
  'sultan kudarat': { latitude: 6.7000, longitude: 124.2500, locationName: 'Isulan', province: 'Sultan Kudarat', region: 'SOCCSKSARGEN', confidence: 95 },
  'lanao del sur': { latitude: 7.8333, longitude: 124.3333, locationName: 'Marawi', province: 'Lanao del Sur', region: 'BARMM', confidence: 95 },
  'sulu': { latitude: 6.0500, longitude: 121.0000, locationName: 'Jolo', province: 'Sulu', region: 'BARMM', confidence: 95 },
  'basilan': { latitude: 6.4364, longitude: 121.9739, locationName: 'Isabela', province: 'Basilan', region: 'BARMM', confidence: 95 },
};

// Quick location extraction using keyword matching
export function quickLocationExtraction(title: string, content: string): GeoLocation | null {
  const text = `${title} ${content}`.toLowerCase();
  
  // Check for direct keyword matches first (fastest)
  for (const [keyword, location] of Object.entries(CORRUPTION_LOCATION_KEYWORDS)) {
    if (text.includes(keyword.toLowerCase())) {
      console.log(`🚀 Quick match found: "${keyword}" -> ${location.locationName}`);
      return { ...location }; // Return a copy
    }
  }
  
  // Check for partial matches
  const words = text.split(/\s+/);
  for (const word of words) {
    for (const [keyword, location] of Object.entries(CORRUPTION_LOCATION_KEYWORDS)) {
      if (keyword.toLowerCase().includes(word) && word.length >= 4) {
        console.log(`🚀 Partial match found: "${word}" -> ${location.locationName}`);
        return { ...location, confidence: location.confidence! - 10 }; // Slightly lower confidence
      }
    }
  }
  
  return null;
}

// Enhanced location extraction with fallback AI processing
export async function enhancedLocationExtraction(
  title: string, 
  content: string
): Promise<GeoLocation | null> {
  // Try quick extraction first
  const quickResult = quickLocationExtraction(title, content);
  if (quickResult) {
    return quickResult;
  }
  
  // Fallback to AI extraction for complex cases
  try {
    const { extractLocationFromArticle } = await import('./geolocation');
    return await extractLocationFromArticle(title, content);
  } catch (error) {
    console.error('AI location extraction failed:', error);
    return null;
  }
}

// Batch process articles with smart prioritization
export async function batchProcessLocations(
  articles: Array<{ title: string; content: string; id: string }>
): Promise<Map<string, GeoLocation | null>> {
  const results = new Map<string, GeoLocation | null>();
  
  console.log(`🗺️ Starting batch location processing for ${articles.length} articles`);
  
  // Phase 1: Quick keyword matching (instant)
  let quickMatches = 0;
  for (const article of articles) {
    const quickResult = quickLocationExtraction(article.title, article.content);
    if (quickResult) {
      results.set(article.id, quickResult);
      quickMatches++;
    }
  }
  
  console.log(`✅ Quick matches: ${quickMatches}/${articles.length} (${Math.round(quickMatches/articles.length*100)}%)`);
  
  // Phase 2: AI processing for remaining articles (with limits)
  const remainingArticles = articles.filter(article => !results.has(article.id));
  const maxAIProcessing = Math.min(remainingArticles.length, 5); // Limit AI processing
  
  if (maxAIProcessing > 0) {
    console.log(`🤖 AI processing ${maxAIProcessing} articles...`);
    
    const { extractLocationFromArticle } = await import('./geolocation');
    
    for (let i = 0; i < maxAIProcessing; i++) {
      const article = remainingArticles[i];
      try {
        const aiResult = await extractLocationFromArticle(article.title, article.content);
        results.set(article.id, aiResult);
        
        // Small delay to avoid rate limiting
        if (i < maxAIProcessing - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`AI extraction failed for article ${article.id}:`, error);
        results.set(article.id, null);
      }
    }
  }
  
  // Phase 3: Mark remaining as null
  for (const article of remainingArticles.slice(maxAIProcessing)) {
    results.set(article.id, null);
  }
  
  const totalMapped = Array.from(results.values()).filter(loc => loc !== null).length;
  console.log(`🎯 Final mapping: ${totalMapped}/${articles.length} (${Math.round(totalMapped/articles.length*100)}%)`);
  
  return results;
}