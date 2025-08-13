import React, { useState, useEffect } from "react";
import {
  FaCloudSun,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaSearch,
  FaMapMarkerAlt,
  FaEye,
  FaWind,
} from "react-icons/fa";

const WeatherWidget = () => {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Your deployed backend URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  // Weather icon selector
  const getWeatherIcon = (weatherMain, weatherId) => {
    const iconClass = "text-4xl";

    if (weatherId >= 200 && weatherId < 300) {
      return <FaCloudRain className={`${iconClass} text-gray-600`} />;
    } else if (weatherId >= 300 && weatherId < 600) {
      return <FaCloudRain className={`${iconClass} text-blue-500`} />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <FaSnowflake className={`${iconClass} text-blue-300`} />;
    } else if (weatherId >= 700 && weatherId < 800) {
      return <FaCloud className={`${iconClass} text-gray-400`} />;
    } else if (weatherId === 800) {
      return <FaSun className={`${iconClass} text-yellow-500`} />;
    } else if (weatherId > 800) {
      return <FaCloudSun className={`${iconClass} text-blue-400`} />;
    }

    return <FaCloudSun className={`${iconClass} text-blue-400`} />;
  };

  // Background gradient based on weather condition
  const getBackgroundGradient = (weatherId) => {
    if (weatherId >= 200 && weatherId < 600) {
      return "from-gray-400 to-gray-600"; // Rainy
    } else if (weatherId >= 600 && weatherId < 700) {
      return "from-blue-200 to-blue-400"; // Snow
    } else if (weatherId === 800) {
      return "from-yellow-300 to-orange-400"; // Clear
    } else if (weatherId > 800) {
      return "from-blue-300 to-blue-500"; // Cloudy
    }
    return "from-blue-400 to-blue-600"; // Default
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");

      // Using deployed backend URL from env
      const res = await fetch(`${API_URL}/weather?city=${city}`);

      if (!res.ok) {
        const errData = await res.json();
        console.error("Weather API error:", errData);
        setError(errData.error || "Failed to fetch weather");
        return;
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Network error:", err);
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather on mount
  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCloudSun className="text-2xl" />
              <h2 className="text-2xl font-bold">Weather Forecast</h2>
            </div>
            <div className="text-blue-100 text-sm">
              Perfect farming weather updates
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-6 bg-blue-50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
            >
              <FaSearch />
              {loading ? "Searching..." : "Get Weather"}
            </button>
          </form>
        </div>

        {/* Weather Display */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Fetching weather data...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 font-semibold">{error}</p>
                <p className="text-red-500 text-sm mt-1">
                  Please check the city name and try again
                </p>
              </div>
            </div>
          )}

          {data && !error && (
            <div className="space-y-6">
              {/* Main Weather Card */}
              <div
                className={`bg-gradient-to-r ${getBackgroundGradient(
                  data.weather[0].id
                )} rounded-xl p-6 text-white`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left Side - Main Info */}
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <FaMapMarkerAlt className="text-xl" />
                      <h3 className="text-2xl font-bold">
                        {data.name}, {data.sys.country}
                      </h3>
                    </div>
                    <div className="text-5xl font-bold mb-2">
                      {Math.round(data.main.temp)}°C
                    </div>
                    <div className="text-xl capitalize mb-2">
                      {data.weather[0].description}
                    </div>
                    <div className="text-sm opacity-90">
                      Feels like {Math.round(data.main.feels_like)}°C
                    </div>
                  </div>

                  {/* Right Side - Weather Icon */}
                  <div className="flex justify-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-6">
                      {getWeatherIcon(data.weather[0].main, data.weather[0].id)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-blue-600 text-2xl mb-2">💧</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-lg font-bold text-gray-800">
                    {data.main.humidity}%
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-blue-600 text-2xl mb-2">🌡️</div>
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="text-lg font-bold text-gray-800">
                    {data.main.pressure} hPa
                  </div>
                </div>

                {data.visibility && (
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <FaEye className="text-blue-600 text-2xl mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Visibility</div>
                    <div className="text-lg font-bold text-gray-800">
                      {(data.visibility / 1000).toFixed(1)} km
                    </div>
                  </div>
                )}

                {data.wind && (
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <FaWind className="text-blue-600 text-2xl mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Wind Speed</div>
                    <div className="text-lg font-bold text-gray-800">
                      {data.wind.speed} m/s
                    </div>
                  </div>
                )}
              </div>

              {/* Temperature Range */}
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Min Temperature</div>
                    <div className="text-xl font-bold text-blue-800">
                      {Math.round(data.main.temp_min)}°C
                    </div>
                  </div>
                  <div className="h-12 w-px bg-blue-300"></div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Max Temperature</div>
                    <div className="text-xl font-bold text-blue-800">
                      {Math.round(data.main.temp_max)}°C
                    </div>
                  </div>
                </div>
              </div>

              {/* Farming Tips */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🌱 Farming Tips</h4>
                <p className="text-green-700 text-sm">
                  {data.main.humidity > 70
                    ? "High humidity - Good for leafy vegetables. Watch out for fungal diseases."
                    : data.main.humidity < 30
                    ? "Low humidity - Increase irrigation for better crop growth."
                    : "Perfect humidity levels for most crops. Great farming weather!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
