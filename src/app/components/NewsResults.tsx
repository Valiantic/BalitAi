import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { NewsArticle } from '../types/news';
import { ExternalLink, Calendar, Building2, Sparkles, MapPin, AlertTriangle, Clock } from 'lucide-react';
import { useAOS } from '../hooks/useAOS';
import { useCorruptionLocations } from '../hooks/useMapData';
import { useMapContext } from '../contexts/MapContext';
import Logo from '../../../public/images/logo.png';
import dynamic from 'next/dynamic';
import MapLegend from './MapLegend';
import MapStats from './MapStats';
import SelectedLocationViewer from './SelectedLocationViewer';

// Dynamically import the map component to avoid SSR issues
const CorruptionMap = dynamic(() => import('./CorruptionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Loading corruption tracker map...</p>
      </div>
    </div>
  ),
});

interface NewsResultsProps { 
  articles: NewsArticle[];
  onNewScan?: () => void;
}

const NewsResults: React.FC<NewsResultsProps> = ({ articles, onNewScan }) => {
  useAOS();
  const { corruptionLocations, processArticles, getLocationStats } = useCorruptionLocations();
  const { selectedLocation, selectLocation } = useMapContext();

  // Memoize articles processing to prevent unnecessary re-renders
  const articlesHash = useMemo(() => 
    articles.map(a => a.id).join(','), 
    [articles]
  );

  // Process articles to extract corruption locations when articles change
  useEffect(() => {
    if (articles && articles.length > 0) {
      processArticles(articles);
    }
  }, [articlesHash]);

  const locationStats = getLocationStats;

  if (articles.length === 0) {
    return (
      // No results found message
      <section className="w-full py-12">
        <div className="bg-white border border-yellow-500 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
            <p className="text-gray-300 mb-6">
              No corruption-related news articles were found in the latest scan.
            </p>
            {onNewScan && (
              <button
                onClick={onNewScan}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                Try Another Scan
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-100 border border-yellow-500 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className='flex items-center'>
              <h2 className="text-2xl font-bold text-blue-500 mb-2">
                Corruption AI News Scan Results
              </h2>
              <Sparkles className="inline-block ml-2 mb-2 text-yellow-500" />
              </div>
              <div className="text-sm font-leading text-blue-500">
                Found {articles.length} corruption-related articles
                {locationStats.total > 0 && (
                  <span className="ml-2">• {locationStats.total} locations identified</span>
                )}
              </div>
            </div>
          </div>

          {/* Corruption Tracker Map Section */}
          {corruptionLocations.length > 0 && (
            <div 
              className="mb-8" 
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-white">
                    Corruption Tracker Map
                  </h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                
                <p className="text-gray-300 text-sm mb-6">
                  Interactive map showing corruption related news hotspots across the Philippines based on the analyzed news articles.
                </p>

                {/* Map Container - Full Width */}
                <div className="mb-6">
                  <CorruptionMap 
                    locations={corruptionLocations} 
                    height="500px"
                    className="border border-gray-600 rounded"
                  />
                </div>
                
                {/* Statistics Panel - Below Map */}
                <div className="flex flex-col gap-2 mb-6">
                  {/* Legend */}
                  <div className="bg-gray-700 rounded-lg p-3 h-fit">
                    <MapLegend 
                      showStats={true}
                      stats={locationStats}
                    />
                  </div>

                  {/* Top Locations */}
                  <div className="bg-gray-700 rounded-lg p-3 h-fit">
                    <h4 className="font-medium text-base sm:text-xl md:text-xl text-white mb-2 flex items-center gap-2">
                      <MapPin className="w-4 text-yellow-500" />
                      Most Reported
                    </h4>
                    <div className="space-y-1">
                      {corruptionLocations
                        .sort((a, b) => b.articles.length - a.articles.length)
                        .slice(0, 3)
                        .map((location, index) => (
                          <div key={location.id} className="flex text-base sm:text-xl md:text-xl justify-between items-center text-sm">
                            <span className="text-gray-300 truncate">
                              {index + 1}. {location.city}, {location.province}
                            </span>
                            <span className="text-yellow-400 text-xl font-medium">
                              {location.articles.length}
                            </span>
                          </div>
                        ))
                      }
                      {corruptionLocations.length === 0 && (
                        <div className="text-gray-400 text-sm">No data available</div>
                      )}
                    </div>
                  </div>

                  {/* Severity Distribution */}
                  <div className="bg-gray-700 rounded-lg p-3 h-fit">
                    <h4 className="font-medium text-base sm:text-xl md:text-xl text-white mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Severity Levels
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(locationStats.bySeverity)
                        .filter(([_, count]) => count > 0)
                        .map(([severity, count]) => {
                          const colors = {
                            critical: 'text-red-400',
                            high: 'text-red-300',
                            medium: 'text-yellow-400',
                            low: 'text-green-400'
                          };
                          return (
                            <div key={severity} className="flex text-base sm:text-xl md:text-xl justify-between items-center text-sm">
                              <span className={`capitalize ${colors[severity as keyof typeof colors]}`}>
                                {severity}
                              </span>
                              <span className="text-gray-300 text-xl font-medium">{count}</span>
                            </div>
                          );
                        })}
                      {Object.values(locationStats.bySeverity).every(count => count === 0) && (
                        <div className="text-gray-400 text-sm">No data available</div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-700 rounded-lg p-3 h-fit">
                    <h4 className="font-medium text-base sm:text-xl md:text-xl  text-white mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Locations</span>
                        <span className="text-blue-400 font-medium text-xl">{locationStats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Articles</span>
                        <span className="text-green-400 font-medium text-xl">{locationStats.totalArticles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Regions Affected</span>
                        <span className="text-purple-400 font-medium text-xl">{Object.keys(locationStats.byRegion).length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Location Details */}
                <div className="mb-4">
                  <SelectedLocationViewer />
                </div>

                {/* Interactive Features Info */}
                <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-blue-300 mb-1">Interactive Map Features</h5>
                      <p className="text-blue-200 text-sm">
                        Click on any pin to view detailed corruption cases and related articles. 
                        The map automatically clusters nearby cases and uses color-coding to indicate severity levels.
                        Zoom in to see individual cases, or zoom out for a broader regional view.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {articles.map((article, index) => (
              <div
                key={article.id}          
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-gray-800 transition-all duration-300 ease-in-out hover:scale-[1.02] border border-gray-700 rounded-lg p-6 hover:border-yellow-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white leading-tight flex-1 mr-4">
                    {article.title}
                  </h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>

                {/* Add this after the title div and before the metadata div */}
                {article.imageUrl && (
                  <div className="mb-4 relative">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-68 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span className="font-medium">{article.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {article.summary && (
                  <div className="mb-4">
                    <div className='flex items-center'>
                    <Image
                      src={Logo}
                      alt="BalitAI Logo"
                      width={40}
                      height={40}
                      className="mb-4"
                    />
                      <h4 className="text-yellow-500 font-semibold mb-2">AI Summary</h4>
                      <Sparkles className="inline-block ml-2 mb-2 text-sm text-yellow-500" />
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {article.summary}
                    </p>
                  </div>
                )}

                {article.content && (
                  <div>
                    <h4 className="text-gray-400 font-semibold mb-2">Content Preview:</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {article.content.substring(0, 300)}
                      {article.content.length > 300 && '...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsResults;
