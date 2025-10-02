// weatherService.js
// Service for fetching weather data and agricultural forecasts

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Configure axios instance for internal API
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure axios for external weather API
const weatherClient = axios.create({
  baseURL: WEATHER_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to internal API requests
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

const weatherService = {
  /**
   * Get current weather for a location
   * @param {Object} location - Location coordinates or city name
   * @returns {Promise} Current weather data
   */
  getCurrentWeather: async (location) => {
    try {
      let url = '/weather';
      const params = new URLSearchParams();
      params.append('appid', WEATHER_API_KEY);
      params.append('units', 'metric');

      if (location.lat && location.lon) {
        params.append('lat', location.lat);
        params.append('lon', location.lon);
      } else if (location.city) {
        params.append('q', location.city);
      }

      const response = await weatherClient.get(`${url}?${params.toString()}`);
      return {
        temperature: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        wind_speed: response.data.wind.speed,
        wind_direction: response.data.wind.deg,
        clouds: response.data.clouds.all,
        visibility: response.data.visibility,
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset,
        location: response.data.name,
        country: response.data.sys.country
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get weather forecast for next 5 days
   * @param {Object} location - Location coordinates or city name
   * @returns {Promise} Weather forecast data
   */
  getWeatherForecast: async (location) => {
    try {
      const params = new URLSearchParams();
      params.append('appid', WEATHER_API_KEY);
      params.append('units', 'metric');

      if (location.lat && location.lon) {
        params.append('lat', location.lat);
        params.append('lon', location.lon);
      } else if (location.city) {
        params.append('q', location.city);
      }

      const response = await weatherClient.get(`/forecast?${params.toString()}`);
      
      // Process forecast data
      const forecastList = response.data.list.map(item => ({
        timestamp: item.dt,
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        feels_like: item.main.feels_like,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        wind_speed: item.wind.speed,
        wind_direction: item.wind.deg,
        clouds: item.clouds.all,
        rain: item.rain?.['3h'] || 0,
        probability_of_precipitation: item.pop
      }));

      return {
        location: response.data.city.name,
        country: response.data.city.country,
        forecast: forecastList
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get agricultural weather insights
   * @param {Object} location - Location data
   * @returns {Promise} Agricultural insights based on weather
   */
  getAgriculturalInsights: async (location) => {
    try {
      const response = await apiClient.post('/weather/agricultural-insights', {
        latitude: location.lat,
        longitude: location.lon,
        city: location.city
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get planting recommendations based on weather
   * @param {Object} params - Location and crop type
   * @returns {Promise} Planting recommendations
   */
  getPlantingRecommendations: async (params) => {
    try {
      const response = await apiClient.post('/weather/planting-recommendations', {
        latitude: params.lat,
        longitude: params.lon,
        crop_type: params.cropType,
        farm_size: params.farmSize
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get weather alerts for location
   * @param {Object} location - Location coordinates
   * @returns {Promise} Weather alerts
   */
  getWeatherAlerts: async (location) => {
    try {
      const response = await apiClient.get('/weather/alerts', {
        params: {
          latitude: location.lat,
          longitude: location.lon
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get rainfall prediction for farming
   * @param {Object} location - Location data
   * @param {number} days - Number of days to predict
   * @returns {Promise} Rainfall predictions
   */
  getRainfallPrediction: async (location, days = 7) => {
    try {
      const response = await apiClient.post('/weather/rainfall-prediction', {
        latitude: location.lat,
        longitude: location.lon,
        days: days
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get soil moisture estimate based on weather
   * @param {Object} params - Location and soil type
   * @returns {Promise} Soil moisture data
   */
  getSoilMoistureEstimate: async (params) => {
    try {
      const response = await apiClient.post('/weather/soil-moisture', {
        latitude: params.lat,
        longitude: params.lon,
        soil_type: params.soilType,
        crop_type: params.cropType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get harvest timing recommendations
   * @param {Object} params - Crop and location data
   * @returns {Promise} Harvest recommendations
   */
  getHarvestRecommendations: async (params) => {
    try {
      const response = await apiClient.post('/weather/harvest-recommendations', {
        latitude: params.lat,
        longitude: params.lon,
        crop_type: params.cropType,
        planting_date: params.plantingDate,
        crop_stage: params.cropStage
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get pest and disease risk based on weather conditions
   * @param {Object} params - Location and crop data
   * @returns {Promise} Risk assessment
   */
  getPestDiseaseRisk: async (params) => {
    try {
      const response = await apiClient.post('/weather/pest-disease-risk', {
        latitude: params.lat,
        longitude: params.lon,
        crop_type: params.cropType,
        current_conditions: params.currentConditions
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get irrigation recommendations based on weather
   * @param {Object} params - Farm and weather data
   * @returns {Promise} Irrigation recommendations
   */
  getIrrigationRecommendations: async (params) => {
    try {
      const response = await apiClient.post('/weather/irrigation-recommendations', {
        latitude: params.lat,
        longitude: params.lon,
        crop_type: params.cropType,
        soil_type: params.soilType,
        farm_size: params.farmSize,
        irrigation_system: params.irrigationSystem
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get historical weather data
   * @param {Object} params - Location and date range
   * @returns {Promise} Historical weather data
   */
  getHistoricalWeather: async (params) => {
    try {
      const response = await apiClient.get('/weather/historical', {
        params: {
          latitude: params.lat,
          longitude: params.lon,
          start_date: params.startDate,
          end_date: params.endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Subscribe to weather alerts
   * @param {Object} alertData - Alert subscription data
   * @returns {Promise} Subscription response
   */
  subscribeToAlerts: async (alertData) => {
    try {
      const response = await apiClient.post('/weather/alerts/subscribe', {
        latitude: alertData.lat,
        longitude: alertData.lon,
        alert_types: alertData.alertTypes,
        notification_method: alertData.notificationMethod
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get weather-based task recommendations
   * @param {Object} params - Farm data
   * @returns {Promise} Task recommendations
   */
  getWeatherBasedTasks: async (params) => {
    try {
      const response = await apiClient.post('/weather/task-recommendations', {
        latitude: params.lat,
        longitude: params.lon,
        crop_types: params.cropTypes,
        farm_operations: params.farmOperations
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get climate trends for location
   * @param {Object} location - Location data
   * @param {string} period - Time period (month, season, year)
   * @returns {Promise} Climate trend data
   */
  getClimateTrends: async (location, period = 'month') => {
    try {
      const response = await apiClient.get('/weather/climate-trends', {
        params: {
          latitude: location.lat,
          longitude: location.lon,
          period: period
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get UV index and sun protection recommendations
   * @param {Object} location - Location data
   * @returns {Promise} UV index data
   */
  getUVIndex: async (location) => {
    try {
      const response = await apiClient.get('/weather/uv-index', {
        params: {
          latitude: location.lat,
          longitude: location.lon
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default weatherService;