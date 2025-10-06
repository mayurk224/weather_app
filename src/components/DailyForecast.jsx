import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
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
    <div className="flex animate-pulse flex-col items-center space-y-2 rounded-lg bg-card p-3">
      <div className="h-5 w-14 rounded bg-[var(--border-color)]"></div>
      <div className="h-16 w-16 rounded-full bg-[var(--border-color)]"></div>
      <div className="flex w-full justify-between pt-1">
        <div className="h-5 w-10 rounded bg-[var(--border-color)]"></div>
        <div className="h-5 w-10 rounded bg-[var(--border-color)]"></div>
      </div>
    </div>
  );

  // Consistent grid classes for loading and loaded states
  const gridClasses =
    "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4";

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Stagger children by 0.07 seconds
        delayChildren: 0.1, // Delay initial animation of children
      },
    },
  };

  // Animation variants for each individual forecast card
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="mt-10 space-y-5">
        <h1 className="text-2xl font-bold text-primary">Daily Forecast</h1>
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
      <h1 className="text-2xl font-bold text-primary">Daily Forecast</h1>

      <motion.div // Apply motion to the grid container
        className={gridClasses}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
            <motion.div // Apply motion to each forecast card
              key={idx}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                backgroundColor: "var(--card-hover-color-deeper)",
              }} // Slightly deeper hover color
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center space-y-2 rounded-lg bg-card-hover p-3 text-center text-primary border border-theme cursor-pointer"
              role="region"
              aria-label={`${day} forecast: High ${displayMaxTemp}${tempUnit}, Low ${displayMinTemp}${tempUnit}`}
            >
              <h3 className="font-medium">{day}</h3>
              <img
                src={`src/assets/icon-${icon}.webp`}
                alt={`Weather condition: ${icon}`}
                className="h-16 w-16 object-contain"
              />
              <div className="flex w-full justify-between pt-1 text-sm">
                <span className="font-semibold">
                  {displayMaxTemp}
                  {tempUnit}
                </span>
                <span className="text-secondary">
                  {displayMinTemp}
                  {tempUnit}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DailyForecast;
