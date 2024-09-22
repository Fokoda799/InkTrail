// pages/SearchResults.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Blog } from '../types/blogTypes'; // Import Blog type
import './Search.css'; // Create a CSS file for styling
import Card from '../components/Card'; // Import Card component
import { Grid } from '@mui/material';

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch search results when the component mounts or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get('term');
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'desc';

    if (term) {
      fetchSearchResults(term, category, sort);
    }
  }, [location.search]);

  const fetchSearchResults = async (term: string, category: string, sort: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/blogs/search', {
        params: {
          term,
          category,
          sort,
        },
      });
      setResults(response.data.blogs);
    } catch (err: unknown) {
      setError('Error fetching search results.');
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-page">
      <h1>Search Results</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : results.length > 0 ? (
        <Grid container spacing={1} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
            {results.map((blog) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={blog._id}
                onClick={() => navigate(`/blog/${blog.author?.username}/${blog._id}`)}
                sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
              >
                <Card {...blog} />
              </Grid>
            ))}
          </Grid>
      ) : (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
};

export default SearchResults;
