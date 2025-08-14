import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock,
  User,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  Eye,
  Calendar,
  TrendingUp,
  Wheat
} from 'lucide-react';
import {
  bookmarkArticle,
  removeBookmark,
  markAsRead,
  selectBookmarkedArticles,
  selectReadArticles
} from '../redux/slices/newsSlice';
import {
  formatDate,
  getTimeAgo,
  truncateText,
  shareArticle,
  getCategoryColor,
  estimateReadingTime,
  isValidImageUrl,
  getImagePlaceholder
} from '../utils/newsUtils';

const NewsCard = ({
  article,
  onReadMore,
  showBookmark = true,
  showShare = true,
  compact = false,
  showCategory = true,
  category = 'agriculture'
}) => {
  const dispatch = useDispatch();
  const bookmarkedArticles = useSelector(selectBookmarkedArticles);
  const readArticles = useSelector(selectReadArticles);

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isBookmarked = bookmarkedArticles.some(a => a.url === article.url);
  const isRead = readArticles.includes(article.url);
  const readingTime = estimateReadingTime(article.content || article.description);

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      dispatch(removeBookmark(article.url));
    } else {
      dispatch(bookmarkArticle(article));
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shared = await shareArticle(article);
    if (!shared) {
      // Fallback to copying link
      try {
        await navigator.clipboard.writeText(article.url);
        // You might want to show a toast notification here
        console.log('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleCardClick = () => {
    dispatch(markAsRead(article.url));
    if (onReadMore) {
      onReadMore(article);
    }
  };

  const handleExternalLink = (e) => {
    e.stopPropagation();
    dispatch(markAsRead(article.url));
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const getDisplayImage = () => {
    if (imageError || !isValidImageUrl(article.urlToImage)) {
      return getImagePlaceholder(category);
    }
    return article.urlToImage;
  };

  if (compact) {
    return (
      <div
        className="news-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 p-4"
        onClick={handleCardClick}
      >
        <div className="flex gap-4">
          {/* Compact Image */}
          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={getDisplayImage()}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="news-title text-sm font-semibold line-clamp-2 mb-1">
                {article.title}
              </h3>

              {showBookmark && (
                <button
                  onClick={handleBookmark}
                  className={`bookmark-button p-1 rounded-md transition-colors flex-shrink-0 ${
                    isBookmarked
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Clock size={12} />
              <span>{getTimeAgo(article.publishedAt)}</span>
              {readingTime > 0 && (
                <>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`news-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden ${
        isRead ? 'opacity-90' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="news-card-image relative aspect-video overflow-hidden bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Wheat className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <img
          src={getDisplayImage()}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {showCategory && (
            <span className={`news-category-pill category-${category}`}>
              {category}
            </span>
          )}

          {isRead && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
              <Eye size={12} />
              Read
            </span>
          )}
        </div>

        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {showShare && (
            <button
              onClick={handleShare}
              className="share-button p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
              title="Share article"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          )}

          <button
            onClick={handleExternalLink}
            className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
            title="Read on source"
          >
            <ExternalLink size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Reading progress indicator */}
        {isRead && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Article Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {article.source?.name && (
              <span className="source-badge">
                {article.source.name}
              </span>
            )}

            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>

          {/* Bookmark button */}
          {showBookmark && (
            <button
              onClick={handleBookmark}
              className={`bookmark-button p-2 rounded-lg transition-all duration-200 ${
                isBookmarked
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          )}
        </div>

        {/* Article Title */}
        <h2 className="news-title text-xl font-bold mb-3 line-clamp-2 leading-tight">
          {article.title}
        </h2>

        {/* Article Description */}
        {article.description && (
          <p className="news-description text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {truncateText(article.description, 150)}
          </p>
        )}

        {/* Article Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {article.author && (
              <div className="flex items-center gap-1">
                <User size={14} />
                <span className="truncate max-w-[150px]">{article.author}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{getTimeAgo(article.publishedAt)}</span>
            </div>

            {readingTime > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp size={14} />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Read more button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Read More
          </button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
    </article>
  );
};

// Loading skeleton component
export const NewsCardSkeleton = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg news-skeleton"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded news-skeleton mb-2"></div>
            <div className="h-4 bg-gray-200 rounded news-skeleton w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded news-skeleton w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="aspect-video bg-gray-200 news-skeleton"></div>
      <div className="p-6">
        <div className="flex justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded news-skeleton w-24"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg news-skeleton"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded news-skeleton mb-2"></div>
        <div className="h-6 bg-gray-200 rounded news-skeleton w-4/5 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded news-skeleton mb-2"></div>
        <div className="h-4 bg-gray-200 rounded news-skeleton w-3/4 mb-4"></div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded news-skeleton w-32"></div>
          <div className="h-8 bg-gray-200 rounded-lg news-skeleton w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
