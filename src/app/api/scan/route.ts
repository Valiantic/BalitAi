import { NextRequest, NextResponse } from 'next/server';
import { fetchPhilippineCorruptionNews } from '../../services/newsService';
import { ScanRequest, ScanResponse } from '../../types/news';

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    
    const {
      query = 'Philippines corruption',
      sources = [
        'rappler.com',
        'inquirer.net',
        'abs-cbn.com',
        'gma.com',
        'philstar.com',
        'manila-times.net',
        'sunstar.com.ph'
      ],
      limit = 10
    } = body;
    
    const articles = await fetchPhilippineCorruptionNews(query, sources, limit);
    
    const response: ScanResponse = {
      articles,
      scanId: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      query
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('News scan error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scan news',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method to scan for news' },
    { status: 405 }
  );
}
