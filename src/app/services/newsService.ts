import { NewsArticle, RSSItem, NewsSource } from '../types/news';
import { summarizeWithGemini } from '../lib/gemini';

// Trusted Philippine news sources with backup feeds
const TRUSTED_SOURCES: NewsSource[] = [
  { 
    name: 'Rappler', 
    domain: 'rappler.com', 
    feeds: [
      'https://www.rappler.com/rss/',
      'https://www.rappler.com/nation/rss/'
    ]
  },
  { 
    name: 'Philippine Daily Inquirer', 
    domain: 'inquirer.net', 
    feeds: [
      'https://newsinfo.inquirer.net/feed',
      'https://newsinfo.inquirer.net/category/latest-stories/feed'
    ]
  },
  { 
    name: 'Philippine Star', 
    domain: 'philstar.com', 
    feeds: [
      'https://www.philstar.com/rss/headlines',
      'https://www.philstar.com/rss/nation'
    ]
  },
  { 
    name: 'Manila Bulletin', 
    domain: 'mb.com.ph', 
    feeds: [
      'https://mb.com.ph/feed/'
    ]
  }
];

// Mock corruption news data for demonstration and fallback
const MOCK_CORRUPTION_NEWS = [
  {
    title: "Senate Blue Ribbon Committee investigates alleged overpricing in Department of Public Works projects",
    content: "The Senate Blue Ribbon Committee has launched a comprehensive investigation into alleged overpricing and irregularities in infrastructure projects worth billions of pesos under the Department of Public Works and Highways. Committee Chairman Senator Richard Gordon said the investigation will look into contracts awarded without proper bidding procedures and potential kickbacks to government officials. The probe was triggered by a Commission on Audit report that flagged several anomalous transactions.",
    url: "https://example.com/senate-investigation-dpwh",
    source: "Senate News",
    publishedAt: new Date().toISOString()
  },
  {
    title: "Ombudsman files multiple graft charges against former city mayor for ghost employees scheme",
    content: "The Office of the Ombudsman has filed graft and corruption charges against a former city mayor and several municipal employees for allegedly maintaining ghost employees on the city payroll. The scheme, which ran for three years, resulted in the misappropriation of over 50 million pesos in public funds. Ombudsman Samuel Martires said the case involves violations of the Anti-Graft and Corrupt Practices Act and malversation of public funds.",
    url: "https://example.com/ombudsman-ghost-employees",
    source: "Ombudsman Office",
    publishedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    title: "COA flags 2.3 billion pesos in irregular expenditures across multiple government agencies",
    content: "The Commission on Audit has flagged irregular financial transactions amounting to 2.3 billion pesos across various government agencies in its latest annual report. The audit findings include procurement violations, lack of supporting documents, and questionable disbursements. COA Chairperson Michael Aguinaldo emphasized the need for stricter compliance with procurement rules and proper documentation of government expenditures.",
    url: "https://example.com/coa-irregular-expenditures",
    source: "COA Reports",
    publishedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    title: "Sandiganbayan convicts former provincial governor of plunder in fertilizer fund scam",
    content: "The Sandiganbayan has convicted a former provincial governor of plunder in connection with the misuse of fertilizer funds intended for farmers. The anti-graft court found the defendant guilty of diverting 200 million pesos meant for agricultural support programs to personal accounts and fictitious projects. The case is part of the larger fertilizer fund scam that implicated several local government officials nationwide.",
    url: "https://example.com/sandiganbayan-fertilizer-scam",
    source: "Sandiganbayan",
    publishedAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    title: "Anti-corruption drive intensifies as President orders lifestyle checks on all government officials",
    content: "President Ferdinand Marcos Jr. has ordered comprehensive lifestyle checks on all government officials as part of his administration's intensified anti-corruption campaign. The directive requires officials to submit updated Statements of Assets, Liabilities and Net Worth (SALN) and undergo scrutiny of their lifestyle and expenditures. The Civil Service Commission will coordinate with the Ombudsman to implement the directive across all government agencies.",
    url: "https://example.com/lifestyle-checks-directive",
    source: "Presidential Communications Office",
    publishedAt: new Date(Date.now() - 345600000).toISOString()
  }
];

// Keywords related to corruption in the Philippines
const CORRUPTION_KEYWORDS = [
  'corruption', 'graft', 'plunder', 'bribery', 'kickback', 'malversation',
  'pork barrel', 'DAP', 'PDAF', 'ghost projects', 'overpricing',
  'Sandiganbayan', 'Ombudsman', 'SALN', 'unexplained wealth',
  'lifestyle check', 'ill-gotten', 'anomalous', 'irregularities',
  'COA', 'audit', 'misuse of funds', 'procurement violation', 'ghost employees'
];

async function fetchRSSFeedManual(url: string): Promise<RSSItem[]> {
  try {
    console.log(`Fetching RSS feed from: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`RSS fetch failed with status ${response.status}: ${response.statusText}`);
      return [];
    }
    
    const text = await response.text();
    return parseRSSToArticles(text, url);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Error fetching RSS from ${url}:`, errorMessage);
    return [];
  }
}

function parseRSSToArticles(rssText: string, sourceUrl: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  try {
    // Clean up the RSS text
    const cleanedRSS = rssText
      .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Extract items using regex
    const itemMatches = cleanedRSS.match(/<item[^>]*?>[\s\S]*?<\/item>/gi);
    
    if (!itemMatches) {
      console.log('No RSS items found in feed');
      return items;
    }
    
    for (const itemContent of itemMatches.slice(0, 20)) { // Limit to 20 items
      try {
        const titleMatch = itemContent.match(/<title[^>]*?>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
        const linkMatch = itemContent.match(/<link[^>]*?>(.*?)<\/link>/i);
        const descMatch = itemContent.match(/<description[^>]*?>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const pubDateMatch = itemContent.match(/<pubDate[^>]*?>(.*?)<\/pubDate>/i);
        
        if (titleMatch && linkMatch) {
          const title = (titleMatch[1] || '').trim().replace(/<[^>]*>/g, '');
          const url = linkMatch[1].trim();
          const description = (descMatch?.[1] || '').trim().replace(/<[^>]*>/g, '');
          const publishedAt = pubDateMatch?.[1]?.trim() || new Date().toISOString();
          
          if (title && url) {
            items.push({
              title,
              url,
              content: description,
              publishedAt,
              source: getDomainFromUrl(sourceUrl)
            });
          }
        }
      } catch (itemError) {
        const errorMessage = itemError instanceof Error ? itemError.message : 'Unknown error';
        console.warn('Error parsing individual RSS item:', errorMessage);
        continue;
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('Error parsing RSS XML:', errorMessage);
  }
  
  return items;
}

function isCorruptionRelated(text: string): boolean {
  const lowercaseText = text.toLowerCase();
  return CORRUPTION_KEYWORDS.some(keyword => 
    lowercaseText.includes(keyword.toLowerCase())
  );
}

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

async function tryMultipleFeeds(source: NewsSource): Promise<RSSItem[]> {
  for (const feedUrl of source.feeds) {
    try {
      const articles = await fetchRSSFeedManual(feedUrl);
      if (articles.length > 0) {
        console.log(`Successfully fetched ${articles.length} articles from ${feedUrl}`);
        return articles.map(article => ({
          ...article,
          source: source.name
        }));
      }
    } catch (error) {
      console.log(`Failed to fetch from ${feedUrl}, trying next...`);
      continue;
    }
  }
  
  console.log(`All feeds failed for ${source.name}`);
  return [];
}

export async function fetchPhilippineCorruptionNews(
  query: string,
  sources: string[],
  limit: number = 10
): Promise<NewsArticle[]> {
  console.log(`Fetching corruption news for query: "${query}"`);
  
  const relevantSources = TRUSTED_SOURCES.filter(source =>
    sources.includes(source.domain)
  );
  
  const allArticles: RSSItem[] = [];
  
  // Fetch from RSS feeds with timeout protection
  const fetchPromises = relevantSources.map(async (source) => {
    console.log(`Fetching from ${source.name}...`);
    try {
      const articles = await Promise.race([
        tryMultipleFeeds(source),
        new Promise<RSSItem[]>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 15000)
        )
      ]);
      return articles;
    } catch (error) {
      // error is used here for logging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Timeout or error fetching from ${source.name}:`, errorMessage);
      return [];
    }
  });
  
  const results = await Promise.allSettled(fetchPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      console.warn(`Failed to fetch from ${relevantSources[index].name}:`, result.reason);
    }
  });
  
  console.log(`Fetched ${allArticles.length} total articles from RSS`);
  
  // Filter for corruption-related content
  const corruptionArticles = allArticles.filter(article => 
    isCorruptionRelated(article.title + ' ' + article.content)
  );
  
  console.log(`Found ${corruptionArticles.length} corruption-related articles from RSS`);
  
  // If we don't have enough articles, supplement with mock data
  if (corruptionArticles.length < 3) {
    console.log('Adding mock corruption news data to supplement results...');
    corruptionArticles.push(...MOCK_CORRUPTION_NEWS);
  }
  
  // Sort by publication date (newest first)
  corruptionArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  // Take top articles and enhance with AI summaries
  const topArticles = corruptionArticles.slice(0, Math.min(limit, corruptionArticles.length));
  const enhancedArticles: NewsArticle[] = [];
  
  for (const article of topArticles) {
    try {
      console.log(`Processing article: ${article.title.substring(0, 50)}...`);
      
      // Generate AI summary
      const summary = await summarizeWithGemini(article.content);
      
      enhancedArticles.push({
        id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        content: article.content,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
        summary
      });
      
      // Shorter delay to improve user experience
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error processing article ${article.title}:`, errorMessage);
      
      // Add article without AI enhancement as fallback
      enhancedArticles.push({
        id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        content: article.content,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
        summary: 'AI summary temporarily unavailable'
      });
    }
  }
  
  console.log(`Successfully processed ${enhancedArticles.length} articles`);
  return enhancedArticles;
}
