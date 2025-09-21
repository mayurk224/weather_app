// src/utils/units.js

export const convertTemperature = (tempCelsius, unit) => {
  if (unit === "fahrenheit") {
    return (tempCelsius * 9) / 5 + 32;
  }
  return tempCelsius; // default to celsius
};

export const getTemperatureUnit = (unit) => {
  return unit === "fahrenheit" ? "°F" : "°C";
};

export const convertWindSpeed = (speedKmh, unit) => {
  if (unit === "mph") {
    return speedKmh * 0.621371;
  }
  return speedKmh; // default to kmh
};

export const getWindSpeedUnit = (unit) => {
  return unit === "mph" ? "mph" : "km/h";
};

export const convertPrecipitation = (precipMm, unit) => {
  if (unit === "inches") {
    return precipMm * 0.0393701;
  }
  return precipMm; // default to mm
};

export const getPrecipitationUnit = (unit) => {
  return unit === "inches" ? "in" : "mm";
};
