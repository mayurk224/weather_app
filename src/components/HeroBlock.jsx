import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  convertTemperature,
  getTemperatureUnit,
  convertWindSpeed,
  getWindSpeedUnit,
  convertPrecipitation,
  getPrecipitationUnit,
} from "../utils/units";
import { getWeatherData } from "../utils/api";
import { Sparkles, Thermometer, ChevronDown, X } from "lucide-react";
import bgTodaySmall from "../assets/bg-today-small.svg";
import iconLoading from "../assets/icon-loading.svg";
import iconSunny from "../assets/icon-sunny.webp";
import iconPartlyCloudy from "../assets/icon-partly-cloudy.webp";
import iconOvercast from "../assets/icon-overcast.webp";
import iconFog from "../assets/icon-fog.webp";
import iconDrizzle from "../assets/icon-drizzle.webp";
import iconRain from "../assets/icon-rain.webp";
import iconSnow from "../assets/icon-snow.webp";
import iconStorm from "../assets/icon-storm.webp";

const HeroBlock = ({
  city,
  country,
  apparent_temperature,
  precipitation,
  relative_humidity_2m,
  wind_speed_10m,
  weather_code,
  temperature_2m,
  time,
  loading,
  units,
  onWeatherData,
  uv_index,
  visibility,
  pressure_msl,
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const dropdownRef = useRef(null);
  const favoritesButtonRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFavorites(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowFavorites(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggleDropdown = () => {
    if (!showFavorites) {
      const savedFavorites = localStorage.getItem("favoriteCities");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      } else {
        setFavorites([]);
      }
    }
    setShowFavorites(!showFavorites);
  };

  const removeFavorite = (cityToRemove) => {
    const cityKey = `${cityToRemove.name}-${cityToRemove.country}`;
    const updatedFavorites = favorites.filter(
      (fav) => `${fav.name}-${fav.country}` !== cityKey
    );
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const handleSelectFavorite = async (favoriteCity) => {
    setShowFavorites(false);
    try {
      const weather = await getWeatherData(
        favoriteCity.latitude,
        favoriteCity.longitude
      );
      localStorage.setItem(
        "lastCity",
        JSON.stringify({
          name: favoriteCity.name,
          country: favoriteCity.country,
          lat: favoriteCity.latitude,
          lon: favoriteCity.longitude,
        })
      );
      if (onWeatherData) {
        onWeatherData({
          city: {
            name: favoriteCity.name,
            country: favoriteCity.country,
            latitude: favoriteCity.latitude,
            longitude: favoriteCity.longitude,
          },
          weather,
        });
      }
    } catch (error) {
      console.error("Error loading favorite city weather:", error);
    }
  };

  let formattedTime = time;
  if (time && typeof time === "string" && time.length >= 10) {
    const dateObj = new Date(time);
    if (!isNaN(dateObj)) {
      formattedTime = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  function getIconName(code) {
    if ([0, 1].includes(code)) return "sunny";
    if ([2].includes(code)) return "partly-cloudy";
    if ([3].includes(code)) return "overcast";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "storm";
    return "overcast";
  }

  let code = Array.isArray(weather_code) ? weather_code[0] : weather_code;
  const iconName = getIconName(Number(code));
  
  // Create a mapping of icon names to imported images
  const iconMap = {
    "sunny": iconSunny,
    "partly-cloudy": iconPartlyCloudy,
    "overcast": iconOvercast,
    "fog": iconFog,
    "drizzle": iconDrizzle,
    "rain": iconRain,
    "snow": iconSnow,
    "storm": iconStorm
  };
  
  const currentIcon = iconMap[iconName] || iconOvercast;

  const displayTemperature = Math.round(
    convertTemperature(temperature_2m, units.temperature)
  );
  const displayApparentTemperature = Math.round(
    convertTemperature(apparent_temperature, units.temperature)
  );
  const displayWindSpeed = Math.round(
    convertWindSpeed(wind_speed_10m, units.windSpeed)
  );
  const displayPrecipitation = convertPrecipitation(
    precipitation,
    units.precipitation
  ).toFixed(1);

  const displayVisibility = (visibility / 1000).toFixed(1);
  const displayPressure = Math.round(pressure_msl);

  const tempUnit = getTemperatureUnit(units.temperature);
  const windUnit = getWindSpeedUnit(units.windSpeed);
  const precipUnit = getPrecipitationUnit(units.precipitation);

  // Animation variants
  const heroBlockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const statsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroBlockVariants}
      key={city} // Key helps re-trigger animation when city changes
    >
      {/* Top Section */}
      <div
        className={`w-full rounded-lg overflow-hidden bg-cover bg-center 
        h-64 sm:h-72 
        flex flex-col justify-center items-center gap-4 
        sm:flex-row sm:justify-between sm:px-20 lg:items-center lg:p-10 p-5 
        ${loading ? "bg-card animate-pulse" : ""}`}
        style={
          !loading
            ? {
                backgroundImage: `url('${bgTodaySmall}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 mx-auto">
            <img
              src={iconLoading}
              alt="Loading..."
              className="h-8 w-8 animate-spin icon-auto"
              aria-hidden="true"
            />
            <span className="text-primary">Loading...</span>
          </div>
        ) : (
          <>
            {/* Location + Date */}
            <div className="locationDate text-center lg:text-left relative">
              <div
                className="flex items-center justify-center lg:justify-start gap-2"
                ref={dropdownRef}
              >
                <h1 className="text-white text-2xl sm:text-3xl font-bold cursor-default">
                  {city}, {country}
                </h1>

                {/* Favorites Dropdown Button */}
                <motion.button
                  onClick={handleToggleDropdown}
                  ref={favoritesButtonRef}
                  whileTap={{ scale: 0.9 }}
                  className=" hover:text-accent transition-colors p-2 h-8 flex items-center justify-center w-8 rounded-full hover:bg-white/10 absolute -right-9"
                  title="View favorite cities"
                  aria-haspopup="true"
                  aria-expanded={showFavorites}
                  aria-label="Favorite cities"
                >
                  <motion.div animate={{ rotate: showFavorites ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showFavorites && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="showFavoriteList absolute top-14 sm:left-3/4 left-1/2 -translate-x-1/2 
                      mt-2 bg-card rounded-lg shadow-lg z-50 
                      w-64 max-h-60 overflow-y-auto border border-theme"
                      role="menu"
                      aria-label="Favorite cities menu"
                    >
                      {favorites.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 text-center text-secondary"
                        >
                          No favorite cities yet
                        </motion.div>
                      ) : (
                        <div className="py-2">
                          <AnimatePresence>
                            {favorites.map((fav) => (
                              <motion.div
                                key={`${fav.name}-${fav.country}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="px-4 py-2 flex items-center justify-between hover:bg-card-hover group"
                                role="menuitem"
                                tabIndex={-1}
                              >
                                <button
                                  onClick={() => handleSelectFavorite(fav)}
                                  className="flex-1 text-left text-primary hover:text-accent transition-colors"
                                >
                                  {fav.name}, {fav.country}
                                </button>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFavorite(fav);
                                  }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="ml-2 p-1 rounded-md hover:bg-red-500/20 transition-colors"
                                  title="Remove from favorites"
                                  aria-label={`Remove ${fav.name} from favorites`}
                                >
                                  <X className="w-4 h-4 text-accent" />
                                </motion.button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h3 className="text-white cursor-default text-sm sm:text-base sm:text-start">
                {formattedTime}
              </h3>
            </div>

            {/* Weather Info */}
            <motion.div
              className="flex items-center justify-center "
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.img
                src={currentIcon}
                alt={`Weather condition: ${iconName}`}
                className="w-32 sm:w-32 lg:w-36 icon-no-invert"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.h1
                className="text-white text-6xl sm:text-6xl lg:text-7xl font-bold bricolage-grotesque italic cursor-default"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {displayTemperature}
                {tempUnit}
              </motion.h1>
            </motion.div>
          </>
        )}
      </div>

      {/* Bottom Stats Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5"
        variants={statsGridVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            label: "Feels like",
            value: `${displayApparentTemperature}${tempUnit}`,
            id: "feels-like",
          },
          {
            label: "Humidity",
            value: `${relative_humidity_2m}%`,
            id: "humidity",
          },
          {
            label: "Wind",
            value: `${displayWindSpeed} ${windUnit}`,
            id: "wind",
          },
          {
            label: "Precipitation",
            value: `${displayPrecipitation} ${precipUnit}`,
            id: "precipitation",
          },
          { label: "UV Index", value: uv_index, id: "uv-index" },
          {
            label: "Visibility",
            value: `${displayVisibility} km`,
            id: "visibility",
          },
          {
            label: "Pressure",
            value: `${displayPressure} hPa`,
            id: "pressure",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={statItemVariants}
            className={`bg-card-hover rounded-lg p-5 space-y-2 flex flex-col ${
              loading ? "animate-pulse bg-card" : ""
            }`}
            role="region"
            aria-labelledby={`${item.id}-label`}
          >
            <h3 id={`${item.id}-label`} className="text-secondary text-sm">
              {item.label}
            </h3>
            {loading ? (
              <h1 className="text-primary text-2xl font-medium">—</h1>
            ) : (
              <h1
                className="text-primary text-2xl font-medium"
                aria-live="polite"
              >
                {item.value}
              </h1>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HeroBlock;
