'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CorruptionLocation, Coordinates } from '../types/map';
import { useMapData, useMapOptimizations } from '../hooks/useMapData';
import { useMapContext } from '../contexts/MapContext';
import { MapPin, AlertTriangle, AlertCircle, AlertOctagon, Clock, Building2, ExternalLink } from 'lucide-react';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on severity
const createCustomIcon = (
  severity: 'low' | 'medium' | 'high' | 'critical', 
  isCluster: boolean = false, 
  count?: number,
  isSelected: boolean = false
) => {
  const colors = {
    low: '#10b981',      // green
    medium: '#f59e0b',   // yellow
    high: '#ef4444',     // red
    critical: '#991b1b', // dark red
  };

  const size = isCluster ? [35, 45] : [25, 35];
  const selectedSize = isSelected ? [30, 40] : size;
  const color = colors[severity];
  const strokeColor = isSelected ? '#fbbf24' : '#fff'; // Golden stroke for selected
  const strokeWidth = isSelected ? '2' : '1';

  const svgIcon = `
    <svg width="${selectedSize[0]}" height="${selectedSize[1]}" viewBox="0 0 25 35" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 35 12.5 35S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" 
            fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
      ${isCluster && count ? 
        `<circle cx="12.5" cy="12.5" r="8" fill="#fff"/>
         <text x="12.5" y="17" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">${count}</text>` :
        `<circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
         <circle cx="12.5" cy="12.5" r="4" fill="${color}"/>`
      }
      ${isSelected ? `<circle cx="12.5" cy="12.5" r="10" fill="none" stroke="${strokeColor}" stroke-width="1" opacity="0.6"/>` : ''}
    </svg>
  `;

  return new L.DivIcon({
    html: svgIcon,
    className: `custom-corruption-marker ${isSelected ? 'selected' : ''}`,
    iconSize: selectedSize as [number, number],
    iconAnchor: [selectedSize[0] / 2, selectedSize[1]],
    popupAnchor: [0, -selectedSize[1]],
  });
};

// Component to handle map events
interface MapEventHandlerProps {
  onMapChange: (center: Coordinates, zoom: number) => void;
}

const MapEventHandler: React.FC<MapEventHandlerProps> = ({ onMapChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onMapChange({ lat: center.lat, lng: center.lng }, zoom);
    },
    zoomend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onMapChange({ lat: center.lat, lng: center.lng }, zoom);
    },
  });

  return null;
};

// Component to update map view programmatically
interface MapViewUpdaterProps {
  center: Coordinates;
  zoom: number;
}

const MapViewUpdater: React.FC<MapViewUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [map, center, zoom]);

  return null;
};

// Popup content component
interface CorruptionPopupProps {
  location: CorruptionLocation & { isCluster?: boolean; count?: number };
}

const CorruptionPopup: React.FC<CorruptionPopupProps> = ({ location }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'critical': return <AlertOctagon className="w-4 h-4 text-red-700" />;
      default: return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityText = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  if (location.isCluster) {
    return (
      <div className="max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          {getSeverityIcon(location.severity)}
          <h3 className="font-semibold text-gray-800">{location.title}</h3>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <p><strong>{location.count}</strong> corruption cases in this area</p>
          <p className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {location.city}, {location.province}
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Click to zoom in and see individual cases
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm p-2">
      <div className="flex items-center gap-2 mb-2">
        {getSeverityIcon(location.severity)}
        <h3 className="font-semibold text-gray-800">{location.title}</h3>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        <p className="flex items-center gap-1 mb-1">
          <Building2 className="w-3 h-3" />
          {location.city}, {location.province}
        </p>
        <p className="flex items-center gap-1 mb-1">
          <AlertTriangle className="w-3 h-3" />
          Severity: {getSeverityText(location.severity)}
        </p>
        <p className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last updated: {new Date(location.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {location.corruptionType.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Types:</p>
          <div className="flex flex-wrap gap-1">
            {location.corruptionType.slice(0, 3).map((type, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {type}
              </span>
            ))}
            {location.corruptionType.length > 3 && (
              <span className="text-xs text-gray-500">+{location.corruptionType.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-2">
        <p className="text-xs font-medium text-gray-700 mb-1">
          Recent Articles ({location.articles.length}):
        </p>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {location.articles.slice(0, 2).map((article, index) => (
            <div key={index} className="text-xs">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 line-clamp-2 flex items-start gap-1"
              >
                <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{article.title}</span>
              </a>
              <p className="text-gray-500 text-xs">{article.source} • {new Date(article.publishedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {location.articles.length > 2 && (
            <p className="text-xs text-gray-500">+{location.articles.length - 2} more articles</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main CorruptionMap component
interface CorruptionMapProps {
  locations: CorruptionLocation[];
  height?: string;
  className?: string;
}

const CorruptionMap: React.FC<CorruptionMapProps> = ({ 
  locations, 
  height = '400px',
  className = '' 
}) => {
  const { mapState, handleLocationSelect } = useMapData();
  const { selectedLocation, setMapCenter, setMapZoom } = useMapContext();
  const { getClusteredLocations } = useMapOptimizations();
  const [currentZoom, setCurrentZoom] = useState(mapState.zoom);
  const [mapCenter, setMapCenterLocal] = useState(mapState.center);

  // Update local state when mapState changes from external sources
  useEffect(() => {
    setCurrentZoom(mapState.zoom);
    setMapCenterLocal(mapState.center);
  }, [mapState.zoom, mapState.center]);

  // Get clustered locations based on current zoom
  const clusteredLocations = getClusteredLocations(currentZoom);

  // Handle map movement and zoom changes (only update local state, not global context to prevent loops)
  const handleMapChange = (center: Coordinates, zoom: number) => {
    // Only update if values actually changed to prevent infinite renders
    if (zoom !== currentZoom) {
      setCurrentZoom(zoom);
    }
    if (center.lat !== mapCenter.lat || center.lng !== mapCenter.lng) {
      setMapCenterLocal(center);
    }
    // Don't update the context state here to prevent infinite loops
  };

  // Handle marker click
  const handleMarkerClick = (location: CorruptionLocation & { isCluster?: boolean; count?: number }) => {
    if (location.isCluster && currentZoom < 13) {
      // Zoom in on cluster
      setMapCenter(location.coordinates);
      setMapZoom(Math.min(currentZoom + 3, 15));
    } else if (!location.isCluster) {
      // Select individual location - this will show it in the SelectedLocationViewer
      handleLocationSelect(location);
    }
  };

  return (
    <div className={`corruption-map ${className}`} style={{ height }}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={currentZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Map tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Event handlers */}
        <MapEventHandler onMapChange={handleMapChange} />
        <MapViewUpdater center={mapState.center} zoom={mapState.zoom} />

        {/* Corruption markers */}
        {clusteredLocations.map((location) => {
          const isSelected = !!(selectedLocation && selectedLocation.id === location.id);
          return (
            <Marker
              key={location.id}
              position={[location.coordinates.lat, location.coordinates.lng]}
              icon={createCustomIcon(location.severity, location.isCluster, location.count, isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup>
                <CorruptionPopup location={location} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CorruptionMap;