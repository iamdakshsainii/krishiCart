/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// =========================
// Helper functions
// =========================
const getAuthConfig = (getState, isMultipart = false) => {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json'
    }
  };
};

const handleApiError = (error, customMessage) => {
  const message = customMessage || error.response?.data?.message || error.message || 'An unexpected error occurred';
  toast.error(message);
  return message;
};

// Enhanced error handling with retry logic
const createApiCall = async (apiFunction, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      if (i === retries - 1) throw error;
      if (error.response?.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const createCacheKey = (endpoint, params) => `${endpoint}-${JSON.stringify(params)}`;

// =========================
// Enhanced Async Thunks
// =========================

// Create Post with optimistic update
export const createPost = createAsyncThunk(
  'farmConnect/createPost',
  async (formData, { getState, rejectWithValue, dispatch }) => {
    try {
      // Optimistic update
      const tempPost = {
        _id: `temp-${Date.now()}`,
        content: formData.get('content'),
        author: getState().auth.user,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        isTemporary: true
      };

      dispatch(addOptimisticPost(tempPost));

      const result = await createApiCall(async () => {
        const { data } = await axios.post(
          `${API_URL}/farm-connect/posts`,
          formData,
          getAuthConfig(getState, true)
        );
        return data.data;
      });

      toast.success('Post created successfully! 🌱');
      dispatch(removeOptimisticPost(tempPost._id));
      return result;
    } catch (error) {
      dispatch(removeOptimisticPost(`temp-${Date.now()}`));
      return rejectWithValue(handleApiError(error, 'Failed to create post'));
    }
  }
);

// Create Story with optimistic update
export const createStory = createAsyncThunk(
  'farmConnect/createStory',
  async (formData, { getState, rejectWithValue, dispatch }) => {
    try {
      const tempStory = {
        _id: `temp-story-${Date.now()}`,
        title: formData.get('title'),
        content: formData.get('content'),
        author: getState().auth.user,
        createdAt: new Date().toISOString(),
        isTemporary: true
      };

      dispatch(addOptimisticStory(tempStory));

      const result = await createApiCall(async () => {
        const { data } = await axios.post(
          `${API_URL}/farm-connect/stories`,
          formData,
          getAuthConfig(getState, true)
        );
        return data.data;
      });

      toast.success('Story shared successfully! 📖');
      dispatch(removeOptimisticStory(tempStory._id));
      return result;
    } catch (error) {
      dispatch(removeOptimisticStory(`temp-story-${Date.now()}`));
      return rejectWithValue(handleApiError(error, 'Failed to create story'));
    }
  }
);

// Enhanced Like Post with instant feedback
export const likePost = createAsyncThunk(
  'farmConnect/likePost',
  async (postId, { getState, rejectWithValue, dispatch }) => {
    try {
      const currentUser = getState().auth.user;

      // Optimistic update
      dispatch(toggleLikeOptimistic({ postId, userId: currentUser._id }));

      const result = await createApiCall(async () => {
        const { data } = await axios.post(
          `${API_URL}/farm-connect/posts/${postId}/like`,
          {},
          getAuthConfig(getState)
        );
        return data.data;
      });

      return { postId, updatedPost: result };
    } catch (error) {
      // Revert optimistic update on failure
      dispatch(toggleLikeOptimistic({ postId, userId: getState().auth.user._id }));
      return rejectWithValue(handleApiError(error, 'Failed to update like'));
    }
  }
);

// Enhanced Add Comment
export const addComment = createAsyncThunk(
  'farmConnect/addComment',
  async ({ postId, content }, { getState, rejectWithValue, dispatch }) => {
    try {
      const tempComment = {
        _id: `temp-comment-${Date.now()}`,
        content,
        author: getState().auth.user,
        createdAt: new Date().toISOString(),
        isTemporary: true
      };

      // Optimistic update
      dispatch(addOptimisticComment({ postId, comment: tempComment }));

      const result = await createApiCall(async () => {
        const { data } = await axios.post(
          `${API_URL}/farm-connect/posts/${postId}/comments`,
          { content },
          getAuthConfig(getState)
        );
        return data.data;
      });

      dispatch(removeOptimisticComment({ postId, commentId: tempComment._id }));
      toast.success('Comment added! 💬');
      return { postId, newComment: result };
    } catch (error) {
      dispatch(removeOptimisticComment({ postId, commentId: `temp-comment-${Date.now()}` }));
      return rejectWithValue(handleApiError(error, 'Failed to add comment'));
    }
  }
);

// Cached Farmer Profile
export const getFarmerProfile = createAsyncThunk(
  'farmConnect/getFarmerProfile',
  async (farmerId, { getState, rejectWithValue }) => {
    try {
      const state = getState().farmConnect;
      const cacheKey = `farmer-${farmerId}`;
      const cachedProfile = state.profileCache[cacheKey];

      // Return cached data if valid
      if (cachedProfile && Date.now() - cachedProfile.timestamp < CACHE_DURATION) {
        return { profile: cachedProfile.data, fromCache: true };
      }

      const result = await createApiCall(async () => {
        const { data } = await axios.get(
          `${API_URL}/farm-connect/farmers/${farmerId}`,
          getAuthConfig(getState)
        );
        return data.data;
      });

      return { profile: result, cacheKey, fromCache: false };
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Failed to fetch farmer profile'));
    }
  }
);

// Enhanced Fetch Posts with pagination and caching
export const fetchPosts = createAsyncThunk(
  'farmConnect/fetchPosts',
  async ({ page = 1, limit = 10, refresh = false } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().farmConnect;

      // Return cached data if not refreshing
      if (!refresh && state.posts.length > 0 && !state.shouldRefreshPosts) {
        return { posts: state.posts, fromCache: true };
      }

      const result = await createApiCall(async () => {
        const { data } = await axios.get(
          `${API_URL}/farm-connect/posts?page=${page}&limit=${limit}`,
          getAuthConfig(getState)
        );
        return data.data || [];
      });

      return { posts: result, page, fromCache: false };
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Failed to fetch posts'));
    }
  }
);

// Enhanced Fetch Stories
export const fetchStories = createAsyncThunk(
  'farmConnect/fetchStories',
  async ({ page = 1, limit = 10, refresh = false } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().farmConnect;

      if (!refresh && state.stories.length > 0 && !state.shouldRefreshStories) {
        return { stories: state.stories, fromCache: true };
      }

      const result = await createApiCall(async () => {
        const { data } = await axios.get(
          `${API_URL}/farm-connect/stories?page=${page}&limit=${limit}`,
          getAuthConfig(getState)
        );
        return data.data || [];
      });

      return { stories: result, page, fromCache: false };
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Failed to fetch stories'));
    }
  }
);

// Batch operations
export const batchLikePosts = createAsyncThunk(
  'farmConnect/batchLikePosts',
  async (postIds, { getState, rejectWithValue, dispatch }) => {
    try {
      const promises = postIds.map(postId => dispatch(likePost(postId)));
      const results = await Promise.allSettled(promises);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      toast.success(`Liked ${successful}/${postIds.length} posts! ❤️`);

      return results;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Batch like operation failed'));
    }
  }
);

// =========================
// Enhanced Initial State
// =========================
const initialState = {
  // Core data
  posts: [],
  stories: [],
  currentUser: null,
  farmerProfile: null,

  // UI state
  activeTab: 'posts',
  showCreatePostModal: false,
  showCreateStoryModal: false,

  // Loading states (granular)
  postsLoading: false,
  storiesLoading: false,
  createLoading: false,
  likeLoading: {},
  commentLoading: {},
  profileLoading: false,

  // Error handling
  error: null,
  errors: {},

  // Caching
  profileCache: {},
  lastFetched: {
    posts: null,
    stories: null
  },
  shouldRefreshPosts: false,
  shouldRefreshStories: false,

  // Pagination
  pagination: {
    posts: { page: 1, hasMore: true, total: 0 },
    stories: { page: 1, hasMore: true, total: 0 }
  },

  // Filters and search
  filters: {
    posts: { sortBy: 'createdAt', order: 'desc' },
    stories: { sortBy: 'createdAt', order: 'desc' }
  },
  searchQuery: '',

  // Network status
  isOnline: navigator.onLine,
  retryQueue: []
};

// =========================
// Enhanced Slice
// =========================
const farmConnectSlice = createSlice({
  name: 'farmConnect',
  initialState,
  reducers: {
    // Core actions
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.errors = {};
    },
    clearFarmerProfile: (state) => {
      state.farmerProfile = null;
    },
    setShowCreatePostModal: (state, action) => {
      state.showCreatePostModal = action.payload;
    },
    setShowCreateStoryModal: (state, action) => {
      state.showCreateStoryModal = action.payload;
    },

    // Optimistic updates
    addOptimisticPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    removeOptimisticPost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    addOptimisticStory: (state, action) => {
      state.stories.unshift(action.payload);
    },
    removeOptimisticStory: (state, action) => {
      state.stories = state.stories.filter(story => story._id !== action.payload);
    },
    addOptimisticComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.comments = post.comments || [];
        post.comments.push(comment);
      }
    },
    removeOptimisticComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post && post.comments) {
        post.comments = post.comments.filter(c => c._id !== commentId);
      }
    },
    toggleLikeOptimistic: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.likes = post.likes || [];
        const likeIndex = post.likes.findIndex(like => like.user === userId);
        if (likeIndex >= 0) {
          post.likes.splice(likeIndex, 1);
        } else {
          post.likes.push({ user: userId, createdAt: new Date().toISOString() });
        }
      }
    },

    // Cache management
    invalidatePostsCache: (state) => {
      state.shouldRefreshPosts = true;
    },
    invalidateStoriesCache: (state) => {
      state.shouldRefreshStories = true;
    },
    clearCache: (state) => {
      state.profileCache = {};
      state.shouldRefreshPosts = true;
      state.shouldRefreshStories = true;
    },

    // Filters and search
    setPostsFilter: (state, action) => {
      state.filters.posts = { ...state.filters.posts, ...action.payload };
    },
    setStoriesFilter: (state, action) => {
      state.filters.stories = { ...state.filters.stories, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    // Network status
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    addToRetryQueue: (state, action) => {
      state.retryQueue.push(action.payload);
    },
    clearRetryQueue: (state) => {
      state.retryQueue = [];
    },

    // Bulk operations
    updateMultiplePosts: (state, action) => {
      const updates = action.payload;
      updates.forEach(({ postId, updates }) => {
        const postIndex = state.posts.findIndex(p => p._id === postId);
        if (postIndex >= 0) {
          state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
        }
      });
    }
  },

  extraReducers: (builder) => {
    // CREATE POST
    builder
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;
        // Replace temporary post or add new one
        const tempPostIndex = state.posts.findIndex(p => p.isTemporary);
        if (tempPostIndex >= 0) {
          state.posts[tempPostIndex] = action.payload;
        } else {
          state.posts.unshift(action.payload);
        }
        state.showCreatePostModal = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // CREATE STORY
    builder
      .addCase(createStory.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.createLoading = false;
        const tempStoryIndex = state.stories.findIndex(s => s.isTemporary);
        if (tempStoryIndex >= 0) {
          state.stories[tempStoryIndex] = action.payload;
        } else {
          state.stories.unshift(action.payload);
        }
        state.showCreateStoryModal = false;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // LIKE POST (no loading state since it's optimistic)
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, updatedPost } = action.payload;
        const index = state.posts.findIndex(post => post._id === postId);
        if (index !== -1) {
          // Merge with optimistic update
          state.posts[index] = { ...state.posts[index], ...updatedPost };
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        // Error is handled in the thunk with revert
        console.error('Like failed:', action.payload);
      });

    // ADD COMMENT
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, newComment } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          // Remove temporary comment and add real one
          post.comments = post.comments.filter(c => !c.isTemporary);
          post.comments.push(newComment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        // Error handling is done in thunk
        console.error('Comment failed:', action.payload);
      });

    // GET FARMER PROFILE
    builder
      .addCase(getFarmerProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        const { profile, cacheKey, fromCache } = action.payload;
        state.farmerProfile = profile;

        // Update cache if not from cache
        if (!fromCache && cacheKey) {
          state.profileCache[cacheKey] = {
            data: profile,
            timestamp: Date.now()
          };
        }
      })
      .addCase(getFarmerProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // FETCH POSTS
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.postsLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        const { posts, page, fromCache } = action.payload;

        if (page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }

        if (!fromCache) {
          state.lastFetched.posts = Date.now();
          state.shouldRefreshPosts = false;
        }

        // Update pagination
        state.pagination.posts.page = page;
        state.pagination.posts.hasMore = posts.length === 10; // Assuming limit of 10
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
        state.posts = [];
      });

    // FETCH STORIES
    builder
      .addCase(fetchStories.pending, (state) => {
        state.storiesLoading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.storiesLoading = false;
        const { stories, page, fromCache } = action.payload;

        if (page === 1) {
          state.stories = stories;
        } else {
          state.stories = [...state.stories, ...stories];
        }

        if (!fromCache) {
          state.lastFetched.stories = Date.now();
          state.shouldRefreshStories = false;
        }

        state.pagination.stories.page = page;
        state.pagination.stories.hasMore = stories.length === 10;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.storiesLoading = false;
        state.error = action.payload;
        state.stories = [];
      });
  }
});

// Export actions
export const {
  setCurrentUser,
  setActiveTab,
  clearError,
  clearFarmerProfile,
  setShowCreatePostModal,
  setShowCreateStoryModal,
  addOptimisticPost,
  removeOptimisticPost,
  addOptimisticStory,
  removeOptimisticStory,
  addOptimisticComment,
  removeOptimisticComment,
  toggleLikeOptimistic,
  invalidatePostsCache,
  invalidateStoriesCache,
  clearCache,
  setPostsFilter,
  setStoriesFilter,
  setSearchQuery,
  setOnlineStatus,
  addToRetryQueue,
  clearRetryQueue,
  updateMultiplePosts
} = farmConnectSlice.actions;

// Selectors
export const selectFilteredPosts = (state) => {
  const { posts, searchQuery, filters } = state.farmConnect;
  let filtered = posts;

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(post =>
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  const { sortBy, order } = filters.posts;
  filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return filtered;
};

export const selectFilteredStories = (state) => {
  const { stories, searchQuery, filters } = state.farmConnect;
  let filtered = stories;

  if (searchQuery) {
    filtered = filtered.filter(story =>
      story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const { sortBy, order } = filters.stories;
  filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return filtered;
};

export default farmConnectSlice.reducer;
