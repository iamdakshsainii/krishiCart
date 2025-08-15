// services/newsAPI.js
const API_KEYS = {
  newsapi: import.meta.env.VITE_NEWSAPI_KEY,
  gnews: import.meta.env.VITE_GNEWS_KEY,
  newsdata: import.meta.env.VITE_NEWSDATAKEY
};

const API_ENDPOINTS = {
  newsapi: 'https://newsapi.org/v2',
  gnews: 'https://gnews.io/api/v4',
  newsdata: 'https://newsdata.io/api/1'
};

// console.log("GNEWS KEY:", import.meta.env.VITE_GNEWS_KEY);
// console.log("NEWSDATA KEY:", import.meta.env.VITE_NEWSDATA_KEY);

class NewsService {
  constructor() {
    this.currentApiIndex = 0;
    this.apiRotation = ['newsapi', 'gnews', 'newsdata'];
  }

  // Rotate between APIs for better coverage and fallback
  getNextApi() {
    const api = this.apiRotation[this.currentApiIndex];
    this.currentApiIndex = (this.currentApiIndex + 1) % this.apiRotation.length;
    return api;
  }

  // Format NewsAPI.org response
  formatNewsApiResponse(articles) {
    return articles.map(article => ({
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source,
      category: 'agriculture', // Default category
      author: article.author
    }));
  }

  // Format GNews response
  formatGNewsResponse(articles) {
    return articles.map(article => ({
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      source: { name: article.source.name },
      category: 'agriculture',
      author: article.source.name
    }));
  }

  // Format NewsData response
  formatNewsDataResponse(results) {
    return results.map(article => ({
      id: article.article_id || article.link,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.link,
      urlToImage: article.image_url,
      publishedAt: article.pubDate,
      source: { name: article.source_id },
      category: article.category?.[0] || 'agriculture',
      author: article.creator?.[0] || article.source_id
    }));
  }

  // Get news from NewsAPI.org
  async getNewsFromNewsApi({ category = 'agriculture', page = 1, searchTerm = '', pageSize = 20 }) {
    try {
      const params = new URLSearchParams({
        apiKey: API_KEYS.newsapi,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: 'publishedAt',
        language: 'en'
      });

      if (searchTerm) {
        params.append('q', `${searchTerm} agriculture farming`);
      } else {
        // Use specific agriculture-related queries for better results
        const agricultureQueries = [
          'agriculture farming crops',
          'agricultural technology farming',
          'crop prices market agriculture',
          'weather agriculture farming',
          'government policy agriculture'
        ];
        params.append('q', agricultureQueries[Math.floor(Math.random() * agricultureQueries.length)]);
      }

      const response = await fetch(`${API_ENDPOINTS.newsapi}/everything?${params}`);

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();

      return {
        articles: this.formatNewsApiResponse(data.articles || []),
        totalResults: data.totalResults || 0,
        source: 'newsapi'
      };
    } catch (error) {
      console.error('NewsAPI fetch error:', error);
      throw error;
    }
  }

  // Get news from GNews
  async getNewsFromGNews({ category = 'agriculture', page = 1, searchTerm = '', max = 20 }) {
    try {
      const params = new URLSearchParams({
        token: API_KEYS.gnews,
        lang: 'en',
        country: 'us',
        max: max.toString(),
        page: page.toString()
      });

      if (searchTerm) {
        params.append('q', `${searchTerm} agriculture farming`);
      } else {
        params.append('q', 'agriculture farming crops agricultural');
      }

      const response = await fetch(`${API_ENDPOINTS.gnews}/search?${params}`);

      if (!response.ok) {
        throw new Error(`GNews error: ${response.status}`);
      }

      const data = await response.json();

      return {
        articles: this.formatGNewsResponse(data.articles || []),
        totalResults: data.totalArticles || 0,
        source: 'gnews'
      };
    } catch (error) {
      console.error('GNews fetch error:', error);
      throw error;
    }
  }

  // Get news from NewsData.io
  async getNewsFromNewsData({ category = 'agriculture', page = 1, searchTerm = '', size = 20 }) {
    try {
      const params = new URLSearchParams({
        apikey: API_KEYS.newsdata,
        language: 'en',
        size: size.toString(),
        page: page.toString()
      });

      if (searchTerm) {
        params.append('q', searchTerm);
        params.append('qInMeta', 'agriculture,farming,crops');
      } else {
        params.append('category', 'environment,business');
        params.append('q', 'agriculture OR farming OR crops OR agricultural');
      }

      const response = await fetch(`${API_ENDPOINTS.newsdata}/news?${params}`);

      if (!response.ok) {
        throw new Error(`NewsData error: ${response.status}`);
      }

      const data = await response.json();

      return {
        articles: this.formatNewsDataResponse(data.results || []),
        totalResults: data.totalResults || 0,
        source: 'newsdata'
      };
    } catch (error) {
      console.error('NewsData fetch error:', error);
      throw error;
    }
  }

  // Main method to get news with fallback between APIs
  async getNews({ category = 'agriculture', page = 1, searchTerm = '' }) {
    const errors = [];

    // Try each API in rotation
    for (let attempt = 0; attempt < this.apiRotation.length; attempt++) {
      const apiName = this.getNextApi();

      try {
        console.log(`Attempting to fetch from ${apiName}...`);

        let result;
        switch (apiName) {
          case 'newsapi':
            result = await this.getNewsFromNewsApi({ category, page, searchTerm });
            break;
          case 'gnews':
            result = await this.getNewsFromGNews({ category, page, searchTerm });
            break;
          case 'newsdata':
            result = await this.getNewsFromNewsData({ category, page, searchTerm });
            break;
          default:
            throw new Error(`Unknown API: ${apiName}`);
        }

        if (result.articles && result.articles.length > 0) {
          console.log(`Successfully fetched ${result.articles.length} articles from ${apiName}`);
          return result;
        } else {
          throw new Error(`No articles returned from ${apiName}`);
        }
      } catch (error) {
        console.error(`${apiName} failed:`, error.message);
        errors.push({ api: apiName, error: error.message });
      }
    }

    // If all APIs failed, throw combined error
    throw new Error(`All APIs failed: ${errors.map(e => `${e.api}: ${e.error}`).join(', ')}`);
  }

  // Get trending news from multiple sources
  async getTrendingNews() {
    try {
      // Try to get trending from NewsAPI first
      const trendingQueries = [
        'agriculture breakthrough',
        'farming innovation',
        'crop yield record',
        'agricultural technology',
        'farming sustainability'
      ];

      const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];

      const result = await this.getNews({
        searchTerm: randomQuery,
        page: 1
      });

      return {
        articles: result.articles.slice(0, 10), // Get top 10 for trending
        source: result.source
      };
    } catch (error) {
      console.error('Failed to fetch trending news:', error);
      return { articles: [], source: 'none' };
    }
  }

  // Get news by specific category with enhanced queries
  async getNewsByCategory(category, limit = 10) {
    const categoryQueries = {
      agriculture: 'agriculture farming crops livestock',
      weather: 'weather climate agriculture farming',
      market: 'commodity prices agricultural market',
      technology: 'agricultural technology farming innovation',
      government: 'agricultural policy government farming'
    };

    try {
      const searchTerm = categoryQueries[category] || categoryQueries.agriculture;
      const result = await this.getNews({
        category,
        searchTerm,
        page: 1
      });

      return {
        articles: result.articles.slice(0, limit),
        source: result.source
      };
    } catch (error) {
      console.error(`Failed to fetch ${category} news:`, error);
      return { articles: [], source: 'none' };
    }
  }

  // Health check method to test all APIs
  async checkApiHealth() {
    const results = {};

    for (const apiName of this.apiRotation) {
      try {
        let result;
        switch (apiName) {
          case 'newsapi':
            result = await this.getNewsFromNewsApi({ searchTerm: 'test', pageSize: 1 });
            break;
          case 'gnews':
            result = await this.getNewsFromGNews({ searchTerm: 'test', max: 1 });
            break;
          case 'newsdata':
            result = await this.getNewsFromNewsData({ searchTerm: 'test', size: 1 });
            break;
        }
        results[apiName] = { status: 'healthy', articles: result.articles.length };
      } catch (error) {
        results[apiName] = { status: 'error', error: error.message };
      }
    }

    return results;
  }
}

export const newsService = new NewsService();

// Export individual API methods for direct use if needed
export const newsAPI = {
  getNews: (params) => newsService.getNews(params),
  getTrendingNews: () => newsService.getTrendingNews(),
  getNewsByCategory: (category, limit) => newsService.getNewsByCategory(category, limit),
  checkHealth: () => newsService.checkApiHealth()
};
