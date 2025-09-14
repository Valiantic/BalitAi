import { NewsSource } from "../types/news";

// Trusted Philippine news sources with backup feeds - focused on government/politics sections
export const TRUSTED_SOURCES: NewsSource[] = [
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