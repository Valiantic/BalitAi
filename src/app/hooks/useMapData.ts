'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useMapContext } from '../contexts/MapContext';
import { NewsArticle } from '../types/news';
import { CorruptionLocation, CorruptionArticleReference, Coordinates } from '../types/map';
import { LocationExtractionService } from '../services/locationExtractionService';
import { LocationCoordinatesService } from '../services/locationCoordinatesService';

/**
 * Hook for processing news articles and extracting corruption locations
 */
export const useCorruptionLocations = () => {
  const {
    corruptionLocations,
    addCorruptionLocation,
    updateCorruptionLocation,
    clearLocations,
    setLoading,
    setError,
  } = useMapContext();

  /**
   * Process articles and extract corruption locations
   */
  const processArticles = useCallback(async (articles: NewsArticle[]) => {
    setLoading(true);
    setError(null);

    try {
      const processedLocations: CorruptionLocation[] = [];

      for (const article of articles) {
        // Extract locations from article
        const locationResult = LocationExtractionService.extractLocations(
          article.title,
          article.content,
          article.summary
        );

        // Validate corruption relevance
        const relevanceScore = LocationExtractionService.validateCorruptionRelevance(
          article.title,
          article.content,
          article.summary
        );

        // Skip if not corruption-related enough
        if (relevanceScore < 0.3) {
          continue;
        }

        // Categorize corruption type
        const corruptionTypes = LocationExtractionService.categorizeCorruptionType(
          article.title,
          article.content,
          article.summary
        );

        // Determine severity
        const severity = LocationExtractionService.determineSeverity(
          article.title,
          article.content,
          article.summary
        );

        // Process each detected location
        for (const locationName of locationResult.locations) {
          const coordinates = LocationCoordinatesService.getCoordinates(locationName);
          const cityInfo = LocationCoordinatesService.getCityInfo(locationName);

          if (coordinates) {
            const articleRef: CorruptionArticleReference = {
              id: article.id,
              title: article.title,
              url: article.url,
              source: article.source,
              publishedAt: article.publishedAt,
              summary: article.summary,
              relevanceScore,
            };

            const locationId = `${cityInfo?.name || locationName}_${cityInfo?.province || 'unknown'}`.toLowerCase().replace(/\s+/g, '_');

            const corruptionLocation: CorruptionLocation = {
              id: locationId,
              title: `Corruption News in ${cityInfo?.name || locationName}`,
              city: cityInfo?.name || locationName,
              province: cityInfo?.province,
              coordinates,
              articles: [articleRef],
              corruptionType: corruptionTypes,
              severity,
              lastUpdated: new Date().toISOString(),
            };

            processedLocations.push(corruptionLocation);
          }
        }
      }

      // Add processed locations to context
      for (const location of processedLocations) {
        addCorruptionLocation(location);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process articles');
    } finally {
      setLoading(false);
    }
  }, [addCorruptionLocation, setLoading, setError]);

  /**
   * Get locations by severity
   */
  const getLocationsBySeverity = useCallback((severity: 'low' | 'medium' | 'high' | 'critical') => {
    return corruptionLocations.filter(location => location.severity === severity);
  }, [corruptionLocations]);

  /**
   * Get locations by corruption type
   */
  const getLocationsByType = useCallback((type: string) => {
    return corruptionLocations.filter(location => 
      location.corruptionType.some(t => t.toLowerCase().includes(type.toLowerCase()))
    );
  }, [corruptionLocations]);

  /**
   * Get recent locations (within last 30 days)
   */
  const getRecentLocations = useCallback(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return corruptionLocations.filter(location => {
      const lastUpdate = new Date(location.lastUpdated);
      return lastUpdate >= thirtyDaysAgo;
    });
  }, [corruptionLocations]);

  /**
   * Search locations by city or province
   */
  const searchLocations = useCallback((query: string) => {
    const normalizedQuery = query.toLowerCase();
    return corruptionLocations.filter(location =>
      location.city.toLowerCase().includes(normalizedQuery) ||
      (location.province && location.province.toLowerCase().includes(normalizedQuery)) ||
      location.title.toLowerCase().includes(normalizedQuery)
    );
  }, [corruptionLocations]);

  /**
   * Get statistics about corruption locations
   */
  const getLocationStats = useMemo(() => {
    const stats = {
      total: corruptionLocations.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
      byRegion: {} as Record<string, number>,
      totalArticles: 0,
    };

    corruptionLocations.forEach(location => {
      stats.bySeverity[location.severity]++;
      stats.totalArticles += location.articles.length;

      // Count by province (approximating region)
      const region = location.province || 'Unknown';
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
    });

    return stats;
  }, [corruptionLocations]);

  return {
    corruptionLocations,
    processArticles,
    getLocationsBySeverity,
    getLocationsByType,
    getRecentLocations,
    searchLocations,
    getLocationStats,
    clearLocations,
    updateCorruptionLocation,
  };
};

/**
 * Hook for managing map display and interactions
 */
export const useMapData = () => {
  const {
    mapState,
    selectedLocation,
    setMapCenter,
    setMapZoom,
    selectLocation,
  } = useMapContext();

  /**
   * Center map on Philippines
   */
  const centerOnPhilippines = useCallback(() => {
    setMapCenter({ lat: 12.8797, lng: 121.7740 });
    setMapZoom(6);
  }, [setMapCenter, setMapZoom]);

  /**
   * Center map on specific location
   */
  const centerOnLocation = useCallback((coordinates: Coordinates, zoom: number = 13) => {
    setMapCenter(coordinates);
    setMapZoom(zoom);
  }, [setMapCenter, setMapZoom]);

  /**
   * Fit map to show all corruption locations
   */
  const fitToLocations = useCallback((locations: CorruptionLocation[]) => {
    if (locations.length === 0) {
      centerOnPhilippines();
      return;
    }

    if (locations.length === 1) {
      centerOnLocation(locations[0].coordinates, 11);
      return;
    }

    // Calculate bounds for multiple locations
    const lats = locations.map(loc => loc.coordinates.lat);
    const lngs = locations.map(loc => loc.coordinates.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate appropriate zoom level based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 6;
    if (maxDiff < 0.5) zoom = 11;
    else if (maxDiff < 1) zoom = 10;
    else if (maxDiff < 2) zoom = 9;
    else if (maxDiff < 4) zoom = 8;
    else if (maxDiff < 8) zoom = 7;

    setMapCenter({ lat: centerLat, lng: centerLng });
    setMapZoom(zoom);
  }, [centerOnPhilippines, centerOnLocation, setMapCenter, setMapZoom]);

  /**
   * Handle location selection
   */
  const handleLocationSelect = useCallback((location: CorruptionLocation) => {
    selectLocation(location);
    centerOnLocation(location.coordinates, 13);
  }, [selectLocation, centerOnLocation]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    selectLocation(null);
  }, [selectLocation]);

  /**
   * Get map bounds for current view
   */
  const getCurrentBounds = useCallback(() => {
    // This would typically be implemented with the actual map instance
    // For now, return approximate bounds based on center and zoom
    const { center, zoom } = mapState;
    const latDelta = 10 / Math.pow(2, zoom - 6); // Rough approximation
    const lngDelta = 10 / Math.pow(2, zoom - 6);

    return {
      north: center.lat + latDelta,
      south: center.lat - latDelta,
      east: center.lng + lngDelta,
      west: center.lng - lngDelta,
    };
  }, [mapState]);

  /**
   * Check if coordinates are visible in current view
   */
  const isLocationVisible = useCallback((coordinates: Coordinates) => {
    const bounds = getCurrentBounds();
    return (
      coordinates.lat >= bounds.south &&
      coordinates.lat <= bounds.north &&
      coordinates.lng >= bounds.west &&
      coordinates.lng <= bounds.east
    );
  }, [getCurrentBounds]);

  return {
    mapState,
    selectedLocation,
    centerOnPhilippines,
    centerOnLocation,
    fitToLocations,
    handleLocationSelect,
    clearSelection,
    getCurrentBounds,
    isLocationVisible,
    setMapCenter,
    setMapZoom,
  };
};

/**
 * Hook for map performance optimizations
 */
export const useMapOptimizations = () => {
  const { corruptionLocations } = useMapContext();

  /**
   * Group nearby locations for clustering
   */
  const getClusteredLocations = useCallback((zoomLevel: number, minDistance: number = 0.05) => {
    if (zoomLevel >= 11) {
      // At high zoom levels, show all locations
      return corruptionLocations.map(loc => ({ ...loc, isCluster: false, count: 1 }));
    }

    const clusters: Array<CorruptionLocation & { isCluster: boolean; count: number }> = [];
    const processed = new Set<string>();

    for (const location of corruptionLocations) {
      if (processed.has(location.id)) continue;

      const nearby = corruptionLocations.filter(other => {
        if (processed.has(other.id) || other.id === location.id) return false;
        
        const distance = LocationCoordinatesService.calculateDistance(
          location.coordinates,
          other.coordinates
        );
        
        return distance < minDistance * (11 - zoomLevel); // Cluster more aggressively at lower zoom
      });

      if (nearby.length > 0) {
        // Create cluster
        const allInCluster = [location, ...nearby];
        const centerLat = allInCluster.reduce((sum, loc) => sum + loc.coordinates.lat, 0) / allInCluster.length;
        const centerLng = allInCluster.reduce((sum, loc) => sum + loc.coordinates.lng, 0) / allInCluster.length;
        
        const highestSeverity = allInCluster.reduce((max, loc) => {
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          return severityOrder[loc.severity] > severityOrder[max.severity] ? loc : max;
        }).severity;

        clusters.push({
          ...location,
          coordinates: { lat: centerLat, lng: centerLng },
          title: `${allInCluster.length} corruption cases`,
          severity: highestSeverity,
          isCluster: true,
          count: allInCluster.length,
          articles: allInCluster.flatMap(loc => loc.articles),
        });

        allInCluster.forEach(loc => processed.add(loc.id));
      } else {
        // Single location
        clusters.push({ ...location, isCluster: false, count: 1 });
        processed.add(location.id);
      }
    }

    return clusters;
  }, [corruptionLocations]);

  /**
   * Filter locations based on current viewport
   */
  const getVisibleLocations = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    return corruptionLocations.filter(location => {
      const { lat, lng } = location.coordinates;
      return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
    });
  }, [corruptionLocations]);

  return {
    getClusteredLocations,
    getVisibleLocations,
  };
};