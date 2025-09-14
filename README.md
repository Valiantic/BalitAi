# BalitAI - Philippine Corruption News Agent

BalitAI is an AI-powered news scanning application that monitors trusted Philippine news sources for corruption-related content. It uses Google's Gemini AI to analyze and summarize news articles about corruption, graft, and other irregularities in the Philippines.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to analyze and summarize news content
- 📰 **Multiple News Sources**: Scans trusted Philippine news outlets including Rappler, Inquirer, Philippine Star, and more
- 📍 **Corruption Map Tracker**: Locates corruption related news based on analyze articles from verified sources
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Loading**: Shows progress with animated loading modal and video
- 🔍 **Smart Filtering**: AI determines relevance and confidence scores for articles

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API key

## How It Works

1. **Click "AI News Scan"**: Initiates the news scanning process
2. **RSS Feed Parsing**: Fetches latest articles from multiple trusted Philippine news sources
3. **AI Content Analysis**: Uses Gemini AI to filter corruption-related content
4. **Content Summarization**: Generates concise summaries for relevant articles
5. **Results Display**: Shows filtered articles with AI-generated summaries