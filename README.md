# 🌦️ Weather Forecast Application

A modern, feature-rich weather application built with **React** and **Vite**, designed to efficiently serve **3,000–5,000 daily active users** while staying within **Open-Meteo's free tier limits (10,000 API calls/day)**.

🔗 **Live Demo:** [https://weatherflow-react.vercel.app]([https://weatherflow-react.vercel.app](https://weather-app-three-theta-38.vercel.app/))
💻 **GitHub Repository:** ([https://github.com/mayur-portfolio/weather-app](https://github.com/mayurk224/weather_app))

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
* **Responsive design** for all device sizes
* **Animated transitions** for smooth interactions
* **Unit customization** for temperature, wind speed, and precipitation
* **SpeedDial** for quick feature access
* **ScrollToTop** for seamless navigation

---

## ⚙️ Smart Caching System

To optimize API usage and improve performance, the app implements a **multi-layered caching strategy**:

### 🧠 In-Memory Caching

* **Current weather data**: Cached for 15 minutes
* **Daily forecast data**: Cached for 1 hour
* **Geocoding data**: Cached for 24 hours

### ⚡ Performance Optimizations

* **Request Queue Management**: Prevents API rate limiting
* **Debouncing (300ms)**: Avoids excessive API calls during input
* **LocalStorage Persistence**: Stores user preferences and favorites

For details, see [CACHING_STRATEGY.md](CACHING_STRATEGY.md).

---

## 🛠️ Technology Stack

### Frontend

* **React 18**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Lucide React**

### APIs

* **Open-Meteo API** (Weather data)
* **Nominatim OpenStreetMap API** (Reverse geocoding)
* **Web Speech API** (Voice search)

### Build & Development

* **ESLint**, **PostCSS**, **Workbox** (Service Worker)

---

## 🧩 Getting Started

### Prerequisites

* Node.js ≥ 16
* npm or yarn

### Installation

```bash
git clone https://github.com/mayur-portfolio/weather-app.git
cd weather_app
npm install
```

### Development

```bash
npm run dev
```

> App runs at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## ☁️ Deploying to Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) → “New Project” → Import Repository.
3. Vercel detects Vite settings automatically.
4. Click **Deploy** and get your live link (e.g., [weatherflow-react.vercel.app](https://weatherflow-react.vercel.app)).

Manual deployment:

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
├── utils/          # API and helper functions
├── assets/         # Images, icons
├── App.jsx         # Root component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

---

## 🌍 Browser Support

* Chrome, Firefox, Safari, Edge (latest 2 versions)

> Note: Voice search may have limited support on some browsers.

---

## ♿ Accessibility

Compliant with **WCAG 2.1**:

* Semantic HTML
* ARIA roles
* Keyboard navigation
* Color contrast
* Focus visibility

---

## ⚡ Performance

* **First Contentful Paint:** < 1.5s
* **Total Blocking Time:** < 200ms
* **Cumulative Layout Shift:** < 0.1

Optimizations include:

* Code splitting
* Lazy loading
* Caching
* Optimized assets

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 🪪 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.

---

## 💙 Acknowledgments

* [Open-Meteo](https://open-meteo.com/)
* [OpenStreetMap](https://www.openstreetmap.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Lucide Icons](https://lucide.dev/)
