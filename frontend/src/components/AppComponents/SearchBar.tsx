import { Search, Clock, TrendingUp, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../context/searchContext';
import { useNavigate } from 'react-router-dom';


interface SearchBarProps {
  onSuggestClick?: (suggest: string) => void;
  placeholder?: string;
  className?: string;
  clear?: boolean; // Optional prop to clear search
}

export default function SearchBar({
  placeholder = "Search stories, authors...",
  className = "",
  clear=false
}: SearchBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    results,
    trending,
    recentSearches,
    suggestions,
    loading,
    search,
    clearRecentSearches,
    addRecentSearch,
    fetchSuggestions
  } = useSearch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search when query changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        // alert('Searching for: ' + searchQuery);
        fetchSuggestions(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    if (clear) {
      setSearchQuery('');
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = results.length + (searchQuery ? 0 : recentSearches.length + trending.length);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : -1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleItemClick(selectedIndex);
        } else if (searchQuery.trim()) {
          handleSearch(searchQuery);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleItemClick = (index: number) => {
    if (searchQuery) {
      const suggestedItem = suggestions[index];
      setSearchQuery(suggestedItem);  
      handleSearch(suggestedItem);
    } else {
      const recentCount = recentSearches.length;
      if (index < recentCount) {
        setSearchQuery(recentSearches[index]);
        inputRef.current?.focus();
        handleSearch(recentSearches[index]);
        console.log(`Recent search clicked: ${recentSearches[index]} index: ${index}`);
      } else {
        const trendingIndex = index - recentCount;
        const trendItem = trending[trendingIndex];
        setSearchQuery(trendItem.title);
        handleSearch(trendItem.title);
        console.log(`Trending item clicked: ${trendItem.title} index: ${trendingIndex}`);
      }
    }
    setSelectedIndex(-1);
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      addRecentSearch(query);
      await search(query);
      navigate(`/results?q=${query}`);
    }
    setIsOpen(false);
  };

  // const formatTimeAgo = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
  //   if (diffInDays === 0) return 'Today';
  //   if (diffInDays === 1) return 'Yesterday';
  //   if (diffInDays < 7) return `${diffInDays}d ago`;
  //   if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  //   return `${Math.floor(diffInDays / 30)}mo ago`;
  // };

  return (
    <div ref={searchRef} className={`relative flex-1 max-w-md ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              inputRef.current?.focus(); // 
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 min-h-40 overflow-hidden">
          {loading && searchQuery && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && suggestions.length > 0 && !loading && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions.map((title, index) => (
                <button
                  key={index + title}
                  onClick={() => handleItemClick(index)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    selectedIndex === index ? 'bg-amber-50 border-r-2 border-amber-500' : ''
                  }`}
                >
                  <p className="text-gray-900 truncate">{title}</p>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery && suggestions.length === 0 && !loading && (
            <div className="p-6 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No results found</p>
              <p className="text-sm text-gray-400">Try different keywords or check your spelling</p>
            </div>
          )}

          {/* Recent Searches & Trending (when no search query) */}
          {!searchQuery && (
            <div className="py-2 custom-scrollbar max-h-80 overflow-y-auto">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((query, index) => (
                    <button
                      key={query}
                      onClick={() => handleItemClick(index)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        selectedIndex === index ? 'bg-amber-50 border-r-2 border-amber-500' : ''
                      }`}
                    >
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{query}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending */}
              {trending.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Trending
                  </div>
                  {trending.map((item, index) => {
                    const adjustedIndex = recentSearches.length + index;
                    return (
                      <button
                        key={item.id || `trending-${index}`}
                        onClick={() => handleItemClick(index)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                          selectedIndex === adjustedIndex ? 'bg-amber-50 border-r-2 border-amber-500' : ''
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {recentSearches.length === 0 && trending.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Start typing to search</p>
                  <p className="text-sm text-gray-400">Find stories, authors, and topics</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}