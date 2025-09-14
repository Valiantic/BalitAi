'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, AlertOctagon, MapPin, Info } from 'lucide-react';

interface MapLegendProps {
  className?: string;
  showStats?: boolean;
  stats?: {
    total: number;
    bySeverity: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
}

const MapLegend: React.FC<MapLegendProps> = ({ className = '', showStats = true, stats }) => {
  const severityLevels = [
    {
      level: 'critical',
      label: 'Critical',
      description: 'Major scandals, high-profile cases',
      color: '#991b1b',
      icon: <AlertOctagon className="w-4 h-4" />,
      count: stats?.bySeverity.critical || 0,
    },
    {
      level: 'high',
      label: 'High',
      description: 'Significant corruption cases',
      color: '#ef4444',
      icon: <AlertTriangle className="w-4 h-4" />,
      count: stats?.bySeverity.high || 0,
    },
    {
      level: 'medium',
      label: 'Medium',
      description: 'Moderate corruption allegations',
      color: '#f59e0b',
      icon: <AlertTriangle className="w-4 h-4" />,
      count: stats?.bySeverity.medium || 0,
    },
    {
      level: 'low',
      label: 'Low',
      description: 'Minor irregularities',
      color: '#10b981',
      icon: <AlertCircle className="w-4 h-4" />,
      count: stats?.bySeverity.low || 0,
    },
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-blue-500" />
        <h3 className="font-semibold text-gray-800">Map Legend</h3>
      </div>

      {/* Severity levels */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700">Corruption Severity Levels</h4>
        {severityLevels.map((severity) => (
          <div key={severity.level} className="flex items-center gap-3">
            {/* Custom marker representation */}
            <div className="relative flex-shrink-0">
              <div 
                className="w-4 h-5 rounded-b-full border-2 border-white"
                style={{ backgroundColor: severity.color }}
              />
              <div 
                className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {severity.icon}
                <span className="font-medium text-sm text-gray-800">{severity.label}</span>
                {showStats && stats && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {severity.count}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{severity.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Clustering explanation */}
      <div className="border-t pt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Map Clustering</h4>
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0 mt-1">
            <div className="w-5 h-6 rounded-b-full bg-red-500 border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600">
              Multiple cases in the same area are clustered together. 
              Zoom in to see individual locations.
            </p>
          </div>
        </div>
      </div>

      {/* Total stats */}
      {showStats && stats && (
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Total Cases:</span>
            <span className="font-bold text-blue-600">{stats.total}</span>
          </div>
        </div>
      )}

      {/* Map controls explanation */}
      <div className="border-t pt-3 mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Map Controls</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p>• Click markers to view case details</p>
          <p>• Scroll to zoom, drag to pan</p>
          <p>• Click clusters to zoom in</p>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;