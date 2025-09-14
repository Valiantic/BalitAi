import { NewsArticle, RSSItem, NewsSource } from '../types/news';
import { summarizeWithGemini, enhanceArticleWithAI } from '../lib/gemini';
import { batchProcessLocations } from '../lib/fastLocationMapping';
import { CORE_CORRUPTION_KEYWORDS, CORRUPTION_INSTITUTIONS, NON_CORRUPTION_KEYWORDS } from '../contants/newsRestrictions';
import { TRUSTED_SOURCES } from '../contants/trustedSource';
import { MOCK_CORRUPTION_NEWS } from '../contants/mockCorruption';

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
        const imageMatch = itemContent.match(/<media:content[^>]*url="([^"]*)"[^>]*\/?>|<enclosure[^>]*url="([^"]*)"[^>]*type="image[^"]*"[^>]*\/?>|<image[^>]*>[\s\S]*?<url[^>]*>(.*?)<\/url>[\s\S]*?<\/image>/i);
        const imgTagMatch = itemContent.match(/<img[^>]*src="([^"]*)"[^>]*\/?>/i);
        
        const description = (descMatch?.[1] || '').trim().replace(/<[^>]*>/g, '');
        const descImageMatch = description.match(/<img[^>]*src="([^"]*)"[^>]*\/?>/i);

        if (titleMatch && linkMatch) {
          const title = (titleMatch[1] || '').trim().replace(/<[^>]*>/g, '');
          const url = linkMatch[1].trim();
          const publishedAt = pubDateMatch?.[1]?.trim() || new Date().toISOString();
          const imageUrl = imageMatch?.[1] || imageMatch?.[2] || imageMatch?.[3] || imgTagMatch?.[1] || descImageMatch?.[1] || null;

          if (title && url) {
            // Pre-filter: Skip articles that are clearly not corruption-related
            const quickCheck = title + ' ' + description;
            if (isCorruptionRelated(quickCheck)) {
              items.push({
                title,
                url,
                content: description,
                publishedAt,
                source: getDomainFromUrl(sourceUrl),
                imageUrl: imageUrl || undefined
              });
            } else {
              console.log(`⚡ Quick filter: Skipping non-corruption article: ${title.substring(0, 50)}...`);
            }
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
  
  // IMMEDIATE EXCLUSION: If it contains any non-corruption keywords, reject it
  const hasNonCorruptionKeywords = NON_CORRUPTION_KEYWORDS.some(keyword => 
    lowercaseText.includes(keyword.toLowerCase())
  );
  
  if (hasNonCorruptionKeywords) {
    return false; // Immediately exclude non-corruption topics
  }
  
  // STRICT INCLUSION: Must contain at least one core corruption keyword
  const hasCoreCorruptionKeywords = CORE_CORRUPTION_KEYWORDS.some(keyword => 
    lowercaseText.includes(keyword.toLowerCase())
  );
  
  // BONUS: Extra relevance for corruption institutions
  const hasCorruptionInstitutions = CORRUPTION_INSTITUTIONS.some(keyword => 
    lowercaseText.includes(keyword.toLowerCase())
  );
  
  // Must have either core corruption keywords OR corruption institutions
  const isStrictlyCorruption = hasCoreCorruptionKeywords || hasCorruptionInstitutions;
  
  // Additional strict checks for common false positives
  if (!isStrictlyCorruption) {
    return false;
  }
  
  // Extra validation: must not be about general government policy without corruption context
  const generalPolicyKeywords = ['policy', 'program', 'initiative', 'launch', 'announcement'];
  const hasGeneralPolicy = generalPolicyKeywords.some(keyword => 
    lowercaseText.includes(keyword)
  );
  
  // If it's just general policy without corruption keywords, exclude it
  if (hasGeneralPolicy && !hasCoreCorruptionKeywords) {
    return false;
  }
  
  return true;
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
  
  // Balanced corruption filtering - strict but not overly restrictive
  const corruptionArticles = allArticles.filter(article => {
    const titleAndContent = article.title + ' ' + article.content;
    const lowercaseText = titleAndContent.toLowerCase();
    
    // Layer 1: Basic corruption check (must pass)
    const passesBasicCheck = isCorruptionRelated(titleAndContent);
    
    if (!passesBasicCheck) {
      console.log(`✗ Layer 1 filter: Non-corruption article: ${article.title.substring(0, 60)}...`);
      return false;
    }
    
    // Layer 2: Relaxed false positive check (more lenient)
    const obviousNonCorruption = [
      'road opening', 'bridge inauguration', 'ribbon cutting', 'blessing ceremony',
      'graduation', 'birthday', 'wedding', 'anniversary celebration',
      'sports tournament', 'basketball game', 'football match',
      'weather update', 'storm warning', 'typhoon',
      'entertainment news', 'celebrity gossip', 'movie premiere'
    ];
    
    const hasObviousNonCorruption = obviousNonCorruption.some(keyword => 
      lowercaseText.includes(keyword)
    );
    
    if (hasObviousNonCorruption) {
      console.log(`✗ Layer 2 filter: Obviously non-corruption: ${article.title.substring(0, 60)}...`);
      return false;
    }
    
    // Layer 3: More lenient title check - allow if ANY corruption context exists
    const titleLower = article.title.toLowerCase();
    const contentLower = article.content.toLowerCase();
    
    // Check if EITHER title OR content has corruption context
    const titleHasCorruptionContext = CORE_CORRUPTION_KEYWORDS.some(keyword => 
      titleLower.includes(keyword)
    ) || CORRUPTION_INSTITUTIONS.some(keyword => 
      titleLower.includes(keyword)
    ) || ['investigation', 'charges', 'case', 'probe', 'allegation', 'scandal', 'complaint', 'violation'].some(keyword => 
      titleLower.includes(keyword)
    );
    
    const contentHasCorruptionContext = CORE_CORRUPTION_KEYWORDS.some(keyword => 
      contentLower.includes(keyword)
    ) || CORRUPTION_INSTITUTIONS.some(keyword => 
      contentLower.includes(keyword)
    );
    
    // Pass if EITHER title OR content has corruption context
    if (!titleHasCorruptionContext && !contentHasCorruptionContext) {
      console.log(`✗ Layer 3 filter: Insufficient corruption context: ${article.title.substring(0, 60)}...`);
      return false;
    }
    
    console.log(`✓ PASSED ALL LAYERS: Corruption article confirmed: ${article.title.substring(0, 60)}...`);
    return true;
  });
  
  console.log(`Found ${corruptionArticles.length} corruption-related articles from RSS`);
  
  // Only use mock data if absolutely NO corruption articles found, and only corruption mock data
  if (corruptionArticles.length === 0) {
    console.log('No corruption articles found in RSS feeds. Using mock corruption data as fallback...');
    corruptionArticles.push(...MOCK_CORRUPTION_NEWS.filter(article => 
      isCorruptionRelated(article.title + ' ' + article.content)
    ));
  } else {
    console.log(`Using ${corruptionArticles.length} real corruption articles from RSS feeds`);
  }
  
  // Sort by publication date (newest first)
  corruptionArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  // Take top articles and enhance with AI summaries
  const topArticles = corruptionArticles.slice(0, Math.min(limit, corruptionArticles.length));
  
  // Batch process locations first for speed
  console.log('🗺️ Starting fast location mapping...');
  const locationResults = await batchProcessLocations(
    topArticles.map(article => ({
      id: `temp_${article.title}`,
      title: article.title,
      content: article.content
    }))
  );
  
  const enhancedArticles: NewsArticle[] = [];
  
  for (let i = 0; i < topArticles.length; i++) {
    const article = topArticles[i];
    try {
      console.log(`Processing article: ${article.title.substring(0, 50)}...`);
      
      // Get pre-processed location
      const articleId = `temp_${article.title}`;
      const geoLocation = locationResults.get(articleId) || undefined;
      
      // Check if we have enough content for summarization
      const contentLength = article.content?.trim().length || 0;
      let summary: string;
      
      if (contentLength < 30) {
        // If content is very short, create an enhanced summary from title and available info
        const corruptionType = CORE_CORRUPTION_KEYWORDS.find(keyword => 
          article.title.toLowerCase().includes(keyword)
        ) || 'corruption';
        
        const institution = CORRUPTION_INSTITUTIONS.find(keyword => 
          article.title.toLowerCase().includes(keyword)
        );
        
        summary = `This ${corruptionType} case involves ${article.source} reporting on important developments in Philippine governance and accountability. `;
        
        if (institution) {
          summary += `The ${institution} appears to be involved in the proceedings. `;
        }
        
        summary += `${article.title} - This ongoing story highlights critical issues in government transparency. Please visit the source for comprehensive coverage and latest updates on this developing corruption case.`;
        
        console.log(`Using enhanced title-based summary due to short content (${contentLength} chars)`);
      } else {
        // Generate AI summary only (location already processed)
        summary = await summarizeWithGemini(article.content);
      }
      
      enhancedArticles.push({
        id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        content: article.content,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
        summary,
        imageUrl: article.imageUrl,
        geoLocation
      });
      
      // Shorter delay to improve user experience
      await new Promise(resolve => setTimeout(resolve, 100));
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
        summary: 'Summary temporarily unavailable - please visit source for full details.',
        imageUrl: article.imageUrl,
        geoLocation: undefined
      });
    }
  }
  
  console.log(`Successfully processed ${enhancedArticles.length} articles`);
  return enhancedArticles;
}
