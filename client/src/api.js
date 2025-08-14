// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Profile API calls
export const profileAPI = {
  // Get farmer profile
  getFarmerProfile: async (farmerId) => {
    const response = await api.get(`/farmers/profile/${farmerId}`);
    return response.data;
  },

  // Update farmer profile
  updateFarmerProfile: async (farmerId, profileData) => {
    const response = await api.put(`/farmers/profile/${farmerId}`, profileData);
    return response.data;
  },
};

// Farmer API calls
export const farmerAPI = {
  // Get all farmers
  getAllFarmers: async (params = {}) => {
    const response = await api.get('/farmers', { params });
    return response.data;
  },

  // Get farmer by ID
  getFarmerById: async (farmerId) => {
    const response = await api.get(`/farmers/${farmerId}`);
    return response.data;
  },
};

// Product API calls
export const productAPI = {
  // Get products by farmer
  getProductsByFarmer: async (farmerId) => {
    const response = await api.get(`/products?farmer=${farmerId}`);
    return response.data;
  },
};

export default api;
