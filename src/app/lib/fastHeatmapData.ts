// ⚡ Speed-Boosted Heatmap: Precomputed Philippine Corruption Data
export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  weight: number;
  location: string;
  cases: number;
}

// Pre-aggregated corruption hotspots with normalized risk scores
export const PRECOMPUTED_HEATMAP_DATA: HeatmapPoint[] = [
  // Metro Manila - High Corruption Zone
  { lat: 14.5995, lng: 120.9842, intensity: 0.95, weight: 8, location: 'Manila City Hall', cases: 15 },
  { lat: 14.6760, lng: 121.0437, intensity: 0.90, weight: 7, location: 'Quezon City', cases: 12 },
  { lat: 14.5547, lng: 121.0244, intensity: 0.85, weight: 6, location: 'Makati CBD', cases: 9 },
  { lat: 14.5764, lng: 121.0851, intensity: 0.80, weight: 6, location: 'Pasig City', cases: 8 },
  { lat: 14.5794, lng: 121.0359, intensity: 0.75, weight: 5, location: 'Mandaluyong', cases: 7 },
  { lat: 14.6537, lng: 121.0685, intensity: 0.70, weight: 5, location: 'Marikina', cases: 6 },
  
  // Government Centers - Critical Zones
  { lat: 14.5929, lng: 120.9934, intensity: 1.0, weight: 10, location: 'Malacañang Palace', cases: 20 },
  { lat: 14.5515, lng: 121.0501, intensity: 0.95, weight: 9, location: 'Senate/Congress', cases: 18 },
  { lat: 14.5929, lng: 120.9794, intensity: 0.90, weight: 8, location: 'Supreme Court', cases: 14 },
  { lat: 14.5831, lng: 121.0564, intensity: 0.85, weight: 7, location: 'Sandiganbayan', cases: 11 },
  
  // Major Cities - Medium to High Risk
  { lat: 10.3157, lng: 123.8854, intensity: 0.80, weight: 6, location: 'Cebu City', cases: 10 },
  { lat: 7.1907, lng: 125.4553, intensity: 0.75, weight: 5, location: 'Davao City', cases: 8 },
  { lat: 6.9214, lng: 122.0790, intensity: 0.70, weight: 5, location: 'Zamboanga City', cases: 7 },
  { lat: 8.4542, lng: 124.6319, intensity: 0.65, weight: 4, location: 'Cagayan de Oro', cases: 6 },
  { lat: 10.7202, lng: 122.5621, intensity: 0.60, weight: 4, location: 'Iloilo City', cases: 5 },
  
  // Provincial Capitals - Medium Risk
  { lat: 15.1455, lng: 120.5930, intensity: 0.70, weight: 5, location: 'Angeles City', cases: 7 },
  { lat: 15.0349, lng: 120.6859, intensity: 0.55, weight: 3, location: 'San Fernando', cases: 4 },
  { lat: 16.4023, lng: 120.5960, intensity: 0.40, weight: 2, location: 'Baguio City', cases: 2 },
  { lat: 18.1967, lng: 120.5929, intensity: 0.50, weight: 3, location: 'Laoag City', cases: 3 },
  { lat: 17.6132, lng: 121.7270, intensity: 0.55, weight: 3, location: 'Tuguegarao', cases: 4 },
  
  // Visayas Region
  { lat: 11.2421, lng: 125.0066, intensity: 0.60, weight: 4, location: 'Tacloban City', cases: 5 },
  { lat: 10.6260, lng: 122.9090, intensity: 0.65, weight: 4, location: 'Bacolod City', cases: 6 },
  { lat: 9.3077, lng: 123.3016, intensity: 0.45, weight: 2, location: 'Dumaguete', cases: 2 },
  
  // Mindanao Region
  { lat: 6.1164, lng: 125.1716, intensity: 0.55, weight: 3, location: 'General Santos', cases: 4 },
  { lat: 8.9470, lng: 125.5456, intensity: 0.50, weight: 3, location: 'Butuan City', cases: 3 },
  { lat: 7.2334, lng: 124.2422, intensity: 0.75, weight: 5, location: 'Cotabato City', cases: 8 },
  
  // Key Infrastructure & Economic Zones
  { lat: 14.5086, lng: 121.0194, intensity: 0.70, weight: 5, location: 'Port Area Manila', cases: 7 },
  { lat: 15.1850, lng: 120.5600, intensity: 0.65, weight: 4, location: 'Clark Freeport', cases: 6 },
  { lat: 10.3010, lng: 123.9140, intensity: 0.60, weight: 4, location: 'Mactan Airport', cases: 5 },
  { lat: 14.5243, lng: 121.0792, intensity: 0.55, weight: 3, location: 'Ortigas Center', cases: 4 },
  
  // Border Areas & Remote Provinces (Lower intensity but still present)
  { lat: 9.7500, lng: 118.7384, intensity: 0.40, weight: 2, location: 'Puerto Princesa', cases: 2 },
  { lat: 13.4195, lng: 123.4114, intensity: 0.45, weight: 2, location: 'Naga City', cases: 3 },
  { lat: 12.5211, lng: 124.0089, intensity: 0.35, weight: 2, location: 'Catbalogan', cases: 2 },
];

// Grid-based aggregation for performance
export interface GridCell {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  totalCases: number;
  avgIntensity: number;
  points: HeatmapPoint[];
}

/**
 * Create grid-based aggregation for better performance
 */
export function createHeatmapGrid(gridSize: number = 0.5): GridCell[] {
  const grid: Map<string, GridCell> = new Map();
  
  PRECOMPUTED_HEATMAP_DATA.forEach(point => {
    // Round to grid
    const gridLat = Math.floor(point.lat / gridSize) * gridSize;
    const gridLng = Math.floor(point.lng / gridSize) * gridSize;
    const key = `${gridLat}_${gridLng}`;
    
    if (!grid.has(key)) {
      grid.set(key, {
        bounds: {
          north: gridLat + gridSize,
          south: gridLat,
          east: gridLng + gridSize,
          west: gridLng
        },
        totalCases: 0,
        avgIntensity: 0,
        points: []
      });
    }
    
    const cell = grid.get(key)!;
    cell.points.push(point);
    cell.totalCases += point.cases;
    cell.avgIntensity = cell.points.reduce((sum, p) => sum + p.intensity, 0) / cell.points.length;
  });
  
  return Array.from(grid.values());
}

/**
 * Filter points by map bounds for performance
 */
export function filterPointsByBounds(
  points: HeatmapPoint[], 
  bounds: { north: number, south: number, east: number, west: number }
): HeatmapPoint[] {
  return points.filter(point => 
    point.lat >= bounds.south && 
    point.lat <= bounds.north && 
    point.lng >= bounds.west && 
    point.lng <= bounds.east
  );
}

/**
 * Get high-priority points for initial render
 */
export function getHighPriorityPoints(): HeatmapPoint[] {
  return PRECOMPUTED_HEATMAP_DATA
    .filter(point => point.intensity >= 0.7)
    .sort((a, b) => b.intensity - a.intensity);
}

/**
 * Convert to Leaflet heatmap format
 */
export function toLeafletHeatmapData(points: HeatmapPoint[]): [number, number, number][] {
  return points.map(point => [point.lat, point.lng, point.intensity]);
}

/**
 * Create weighted points for clustering
 */
export function createWeightedClusters(points: HeatmapPoint[], threshold: number = 0.1): HeatmapPoint[] {
  const clusters: HeatmapPoint[] = [];
  const processed = new Set<number>();
  
  points.forEach((point, index) => {
    if (processed.has(index)) return;
    
    const cluster = { ...point };
    let totalWeight = point.weight;
    let totalCases = point.cases;
    let count = 1;
    
    // Find nearby points to cluster
    points.forEach((other, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) return;
      
      const distance = Math.sqrt(
        Math.pow(point.lat - other.lat, 2) + Math.pow(point.lng - other.lng, 2)
      );
      
      if (distance <= threshold) {
        totalWeight += other.weight;
        totalCases += other.cases;
        count++;
        processed.add(otherIndex);
      }
    });
    
    cluster.weight = totalWeight;
    cluster.cases = totalCases;
    cluster.intensity = Math.min(cluster.intensity * (count / 2), 1.0);
    
    clusters.push(cluster);
    processed.add(index);
  });
  
  return clusters;
}

// Export default fast dataset
export const FAST_HEATMAP_DATA = toLeafletHeatmapData(PRECOMPUTED_HEATMAP_DATA);
export const HIGH_PRIORITY_DATA = toLeafletHeatmapData(getHighPriorityPoints());
export const CLUSTERED_DATA = toLeafletHeatmapData(createWeightedClusters(PRECOMPUTED_HEATMAP_DATA));