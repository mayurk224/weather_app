import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  Mic,
  MapPin,
  Star,
  X,
  LoaderCircle,
} from "lucide-react";
import { getWeatherData, searchCity } from "../utils/api";

// (Keep your requestQueue as is)
const requestQueue = {
  queue: [],
  maxConcurrent: 3,
  running: 0,
  add: function (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  },
  process: function () {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return;
    this.running++;
    const { fn, resolve, reject } = this.queue.shift();
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--;
        this.process();
      });
  },
};

const Search = ({ onWeatherData }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const suggestionRef = useRef(null);
  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const searchInputRef = useRef(null);

  // (All your existing useEffect and handler logic remains the same)
  // ... [omitting the large blocks of existing logic for brevity, they don't need to change]

  // Memoize handleCurrentLocation to use in useEffect dependency array
  const handleCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const [reverseData, weatherData] = await Promise.all([
            requestQueue.add(() =>
              fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              ).then((res) => res.json())
            ),
            requestQueue.add(() => getWeatherData(latitude, longitude)),
          ]);
          const city = {
            name:
              reverseData.address?.city ||
              reverseData.address?.town ||
              reverseData.address?.village ||
              "Unknown City",
            country: reverseData.address?.country || "Unknown Country",
            latitude,
            longitude,
            id: `${latitude}-${longitude}`,
          };
          setQuery(`${city.name}, ${city.country}`);
          setResults([]);
          setShowSuggestions(false);
          localStorage.setItem(
            "lastCity",
            JSON.stringify({
              name: city.name,
              country: city.country,
              lat: latitude,
              lon: longitude,
            })
          );
          if (onWeatherData) onWeatherData({ city, weather: weatherData });
        } catch (error) {
          console.error("Error getting location name:", error);
          alert("Failed to get location information. Please try again.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        // ... (error handling)
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [onWeatherData]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError("");
      };
      recognition.onresult = (event) => {
        setQuery(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        /* ... error handling ... */ setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
    } else {
      setVoiceSupported(false);
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteCities");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (!lastCity) handleCurrentLocation();
  }, [handleCurrentLocation]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const cities = await requestQueue.add(() => searchCity(query));
        setResults(cities);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
        setResults([]);
      } finally {
        setLoading(false);
        setShowSuggestions(true);
      }
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startVoiceSearch = () => {
    /* ... */
  };
  const stopVoiceSearch = () => {
    /* ... */
  };

  const handleSelectCity = async (city) => {
    /* ... */
  };
  const toggleFavorite = (city) => {
    /* ... */
  };
  const isCityFavorite = (city) => {
    /* ... */
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const suggestionsVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center mt-10 lg:mt-14 space-y-8 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="bricolage-grotesque text-primary text-4xl font-bold lg:text-5xl">
          How's the Sky looking today?
        </h1>
      </motion.div>

      <AnimatePresence>
        {voiceError && (
          <motion.div
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm max-w-xl"
            role="alert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {voiceError}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-start justify-center h-full w-full max-w-xl"
      >
        <div className="relative w-full lg:w-2xl" ref={suggestionRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={searchInputRef}
            className="w-full py-3 pl-14 pr-24 rounded-lg outline-none text-primary border border-theme bg-card hover:bg-card-hover transition-colors"
            placeholder="Search for a city or click the mic..."
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />

          <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />

          {voiceSupported && (
            <motion.button
              onClick={isListening ? stopVoiceSearch : startVoiceSearch}
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-md ${
                isListening ? "bg-red-500 text-white" : "hover:bg-card-hover"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}

          <motion.button
            onClick={handleCurrentLocation}
            disabled={locationLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-card-hover disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {locationLoading ? (
              <LoaderCircle className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <MapPin className="w-5 h-5 text-primary" />
            )}
          </motion.button>

          <AnimatePresence>
            {isListening && (
              <motion.div
                className="absolute -bottom-10 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="inline-flex items-center space-x-2 text-sm text-accent bg-card px-4 py-2 rounded-full border border-theme">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                id="search-suggestions"
                className="suggestionBlock absolute top-full left-0 mt-3 w-full text-left space-y-2 bg-card p-3 rounded-lg z-50 border border-theme"
                variants={suggestionsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* ... (suggestion items with motion.div wrappers and variants) */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          className="bg-button hover:bg-button-hover text-white rounded-lg px-4 py-3 w-full lg:w-auto lg:min-w-[120px] transition-colors"
          onClick={() => {
            /* ... */
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Search;
