import { NewsArticle, RSSItem, NewsSource } from '../types/news';
import { summarizeWithGemini } from '../lib/gemini';

// Trusted Philippine news sources with backup feeds - focused on government/politics sections
const TRUSTED_SOURCES: NewsSource[] = [
  { 
    name: 'Rappler', 
    domain: 'rappler.com', 
    feeds: [
      'https://www.rappler.com/nation/rss/', // Government and politics focus
      'https://www.rappler.com/rss/' // General but filters corruption
    ]
  },
  { 
    name: 'Philippine Daily Inquirer', 
    domain: 'inquirer.net', 
    feeds: [
      'https://newsinfo.inquirer.net/category/latest-stories/feed',
      'https://newsinfo.inquirer.net/feed'
    ]
  },
  { 
    name: 'Philippine Star', 
    domain: 'philstar.com', 
    feeds: [
      'https://www.philstar.com/rss/nation', // Nation/politics focus
      'https://www.philstar.com/rss/headlines'
    ]
  },
  { 
    name: 'Manila Bulletin', 
    domain: 'mb.com.ph', 
    feeds: [
      'https://mb.com.ph/feed/'
    ]
  },
  { 
    name: 'GMA News Online', 
    domain: 'gmanetwork.com', 
    feeds: [
      'https://www.gmanetwork.com/news/rss/news',
      'https://www.gmanetwork.com/news/rss/topstories'
    ]
  },
  { 
    name: 'ABS-CBN News', 
    domain: 'abs-cbn.com', 
    feeds: [
      'https://news.abs-cbn.com/rss/nation',
      'https://news.abs-cbn.com/rss/latest'
    ]
  },
  { 
    name: 'The Manila Times', 
    domain: 'manilatimes.net', 
    feeds: [
      'https://www.manilatimes.net/feed'
    ]
  },
  { 
    name: 'Interaksyon', 
    domain: 'interaksyon.philstar.com', 
    feeds: [
      'https://interaksyon.philstar.com/feed'
    ]
  },
  { 
    name: 'SunStar', 
    domain: 'sunstar.com.ph', 
    feeds: [
      'https://www.sunstar.com.ph/rss'
    ]
  },
  { 
    name: 'PTV News', 
    domain: 'ptvnews.ph', 
    feeds: [
      'https://ptvnews.ph/feed'
    ]
  },
  { 
    name: 'Bombo Radyo', 
    domain: 'bomboradyo.com', 
    feeds: [
      'https://www.bomboradyo.com/feed'
    ]
  },
  { 
    name: 'DZRH News', 
    domain: 'dzrhnews.com.ph', 
    feeds: [
      'https://dzrhnews.com.ph/feed'
    ]
  },
  { 
    name: 'One News / News5', 
    domain: 'onenews.ph', 
    feeds: [
      'https://www.onenews.ph/rss'
    ]
  },
  { 
    name: 'Newswatch Plus', 
    domain: 'newswatchplus.com', 
    feeds: [
      'https://newswatchplus.com/feed'
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
    publishedAt: new Date().toISOString(),
    imageUrl: "https://example.com/images/senate.jpg"
  },
  {
    title: "Ombudsman files multiple graft charges against former city mayor for ghost employees scheme",
    content: "The Office of the Ombudsman has filed graft and corruption charges against a former city mayor and several municipal employees for allegedly maintaining ghost employees on the city payroll. The scheme, which ran for three years, resulted in the misappropriation of over 50 million pesos in public funds. Ombudsman Samuel Martires said the case involves violations of the Anti-Graft and Corrupt Practices Act and malversation of public funds.",
    url: "https://example.com/ombudsman-ghost-employees",
    source: "Ombudsman Office",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: "https://example.com/images/ombudsman.jpg"
  },
  {
    title: "COA flags 2.3 billion pesos in irregular expenditures across multiple government agencies",
    content: "The Commission on Audit has flagged irregular financial transactions amounting to 2.3 billion pesos across various government agencies in its latest annual report. The audit findings include procurement violations, lack of supporting documents, and questionable disbursements. COA Chairperson Michael Aguinaldo emphasized the need for stricter compliance with procurement rules and proper documentation of government expenditures.",
    url: "https://example.com/coa-irregular-expenditures",
    source: "COA Reports",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: "https://example.com/images/coa.jpg"
  },
  {
    title: "Sandiganbayan convicts former provincial governor of plunder in fertilizer fund scam",
    content: "The Sandiganbayan has convicted a former provincial governor of plunder in connection with the misuse of fertilizer funds intended for farmers. The anti-graft court found the defendant guilty of diverting 200 million pesos meant for agricultural support programs to personal accounts and fictitious projects. The case is part of the larger fertilizer fund scam that implicated several local government officials nationwide.",
    url: "https://example.com/sandiganbayan-fertilizer-scam",
    source: "Sandiganbayan",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    imageUrl: "https://example.com/images/sandiganbayan.jpg"
  },
  {
    title: "Anti-corruption drive intensifies as President orders lifestyle checks on all government officials",
    content: "President Ferdinand Marcos Jr. has ordered comprehensive lifestyle checks on all government officials as part of his administration's intensified anti-corruption campaign. The directive requires officials to submit updated Statements of Assets, Liabilities and Net Worth (SALN) and undergo scrutiny of their lifestyle and expenditures. The Civil Service Commission will coordinate with the Ombudsman to implement the directive across all government agencies.",
    url: "https://example.com/lifestyle-checks-directive",
    source: "Presidential Communications Office",
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    imageUrl: "https://example.com/images/pco.jpg"
  }
];

// Core corruption-related keywords (must contain at least one)
const CORE_CORRUPTION_KEYWORDS = [
  'corruption', 'graft', 'plunder', 'bribery', 'kickback', 'malversation',
  'embezzlement', 'fraud', 'scam', 'anomalous', 'irregularities',
  'misappropriation', 'diversion of funds', 'ghost employees', 'ghost projects',
  'overpricing', 'overpriced', 'bidding irregularities', 'procurement violation',
  'misuse of funds', 'ill-gotten', 'unexplained wealth', 'undeclared assets',
  'money laundering', 'tax evasion', 'customs corruption', 'smuggling',
  'abuse of power', 'nepotism', 'patronage', 'electoral fraud', 'vote buying'
];

// Government/judicial corruption institutions (high relevance when present)
const CORRUPTION_INSTITUTIONS = [
  'Sandiganbayan', 'Ombudsman', 'COA', 'Commission on Audit',
  'SALN', 'pork barrel', 'DAP', 'PDAF', 'Blue Ribbon Committee',
  'shell companies', 'dummy corporations', 'fake receipts', 'ghost deliveries'
];

// Keywords that indicate NON-corruption news (immediate exclusion)
const NON_CORRUPTION_KEYWORDS = [
  'weather', 'typhoon', 'storm', 'rain', 'flood', 'earthquake', 'tsunami', 'volcanic',
  'sports', 'basketball', 'football', 'volleyball', 'olympics', 'games', 'tournament',
  'entertainment', 'celebrity', 'movie', 'film', 'music', 'concert', 'show', 'artist',
  'health', 'vaccine', 'medicine', 'hospital', 'doctor', 'covid', 'virus', 'disease',
  'technology', 'gadget', 'smartphone', 'computer', 'internet', 'app', 'software',
  'travel', 'tourism', 'hotel', 'restaurant', 'food', 'recipe', 'cooking',
  'education', 'school', 'university', 'graduation', 'student', 'exam', 'scholarship',
  'accident', 'fire', 'rescue', 'emergency', 'disaster relief', 'collision', 'crash',
  'anniversary', 'celebration', 'festival', 'holiday', 'birthday', 'wedding',
  'business launch', 'product launch', 'opening ceremony', 'grand opening',
  'traffic', 'road construction', 'infrastructure project', 'bridge opening',
  'cultural', 'heritage', 'museum', 'art', 'fashion', 'beauty'
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
  const enhancedArticles: NewsArticle[] = [];
  
  for (const article of topArticles) {
    try {
      console.log(`Processing article: ${article.title.substring(0, 50)}...`);
      
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
        // Generate AI summary for articles with sufficient content
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
        imageUrl: article.imageUrl
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
        summary: 'Summary temporarily unavailable - please visit source for full details.',
        imageUrl: article.imageUrl
      });
    }
  }
  
  console.log(`Successfully processed ${enhancedArticles.length} articles`);
  return enhancedArticles;
}
