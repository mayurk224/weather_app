import React, { useState, useEffect, useRef } from "react";
import { getWeatherData, searchCity } from "../utils/api";

const Search = ({ onWeatherData }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Fetch city suggestions on input
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const cities = await searchCity(query);
      setResults(cities);
      setLoading(false);
      setShowSuggestions(true);
    }, 500); // debounce 0.5s

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close suggestion box when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting a city
  const handleSelectCity = async (city) => {
    setQuery(`${city.name}, ${city.country}`);
    setResults([]);
    setShowSuggestions(false);

    const { latitude, longitude } = city;
    const weather = await getWeatherData(latitude, longitude);

    if (onWeatherData) {
      onWeatherData(weather); // pass data to parent
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 lg:mt-14 space-y-8 w-full">
      <div>
        <h1 className="bricolage-grotesque text-white text-4xl font-bold lg:text-5xl">
          How's the Sky looking today?
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-start justify-center h-full w-full max-w-xl">
        <div className="relative w-full lg:w-2xl" ref={suggestionRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3 pl-14 pr-4 rounded-lg outline-none text-white border bg-[#272541ff] hover:bg-[#302e4b]"
            placeholder="Search for a city ..."
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />

          <img
            src="/src/assets/icon-search.svg"
            alt=""
            className="absolute left-5 top-1/2 transform -translate-y-1/2"
          />

          {showSuggestions && (
            <div className="suggestionBlock absolute top-full left-0 mt-3 w-full text-left space-y-2 bg-[#272541ff] p-3 rounded-lg z-50">
              {loading && (
                <div className="searchProgress flex items-center space-x-2 text-gray-400 p-1">
                  <img
                    src="/src/assets/icon-loading.svg"
                    alt=""
                    className="w-4 h-4 animate-spin"
                  />
                  <h3>Search in progress</h3>
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="noResult p-1">
                  <h3 className="text-gray-400 text-center">
                    No search results found !
                  </h3>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="bg-[#272541ff] text-white rounded-md mt-1 overflow-hidden">
                  {results.map((city) => (
                    <div
                      key={city.id}
                      className="p-2 hover:bg-[#302e4b] cursor-pointer"
                      onClick={() => handleSelectCity(city)}
                    >
                      {city.name}
                      {city.admin1 ? `, ${city.admin1}` : ""} ({city.country})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keep button for manual search if needed */}
        <button
          className="bg-[#4455daff] hover:bg-[#2d1c9cff] text-white rounded-lg px-4 py-3 w-full lg:w-auto lg:min-w-[120px]"
          onClick={async () => {
            if (results.length > 0) {
              await handleSelectCity(results[0]);
            } else if (query.length >= 2) {
              setLoading(true);
              const cities = await searchCity(query);
              setResults(cities);
              setLoading(false);
              if (cities.length > 0) {
                await handleSelectCity(cities[0]);
              }
            }
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
