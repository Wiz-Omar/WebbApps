import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css';
import SearchResultsDropdown from '../SearchResultsDropdown/SearchResultsDropdown';
import { Image } from '../../home_page/HomePage'; // Adjust the import path as necessary
import SearchIcon from './SearchIcon/SearchIcon';
import Icon from '../../common/Icon';

axios.defaults.withCredentials = true

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Image[]>([]);
  const [isFocused, setIsFocused] = useState(false); // State to manage focus

  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for the search container

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsFocused(true);
    if (event.target.value.trim() === '') {
      setSearchResults([]);
    } else {
      performSearch(event.target.value.trim());
    }
  };

  const performSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    if (searchQuery === query) {
      return; // Don't perform search if the query hasn't changed or if toggling focus
    }
    try {
      console.log('Performing search:', query);
      const response = await axios.get<Image[]>(`http://localhost:8080/image/search?search=${query}`);
      setSearchResults(response.data);
      setIsFocused(true); // Ensure results are shown when search is performed
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery) performSearch(searchQuery); // Optionally re-fetch results on focus
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <SearchIcon />
      <form onSubmit={(event) => event.preventDefault()} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          className="search-input"
          placeholder="Search in Storage"
        />
      </form>
      {isFocused && searchResults.length > 0 && (
        <SearchResultsDropdown results={searchResults} onSelect={() => {}} searchQuery={searchQuery} />
      )}
    </div>
  );
};

export default SearchBar;
