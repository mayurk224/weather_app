// src/api/api.js

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Fetch weather data by latitude and longitude
 */
export const getWeatherData = async (latitude, longitude) => {
  try {
    // If latitude & longitude not provided, try localStorage
    if (!latitude || !longitude) {
      const lastCity = localStorage.getItem("lastCity");

      if (lastCity) {
        const { lat, lon } = JSON.parse(lastCity);
        latitude = lat;
        longitude = lon;
      } else {
        throw new Error("No coordinates provided and no last city found");
      }
    }

    const params = new URLSearchParams({
      latitude,
      longitude,
      daily: "temperature_2m_min,temperature_2m_max,weather_code",
      hourly: "temperature_2m,weather_code",
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
      timezone: "auto",
    });

    const response = await fetch(`${WEATHER_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    return await response.json();
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
};

/**
 * Fetch cities by name (geocoding)
 */
export const searchCity = async (cityName) => {
  try {
    const params = new URLSearchParams({
      name: cityName,
      count: 5, // number of results to return
    });

    const response = await fetch(`${GEO_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch city data");
    }

    const data = await response.json();
    return data.results || []; // return array of cities
  } catch (error) {
    console.error("City Search API Error:", error);
    return [];
  }
};
