// API Configuration
export const API_CONFIG = {
  NEWS_API: {
    BASE_URL: 'https://newsapi.org/v2',
    KEY: import.meta.env.VITE_NEWSAPI_KEY,
    ENDPOINTS: {
      EVERYTHING: '/everything',
      TOP_HEADLINES: '/top-headlines',
      SOURCES: '/sources'
    }
  },
  GNEWS_API: {
    BASE_URL: 'https://gnews.io/api/v4',
    KEY: import.meta.env.VITE_GNEWS_KEY,
    ENDPOINTS: {
      SEARCH: '/search',
      TOP_HEADLINES: '/top-headlines'
    }
  },
  NEWSDATA_API: {
    BASE_URL: 'https://newsdata.io/api/1',
    KEY: import.meta.env.VITE_NEWSDATA_KEY,
    ENDPOINTS: {
      NEWS: '/news',
      LATEST: '/latest_news'
    }
  }
};

// News Categories Configuration
export const NEWS_CATEGORIES = [
  {
    id: 'trending',
    label: 'Trending',
    description: 'Most popular and trending agriculture news right now',
    icon: 'star',
    badge: 'Hot',
    keywords: ['agriculture', 'farming', 'crops', 'livestock', 'rural', 'harvest'],
    color: 'pink'
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    description: 'Latest updates on farming, crops, and agricultural practices',
    icon: 'wheat',
    keywords: ['agriculture', 'farming', 'crops', 'harvest', 'seeds', 'soil', 'irrigation', 'organic'],
    color: 'green'
  },
  {
    id: 'weather',
    label: 'Weather & Climate',
    description: 'Weather forecasts, climate change impact on farming',
    icon: 'cloud-rain',
    keywords: ['weather', 'climate', 'rainfall', 'drought', 'temperature', 'seasonal', 'monsoon'],
    color: 'blue'
  },
  {
    id: 'market',
    label: 'Market & Prices',
    description: 'Agricultural market trends, crop prices, and economic updates',
    icon: 'trending-up',
    keywords: ['market', 'price', 'economy', 'trade', 'export', 'import', 'commodity', 'mandi'],
    color: 'yellow'
  },
  {
    id: 'technology',
    label: 'AgriTech',
    description: 'Latest agricultural technology, innovations, and digital farming',
    icon: 'cpu',
    keywords: ['technology', 'innovation', 'digital', 'smart farming', 'IoT', 'AI', 'automation', 'precision'],
    color: 'purple'
  },
  {
    id: 'government',
    label: 'Policies & Schemes',
    description: 'Government policies, schemes, and subsidies for farmers',
    icon: 'building-2',
    keywords: ['government', 'policy', 'scheme', 'subsidy', 'loan', 'support', 'regulation', 'MSP'],
    color: 'red'
  }
];

// Search Keywords for Different Categories
export const SEARCH_KEYWORDS = {
  agriculture: [
    'agriculture farming',
    'crop production',
    'sustainable farming',
    'organic agriculture',
    'agricultural innovation',
    'farm technology',
    'agricultural research',
    'food security'
  ],
  weather: [
    'agricultural weather',
    'farming climate',
    'crop weather forecast',
    'agricultural drought',
    'farming rainfall',
    'climate change agriculture',
    'seasonal farming',
    'weather impact crops'
  ],
  market: [
    'agricultural market',
    'crop prices',
    'commodity trading',
    'agricultural economy',
    'farm income',
    'agricultural export',
    'food price inflation',
    'agricultural commodity'
  ],
  technology: [
    'agricultural technology',
    'smart farming',
    'precision agriculture',
    'farming innovation',
    'agricultural AI',
    'farm automation',
    'digital agriculture',
    'agritech startups'
  ],
  government: [
    'agricultural policy',
    'farming scheme',
    'agricultural subsidy',
    'farmer welfare',
    'agricultural law',
    'farming support',
    'agricultural budget',
    'rural development'
  ]
};

// News Sources Configuration
export const NEWS_SOURCES = {
  PREFERRED: [
    'agricultural-magazine',
    'farming-today',
    'rural-news',
    'the-hindu',
    'indian-express',
    'times-of-india',
    'economic-times',
    'business-standard'
  ],
  INTERNATIONAL: [
    'bbc-news',
    'reuters',
    'associated-press',
    'bloomberg',
    'financial-times',
    'wall-street-journal'
  ],
  AGRICULTURE_FOCUSED: [
    'successful-farming',
    'farm-journal',
    'agriculture-com',
    'farmers-weekly',
    'progressive-farmer'
  ]
};

// Language and Region Settings
export const LOCALE_CONFIG = {
  LANGUAGE: 'en',
  COUNTRY: 'in',
  REGION: 'IN',
  CURRENCY: 'INR',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: '12h'
};

// Pagination and Limits
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  TRENDING_LIMIT: 10,
  RELATED_ARTICLES_LIMIT: 6,
  SEARCH_RESULTS_LIMIT: 50
};

// Cache Configuration
export const CACHE_CONFIG = {
  NEWS_TTL: 15 * 60 * 1000, // 15 minutes
  TRENDING_TTL: 30 * 60 * 1000, // 30 minutes
  SEARCH_TTL: 10 * 60 * 1000, // 10 minutes
  MAX_CACHE_SIZE: 100
};

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  SCROLL_THRESHOLD: 100
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection and try again.',
  API_KEY_MISSING: 'API configuration error. Please contact support.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again in a few minutes.',
  NO_RESULTS_FOUND: 'No news articles found for your search.',
  ARTICLE_NOT_FOUND: 'The requested article could not be found.',
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
  INVALID_SEARCH: 'Please enter a valid search term.',
  BOOKMARK_ERROR: 'Failed to save bookmark. Please try again.',
  SHARE_ERROR: 'Sharing failed. Please try copying the link manually.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ARTICLE_BOOKMARKED: 'Article bookmarked successfully!',
  BOOKMARK_REMOVED: 'Bookmark removed successfully!',
  ARTICLE_SHARED: 'Article shared successfully!',
  NEWSLETTER_SUBSCRIBED: 'Successfully subscribed to newsletter!',
  PREFERENCES_SAVED: 'Preferences saved successfully!'
};

// Feature Flags
export const FEATURES = {
  TRENDING_NEWS: true,
  BOOKMARKS: true,
  READING_HISTORY: true,
  SHARING: true,
  NEWSLETTER: true,
  NOTIFICATIONS: false,
  DARK_MODE: false,
  OFFLINE_READING: false,
  PREMIUM_CONTENT: false
};

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    SECONDARY: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155'
    },
    SUCCESS: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    },
    WARNING: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    },
    ERROR: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c'
    }
  },
  FONTS: {
    SANS: ['Inter', 'system-ui', 'sans-serif'],
    SERIF: ['Merriweather', 'serif'],
    MONO: ['JetBrains Mono', 'monospace']
  },
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
};

// Date and Time Formats
export const DATE_FORMATS = {
  SHORT: 'MMM DD',
  MEDIUM: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm'
};

// Social Media Configuration
export const SOCIAL_MEDIA = {
  TWITTER: {
    HANDLE: '@KrishiCart',
    URL: 'https://twitter.com/krishicart'
  },
  FACEBOOK: {
    PAGE: 'KrishiCart',
    URL: 'https://facebook.com/krishicart'
  },
  INSTAGRAM: {
    HANDLE: '@krishicart',
    URL: 'https://instagram.com/krishicart'
  },
  LINKEDIN: {
    PAGE: 'KrishiCart',
    URL: 'https://linkedin.com/company/krishicart'
  }
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  NEWS_VIEWED: 'news_article_viewed',
  NEWS_CLICKED: 'news_article_clicked',
  NEWS_SHARED: 'news_article_shared',
  NEWS_BOOKMARKED: 'news_article_bookmarked',
  SEARCH_PERFORMED: 'news_search_performed',
  CATEGORY_CHANGED: 'news_category_changed',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed'
};

// Default Values
export const DEFAULTS = {
  CATEGORY: 'agriculture',
  PAGE_SIZE: 20,
  SORT_BY: 'publishedAt',
  SORT_ORDER: 'desc',
  LANGUAGE: 'en',
  COUNTRY: 'in'
};

export default {
  API_CONFIG,
  NEWS_CATEGORIES,
  SEARCH_KEYWORDS,
  NEWS_SOURCES,
  LOCALE_CONFIG,
  PAGINATION,
  CACHE_CONFIG,
  UI_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  THEME,
  DATE_FORMATS,
  SOCIAL_MEDIA,
  ANALYTICS_EVENTS,
  DEFAULTS
};
