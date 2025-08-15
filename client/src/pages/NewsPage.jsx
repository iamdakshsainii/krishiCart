/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNews,
  fetchTrendingNews,
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  bookmarkArticle,
  removeBookmark,
  markAsRead
} from "../redux/slices/newsSlice";
import { Search, Filter, Grid, List, Star, Heart, TrendingUp, Calendar, Clock, Globe, ChevronDown, X, SortAsc, BarChart3, Bookmark, Volume2, Share2, RefreshCw, ExternalLink, Play, Pause, Eye } from "lucide-react";

const CATEGORIES = [
  { key: "agriculture", label: "Agriculture", icon: Globe, color: "from-green-500 to-emerald-500" },
  { key: "weather", label: "Weather", icon: Calendar, color: "from-blue-500 to-cyan-500" },
  { key: "market", label: "Market", icon: TrendingUp, color: "from-orange-500 to-red-500" },
  { key: "technology", label: "Technology", icon: BarChart3, color: "from-purple-500 to-pink-500" },
  { key: "government", label: "Government", icon: Grid, color: "from-indigo-500 to-blue-500" },
];

const SORT_OPTIONS = [
  { key: "publishedAt", label: "Latest First", icon: Clock },
  { key: "popularity", label: "Most Popular", icon: TrendingUp },
  { key: "relevancy", label: "Most Relevant", icon: BarChart3 }
];

// Enhanced News Card Component
function EnhancedNewsCard({ article, viewMode, onBookmark, isBookmarked }) {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef(null);

  const getCategoryColor = (category) => {
    const categoryData = CATEGORIES.find(c => c.key === category?.toLowerCase());
    return categoryData?.color || "from-gray-500 to-gray-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Unknown date';
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return 2;
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const speak = (text) => {
    try {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleReadMore = () => {
    // Mark article as read
    dispatch(markAsRead(article.url));
    // Open actual article URL
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } else {
        await navigator.clipboard.writeText(article.url);
        // You could add a toast notification here
      }
    } catch (error) {
      console.log('Sharing failed', error);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      dispatch(removeBookmark(article.url));
    } else {
      dispatch(bookmarkArticle(article));
    }
    onBookmark?.();
  };

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const readTime = calculateReadTime(article.description || article.content);
  const imageUrl = article.urlToImage || article.image || `https://picsum.photos/400/300?random=${article.url}`;

  if (viewMode === 'list') {
    return (
      <div className="group flex gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50">
        <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(article.category)} ${!imageLoaded ? 'animate-pulse' : ''}`}>
            <img
              src={imageUrl}
              alt={article.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = `https://picsum.photos/400/300?random=${Math.random()}`;
                setImageLoaded(true);
              }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded-lg bg-gradient-to-r ${getCategoryColor(article.category)} text-white font-medium`}>
              {article.source?.name || 'News'}
            </span>
            <span className="text-gray-500">{formatDate(article.publishedAt)}</span>
            <span className="text-gray-500">{readTime} min</span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
            {article.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {article.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart size={14} className={liked ? 'fill-current' : ''} />
                <span className="text-xs">Like</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${isBookmarked ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:text-blue-500'}`}
              >
                <Star size={14} className={isBookmarked ? 'fill-current' : ''} />
                <span className="text-xs">Save</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-500 hover:text-blue-500 transition-all"
              >
                <Share2 size={14} />
                <span className="text-xs">Share</span>
              </button>
            </div>

            <button
              onClick={handleReadMore}
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-medium hover:scale-105 transition-transform"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer border border-gray-200/50 dark:border-gray-700/50 hover:border-transparent hover:-translate-y-3 hover:scale-[1.02] transform-gpu">

      {/* Trending indicator for recent articles */}
      {new Date() - new Date(article.publishedAt) < 24 * 60 * 60 * 1000 && (
        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
            <TrendingUp size={10} className="text-white" />
            <span className="text-xs font-bold text-white">NEW</span>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className={`w-full h-56 bg-gradient-to-br ${getCategoryColor(article.category)} ${!imageLoaded ? 'animate-pulse' : ''}`}>
          <img
            src={imageUrl}
            alt={article.title}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = `https://picsum.photos/400/300?random=${Math.random()}`;
              setImageLoaded(true);
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-bold bg-gradient-to-r ${getCategoryColor(article.category)} text-white shadow-lg backdrop-blur-sm border border-white/20`}>
            {article.source?.name || 'News'}
          </span>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg text-white text-xs">
            <Clock size={10} />
            {readTime} min read
          </div>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-xs">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
            <Eye size={10} />
            {Math.floor(Math.random() * 1000) + 100}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
            <Calendar size={10} />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <button
            className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            title="Share article"
          >
            <Share2 size={14} className="text-gray-700" />
          </button>
          <button
            className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              speak(`${article.title}. ${article.description}`);
            }}
            title={isPlaying ? "Stop reading" : "Read aloud"}
          >
            {isPlaying ? (
              <Pause size={14} className="text-blue-600" />
            ) : (
              <Play size={14} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      <div className="relative p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
          {article.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                liked ? "bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 text-red-500" : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart size={16} className={liked ? 'fill-current scale-110' : ''} />
              <span className="text-xs font-medium">Like</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isBookmarked ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-500" : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-500"
              }`}
            >
              <Star size={16} className={isBookmarked ? 'fill-current scale-110' : ''} />
              <span className="text-xs font-medium">Save</span>
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleReadMore(); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Read More
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function EpicNewsPage() {
  const dispatch = useDispatch();
  const {
    articles,
    trendingNews,
    loading,
    error,
    currentPage,
    totalPages,
    searchTerm,
    selectedCategory,
    bookmarkedArticles
  } = useSelector(state => state.news);

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [showSaved, setShowSaved] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load initial data
  useEffect(() => {
    dispatch(fetchNews({
      category: selectedCategory,
      page: 1,
      searchTerm: searchTerm
    }));
    dispatch(fetchTrendingNews());
  }, [dispatch, selectedCategory, searchTerm, refreshKey]);

  // Infinite scroll setup
  const sentinelRef = useRef(null);
  const onIntersect = useCallback((entries) => {
    if (entries[0].isIntersecting && !loading && currentPage < totalPages && !showSaved) {
      dispatch(fetchNews({
        category: selectedCategory,
        page: currentPage + 1,
        searchTerm: searchTerm
      }));
    }
  }, [loading, currentPage, totalPages, dispatch, selectedCategory, searchTerm, showSaved]);

  useEffect(() => {
    const obs = new IntersectionObserver(onIntersect, { rootMargin: "200px" });
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [onIntersect]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
    dispatch(setCurrentPage(1));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm.trim()));
    dispatch(setCurrentPage(1));
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const displayArticles = showSaved ? bookmarkedArticles : articles;

  // Filter articles by date range
  const filteredArticles = displayArticles.filter(article => {
    if (dateRange === 'all') return true;

    const articleDate = new Date(article.publishedAt);
    const now = new Date();
    const daysAgo = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 0;

    if (daysAgo > 0) {
      const cutoffDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      return articleDate >= cutoffDate;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Epic Header */}
      <header className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                KrishiCart News
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Real-time agricultural news and insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSaved(!showSaved)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  showSaved
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <Star size={20} className={showSaved ? 'fill-current' : ''} />
                {showSaved ? `Saved (${bookmarkedArticles.length})` : 'Saved Articles'}
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105"
                title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>

              <button
                onClick={handleRefresh}
                className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:scale-105"
                title="Refresh news"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search for agricultural news, market updates, weather reports..."
              className="w-full pl-12 pr-32 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 text-lg transition-all duration-300"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  showAdvancedFilter ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.key;
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <Icon size={18} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilter && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Filters</h3>
              <button
                onClick={() => setShowAdvancedFilter(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">{filteredArticles.length}</span> articles
            {searchTerm && (
              <span> for "<span className="font-medium text-blue-600">{searchTerm}</span>"</span>
            )}
            {showSaved && <span className="text-blue-600 font-medium"> (Saved)</span>}
          </div>

          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>Showing {viewMode} view</span>
            {loading && <RefreshCw size={16} className="animate-spin" />}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <div className="text-red-800 dark:text-red-200 font-medium">Error loading news</div>
            <div className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</div>
          </div>
        )}
      </div>

      {/* Articles Grid/List */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'}`}>
          {filteredArticles.map((article, index) => (
            <EnhancedNewsCard
              key={`${article.url}-${index}`}
              article={article}
              viewMode={viewMode}
              isBookmarked={bookmarkedArticles.some(a => a.url === article.url)}
              onBookmark={() => {}} // Refresh handled by Redux
            />
          ))}
        </div>

        {/* Loading & Infinite Scroll */}
        <div ref={sentinelRef} className="h-12 flex items-center justify-center mt-8">
          {loading && (
            <div className="flex items-center gap-2">
              <RefreshCw size={20} className="animate-spin text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">Loading more articles...</span>
            </div>
          )}
          {!loading && currentPage >= totalPages && !showSaved && articles.length > 0 && (
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">You're all caught up!</div>
              <div className="text-gray-500 text-sm">Check back later for more news</div>
            </div>
          )}
        </div>

        {/* Empty States */}
        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mb-4">
              {showSaved ? (
                <Star size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              ) : (
                <Globe size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <div className="text-gray-400 text-xl mb-2">
              {showSaved ? 'No saved articles yet' : error ? 'Unable to load news' : 'No articles found'}
            </div>
            <div className="text-gray-500 text-sm mb-4">
              {showSaved
                ? 'Start saving articles by clicking the star button'
                : error
                ? 'Please check your internet connection and try again'
                : 'Try adjusting your filters or search terms'
              }
            </div>
            {!showSaved && (
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium hover:scale-105 transition-all duration-300"
              >
                Refresh News
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          onClick={handleRefresh}
          className={`p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-110 transition-all duration-300 ${loading ? 'animate-pulse' : ''}`}
          title="Refresh news"
        >
          <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}
