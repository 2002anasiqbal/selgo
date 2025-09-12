const API_URL = process.env.NEXT_PUBLIC_CAR_API_URL || 'http://localhost:8005/api/v1';

import { apiClient } from './authService';

const carService = {
  getCategories: async (skip = 0, limit = 100) => {
    try {
      const response = await apiClient.get(`/cars/categories?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching car categories:', error);
      return [];
    }
  },

  getFeatures: async (skip = 0, limit = 100) => {
    try {
      const response = await apiClient.get(`/cars/features?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching car features:', error);
      throw error;
    }
  },

  getCars: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      const queryString = params.toString();

      const response = await apiClient.get(`/cars${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      return [];
    }
  },

  getRecommendedCars: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/cars/recommended?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended cars:', error);
      throw error;
    }
  },

  getCarDetails: async (carId) => {
    try {
      const timestamp = Date.now();
      const response = await apiClient.get(`/cars/${carId}?t=${timestamp}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car details:`, error);
      throw error;
    }
  },

  getFeaturedCars: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/cars/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured cars:', error);
      throw error;
    }
  },

  getHomepageCars: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/cars/homepage?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching homepage cars:', error);
      throw error;
    }
  },

  createCar: async (carData) => {
    try {
      const response = await apiClient.post('/cars', carData);
      return response.data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  uploadImage: async (formData) => {
    try {
      const response = await apiClient.post('/cars/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  toggleFavorite: async (carId) => {
    try {
      const response = await apiClient.post('/cars/favorites/toggle', {
        car_id: carId
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  async getUserFavorites(skip = 0, limit = 100) {
    try {
      const response = await apiClient.get(`/cars/favorites`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user favorites:', error.response?.data || error);
      return [];
    }
  },

  isCarFavorite: async (carId) => {
    try {
      const response = await apiClient.get(`/cars/${carId}/is-favorite`);
      return response.data.is_favorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },
};

export default carService;
