// src/redux/slices/farmConnectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  'farmConnect/fetchPosts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/farm-connect/posts`, config);
      return data.data || data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchStories = createAsyncThunk(
  'farmConnect/fetchStories',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/farm-connect/stories`, config);
      return data.data || data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const createPost = createAsyncThunk(
  'farmConnect/createPost',
  async (postData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/farm-connect/posts`, postData, config);
      toast.success('Post created successfully!');
      return data.data || data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createStory = createAsyncThunk(
  'farmConnect/createStory',
  async (storyData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/farm-connect/stories`, storyData, config);
      toast.success('Story created successfully!');
      return data.data || data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const likePost = createAsyncThunk(
  'farmConnect/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/farm-connect/posts/${postId}/like`, {}, config);
      return { postId, data: data.data || data };
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const likeStory = createAsyncThunk(
  'farmConnect/likeStory',
  async (storyId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/farm-connect/stories/${storyId}/like`, {}, config);
      return { storyId, data: data.data || data };
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const addComment = createAsyncThunk(
  'farmConnect/addComment',
  async ({ postId, content }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/farm-connect/posts/${postId}/comments`, { content }, config);
      return { postId, comment: data.data || data };
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const sharePost = createAsyncThunk(
  'farmConnect/sharePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/farm-connect/posts/${postId}/share`, {}, config);
      toast.success('Post shared successfully!');
      return { postId, data: data.data || data };
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  posts: [],
  stories: [],
  loading: false,
  postsLoading: false,
  storiesLoading: false,
  createLoading: false,
  error: null,
  activeTab: 'posts',
  currentUser: null,

  // UI States
  showCreatePostModal: false,
  showCreateStoryModal: false,
  selectedPost: null,
  selectedStory: null,

  // Filters and Search
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'newest',
};

const farmConnectSlice = createSlice({
  name: 'farmConnect',
  initialState,
  reducers: {
    // UI Actions
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setShowCreatePostModal: (state, action) => {
      state.showCreatePostModal = action.payload;
    },
    setShowCreateStoryModal: (state, action) => {
      state.showCreateStoryModal = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setSelectedStory: (state, action) => {
      state.selectedStory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Local state updates for optimistic UI
    togglePostLike: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.userLiked = !post.userLiked;
        post.likes += post.userLiked ? 1 : -1;
      }
    },
    toggleStoryLike: (state, action) => {
      const story = state.stories.find(s => s.id === action.payload.storyId);
      if (story) {
        story.userLiked = !story.userLiked;
        story.likes += story.userLiked ? 1 : -1;
      }
    },
    incrementPostShares: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.shares += 1;
      }
    },
    addCommentToPost: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.unshift(action.payload.comment);
        post.commentsCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.postsLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to load posts');
      })

      // Fetch Stories
      .addCase(fetchStories.pending, (state) => {
        state.storiesLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.storiesLoading = false;
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.storiesLoading = false;
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to load stories');
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;
        state.posts.unshift(action.payload);
        state.showCreatePostModal = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Create Story
      .addCase(createStory.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.stories.unshift(action.payload);
        state.showCreateStoryModal = false;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.userLiked = action.payload.data.userLiked;
          post.likes = action.payload.data.likes;
        }
      })

      // Like Story
      .addCase(likeStory.fulfilled, (state, action) => {
        const story = state.stories.find(s => s.id === action.payload.storyId);
        if (story) {
          story.userLiked = action.payload.data.userLiked;
          story.likes = action.payload.data.likes;
        }
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments.unshift(action.payload.comment);
          post.commentsCount += 1;
        }
      })

      // Share Post
      .addCase(sharePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.shares = action.payload.data.shares;
        }
      });
  },
});

export const {
  setActiveTab,
  setCurrentUser,
  setShowCreatePostModal,
  setShowCreateStoryModal,
  setSelectedPost,
  setSelectedStory,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  clearError,
  togglePostLike,
  toggleStoryLike,
  incrementPostShares,
  addCommentToPost,
} = farmConnectSlice.actions;

export default farmConnectSlice.reducer;
