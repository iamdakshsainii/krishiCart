/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  User,
  Bookmark,
  BookmarkCheck,
  Share2,
  Eye,
  Calendar
} from 'lucide-react';
import { bookmarkArticle, removeBookmark, markAsRead, selectBookmarkedArticles, fetchNews } from '../../redux/slices/newsSlice';
import { formatDate, getTimeAgo, shareArticle } from '../../utils/newsUtils';
import NewsCard from '../../components/NewsCard';

const NewsDetailPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { articles } = useSelector(state => state.news);
  const bookmarkedArticles = useSelector(selectBookmarkedArticles);

  const isBookmarked = article && bookmarkedArticles.some(a => a.url === article.url);

  useEffect(() => {
    // Find article from URL parameters or existing articles
    const foundArticle = articles.find(a =>
      encodeURIComponent(a.title).replace(/%20/g, '-').toLowerCase() === articleId ||
      a.url.includes(articleId)
    );

    if (foundArticle) {
      setArticle(foundArticle);
      dispatch(markAsRead(foundArticle.url));

      // Fetch related articles
      const related = articles
        .filter(a => a.url !== foundArticle.url)
        .slice(0, 6);
      setRelatedArticles(related);
    }

    setLoading(false);
  }, [articleId, articles, dispatch]);

  const handleBookmark = () => {
    if (!article) return;

    if (isBookmarked) {
      dispatch(removeBookmark(article.url));
    } else {
      dispatch(bookmarkArticle(article));
    }
  };

  const handleShare = async () => {
    if (!article) return;

    const shared = await shareArticle(article);
    if (!shared) {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/news')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              >
                {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>

              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Share article"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Article Image */}
              {article.urlToImage && (
                <div className="aspect-video">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-8">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  {article.source?.name && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {article.source.name}
                    </div>
                  )}

                  {article.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  )}

                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{article.author}</span>
                    </div>
                  )}
                </div>

                {/* Article Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Article Description */}
                {article.description && (
                  <div className="mb-6">
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                )}

                {/* Article Content */}
                {article.content && (
                  <div className="mb-8">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {article.content.replace(/\[\+\d+ chars\]$/, '...')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Read Full Article */}
                <div className="border-t border-gray-200 pt-6">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink size={18} />
                    Read Full Article on {article.source?.name || 'Source'}
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Article Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Article Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium">{getTimeAgo(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Source</span>
                    <span className="font-medium">{article.source?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.slice(0, 3).map((relatedArticle, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          {relatedArticle.urlToImage && (
                            <img
                              src={relatedArticle.urlToImage}
                              alt={relatedArticle.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {getTimeAgo(relatedArticle.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/news')}
                      className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View All News →
                    </button>
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Stay Updated</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get the latest agriculture news delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Related Articles */}
        {relatedArticles.length > 3 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">More Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(3).map((relatedArticle, index) => (
                <NewsCard
                  key={index}
                  article={relatedArticle}
                  onReadMore={() => {
                    const encodedTitle = encodeURIComponent(relatedArticle.title)
                      .replace(/%20/g, '-')
                      .toLowerCase();
                    navigate(`/news/${encodedTitle}`);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetailPage;
