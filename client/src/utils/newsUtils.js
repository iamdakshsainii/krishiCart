// Date formatting utilities
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown time';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid time';

  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;

  return formatDate(dateString);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown time';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Text processing utilities
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const extractKeywords = (title, description = '') => {
  const text = `${title} ${description}`.toLowerCase();
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cant', 'wont', 'dont', 'doesnt', 'didnt', 'hasnt', 'havent', 'hadnt', 'isnt', 'arent', 'wasnt', 'werent'];

  const words = text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 5);

  return words;
};

export const extractTextPreview = (htmlContent, maxLength = 200) => {
  if (!htmlContent) return '';

  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');

  // Remove extra whitespace
  const cleanText = textContent.replace(/\s+/g, ' ').trim();

  return truncateText(cleanText, maxLength);
};

export const cleanUrl = (url) => {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    return url;
  }
};

// Category utilities
export const getCategoryColor = (category) => {
  const colors = {
    agriculture: 'bg-green-100 text-green-700',
    weather: 'bg-blue-100 text-blue-700',
    market: 'bg-yellow-100 text-yellow-700',
    technology: 'bg-purple-100 text-purple-700',
    government: 'bg-red-100 text-red-700',
    general: 'bg-gray-100 text-gray-700',
    trending: 'bg-pink-100 text-pink-700'
  };

  return colors[category] || colors.general;
};

export const getCategoryIcon = (category) => {
  const icons = {
    agriculture: '🌾',
    weather: '🌤️',
    market: '📈',
    technology: '💻',
    government: '🏛️',
    general: '📰',
    trending: '⭐'
  };

  return icons[category] || icons.general;
};

export const getCategoryGradient = (category) => {
  const gradients = {
    agriculture: 'from-green-400 to-green-600',
    weather: 'from-blue-400 to-blue-600',
    market: 'from-yellow-400 to-orange-600',
    technology: 'from-purple-400 to-purple-600',
    government: 'from-red-400 to-red-600',
    general: 'from-gray-400 to-gray-600',
    trending: 'from-pink-400 to-pink-600'
  };

  return gradients[category] || gradients.general;
};

// Image utilities
export const getImagePlaceholder = (category = 'general') => {
  const placeholders = {
    agriculture: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=200&fit=crop&crop=center',
    weather: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop&crop=center',
    market: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center',
    technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center',
    government: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=200&fit=crop&crop=center',
    general: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop&crop=center'
  };

  return placeholders[category] || placeholders.general;
};

export const isValidImageUrl = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url) || url.includes('unsplash') || url.includes('images');
  } catch {
    return false;
  }
};

export const optimizeImageUrl = (imageUrl, width = 400, height = 250) => {
  if (!imageUrl) return null;

  // For Unsplash images, add optimization parameters
  if (imageUrl.includes('unsplash.com')) {
    return `${imageUrl}&w=${width}&h=${height}&fit=crop&crop=center`;
  }

  // For other images, return original URL
  return imageUrl;
};

// Search utilities
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

export const filterArticlesBySearchTerm = (articles, searchTerm) => {
  if (!searchTerm) return articles;

  const term = searchTerm.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(term) ||
    (article.description && article.description.toLowerCase().includes(term)) ||
    (article.content && article.content.toLowerCase().includes(term)) ||
    (article.source?.name && article.source.name.toLowerCase().includes(term))
  );
};

export const buildSearchQuery = (searchTerm, category, additionalKeywords = []) => {
  let query = searchTerm || '';

  // Add category-specific keywords
  const categoryKeywords = {
    agriculture: ['farming', 'crops', 'agricultural', 'harvest'],
    weather: ['weather', 'climate', 'rainfall', 'temperature'],
    market: ['market', 'price', 'trading', 'commodity'],
    technology: ['agritech', 'technology', 'innovation', 'digital'],
    government: ['government', 'policy', 'scheme', 'subsidy']
  };

  if (category && categoryKeywords[category]) {
    const keywords = categoryKeywords[category].concat(additionalKeywords);
    if (!query) {
      query = keywords[0]; // Use primary keyword if no search term
    } else {
      // Add related keywords to improve search relevance
      query += ` OR ${keywords.slice(0, 2).join(' OR ')}`;
    }
  }

  return query;
};

export const filterArticlesByRelevance = (articles, searchTerm, category) => {
  if (!articles || articles.length === 0) return [];

  const relevantKeywords = {
    agriculture: ['farm', 'crop', 'harvest', 'agriculture', 'farming', 'agricultural'],
    weather: ['weather', 'climate', 'rain', 'temperature', 'forecast'],
    market: ['market', 'price', 'cost', 'trading', 'commodity', 'export'],
    technology: ['technology', 'tech', 'digital', 'innovation', 'AI', 'IoT'],
    government: ['government', 'policy', 'scheme', 'subsidy', 'minister']
  };

  return articles.filter(article => {
    const content = `${article.title} ${article.description}`.toLowerCase();

    // Check search term relevance
    if (searchTerm && !content.includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Check category relevance
    if (category && relevantKeywords[category]) {
      const hasRelevantKeyword = relevantKeywords[category].some(keyword =>
        content.includes(keyword)
      );
      if (!hasRelevantKeyword) return false;
    }

    return true;
  });
};

// Debounce function for search optimization
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Sharing utilities
export const shareArticle = async (article) => {
  if (!article) return false;

  const shareData = {
    title: article.title,
    text: article.description || 'Check out this news article from KrishiCart',
    url: window.location.href
  };

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }

  // Fallback to copying URL to clipboard
  try {
    await navigator.clipboard.writeText(article.url);
    return { success: true, method: 'clipboard' };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return { success: false, error: 'Failed to share article' };
  }
};

export const generateSocialShareUrls = (article) => {
  const encodedTitle = encodeURIComponent(article.title);
  const encodedUrl = encodeURIComponent(article.url);
  const encodedDescription = encodeURIComponent(article.description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Article utilities
export const generateArticleId = (article) => {
  if (!article) return '';

  // Create a more robust ID
  const titleHash = article.title ? article.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';
  const urlHash = article.url ? btoa(article.url).slice(0, 10) : '';
  const timestamp = Date.now().toString().slice(-6);

  return `${titleHash}_${urlHash}_${timestamp}`;
};

export const isArticleRead = (articleUrl, readArticles = []) => {
  return readArticles.includes(articleUrl);
};

export const isArticleBookmarked = (article, bookmarkedArticles = []) => {
  return bookmarkedArticles.some(bookmarked =>
    bookmarked.url === article.url ||
    bookmarked.title === article.title
  );
};

export const markArticleAsRead = (articleUrl) => {
  const readArticles = getFromLocalStorage('readArticles', []);
  if (!readArticles.includes(articleUrl)) {
    readArticles.push(articleUrl);
    saveToLocalStorage('readArticles', readArticles);
  }
};

export const addToBookmarks = (article) => {
  const bookmarks = getFromLocalStorage('bookmarkedArticles', []);
  const exists = bookmarks.some(bookmark => bookmark.url === article.url);

  if (!exists) {
    bookmarks.push({
      ...article,
      bookmarkedAt: new Date().toISOString()
    });
    saveToLocalStorage('bookmarkedArticles', bookmarks);
    return true;
  }
  return false;
};

export const removeFromBookmarks = (articleUrl) => {
  const bookmarks = getFromLocalStorage('bookmarkedArticles', []);
  const filteredBookmarks = bookmarks.filter(bookmark => bookmark.url !== articleUrl);
  saveToLocalStorage('bookmarkedArticles', filteredBookmarks);
  return true;
};

// Reading time estimation
export const estimateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return 0;

  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
};

export const getReadingTimeText = (content) => {
  const minutes = estimateReadingTime(content);
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};

// URL utilities
export const buildArticleUrl = (article) => {
  if (!article) return '#';

  const articleId = generateArticleId(article);
  return `/news/${articleId}`;
};

export const isExternalUrl = (url) => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export const getSourceDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown Source';
  }
};

// Data validation utilities
export const validateArticle = (article) => {
  if (!article || typeof article !== 'object') return false;

  const requiredFields = ['title', 'url'];
  return requiredFields.every(field => article[field] && article[field].trim().length > 0);
};

export const cleanArticleData = (article) => {
  if (!validateArticle(article)) return null;

  return {
    ...article,
    title: article.title?.trim() || '',
    description: article.description?.trim() || '',
    content: article.content?.trim() || '',
    author: article.author?.trim() || '',
    publishedAt: article.publishedAt || new Date().toISOString(),
    urlToImage: isValidImageUrl(article.urlToImage) ? article.urlToImage : null,
    source: {
      name: article.source?.name?.trim() || getSourceDomain(article.url),
      id: article.source?.id || null
    }
  };
};

export const sortArticles = (articles, sortBy = 'publishedAt') => {
  if (!articles || articles.length === 0) return [];

  return [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'publishedAt':
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'source':
        return (a.source?.name || '').localeCompare(b.source?.name || '');
      case 'relevancy':
        // For now, just return original order
        return 0;
      default:
        return 0;
    }
  });
};

// Network utilities
export const isOnline = () => {
  return navigator.onLine;
};

export const detectConnectionType = () => {
  if ('connection' in navigator) {
    return navigator.connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

// Error handling utilities
export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Invalid request. Please check your search terms.';
      case 401:
        return 'Unauthorized access. Please check API credentials.';
      case 403:
        return 'Forbidden access. API quota may be exceeded.';
      case 404:
        return 'News service not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${status}. Please try again.`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

export const logError = (error, context = '') => {
  console.error(`Error ${context}:`, error);

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
};

// Performance utilities
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

export const lazyLoadImage = (img, src) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = src;
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(img);
};

// Analytics utilities (for future implementation)
export const trackEvent = (eventName, properties = {}) => {
  // Placeholder for analytics tracking
  console.log('Event tracked:', eventName, properties);

  // In production, integrate with analytics services like:
  // Google Analytics, Mixpanel, Amplitude, etc.
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', { page: pageName });
};

export const trackSearchQuery = (query, category, resultsCount) => {
  trackEvent('search_performed', {
    query,
    category,
    results_count: resultsCount
  });
};

export const trackArticleClick = (article) => {
  trackEvent('article_clicked', {
    title: article.title,
    source: article.source?.name,
    category: article.category
  });
};

// Utility for generating unique IDs
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Color utilities for themes
export const getThemeColors = (theme = 'light') => {
  const themes = {
    light: {
      primary: '#3b82f6',
      secondary: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#34d399',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af'
    }
  };

  return themes[theme] || themes.light;
};
