import axios from 'axios';
import api from './api';

// Get API keys from Vite environment
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Separate client for external weather API only
const weatherClient = axios.create({
  baseURL: WEATHER_API_URL,
  timeout: 10000,
});

const weatherService = {
  /**
   * Get current weather for a location
   * @param {Object} location - Location coordinates or city name
   * @returns {Promise} Current weather data
   */
  getCurrentWeather: async (location) => {
    const params = new URLSearchParams();
    params.append('appid', WEATHER_API_KEY);
    params.append('units', 'metric');

    if (location.lat && location.lon) {
      params.append('lat', location.lat);
      params.append('lon', location.lon);
    } else if (location.city) {
      params.append('q', location.city);
    }

    const response = await weatherClient.get(`/weather?${params.toString()}`);
    
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
  },

  /**
   * Get weather forecast for next 5 days
   * @param {Object} location - Location coordinates or city name
   * @returns {Promise} Weather forecast data
   */
  getWeatherForecast: async (location) => {
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
  },

  /**
   * Get agricultural weather insights (uses internal API)
   * @param {Object} location - Location data
   * @returns {Promise} Agricultural insights based on weather
   */
  getAgriculturalInsights: async (location) => {
    const response = await api.post('/weather/agricultural-insights', {
      latitude: location.lat,
      longitude: location.lon,
      city: location.city
    });
    return response.data;
  },

  /**
   * Get planting recommendations based on weather
   * @param {Object} params - Location and crop type
   * @returns {Promise} Planting recommendations
   */
  getPlantingRecommendations: async (params) => {
    const response = await api.post('/weather/planting-recommendations', {
      latitude: params.lat,
      longitude: params.lon,
      crop_type: params.cropType,
      farm_size: params.farmSize
    });
    return response.data;
  },

  /**
   * Get weather alerts for location
   * @param {Object} location - Location coordinates
   * @returns {Promise} Weather alerts
   */
  getWeatherAlerts: async (location) => {
    const response = await api.get('/weather/alerts', {
      params: {
        latitude: location.lat,
        longitude: location.lon
      }
    });
    return response.data;
  },

  /**
   * Get rainfall prediction for farming
   * @param {Object} location - Location data
   * @param {number} days - Number of days to predict
   * @returns {Promise} Rainfall predictions
   */
  getRainfallPrediction: async (location, days = 7) => {
    const response = await api.post('/weather/rainfall-prediction', {
      latitude: location.lat,
      longitude: location.lon,
      days: days
    });
    return response.data;
  },

  /**
   * Get soil moisture estimate based on weather
   * @param {Object} params - Location and soil type
   * @returns {Promise} Soil moisture data
   */
  getSoilMoistureEstimate: async (params) => {
    const response = await api.post('/weather/soil-moisture', {
      latitude: params.lat,
      longitude: params.lon,
      soil_type: params.soilType,
      crop_type: params.cropType
    });
    return response.data;
  },

  /**
   * Get harvest timing recommendations
   * @param {Object} params - Crop and location data
   * @returns {Promise} Harvest recommendations
   */
  getHarvestRecommendations: async (params) => {
    const response = await api.post('/weather/harvest-recommendations', {
      latitude: params.lat,
      longitude: params.lon,
      crop_type: params.cropType,
      planting_date: params.plantingDate,
      crop_stage: params.cropStage
    });
    return response.data;
  },

  /**
   * Get pest and disease risk based on weather conditions
   * @param {Object} params - Location and crop data
   * @returns {Promise} Risk assessment
   */
  getPestDiseaseRisk: async (params) => {
    const response = await api.post('/weather/pest-disease-risk', {
      latitude: params.lat,
      longitude: params.lon,
      crop_type: params.cropType,
      current_conditions: params.currentConditions
    });
    return response.data;
  },

  /**
   * Get irrigation recommendations based on weather
   * @param {Object} params - Farm and weather data
   * @returns {Promise} Irrigation recommendations
   */
  getIrrigationRecommendations: async (params) => {
    const response = await api.post('/weather/irrigation-recommendations', {
      latitude: params.lat,
      longitude: params.lon,
      crop_type: params.cropType,
      soil_type: params.soilType,
      farm_size: params.farmSize,
      irrigation_system: params.irrigationSystem
    });
    return response.data;
  },

  /**
   * Get historical weather data
   * @param {Object} params - Location and date range
   * @returns {Promise} Historical weather data
   */
  getHistoricalWeather: async (params) => {
    const response = await api.get('/weather/historical', {
      params: {
        latitude: params.lat,
        longitude: params.lon,
        start_date: params.startDate,
        end_date: params.endDate
      }
    });
    return response.data;
  },

  /**
   * Subscribe to weather alerts
   * @param {Object} alertData - Alert subscription data
   * @returns {Promise} Subscription response
   */
  subscribeToAlerts: async (alertData) => {
    const response = await api.post('/weather/alerts/subscribe', {
      latitude: alertData.lat,
      longitude: alertData.lon,
      alert_types: alertData.alertTypes,
      notification_method: alertData.notificationMethod
    });
    return response.data;
  },

  /**
   * Get weather-based task recommendations
   * @param {Object} params - Farm data
   * @returns {Promise} Task recommendations
   */
  getWeatherBasedTasks: async (params) => {
    const response = await api.post('/weather/task-recommendations', {
      latitude: params.lat,
      longitude: params.lon,
      crop_types: params.cropTypes,
      farm_operations: params.farmOperations
    });
    return response.data;
  },

  /**
   * Get climate trends for location
   * @param {Object} location - Location data
   * @param {string} period - Time period (month, season, year)
   * @returns {Promise} Climate trend data
   */
  getClimateTrends: async (location, period = 'month') => {
    const response = await api.get('/weather/climate-trends', {
      params: {
        latitude: location.lat,
        longitude: location.lon,
        period: period
      }
    });
    return response.data;
  },

  /**
   * Get UV index and sun protection recommendations
   * @param {Object} location - Location data
   * @returns {Promise} UV index data
   */
  getUVIndex: async (location) => {
    const response = await api.get('/weather/uv-index', {
      params: {
        latitude: location.lat,
        longitude: location.lon
      }
    });
    return response.data;
  }
};

export default weatherService;