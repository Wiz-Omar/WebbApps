// SearchBar.tsx

import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css'; // Import a CSS file for styling
import SearchResultsDropdown from './SearchResultsDropdown';
import { Image } from '../../App'; // Adjust the import path as necessary


function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Image[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() === '') {
      setSearchResults([]); // Clear results if the search query is cleared
    } else {
      performSearch(event.target.value.trim());
    }
  };

  const performSearch = async (query: string) => {
    try {
      const response = await axios.get<Image[]>(`http://localhost:8080/image/search?search=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]); // Consider clearing results or handling errors differently
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch(searchQuery);
  };

  const handleSelectImage = (image: Image) => {
    console.log('Selected image:', image);
    // Handle the image selection, e.g., navigate to the image detail page
    // Don't forget to clear the search results and query
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          placeholder="Search in Storage"
        />
      </form>
      {searchResults.length > 0 && (
        <SearchResultsDropdown results={searchResults} onSelect={handleSelectImage} />
      )}
    </div>
  );
};

export default SearchBar;
