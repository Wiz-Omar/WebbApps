// SearchResultsDropdown.tsx

import React from 'react';
import { Image } from '../../App'; // Adjust the import path as necessary
import './SearchResultsDropdown.css'; // Import the corresponding CSS file

interface SearchResultsDropdownProps {
  results: Image[];
  onSelect: (image: Image) => void;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ results, onSelect }) => {
  return (
    <div className="search-results-container">
      <ul className="search-results-list">
        {results.map((image) => (
          <li key={image.id} onClick={() => onSelect(image)} className="search-result-item">
            {/* Example: If you want to show thumbnails */}
            <img src={`data:image/jpeg;base64,${image.data}`} alt={image.filename} className="result-thumbnail" />
            <span className="result-title">{image.filename}</span>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsDropdown;
