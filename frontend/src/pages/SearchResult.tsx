import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Grid, List, Clock, Eye,
  User, Calendar, 
  TrendingUp, BookOpen, Users,
} from 'lucide-react';
import { useSearch } from '../context/searchContext';

interface SearchResult {
  _id: string;
  title: string;
  type: 'blog' | 'author';
  author: {
    _id: string;
    username: string;
    avatar?: string;
  }
  coverImage?: string;
  createdAt?: string;
  readTime?: string;
  views?: number;
}

interface SearchResultsProps {
  initialQuery?: string;
  onResultClick?: (result: SearchResult) => void;
}

type ViewMode = 'grid' | 'list';

const SearchResults: React.FC<SearchResultsProps> = ({
  onResultClick 
}) => {
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [totalResults, setTotalResults] = useState(0);

  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      // 🔌 TODO: Replace this with your actual search API call
      // const searchResults = await yourSearchFunction(query, 50);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // useEffect(() => {
  //   let filtered = [...results];

  //   if (filterBy !== 'all') {
  //     filtered = filtered.filter(result => result.type === filterBy.slice(0, -1));
  //   }

  //   filtered.sort((a, b) => {
  //     switch (sortBy) {
  //       case 'date':
  //         return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  //       case 'views':
  //         return (b.views || 0) - (a.views || 0);
  //       case 'likes':
  //         return 0;
  //       case 'relevance':
  //       default:
  //         return 0;
  //     }
  //   });

  //   setFilteredResults(filtered);
  //   setTotalResults(filtered.length);
  // }, [results, filterBy, sortBy]);

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    }
    navigate(`/blog/${result._id}`);
  };

  const clearSearch = () => {
    setFilteredResults([]);
    setTotalResults(0);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  // const getResultCounts = () => {
  //   const blogsCount = results.filter(result => result.type === 'blog').length;
  //   const authorsCount = results.filter(result => result.type === 'author').length;
  //   return { blogsCount, authorsCount };
  // };

  // const { blogsCount, authorsCount } = getResultCounts();

  return (
    <div className="bg-gray-50 h-[calc(100vh-4rem)]">
      {filteredResults.length !== 0 &&  (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Search Results
                  </h1>
                  <div className="text-gray-600">
                    {loading ? (
                      <span>Searching...</span>
                    ) : (
                      <span>
                        {totalResults.toLocaleString()} results for "{searchQuery}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-content-center align-items-center">
          {/* <div className="w-64 flex-shrink-0">
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-32">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Content Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      value="all"
                      checked={filterBy === 'all'}
                      onChange={(e) => setFilterBy(e.target.value as FilterType)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      All ({totalResults})
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      value="blogs"
                      checked={filterBy === 'blogs'}
                      onChange={(e) => setFilterBy(e.target.value as FilterType)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Stories ({blogsCount})
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      value="authors"
                      checked={filterBy === 'authors'}
                      onChange={(e) => setFilterBy(e.target.value as FilterType)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Authors ({authorsCount})
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  Sort by
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Most Recent</option>
                  <option value="views">Most Viewed</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
            </div>
          </div> */}

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                <span className="ml-4 text-gray-600 text-lg">Searching...</span>
              </div>
            ) : filteredResults.length === 0 && searchQuery ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try different keywords or check your spelling
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : !searchQuery ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">
                  Enter keywords to find stories, authors, and topics
                </p>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }`}>
                {filteredResults.map((result) => (
                  <div
                    key={`${result.type}-${result._id}`}
                    onClick={() => handleResultClick(result)}
                    className={`group cursor-pointer transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1'
                        : 'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-video bg-gray-200 overflow-hidden">
                          {result.type === 'blog' ? (
                            result.coverImage ? (
                              <img
                                src={result.coverImage}
                                alt={result.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-amber-500" />
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              {result.author?.avatar ? (
                                <img
                                  src={result.author?.avatar}
                                  alt={result.title}
                                  className="w-20 h-20 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-12 h-12 text-blue-500" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                              {result.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            This is a brief description or subtitle of the content. It provides an overview of what the content is about and engages the reader.
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {result.type === 'blog' ? (
                              <>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {result.readTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {result.views ? formatNumber(result.views) : '0'}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Author
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Popular
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {result.type === 'blog' ? (
                              result.coverImage ? (
                                <img
                                  src={result.coverImage}
                                  alt={result.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                  <BookOpen className="w-6 h-6 text-amber-500" />
                                </div>
                              )
                            ) : result.author.avatar ? (
                              <img
                                src={result.author.avatar}
                                alt={result.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg">
                                <User className="w-6 h-6 text-blue-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                {result.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              this is a brief description or subtitle of the content. It provides an overview of what the content is about and engages the reader.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {result.type === 'blog' ? (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {result.readTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {result.views ? formatNumber(result.views) : '0'}
                                  </span>
                                  {result.createdAt && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(result.createdAt)}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Author Profile
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Popular
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;