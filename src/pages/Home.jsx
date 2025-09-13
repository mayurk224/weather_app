import { useState, useEffect } from "react";
import { getWeatherData } from "../utils/api";
import ApiError from "../components/ApiError";
import DailyForecast from "../components/DailyForecast";
import HeroBlock from "../components/HeroBlock";
import HourlyForecast from "../components/HourlyForecast";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

const Home = () => {
  const sampleData = {
    Tuesday: [
      { time: "3 PM", icon: "rain", temp: 20 },
      { time: "4 PM", icon: "partly_cloudy", temp: 20 },
    ],
  };
  const [weatherData, setWeatherData] = useState(null);

  // On mount, try to load last city from localStorage and fetch weather
  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      const { name, country, lat, lon } = JSON.parse(lastCity);
      getWeatherData(lat, lon).then((weather) => {
        if (weather) {
          setWeatherData({ city: { name, country }, weather });
        }
      });
    }
  }, []);

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
  } = current;
  const temperature_2m = current.temperature_2m || 0;
  const time = current.time || "N/A";

  const loading = !weatherData;
  return (
    <div>
      <div className="lg:px-20 lg:py-6 p-4">
        <Navbar />
        {/* <ApiError /> */}
        <Search onWeatherData={(data) => setWeatherData(data)} />
        <div className="lg:mt-10 mt-8 lg:flex lg:space-x-5 lg:h-[90vh]">
          <div className="leftBlock">
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
            />
            <DailyForecast data={daily} loading={loading} />
          </div>
          <HourlyForecast data={hourly} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Home;
