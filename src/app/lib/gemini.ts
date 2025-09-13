import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function summarizeWithGemini(content: string): Promise<string> {
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
    return 'Detailed summary temporarily unavailable. This article covers important corruption-related developments in the Philippines. Please visit the source link for complete information.';
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