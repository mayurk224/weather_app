import React, { useState, useEffect, useRef } from "react";
import { getWeatherData, searchCity } from "../utils/api";

const Search = ({ onWeatherData }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  // Voice search states
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  
  const suggestionRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    // Check browser support with prefixed properties
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    
    if (SpeechRecognition) {
      setVoiceSupported(true);
      
      // Create recognition instance
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition settings
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Optional: Set up grammar for better city recognition
      if (SpeechGrammarList) {
        const speechRecognitionList = new SpeechGrammarList();
        // Simple grammar for city names (you can expand this)
        const grammar = '#JSGF V1.0; grammar cities; public <city> = <city_name>;';
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
      }

      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError("");
        console.log("Voice recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log(`Voice input received: ${transcript} (confidence: ${confidence})`);
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        
        let errorMessage = "";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech was detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not accessible. Please check permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage = "Network error occurred during voice recognition.";
            break;
          case 'language-not-supported':
            errorMessage = "Language not supported for voice recognition.";
            break;
          default:
            errorMessage = "An error occurred during voice recognition.";
        }
        setVoiceError(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log("Voice recognition ended");
      };

      recognition.onnomatch = () => {
        setVoiceError("No match found. Please speak more clearly.");
        setIsListening(false);
      };

      recognition.onspeechstart = () => {
        console.log("Speech detected");
      };

      recognition.onspeechend = () => {
        console.log("Speech ended");
      };

    } else {
      console.warn("Speech Recognition not supported in this browser");
      setVoiceSupported(false);
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteCities");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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
    }, 500);

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

  // Voice search functions
  const startVoiceSearch = () => {
    if (!voiceSupported) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognitionRef.current) {
      setVoiceError("Voice recognition not initialized.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      setVoiceError("Failed to start voice recognition. Please try again.");
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Handle selecting a city
  const handleSelectCity = async (city) => {
    setQuery(`${city.name}, ${city.country}`);
    setResults([]);
    setShowSuggestions(false);

    const { latitude, longitude } = city;

    // Save to localStorage
    localStorage.setItem(
      "lastCity",
      JSON.stringify({
        name: city.name,
        country: city.country,
        lat: latitude,
        lon: longitude,
      })
    );

    const weather = await getWeatherData(latitude, longitude);

    if (onWeatherData) {
      onWeatherData({ city, weather });
    }
  };

  // Handle current location
  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const city = {
            name:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Unknown City",
            country: data.address?.country || "Unknown Country",
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

          const weather = await getWeatherData(latitude, longitude);

          if (onWeatherData) {
            onWeatherData({ city, weather });
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          alert("Failed to get location information. Please try again.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }

        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Handle adding/removing favorites
  const toggleFavorite = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteCities") || "[]"
    );

    const isFavorite = savedFavorites.some(
      (fav) => `${fav.name}-${fav.country}` === cityKey
    );

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = savedFavorites.filter(
        (fav) => `${fav.name}-${fav.country}` !== cityKey
      );
    } else {
      const favoriteCity = {
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        id: city.id,
      };
      updatedFavorites = [...savedFavorites, favoriteCity];
    }

    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  // Check if a city is in favorites
  const isCityFavorite = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    return favorites.some((fav) => `${fav.name}-${fav.country}` === cityKey);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 lg:mt-14 space-y-8 w-full">
      <div>
        <h1 className="bricolage-grotesque text-primary text-4xl font-bold lg:text-5xl">
          How's the Sky looking today?
        </h1>
      </div>

      {/* Voice Error Message */}
      {voiceError && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm max-w-xl">
          {voiceError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-start justify-center h-full w-full max-w-xl">
        <div className="relative w-full lg:w-2xl" ref={suggestionRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3 pl-14 pr-24 rounded-lg outline-none text-primary border border-theme bg-card hover:bg-card-hover transition-colors"
            placeholder="Search for a city or click the mic..."
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />

          <img
            src="/src/assets/icon-search.svg"
            alt=""
            className="absolute left-5 top-1/2 transform -translate-y-1/2"
          />

          {/* Voice Search Button - Only show if supported */}
          {voiceSupported && (
            <button
              onClick={isListening ? stopVoiceSearch : startVoiceSearch}
              disabled={isListening}
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                  : 'hover:bg-card-hover hover:scale-105'
              }`}
              title={isListening ? "Listening... Click to stop" : "Start voice search"}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  isListening ? 'text-white' : 'text-primary hover:text-primary'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {isListening ? (
                  // Stop icon when listening
                  <rect x="6" y="6" width="12" height="12" rx="1"/>
                ) : (
                  // Microphone icon when not listening
                  <>
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </>
                )}
              </svg>
            </button>
          )}

          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={locationLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-card-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Use current location"
          >
            {locationLoading ? (
              <svg
                className="w-5 h-5 text-primary animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>

          {/* Voice Status Indicator */}
          {isListening && (
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-accent bg-card px-4 py-2 rounded-full border border-theme">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Listening for city name...</span>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="suggestionBlock absolute top-full left-0 mt-3 w-full text-left space-y-2 bg-card p-3 rounded-lg z-50 border border-theme">
              {loading && (
                <div className="searchProgress flex items-center space-x-2 text-secondary p-1">
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
                  <h3 className="text-secondary text-center">
                    No search results found !
                  </h3>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="bg-card text-primary rounded-md mt-1 overflow-hidden">
                  {results.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-between p-2 hover:bg-card-hover group"
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleSelectCity(city)}
                      >
                        {city.name}
                        {city.admin1 ? `, ${city.admin1}` : ""} ({city.country})
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(city);
                        }}
                        className="ml-2 p-1 rounded-md hover:bg-button transition-colors"
                        title={
                          isCityFavorite(city)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {isCityFavorite(city) ? (
                          <svg
                            className="w-4 h-4 text-accent fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-secondary hover:text-accent"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search button fallback */}
        <button
          className="bg-button hover:bg-button-hover text-white rounded-lg px-4 py-3 w-full lg:w-auto lg:min-w-[120px] transition-colors"
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
