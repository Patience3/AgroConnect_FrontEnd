import { useState, useEffect } from 'react';
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import weatherService from '@/services/weatherService';
import { useAuthContext } from '@/context/AuthProvider';
import { formatDate } from '@/utils/helpers';

const FarmerWeatherInsights = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  const [location, setLocation] = useState({
    city: user?.location || 'Accra',
    lat: null,
    lon: null
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [agriculturalInsights, setAgriculturalInsights] = useState(null);
  const [plantingRecommendations, setPlantingRecommendations] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, [location.city]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get current weather
      const weather = await weatherService.getCurrentWeather({ city: location.city });
      setCurrentWeather(weather);

      // Get forecast
      const forecastData = await weatherService.getWeatherForecast({ city: location.city });
      setForecast(forecastData.forecast.slice(0, 8)); // Next 24 hours

      // Get agricultural insights
      if (weather.location) {
        const insights = await weatherService.getAgriculturalInsights({
          city: weather.location
        });
        setAgriculturalInsights(insights);

        // Get planting recommendations
        const recommendations = await weatherService.getPlantingRecommendations({
          city: weather.location,
          cropType: 'vegetables' // Can be dynamic based on user's crops
        });
        setPlantingRecommendations(recommendations);
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Unable to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  const handleLocationChange = (e) => {
    setLocation({ ...location, city: e.target.value });
  };

  const getWeatherIcon = (description) => {
    const lower = description?.toLowerCase() || '';
    if (lower.includes('rain')) return <CloudRain className="text-info" size={48} />;
    if (lower.includes('cloud')) return <Cloud className="text-neutral-400" size={48} />;
    if (lower.includes('clear') || lower.includes('sun')) return <Sun className="text-warning" size={48} />;
    return <Cloud className="text-neutral-400" size={48} />;
  };

  const getAlertLevel = (type) => {
    const levels = {
      high: { variant: 'error', label: 'High Risk' },
      medium: { variant: 'warning', label: 'Medium Risk' },
      low: { variant: 'info', label: 'Low Risk' },
      favorable: { variant: 'success', label: 'Favorable' }
    };
    return levels[type] || levels.low;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-neutral-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Weather Intelligence</h1>
          <p className="text-neutral-400">AI-powered weather insights for smart farming</p>
        </div>
        <Button
          icon={RefreshCw}
          onClick={handleRefresh}
          loading={refreshing}
          variant="secondary"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Location Selector */}
      <Card>
        <div className="flex items-center gap-4">
          <MapPin className="text-accent-cyan" size={24} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Your Location
            </label>
            <input
              type="text"
              value={location.city}
              onChange={handleLocationChange}
              onBlur={loadWeatherData}
              placeholder="Enter city name"
              className="input max-w-md"
            />
          </div>
        </div>
      </Card>

      {currentWeather && (
        <>
          {/* Current Weather */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Current Weather</h2>
                <p className="text-neutral-400 mb-4">
                  {currentWeather.location}, {currentWeather.country}
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-5xl font-bold price">{Math.round(currentWeather.temperature)}°C</p>
                    <p className="text-sm text-neutral-400 mt-2">
                      Feels like {Math.round(currentWeather.feels_like)}°C
                    </p>
                  </div>
                  <div className="border-l border-neutral-700 pl-6">
                    {getWeatherIcon(currentWeather.description)}
                    <p className="text-sm text-neutral-300 mt-2 capitalize">
                      {currentWeather.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-dark rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={20} className="text-info" />
                    <span className="text-sm text-neutral-400">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
                </div>

                <div className="p-4 bg-primary-dark rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind size={20} className="text-accent-cyan" />
                    <span className="text-sm text-neutral-400">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.wind_speed} m/s</p>
                </div>

                <div className="p-4 bg-primary-dark rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud size={20} className="text-neutral-400" />
                    <span className="text-sm text-neutral-400">Clouds</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.clouds}%</p>
                </div>

                <div className="p-4 bg-primary-dark rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-success" />
                    <span className="text-sm text-neutral-400">Pressure</span>
                  </div>
                  <p className="text-2xl font-bold">{currentWeather.pressure} hPa</p>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Agricultural Insights */}
          {agriculturalInsights && (
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Agricultural Insights
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agriculturalInsights.irrigation_advice && (
                  <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
                    <h3 className="font-semibold mb-2 text-info">💧 Irrigation Recommendation</h3>
                    <p className="text-sm text-neutral-300">{agriculturalInsights.irrigation_advice}</p>
                  </div>
                )}

                {agriculturalInsights.pest_risk && (
                  <div className={`p-4 border rounded-lg ${
                    agriculturalInsights.pest_risk === 'high' 
                      ? 'bg-error/10 border-error/30' 
                      : 'bg-warning/10 border-warning/30'
                  }`}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Pest & Disease Risk
                    </h3>
                    <Badge variant={getAlertLevel(agriculturalInsights.pest_risk).variant}>
                      {getAlertLevel(agriculturalInsights.pest_risk).label}
                    </Badge>
                    <p className="text-sm text-neutral-300 mt-2">
                      {agriculturalInsights.pest_advice}
                    </p>
                  </div>
                )}

                {agriculturalInsights.planting_conditions && (
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                    <h3 className="font-semibold mb-2 text-success">🌱 Planting Conditions</h3>
                    <Badge variant={getAlertLevel(agriculturalInsights.planting_conditions).variant}>
                      {getAlertLevel(agriculturalInsights.planting_conditions).label}
                    </Badge>
                    <p className="text-sm text-neutral-300 mt-2">
                      {agriculturalInsights.planting_advice}
                    </p>
                  </div>
                )}

                {agriculturalInsights.harvest_timing && (
                  <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                    <h3 className="font-semibold mb-2 text-accent-cyan">📅 Harvest Timing</h3>
                    <p className="text-sm text-neutral-300">{agriculturalInsights.harvest_timing}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Hourly Forecast */}
          <Card title="24-Hour Forecast">
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-2">
                {forecast.map((item, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-24 p-4 bg-primary-dark rounded-lg text-center"
                  >
                    <p className="text-xs text-neutral-400 mb-2">
                      {formatDate(item.date, 'HH:mm')}
                    </p>
                    {getWeatherIcon(item.description)}
                    <p className="text-lg font-bold mt-2">{Math.round(item.temperature)}°C</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {Math.round(item.probability_of_precipitation * 100)}% rain
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Planting Recommendations */}
          {plantingRecommendations && (
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                Smart Planting Recommendations
              </h2>

              <div className="space-y-4">
                {plantingRecommendations.recommended_crops && (
                  <div>
                    <h3 className="font-semibold mb-3 text-success">✓ Recommended Crops</h3>
                    <div className="flex flex-wrap gap-2">
                      {plantingRecommendations.recommended_crops.map((crop, index) => (
                        <Badge key={index} variant="success">{crop}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {plantingRecommendations.avoid_planting && (
                  <div>
                    <h3 className="font-semibold mb-3 text-error">✗ Avoid Planting</h3>
                    <div className="flex flex-wrap gap-2">
                      {plantingRecommendations.avoid_planting.map((crop, index) => (
                        <Badge key={index} variant="error">{crop}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {plantingRecommendations.best_planting_window && (
                  <Alert variant="info">
                    <p className="font-semibold mb-1">Best Planting Window</p>
                    <p className="text-sm">{plantingRecommendations.best_planting_window}</p>
                  </Alert>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default FarmerWeatherInsights;