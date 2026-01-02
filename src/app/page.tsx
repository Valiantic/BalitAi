'use client';

import React, { useEffect, useRef } from "react";
import MainSection from "./components/MainSection";
import HowItWorksSection from "./components/HowItWorksSection";
import AIAnalysisGuide from "./components/AIAnalysisGuide";
import PoliciesSection from "./components/PoliciesSection";
import AILimitationsNotice from "./components/AILimitationsNotice";
import Footer from "./components/Footer";
import NewsResults from "./components/NewsResults";
import LoadingModal from "./components/modals/LoadingModal";
import { useScanNews } from "./hooks/useScanNews";
import ScrollToTop from "./components/ScrollToTop";
import { MapProvider } from "./contexts/MapContext";

export default function Home() {
  const { data, loading, error, scanNews, clearError, resetData } = useScanNews();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when data is available
  useEffect(() => {
    if (data && !loading && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [data, loading]);

  return (
    <MapProvider>
      <div className="w-full">
        <MainSection
          onScanNews={scanNews}
          loading={loading}
          error={error} // error is used here as a prop
          onClearError={clearError}
        />

        {/* Show results if we have data and not loading */}
        {data && !loading && (
          <div ref={resultsRef}>
            <NewsResults
              articles={data.articles}
              onNewScan={resetData}
            />
            <section className="w-full">
              <HowItWorksSection />
            </section>
            <section className="w-full">
              <AIAnalysisGuide />
            </section>
            <section className="w-full">
              <PoliciesSection />
            </section>
          </div>
        )}

        {/* Only show other sections if we haven't scanned or there's no data */}
        {!data && (
          <>
            <section className="w-full">
              <HowItWorksSection />
            </section>
            <section className="w-full">
              <AIAnalysisGuide />
            </section>
            <section className="w-full">
              <PoliciesSection />
            </section>
          </>
        )}

        {/* AI Limitations Notice - Always show before footer */}
        <section className="w-full">
          <AILimitationsNotice />
        </section>

        <ScrollToTop />
        <Footer />
      </div>

      {/* Loading Modal - Rendered outside container for full viewport coverage */}
      <LoadingModal
        isOpen={loading}
        message="Scanning trusted Philippine news sources for corruption-related content..."
      />
    </MapProvider>
  );
}
