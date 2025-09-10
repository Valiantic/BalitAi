import { useState, useCallback } from 'react';
import { NewsArticle, ScanResponse } from '../types/news';

interface UseScanNewsReturn {
  data: ScanResponse | null;
  loading: boolean;
  error: string | null;
  scanNews: () => Promise<void>;
  clearError: () => void;
  resetData: () => void;
}

export const useScanNews = (): UseScanNewsReturn => {
  const [data, setData] = useState<ScanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'Philippines corruption news',
          sources: [
            'rappler.com',
            'inquirer.net', 
            'abs-cbn.com',
            'gma.com',
            'philstar.com',
            'manila-times.net',
            'sunstar.com.ph'
          ],
          limit: 10
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to scan news: ${response.statusText}`);
      }

      const result: ScanResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    scanNews,
    clearError,
    resetData,
  };
};
