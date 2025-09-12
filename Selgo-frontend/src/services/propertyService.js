const API_URL = process.env.NEXT_PUBLIC_PROPERTY_API_URL || 'http://localhost:8004/api/v1';

import { apiClient } from './authService';

const propertyService = {
  getProperties: async (filters = {}) => {
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) { // Only add non-empty filters
          params.append(key, value);
        }
      });
      const queryString = params.toString();

      const response = await apiClient.get(`/properties${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const response = await apiClient.get(`/properties/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property categories:', error);
      return [];
    }
  },

  getPropertyDetails: async (propertyId) => {
    try {
      const timestamp = Date.now();
      const response = await apiClient.get(`/properties/${propertyId}?t=${timestamp}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property details:`, error);
      throw error;
    }
  },

  createProperty: async (propertyData) => {
    try {
      const response = await apiClient.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  uploadImage: async (formData) => {
    try {
      const response = await apiClient.post('/properties/upload-image', formData, {
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
};

export default propertyService;