// News API service using your actual API keys
const API_KEYS = {
  newsapi: import.meta.env.VITE_NEWSAPI_KEY,
  gnews: import.meta.env.VITE_GNEWS_KEY,
  newsdata: import.meta.env.VITE_NEWSDATA_KEY
};

// Indian categories for filtering
const CATEGORIES = {
  general: 'general',
  agriculture: 'agriculture',
  weather: 'science',
  market: 'business',
  technology: 'technology',
  government: 'politics',
  business: 'business',
  sports: 'sports',
  health: 'health'
};

class NewsAPIService {
  constructor() {
    this.currentProvider = 'newsapi';
  }

  // NewsAPI.org implementation
  async fetchFromNewsAPI({ category = 'general', page = 1, searchTerm = '', country = 'in', pageSize = 20 }) {
    const baseUrl = 'https://newsapi.org/v2';
    const apiKey = API_KEYS.newsapi;

    if (!apiKey) {
      throw new Error('NewsAPI key not found');
    }

    let endpoint = searchTerm ? '/everything' : '/top-headlines';
    let params = new URLSearchParams({
      apiKey,
      page,
      pageSize,
      language: 'en'
    });

    if (searchTerm) {
      params.append('q', `${searchTerm} AND India`);
      params.append('sortBy', 'publishedAt');
    } else {
      params.append('country', country);
      if (category !== 'general') {
        params.append('category', CATEGORIES[category]);
      }
    }

    const response = await fetch(`${baseUrl}${endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`NewsAPI Error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatNewsAPIResponse(data);
  }

  // GNews implementation
  async fetchFromGNews({ category = 'general', page = 1, searchTerm = '', country = 'in', pageSize = 20 }) {
    const baseUrl = 'https://gnews.io/api/v4';
    const apiKey = API_KEYS.gnews;

    if (!apiKey) {
      throw new Error('GNews key not found');
    }

    let endpoint = searchTerm ? '/search' : '/top-headlines';
    let params = new URLSearchParams({
      token: apiKey,
      max: pageSize,
      page,
      lang: 'en',
      country: country.toLowerCase()
    });

    if (searchTerm) {
      params.append('q', `${searchTerm} farming agriculture India`);
    } else if (category !== 'general') {
      params.append('category', CATEGORIES[category]);
    }

    const response = await fetch(`${baseUrl}${endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`GNews Error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatGNewsResponse(data);
  }

  // NewsData.io implementation
  async fetchFromNewsData({ category = 'general', page = 1, searchTerm = '', country = 'in', pageSize = 20 }) {
    const baseUrl = 'https://newsdata.io/api/1/news';
    const apiKey = API_KEYS.newsdata;

    if (!apiKey) {
      throw new Error('NewsData key not found');
    }

    let params = new URLSearchParams({
      apikey: apiKey,
      size: pageSize,
      page,
      language: 'en',
      country: country.toLowerCase()
    });

    if (searchTerm) {
      params.append('q', `${searchTerm} AND (farming OR agriculture OR crop OR farmer)`);
    } else if (category !== 'general') {
      params.append('category', CATEGORIES[category]);
    }

    const response = await fetch(`${baseUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`NewsData Error: ${response.status}`);
    }

    const data = await response.json();
    return this.formatNewsDataResponse(data);
  }

  // Format NewsAPI response
  formatNewsAPIResponse(data) {
    return {
      articles: data.articles?.map(article => ({
        id: article.url || Math.random().toString(),
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source,
        category: 'general'
      })) || [],
      totalResults: data.totalResults || 0,
      page: 1
    };
  }

  // Format GNews response
  formatGNewsResponse(data) {
    return {
      articles: data.articles?.map(article => ({
        id: article.url || Math.random().toString(),
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.image,
        publishedAt: article.publishedAt,
        source: { name: article.source.name },
        category: 'general'
      })) || [],
      totalResults: data.totalArticles || 0,
      page: 1
    };
  }

  // Format NewsData response
  formatNewsDataResponse(data) {
    return {
      articles: data.results?.map(article => ({
        id: article.link || Math.random().toString(),
        title: article.title,
        description: article.description || article.content,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: { name: article.source_id },
        category: article.category?.[0] || 'general'
      })) || [],
      totalResults: data.totalResults || 0,
      page: 1
    };
  }

  // Main fetch method with fallback
  async fetchNews(params) {
    const providers = ['newsapi', 'gnews', 'newsdata'];

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider}...`);

        switch (provider) {
          case 'newsapi':
            return await this.fetchFromNewsAPI(params);
          case 'gnews':
            return await this.fetchFromGNews(params);
          case 'newsdata':
            return await this.fetchFromNewsData(params);
        }
      } catch (error) {
        console.error(`${provider} failed:`, error.message);

        if (provider === providers[providers.length - 1]) {
          // Last provider failed, throw error
          throw new Error('All news providers failed');
        }
      }
    }
  }

  // Public API methods
  async getNews({ category = 'general', page = 1, searchTerm = '', country = 'in', pageSize = 20 }) {
    return await this.fetchNews({ category, page, searchTerm, country, pageSize });
  }

  async getTrendingNews() {
    return await this.fetchNews({ category: 'general', pageSize: 8 });
  }

  async searchNews({ query, page = 1, pageSize = 20 }) {
    return await this.fetchNews({ searchTerm: query, page, pageSize });
  }

  async getNewsByCategory({ category, page = 1, pageSize = 20 }) {
    return await this.fetchNews({ category, page, pageSize });
  }

  // Specialized methods
  async getAgriculturalNews({ page = 1, pageSize = 20 }) {
    return await this.fetchNews({
      searchTerm: 'agriculture farming crop farmer harvest monsoon',
      page,
      pageSize
    });
  }

  async getMarketNews({ page = 1, pageSize = 20 }) {
    return await this.fetchNews({
      searchTerm: 'mandi prices agricultural market commodity MSP',
      page,
      pageSize
    });
  }

  async getWeatherNews({ page = 1, pageSize = 20 }) {
    return await this.fetchNews({
      searchTerm: 'weather monsoon rainfall drought agricultural',
      page,
      pageSize
    });
  }

  async getGovernmentNews({ page = 1, pageSize = 20 }) {
    return await this.fetchNews({
      searchTerm: 'PM-KISAN agricultural policy government scheme subsidy',
      page,
      pageSize
    });
  }
}

export const newsAPI = new NewsAPIService();
export default newsAPI;
