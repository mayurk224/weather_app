import React, { useState, useEffect, useRef } from "react";
import {
  convertTemperature,
  getTemperatureUnit,
  convertWindSpeed,
  getWindSpeedUnit,
  convertPrecipitation,
  getPrecipitationUnit,
} from "../utils/units";
import { getWeatherData } from "../utils/api";
import { Sparkles, Thermometer } from "lucide-react";

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
  loading, // 🔹 new prop to control skeleton
  units, // 🔹 new prop for units
  onWeatherData, // 🔹 new prop to update weather data when selecting favorite
  // New props for additional weather data
  uv_index,
  visibility,
  pressure_msl,
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const dropdownRef = useRef(null);
  const favoritesButtonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFavorites(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for favorites dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFavorites && e.key === "Escape") {
        setShowFavorites(false);
        favoritesButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showFavorites]);

  // Load favorites from localStorage when dropdown is opened
  const handleToggleDropdown = () => {
    if (!showFavorites) {
      // Fetch fresh data from localStorage when opening dropdown
      const savedFavorites = localStorage.getItem("favoriteCities");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      } else {
        setFavorites([]);
      }
    }
    setShowFavorites(!showFavorites);
  };

  // Handle removing a city from favorites
  const removeFavorite = (cityToRemove) => {
    const cityKey = `${cityToRemove.name}-${cityToRemove.country}`;
    const updatedFavorites = favorites.filter(
      (fav) => `${fav.name}-${fav.country}` !== cityKey
    );
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  // Handle selecting a favorite city
  const handleSelectFavorite = async (favoriteCity) => {
    setShowFavorites(false);

    try {
      const weather = await getWeatherData(
        favoriteCity.latitude,
        favoriteCity.longitude
      );

      // Save as last city
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
  // Format time string to 'Day, Mon Date, Year'
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

  // Map weather_code to icon name
  function getIconName(code) {
    if ([0, 1].includes(code)) return "sunny";
    if ([2].includes(code)) return "partly-cloudy";
    if ([3].includes(code)) return "overcast";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "storm";
    return "overcast"; // fallback
  }

  // weather_code can be array or number
  let code = Array.isArray(weather_code) ? weather_code[0] : weather_code;
  const iconName = getIconName(Number(code));

  // Convert values based on selected units
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
  ).toFixed(1); // Keep one decimal for precipitation

  // New conversions
  const displayVisibility = (visibility / 1000).toFixed(1); // Convert meters to kilometers
  const displayPressure = Math.round(pressure_msl); // Pressure in hPa

  const tempUnit = getTemperatureUnit(units.temperature);
  const windUnit = getWindSpeedUnit(units.windSpeed);
  const precipUnit = getPrecipitationUnit(units.precipitation);

  // 🔹 Skeleton block (shimmer effect)
  const SkeletonBox = ({ className }) => (
    <div className={` animate-pulse ${className}`} />
  );

  const [activeTab, setActiveTab] = useState("weather"); // Add this to your component

  return (
    <div>
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
                backgroundImage: `url('src/assets/bg-today-small.svg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {loading ? (
          // Show ONLY loader when loading
          <div className="flex flex-col items-center justify-center gap-4 mx-auto">
            <img
              src="src/assets/icon-loading.svg"
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
                <button
                  onClick={handleToggleDropdown}
                  ref={favoritesButtonRef}
                  className=" hover:text-accent transition-colors p-2 h-8 flex items-center justify-center w-8 rounded-full hover:bg-white/10 absolute -right-9"
                  title="View favorite cities"
                  aria-haspopup="true"
                  aria-expanded={showFavorites}
                  aria-label="Favorite cities"
                >
                  <img
                    src="src/assets/icon-dropdown.svg"
                    alt=""
                    className={` ${
                      showFavorites
                        ? "rotate-180 transition-all ease-in-out"
                        : "transition-all ease-in-out"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {showFavorites && (
                  <div
                    className="showFavoriteList absolute top-14 sm:left-3/4 left-1/2 -translate-x-1/2 
  mt-2 bg-card rounded-lg shadow-lg z-50 
  w-64 max-h-60 overflow-y-auto border border-theme"
                    role="menu"
                    aria-label="Favorite cities menu"
                  >
                    {favorites.length === 0 ? (
                      <div className="p-4 text-center text-secondary">
                        No favorite cities yet
                      </div>
                    ) : (
                      <div className="py-2">
                        {favorites.map((fav) => (
                          <div
                            key={`${fav.name}-${fav.country}`}
                            className="px-4 py-2 flex items-center justify-between hover:bg-card-hover group"
                            role="menuitem"
                            tabIndex={-1}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSelectFavorite(fav);
                              } else if (e.key === "Escape") {
                                setShowFavorites(false);
                                favoritesButtonRef.current?.focus();
                              }
                            }}
                          >
                            <button
                              onClick={() => handleSelectFavorite(fav)}
                              className="flex-1 text-left"
                            >
                              {fav.name}, {fav.country}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFavorite(fav);
                              }}
                              className="ml-2 p-1 rounded-md hover:bg-red-500/20 transition-colors"
                              title="Remove from favorites"
                              aria-label={`Remove ${fav.name} from favorites`}
                            >
                              <svg
                                className="w-4 h-4 text-accent"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <h3 className="text-white cursor-default text-sm sm:text-base sm:text-start">
                {formattedTime}
              </h3>
            </div>

            {/* Weather Info */}
            <div className="flex items-center justify-center ">
              <img
                src={`src/assets/icon-${iconName}.webp`}
                alt={`Weather condition: ${iconName}`}
                className="w-32 sm:w-32 lg:w-36 icon-no-invert"
              />
              <h1 className="text-white text-6xl sm:text-6xl lg:text-7xl font-bold bricolage-grotesque italic cursor-default">
                {displayTemperature}
                {tempUnit}
              </h1>
            </div>
          </>
        )}
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
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
          <div
            key={idx}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroBlock;
