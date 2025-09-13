import React from "react";

// Map weather code to icon name
const getIconName = (code) => {
  if ([0, 1].includes(code)) return "sunny";
  if ([2].includes(code)) return "partly-cloudy";
  if ([3].includes(code)) return "overcast";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "overcast";
};

const DailyForecast = ({ data, loading }) => {
  // Skeleton component
  const SkeletonCard = () => (
    <div className="bg-[#272541ff] lg:p-3 p-2 rounded-lg flex flex-col items-center space-y-3 animate-pulse">
      <div className="h-4 w-12 "></div>
      <div className="w-20 h-20"></div>
      <div className="flex items-center justify-between w-full text-white text-sm space-x-2">
        <div className="h-4 w-10 "></div>
        <div className="h-4 w-10 "></div>
      </div>
    </div>
  );

  // Show skeletons when loading
  if (loading) {
    return (
      <div className="mt-10 space-y-5">
        <h1 className="text-white text-2xl font-bold">Daily Forecast</h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  // Ensure data and its properties are available before mapping
  if (!data || !data.time || data.time.length === 0) {
    return null; // Or show "No data available"
  }

  return (
    <div className="mt-10 space-y-5">
      <h1 className="text-white text-2xl font-bold">Daily Forecast</h1>

      {/* Responsive grid for forecast items */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {data.time.map((dateStr, idx) => {
          const dateObj = new Date(dateStr);
          const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const min = data.temperature_2m_min?.[idx] ?? "-";
          const max = data.temperature_2m_max?.[idx] ?? "-";
          const code = data.weather_code?.[idx];
          const icon = getIconName(Number(code));
          return (
            <div
              key={idx}
              className="bg-[#312f4b] lg:p-3 p-2 text-center rounded-lg flex flex-col items-center space-y-3 hover:scale-105 hover:bg-[#3d3b58] transition-transform duration-200"
            >
              <div className="h-4 w-12">
                <h3 className="text-white">{day}</h3>
              </div>
              <div className="w-20 h-20">
                <img
                  src={`src/assets/icon-${icon}.webp`}
                  alt={icon}
                  className=""
                />
              </div>
              <div className="flex items-center justify-between w-full text-white text-sm space-x-2">
                <div className="h-4 w-10 text-start">
                  <h3>{max}&#176;C</h3>
                </div>
                <div className="h-4 w-10 text-end">
                  <h3>{min}&#176;C</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
