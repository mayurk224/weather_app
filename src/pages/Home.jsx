import { useState, useEffect } from "react";
import { getWeatherData } from "../utils/api";
import ApiError from "../components/ApiError";
import DailyForecast from "../components/DailyForecast";
import HeroBlock from "../components/HeroBlock";
import HourlyForecast from "../components/HourlyForecast";
import Search from "../components/Search";
import UnitsCombobox from "../components/UnitsCombobox"; // Import UnitsCombobox

const Home = () => {
  const sampleData = {
    Tuesday: [
      { time: "3 PM", icon: "rain", temp: 20 },
      { time: "4 PM", icon: "partly_cloudy", temp: 20 },
    ],
  };
  const [weatherData, setWeatherData] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [units, setUnits] = useState(() => {
    const savedUnits = localStorage.getItem("weatherUnits");
    return savedUnits
      ? JSON.parse(savedUnits)
      : {
          system: "metric", // 'metric' or 'imperial'
          temperature: "celsius",
          windSpeed: "kmh",
          precipitation: "mm",
        };
  });

  // On mount, try to load last city from localStorage and fetch weather
  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      const { name, country, lat, lon } = JSON.parse(lastCity);
      getWeatherData(lat, lon).then((weather) => {
        if (weather && !weather.error) {
          setWeatherData({ city: { name, country }, weather });
          setApiError(false);
        } else {
          setApiError(true);
        }
      });
    }
  }, []);

  // Save units to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("weatherUnits", JSON.stringify(units));
  }, [units]);

  const handleWeatherData = (data) => {
    if (data && !data.error) {
      setWeatherData(data);
      setApiError(false);
    } else {
      setApiError(true);
      setWeatherData(null); // Clear weather data on error
    }
  };

  const handleUnitsChange = (newUnits) => {
    setUnits(newUnits);
  };

  const city = weatherData?.city || { name: "New York", country: "US" };
  const daily = weatherData?.weather?.daily || {};
  const current = weatherData?.weather?.current || {};
  const hourly = weatherData?.weather?.hourly || {};

  const {
    temperature_2m_min = [0],
    temperature_2m_max = [0],
    weather_code = [0],
    apparent_temperature = 0,
    precipitation = 0,
    relative_humidity_2m = 0,
    wind_speed_10m = 0,
  } = current || {}; // Ensure current is not null/undefined before destructuring
  const temperature_2m = current?.temperature_2m || 0;
  const time = current?.time || "N/A";

  const loading = !weatherData && !apiError; // Adjust loading state
  return (
    <div>
      {/* Added a container to center and constrain the max-width on large screens */}
      <div className="mx-auto max-w-[1440px] lg:px-8">
        <div className="lg:py-6 p-4">
          <div className="flex items-center justify-between">
            <div className="logo">
              <img
                src="src/assets/logo.svg"
                alt="Logo"
                className="h-9 lg:h-10"
              />
            </div>
            <div className="">
              <UnitsCombobox units={units} onUnitsChange={handleUnitsChange} />
            </div>
          </div>
          {apiError ? (
            <ApiError />
          ) : (
            <>
              <Search onWeatherData={handleWeatherData} />
              {/* This container now controls the two-column layout on desktop */}
              <div className="lg:mt-10 mt-8 lg:flex lg:space-x-8">
                {/* - Added lg:w-2/3 to set its width to 2/3 of the container on large screens.
              - Added mb-8 and lg:mb-0 to create vertical space on mobile but not on desktop.
            */}
                <div className="lg:w-2/3 mb-8 lg:mb-0">
                  <HeroBlock
                    city={city.name}
                    country={city.country}
                    apparent_temperature={apparent_temperature}
                    precipitation={precipitation}
                    relative_humidity_2m={relative_humidity_2m}
                    wind_speed_10m={wind_speed_10m}
                    weather_code={weather_code}
                    temperature_2m={temperature_2m}
                    time={time}
                    loading={loading}
                    units={units}
                    onWeatherData={handleWeatherData}
                  />
                  {/* Added a margin-top to space it from the HeroBlock above it */}
                  <div className="mt-8">
                    <DailyForecast
                      data={daily}
                      loading={loading}
                      units={units}
                    />
                  </div>
                </div>

                {/* - Added lg:w-1/3 to set its width to 1/3 of the container on large screens.
              - This ensures the layout is a predictable 2/3 + 1/3 split.
            */}
                <div className="lg:w-1/3">
                  <HourlyForecast
                    data={hourly}
                    loading={loading}
                    units={units}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
