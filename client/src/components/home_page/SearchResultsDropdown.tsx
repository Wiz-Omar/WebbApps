// SearchResultsDropdown.tsx

import React from 'react';
import { Image } from '../../App'; // Adjust the import path as necessary
import './SearchResultsDropdown.css'; // Import the corresponding CSS file

import { useNavigate } from "react-router-dom";

interface SearchResultsDropdownProps {
    results: Image[];
    onSelect: (image: Image) => void;
  }
  
  const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ results, onSelect }) => {
      const navigate = useNavigate();
  
    return (
      <div className="search-results-container">
        <ul className="search-results-list">
          {results.map((image) => {
            const handleClick = () => {
              onSelect(image);
              // Navigate to the second page and pass the selected image as state
              navigate(`/second`, { state: { image } });
            };
  
            return (
              <li key={image.id} onClick={handleClick} className="search-result-item">
                {/* Example: If you want to show thumbnails */}
                <img src={`data:image/jpeg;base64,${image.data}`} alt={image.filename} className="result-thumbnail" />
                <span className="result-title">{image.filename}</span>
                {/* Add more details as needed */}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  export default SearchResultsDropdown;