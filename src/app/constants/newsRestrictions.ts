// Core corruption-related keywords (must contain at least one)
export const CORE_CORRUPTION_KEYWORDS = [
  'corruption', 'graft', 'plunder', 'bribery', 'kickback', 'malversation',
  'embezzlement', 'fraud', 'scam', 'anomalous', 'irregularities',
  'misappropriation', 'diversion of funds', 'ghost employees', 'ghost projects',
  'overpricing', 'overpriced', 'bidding irregularities', 'procurement violation',
  'misuse of funds', 'ill-gotten', 'unexplained wealth', 'undeclared assets',
  'money laundering', 'tax evasion', 'customs corruption', 'smuggling',
  'abuse of power', 'nepotism', 'patronage', 'electoral fraud', 'vote buying', 'projects',
  'probe', 'investigation', 'charges', 'case', 'allegation', 'scandal', 'complaint', 'violation',
  'flood control', 'ghost projects', 'rally'
];

// Government/judicial corruption institutions (high relevance when present)
export const CORRUPTION_INSTITUTIONS = [
  'Sandiganbayan', 'Ombudsman', 'COA', 'Commission on Audit',
  'SALN', 'pork barrel', 'DAP', 'PDAF', 'Blue Ribbon Committee',
  'shell companies', 'dummy corporations', 'fake receipts', 'ghost deliveries',
  'flood control', 'ghost projects', 'DPWH', 'Department of Public Works and Highways',
  'DILG', 'Department of the Interior and Local Government',
  'DOJ', 'Department of Justice', 'NBI', 'National Bureau of Investigation',
  'FBI', 'Federal Bureau of Investigation', 'CIA', 'Central Intelligence Agency',
  'Senator', 'Congress', 'House of Representatives', 'Supreme Court',
];

// Keywords that indicate NON-corruption news (immediate exclusion)
export const NON_CORRUPTION_KEYWORDS = [
  'weather', 'typhoon', 'storm', 'rain', 'earthquake', 'tsunami', 'volcanic',
  'sports', 'basketball', 'football', 'volleyball', 'olympics', 'games', 'tournament',
  'entertainment', 'celebrity', 'movie', 'film', 'music', 'concert', 'show', 'artist',
  'health', 'vaccine', 'medicine', 'doctor', 'covid', 'virus', 'disease',
  'smartphone', 'computer', 'internet', 'app', 'software','travel', 'tourism', 'hotel', 
  'restaurant', 'food', 'recipe', 'cooking', 'graduation', 'accident', 'fire', 'rescue', 
  'emergency', 'disaster relief', 'collision', 'crash', 'anniversary', 'celebration', 
  'festival', 'holiday', 'birthday', 'wedding', 'business launch', 'product launch', 
  'opening ceremony', 'grand opening', 'traffic', 'road construction', 'infrastructure project', 
  'bridge opening', 'cultural', 'heritage', 'museum', 'art', 'fashion', 'beauty'
];