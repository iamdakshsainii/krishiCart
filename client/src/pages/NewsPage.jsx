/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNews,
  fetchTrendingNews,
  setCurrentPage,
  clearError,
  selectNews,
  selectArticles,
  selectTrendingNews,
  selectNewsLoading,
  selectNewsError
} from '../redux/slices/newsSlice';
import {
  AlertCircle,
  Newspaper,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUp,
  Wifi,
  WifiOff,
  Bell,
  BellOff
} from 'lucide-react';
import NewsCard, { NewsCardSkeleton } from '../components/NewsCard';
import NewsSearch from '../components/NewsSearch';
import NewsCategories from '../components/NewsCategories';
import NewsModal from '../components/NewsModel';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const newsState = useSelector(selectNews);
  const articles = useSelector(selectArticles);
  const trendingNews = useSelector(selectTrendingNews);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);

  const {
    currentPage,
    totalPages,
    totalResults,
    selectedCategory,
    searchTerm
  } = newsState;

  // Local state
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Initialize component
  useEffect(() => {
    // Fetch initial news
    if (articles.length === 0) {
      dispatch(fetchNews({ category: selectedCategory, page: 1 }));
    }

    // Fetch trending news
    if (trendingNews.length === 0) {
      dispatch(fetchTrendingNews());
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle article click
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      dispatch(setCurrentPage(newPage));
      dispatch(fetchNews({
        category: selectedCategory,
        page: newPage,
        searchTerm
      }));

      // Scroll to top of news section
      document.getElementById('news-grid')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchNews({
      category: selectedCategory,
      page: currentPage,
      searchTerm
    }));
    dispatch(fetchTrendingNews());
  };

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      } else if (Notification.permission === 'granted') {
        setNotificationsEnabled(!notificationsEnabled);
      }
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Page Title & Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Newspaper className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Agriculture News</h1>
                  <p className="text-gray-600 mt-1">
                    Stay updated with the latest farming and agriculture insights
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                {/* Online Status */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isOnline
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                  {isOnline ? 'Online' : 'Offline'}
                </div>

                {/* Notifications Toggle */}
                <button
                  onClick={handleNotificationToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    notificationsEnabled
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
                >
                  {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                </button>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh news"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Search Component */}
            <NewsSearch />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Filter */}
        <NewsCategories />

        {/* Trending News Section */}
        {trendingNews.length > 0 && !searchTerm && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingNews.slice(0, 4).map((article, index) => (
                <NewsCard
                  key={`trending-${index}`}
                  article={article}
                  onReadMore={handleArticleClick}
                  compact={true}
                  category={selectedCategory}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main News Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest News'}
              </h2>
              {totalResults > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {totalResults.toLocaleString()} articles
                </span>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Something went wrong</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* News Grid */}
          <div id="news-grid" className="news-grid">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }, (_, index) => (
                <NewsCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : articles.length > 0 ? (
              // News articles
              articles.map((article, index) => (
                <NewsCard
                  key={`article-${index}`}
                  article={article}
                  onReadMore={handleArticleClick}
                  category={selectedCategory}
                />
              ))
            ) : (
              // Empty state
              <div className="col-span-full">
                <div className="empty-state py-12">
                  <div className="empty-icon mx-auto mb-4">
                    <Newspaper size={80} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchTerm ? 'No articles found' : 'No news available'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm
                      ? 'Try adjusting your search terms or browse different categories.'
                      : 'Check back later for the latest agriculture news and updates.'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => {
                        dispatch(setSearchTerm(''));
                        dispatch(fetchNews({ category: selectedCategory, page: 1 }));
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Browse All News
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && articles.length > 0 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="pagination-button flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {getPaginationNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={typeof page !== 'number'}
                className={`pagination-button ${
                  page === currentPage ? 'active' : ''
                } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="pagination-button flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* News Modal */}
      <NewsModal
        article={selectedArticle}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          title="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Newsletter Section */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="newsletter-container text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Agriculture News</h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Get the latest farming news, weather updates, and market insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input flex-1"
              />
              <button className="newsletter-button">
                Subscribe Now
              </button>
            </div>
            <p className="text-sm opacity-75 mt-3">
              No spam. Unsubscribe anytime. Your privacy is important to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
