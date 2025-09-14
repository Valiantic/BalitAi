export interface GeoLocation {
  latitude: number;
  longitude: number;
  locationName: string;
  province?: string;
  region?: string;
  confidence?: number; // 0-100, how confident we are about this location
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
  imageUrl?: string;
  geoLocation?: GeoLocation;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: 'success' | 'error';
  message?: string;
}

export interface ScanRequest {
  query?: string;
  sources?: string[];
  limit?: number;
}

export interface ScanResponse {
  articles: NewsArticle[];
  scanId: string;
  timestamp: string;
  query: string;
}

export interface RSSItem {
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
  geoLocation?: GeoLocation;
}

export interface NewsSource {
  name: string;
  domain: string;
  feeds: string[];
}

export interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
}

export interface CorruptionHeatmapProps {
  articles: NewsArticle[];
  onLocationClick?: (location: GeoLocation, articles: NewsArticle[]) => void;
}
