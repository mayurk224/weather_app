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
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const dropdownRef = useRef(null);

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

  const tempUnit = getTemperatureUnit(units.temperature);
  const windUnit = getWindSpeedUnit(units.windSpeed);
  const precipUnit = getPrecipitationUnit(units.precipitation);

  // 🔹 Skeleton block (shimmer effect)
  const SkeletonBox = ({ className }) => (
    <div className={` animate-pulse ${className}`} />
  );

  return (
    <div>
      {/* Top Section */}
      <div
        className={`w-full rounded-lg overflow-hidden bg-cover bg-center 
    h-64 sm:h-72 
    flex flex-col justify-center items-center gap-4 
    sm:flex-row sm:justify-between sm:px-20 lg:items-center lg:p-10 p-5 
    ${loading ? "bg-[#272541ff] animate-pulse" : ""}`}
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
              className="h-8 w-8 animate-spin"
            />
            <span className="text-white">Loading...</span>
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
                  className="text-white hover:text-yellow-400 transition-colors p-2 h-8 flex items-center justify-center w-8 rounded-full hover:bg-white/10 absolute -right-8"
                  title="View favorite cities"
                >
                  <img
                    src="src/assets/icon-dropdown.svg"
                    alt=""
                    className={`${
                      showFavorites
                        ? "rotate-180 transition-all ease-in-out"
                        : "transition-all ease-in-out"
                    }`}
                  />
                </button>

                {showFavorites && (
                  <div
                    className="showFavoriteList absolute top-14 sm:left-3/4 left-1/2 -translate-x-1/2 
  mt-2 bg-[#272541ff] rounded-lg shadow-lg z-50 
  min-w-[250px] max-h-60 overflow-y-auto"
                  >
                    {favorites.length === 0 ? (
                      <div className="p-3 text-gray-400 text-center">
                        No favorite cities yet
                      </div>
                    ) : (
                      <div className="p-2">
                        <div className="text-gray-300 text-sm font-medium p-2 border-b border-gray-600">
                          Favorite Cities
                        </div>
                        {favorites.map((fav) => (
                          <div
                            key={`${fav.name}-${fav.country}`}
                            className="flex items-center justify-between p-2 hover:bg-[#302e4b] rounded-md group"
                          >
                            <div
                              className="flex-1 cursor-pointer text-white"
                              onClick={() => handleSelectFavorite(fav)}
                            >
                              {fav.name}, {fav.country}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFavorite(fav);
                              }}
                              className="ml-2 p-1 rounded-md hover:bg-red-500/20 transition-colors"
                              title="Remove from favorites"
                            >
                              <svg
                                className="w-4 h-4 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
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
              <h3 className="text-gray-300 cursor-default text-sm sm:text-base sm:text-start">
                {formattedTime}
              </h3>
            </div>

            {/* Weather Info */}
            <div className="flex items-center justify-center ">
              <img
                src={`src/assets/icon-${iconName}.webp`}
                alt="Weather icon"
                className="w-32 sm:w-32 lg:w-36"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        {[
          {
            label: "Feels like",
            value: `${displayApparentTemperature}${tempUnit}`,
          },
          { label: "Humidity", value: `${relative_humidity_2m}%` },
          { label: "Wind", value: `${displayWindSpeed} ${windUnit}` },
          {
            label: "Precipitation",
            value: `${displayPrecipitation} ${precipUnit}`,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-[#312f4bff] rounded-lg p-5 space-y-2 flex flex-col ${
              loading ? "animate-pulse bg-[#272541ff]" : ""
            }`}
          >
            <h3 className="text-gray-300 text-sm">{item.label}</h3>
            {loading ? (
              <h1 className="text-white text-2xl font-medium">—</h1>
            ) : (
              <h1 className="text-white text-2xl font-medium">{item.value}</h1>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroBlock;
