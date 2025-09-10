
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function summarizeWithGemini(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Analyze this Philippine news article and provide a concise 3-sentence summary focusing on:
      1. The main corruption allegations or findings
      2. Key people or institutions involved
      3. Current status or implications
      
      Article content:
      ${content}
      
      Summary:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'No summary available';
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    return 'Summary not available due to processing error';
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
