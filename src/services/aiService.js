import api from './api';

const aiService = {
  // Crop Disease Detection
  analyzeCropDisease: async (imageFile, metadata = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('crop_type', metadata.cropType || '');
    formData.append('symptoms', metadata.symptoms || '');
    formData.append('location', metadata.location || '');

    const response = await api.post('/ai/crop-disease/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getDiseaseRecommendations: async (diseaseId, context = {}) => {
    const response = await api.post('/ai/crop-disease/recommendations', {
      disease_id: diseaseId,
      severity: context.severity,
      crop_type: context.cropType,
      farm_size: context.farmSize,
      organic_preference: context.organicPreference,
      budget: context.budget
    });
    return response.data;
  },

  // Price Prediction
  predictCropPrices: async (priceData) => {
    const response = await api.post('/ai/price-prediction', {
      crop_type: priceData.cropType,
      location: priceData.location,
      quantity: priceData.quantity,
      quality_grade: priceData.qualityGrade,
      season: priceData.season,
      prediction_period: priceData.predictionPeriod || 30
    });
    return response.data;
  },

  getOptimalPricing: async (productData) => {
    const response = await api.post('/ai/optimal-pricing', {
      product_name: productData.name,
      category: productData.category,
      quality_grade: productData.qualityGrade,
      quantity: productData.quantity,
      location: productData.location,
      is_organic: productData.isOrganic,
      harvest_date: productData.harvestDate
    });
    return response.data;
  },

  // Farming Advice
  getFarmingAdvice: async (query, context = {}) => {
    const response = await api.post('/ai/farming-advice', {
      query: query,
      farm_type: context.farmType,
      crop_types: context.cropTypes,
      location: context.location,
      experience_level: context.experienceLevel,
      conversation_history: context.conversationHistory
    });
    return response.data;
  },

  // Soil Analysis
  analyzeSoil: async (imageFile, metadata = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('location', metadata.location || '');
    formData.append('crop_type', metadata.cropType || '');
    formData.append('previous_crops', JSON.stringify(metadata.previousCrops || []));

    const response = await api.post('/ai/soil-analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Yield Prediction
  predictCropYield: async (yieldData) => {
    const response = await api.post('/ai/yield-prediction', {
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
  },

  // Crop Recommendations
  getCropRecommendations: async (farmData) => {
    const response = await api.post('/ai/crop-recommendations', {
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
  },

  // Pest Detection
  detectPest: async (imageFile, metadata = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('crop_type', metadata.cropType || '');
    formData.append('location', metadata.location || '');
    formData.append('damage_description', metadata.damageDescription || '');

    const response = await api.post('/ai/pest-detection', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Farming Calendar
  generateFarmingCalendar: async (calendarData) => {
    const response = await api.post('/ai/farming-calendar', {
      crop_types: calendarData.cropTypes,
      location: calendarData.location,
      farm_size: calendarData.farmSize,
      start_date: calendarData.startDate,
      farming_method: calendarData.farmingMethod
    });
    return response.data;
  },

  // Farm Health Analysis
  analyzeFarmHealth: async (imageFile, metadata = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('farm_id', metadata.farmId || '');
    formData.append('crop_type', metadata.cropType || '');
    formData.append('capture_date', metadata.captureDate || new Date().toISOString());

    const response = await api.post('/ai/farm-health-analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Market Demand Predictions
  predictMarketDemand: async (demandData) => {
    const response = await api.post('/ai/market-demand', {
      crop_type: demandData.cropType,
      location: demandData.location,
      time_period: demandData.timePeriod,
      historical_data: demandData.historicalData
    });
    return response.data;
  },

  // Fertilizer Recommendations
  getFertilizerRecommendations: async (fertilizerData) => {
    const response = await api.post('/ai/fertilizer-recommendations', {
      crop_type: fertilizerData.cropType,
      soil_type: fertilizerData.soilType,
      soil_ph: fertilizerData.soilPH,
      nutrient_levels: fertilizerData.nutrientLevels,
      farm_size: fertilizerData.farmSize,
      organic_preference: fertilizerData.organicPreference,
      budget: fertilizerData.budget
    });
    return response.data;
  },

  // Crop Identification
  identifyCrop: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/ai/crop-identification', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Water Management
  getWaterManagementAdvice: async (waterData) => {
    const response = await api.post('/ai/water-management', {
      crop_type: waterData.cropType,
      farm_size: waterData.farmSize,
      soil_type: waterData.soilType,
      irrigation_system: waterData.irrigationSystem,
      water_source: waterData.waterSource,
      location: waterData.location,
      rainfall_data: waterData.rainfallData
    });
    return response.data;
  },

  // Harvest Readiness
  analyzeHarvestReadiness: async (imageFile, metadata = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('crop_type', metadata.cropType || '');
    formData.append('planting_date', metadata.plantingDate || '');
    formData.append('variety', metadata.variety || '');

    const response = await api.post('/ai/harvest-readiness', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Conversation History
  getConversationHistory: async (limit = 20) => {
    const response = await api.get(`/ai/conversations?limit=${limit}`);
    return response.data;
  },

  // Feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/ai/feedback', {
      recommendation_id: feedbackData.recommendationId,
      rating: feedbackData.rating,
      helpful: feedbackData.helpful,
      comments: feedbackData.comments,
      outcome: feedbackData.outcome
    });
    return response.data;
  },

  // Farm Analytics
  getFarmAnalytics: async (analyticsParams) => {
    const response = await api.post('/ai/farm-analytics', {
      farm_id: analyticsParams.farmId,
      time_period: analyticsParams.timePeriod,
      metrics: analyticsParams.metrics,
      include_predictions: analyticsParams.includePredictions
    });
    return response.data;
  }
};

export default aiService;