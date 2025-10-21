# 🌦️ Weather Forecast Application

A modern, feature-rich weather application built with **React** and **Vite**, designed to efficiently serve **3,000–5,000 daily active users** while staying within **Open-Meteo's free tier limits (10,000 API calls/day)**.

🔗 **Live Demo:** [https://weather-app-three-theta-38.vercel.app](https://weather-app-three-theta-38.vercel.app)
💻 **GitHub Repository:** [https://github.com/mayurk224/weather_app](https://github.com/mayurk224/weather_app)

![Weather App Preview](src/assets/preview.png)

---

## 🚀 Key Features

### 🌤️ Weather Information

* **Real-time weather data** with current conditions
* **7-day detailed forecasts** with min/max temperatures
* **Hourly forecasts** for detailed planning
* **Sunrise and sunset times** for your location
* **Comprehensive weather metrics** including UV index, visibility, and pressure

### 📍 Search & Location

* **Smart city search** with auto-suggestions
* **Voice search capability** for hands-free operation
* **GPS location detection** for instant local weather
* **Favorite cities** for quick access to multiple locations

### 🧭 User Experience

* **Light/Dark theme switching** with system preference detection
* **Responsive design** for all screen sizes
* **Animated transitions** for smooth interactions
* **Unit customization** for temperature, wind speed, and precipitation
* **SpeedDial menu** for quick access to core features
* **ScrollToTop button** for enhanced navigation

---

## ⚙️ Smart Caching System

To optimize API usage and improve performance, the app implements a **multi-layered caching strategy**:

### 🧠 In-Memory Caching

* **Current weather data:** Cached for 15 minutes
* **Daily forecast data:** Cached for 1 hour
* **Geocoding data:** Cached for 24 hours

### ⚡ Performance Optimizations

* **Request Queue Management:** Prevents API rate limiting
* **Input Debouncing (300ms):** Reduces unnecessary API calls
* **LocalStorage Persistence:** Saves user preferences and last searched city

For detailed caching logic, see [CACHING_STRATEGY.md](CACHING_STRATEGY.md).

---

## 🛠️ Technology Stack

### Frontend

* **React 18** with hooks and functional components
* **Vite** for ultra-fast development and build performance
* **Tailwind CSS** for responsive, modern UI design
* **Framer Motion** for animations
* **Lucide React** for clean and consistent icons

### APIs

* **Open-Meteo API** — real-time and forecast weather data
* **Nominatim OpenStreetMap API** — reverse geocoding
* **Web Speech API** — enables voice search functionality

### Build & Development Tools

* **ESLint** for code quality
* **PostCSS** for CSS processing
* **Workbox** for service worker integration

---

## 🧩 Getting Started

### Prerequisites

* Node.js ≥ 16
* npm or yarn

### Installation

```bash
git clone https://github.com/mayurk224/weather_app.git
cd weather_app
npm install
```

### Development

```bash
npm run dev
```

> The application will run at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## ☁️ Deployment (Vercel)

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com), log in, and click **New Project**.
3. Import your GitHub repository.
4. Vercel automatically detects Vite configuration.
5. Click **Deploy** to publish your app.

Manual deployment via CLI:

```bash
npm install -g vercel
vercel
```

---

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── utils/          # Helper functions & API handlers
├── assets/         # Static assets (images, icons)
├── App.jsx         # Main application component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

---

## 🌍 Browser Support

* Chrome (latest 2 versions)
* Firefox (latest 2 versions)
* Safari (latest 2 versions)
* Edge (latest 2 versions)

> Note: Voice search support may vary across browsers.

---

## ♿ Accessibility

This app follows **WCAG 2.1** standards:

* Semantic HTML structure
* Proper ARIA attributes
* Full keyboard navigation
* High color contrast
* Clear focus states

---

## ⚡ Performance

* **First Contentful Paint:** < 1.5s
* **Total Blocking Time:** < 200ms
* **Cumulative Layout Shift:** < 0.1

Optimizations include:

* Code splitting & lazy loading
* Efficient caching
* Minified assets
* Responsive image loading

---

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch:

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch:

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 🪪 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💙 Acknowledgments

* [Open-Meteo](https://open-meteo.com/) — Free weather API
* [OpenStreetMap](https://www.openstreetmap.org/) — Geocoding services
* [Tailwind CSS](https://tailwindcss.com/) — Modern CSS framework
* [Framer Motion](https://www.framer.com/motion/) — Animation library
* [Lucide Icons](https://lucide.dev/) — Icon pack
