// aiService.js
// Service for AI-powered features including crop disease detection, price prediction, and farming advice

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Configure axios instance with auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const aiService = {
  /**
   * Analyze crop disease from image
   * @param {File} imageFile - Image file of the crop
   * @param {Object} metadata - Additional metadata (crop type, location, etc.)
   * @returns {Promise} Disease analysis results
   */
  analyzeCropDisease: async (imageFile, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('crop_type', metadata.cropType || '');
      formData.append('symptoms', metadata.symptoms || '');
      formData.append('location', metadata.location || '');

      const response = await apiClient.post('/ai/crop-disease/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get treatment recommendations for identified disease
   * @param {string} diseaseId - Disease identifier
   * @param {Object} context - Additional context (severity, farm conditions, etc.)
   * @returns {Promise} Treatment recommendations
   */
  getDiseaseRecommendations: async (diseaseId, context = {}) => {
    try {
      const response = await apiClient.post('/ai/crop-disease/recommendations', {
        disease_id: diseaseId,
        severity: context.severity,
        crop_type: context.cropType,
        farm_size: context.farmSize,
        organic_preference: context.organicPreference,
        budget: context.budget
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Predict crop prices based on historical data and market trends
   * @param {Object} priceData - Crop and market data
   * @returns {Promise} Price predictions
   */
  predictCropPrices: async (priceData) => {
    try {
      const response = await apiClient.post('/ai/price-prediction', {
        crop_type: priceData.cropType,
        location: priceData.location,
        quantity: priceData.quantity,
        quality_grade: priceData.qualityGrade,
        season: priceData.season,
        prediction_period: priceData.predictionPeriod || 30
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get optimal pricing recommendation for a product
   * @param {Object} productData - Product details
   * @returns {Promise} Pricing recommendations
   */
  getOptimalPricing: async (productData) => {
    try {
      const response = await apiClient.post('/ai/optimal-pricing', {
        product_name: productData.name,
        category: productData.category,
        quality_grade: productData.qualityGrade,
        quantity: productData.quantity,
        location: productData.location,
        is_organic: productData.isOrganic,
        harvest_date: productData.harvestDate
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get personalized farming advice using AI chatbot
   * @param {string} query - Farmer's question
   * @param {Object} context - User context (farm details, previous conversations, etc.)
   * @returns {Promise} AI-generated advice
   */
  getFarmingAdvice: async (query, context = {}) => {
    try {
      const response = await apiClient.post('/ai/farming-advice', {
        query: query,
        farm_type: context.farmType,
        crop_types: context.cropTypes,
        location: context.location,
        experience_level: context.experienceLevel,
        conversation_history: context.conversationHistory
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Analyze soil from image and provide recommendations
   * @param {File} imageFile - Soil image
   * @param {Object} metadata - Soil metadata
   * @returns {Promise} Soil analysis results
   */
  analyzeSoil: async (imageFile, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('location', metadata.location || '');
      formData.append('crop_type', metadata.cropType || '');
      formData.append('previous_crops', JSON.stringify(metadata.previousCrops || []));

      const response = await apiClient.post('/ai/soil-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get crop yield prediction
   * @param {Object} yieldData - Data for yield prediction
   * @returns {Promise} Yield predictions
   */
  predictCropYield: async (yieldData) => {
    try {
      const response = await apiClient.post('/ai/yield-prediction', {
        crop_type: yieldData.cropType,
        farm_size: yieldData.farmSize,
        soil_type: yieldData.soilType,
        planting_date: yieldData.plantingDate,
        farming_method: yieldData.farmingMethod,
        fertilizer_usage: yieldData.fertilizerUsage,
        irrigation_type: yieldData.irrigationType,
        location: yieldData.location,
        historical_yield: yieldData.historicalYield
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get personalized crop recommendations
   * @param {Object} farmData - Farm characteristics
   * @returns {Promise} Crop recommendations
   */
  getCropRecommendations: async (farmData) => {
    try {
      const response = await apiClient.post('/ai/crop-recommendations', {
        location: farmData.location,
        soil_type: farmData.soilType,
        farm_size: farmData.farmSize,
        water_availability: farmData.waterAvailability,
        budget: farmData.budget,
        experience_level: farmData.experienceLevel,
        market_access: farmData.marketAccess,
        season: farmData.season
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Detect pests from image
   * @param {File} imageFile - Image of pest or damage
   * @param {Object} metadata - Additional context
   * @returns {Promise} Pest identification and recommendations
   */
  detectPest: async (imageFile, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('crop_type', metadata.cropType || '');
      formData.append('location', metadata.location || '');
      formData.append('damage_description', metadata.damageDescription || '');

      const response = await apiClient.post('/ai/pest-detection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Generate farming calendar based on crop and location
   * @param {Object} calendarData - Data for calendar generation
   * @returns {Promise} Personalized farming calendar
   */
  generateFarmingCalendar: async (calendarData) => {
    try {
      const response = await apiClient.post('/ai/farming-calendar', {
        crop_types: calendarData.cropTypes,
        location: calendarData.location,
        farm_size: calendarData.farmSize,
        start_date: calendarData.startDate,
        farming_method: calendarData.farmingMethod
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Analyze farm image for health assessment
   * @param {File} imageFile - Aerial or field image
   * @param {Object} metadata - Farm metadata
   * @returns {Promise} Farm health analysis
   */
  analyzeFarmHealth: async (imageFile, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('farm_id', metadata.farmId || '');
      formData.append('crop_type', metadata.cropType || '');
      formData.append('capture_date', metadata.captureDate || new Date().toISOString());

      const response = await apiClient.post('/ai/farm-health-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get market demand predictions
   * @param {Object} demandData - Market and crop data
   * @returns {Promise} Demand predictions
   */
  predictMarketDemand: async (demandData) => {
    try {
      const response = await apiClient.post('/ai/market-demand', {
        crop_type: demandData.cropType,
        location: demandData.location,
        time_period: demandData.timePeriod,
        historical_data: demandData.historicalData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get fertilizer recommendations using AI
   * @param {Object} fertilizerData - Soil and crop data
   * @returns {Promise} Fertilizer recommendations
   */
  getFertilizerRecommendations: async (fertilizerData) => {
    try {
      const response = await apiClient.post('/ai/fertilizer-recommendations', {
        crop_type: fertilizerData.cropType,
        soil_type: fertilizerData.soilType,
        soil_ph: fertilizerData.soilPH,
        nutrient_levels: fertilizerData.nutrientLevels,
        farm_size: fertilizerData.farmSize,
        organic_preference: fertilizerData.organicPreference,
        budget: fertilizerData.budget
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Identify crop from image
   * @param {File} imageFile - Crop image
   * @returns {Promise} Crop identification results
   */
  identifyCrop: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await apiClient.post('/ai/crop-identification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get water management recommendations
   * @param {Object} waterData - Farm and crop data
   * @returns {Promise} Water management advice
   */
  getWaterManagementAdvice: async (waterData) => {
    try {
      const response = await apiClient.post('/ai/water-management', {
        crop_type: waterData.cropType,
        farm_size: waterData.farmSize,
        soil_type: waterData.soilType,
        irrigation_system: waterData.irrigationSystem,
        water_source: waterData.waterSource,
        location: waterData.location,
        rainfall_data: waterData.rainfallData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Analyze harvest readiness from image
   * @param {File} imageFile - Crop image
   * @param {Object} metadata - Crop metadata
   * @returns {Promise} Harvest readiness analysis
   */
  analyzeHarvestReadiness: async (imageFile, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('crop_type', metadata.cropType || '');
      formData.append('planting_date', metadata.plantingDate || '');
      formData.append('variety', metadata.variety || '');

      const response = await apiClient.post('/ai/harvest-readiness', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get conversation history with AI assistant
   * @param {number} limit - Number of conversations to retrieve
   * @returns {Promise} Conversation history
   */
  getConversationHistory: async (limit = 20) => {
    try {
      const response = await apiClient.get(`/ai/conversations?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Save user feedback on AI recommendations
   * @param {Object} feedbackData - Feedback details
   * @returns {Promise} Feedback response
   */
  submitFeedback: async (feedbackData) => {
    try {
      const response = await apiClient.post('/ai/feedback', {
        recommendation_id: feedbackData.recommendationId,
        rating: feedbackData.rating,
        helpful: feedbackData.helpful,
        comments: feedbackData.comments,
        outcome: feedbackData.outcome
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get AI-powered farm analytics
   * @param {Object} analyticsParams - Parameters for analytics
   * @returns {Promise} Farm analytics data
   */
  getFarmAnalytics: async (analyticsParams) => {
    try {
      const response = await apiClient.post('/ai/farm-analytics', {
        farm_id: analyticsParams.farmId,
        time_period: analyticsParams.timePeriod,
        metrics: analyticsParams.metrics,
        include_predictions: analyticsParams.includePredictions
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default aiService;