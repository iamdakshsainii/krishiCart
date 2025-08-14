import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Update farmer profile
export const updateFarmerProfile = createAsyncThunk(
  'profile/updateFarmerProfile',
  async ({ farmerId, profileData, profilePhoto, coverPhoto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('profileData', JSON.stringify(profileData));

      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      if (coverPhoto) {
        formData.append('coverPhoto', coverPhoto);
      }

      const response = await api.put(`/farm-connect/farmers/${farmerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update profile' }
      );
    }
  }
);

// Get farmer profile
export const getFarmerProfile = createAsyncThunk(
  'profile/getFarmerProfile',
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/farm-connect/farmers/${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch profile' }
      );
    }
  }
);

// Upload farmer photos
export const uploadFarmerPhotos = createAsyncThunk(
  'profile/uploadFarmerPhotos',
  async ({ farmerId, profilePhoto, coverPhoto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      if (coverPhoto) {
        formData.append('coverPhoto', coverPhoto);
      }

      const response = await api.post(`/farm-connect/farmers/${farmerId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to upload photos' }
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
    uploadLoading: false,
  },
  reducers: {
    clearProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.uploadLoading = false;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update farmer profile
      .addCase(updateFarmerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload.data;
      })
      .addCase(updateFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })

      // Get farmer profile
      .addCase(getFarmerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(getFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })

      // Upload farmer photos
      .addCase(uploadFarmerPhotos.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadFarmerPhotos.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.success = true;
        // Update profile with new photo URLs if needed
        if (state.profile && action.payload.data) {
          if (action.payload.data.profilePhoto) {
            state.profile.avatar = action.payload.data.profilePhoto;
          }
          if (action.payload.data.coverPhoto) {
            state.profile.coverPhoto = action.payload.data.coverPhoto;
          }
        }
      })
      .addCase(uploadFarmerPhotos.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload?.message || 'Failed to upload photos';
      });
  },
});

export const { clearProfileState, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
