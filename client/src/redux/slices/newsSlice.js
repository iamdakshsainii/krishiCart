import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsService } from '../../services/newsAPI';

// Async thunk for fetching news
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ category = 'agriculture', page = 1, searchTerm = '' }, { rejectWithValue }) => {
    try {
      const response = await newsService.getNews({ category, page, searchTerm });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch news');
    }
  }
);

// Async thunk for fetching trending news
export const fetchTrendingNews = createAsyncThunk(
  'news/fetchTrendingNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getTrendingNews();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch trending news');
    }
  }
);

// Async thunk for fetching news by category
export const fetchNewsByCategory = createAsyncThunk(
  'news/fetchNewsByCategory',
  async ({ category, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await newsService.getNewsByCategory(category, limit);
      return { category, data: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch category news');
    }
  }
);

const initialState = {
  articles: [],
  trendingNews: [],
  categoryNews: {
    agriculture: [],
    weather: [],
    market: [],
    technology: [],
    government: []
  },
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  searchTerm: '',
  selectedCategory: 'agriculture',
  bookmarkedArticles: JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]'),
  readArticles: JSON.parse(localStorage.getItem('readArticles') || '[]')
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    bookmarkArticle: (state, action) => {
      const article = action.payload;
      const isBookmarked = state.bookmarkedArticles.some(a => a.url === article.url);

      if (!isBookmarked) {
        state.bookmarkedArticles.push(article);
        localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
      }
    },
    removeBookmark: (state, action) => {
      const articleUrl = action.payload;
      state.bookmarkedArticles = state.bookmarkedArticles.filter(a => a.url !== articleUrl);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
    },
    markAsRead: (state, action) => {
      const articleUrl = action.payload;
      if (!state.readArticles.includes(articleUrl)) {
        state.readArticles.push(articleUrl);
        localStorage.setItem('readArticles', JSON.stringify(state.readArticles));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetNews: (state) => {
      state.articles = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalResults = 0;
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
        state.articles = action.payload.articles || [];
        state.totalResults = action.payload.totalResults || 0;
        state.totalPages = Math.ceil(state.totalResults / 20);
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Trending News
      .addCase(fetchTrendingNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingNews.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingNews = action.payload.articles || [];
      })
      .addCase(fetchTrendingNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch News by Category
      .addCase(fetchNewsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { category, data } = action.payload;
        state.categoryNews[category] = data.articles || [];
      })
      .addCase(fetchNewsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  bookmarkArticle,
  removeBookmark,
  markAsRead,
  clearError,
  resetNews
} = newsSlice.actions;

// Selectors
export const selectNews = (state) => state.news;
export const selectArticles = (state) => state.news.articles;
export const selectTrendingNews = (state) => state.news.trendingNews;
export const selectCategoryNews = (state) => state.news.categoryNews;
export const selectBookmarkedArticles = (state) => state.news.bookmarkedArticles;
export const selectReadArticles = (state) => state.news.readArticles;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;

export default newsSlice.reducer;
