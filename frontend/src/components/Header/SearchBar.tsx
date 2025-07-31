import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  author?: string;
  excerpt?: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search posts, authors...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const termFromURL = urlParams.get('q') || urlParams.get('term');
    if (termFromURL) {
      setQuery(termFromURL);
    }
  }, [location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulate search API call
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `How to write better content about ${searchQuery}`,
        author: 'John Doe',
        excerpt: 'Learn the fundamentals of creating engaging content...'
      },
      {
        id: '2',
        title: `${searchQuery} - A comprehensive guide`,
        author: 'Jane Smith',
        excerpt: 'Everything you need to know about this topic...'
      },
      {
        id: '3',
        title: `Best practices for ${searchQuery}`,
        author: 'Mike Johnson',
        excerpt: 'Professional tips and tricks for success...'
      }
    ];
    
    setResults(mockResults);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      setIsOpen(true);
      performSearch(value);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('q', query);
      navigate(`/search?${searchParams.toString()}`);
      setIsOpen(false);
      onSearch?.(query);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/post/${result.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {query ? `Search results for "${query}"` : 'Recent searches'}
                </p>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{result.title}</h4>
                          {result.author && (
                            <p className="text-sm text-gray-500 mt-1">by {result.author}</p>
                          )}
                          {result.excerpt && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Start typing to search...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {query && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handleSubmit}
                  className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-1 rounded transition-colors duration-150"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;