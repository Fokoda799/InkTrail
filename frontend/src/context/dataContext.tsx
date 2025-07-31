import React, { createContext, useContext, useEffect, useState } from 'react';
import { Blog, BlogInput } from '../types/blogTypes';
import { fetchBlogs, createBlog, updateBlog, deleteBlog, fetchBlogById, toggleLike } from '../api/dataApi';
interface DataContextType {
  blogs: Blog[];
  blog: Blog | null;
  isLoading: boolean;
  error: string | null;
  refreshBlogs: (viewType: 'feeds' | 'following', page: number, sortBy: 'latest' | 'trending' | 'popular' | null) => Promise<void>;
  getBlogById: (id: string) => Promise<void>;
  addBlog: (data: BlogInput) => Promise<void>;
  editBlog: (id: string, data: BlogInput) => Promise<void>;
  removeBlog: (id: string) => Promise<void>;
  setLike: (blogId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBlogs = async (viewType: 'feeds' | 'following' = 'feeds', page: number = 0, sortBy: 'latest' | 'trending' | 'popular' | null = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBlogs(viewType, page, sortBy);
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const getBlogById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // If not found, fetch it from the API
      const fetchedBlog = await fetchBlogById(id);
      console.log('Fetched blog from API:', fetchedBlog);
      setBlog(fetchedBlog);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog');
      return;
    } finally {
      setIsLoading(false);
    }
  }

  const addBlog = async (data: BlogInput) => {
    try {
      const newBlog = await createBlog(data);
      setBlogs((prev) => [newBlog, ...prev]);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create blog');
    }
  };

  const editBlog = async (id: string, data: BlogInput) => {
    try {
      const updatedBlog = await updateBlog(id, data);
      setBlogs((prev) => prev.map((blog) => (blog._id === id ? updatedBlog : blog)));
      console.log('Updated blog:', updatedBlog);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update blog');
    }
  };

  const removeBlog = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete blog');
    }
  };

  // Blog actions like, comment, etc. can be handled here
  const setLike = async (blogId: string) => {
    try {
      await toggleLike(blogId);
      // Update the blog state to reflect the new like status
      setBlog((prev) => (prev ? { ...prev, isLiked: !prev.isLiked, likes: prev.likes ? prev.likes + (prev.isLiked ? -1 : 1) : 1 } : prev));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update like status');
    }
  };

  useEffect(() => {
    if (blog) {
      setBlog(blog); // Sync from context
    }
  }, [blog]);

  return (
    <DataContext.Provider
      value={{ blogs, isLoading, error, refreshBlogs, blog, getBlogById, addBlog, editBlog, removeBlog, setLike }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
