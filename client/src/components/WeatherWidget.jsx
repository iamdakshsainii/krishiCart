import React, { useState } from "react";

const WeatherWidget = () => {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/weather?city=${city}`);
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to fetch weather");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-widget border p-4 rounded mb-4">
      <h2 className="font-bold mb-2">Weather Forecast</h2>
      <input
        className="border px-2 rounded mr-2"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        onClick={fetchWeather}
        className="bg-blue-600 text-white px-2 rounded"
      >
        Get Weather
      </button>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {data && !error && (
        <div className="mt-3">
          <div>🌡 Temperature: {data.main.temp}°C</div>
          <div>☁ Weather: {data.weather[0].description}</div>
          <div>💧 Humidity: {data.main.humidity}%</div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
