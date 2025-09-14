import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractLocationFromArticle } from './geolocation';
import { GeoLocation } from '../types/news';

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
      
      IMPORTANT: Return ONLY valid JSON, no markdown code blocks or extra text.
      
      Provide a JSON response with this exact format:
      {
        "isRelevant": true,
        "confidence": 85,
        "keywords": ["corruption", "bribery"],
        "category": "graft"
      }
      
      Categories: "graft", "bribery", "plunder", "irregularities", "other"
      Confidence: 0-100 (how sure you are this is corruption-related)
      
      RESPOND WITH ONLY THE JSON OBJECT, NO OTHER TEXT OR FORMATTING.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response text by removing markdown code blocks if present
      let cleanedText = text.trim();
      
      // Remove markdown code blocks (```json ... ``` or ``` ... ```)
      const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
      const match = cleanedText.match(codeBlockRegex);
      if (match) {
        cleanedText = match[1].trim();
      }
      
      // Also handle cases where there might be extra text before/after JSON
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing relevance JSON:', parseError);
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

// New function to extract both summary and location in one call
export async function enhanceArticleWithAI(
  title: string, 
  content: string
): Promise<{
  summary: string;
  geoLocation: GeoLocation | null;
}> {
  try {
    // Run both operations in parallel for better performance
    const [summary, geoLocation] = await Promise.all([
      summarizeWithGemini(content),
      extractLocationFromArticle(title, content)
    ]);

    return {
      summary,
      geoLocation
    };
  } catch (error) {
    console.error('Error enhancing article with AI:', error);
    return {
      summary: 'Summary temporarily unavailable - please visit source for full details.',
      geoLocation: null
    };
  }
}