# BalitAI - Philippine Corruption News Agent

BalitAI is an AI-powered news scanning application that monitors trusted Philippine news sources for corruption-related content. It uses Google's Gemini AI to analyze and summarize news articles about corruption, graft, and other irregularities in the Philippines.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to analyze and summarize news content
- 📰 **Multiple News Sources**: Scans trusted Philippine news outlets including Rappler, Inquirer, Philippine Star, and more
- 🎯 **Corruption Focus**: Specifically filters for corruption-related keywords and content
- �️ **Corruption Heatmap**: Interactive map visualization showing corruption density across the Philippines
- 📍 **Geolocation Extraction**: AI extracts location information from news articles for mapping
- �📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Loading**: Shows progress with animated loading modal and video
- 🔍 **Smart Filtering**: AI determines relevance and confidence scores for articles
- 🎛️ **Dual View Modes**: Switch between traditional article list and interactive heatmap

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API key
- No additional API keys needed! (Uses free OpenStreetMap + Leaflet.js)

## How It Works

1. **Click "AI News Scan"**: Initiates the news scanning process
2. **RSS Feed Parsing**: Fetches latest articles from multiple trusted Philippine news sources
3. **AI Content Analysis**: Uses Gemini AI to filter corruption-related content
4. **Location Extraction**: AI identifies and extracts Philippine locations from articles
5. **Content Summarization**: Generates concise summaries for relevant articles
6. **Results Display**: Shows filtered articles with AI-generated summaries
7. **Heatmap Visualization**: Displays corruption density on an interactive map

## Heatmap Features

- **Interactive Map**: Click on areas to see related corruption cases
- **Severity Weighting**: Color intensity indicates corruption severity level  
- **Location Markers**: High-severity cases show as red markers with detailed popups
- **Regional Coverage**: Covers all Philippine provinces and major cities
- **Real-time Updates**: Map updates as location data is extracted from articles
- **Free & Open Source**: Uses Leaflet.js + OpenStreetMap (no API costs!)

## API Setup

### Google Gemini AI API (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file as `GEMINI_API_KEY`

### Map Visualization (No Setup Required!)
The heatmap now uses **Leaflet.js** with **OpenStreetMap** - completely free with no API keys needed!