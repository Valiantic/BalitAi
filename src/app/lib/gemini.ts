import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback summarization when Gemini API fails
function createFallbackSummary(title: string, content: string): string {
  try {
    // Corruption-related keywords for context
    const corruptionKeywords = [
      'corruption', 'graft', 'bribery', 'plunder', 'embezzlement', 'fraud',
      'illegal', 'irregularities', 'misuse', 'kickback', 'scandal', 'investigate',
      'charges', 'accused', 'scam', 'stolen', 'fraudulent', 'abuse', 'violations'
    ];

    // Extract key information
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const titleWords = title.toLowerCase();
    
    // Find sentences with corruption keywords
    const relevantSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return corruptionKeywords.some(keyword => lowerSentence.includes(keyword));
    }).slice(0, 3); // Take top 3 relevant sentences

    // Extract amounts/numbers mentioned
    const amountMatches = content.match(/(?:₱|PHP|peso|million|billion|thousand)[\s\d,.]*/gi);
    const amounts = amountMatches ? amountMatches.slice(0, 2) : [];

    // Extract names/officials mentioned
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?\b/g;
    const potentialNames = content.match(namePattern)?.slice(0, 3) || [];

    // Build summary
    let summary = '';
    
    if (relevantSentences.length > 0) {
      summary = relevantSentences.join('. ').substring(0, 400);
    } else {
      // Fallback to first few sentences
      summary = sentences.slice(0, 2).join('. ').substring(0, 300);
    }

    // Add context about amounts if found
    if (amounts.length > 0) {
      summary += ` The case involves ${amounts.join(' and ')}.`;
    }

    // Add investigation/action context
    const actionKeywords = ['investigate', 'charge', 'file', 'suspend', 'arrest', 'probe'];
    const hasAction = actionKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    if (hasAction) {
      summary += ' Authorities are taking action on this matter.';
    } else {
      summary += ' This case highlights ongoing concerns about corruption in Philippine institutions.';
    }

    // Ensure minimum length and clean up
    if (summary.length < 100) {
      summary = `This corruption-related news involves ${title.toLowerCase()}. ${summary} The case is part of ongoing efforts to address transparency and accountability issues in the Philippines.`;
    }

    return summary.trim();

  } catch (error) {
    console.error('Error in fallback summarization:', error);
    return `This article reports on corruption-related developments in the Philippines. The case involves ${title}. Further details are available in the source article. This represents ongoing efforts to address accountability and transparency in Philippine institutions.`;
  }
}

export async function summarizeWithGemini(content: string, title: string = ''): Promise<string> {
  try {
    // Check if content is too short or empty
    if (!content || content.trim().length < 30) {
      return 'Limited article content available. Please visit the source link for complete details about this corruption-related news.';
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are a Philippine corruption news analyst. Create a comprehensive 4-5 sentence summary of this corruption news article.
      
      Focus on providing detailed information about:
      1. What specific type of corruption or irregularity is alleged/discovered
      2. Who are the key officials, agencies, or individuals involved
      3. What amounts of money or resources are involved (if mentioned)
      4. What actions are being taken (investigations, charges, etc.)
      5. Current status and potential implications
      
      Even if the content is brief, expand on the corruption context and provide insightful analysis. 
      Create a substantial summary that gives readers a clear understanding of the corruption issue.
      
      Article content:
      ${content}
      
      Provide a detailed, informative summary (4-5 sentences):
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text() || 'Summary could not be generated.';
    
    // Check if the AI is asking for more content (common response pattern)
    if (summary.toLowerCase().includes('provide the') || 
        summary.toLowerCase().includes('need the text') ||
        summary.toLowerCase().includes('i need') ||
        summary.toLowerCase().includes('please provide')) {
      return `Limited content available from source. This appears to be corruption-related news involving: ${content.substring(0, 150)}... Please visit the source link for complete details.`;
    }
    
    // Ensure minimum summary length
    if (summary.length < 100) {
      return `${summary} This corruption case highlights ongoing issues with government transparency and accountability in the Philippines. Further developments are expected as investigations continue.`;
    }
    
    return summary;
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    
    // Use fallback summarization when Gemini fails
    console.log('Falling back to local summarization...');
    return createFallbackSummary(title, content);
  }
}

export async function analyzeNewsRelevance(title: string, content: string): Promise<{
  isRelevant: boolean;
  confidence: number;
  keywords: string[];
  category: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Analyze this Philippine news article for corruption-related content.
      
      Title: ${title}
      Content: ${content.substring(0, 1000)}
      
      Provide a JSON response with:
      {
        "isRelevant": boolean (true if corruption-related),
        "confidence": number (0-100),
        "keywords": ["list", "of", "relevant", "keywords"],
        "category": "string (e.g., 'graft', 'bribery', 'plunder', 'irregularities', 'other')"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      // Fallback if JSON parsing fails
      return {
        isRelevant: true,
        confidence: 50,
        keywords: ['corruption'],
        category: 'other'
      };
    }
  } catch (error) {
    console.error('Error analyzing news relevance:', error);
    return {
      isRelevant: true,
      confidence: 50,
      keywords: ['corruption'],
      category: 'other'
    };
  }
}