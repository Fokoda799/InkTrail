// components/SearchBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    // Navigate to search results page with query parameters
    navigate(`/search?term=${searchTerm}`);
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={handleInputChange} 
      />
      <button className="search-button" onClick={handleSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="search-icon"
        >
          <path
            d="M10 2a8 8 0 105.29 14.71l4.29 4.29a1 1 0 001.42-1.42l-4.29-4.29A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
