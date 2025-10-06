import { Settings, ChevronDown, Sun, Moon, Check } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UnitsCombobox = ({
  units = {
    system: "metric", // 'metric' or 'imperial'
    temperature: "celsius",
    windSpeed: "kmh",
    precipitation: "mm",
  },
  onUnitsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Theme state management
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Close dropdown when clicking outside or pressing Escape
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

  const handleSystemToggle = () => {
    const newSystem = units.system === "metric" ? "imperial" : "metric";
    onUnitsChange({
      system: newSystem,
      temperature: newSystem === "metric" ? "celsius" : "fahrenheit",
      windSpeed: newSystem === "metric" ? "kmh" : "mph",
      precipitation: newSystem === "metric" ? "mm" : "inches",
    });
  };

  const handleUnitChange = (type, value) => {
    onUnitsChange({ ...units, [type]: value });
  };

  const isSelected = (type, value) => units[type] === value;

  // Animation variants for the dropdown menu
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  // A reusable component for menu items to reduce repetition
  const MenuItem = ({ label, value, type }) => (
    <motion.button
      onClick={() => handleUnitChange(type, value)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
        isSelected(type, value)
          ? "bg-card-hover hover:bg-button text-primary"
          : "text-secondary hover:bg-card-hover"
      }`}
      role="menuitemradio"
      aria-checked={isSelected(type, value)}
      whileHover={{
        backgroundColor: isSelected(type, value)
          ? "var(--color-button)"
          : "var(--color-card-hover-deeper)",
      }} // Assuming CSS variables
      whileTap={{ scale: 0.98 }}
    >
      <span>{label}</span>
      <AnimatePresence>
        {isSelected(type, value) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check className="w-4 h-4 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-lg border border-theme bg-card-hover px-3 py-2 text-primary transition-colors hover:bg-button gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Units and theme settings"
      >
        <Settings className="w-5 h-5" />
        <span className="text-sm font-semibold">Units</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="ml-1 h-4 w-4 text-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full right-0 mt-2 w-64 origin-top-right bg-card border border-theme rounded-lg shadow-xl z-50 overflow-hidden"
            role="menu"
            aria-label="Units and theme settings menu"
          >
            {/* System and Theme Toggles */}
            <div className="p-3 border-b border-theme flex gap-2">
              <motion.button
                onClick={handleSystemToggle}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-card-hover hover:bg-button text-primary rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                aria-label={`Switch to ${
                  units.system === "metric" ? "Imperial" : "Metric"
                } units`}
              >
                {`Switch to ${
                  units.system === "metric" ? "Imperial" : "Metric"
                }`}
              </motion.button>
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg transition-colors bg-card-hover hover:bg-button border border-theme text-primary"
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? "moon" : "sun"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Unit Sections */}
            <div className="p-3 border-b border-theme">
              <h3 className="text-secondary text-xs font-medium uppercase tracking-wide mb-3">
                Temperature
              </h3>
              <div className="space-y-1">
                <MenuItem
                  label="Celsius (°C)"
                  value="celsius"
                  type="temperature"
                />
                <MenuItem
                  label="Fahrenheit (°F)"
                  value="fahrenheit"
                  type="temperature"
                />
              </div>
            </div>

            <div className="p-3 border-b border-theme">
              <h3 className="text-secondary text-xs font-medium uppercase tracking-wide mb-3">
                Wind Speed
              </h3>
              <div className="space-y-1">
                <MenuItem label="km/h" value="kmh" type="windSpeed" />
                <MenuItem label="mph" value="mph" type="windSpeed" />
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-secondary text-xs font-medium uppercase tracking-wide mb-3">
                Precipitation
              </h3>
              <div className="space-y-1">
                <MenuItem
                  label="Millimeters (mm)"
                  value="mm"
                  type="precipitation"
                />
                <MenuItem
                  label="Inches (in)"
                  value="inches"
                  type="precipitation"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnitsCombobox;
