import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ExternalLink, Clock, User, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { bookmarkArticle, removeBookmark, markAsRead, selectBookmarkedArticles } from '../redux/slices/newsSlice';
import { formatDate, getTimeAgo, shareArticle } from '../utils/newsUtils';

const NewsModal = ({ article, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const bookmarkedArticles = useSelector(selectBookmarkedArticles);

  const isBookmarked = bookmarkedArticles.some(a => a.url === article?.url);

  useEffect(() => {
    if (isOpen && article) {
      dispatch(markAsRead(article.url));
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, article, dispatch]);

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(article.url));
    } else {
      dispatch(bookmarkArticle(article));
    }
  };

  const handleShare = async () => {
    const shared = await shareArticle(article);
    if (!shared) {
      // Fallback to copying link
      navigator.clipboard.writeText(article.url);
      alert('Link copied to clipboard!');
    }
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">News Details</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>

            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Share article"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Article Image */}
          {article.urlToImage && (
            <div className="mb-6">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            {article.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{article.author}</span>
              </div>
            )}

            {article.source?.name && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {article.source.name}
              </div>
            )}

            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{getTimeAgo(article.publishedAt)}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            )}
          </div>

          {/* Article Description */}
          {article.description && (
            <div className="mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {article.description}
              </p>
            </div>
          )}

          {/* Article Content */}
          {article.content && (
            <div className="mb-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {article.content.replace(/\[\+\d+ chars\]$/, '...')}
                </p>
              </div>
            </div>
          )}

          {/* Read Full Article Button */}
          <div className="flex justify-center pt-6 border-t border-gray-200">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={18} />
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
