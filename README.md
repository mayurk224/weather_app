# Weather App with Smart Caching

This is a weather application optimized to efficiently serve 3,000-5,000 daily active users while staying within Open-Meteo's free tier limits (10,000 API calls/day).

## Features

- Real-time weather data
- 7-day forecasts
- Sunrise/sunset times
- Location-based weather
- Voice search capability
- Favorite cities
- Theme switching (light/dark mode)

## Optimizations

This application implements several caching and optimization strategies to minimize API usage:

1. **In-Memory Caching**: Weather data is cached for 15 minutes, geocoding data for 24 hours
2. **Request Queue Management**: Limits concurrent API requests to prevent rate limiting
3. **Debouncing**: Reduces unnecessary API calls during user input
4. **LocalStorage Persistence**: Stores user preferences and last searched city

See [CACHING_STRATEGY.md](CACHING_STRATEGY.md) for detailed implementation information.

## Tech Stack

- React with Vite
- Tailwind CSS for styling
- Open-Meteo API for weather data
- Nominatim OpenStreetMap API for reverse geocoding

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.