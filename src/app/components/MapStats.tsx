'use client';

import React, { memo } from 'react';
import { CorruptionLocation } from '../types/map';
import { MapPin, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface MapStatsProps {
  locations: CorruptionLocation[];
  className?: string;
}

const MapStats: React.FC<MapStatsProps> = memo(({ locations, className = '' }) => {
  const stats = React.useMemo(() => {
    const totalArticles = locations.reduce((sum, loc) => sum + loc.articles.length, 0);
    const recentCases = locations.filter(loc => {
      const daysDiff = Math.floor((Date.now() - new Date(loc.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length;

    const topProvinces = locations.reduce((acc, loc) => {
      const province = loc.province || 'Unknown';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedProvinces = Object.entries(topProvinces)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      totalLocations: locations.length,
      totalArticles,
      recentCases,
      topProvinces: sortedProvinces,
      severityDistribution: {
        critical: locations.filter(l => l.severity === 'critical').length,
        high: locations.filter(l => l.severity === 'high').length,
        medium: locations.filter(l => l.severity === 'medium').length,
        low: locations.filter(l => l.severity === 'low').length,
      }
    };
  }, [locations]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-800">Corruption Analysis</h3>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-600">{stats.totalLocations}</div>
          <div className="text-xs text-blue-700">Locations</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-600">{stats.totalArticles}</div>
          <div className="text-xs text-green-700">Articles</div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Recent Activity</span>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="text-lg font-bold text-yellow-600">{stats.recentCases}</div>
          <div className="text-xs text-yellow-700">Cases this week</div>
        </div>
      </div>

      {/* Severity breakdown */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Severity Levels</span>
        </div>
        <div className="space-y-1">
          {Object.entries(stats.severityDistribution).map(([severity, count]) => (
            <div key={severity} className="flex justify-between items-center text-sm">
              <span className={`capitalize ${getSeverityColor(severity)}`}>
                {severity}
              </span>
              <span className="font-medium text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top provinces */}
      {stats.topProvinces.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Top Provinces</span>
          </div>
          <div className="space-y-1">
            {stats.topProvinces.map(([province, count], index) => (
              <div key={province} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate">
                  {index + 1}. {province}
                </span>
                <span className="font-medium text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

MapStats.displayName = 'MapStats';

export default MapStats;