import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

// Placeholder icon mapping
const weatherIcons = {
  drizzle: "src/assets/icon-drizzle.webp",
  fog: "src/assets/icon-fog.webp",
  overcast: "src/assets/icon-overcast.webp",
  sunny: "src/assets/icon-sunny.webp",
  partly_cloudy: "src/assets/icon-partly-cloudy.webp",
  rain: "src/assets/icon-rain.webp",
  snow: "src/assets/icon-snow.webp",
  storm: "src/assets/icon-storm.webp",
};

export default function HourlyForecast({ data }) {
  const days = Object.keys(data); // e.g., ['Monday', 'Tuesday', ...]
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (day) => {
    setSelectedDay(day);
    setIsOpen(false);
  };

  return (
    <div className="mt-10 lg:mt-0 bg-[#272541ff] lg:p-5 p-4 rounded-lg lg:w-1/3 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Hourly forecast</h2>
        {/* Day Selector */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-[#312f4bff] border border-gray-600 rounded-lg px-3 py-2 text-white hover:bg-[#3d3b5eff] transition-colors"
          >
            <span className="text-sm font-medium">{selectedDay}</span>
            <img
              src="src/assets/icon-dropdown.svg"
              alt="Dropdown"
              className={`w-4 h-4 ml-1 text-gray-300 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <ul className="absolute right-0 mt-1 w-32 bg-[#312f4bff] border border-gray-600 rounded-lg shadow-lg z-10">
              {days.map((day) => (
                <li
                  key={day}
                  onClick={() => handleSelect(day)}
                  className="px-3 py-2 text-sm text-white hover:bg-[#3d3b5eff] cursor-pointer"
                >
                  {day}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {data[selectedDay].map((hour, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-[#312f4bff] hover:bg-[#3d3b5eff] border border-gray-600 rounded-lg px-4 py-3"
          >
            <div className="flex items-center space-x-3">
              <div className="">
                <img
                  src={weatherIcons[hour.icon]}
                  alt={hour.icon}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-white text-lg font-medium">
                {hour.time}
              </span>
            </div>
            <span className="text-white text-md font-semibold">
              {hour.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
