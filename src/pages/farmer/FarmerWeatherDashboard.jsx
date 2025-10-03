import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, MapPin, Calendar, AlertTriangle, TrendingUp, Leaf, RefreshCw } from 'lucide-react';

const FarmerWeatherDashboard = () => {
  const [location, setLocation] = useState({ city: 'Accra' });
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Mock weather data for demonstration
      setCurrentWeather({
        location: location.city,
        country: 'Ghana',
        temperature: 28,
        feels_like: 32,
        humidity: 75,
        wind_speed: 5.5,
        visibility: 10000,
        description: 'partly cloudy',
        clouds: 40
      });

      // Mock forecast
      const mockForecast = Array.from({ length: 8 }, (_, i) => ({
        date: new Date(Date.now() + i * 3 * 60 * 60 * 1000),
        temperature: 28 + Math.random() * 4 - 2,
        description: i % 3 === 0 ? 'rain' : 'clear',
        probability_of_precipitation: Math.random() * 0.4
      }));
      setForecast(mockForecast);

      setIsLoading(false);
    } catch (err) {
      setError('Failed to load weather data');
      setIsLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (searchCity.trim()) {
      setLocation({ city: searchCity.trim() });
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('rain')) return <CloudRain className="text-info" size={48} />;
    if (desc.includes('cloud')) return <Cloud className="text-neutral-400" size={48} />;
    if (desc.includes('clear') || desc.includes('sun')) return <Sun className="text-warning" size={48} />;
    return <Cloud className="text-neutral-400" size={48} />;
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'planting':
        return <Leaf className="text-success" size={20} />;
      case 'irrigation':
        return <Droplets className="text-info" size={20} />;
      case 'harvest':
        return <TrendingUp className="text-warning" size={20} />;
      default:
        return <AlertTriangle className="text-warning" size={20} />;
    }
  };

  const recommendations = [
    {
      type: 'planting',
      priority: 'high',
      description: 'Optimal conditions for planting leafy vegetables. Soil moisture is adequate.',
      best_time: 'Early morning'
    },
    {
      type: 'irrigation',
      priority: 'medium',
      description: 'Light irrigation recommended in 2 days based on forecast.',
      best_time: 'Evening'
    },
    {
      type: 'harvest',
      priority: 'low',
      description: 'Good weather for harvesting root vegetables over the next 3 days.',
      best_time: 'Mid-morning'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-teal border-t-accent-cyan rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-neutral-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Weather & Climate Insights</h1>
        <p className="text-neutral-400">Real-time weather and AI-powered farming recommendations</p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-4">
          <p className="text-error">{error}</p>
        </div>
      )}

      <div className="bg-primary-light rounded-lg p-6 border border-neutral-800">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full px-4 py-2 bg-primary-dark border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-accent-teal"
            />
          </div>
          <button
            onClick={handleLocationSearch}
            className="px-6 py-2 bg-accent-cyan text-primary-dark font-medium rounded-lg hover:bg-accent-teal transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {currentWeather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-primary-light rounded-lg p-6 border border-neutral-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Current Weather</h2>
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin size={16} />
                  <span>{currentWeather.location}, {currentWeather.country}</span>
                </div>
              </div>
              {getWeatherIcon(currentWeather.description)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-primary-dark rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 mb-2">
                  <Sun size={16} />
                  <span className="text-sm">Temperature</span>
                </div>
                <p className="text-3xl font-bold">{Math.round(currentWeather.temperature)}°C</p>
                <p className="text-sm text-neutral-500 mt-1">Feels like {Math.round(currentWeather.feels_like)}°C</p>
              </div>

              <div className="p-4 bg-primary-dark rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 mb-2">
                  <Droplets size={16} />
                  <span className="text-sm">Humidity</span>
                </div>
                <p className="text-3xl font-bold">{currentWeather.humidity}%</p>
              </div>

              <div className="p-4 bg-primary-dark rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 mb-2">
                  <Wind size={16} />
                  <span className="text-sm">Wind Speed</span>
                </div>
                <p className="text-3xl font-bold">{currentWeather.wind_speed.toFixed(1)}</p>
                <p className="text-sm text-neutral-500 mt-1">m/s</p>
              </div>

              <div className="p-4 bg-primary-dark rounded-lg">
                <div className="flex items-center gap-2 text-neutral-400 mb-2">
                  <Eye size={16} />
                  <span className="text-sm">Visibility</span>
                </div>
                <p className="text-3xl font-bold">{(currentWeather.visibility / 1000).toFixed(1)}</p>
                <p className="text-sm text-neutral-500 mt-1">km</p>
              </div>
            </div>

            <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
              <p className="text-accent-cyan font-medium capitalize">{currentWeather.description}</p>
            </div>
          </div>

          <div className="bg-primary-light rounded-lg p-6 border border-neutral-800">
            <h3 className="text-lg font-semibold mb-4">Weather Alerts</h3>
            <div className="space-y-3">
              {currentWeather.humidity > 80 && (
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">High Humidity</p>
                      <p className="text-xs text-neutral-400 mt-1">Risk of fungal diseases. Monitor crops closely.</p>
                    </div>
                  </div>
                </div>
              )}

              {currentWeather.wind_speed > 10 && (
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Strong Winds</p>
                      <p className="text-xs text-neutral-400 mt-1">Secure loose items and protect young plants.</p>
                    </div>
                  </div>
                </div>
              )}

              {currentWeather.temperature > 35 && (
                <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-error">Heat Warning</p>
                      <p className="text-xs text-neutral-400 mt-1">Increase irrigation and provide shade.</p>
                    </div>
                  </div>
                </div>
              )}

              {currentWeather.humidity <= 80 && currentWeather.wind_speed <= 10 && currentWeather.temperature <= 35 && (
                <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sun size={16} className="text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-success">Favorable Conditions</p>
                      <p className="text-xs text-neutral-400 mt-1">Good weather for farming activities.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary-light rounded-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold mb-4">24-Hour Forecast</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {forecast.map((item, index) => {
              const hour = new Date(item.date).getHours();
              const displayHour = hour.toString().padStart(2, '0') + ':00';
              
              return (
                <div key={index} className="flex-shrink-0 w-24 p-4 bg-primary-dark rounded-lg text-center">
                  <p className="text-xs text-neutral-400 mb-2">{displayHour}</p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(item.description)}
                  </div>
                  <p className="text-2xl font-bold my-2">{Math.round(item.temperature)}°</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-info">
                    <Droplets size={12} />
                    <span>{Math.round(item.probability_of_precipitation * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-primary-light rounded-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold mb-4">AI-Powered Farming Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-primary-dark rounded-lg border border-accent-teal/30">
              <div className="flex items-start gap-3 mb-3">
                {getRecommendationIcon(rec.type)}
                <div>
                  <h4 className="font-semibold capitalize">{rec.type} Recommendation</h4>
                  <p className="text-xs text-neutral-500 mt-1">{rec.priority} priority</p>
                </div>
              </div>
              <p className="text-sm text-neutral-300 mb-3">{rec.description}</p>
              <div className="flex items-center gap-2 text-xs text-accent-cyan">
                <Calendar size={12} />
                <span>Best time: {rec.best_time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={loadWeatherData}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-light text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh Weather
        </button>
        <button className="px-4 py-2 bg-primary-light text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors">
          Get Planting Advice
        </button>
        <button className="px-4 py-2 bg-primary-light text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors">
          Irrigation Schedule
        </button>
      </div>
    </div>
  );
};

export default FarmerWeatherDashboard;