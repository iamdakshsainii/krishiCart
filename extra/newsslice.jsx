import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsAPI } from '../../services/newsAPI';

// Async thunks
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ category = 'general', page = 1, searchTerm = '' }, { rejectWithValue }) => {
    try {
      const response = await newsAPI.getNews({
        category,
        page,
        searchTerm,
        country: 'in',
        pageSize: 20
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTrendingNews = createAsyncThunk(
  'news/fetchTrendingNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsAPI.getTrendingNews();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchNews = createAsyncThunk(
  'news/searchNews',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await newsAPI.searchNews({
        query,
        page,
        pageSize: 20
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewsByCategory = createAsyncThunk(
  'news/fetchNewsByCategory',
  async ({ category, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await newsAPI.getNewsByCategory({
        category,
        page,
        pageSize: 20
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Load data from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Save to localStorage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const initialState = {
  // Articles
  articles: [],
  trendingArticles: [],
  totalResults: 0,
  currentPage: 1,
  totalPages: 1,

  // UI State
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'general',

  // User interactions
  bookmarkedArticles: loadFromLocalStorage('bookmarkedArticles', []),
  readArticles: loadFromLocalStorage('readArticles', []),
  likedArticles: loadFromLocalStorage('likedArticles', []),

  // Filters
  sortBy: 'publishedAt',
  dateRange: 'all',
  source: 'all',

  // Categories
  categories: [
    { id: 'general', name: 'General', icon: '📰' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
    { id: 'weather', name: 'Weather', icon: '🌦️' },
    { id: 'market', name: 'Market', icon: '📈' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'government', name: 'Government', icon: '🏛️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'health', name: 'Health', icon: '🏥' }
  ]
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    // Search and filters
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset page when category changes
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },

    setSource: (state, action) => {
      state.source = action.payload;
    },

    // User interactions
    bookmarkArticle: (state, action) => {
      const article = action.payload;
      const isBookmarked = state.bookmarkedArticles.some(a => a.id === article.id);

      if (!isBookmarked) {
        state.bookmarkedArticles.push({
          ...article,
          bookmarkedAt: new Date().toISOString()
        });
        saveToLocalStorage('bookmarkedArticles', state.bookmarkedArticles);
      }
    },

    removeBookmark: (state, action) => {
      const articleId = action.payload;
      state.bookmarkedArticles = state.bookmarkedArticles.filter(a => a.id !== articleId);
      saveToLocalStorage('bookmarkedArticles', state.bookmarkedArticles);
    },

    markAsRead: (state, action) => {
      const articleId = action.payload;
      if (!state.readArticles.includes(articleId)) {
        state.readArticles.push(articleId);
        saveToLocalStorage('readArticles', state.readArticles);
      }
    },

    markAsUnread: (state, action) => {
      const articleId = action.payload;
      state.readArticles = state.readArticles.filter(id => id !== articleId);
      saveToLocalStorage('readArticles', state.readArticles);
    },

    likeArticle: (state, action) => {
      const articleId = action.payload;
      if (!state.likedArticles.includes(articleId)) {
        state.likedArticles.push(articleId);
        saveToLocalStorage('likedArticles', state.likedArticles);
      }
    },

    unlikeArticle: (state, action) => {
      const articleId = action.payload;
      state.likedArticles = state.likedArticles.filter(id => id !== articleId);
      saveToLocalStorage('likedArticles', state.likedArticles);
    },

    // Clear data
    clearError: (state) => {
      state.error = null;
    },

    clearSearch: (state) => {
      state.searchTerm = '';
      state.articles = [];
      state.currentPage = 1;
    },

    resetFilters: (state) => {
      state.selectedCategory = 'general';
      state.sortBy = 'publishedAt';
      state.dateRange = 'all';
      state.source = 'all';
      state.searchTerm = '';
      state.currentPage = 1;
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch News
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.meta.arg.page === 1
          ? action.payload.articles
          : [...state.articles, ...action.payload.articles];
        state.totalResults = action.payload.totalResults;
        state.totalPages = action.payload.totalPages || Math.ceil(action.payload.totalResults / 20);
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch news';
      })

      // Fetch Trending News
      .addCase(fetchTrendingNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingNews.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingArticles = action.payload.articles;
      })
      .addCase(fetchTrendingNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch trending news';
      })

      // Search News
      .addCase(searchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.meta.arg.page === 1
          ? action.payload.articles
          : [...state.articles, ...action.payload.articles];
        state.totalResults = action.payload.totalResults;
        state.totalPages = action.payload.totalPages || Math.ceil(action.payload.totalResults / 20);
      })
      .addCase(searchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search news';
      })

      // Fetch News By Category
      .addCase(fetchNewsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.meta.arg.page === 1
          ? action.payload.articles
          : [...state.articles, ...action.payload.articles];
        state.totalResults = action.payload.totalResults;
        state.totalPages = action.payload.totalPages || Math.ceil(action.payload.totalResults / 20);
      })
      .addCase(fetchNewsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch category news';
      });
  }
});

// Selectors
export const selectNews = (state) => state.news;
export const selectArticles = (state) => state.news.articles;
export const selectTrendingArticles = (state) => state.news.trendingArticles;
export const selectBookmarkedArticles = (state) => state.news.bookmarkedArticles;
export const selectReadArticles = (state) => state.news.readArticles;
export const selectLikedArticles = (state) => state.news.likedArticles;
export const selectCategories = (state) => state.news.categories;
export const selectLoading = (state) => state.news.loading;
export const selectError = (state) => state.news.error;
export const selectCurrentPage = (state) => state.news.currentPage;
export const selectTotalPages = (state) => state.news.totalPages;
export const selectSearchTerm = (state) => state.news.searchTerm;
export const selectSelectedCategory = (state) => state.news.selectedCategory;

// Action creators
export const {
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  setSortBy,
  setDateRange,
  setSource,
  bookmarkArticle,
  removeBookmark,
  markAsRead,
  markAsUnread,
  likeArticle,
  unlikeArticle,
  clearError,
  clearSearch,
  resetFilters
} = newsSlice.actions;

export default newsSlice.reducer;
