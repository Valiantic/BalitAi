export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CorruptionLocation {
  id: string;
  title: string;
  city: string;
  province?: string;
  coordinates: Coordinates;
  articles: CorruptionArticleReference[];
  corruptionType: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
}

export interface CorruptionArticleReference {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
  relevanceScore: number; // 0-1 scale
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PhilippineCity {
  name: string;
  province: string;
  region: string;
  coordinates: Coordinates;
  isCapital: boolean;
  isMajorCity: boolean;
  population?: number;
}

export interface MapState {
  center: Coordinates;
  zoom: number;
  bounds?: MapBounds;
  selectedLocation?: CorruptionLocation;
  isLoading: boolean;
  error?: string;
}

export interface LocationExtractionResult {
  locations: string[];
  confidence: number;
  method: 'keyword' | 'nlp' | 'exact_match';
}

export interface MapContextType {
  mapState: MapState;
  corruptionLocations: CorruptionLocation[];
  selectedLocation: CorruptionLocation | null;
  setMapCenter: (coordinates: Coordinates) => void;
  setMapZoom: (zoom: number) => void;
  selectLocation: (location: CorruptionLocation | null) => void;
  addCorruptionLocation: (location: CorruptionLocation) => void;
  updateCorruptionLocation: (id: string, updates: Partial<CorruptionLocation>) => void;
  clearLocations: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Constants for Philippines map bounds
export const PHILIPPINES_BOUNDS: MapBounds = {
  north: 21.120611,
  south: 4.646923,
  east: 126.603249,
  west: 116.931366,
};

export const PHILIPPINES_CENTER: Coordinates = {
  lat: 12.8797,
  lng: 121.7740,
};

export const DEFAULT_MAP_ZOOM = 6;
export const CITY_MAP_ZOOM = 11;
export const LOCATION_MAP_ZOOM = 13;