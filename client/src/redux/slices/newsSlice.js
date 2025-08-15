// redux/slices/newsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsService } from '../../services/newsAPI';

// Enhanced async thunk for fetching news with retry logic
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ category = 'agriculture', page = 1, searchTerm = '', append = false }, { rejectWithValue, getState }) => {
    try {
      const response = await newsService.getNews({
        category,
        page,
        searchTerm
      });

      return {
        ...response,
        page,
        append,
        searchTerm,
        category
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch news',
        details: error.toString()
      });
    }
  }
);

// Enhanced async thunk for fetching trending news
export const fetchTrendingNews = createAsyncThunk(
  'news/fetchTrendingNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getTrendingNews();
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch trending news',
        details: error.toString()
      });
    }
  }
);

// Enhanced async thunk for fetching news by category
export const fetchNewsByCategory = createAsyncThunk(
  'news/fetchNewsByCategory',
  async ({ category, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await newsService.getNewsByCategory(category, limit);
      return { category, data: response };
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch category news',
        details: error.toString()
      });
    }
  }
);

// Async thunk for refreshing all news data
export const refreshAllNews = createAsyncThunk(
  'news/refreshAllNews',
  async (_, { dispatch, getState }) => {
    const { selectedCategory, searchTerm } = getState().news;

    // Fetch main news
    await dispatch(fetchNews({
      category: selectedCategory,
      page: 1,
      searchTerm
    }));

    // Fetch trending news
    await dispatch(fetchTrendingNews());

    // Fetch category-specific news
    const categories = ['agriculture', 'weather', 'market', 'technology', 'government'];
    await Promise.all(
      categories.map(cat =>
        dispatch(fetchNewsByCategory({ category: cat, limit: 5 }))
      )
    );

    return true;
  }
);

// Async thunk for checking API health
export const checkApiHealth = createAsyncThunk(
  'news/checkApiHealth',
  async (_, { rejectWithValue }) => {
    try {
      const health = await newsService.checkApiHealth();
      return health;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Articles data
  articles: [],
  trendingNews: [],
  categoryNews: {
    agriculture: [],
    weather: [],
    market: [],
    technology: [],
    government: []
  },

  // Loading states
  loading: false,
  trendingLoading: false,
  categoryLoading: {},

  // Error states
  error: null,
  trendingError: null,
  categoryErrors: {},

  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  hasMore: true,

  // Filters and search
  searchTerm: '',
  selectedCategory: 'agriculture',
  sortBy: 'publishedAt',
  dateRange: 'all',

  // User data
  bookmarkedArticles: JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]'),
  readArticles: JSON.parse(localStorage.getItem('readArticles') || '[]'),
  likedArticles: JSON.parse(localStorage.getItem('likedArticles') || '[]'),

  // API health and metadata
  apiHealth: {},
  lastUpdated: null,
  activeApiSource: null,

  // UI state
  viewMode: 'grid',
  showAdvancedFilters: false
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    // Search and filter actions
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      state.articles = [];
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      state.articles = [];
      state.searchTerm = '';
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },

    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    toggleAdvancedFilters: (state) => {
      state.showAdvancedFilters = !state.showAdvancedFilters;
    },

    // Pagination actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    incrementPage: (state) => {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },

    // Bookmark actions
    bookmarkArticle: (state, action) => {
      const article = action.payload;
      const isBookmarked = state.bookmarkedArticles.some(a => a.url === article.url);

      if (!isBookmarked) {
        state.bookmarkedArticles.push({
          ...article,
          bookmarkedAt: new Date().toISOString()
        });
        localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
      }
    },

    removeBookmark: (state, action) => {
      const articleUrl = action.payload;
      state.bookmarkedArticles = state.bookmarkedArticles.filter(a => a.url !== articleUrl);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
    },

    toggleBookmark: (state, action) => {
      const article = action.payload;
      const existingIndex = state.bookmarkedArticles.findIndex(a => a.url === article.url);

      if (existingIndex >= 0) {
        state.bookmarkedArticles.splice(existingIndex, 1);
      } else {
        state.bookmarkedArticles.push({
          ...article,
          bookmarkedAt: new Date().toISOString()
        });
      }
      localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
    },

    // Read articles actions
    markAsRead: (state, action) => {
      const articleUrl = action.payload;
      if (!state.readArticles.includes(articleUrl)) {
        state.readArticles.push(articleUrl);
        localStorage.setItem('readArticles', JSON.stringify(state.readArticles));
      }
    },

    // Like actions
    toggleLike: (state, action) => {
      const articleUrl = action.payload;
      const index = state.likedArticles.indexOf(articleUrl);

      if (index >= 0) {
        state.likedArticles.splice(index, 1);
      } else {
        state.likedArticles.push(articleUrl);
      }
      localStorage.setItem('likedArticles', JSON.stringify(state.likedArticles));
    },

    // Error handling
    clearError: (state) => {
      state.error = null;
      state.trendingError = null;
      state.categoryErrors = {};
    },

    clearCategoryError: (state, action) => {
      const category = action.payload;
      delete state.categoryErrors[category];
    },

    // Reset actions
    resetNews: (state) => {
      state.articles = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalResults = 0;
      state.hasMore = true;
      state.error = null;
    },

    resetCategoryNews: (state, action) => {
      const category = action.payload;
      state.categoryNews[category] = [];
      delete state.categoryErrors[category];
    },

    // Clear all data
    clearAllData: (state) => {
      state.articles = [];
      state.trendingNews = [];
      state.categoryNews = {
        agriculture: [],
        weather: [],
        market: [],
        technology: [],
        government: []
      };
      state.error = null;
      state.trendingError = null;
      state.categoryErrors = {};
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch News
      .addCase(fetchNews.pending, (state, action) => {
        state.loading = true;
        if (!action.meta.arg.append) {
          state.error = null;
        }
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
        state.activeApiSource = action.payload.source;

        const { articles, totalResults, page, append } = action.payload;

        if (append && page > 1) {
          // Append to existing articles for infinite scroll
          const newArticles = articles.filter(
            newArticle => !state.articles.some(existing => existing.url === newArticle.url)
          );
          state.articles = [...state.articles, ...newArticles];
        } else {
          // Replace articles for new search/category
          state.articles = articles || [];
        }

        state.totalResults = totalResults || 0;
        state.currentPage = page;
        state.totalPages = Math.ceil((totalResults || 0) / 20);
        state.hasMore = page < state.totalPages;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch news';
        state.hasMore = false;
      })

      // Fetch Trending News
      .addCase(fetchTrendingNews.pending, (state) => {
        state.trendingLoading = true;
        state.trendingError = null;
      })
      .addCase(fetchTrendingNews.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trendingNews = action.payload.articles || [];
        state.trendingError = null;
      })
      .addCase(fetchTrendingNews.rejected, (state, action) => {
        state.trendingLoading = false;
        state.trendingError = action.payload?.message || 'Failed to fetch trending news';
      })

      // Fetch News by Category
      .addCase(fetchNewsByCategory.pending, (state, action) => {
        const category = action.meta.arg.category;
        state.categoryLoading[category] = true;
        delete state.categoryErrors[category];
      })
      .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
        const { category, data } = action.payload;
        state.categoryLoading[category] = false;
        state.categoryNews[category] = data.articles || [];
        delete state.categoryErrors[category];
      })
      .addCase(fetchNewsByCategory.rejected, (state, action) => {
        const category = action.meta.arg.category;
        state.categoryLoading[category] = false;
        state.categoryErrors[category] = action.payload?.message || 'Failed to fetch category news';
      })

      // Check API Health
      .addCase(checkApiHealth.fulfilled, (state, action) => {
        state.apiHealth = action.payload;
      })
      .addCase(checkApiHealth.rejected, (state, action) => {
        state.apiHealth = { error: action.payload };
      })

      // Refresh All News
      .addCase(refreshAllNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAllNews.fulfilled, (state) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(refreshAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to refresh news data';
      });
  }
});

// Export actions
export const {
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setDateRange,
  setViewMode,
  toggleAdvancedFilters,
  setCurrentPage,
  incrementPage,
  bookmarkArticle,
  removeBookmark,
  toggleBookmark,
  markAsRead,
  toggleLike,
  clearError,
  clearCategoryError,
  resetNews,
  resetCategoryNews,
  clearAllData
} = newsSlice.actions;

// Enhanced selectors
export const selectNews = (state) => state.news;
export const selectArticles = (state) => state.news.articles;
export const selectTrendingNews = (state) => state.news.trendingNews;
export const selectCategoryNews = (state) => state.news.categoryNews;
export const selectBookmarkedArticles = (state) => state.news.bookmarkedArticles;
export const selectReadArticles = (state) => state.news.readArticles;
export const selectLikedArticles = (state) => state.news.likedArticles;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;
export const selectApiHealth = (state) => state.news.apiHealth;

// Computed selectors
export const selectFilteredArticles = (state) => {
  const { articles, dateRange, sortBy } = state.news;
  let filtered = [...articles];

  // Filter by date range
  if (dateRange !== 'all') {
    const now = new Date();
    const cutoff = new Date();

    switch (dateRange) {
      case 'today':
        cutoff.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
    }

    filtered = filtered.filter(article =>
      new Date(article.publishedAt) >= cutoff
    );
  }

  // Sort articles
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'publishedAt':
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case 'popularity':
        return (b.engagement || 0) - (a.engagement || 0);
      case 'relevancy':
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      default:
        return 0;
    }
  });

  return filtered;
};

export const selectNewsStats = (state) => ({
  totalArticles: state.news.articles.length,
  totalBookmarks: state.news.bookmarkedArticles.length,
  totalRead: state.news.readArticles.length,
  totalLiked: state.news.likedArticles.length,
  lastUpdated: state.news.lastUpdated,
  activeSource: state.news.activeApiSource,
  hasMore: state.news.hasMore,
  currentPage: state.news.currentPage,
  totalPages: state.news.totalPages
});

export default newsSlice.reducer;
