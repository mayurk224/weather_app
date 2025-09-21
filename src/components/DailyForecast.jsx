import React from "react";
import { convertTemperature, getTemperatureUnit } from "../utils/units";

// Map weather code to icon name (No changes needed here)
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

const DailyForecast = ({ data, loading, units }) => {
  // Skeleton component - Updated to be flexible
  const SkeletonCard = () => (
    <div className="flex animate-pulse flex-col items-center space-y-2 rounded-lg bg-[#272541ff] p-3">
      {/* REMOVED: Fixed h-4, w-12. Let the skeleton mimic the text size. */}
      <div className="h-5 w-14 rounded bg-gray-700"></div>
      {/* REMOVED: Wrapper div. Size the image skeleton directly. */}
      <div className="h-16 w-16 rounded-full bg-gray-700"></div>
      <div className="flex w-full justify-between pt-1">
        {/* REMOVED: Fixed h-4, w-10. */}
        <div className="h-5 w-10 rounded bg-gray-700"></div>
        <div className="h-5 w-10 rounded bg-gray-700"></div>
      </div>
    </div>
  );

  // Consistent grid classes for loading and loaded states
  const gridClasses =
    "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4";

  if (loading) {
    return (
      <div className="mt-10 space-y-5">
        <h1 className="text-2xl font-bold text-white">Daily Forecast</h1>
        {/* CHANGED: Grid classes now match the data grid to prevent layout shift */}
        <div className={gridClasses}>
          {Array.from({ length: 7 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.time || data.time.length === 0) {
    return null;
  }

  const tempUnit = getTemperatureUnit(units.temperature);

  return (
    <div className="mt-10 space-y-5">
      <h1 className="text-2xl font-bold text-white">Daily Forecast</h1>

      <div className={gridClasses}>
        {data.time.map((dateStr, idx) => {
          const dateObj = new Date(dateStr);
          const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const minCelsius = data.temperature_2m_min?.[idx] ?? "-";
          const maxCelsius = data.temperature_2m_max?.[idx] ?? "-";
          const code = data.weather_code?.[idx];
          const icon = getIconName(Number(code));

          const displayMinTemp =
            minCelsius !== "-"
              ? Math.round(convertTemperature(minCelsius, units.temperature))
              : "-";
          const displayMaxTemp =
            maxCelsius !== "-"
              ? Math.round(convertTemperature(maxCelsius, units.temperature))
              : "-";

          return (
            <div
              key={idx}
              // REMOVED: min-w-[100px] as it's no longer needed. Adjusted spacing.
              className="flex flex-col items-center space-y-2 rounded-lg bg-[#312f4bff] p-3 text-center text-white transition-transform duration-200 hover:scale-105 hover:bg-[#3d3b58]"
            >
              {/* REMOVED: Fixed h-4 wrapper div. Let the h3 define its own height. */}
              <h3 className="font-medium">{day}</h3>

              {/* REMOVED: Fixed w-20 h-20 wrapper. Sized the image directly. */}
              <img
                src={`src/assets/icon-${icon}.webp`}
                alt={icon}
                className="h-16 w-16 object-contain" // Sizing applied directly to the image
              />

              {/* REMOVED: Fixed h-4 wrappers. Let content define height. */}
              <div className="flex w-full justify-between pt-1 text-sm">
                <span className="font-semibold">
                  {displayMaxTemp}
                  {tempUnit}
                </span>
                <span className="text-gray-400">
                  {displayMinTemp}
                  {tempUnit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
