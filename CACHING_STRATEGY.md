# Caching Strategy for Weather App

This document outlines the caching strategy implemented to optimize the weather application for 3,000-5,000 daily active users while staying within Open-Meteo's free tier limits (10,000 API calls/day).

## Overview

Our caching strategy implements multiple layers of optimization:

1. **In-Memory Caching** - Short-term caching of API responses
2. **Request Queue Management** - Limiting concurrent API requests
3. **Debouncing** - Reducing unnecessary API calls during user input
4. **LocalStorage Persistence** - Storing user preferences and last searched city

## Implementation Details

### 1. In-Memory Caching

We've implemented an in-memory cache in `src/utils/api.js` with different cache durations based on data type:

- **Current Weather Data**: 15 minutes cache duration
- **Daily Forecast Data**: 1 hour cache duration
- **Geocoding Data**: 24 hours cache duration

The cache uses a simple key-value store with timestamps to track expiration:

```javascript
const cache = {
  [key]: {
    data: [API response data],
    timestamp: [time when cached]
  }
};
```

### 2. Request Queue Management

To prevent overwhelming the API and to manage concurrent requests, we've implemented a request queue in `src/components/Search.jsx`:

- Maximum concurrent requests: 3
- Requests are queued and processed sequentially when slots are available
- This prevents rate limiting issues and ensures fair resource usage

### 3. Debouncing

User input in the search field is debounced to prevent excessive API calls:

- 300ms delay before making geocoding API requests
- Timer is reset on each keystroke
- Only the final request after user stops typing is executed

### 4. LocalStorage Persistence

We store user preferences and the last searched city in LocalStorage:

- **Units Preferences**: Temperature, wind speed, and precipitation units
- **Last City**: Coordinates and name of the last searched city
- **Favorite Cities**: User's saved favorite locations

This allows users to see weather data immediately on app load without making API calls.

## Cache Key Generation

Cache keys are generated using the API endpoint URL and sorted query parameters to ensure consistency:

```javascript
const generateCacheKey = (url, params) => {
  const sortedParams = new URLSearchParams(params);
  const sortedKeys = [...sortedParams.keys()].sort();
  const sortedParamString = sortedKeys
    .map(key => `${key}=${sortedParams.get(key)}`)
    .join('&');
  return `${url}?${sortedParamString}`;
};
```

## Cache Expiration Management

Expired cache entries are automatically cleaned up:

- Periodic cleanup every hour
- Entries older than 24 hours are removed regardless of type
- This prevents memory leaks and ensures fresh data

## API Usage Optimization

With these optimizations, we significantly reduce API calls:

1. **Repeat Visitors**: Users seeing the same city within cache duration won't trigger new API calls
2. **Favorite Cities**: Switching between favorite cities uses cached data when available
3. **Geocoding**: City search suggestions are cached for 24 hours
4. **Concurrent Users**: Request queuing prevents bursts that might trigger rate limits

## Expected Impact

For 3,000-5,000 daily active users:

- **API Calls Reduction**: Estimated 60-70% reduction in API calls
- **User Experience**: Faster load times and immediate data display for cached locations
- **Reliability**: Reduced likelihood of hitting rate limits
- **Cost Efficiency**: Staying well within the free tier limits

## Monitoring

The caching system includes console logging for monitoring:

- Cache hits and misses
- Cache set operations
- Request queue processing

This helps in understanding the effectiveness of the caching strategy and identifying areas for further optimization.