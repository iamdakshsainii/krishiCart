/* eslint-disable no-unused-vars */
// hooks/useProfileLoader.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmerProfile, updateFarmerProfile, clearProfile } from '../redux/slices/profileSlice';

// Custom hook to ensure profile is loaded
export const useProfileLoader = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, lastFetched } = useSelector(state => state.profile);
  const { user, token } = useSelector(state => state.auth);

  // Use refs to track previous values and prevent unnecessary fetches
  const prevUserIdRef = useRef(null);
  const lastFetchTimeRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Minimum time between fetches (5 minutes)
  const MIN_FETCH_INTERVAL = 5 * 60 * 1000;

  useEffect(() => {
    const currentUserId = user?._id;
    const isValidFarmer = user && user.role === 'farmer' && token;
    const hasChanged = prevUserIdRef.current !== currentUserId;
    const now = Date.now();
    const timeSinceLastFetch = lastFetchTimeRef.current ? now - lastFetchTimeRef.current : Infinity;

    // Only fetch if:
    // 1. We have a valid farmer user with token
    // 2. No profile exists OR user has changed OR enough time has passed
    // 3. Not currently loading
    // 4. Not already in the middle of fetching
    if (
      isValidFarmer &&
      (!profile || hasChanged || timeSinceLastFetch > MIN_FETCH_INTERVAL) &&
      !loading &&
      !isFetchingRef.current
    ) {
      console.log('Auto-loading farmer profile for user:', currentUserId);
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      prevUserIdRef.current = currentUserId;

      dispatch(getFarmerProfile(currentUserId)).finally(() => {
        isFetchingRef.current = false;
      });
    } else if (hasChanged) {
      prevUserIdRef.current = currentUserId;
    }
  }, [dispatch, user?._id, user?.role, token, profile, loading]);

  // Function to manually refresh profile
  const refreshProfile = () => {
    if (user && user.role === 'farmer' && token && !isFetchingRef.current) {
      console.log('Manually refreshing profile for user:', user._id);
      isFetchingRef.current = true;
      lastFetchTimeRef.current = Date.now();

      dispatch(getFarmerProfile(user._id)).finally(() => {
        isFetchingRef.current = false;
      });
    }
  };

  // Function to force refresh (ignores time interval)
  const forceRefreshProfile = () => {
    if (user && user.role === 'farmer' && token) {
      console.log('Force refreshing profile for user:', user._id);
      isFetchingRef.current = true;
      lastFetchTimeRef.current = Date.now();

      dispatch(getFarmerProfile(user._id)).finally(() => {
        isFetchingRef.current = false;
      });
    }
  };

  // Function to update profile
  const updateProfile = async (profileData) => {
    if (user && user.role === 'farmer' && token) {
      try {
        console.log('Updating profile for user:', user._id, 'with data:', profileData);
        const result = await dispatch(updateFarmerProfile({
          farmerId: user._id,
          profileData
        })).unwrap();

        console.log('Profile updated successfully:', result);
        return { success: true, data: result };
      } catch (error) {
        console.error('Profile update failed:', error);
        return { success: false, error: error.message || 'Profile update failed' };
      }
    }
    return { success: false, error: 'User not authenticated or not a farmer' };
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
    forceRefreshProfile,
    updateProfile,
    hasProfile: !!profile,
    isLoading: loading
  };
};

// Profile loader component to wrap your app
export const ProfileLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { profile, loading } = useSelector(state => state.profile);

  // Track previous values to prevent unnecessary effects
  const prevUserRef = useRef(null);
  const prevTokenRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const currentUser = user;
    const currentToken = token;
    const userChanged = prevUserRef.current !== currentUser;
    const tokenChanged = prevTokenRef.current !== currentToken;

    // Handle user login - fetch profile for farmers
    if (
      currentUser &&
      currentUser.role === 'farmer' &&
      currentToken &&
      !profile &&
      !loading &&
      !isFetchingRef.current &&
      (userChanged || tokenChanged || !hasInitializedRef.current)
    ) {
      console.log('ProfileLoader: Auto-fetching profile for farmer:', currentUser._id);
      isFetchingRef.current = true;
      hasInitializedRef.current = true;

      dispatch(getFarmerProfile(currentUser._id)).finally(() => {
        isFetchingRef.current = false;
      });
    }

    // Handle user logout - clear profile
    if (!currentUser && prevUserRef.current && profile) {
      console.log('ProfileLoader: Clearing profile on logout');
      dispatch(clearProfile());
      hasInitializedRef.current = false;
      isFetchingRef.current = false;
    }

    // Update refs
    prevUserRef.current = currentUser;
    prevTokenRef.current = currentToken;
  }, [dispatch, user, token, profile, loading]);

  return children;
};

// Hook for profile status checking
export const useProfileStatus = () => {
  const { user } = useSelector(state => state.auth);
  const { profile, loading, error } = useSelector(state => state.profile);

  const isFarmer = user?.role === 'farmer';
  const hasProfile = !!profile;
  const needsProfile = isFarmer && !hasProfile && !loading;
  const profileComplete = hasProfile && profile.profile; // Has both user data and profile data

  return {
    isFarmer,
    hasProfile,
    needsProfile,
    profileComplete,
    loading,
    error
  };
};

// Hook specifically for profile editing
export const useProfileEditor = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { profile, loading, error } = useSelector(state => state.profile);

  const updateProfile = async (profileData) => {
    if (!user || user.role !== 'farmer' || !token) {
      throw new Error('User not authenticated or not a farmer');
    }

    try {
      console.log('ProfileEditor: Updating profile for user:', user._id);
      const result = await dispatch(updateFarmerProfile({
        farmerId: user._id,
        profileData
      })).unwrap();

      console.log('ProfileEditor: Profile updated successfully');
      return result;
    } catch (error) {
      console.error('ProfileEditor: Profile update failed:', error);
      throw error;
    }
  };

  const refreshProfile = () => {
    if (user && user.role === 'farmer' && token) {
      console.log('ProfileEditor: Refreshing profile');
      return dispatch(getFarmerProfile(user._id));
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    canEdit: user?.role === 'farmer' && !!token
  };
};

// Example usage in your FarmerDetailPage.jsx:
/*
import { useProfileEditor } from '../hooks/useProfileLoader';

// In your component:
const FarmerDetailPage = () => {
  const { profile, loading, error, updateProfile, canEdit } = useProfileEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Update failed:', error);
      // Show error message
    }
  };

  // Rest of your component...
};
*/

export default {
  useProfileLoader,
  ProfileLoader,
  useProfileStatus,
  useProfileEditor
};
