import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Functions ---

// A more robust and centralized date parsing function to avoid repetition.
const parseDate = (timeInput) => {
  if (!timeInput) return null;
  try {
    let date;
    if (typeof timeInput === "string") {
      // Handles ISO strings and strings with a space separator
      date = new Date(
        timeInput.includes("T") ? timeInput : timeInput.replace(" ", "T")
      );
    } else if (typeof timeInput === "number") {
      // Handle timestamp numbers
      date = new Date(timeInput);
    } else if (timeInput instanceof Date) {
      // Handle Date objects
      date = timeInput;
    } else {
      // Handle other cases by converting to string first
      date = new Date(timeInput.toString());
    }
    // Check if the date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
};

const formatTime = (timeInput) => {
  const date = parseDate(timeInput);
  if (!date) return "--:--";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Switched to 12-hour format for a friendlier look
  });
};

const calculateDaylightDuration = (sunrise, sunset) => {
  const sunriseTime = parseDate(sunrise);
  const sunsetTime = parseDate(sunset);
  if (!sunriseTime || !sunsetTime) return "--h --m";

  const diffMs = sunsetTime.getTime() - sunriseTime.getTime();
  if (diffMs < 0) return "--h --m";

  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

// --- Child Components ---

// Refined InfoCard with subtle hover effects
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 group transition-all duration-300 hover:bg-white/10 hover:border-white/20">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white/10 rounded-lg transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-medium text-white/70">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
  </div>
);

// Twinkling Star component for the night sky
const Star = ({ style }) => (
  <motion.div
    className="absolute bg-white rounded-full"
    style={style}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 1, 0.8, 0],
      scale: [0.5, 1, 0.8, 0.5],
    }}
    transition={{
      duration: Math.random() * 2 + 2,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      delay: Math.random() * 3,
    }}
  />
);

// --- Main Component ---

const SunriseSunset = ({ data, loading = false }) => {
  const [now, setNow] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const comboboxRef = useRef(null);

  // Update now state every minute
  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsComboboxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized values for performance
  const {
    sunrise,
    sunset,
    daylightDuration,
    sunPosition,
    timeStates,
    next7Days,
  } = useMemo(() => {
    // Generate next 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() + i);
      return {
        date,
        formatted: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        isToday: i === 0,
      };
    });

    // Safely access sunrise and sunset data
    const sunriseData =
      data && Array.isArray(data.sunrise)
        ? data.sunrise[selectedDayIndex]
        : null;
    const sunsetData =
      data && Array.isArray(data.sunset) ? data.sunset[selectedDayIndex] : null;

    const sunriseTime = parseDate(sunriseData);
    const sunsetTime = parseDate(sunsetData);

    const duration = calculateDaylightDuration(sunriseTime, sunsetTime);

    // Calculate sun position
    let position = 50; // Default to midday for future days
    if (sunriseTime && sunsetTime) {
      if (selectedDayIndex === 0) {
        if (now < sunriseTime) position = 0;
        else if (now > sunsetTime) position = 100;
        else {
          const totalMs = sunsetTime.getTime() - sunriseTime.getTime();
          const elapsedMs = now.getTime() - sunriseTime.getTime();
          position = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
        }
      }
    } else if (sunriseTime || sunsetTime) {
      // If we only have one time, set position to either beginning or end
      position = now < (sunriseTime || sunsetTime) ? 0 : 100;
    }

    // Determine time of day states
    const isNight =
      selectedDayIndex === 0 &&
      (!sunriseTime || !sunsetTime || now < sunriseTime || now > sunsetTime);
    const isDawn = selectedDayIndex === 0 && !isNight && position < 15;
    const isDusk = selectedDayIndex === 0 && !isNight && position > 85;

    return {
      sunrise: sunriseData,
      sunset: sunsetData,
      daylightDuration: duration,
      sunPosition: position,
      timeStates: { isNight, isDawn, isDusk },
      next7Days: days,
    };
  }, [data, selectedDayIndex, now]);

  const { isNight, isDawn, isDusk } = timeStates;

  // Pre-generate stars for night time
  const stars = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
      })),
    []
  );

  const getSkyGradient = () => {
    if (isNight) return "from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a]";
    if (isDawn) return "from-[#fcd5ce] via-[#f8b595] to-[#8e9aaf]";
    if (isDusk) return "from-[#e5989b] via-[#b5838d] to-[#6d6875]";
    return "from-[#81b2d9] via-[#6ca0c8] to-[#4281ae]";
  };

  // Check for valid data with proper parsing
  const hasValidData =
    sunrise && sunset && parseDate(sunrise) && parseDate(sunset);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-3xl p-8 w-full animate-pulse h-[450px]"></div>
    );
  }

  if (!hasValidData) {
    return (
      <div className="bg-slate-900 rounded-3xl p-8 w-full text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Solar Cycle</h3>
        <p className="text-white/60">Sunrise and sunset data not available.</p>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br ${getSkyGradient()} rounded-lg p-6 sm:p-8 w-full overflow-hidden shadow-2xl transition-all duration-[2000ms]`}
    >
      {/* Background Effects */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {stars.map((star, i) => (
              <Star key={i} style={star} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            Solar Cycle
          </h3>
          {/* Date Selector */}
          <div ref={comboboxRef} className="relative w-full sm:w-52">
            <button
              onClick={() => setIsComboboxOpen(!isComboboxOpen)}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-full border border-white/20 w-full hover:bg-white/20 transition-colors"
            >
              <span className="text-sm font-medium">
                {next7Days[selectedDayIndex]?.isToday
                  ? `Today`
                  : next7Days[selectedDayIndex]?.formatted}
              </span>
              <motion.div animate={{ rotate: isComboboxOpen ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-white/80" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isComboboxOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 z-20 overflow-hidden"
                >
                  {next7Days.map((day, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors ${
                        selectedDayIndex === index ? "bg-white/15" : ""
                      }`}
                      onClick={() => {
                        setSelectedDayIndex(index);
                        setIsComboboxOpen(false);
                      }}
                    >
                      {day.isToday ? `${day.formatted} (Today)` : day.formatted}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Sun Arc Visualization */}
        <div className="relative h-32 sm:h-40 mb-8">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 10,90 Q 100,0 190,90"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
          </svg>
          <motion.div
            className="absolute w-10 h-10"
            initial={false}
            animate={{
              left: `${sunPosition}%`,
              bottom: `${
                Math.pow(Math.sin((sunPosition / 100) * Math.PI), 0.8) * 35
              }px`,
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ transform: "translateX(-50%)" }}
          >
            <motion.div
              key={isNight ? "moon" : "sun"}
              className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {isNight ? (
                <>
                  <div className="absolute inset-0 bg-blue-300 rounded-full blur-xl opacity-50"></div>
                  <div className="relative bg-slate-400 w-full h-full rounded-full flex items-center justify-center">
                    <Moon
                      className="w-5 h-5 text-slate-800"
                      fill="currentColor"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-70"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 w-full h-full rounded-full flex items-center justify-center">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            icon={<Sunrise className="w-5 h-5 text-orange-300" />}
            label="Sunrise"
            value={formatTime(sunrise)}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5 text-yellow-300" />}
            label="Daylight"
            value={daylightDuration}
          />
          <InfoCard
            icon={<Sunset className="w-5 h-5 text-indigo-300" />}
            label="Sunset"
            value={formatTime(sunset)}
          />
        </div>

        {/* Current Time Indicator */}
        {selectedDayIndex === 0 && (
          <div className="mt-6 text-center text-xs text-white/70 font-medium">
            Current Time: {formatTime(now)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SunriseSunset;
