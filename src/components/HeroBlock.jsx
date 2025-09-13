import React from "react";

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
}) => {
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
    lg:flex-row lg:justify-between lg:items-center lg:p-10 p-5 
    ${loading ? "bg-[#272541ff] animate-pulse" : ""}`}
        style={
          !loading
            ? {
                backgroundImage: `
            url('src/assets/bg-today-small.svg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {loading ? (
          <>
            {/* Skeleton for Location + Date */}
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <SkeletonBox className="h-6 w-40" />
              <SkeletonBox className="h-4 w-28" />
            </div>
            <div className="flex items-center justify-center gap-4">
              <img
                src="src/assets/icon-loading.svg"
                alt=""
                className="h-8 w-8 animate-spin"
              />
              <span className="text-white">Loading...</span>
            </div>
            {/* Skeleton for Weather Info */}
            <div className="flex items-center justify-center gap-4">
              <SkeletonBox className="h-28 w-28" />
              <SkeletonBox className="h-12 w-24" />
            </div>
          </>
        ) : (
          <>
            {/* Location + Date */}
            <div className="text-center lg:text-left">
              <h1 className="text-white text-2xl sm:text-3xl font-bold">
                {city}, {country}
              </h1>
              <h3 className="text-gray-300 text-sm sm:text-base">
                {formattedTime}
              </h3>
            </div>

            {/* Weather Info */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={`src/assets/icon-${iconName}.webp`}
                alt="Weather icon"
                className="w-32 sm:w-32 lg:w-36"
              />
              <h1 className="text-white text-6xl sm:text-6xl lg:text-7xl font-bold bricolage-grotesque italic">
                {apparent_temperature}&#176;C
              </h1>
            </div>
          </>
        )}
      </div>

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        {[
          { label: "Feels like", value: `${temperature_2m}°C` },
          { label: "Humidity", value: `${relative_humidity_2m}%` },
          { label: "Wind", value: `${wind_speed_10m} km/h` },
          { label: "Precipitation", value: `${precipitation} mm` },
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
