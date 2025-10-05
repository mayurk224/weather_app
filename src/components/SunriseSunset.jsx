import React, { useState, useEffect, useMemo } from "react";
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react";

// --- Helper Functions ---
const formatTime = (timeInput) => {
  if (!timeInput) return "--:--";
  try {
    // Handle different time input formats
    let date;
    if (typeof timeInput === "string") {
      // Try parsing as ISO string first
      date = new Date(timeInput);
      // If that doesn't work, try other formats
      if (isNaN(date.getTime())) {
        date = new Date(timeInput.replace(" ", "T"));
      }
    } else {
      date = new Date(timeInput);
    }

    if (isNaN(date.getTime())) return "--:--";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
};

const calculateDaylightDuration = (sunrise, sunset) => {
  if (!sunrise || !sunset)
    return { hours: "--", minutes: "--", formatted: "--h --m" };

  try {
    // Handle different time input formats for sunrise/sunset
    let sunriseTime, sunsetTime;

    if (typeof sunrise === "string") {
      sunriseTime = new Date(sunrise);
      if (isNaN(sunriseTime.getTime())) {
        sunriseTime = new Date(sunrise.replace(" ", "T"));
      }
    } else {
      sunriseTime = new Date(sunrise);
    }

    if (typeof sunset === "string") {
      sunsetTime = new Date(sunset);
      if (isNaN(sunsetTime.getTime())) {
        sunsetTime = new Date(sunset.replace(" ", "T"));
      }
    } else {
      sunsetTime = new Date(sunset);
    }

    if (isNaN(sunriseTime.getTime()) || isNaN(sunsetTime.getTime())) {
      return { hours: "--", minutes: "--", formatted: "--h --m" };
    }

    const diffMs = sunsetTime.getTime() - sunriseTime.getTime();

    if (diffMs < 0) return { hours: "--", minutes: "--", formatted: "--h --m" };

    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      formatted: `${hours}h ${minutes}m`,
    };
  } catch {
    return { hours: "--", minutes: "--", formatted: "--h --m" };
  }
};

// --- Small card component ---
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">{icon}</div>
      <span className="text-xs sm:text-sm font-medium text-white/70">
        {label}
      </span>
    </div>
    <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
      {value || "--:--"}
    </div>
  </div>
);

// --- Main Component ---
const SunriseSunset = ({ data, loading = false }) => {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);

  // Initialize component and set up interval
  useEffect(() => {
    setMounted(true);
    const intervalId = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isComboboxOpen && !event.target.closest(".date-combobox")) {
        setIsComboboxOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isComboboxOpen]);

  // Generate next 7 days with better error handling
  const next7Days = useMemo(() => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

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
    } catch {
      // Fallback to basic implementation if there's an error
      return Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        formatted: `Day ${i + 1}`,
        isToday: i === 0,
      }));
    }
  }, []);

  // Get sunrise and sunset for selected day
  const { sunrise, sunset } = useMemo(() => {
    // Enhanced data access with fallbacks and validation
    const sunriseData =
      (data?.sunrise && data.sunrise[selectedDayIndex]) || null;
    const sunsetData = (data?.sunset && data.sunset[selectedDayIndex]) || null;

    // Debug logging
    // console.log('SunriseSunset data:', { data, selectedDayIndex, sunriseData, sunsetData });

    return {
      sunrise: sunriseData,
      sunset: sunsetData,
    };
  }, [data, selectedDayIndex]);

  // Add a check to ensure we have valid data before proceeding
  const hasValidData = useMemo(() => {
    return (
      sunrise !== null &&
      sunset !== null &&
      sunrise !== undefined &&
      sunset !== undefined
    );
  }, [sunrise, sunset]);

  // Calculate daylight information with better error handling
  const daylightInfo = useMemo(() => {
    if (!sunrise || !sunset) {
      return { hours: "--", minutes: "--", formatted: "--h --m" };
    }
    return calculateDaylightDuration(sunrise, sunset);
  }, [sunrise, sunset]);

  // Calculate sun position for visualization
  const sunPosition = useMemo(() => {
    if (!sunrise || !sunset) return 50;

    try {
      // Handle different time input formats for sunrise/sunset
      let sunriseTime, sunsetTime;

      if (typeof sunrise === "string") {
        sunriseTime = new Date(sunrise);
        if (isNaN(sunriseTime.getTime())) {
          sunriseTime = new Date(sunrise.replace(" ", "T"));
        }
      } else {
        sunriseTime = new Date(sunrise);
      }

      if (typeof sunset === "string") {
        sunsetTime = new Date(sunset);
        if (isNaN(sunsetTime.getTime())) {
          sunsetTime = new Date(sunset.replace(" ", "T"));
        }
      } else {
        sunsetTime = new Date(sunset);
      }

      if (isNaN(sunriseTime.getTime()) || isNaN(sunsetTime.getTime())) {
        return 50;
      }

      // Only calculate real sun position for today
      if (selectedDayIndex === 0 && mounted) {
        if (now < sunriseTime) return 0;
        if (now > sunsetTime) return 100;

        const totalDaylightMs = sunsetTime.getTime() - sunriseTime.getTime();
        const elapsedMs = now.getTime() - sunriseTime.getTime();
        return Math.min(100, Math.max(0, (elapsedMs / totalDaylightMs) * 100));
      }

      // For future days, show sun at midday position
      return 50;
    } catch {
      return 50;
    }
  }, [sunrise, sunset, now, selectedDayIndex, mounted]);

  // Determine time of day states
  const timeStates = useMemo(() => {
    if (selectedDayIndex !== 0 || !mounted) {
      return {
        isNightTime: false,
        isDawn: false,
        isDusk: false,
      };
    }

    if (!sunrise || !sunset) {
      return {
        isNightTime: false,
        isDawn: false,
        isDusk: false,
      };
    }

    try {
      // Handle different time input formats
      let sunriseTime, sunsetTime;

      if (typeof sunrise === "string") {
        sunriseTime = new Date(sunrise);
        if (isNaN(sunriseTime.getTime())) {
          sunriseTime = new Date(sunrise.replace(" ", "T"));
        }
      } else {
        sunriseTime = new Date(sunrise);
      }

      if (typeof sunset === "string") {
        sunsetTime = new Date(sunset);
        if (isNaN(sunsetTime.getTime())) {
          sunsetTime = new Date(sunset.replace(" ", "T"));
        }
      } else {
        sunsetTime = new Date(sunset);
      }

      if (
        !sunriseTime ||
        !sunsetTime ||
        isNaN(sunriseTime.getTime()) ||
        isNaN(sunsetTime.getTime())
      ) {
        return {
          isNightTime: false,
          isDawn: false,
          isDusk: false,
        };
      }

      const isNight = now < sunriseTime || now > sunsetTime;
      const isDawn = sunPosition < 20 && !isNight;
      const isDusk = sunPosition > 80 && !isNight;

      return {
        isNightTime: isNight,
        isDawn,
        isDusk,
      };
    } catch {
      return {
        isNightTime: false,
        isDawn: false,
        isDusk: false,
      };
    }
  }, [sunrise, sunset, now, sunPosition, selectedDayIndex, mounted]);

  const { isNightTime, isDawn, isDusk } = timeStates;

  // Pre-generate stars for night time
  const stars = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        opacity: Math.random() * 0.8 + 0.2,
      })),
    []
  );

  // Get appropriate sky gradient based on time
  const getSkyGradient = () => {
    // Ensure we have valid values before checking
    if (!mounted) return "from-slate-900 via-slate-800 to-slate-900";
    if (isNightTime) return "from-slate-900 via-blue-900 to-slate-900";
    if (isDawn) return "from-pink-900 via-orange-800 to-blue-900";
    if (isDusk) return "from-orange-900 via-pink-800 to-indigo-900";
    return "from-blue-600 via-blue-500 to-cyan-500";
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 w-full overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
        <div className="relative animate-pulse">
          <div className="h-8 bg-white/10 rounded-xl w-40 mb-6"></div>
          <div className="h-24 sm:h-32 bg-white/5 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle case where no data is available
  if (!data || !hasValidData) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 w-full overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
        <div className="relative text-center py-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Solar Cycle
          </h3>
          <p className="text-white/70 text-sm sm:text-base">
            Sunrise and sunset data not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br ${getSkyGradient()} rounded-3xl p-6 sm:p-8 w-full overflow-hidden shadow-2xl transition-all duration-[2000ms]`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        {!isNightTime && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-300 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-orange-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>
        )}
        {isNightTime &&
          mounted &&
          stars.map((star, index) => (
            <div
              key={index}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                opacity: star.opacity,
              }}
            />
          ))}
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
            </div>
            Solar Cycle
          </h3>

          {/* Date Selector */}
          <div className="relative date-combobox w-full sm:w-48">
            <button
              type="button"
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 cursor-pointer w-full"
              onClick={() => setIsComboboxOpen(!isComboboxOpen)}
              aria-expanded={isComboboxOpen}
              aria-haspopup="listbox"
            >
              <span className="text-sm sm:text-base">
                {next7Days[selectedDayIndex]?.isToday
                  ? `${next7Days[selectedDayIndex]?.formatted} (Today)`
                  : next7Days[selectedDayIndex]?.formatted}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${
                  isComboboxOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isComboboxOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-2xl shadow-lg border border-white/10 z-10 overflow-hidden"
                role="listbox"
              >
                {next7Days.map((day, index) => (
                  <div
                    key={index}
                    role="option"
                    aria-selected={selectedDayIndex === index}
                    className={`px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors ${
                      selectedDayIndex === index ? "bg-white/15" : ""
                    }`}
                    onClick={() => {
                      setSelectedDayIndex(index);
                      setIsComboboxOpen(false);
                    }}
                  >
                    <span className="text-sm">
                      {day.isToday ? `${day.formatted} (Today)` : day.formatted}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sun Arc */}
        <div className="relative h-24 sm:h-32 mb-6 sm:mb-8">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
            <path
              d="M 10,90 Q 100,10 190,90"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
          </svg>

          {mounted && (
            <div
              className="absolute bottom-0 transition-all duration-[2000ms] ease-in-out"
              style={{
                left: `${sunPosition}%`,
                transform: `translateX(-50%) translateY(${
                  -Math.sin((sunPosition / 100) * Math.PI) *
                  (window.innerWidth < 640 ? 50 : 100)
                }px)`,
              }}
            >
              <div className="relative">
                <div
                  className={`absolute inset-0 ${
                    isNightTime ? "bg-blue-400" : "bg-yellow-400"
                  } rounded-full blur-xl opacity-60 scale-125 sm:scale-150`}
                ></div>
                <div
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    isNightTime
                      ? "bg-slate-800 shadow-lg shadow-blue-500/50"
                      : "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"
                  }`}
                >
                  {isNightTime ? (
                    <Moon
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200"
                      fill="currentColor"
                    />
                  ) : (
                    <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
              </div>
            </div>
          )}
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
            value={daylightInfo.formatted}
          />
          <InfoCard
            icon={<Sunset className="w-5 h-5 text-indigo-300" />}
            label="Sunset"
            value={formatTime(sunset)}
          />
        </div>

        {/* Current Time */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div
              className={`w-2 h-2 rounded-full ${
                isNightTime ? "bg-blue-400" : "bg-yellow-400"
              } animate-pulse`}
            ></div>
            <span className="text-xs sm:text-sm font-medium text-white/80">
              {selectedDayIndex === 0
                ? `Current Time: ${formatTime(now)}`
                : `Selected Day: ${
                    next7Days[selectedDayIndex]?.formatted || "Unknown"
                  }`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunset;
