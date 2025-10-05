// src/api/api.js

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const DAILY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for daily data
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for geocoding

// In-memory cache object
const cache = {};

/**
 * Generate a cache key for requests
 */
const generateCacheKey = (url, params) => {
  const sortedParams = new URLSearchParams(params);
  // Sort parameters for consistent key generation
  const sortedKeys = [...sortedParams.keys()].sort();
  const sortedParamString = sortedKeys
    .map((key) => `${key}=${sortedParams.get(key)}`)
    .join("&");
  return `${url}?${sortedParamString}`;
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = (timestamp, duration) => {
  return Date.now() - timestamp < duration;
};

/**
 * Get data from cache if available and valid
 */
const getFromCache = (key, duration) => {
  const cachedItem = cache[key];
  if (cachedItem && isCacheValid(cachedItem.timestamp, duration)) {
    console.log(`Cache HIT for key: ${key}`);
    return cachedItem.data;
  }
  console.log(`Cache MISS for key: ${key}`);
  return null;
};

/**
 * Store data in cache
 */
const setCache = (key, data) => {
  cache[key] = {
    data: data,
    timestamp: Date.now(),
  };
  console.log(`Cache SET for key: ${key}`);
};

/**
 * Fetch weather data by latitude and longitude with caching
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
      daily:
        "temperature_2m_min,temperature_2m_max,weather_code,sunrise,sunset",
      hourly: "temperature_2m,weather_code",
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,is_day,visibility,pressure_msl",
      timezone: "auto",
    });

    const cacheKey = generateCacheKey(WEATHER_BASE_URL, params);

    // Check cache first for current weather data (shorter cache duration)
    const cachedData = getFromCache(cacheKey, CACHE_DURATION);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${WEATHER_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    // Cache the response
    setCache(cacheKey, data);

    return data;
  } catch (error) {
    console.error("Weather API Error:", error);
    return { error: true };
  }
};

/**
 * Fetch cities by name (geocoding) with caching
 */
export const searchCity = async (cityName) => {
  try {
    const params = new URLSearchParams({
      name: cityName,
      count: 5, // number of results to return
    });

    const cacheKey = generateCacheKey(GEO_BASE_URL, params);

    // Check cache first for geocoding data (longer cache duration)
    const cachedData = getFromCache(cacheKey, GEO_CACHE_DURATION);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${GEO_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch city data");
    }

    const data = await response.json();
    const results = data.results || []; // return array of cities

    // Cache the response
    setCache(cacheKey, results);

    return results;
  } catch (error) {
    console.error("City Search API Error:", error);
    return [];
  }
};

/**
 * Clear expired cache entries to prevent memory leaks
 */
export const clearExpiredCache = () => {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    const item = cache[key];
    // Remove items older than 24 hours regardless of their type
    if (now - item.timestamp > 24 * 60 * 60 * 1000) {
      delete cache[key];
    }
  });
};

// Periodically clean up expired cache entries
setInterval(clearExpiredCache, 60 * 60 * 1000); // Run every hour
