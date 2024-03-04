// SearchResultsDropdown.tsx

import React from "react";
import { Image } from "../../home_page/HomePage"; // Adjust the import path as necessary
import "./SearchResultsDropdown.css"; // Import the corresponding CSS file

import { useNavigate } from "react-router-dom";

interface SearchResultsDropdownProps {
  results: Image[];
  onSelect: (image: Image) => void;
  searchQuery: string;
}

function SearchResultsDropdown({
  results,
  onSelect,
  searchQuery,
}: SearchResultsDropdownProps) {
  const navigate = useNavigate();

  function highlightMatch(text: string, query: string) {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  return (
    <div className="search-results-container">
      <ul className="search-results-list">
        {results.map((image) => {
          const handleClick = () => {
            //onSelect(image);
            // Navigate to the second page and pass the selected image as state
            navigate(`/second`, { state: { image } });
          };

          return (
            <li
              key={image.id}
              onClick={handleClick}
              className="search-result-item"
            >
              <img
                src={image.path}
                alt={image.filename}
                className="result-thumbnail"
              />
              <span className="result-title">
                {highlightMatch(image.filename, searchQuery)}
              </span>
              {/* Continue rendering other details */}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchResultsDropdown;
