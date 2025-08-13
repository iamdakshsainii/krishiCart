import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import newsService from "../../services/newsAPI";

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async ({ category, query, language, page = 1, pageSize = 12 }, _thunk) => {
    if (query) return await newsService.searchNews(query, language, page, pageSize);
    if (category) return await newsService.getNewsByCategory(category, language, page, pageSize);
    return await newsService.getAgricultureNews(language, page, pageSize);
  }
);

const persistedBookmarks = (() => {
  try { return JSON.parse(localStorage.getItem("kc_bookmarks") || "[]"); }
  catch { return []; }
})();

const newsSlice = createSlice({
  name: "news",
  initialState: {
    articles: [],
    totalResults: 0,
    page: 1,
    loading: false,
    error: null,
    activeCategory: null,
    language: "en",
    bookmarks: persistedBookmarks,
    headlines: [],
    query: "",
    hasMore: true,
  },
  reducers: {
    setCategory(state, action) {
      state.activeCategory = action.payload;
      state.page = 1;
      state.hasMore = true;
      state.query = "";
    },
    setLanguage(state, action) {
      state.language = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    setQuery(state, action) {
      state.query = action.payload || "";
      state.page = 1;
      state.hasMore = true;
    },
    toggleBookmark(state, action) {
      const id = action.payload?.id || action.payload;
      const idx = state.bookmarks.findIndex((a) => a.id === id);
      if (idx >= 0) state.bookmarks.splice(idx, 1);
      else {
        const found = state.articles.find((a) => a.id === id);
        if (found) state.bookmarks.unshift(found);
      }
      localStorage.setItem("kc_bookmarks", JSON.stringify(state.bookmarks));
    },
    resetNews(state) {
      state.articles = [];
      state.totalResults = 0;
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        const { articles, totalResults, page } = action.payload;
        state.totalResults = totalResults;
        state.page = page;
        state.hasMore = state.articles.length + articles.length < totalResults;

        // append if page>1 else replace
        if (page > 1) state.articles.push(...articles);
        else state.articles = articles;

        // headlines for ticker (top 10 titles)
        state.headlines = state.articles.slice(0, 10).map((a) => a.titleEn);
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load news";
      });
  },
});

export const { setCategory, setLanguage, setQuery, toggleBookmark, resetNews } = newsSlice.actions;
export default newsSlice.reducer;
