'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CorruptionHeatmapProps, NewsArticle, GeoLocation } from '../types/news';
import { 
  filterPointsByBounds,
  HeatmapPoint
} from '../lib/fastHeatmapData';
import { quickLocationExtraction, enhancedLocationExtraction, CORRUPTION_LOCATION_KEYWORDS } from '../lib/fastLocationMapping';

// ⚡ Ultra-Fast Corruption Heatmap Component
const CorruptionHeatmap: React.FC<CorruptionHeatmapProps> = ({ 
  articles, 
  onLocationClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [heatLayer, setHeatLayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null);
  const [locationArticles, setLocationArticles] = useState<NewsArticle[]>([]);
  const [currentBounds, setCurrentBounds] = useState<any>(null);
  const [visiblePoints, setVisiblePoints] = useState<HeatmapPoint[]>([]);
  const [articleHeatmapPoints, setArticleHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [renderMode, setRenderMode] = useState<'fast' | 'detailed' | 'clustered'>('fast');
  const [processingStatus, setProcessingStatus] = useState<string>('Ready');
  const [mapInitialized, setMapInitialized] = useState(false);
  const markersRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // ⚡ Process articles to extract corruption locations
  const processArticleLocations = useCallback(async () => {
    console.log(`🔍 Processing articles - count: ${articles?.length || 0}`);
    
    if (!articles || articles.length === 0) {
      console.log('📊 No articles provided, setting up sample data for demonstration');
      setArticleHeatmapPoints([]);
      setVisiblePoints([]);
      setProcessingStatus('No articles - showing sample data');
      return;
    }

    setProcessingStatus('Processing corruption locations...');
    console.log(`🔍 Processing ${articles.length} corruption articles for locations`);

    const heatmapPoints: HeatmapPoint[] = [];
    const locationCount = new Map<string, number>();

    // Process each article to extract locations
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      setProcessingStatus(`Processing article ${i + 1}/${articles.length}...`);

      try {
        // Extract location using fast keyword matching
        const location = quickLocationExtraction(
          article.title, 
          article.content || article.summary || ''
        );

        console.log(`📰 Article ${i + 1}: "${article.title}"`);
        console.log(`🔍 Location extraction result:`, location);

        if (location) {
          const locationKey = `${location.latitude},${location.longitude}`;
          const currentCount = locationCount.get(locationKey) || 0;
          locationCount.set(locationKey, currentCount + 1);

          console.log(`📍 Found corruption location: ${location.locationName}, ${location.province} (${location.latitude}, ${location.longitude})`);
        } else {
          console.log(`❌ No location found for article: "${article.title}"`);
        }
      } catch (error) {
        console.error(`Error processing article ${i}:`, error);
      }
    }

    console.log(`🗺️ Total unique locations found: ${locationCount.size}`);

    // Convert location counts to heatmap points
    locationCount.forEach((count, locationKey) => {
      const [lat, lng] = locationKey.split(',').map(Number);
      
      // Find the location data to get the name
      const locationData = Object.values(CORRUPTION_LOCATION_KEYWORDS).find(
        loc => Math.abs(loc.latitude - lat) < 0.001 && Math.abs(loc.longitude - lng) < 0.001
      );

      if (locationData) {
        const point = {
          lat,
          lng,
          intensity: Math.min(count / 3, 1.0), // Normalize intensity based on article count
          weight: Math.min(count, 10), // Weight based on number of articles
          location: locationData.locationName,
          cases: count
        };
        heatmapPoints.push(point);
        console.log(`➕ Added heatmap point:`, point);
      }
    });

    console.log(`✅ Generated ${heatmapPoints.length} corruption heatmap points from articles`);
    setArticleHeatmapPoints(heatmapPoints);
    
    // Set visible points immediately since we don't have bounds yet
    setVisiblePoints(heatmapPoints);
    
    console.log(`📊 Setting ${heatmapPoints.length} as visible points`);
    console.log('Heatmap points:', heatmapPoints);
    
    setProcessingStatus(`Ready - ${heatmapPoints.length} locations found`);
  }, [articles]);

  // ⚡ Optimized bounds filtering with requestAnimationFrame
  const updateVisiblePoints = useCallback((bounds: any) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const filtered = filterPointsByBounds(articleHeatmapPoints, {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
      setVisiblePoints(filtered);
    });
  }, [articleHeatmapPoints]);

  // ⚡ Process articles when they change
  useEffect(() => {
    processArticleLocations();
  }, [processArticleLocations]);

  // ⚡ Fast map initialization
  useEffect(() => {
    const initializeFastMap = async () => {
      // Prevent multiple initializations
      if (mapInitialized || map || !mapRef.current) {
        console.log('🗺️ Map initialization skipped:', { mapInitialized, hasMap: !!map, hasContainer: !!mapRef.current });
        return;
      }

      try {
        setIsLoading(true);
        setMapInitialized(true);
        console.log('⚡ Initializing corruption heatmap...');
        
        // Clear any existing map instance and ensure container is clean
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
          // Remove any existing _leaflet_id to prevent "container already initialized" error
          delete (mapRef.current as any)._leaflet_id;
        }
        
        // Dynamic import Leaflet
        const L = (await import('leaflet')).default;
        
        // Fix markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map with optimized settings focused on Philippines
        const mapInstance = L.map(mapRef.current, {
          preferCanvas: true,
          zoomControl: true,
          attributionControl: true,
          maxZoom: 15,
          minZoom: 5,
          dragging: true, // Enable dragging
          touchZoom: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          // Set max bounds to Philippines region
          maxBounds: [
            [4.5, 114.0], // Southwest corner (includes southern islands)
            [21.0, 127.0]  // Northeast corner (includes northern Luzon)
          ],
          maxBoundsViscosity: 0.8 // Make bounds somewhat sticky
        }).setView([12.8797, 121.7740], 6); // Center on Philippines

        // Restrict to Philippines bounds
        mapInstance.setMaxBounds([
          [4.5, 114.0], // Southwest
          [21.0, 127.0]  // Northeast
        ]);

        // Add fast tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
          updateWhenIdle: true,
          keepBuffer: 2
        }).addTo(mapInstance);

        setMap(mapInstance);
        setCurrentBounds(mapInstance.getBounds());

        // ⚡ Optimized move event with debouncing
        let moveTimeout: NodeJS.Timeout;
        mapInstance.on('moveend', () => {
          clearTimeout(moveTimeout);
          moveTimeout = setTimeout(() => {
            const bounds = mapInstance.getBounds();
            setCurrentBounds(bounds);
            updateVisiblePoints(bounds);
          }, 100); // Debounce for performance
        });

        // ⚡ Fast zoom handling
        mapInstance.on('zoomend', () => {
          const zoom = mapInstance.getZoom();
          if (zoom > 10) {
            setRenderMode('detailed');
          } else if (zoom > 7) {
            setRenderMode('clustered');
          } else {
            setRenderMode('fast');
          }
        });

        setIsLoading(false);
        console.log('✅ Ultra-fast map ready!');
      } catch (error) {
        console.error('❌ Fast map initialization failed:', error);
        setError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    // Only initialize if we don't have a map yet
    if (!map && !mapInitialized) {
      initializeFastMap();
    }

    // Cleanup function
    return () => {
      if (map) {
        console.log('🧹 Cleaning up map...');
        try {
          map.remove();
        } catch (error) {
          console.warn('Error during map cleanup:', error);
        }
        setMap(null);
        setHeatLayer(null);
        setMapInitialized(false);
      }
      // Clean up the container reference
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  // ⚡ Super-fast heatmap rendering
  useEffect(() => {
    const renderFastHeatmap = async () => {
      if (!map) {
        console.log('⏳ Map not ready yet, skipping heatmap render');
        return;
      }

      try {
        console.log('🔥 Rendering ultra-fast heatmap...');
        
        // Clear existing layers
        if (heatLayer) {
          console.log('🧹 Removing existing heatmap layer');
          map.removeLayer(heatLayer);
        }
        markersRef.current.forEach(marker => map.removeLayer(marker));
        markersRef.current = [];

        // Import Leaflet and heatmap plugin
        const L = (await import('leaflet')).default;
        
        // Import heatmap plugin - it extends L with heatLayer method
        console.log('📦 Loading leaflet.heat plugin...');
        await import('leaflet.heat');
        
        // Check if heatLayer method is available (with type assertion)
        if (!(L as any).heatLayer) {
          throw new Error('Leaflet heatmap plugin not loaded properly - heatLayer method not available');
        }
        
        console.log('✅ Leaflet.heat plugin loaded successfully');

        // Choose data based on render mode and availability
        let heatmapData: [number, number, number][];
        
        if (articleHeatmapPoints.length > 0) {
          // Use article-based corruption locations
          console.log(`📊 Using ${articleHeatmapPoints.length} article-based corruption points`);
          console.log('Available points:', articleHeatmapPoints);
          console.log('Visible points:', visiblePoints);
          
          switch (renderMode) {
            case 'detailed':
              heatmapData = visiblePoints.map(p => [p.lat, p.lng, p.intensity]);
              break;
            case 'clustered':
              // Group nearby points for clustered view
              heatmapData = visiblePoints.length > 10 
                ? visiblePoints.filter((_, index) => index % 2 === 0).map(p => [p.lat, p.lng, p.intensity * 1.2])
                : visiblePoints.map(p => [p.lat, p.lng, p.intensity]);
              break;
            default: // fast
              // Show only high-intensity points for fast rendering
              heatmapData = visiblePoints
                .filter(p => p.intensity > 0.1) // Very low threshold to show more points
                .map(p => [p.lat, p.lng, p.intensity]);
          }
          
          // If still no data after filtering, show all visible points
          if (heatmapData.length === 0 && visiblePoints.length > 0) {
            heatmapData = visiblePoints.map(p => [p.lat, p.lng, p.intensity]);
            console.log('📊 Using all visible points after filtering returned 0 results');
          }
        } else {
          // Show sample data with some real Philippine locations for demonstration
          console.log('📊 Using sample corruption data for demonstration');
          heatmapData = [
            [14.5995, 120.9842, 0.8], // Manila
            [14.6760, 121.0437, 0.7], // Quezon City
            [14.5547, 121.0244, 0.6], // Makati
            [10.3157, 123.8854, 0.7], // Cebu
            [7.1907, 125.4553, 0.5], // Davao
            [16.4023, 120.5960, 0.4], // Baguio
            [15.4817, 120.5979, 0.6], // Tarlac
            [13.4125, 123.4054, 0.5], // Naga
            [8.4542, 124.6319, 0.4], // Cagayan de Oro
            [6.9214, 122.0790, 0.5], // Zamboanga
          ];
        }

        if (heatmapData.length === 0) {
          console.log('⚠️ No heatmap data available - this should not happen with fallback data');
          console.log('Debug info:', { 
            articleHeatmapPointsLength: articleHeatmapPoints.length, 
            visiblePointsLength: visiblePoints.length,
            renderMode,
            hasArticles: articles.length 
          });
          return;
        }

        console.log(`📊 Rendering ${heatmapData.length} points in ${renderMode} mode`);
        console.log('Heatmap data preview:', heatmapData.slice(0, 3));

        // Create optimized heatmap with better visibility
        const newHeatLayer = (L as any).heatLayer(heatmapData, {
          radius: renderMode === 'detailed' ? 35 : 50,
          blur: renderMode === 'detailed' ? 20 : 30,
          maxZoom: 15,
          max: 1.0,
          minOpacity: 0.4, // Ensure minimum visibility
          gradient: {
            0.0: '#313695',  // Deep blue
            0.1: '#4575b4',  // Blue
            0.2: '#74add1',  // Light blue
            0.3: '#abd9e9',  // Very light blue
            0.4: '#e0f3f8',  // Almost white
            0.5: '#ffffcc',  // Light yellow
            0.6: '#fed976',  // Yellow
            0.7: '#feb24c',  // Orange
            0.8: '#fd8d3c',  // Dark orange
            0.9: '#f03b20',  // Red
            1.0: '#bd0026'   // Dark red
          }
        });

        newHeatLayer.addTo(map);
        setHeatLayer(newHeatLayer);
        console.log('✅ Heatmap layer added to map');

        // Add key markers for high-intensity areas (only if using article data)
        if (renderMode !== 'fast' && articleHeatmapPoints.length > 0) {
          const highIntensityPoints = visiblePoints.filter(p => p.intensity > 0.5);
          
          highIntensityPoints.forEach(point => {
            const markerColor = point.intensity > 0.9 ? '#bd0026' : 
                               point.intensity > 0.7 ? '#f03b20' : '#fd8d3c';
            
            const marker = L.marker([point.lat, point.lng], {
              icon: L.divIcon({
                html: `
                  <div style="
                    background: ${markerColor};
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  "></div>
                `,
                className: 'fast-corruption-marker',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })
            });

            marker.bindPopup(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px;">${point.location}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  ${point.cases} corruption cases detected
                </p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">
                  Risk Level: ${Math.round(point.intensity * 100)}%
                </p>
              </div>
            `);

            marker.addTo(map);
            markersRef.current.push(marker);
          });
        }

        console.log('✅ Ultra-fast heatmap rendered successfully!');
      } catch (error) {
        console.error('❌ Fast heatmap rendering failed:', error);
        setError(`Heatmap rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    renderFastHeatmap();
  }, [map, renderMode, visiblePoints, articleHeatmapPoints]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* ⚡ Performance Stats Panel */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-green-600">⚡</div>
          <h3 className="font-semibold text-green-800">Ultra-Fast Corruption Heatmap</h3>
          <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            {renderMode.toUpperCase()}
          </div>
          {heatLayer && (
            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              🔥 HEATMAP ACTIVE
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold text-green-600">{visiblePoints.length}</div>
            <div className="text-green-700">Visible Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{articleHeatmapPoints.length}</div>
            <div className="text-blue-700">Article Locations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{markersRef.current.length}</div>
            <div className="text-purple-700">Active Markers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{articles.length}</div>
            <div className="text-orange-700">News Articles</div>
          </div>
        </div>
        <div className="mt-2 space-y-1 text-xs text-gray-600">
          <div>Status: {processingStatus}</div>
          <div>Map Status: {map ? '✅ Ready' : '⏳ Loading'}</div>
          <div>Heatmap Status: {heatLayer ? '🔥 Active' : '⚠️ Not Loaded'}</div>
          {articleHeatmapPoints.length === 0 && (
            <div className="text-blue-600">📊 Showing sample data - scan for news to see real corruption locations</div>
          )}
        </div>
        <div className="mt-3 flex space-x-2">
          <button 
            onClick={() => setRenderMode('fast')}
            className={`px-3 py-1 rounded text-xs ${renderMode === 'fast' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            ⚡ Fast
          </button>
          <button 
            onClick={() => setRenderMode('clustered')}
            className={`px-3 py-1 rounded text-xs ${renderMode === 'clustered' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            🗂️ Clustered
          </button>
          <button 
            onClick={() => setRenderMode('detailed')}
            className={`px-3 py-1 rounded text-xs ${renderMode === 'detailed' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            🔍 Detailed
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <h2 className="text-xl font-bold mb-2">🇵🇭 Philippine Corruption Heatmap - Live News Data</h2>
          <p className="text-red-100 text-sm">
            ⚡ Real-time corruption locations from news articles • 🗺️ Philippines-focused map • 📊 Interactive navigation
          </p>
        </div>
        
        <div className="relative">
          <div 
            ref={mapRef} 
            id="ultra-fast-heatmap"
            className="w-full h-96 bg-gray-100"
            style={{ 
              minHeight: '500px',
              width: '100%',
              height: '500px'
            }}
          />
          
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <div className="animate-pulse text-blue-600 font-semibold">Initializing Ultra-Fast Heatmap...</div>
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-20">
              <div className="text-center p-4">
                <div className="text-red-600 mb-2 text-4xl">❌</div>
                <h3 className="text-red-800 font-semibold mb-2">Heatmap Error</h3>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  🔄 Refresh Page
                </button>
              </div>
            </div>
          )}
          
          {/* Performance Info Panel */}
          {!isLoading && !error && (
            <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
              <div className="text-center space-y-1">
                <div className="text-lg font-bold text-green-600">
                  {heatLayer ? '🔥' : '⚠️'}
                </div>
                <div className="text-xs text-gray-600">
                  {heatLayer ? 'Heatmap Active' : 'No Heatmap'}
                </div>
                <div className="text-sm font-semibold text-gray-800">{renderMode.toUpperCase()}</div>
                <div className="text-xs text-green-600 border-t pt-1">
                  {articleHeatmapPoints.length > 0 ? `${visiblePoints.length} real points` : '10 sample points'}
                </div>
                {!heatLayer && (
                  <div className="text-xs text-red-600">
                    Check console for errors
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Legend */}
          {!isLoading && !error && (
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
              <h4 className="font-semibold text-sm mb-2">🔥 Corruption Intensity</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-yellow-500 to-orange-400 rounded"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-red-500 to-red-700 rounded"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-purple-600 to-red-800 rounded"></div>
                  <span>Critical</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                📰 Live news data • 🇵🇭 Philippines only
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Article Integration Panel */}
      {articles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📰 Live News Integration</h3>
          <p className="text-blue-700 text-sm mb-3">
            Found {articles.length} corruption articles. The heatmap combines precomputed data with live news analysis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {articles.slice(0, 3).map((article, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <h4 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          {articles.length > 3 && (
            <p className="text-sm text-blue-600 mt-2 text-center">
              And {articles.length - 3} more articles analyzed...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CorruptionHeatmap;