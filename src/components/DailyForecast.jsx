import React from "react";

const DailyForecast = ({
  temperature_2m_min,
  temperature_2m_max,
  weathercode,
}) => {
  return (
    <div>
      <div className="mt-10 space-y-5">
        <h1 className="text-white text-2xl font-bold">Daily Forecast</h1>

        {/* Responsive grid for forecast items */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((day, idx) => (
            <div
              key={idx}
              className="bg-[#312f4b] lg:p-5 p-2 rounded-lg flex flex-col items-center space-y-3 hover:scale-105 hover:bg-[#3d3b58] transition-transform duration-200"
            >
              <h3 className="text-white">{day}</h3>
              <img src="src/assets/icon-sunny.webp" alt="" className="w-28" />
              <div className="flex items-center justify-between w-full text-white">
                <h3>2&#176;C</h3>
                <h3>-1&#176;C</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyForecast;
