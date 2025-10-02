// src/services/api.js
import axios from 'axios';
import { ERROR_MESSAGES } from '@/types';
import { DEVELOPMENT_MODE, shouldUseMockData } from '@/config/development';
import mockApiHandler from './mockApiHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Check if we should use mock data
    if (shouldUseMockData()) {
      console.log('🔧 Dev Mode: Intercepting request for mock data');
      
      // Get mock response
      const mockResponse = await mockApiHandler.handleRequest(
        config.method.toUpperCase(),
        config.url,
        config.data
      );

      if (mockResponse) {
        // Cancel the real request and return mock data
        config.adapter = () => {
          return Promise.resolve({
            data: mockResponse.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          });
        };
      }
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // In development mode, be more lenient with errors
    if (shouldUseMockData()) {
      console.warn('🔧 Dev Mode: API error intercepted', error);
      // Return a mock success response for development
      return Promise.resolve({
        data: { success: true, message: 'Mock response (error caught)' },
        status: 200,
      });
    }

    if (!error.response) {
      // Network error
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
      });
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        if (!shouldUseMockData()) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'UNAUTHORIZED',
        });

      case 403:
        return Promise.reject({
          message: data.message || ERROR_MESSAGES.UNAUTHORIZED,
          code: 'FORBIDDEN',
        });

      case 404:
        return Promise.reject({
          message: data.message || ERROR_MESSAGES.NOT_FOUND,
          code: 'NOT_FOUND',
        });

      case 422:
        return Promise.reject({
          message: data.message || ERROR_MESSAGES.VALIDATION_ERROR,
          code: 'VALIDATION_ERROR',
          errors: data.errors || {},
        });

      case 500:
      case 502:
      case 503:
        return Promise.reject({
          message: data.message || ERROR_MESSAGES.SERVER_ERROR,
          code: 'SERVER_ERROR',
        });

      default:
        return Promise.reject({
          message: data.message || 'An error occurred',
          code: 'UNKNOWN_ERROR',
        });
    }
  }
);

// API methods
const api = {
  // Generic request methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),

  // File upload helper
  uploadFile: async (url, file, onProgress) => {
    // In dev mode, simulate file upload
    if (shouldUseMockData()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onProgress) onProgress(100);
      return {
        data: {
          success: true,
          image_url: 'https://via.placeholder.com/400',
          file_id: `file-${Date.now()}`,
        }
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Multiple file upload helper
  uploadFiles: async (url, files, onProgress) => {
    // In dev mode, simulate file upload
    if (shouldUseMockData()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (onProgress) onProgress(100);
      return {
        data: {
          success: true,
          images: files.map((_, i) => `https://via.placeholder.com/400?text=Image+${i + 1}`),
        }
      };
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
};

// Log development mode status
if (DEVELOPMENT_MODE && import.meta.env.MODE === 'development') {
  console.log('🔧 API Service: Development mode active with mock data');
}

export default api;