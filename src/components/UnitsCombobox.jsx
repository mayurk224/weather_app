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
        className="flex items-center justify-between bg-[#272541ff] border border-gray-600 rounded-lg lg:px-4 lg:py-2.5 text-white hover:bg-[#312f4bff] transition-colors sm:min-w-[120px] min-w-[100px] px-2 py-2.5"
      >
        <div className="flex items-center space-x-2">
          <img src="src\assets\icon-units.svg" alt="" />
          <span className="text-sm font-semibold">Units</span>
        </div>
        <img
          src="src\assets\icon-dropdown.svg"
          alt=""
          className={`w-4 h-4 text-gray-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#272541ff] border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* System Toggle */}
          <div className="p-3 border-b border-gray-700">
            <button
              onClick={handleSystemToggle}
              className="w-full bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              Switch to {units.system === "metric" ? "Imperial" : "Metric"}
            </button>
          </div>

          {/* Temperature Section */}
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">
              Temperature
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUnitChange("temperature", "celsius")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("temperature", "celsius")
                    ? "bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white"
                    : "text-gray-300 hover:bg-[#3d3b5eff]"
                }`}
              >
                <span>Celsius (°C)</span>
                {isSelected("temperature", "celsius") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                )}
              </button>
              <button
                onClick={() => handleUnitChange("temperature", "fahrenheit")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("temperature", "fahrenheit")
                    ? "bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white"
                    : "text-gray-300 hover:bg-[#3d3b5eff]"
                }`}
              >
                <span>Fahrenheit (°F)</span>
                {isSelected("temperature", "fahrenheit") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Wind Speed Section */}
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">
              Wind Speed
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUnitChange("windSpeed", "kmh")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("windSpeed", "kmh")
                    ? "bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white"
                    : "text-gray-300 hover:bg-[#3d3b5eff]"
                }`}
              >
                <span>km/h</span>
                {isSelected("windSpeed", "kmh") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                )}
              </button>
              <button
                onClick={() => handleUnitChange("windSpeed", "mph")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("windSpeed", "mph")
                    ? "bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white"
                    : "text-gray-300 hover:bg-[#3d3b5eff]"
                }`}
              >
                <span>mph</span>
                {isSelected("windSpeed", "mph") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Precipitation Section */}
          <div className="p-3">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">
              Precipitation
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUnitChange("precipitation", "mm")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("precipitation", "mm")
                    ? "bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white"
                    : "text-gray-300 hover:bg-[#3d3b5eff]"
                }`}
              >
                <span>Millimeters (mm)</span>
                {isSelected("precipitation", "mm") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                )}
              </button>
              <button
                onClick={() => handleUnitChange("precipitation", "inches")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected("precipitation", "inches")
                    ? "bg-[#312f4bff] hover:bg-[#3d3b5eff] text-white"
                    : "text-gray-300 hover:bg-[#3d3b5eff]"
                }`}
              >
                <span>Inches (in)</span>
                {isSelected("precipitation", "inches") && (
                  <img
                    src="src/assets/icon-checkmark.svg"
                    alt=""
                    className="w-4 h-4"
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
