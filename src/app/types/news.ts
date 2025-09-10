export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
  imageUrl?: string;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: 'success' | 'error';
  message?: string;
}

export interface ScanRequest {
  query?: string;
  sources?: string[];
  limit?: number;
}

export interface ScanResponse {
  articles: NewsArticle[];
  scanId: string;
  timestamp: string;
  query: string;
}

export interface RSSItem {
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  source: string;
}

export interface NewsSource {
  name: string;
  domain: string;
  feeds: string[];
}
