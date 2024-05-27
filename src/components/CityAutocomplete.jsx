import React, { useState, useEffect, useRef } from "react";

const CityAutocomplete = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteListRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 3) {
        setSuggestions([]);
        return;
      }

      const username = "GEONAME_USERNAME_MADE_WITH_sYNTROPY";
      const url = `https://secure.geonames.org/searchJSON?name_startsWith=${inputValue}&maxRows=5&username=${username}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        if (!data.geonames || data.geonames.length === 0) {
          setSuggestions([{ name: "No results found", countryName: "" }]);
        } else {
          setSuggestions(data.geonames);
        }
      } catch (error) {
        console.error("Error fetching data from Geonames:", error);
      }
    };

    fetchSuggestions();
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(`${suggestion.name}, ${suggestion.countryName}`);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (
      autocompleteListRef.current &&
      !autocompleteListRef.current.contains(e.target)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const styles = {
    autocomplete: {
      position: "relative",
      display: "inline-block",
    },
    autocompleteList: {
      border: "1px solid #d4d4d4",
      borderBottom: "none",
      borderTop: "none",
      zIndex: 99,
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "white",
      maxHeight: "200px",
      overflowY: "auto",
    },
    autocompleteItems: {
      border: "1px solid #d4d4d4",
      borderBottom: "none",
      cursor: "pointer",
      padding: "10px",
      backgroundColor: "#fff",
    },
    autocompleteItemsHover: {
      backgroundColor: "#e9e9e9",
    },
    autocompleteActive: {
      backgroundColor: "DodgerBlue",
      color: "#ffffff",
    },
  };

  return (
    <div className="autocomplete" style={styles.autocomplete}>
      <label htmlFor="city-input">City:</label>
      <input
        id="city-input"
        type="text"
        name="city"
        placeholder="Enter your city"
        value={inputValue}
        onChange={handleInputChange}
      />
      {showSuggestions && inputValue.length >= 3 && (
        <div
          id="autocomplete-list"
          style={styles.autocompleteList}
          ref={autocompleteListRef}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="autocomplete-items"
              style={styles.autocompleteItems}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name !== "No results found"
                ? `${suggestion.name}, ${suggestion.countryName}`
                : suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
