import { debounce } from 'lodash';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { apiFetch } from '../api/api';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'blog' | 'author';
  coverImage?: string;
  avatar?: string;
  isVerified?: boolean;
  views?: number;
  createdAt?: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: SearchResult[];
  trending: SearchResult[];
  recentSearches: string[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearRecentSearches: () => void;
  addRecentSearch: (query: string) => void;
  fetchSuggestions: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [trending, setTrending] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = useLocation().pathname === '/blogs' || useLocation().pathname === '/search';

  // Load initial data (trending and recent searches)
  useEffect(() => {
    if (!pathname) return;
    const loadInitialData = async () => {
      try {
        // Fetch trending content
        const trendingResponse = await apiFetch('/search/trending');
        const trendingData = await trendingResponse.json();
        setTrending(trendingData);
        console.log('Trending data loaded:', trendingData);

        // Load recent searches from localStorage
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
          console.log('Recent searches loaded from localStorage:', JSON.parse(savedSearches));
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (error) {
        setError(`Failed to load initial search data: ${error}`);
        console.error('Error loading initial search data:', error);
      }
    };

    loadInitialData();
  }, []);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch(`/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      console.log('Search results:', data);
    } catch (error) {
      console.error('Search error:', error);
      setError(`Search failed: ${error}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;

    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(q => q !== query)].slice(0, 5);
      console.log('Updated recent searches:', updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await apiFetch(`/search/suggest?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data);
      console.log('Suggestions fetched:', data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q: string) => {
      fetchSuggestions(q);
    }, 300),
    []
  );

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        results,
        trending,
        recentSearches,
        suggestions,
        loading,
        error,
        search,
        clearRecentSearches,
        addRecentSearch,
        fetchSuggestions: debouncedFetch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};