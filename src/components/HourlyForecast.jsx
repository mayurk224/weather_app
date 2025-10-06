import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { convertTemperature, getTemperatureUnit } from "../utils/units";

// (Keep your weatherIcons mapping as is)
const weatherIcons = {
  0: "src/assets/icon-sunny.webp",
  1: "src/assets/icon-partly-cloudy.webp",
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    // (Data processing logic remains the same)
    if (!data?.time || !data?.temperature_2m) return;

    const grouped = {};
    const dayLabels = [];
    const now = new Date();

    data.time.forEach((timeStr, idx) => {
      const date = new Date(timeStr);
      const key = date.toISOString().split("T")[0];
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
    if (dayLabels.length > 0 && !selectedDay) setSelectedDay(dayLabels[0]);
  }, [data, units.temperature, selectedDay]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (dayKey) => {
    setSelectedDay(dayKey);
    setIsOpen(false);
  };

  const SkeletonCard = () => (
    // Skeleton card remains the same
    <div className="flex items-center justify-between rounded-lg border border-theme bg-card px-4 py-3 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-[var(--border-color)]"></div>
        <div className="h-5 w-16 rounded bg-[var(--border-color)]"></div>
      </div>
      <div className="h-5 w-8 rounded bg-[var(--border-color)]"></div>
    </div>
  );

  const tempUnit = getTemperatureUnit(units.temperature);

  // Animation Variants
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="mt-10 w-full rounded-lg bg-card h-[653px] lg:mt-0">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-lg font-medium text-primary">Hourly Forecast</h2>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center rounded-lg border border-theme bg-card-hover px-3 py-2 text-primary transition-colors hover:bg-button"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <span className="text-sm font-medium">
              {groupedData[selectedDay]?.label || "Loading..."}
            </span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <ChevronDown className="ml-1 h-4 w-4 text-secondary" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-lg border border-theme bg-card shadow-lg"
                role="menu"
              >
                {days.map((dayKey) => (
                  <li key={dayKey} role="none">
                    <button
                      onClick={() => handleSelect(dayKey)}
                      className="w-full text-left cursor-pointer px-3 py-2 text-sm text-primary hover:bg-card-hover"
                      role="menuitem"
                    >
                      {groupedData[dayKey].label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hourlyContainer h-[560px] space-y-2 overflow-y-auto p-5 sm:px-5 sm:py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay} // This key is crucial for re-triggering animations on day change
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-2"
          >
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, idx) => <SkeletonCard key={idx} />)
              : groupedData[selectedDay]?.hours.map((hour, idx) => (
                  <motion.div
                    key={idx}
                    variants={listItemVariants}
                    className="flex items-center justify-between rounded-lg border border-theme bg-card-hover px-4 py-3 transition-colors hover:bg-button"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={hour.icon} alt="" className="h-10 w-10" />
                      <span className="text-lg font-medium text-primary">
                        {hour.time}
                      </span>
                    </div>
                    <span className="text-md font-semibold text-primary">
                      {hour.temp}
                      {tempUnit}
                    </span>
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
