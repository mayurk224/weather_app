import React, { useEffect, useState } from "react";
import { convertTemperature, getTemperatureUnit } from "../utils/units";

// Weather code to icon mapping
const weatherIcons = {
  0: "src/assets/icon-sunny.webp", // clear sky
  1: "src/assets/icon-partly-cloudy.webp", // mainly clear
  2: "src/assets/icon-partly-cloudy.webp",
  3: "src/assets/icon-overcast.webp",
  45: "src/assets/icon-fog.webp",
  48: "src/assets/icon-fog.webp",
  51: "src/assets/icon-drizzle.webp",
  61: "src/assets/icon-rain.webp",
  71: "src/assets/icon-snow.webp",
  95: "src/assets/icon-storm.webp",
};

export default function HourlyForecast({ data, loading, units }) {
  const [groupedData, setGroupedData] = useState({});
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State for dropdown

  useEffect(() => {
    if (!data?.time || !data?.temperature_2m) return;

    const grouped = {};
    const dayLabels = [];
    const now = new Date();

    data.time.forEach((timeStr, idx) => {
      const date = new Date(timeStr);
      const key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const weekday =
        date.toDateString() === now.toDateString()
          ? "Today"
          : date.toLocaleDateString("en-US", { weekday: "long" });

      const isToday = date.toDateString() === now.toDateString();
      if (isToday && date.getHours() <= now.getHours()) return;

      if (!grouped[key]) {
        grouped[key] = { label: weekday, hours: [] };
        dayLabels.push(key);
      }

      grouped[key].hours.push({
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
          timeZone: "UTC",
        }),
        temp: Math.round(
          convertTemperature(data.temperature_2m[idx], units.temperature)
        ),
        icon: weatherIcons[data.weather_code[idx]] || weatherIcons[0],
      });
    });

    setGroupedData(grouped);
    setDays(dayLabels);
    if (dayLabels.length > 0) setSelectedDay(dayLabels[0]);
  }, [data, units.temperature]);

  // Handler for dropdown selection
  const handleSelect = (dayKey) => {
    setSelectedDay(dayKey);
    setIsOpen(false);
  };

  const SkeletonCard = () => (
    <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-[#312f4bff] px-4 py-3 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-700"></div>
        <div className="h-5 w-16 rounded bg-gray-700"></div>
      </div>
      <div className="h-5 w-8 rounded bg-gray-700"></div>
    </div>
  );

  const tempUnit = getTemperatureUnit(units.temperature);

  return (
    <div className="mt-10 w-full rounded-lg bg-[#272541ff] h-[650px] lg:mt-0">
      {/* Header with Title and Dropdown */}
      <div className="flex items-center justify-between p-5">
        <h2 className="text-lg font-medium text-white">Hourly forecast</h2>

        {/* Original Dropdown Selector */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center rounded-lg border border-gray-600 bg-[#312f4bff] px-3 py-2 text-white transition-colors hover:bg-[#3d3b5eff]"
          >
            <span className="text-sm font-medium">
              {groupedData[selectedDay]?.label || "Loading..."}
            </span>
            <img
              src="src/assets/icon-dropdown.svg"
              alt="Dropdown"
              className={`ml-1 h-4 w-4 text-gray-300 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <ul className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-600 bg-[#312f4bff] shadow-lg">
              {days.map((dayKey) => (
                <li
                  key={dayKey}
                  onClick={() => handleSelect(dayKey)}
                  className="cursor-pointer px-3 py-2 text-sm text-white hover:bg-[#3d3b5eff]"
                >
                  {groupedData[dayKey].label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Improved: Adaptive Height Container */}
      <div className="hourlyContainer space-y-2 overflow-y-auto h-[560px] rounded-b-lg sm:pr-4 sm:pl-5 sm:py-5 p-5">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : groupedData[selectedDay]?.hours.map((hour, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-gray-600 bg-[#312f4bff] px-4 py-3 transition-colors hover:bg-[#3d3b5eff]"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={hour.icon}
                    alt="weather icon"
                    className="h-10 w-10"
                  />
                  <span className="text-lg font-medium text-white">
                    {hour.time}
                  </span>
                </div>
                <span className="text-md font-semibold text-white">
                  {hour.temp}
                  {tempUnit}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
