import axios from 'axios';
import { ERROR_MESSAGES } from '@/types';

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
  (config) => {
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
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
  uploadFile: (url, file, onProgress) => {
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
  uploadFiles: (url, files, onProgress) => {
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

export default api;