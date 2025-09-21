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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!data?.time || !data?.temperature_2m) return;

    const grouped = {};
    const dayLabels = [];
    const now = new Date();

    data.time.forEach((timeStr, idx) => {
      const date = new Date(timeStr);
      const key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

      // For today, only include upcoming hours
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
  }, [data, units.temperature]); // Add units.temperature to dependency array

  const handleSelect = (dayKey) => {
    setSelectedDay(dayKey);
    setIsOpen(false);
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="flex items-center justify-between bg-[#312f4bff] border border-gray-600 rounded-lg px-4 py-3 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="w-16 h-5 bg-gray-700 rounded"></div>
      </div>
      <div className="w-8 h-5 bg-gray-700 rounded"></div>
    </div>
  );

  const tempUnit = getTemperatureUnit(units.temperature);

  return (
    <div className="mt-10 lg:mt-0 bg-[#272541ff] rounded-lg lg:w-1/3 w-full">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-white text-lg font-medium">Hourly forecast</h2>
        {/* Day Selector */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-[#312f4bff] border border-gray-600 rounded-lg px-3 py-2 text-white hover:bg-[#3d3b5eff] transition-colors"
          >
            <span className="text-sm font-medium">
              {groupedData[selectedDay]?.label || "Loading..."}
            </span>
            <img
              src="src/assets/icon-dropdown.svg"
              alt="Dropdown"
              className={`w-4 h-4 ml-1 text-gray-300 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <ul className="absolute right-0 mt-1 w-40 bg-[#312f4bff] border border-gray-600 rounded-lg shadow-lg z-10">
              {days.map((dayKey) => (
                <li
                  key={dayKey}
                  onClick={() => handleSelect(dayKey)}
                  className="px-3 py-2 text-sm text-white hover:bg-[#3d3b5eff] cursor-pointer"
                >
                  {groupedData[dayKey].label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="hourlyContainer space-y-2 rounded-t-lg rounded-b-lg max-h-[80vh] overflow-y-auto pl-5 pr-3 pb-5 lg:h-[77vh]">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : groupedData[selectedDay]?.hours.map((hour, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-[#312f4bff] hover:bg-[#3d3b5eff] border border-gray-600 rounded-lg px-4 py-3"
              >
                <div className="flex items-center space-x-3">
                  <img src={hour.icon} alt="icon" className="w-10 h-10" />
                  <span className="text-white text-lg font-medium">
                    {hour.time}
                  </span>
                </div>
                <span className="text-white text-md font-semibold">
                  {hour.temp}
                  {tempUnit}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
