import React from 'react';
import Image from 'next/image';
import { NewsArticle } from '../types/news';
import { ExternalLink, Calendar, Building2, Sparkles } from 'lucide-react';
import { useAOS } from '../hooks/useAOS';
import Logo from '../../../public/images/logo.png';

interface NewsResultsProps { 
  articles: NewsArticle[];
  onNewScan?: () => void;
}

const NewsResults: React.FC<NewsResultsProps> = ({ articles, onNewScan }) => {
  useAOS();

  if (articles.length === 0) {
    return (
      // No results found message
      <section className="w-full py-12">
        <div className="bg-white border border-yellow-500 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
            <p className="text-gray-300 mb-6">
              No corruption-related news articles were found in the latest scan.
            </p>
            {onNewScan && (
              <button
                onClick={onNewScan}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                Try Another Scan
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-100 border border-yellow-500 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className='flex items-center'>
              <h2 className="text-2xl font-bold text-blue-500 mb-2">
                Corruption AI News Scan Results
              </h2>
              <Sparkles className="inline-block ml-2 mb-2 text-yellow-500" />
              </div>
              <div className="text-sm font-leading text-blue-500">
                Found {articles.length} corruption-related articles
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {articles.map((article, index) => (
              <div
                key={article.id}          
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-gray-800 transition-all duration-300 ease-in-out hover:scale-[1.02] border border-gray-700 rounded-lg p-6 hover:border-yellow-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white leading-tight flex-1 mr-4">
                    {article.title}
                  </h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>

                {/* Add this after the title div and before the metadata div */}
                {article.imageUrl && (
                  <div className="mb-4 relative">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-68 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span className="font-medium">{article.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {article.summary && (
                  <div className="mb-4">
                    <div className='flex items-center'>
                    <Image
                      src={Logo}
                      alt="BalitAI Logo"
                      width={40}
                      height={40}
                      className="mb-4"
                    />
                      <h4 className="text-yellow-500 font-semibold mb-2">AI Summary</h4>
                      <Sparkles className="inline-block ml-2 mb-2 text-sm text-yellow-500" />
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {article.summary}
                    </p>
                  </div>
                )}

                {article.content && (
                  <div>
                    <h4 className="text-gray-400 font-semibold mb-2">Content Preview:</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {article.content.substring(0, 300)}
                      {article.content.length > 300 && '...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsResults;
