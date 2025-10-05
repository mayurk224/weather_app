import { ChevronDown, Settings } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSystemToggle = () => {
    const newSystem = units.system === "metric" ? "imperial" : "metric";
    const newUnits = {
      system: newSystem,
      temperature: newSystem === "metric" ? "celsius" : "fahrenheit",
      windSpeed: newSystem === "metric" ? "kmh" : "mph",
      precipitation: newSystem === "metric" ? "mm" : "inches",
    };
    onUnitsChange(newUnits);
  };

  const handleUnitChange = (type, value) => {
    const newUnits = { ...units, [type]: value };
    onUnitsChange(newUnits);
  };

  const isSelected = (type, value) => units[type] === value;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Main Units Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-lg border border-theme bg-card-hover px-2 py-2 text-primary transition-colors hover:bg-card-hover gap-2"
      >
        <div className="flex items-center space-x-2">
          <img src="src\assets\icon-units.svg" alt="" className="icon-auto" />
          <span className="text-sm font-semibold">Units</span>
        </div>
        <img
          src="src\assets\icon-dropdown.svg"
          alt=""
          className={`w-4 h-4 text-secondary transition-transform icon-auto ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-theme rounded-lg shadow-xl z-50 overflow-hidden">
          {/* System Toggle and Theme Toggle */}
          <div className="p-3 border-b border-theme">
            <div className="flex gap-2">
              <button
                onClick={handleSystemToggle}
                className="flex-1 bg-card-hover hover:bg-button text-primary rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Switch to {units.system === "metric" ? "Imperial" : "Metric"}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors bg-card-hover hover:bg-button border border-theme text-primary"
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? (
                  // Sun Icon
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon-auto"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2" />
                    <path d="M12 21v2" />
                    <path d="M4.22 4.22l1.42 1.42" />
                    <path d="M18.36 18.36l1.42 1.42" />
                    <path d="M1 12h2" />
                    <path d="M21 12h2" />
                    <path d="M4.22 19.78l1.42-1.42" />
                    <path d="M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  // Moon Icon
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Temperature Section */}
          <div className="p-3 border-b border-theme">
            <h3 className="text-secondary text-xs font-medium uppercase tracking-wide mb-3">
              Temperature
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUnitChange("temperature", "celsius")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("temperature", "celsius")
                    ? "bg-card-hover hover:bg-button text-primary"
                    : "text-secondary hover:bg-card-hover"
                }`}
              >
                <span>Celsius (°C)</span>
                {isSelected("temperature", "celsius") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4 icon-auto"
                  />
                )}
              </button>
              <button
                onClick={() => handleUnitChange("temperature", "fahrenheit")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("temperature", "fahrenheit")
                    ? "bg-card-hover hover:bg-button text-primary"
                    : "text-secondary hover:bg-card-hover"
                }`}
              >
                <span>Fahrenheit (°F)</span>
                {isSelected("temperature", "fahrenheit") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4 icon-auto"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Wind Speed Section */}
          <div className="p-3 border-b border-theme">
            <h3 className="text-secondary text-xs font-medium uppercase tracking-wide mb-3">
              Wind Speed
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUnitChange("windSpeed", "kmh")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("windSpeed", "kmh")
                    ? "bg-card-hover hover:bg-button text-primary"
                    : "text-secondary hover:bg-card-hover"
                }`}
              >
                <span>km/h</span>
                {isSelected("windSpeed", "kmh") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4 icon-auto"
                  />
                )}
              </button>
              <button
                onClick={() => handleUnitChange("windSpeed", "mph")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("windSpeed", "mph")
                    ? "bg-card-hover hover:bg-button text-primary"
                    : "text-secondary hover:bg-card-hover"
                }`}
              >
                <span>mph</span>
                {isSelected("windSpeed", "mph") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4 icon-auto"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Precipitation Section */}
          <div className="p-3">
            <h3 className="text-secondary text-xs font-medium uppercase tracking-wide mb-3">
              Precipitation
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUnitChange("precipitation", "mm")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("precipitation", "mm")
                    ? "bg-card-hover hover:bg-button text-primary"
                    : "text-secondary hover:bg-card-hover"
                }`}
              >
                <span>Millimeters (mm)</span>
                {isSelected("precipitation", "mm") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4 icon-auto"
                  />
                )}
              </button>
              <button
                onClick={() => handleUnitChange("precipitation", "inches")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("precipitation", "inches")
                    ? "bg-card-hover hover:bg-button text-primary"
                    : "text-secondary hover:bg-card-hover"
                }`}
              >
                <span>Inches (in)</span>
                {isSelected("precipitation", "inches") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4 icon-auto"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitsCombobox;
