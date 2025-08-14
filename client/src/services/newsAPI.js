import axios from 'axios';
import { handleApiError, cleanArticleData } from '../utils/newsUtils';

// API Configuration - Direct environment variable access
const API_CONFIG = {
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
      NEWS: '/news'
    }
  }
};

// Search keywords for different categories
const SEARCH_KEYWORDS = {
  agriculture: [
    'agriculture farming crops harvest',
    'farming techniques agricultural news',
    'crop prices market agriculture',
    'irrigation farming technology',
    'organic farming sustainable agriculture'
  ],
  weather: [
    'weather forecast farming',
    'climate agriculture impact',
    'rainfall farming season',
    'weather patterns agriculture',
    'drought flood farming'
  ],
  market: [
    'agricultural market prices',
    'crop commodity prices',
    'farming market trends',
    'agricultural exports imports',
    'food grain market'
  ],
  technology: [
    'agricultural technology agritech',
    'farming technology innovations',
    'precision agriculture technology',
    'agricultural machinery equipment',
    'smart farming IoT agriculture'
  ],
  government: [
    'agricultural policy government',
    'farming subsidies schemes',
    'government agriculture programs',
    'agricultural laws policies',
    'farming assistance government'
  ],
  general: [
    'agriculture news farming',
    'agricultural developments',
    'farming industry news'
  ]
};

// Cache configuration
const CACHE_CONFIG = {
  NEWS_TTL: 10 * 60 * 1000, // 10 minutes
  TRENDING_TTL: 15 * 60 * 1000, // 15 minutes
  SEARCH_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100
};

// Cache implementation
class NewsCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data, ttl = CACHE_CONFIG.NEWS_TTL) {
    const expiryTime = Date.now() + ttl;
    this.cache.set(key, { data, expiryTime });

    // Clean old entries if cache is too large
    if (this.cache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiryTime) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new NewsCache();

// API client configuration with better error handling
const createApiClient = (baseURL, defaultParams = {}, timeout = 15000) => {
  const client = axios.create({
    baseURL,
    timeout,
    params: defaultParams,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'KrishiCart-News-App/1.0'
    }
  });

  // Add response interceptor for better error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  );

  return client;
};

class NewsService {
  constructor() {
    // Initialize API clients only if keys are available
    this.initializeClients();
  }

  initializeClients() {
    // NewsAPI client
    if (API_CONFIG.NEWS_API.KEY) {
      this.newsApiClient = createApiClient(API_CONFIG.NEWS_API.BASE_URL, {
        apiKey: API_CONFIG.NEWS_API.KEY
      });
    }

    // GNews client
    if (API_CONFIG.GNEWS_API.KEY) {
      this.gNewsClient = createApiClient(API_CONFIG.GNEWS_API.BASE_URL, {
        token: API_CONFIG.GNEWS_API.KEY
      });
    }

    // NewsData client
    if (API_CONFIG.NEWSDATA_API.KEY) {
      this.newsDataClient = createApiClient(API_CONFIG.NEWSDATA_API.BASE_URL, {
        apikey: API_CONFIG.NEWSDATA_API.KEY
      });
    }

    // Log available APIs
    console.log('Available APIs:', {
      NewsAPI: !!this.newsApiClient,
      GNews: !!this.gNewsClient,
      NewsData: !!this.newsDataClient
    });
  }

  // Get news from multiple sources with fallback
  async getNews({ category = 'agriculture', page = 1, pageSize = 20, searchTerm = '' } = {}) {
    const cacheKey = `news_${category}_${page}_${pageSize}_${searchTerm}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data for:', cacheKey);
      return cachedData;
    }

    const errors = [];
    let result = { articles: [], totalResults: 0, source: 'none' };

    // Try different APIs in order of preference
    const apiAttempts = [
      { name: 'GNews', method: () => this.getNewsFromGNews({ category, page, pageSize, searchTerm }) },
      { name: 'NewsData', method: () => this.getNewsFromNewsData({ category, page, pageSize, searchTerm }) },
      { name: 'NewsAPI', method: () => this.getNewsFromNewsAPI({ category, page, pageSize, searchTerm }) }
    ];

    for (const api of apiAttempts) {
      try {
        console.log(`Attempting to fetch news from ${api.name}...`);
        result = await api.method();

        if (result.articles && result.articles.length > 0) {
          console.log(`Successfully fetched ${result.articles.length} articles from ${api.name}`);
          break;
        }
      } catch (error) {
        console.error(`${api.name} failed:`, error.message);
        errors.push(`${api.name}: ${error.message}`);
        continue;
      }
    }

    // If no articles found, try with fallback mock data
    if (!result.articles || result.articles.length === 0) {
      console.log('No articles found from APIs, using fallback data');
      result = this.getFallbackNews(category);
    }

    // Clean and validate articles
    if (result.articles) {
      result.articles = result.articles
        .map(cleanArticleData)
        .filter(article => article !== null);
    }

    // Cache the result
    cache.set(cacheKey, result);

    // If we had errors but got some results, log them
    if (errors.length > 0 && result.articles.length > 0) {
      console.warn('Some API calls failed:', errors);
    }

    // If all APIs failed
    if (errors.length === apiAttempts.length && result.articles.length === 0) {
      throw new Error(`All news APIs failed: ${errors.join(', ')}`);
    }

    return result;
  }

  // NewsAPI implementation with better error handling
  async getNewsFromNewsAPI({ category, page, pageSize, searchTerm }) {
    if (!this.newsApiClient) {
      throw new Error('NewsAPI key not configured');
    }

    try {
      const keywords = searchTerm || this.getCategoryKeywords(category);
      const params = {
        q: keywords,
        language: 'en',
        sortBy: 'publishedAt',
        page,
        pageSize: Math.min(pageSize, 100), // NewsAPI limit
        domains: 'timesofindia.indiatimes.com,indianexpress.com,thehindu.com,business-standard.com'
      };

      console.log('NewsAPI request params:', params);
      const response = await this.newsApiClient.get(API_CONFIG.NEWS_API.ENDPOINTS.EVERYTHING, { params });

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'NewsAPI returned an error');
      }

      return {
        articles: response.data.articles || [],
        totalResults: response.data.totalResults || 0,
        source: 'NewsAPI'
      };
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('NewsAPI rate limit exceeded. Please try again later.');
      }
      if (error.response?.status === 403) {
        throw new Error('NewsAPI access forbidden. Please check your API key.');
      }
      throw new Error(`NewsAPI error: ${error.message}`);
    }
  }

  // GNews implementation
  async getNewsFromGNews({ category, page, pageSize, searchTerm }) {
    if (!this.gNewsClient) {
      throw new Error('GNews API key not configured');
    }

    try {
      const keywords = searchTerm || this.getCategoryKeywords(category);
      const params = {
        q: keywords,
        lang: 'en',
        country: 'in',
        max: Math.min(pageSize, 10), // GNews limit
        page,
        sortby: 'publishdate'
      };

      console.log('GNews request params:', params);
      const response = await this.gNewsClient.get(API_CONFIG.GNEWS_API.ENDPOINTS.SEARCH, { params });

      return {
        articles: response.data.articles || [],
        totalResults: response.data.totalArticles || 0,
        source: 'GNews'
      };
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('GNews rate limit exceeded. Please try again later.');
      }
      if (error.response?.status === 403) {
        throw new Error('GNews access forbidden. Please check your API key.');
      }
      throw new Error(`GNews error: ${error.message}`);
    }
  }

  // NewsData implementation
  async getNewsFromNewsData({ category, page, pageSize, searchTerm }) {
    if (!this.newsDataClient) {
      throw new Error('NewsData API key not configured');
    }

    try {
      const keywords = searchTerm || this.getCategoryKeywords(category);
      const params = {
        q: keywords,
        language: 'en',
        country: 'in',
        category: this.mapCategoryToNewsData(category),
        size: Math.min(pageSize, 10), // NewsData limit
        page
      };

      console.log('NewsData request params:', params);
      const response = await this.newsDataClient.get(API_CONFIG.NEWSDATA_API.ENDPOINTS.NEWS, { params });

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'NewsData returned an error');
      }

      // Transform NewsData format to match standard format
      const articles = (response.data.results || []).map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: { name: article.source_id },
        author: article.creator?.[0] || null
      }));

      return {
        articles,
        totalResults: response.data.totalResults || 0,
        source: 'NewsData'
      };
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('NewsData rate limit exceeded. Please try again later.');
      }
      if (error.response?.status === 403) {
        throw new Error('NewsData access forbidden. Please check your API key.');
      }
      throw new Error(`NewsData error: ${error.message}`);
    }
  }

  // Fallback news data when APIs fail
  getFallbackNews(category = 'agriculture') {
    const fallbackArticles = {
      agriculture: [
        {
          title: 'Indian Agriculture: Latest Trends and Developments',
          description: 'Stay updated with the latest developments in Indian agriculture, including crop prices, farming techniques, and government policies.',
          url: 'https://krishicart.com/agriculture-trends',
          urlToImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=200&fit=crop',
          publishedAt: new Date().toISOString(),
          source: { name: 'KrishiCart News' },
          author: 'KrishiCart Team'
        },
        {
          title: 'Weather Updates for Farmers',
          description: 'Important weather forecasts and seasonal updates for agricultural planning and crop management.',
          url: 'https://krishicart.com/weather-updates',
          urlToImage: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'KrishiCart Weather' },
          author: 'Weather Team'
        },
        {
          title: 'Agricultural Technology Innovations',
          description: 'Discover the latest agricultural technologies and innovations that are transforming modern farming.',
          url: 'https://krishicart.com/agri-tech',
          urlToImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'KrishiCart Tech' },
          author: 'Tech Team'
        }
      ]
    };

    return {
      articles: fallbackArticles[category] || fallbackArticles.agriculture,
      totalResults: 3,
      source: 'Fallback'
    };
  }

  // Get trending news
  async getTrendingNews(limit = 10) {
    const cacheKey = `trending_${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const result = await this.getNews({
        searchTerm: 'agriculture trending farming',
        pageSize: limit,
        category: 'trending'
      });

      cache.set(cacheKey, result, CACHE_CONFIG.TRENDING_TTL);
      return result;
    } catch (error) {
      console.error('Error fetching trending news:', error);
      return this.getFallbackNews('agriculture');
    }
  }

  // Search news with advanced filtering
  async searchNews({ query, category, page = 1, pageSize = 20, sortBy = 'publishedAt', fromDate, toDate } = {}) {
    const cacheKey = `search_${query}_${category}_${page}_${pageSize}_${sortBy}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      // Combine search query with category keywords if category is specified
      let searchTerm = query;
      if (category && category !== 'general') {
        const categoryKeywords = this.getCategoryKeywords(category);
        searchTerm = `${query} ${categoryKeywords}`;
      }

      const result = await this.getNews({
        searchTerm,
        page,
        pageSize,
        category
      });

      // Additional filtering by date if specified
      if (result.articles && (fromDate || toDate)) {
        result.articles = result.articles.filter(article => {
          const articleDate = new Date(article.publishedAt);
          if (fromDate && articleDate < new Date(fromDate)) return false;
          if (toDate && articleDate > new Date(toDate)) return false;
          return true;
        });
        result.totalResults = result.articles.length;
      }

      cache.set(cacheKey, result, CACHE_CONFIG.SEARCH_TTL);
      return result;

    } catch (error) {
      console.error('Error searching news:', error);
      throw new Error(handleApiError(error));
    }
  }

  // Helper methods
  getCategoryKeywords(category) {
    const keywords = SEARCH_KEYWORDS[category] || SEARCH_KEYWORDS.agriculture;
    return keywords[Math.floor(Math.random() * keywords.length)];
  }

  mapCategoryToNewsData(category) {
    const mapping = {
      agriculture: 'other',
      weather: 'environment',
      market: 'business',
      technology: 'technology',
      government: 'politics',
      general: 'other'
    };
    return mapping[category] || 'other';
  }

  // Health check for APIs
  async checkApiHealth() {
    const results = {
      newsapi: false,
      gnews: false,
      newsdata: false,
      errors: {}
    };

    // Check NewsAPI
    if (this.newsApiClient) {
      try {
        await this.newsApiClient.get('/sources', { params: { pageSize: 1 } });
        results.newsapi = true;
      } catch (error) {
        results.errors.newsapi = error.message;
        console.error('NewsAPI health check failed:', error.message);
      }
    }

    // Check GNews
    if (this.gNewsClient) {
      try {
        await this.gNewsClient.get('/search', { params: { q: 'test', max: 1 } });
        results.gnews = true;
      } catch (error) {
        results.errors.gnews = error.message;
        console.error('GNews health check failed:', error.message);
      }
    }

    // Check NewsData
    if (this.newsDataClient) {
      try {
        await this.newsDataClient.get('/news', { params: { q: 'test', size: 1 } });
        results.newsdata = true;
      } catch (error) {
        results.errors.newsdata = error.message;
        console.error('NewsData health check failed:', error.message);
      }
    }

    return results;
  }

  // Clear cache
  clearCache() {
    cache.clear();
  }

  // Get API configuration status
  getApiStatus() {
    return {
      newsapi: {
        configured: !!API_CONFIG.NEWS_API.KEY,
        client: !!this.newsApiClient
      },
      gnews: {
        configured: !!API_CONFIG.GNEWS_API.KEY,
        client: !!this.gNewsClient
      },
      newsdata: {
        configured: !!API_CONFIG.NEWSDATA_API.KEY,
        client: !!this.newsDataClient
      }
    };
  }
}

// Create singleton instance
export const newsService = new NewsService();

// Export class for testing
export { NewsService };

export default newsService;
