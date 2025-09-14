'use client';

import React from 'react';
import { CorruptionLocation, CorruptionArticleReference } from '../types/map';
import { useMapContext } from '../contexts/MapContext';
import { ExternalLink, Calendar, Building2, AlertTriangle, Clock, MapPin, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.png';

interface SelectedLocationViewerProps {
  className?: string;
}

const SelectedLocationViewer: React.FC<SelectedLocationViewerProps> = ({ 
  className = '' 
}) => {
  const { selectedLocation, selectLocation } = useMapContext();

  const handleClose = () => {
    selectLocation(null);
  };

  if (!selectedLocation) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-400 py-8">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Select a Location
          </h3>
          <p className="text-gray-400 text-sm">
            Click on a pin in the map above to view corruption cases and related articles for that location.
          </p>
        </div>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <AlertTriangle className="w-4 h-4 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-700" />;
      default: return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-500 bg-red-100';
      case 'critical': return 'text-red-700 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getSeverityText = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className={`bg-gray-800 p-2 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getSeverityIcon(selectedLocation.severity)}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {selectedLocation.city}, {selectedLocation.province}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedLocation.severity)}`}>
                  {getSeverityText(selectedLocation.severity)} Severity
                </span>
                <span className="text-gray-400 text-xs">
                  {selectedLocation.articles.length} article{selectedLocation.articles.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location metadata */}
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {new Date(selectedLocation.lastUpdated).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>{selectedLocation.province}</span>
          </div>
        </div>

        {/* Corruption types */}
        {selectedLocation.corruptionType.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-400 mb-2">Corruption Types:</p>
            <div className="flex flex-wrap gap-1">
              {selectedLocation.corruptionType.map((type: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Articles list */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <h4 className="font-semibold text-white">Related Articles</h4>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedLocation.articles.map((article: CorruptionArticleReference, index: number) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Individual article card component
interface ArticleCardProps {
  article: CorruptionArticleReference;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 0.4) return 'text-orange-500 bg-orange-100';
    return 'text-red-500 bg-red-100';
  };

  const getRelevanceText = (score: number) => {
    if (score >= 0.8) return 'High Relevance';
    if (score >= 0.6) return 'Medium Relevance';
    if (score >= 0.4) return 'Low Relevance';
    return 'Minimal Relevance';
  };

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-yellow-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h5 className="font-medium text-white leading-tight flex-1 mr-3">
          {article.title}
        </h5>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors p-1"
          aria-label="Open article in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Article metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          <span>{article.source}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(article.relevanceScore)}`}>
          {getRelevanceText(article.relevanceScore)}
        </span>
      </div>

      {/* AI Summary if available */}
      {article.summary && (
        <div className="bg-gray-800 border border-gray-600 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={Logo}
              alt="BalitAI Logo"
              width={20}
              height={20}
            />
            <span className="text-yellow-500 font-medium text-xs">AI Summary</span>
            <Sparkles className="w-3 h-3 text-yellow-500" />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {article.summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedLocationViewer;