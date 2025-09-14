'use client';

import React, { useEffect, useRef, useState } from "react";
import MainSection from "./components/MainSection";
import HowItWorksSection from "./components/HowItWorksSection";
import Footer from "./components/Footer";
import NewsResults from "./components/NewsResults";
import CorruptionHeatmap from "./components/CorruptionHeatmap";
import LoadingModal from "./components/modals/LoadingModal";
import { useScanNews } from "./hooks/useScanNews";
import ScrollToTop from "./components/ScrollToTop";
import { GeoLocation, NewsArticle } from "./types/news";

export default function Home() {
  const { data, loading, error, scanNews, clearError, resetData } = useScanNews();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedLocationArticles, setSelectedLocationArticles] = useState<NewsArticle[]>([]);

  // Scroll to results when data is available
  useEffect(() => {
    if (data && !loading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [data, loading]);

  const handleLocationClick = (location: GeoLocation, articles: NewsArticle[]) => {
    setSelectedLocationArticles(articles);
    // Could potentially scroll to a detailed view or show a modal
  };

  const toggleHeatmapView = () => {
    setShowHeatmap(!showHeatmap);
  };

  return (
    <>
      <div className="w-full px-4 py-6 max-w-7xl mx-auto">
        <MainSection 
          onScanNews={scanNews}
          loading={loading}
          error={error} // error is used here as a prop
          onClearError={clearError}
        />
        
        {/* Show results if we have data and not loading */}
        {data && !loading && (
          <div ref={resultsRef} className="space-y-6">
            {/* View Toggle Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowHeatmap(false)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  !showHeatmap
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📰 News Articles
              </button>
              <button
                onClick={() => setShowHeatmap(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  showHeatmap
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗺️ Corruption Heatmap
              </button>
            </div>

            {/* Content Views */}
            {showHeatmap ? (
              <div className="space-y-4">
                <CorruptionHeatmap 
                  articles={data.articles} 
                  onLocationClick={handleLocationClick}
                />
                
                {/* Show selected location articles if any */}
                {selectedLocationArticles.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Related Articles ({selectedLocationArticles.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLocationArticles.slice(0, 4).map((article) => (
                        <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                            {article.summary}
                          </p>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline"
                          >
                            Read full article →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NewsResults 
                articles={data.articles} 
                onNewScan={resetData}
              />
            )}
          </div>
        )}
        
        {/* Only show other sections if we haven't scanned or there's no data */}
        {!data && (
          <>
            <section className="w-full mt-10">
              <HowItWorksSection />
            </section>
          </>
        )}
        <ScrollToTop />
         <Footer />
      </div>
       
      {/* Loading Modal - Rendered outside container for full viewport coverage */}
      <LoadingModal 
        isOpen={loading} 
        message="Scanning trusted Philippine news sources for corruption-related content..."
      />
    </>
  );
}
