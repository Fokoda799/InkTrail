import type { AppDispatch } from '../redux/store';
import type { Blog, BlogResponse, ErrorResponse } from '../types/blogTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  fetchBlogsSuccess, fetchBlogByIdSuccess,
  createBlogSuccess, updateBlogSuccess,
  deleteBlogSuccess, loadingState, failureState,
  clearError, likeBlogSuccess, searchBlogs
} from '../redux/reducers/blogReducer';

// Fetch all blogs
export const fetchBlogs = (page: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadingState());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blogs?page=${page}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(failureState(data.message));
      return;
    }

    dispatch(fetchBlogsSuccess(data)); // Use fallback if blogs is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(failureState(message));
  }
};

// Fetch a single blog by ID
export const fetchBlogById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    console.log(`Dispatching loading state for blog ID: ${id}`);
    dispatch(loadingState());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blog/${id}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(failureState(data.message));
      return;
    }

    console.log('Fetched blog data:', data.blog); // Check if data.blog is not null/undefined
    if (data.blog) {
      dispatch(fetchBlogByIdSuccess(data.blog)); // Ensure blog data is valid before dispatching
    } else {
      console.log('Blog data is null or undefined');
      dispatch(failureState('Blog not found or data is invalid'));
    }
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(failureState(message));
  }
};

// Create a new blog
export const createBlog = (blogData: Blog) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadingState());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.post('/api/v1/blogs', blogData);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(failureState(data.message));
      return;
    }

    dispatch(createBlogSuccess(data.blog || null)); // Use fallback if blog is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(failureState(message));
  }
};

// Update an existing blog
export const updateBlog = (id: string, blogData: Blog) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadingState());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.put(`/api/v1/blogs/${id}`, blogData);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(failureState(data.message));
      return;
    }

    dispatch(updateBlogSuccess(data.blog || null)); // Use fallback if blog is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(failureState(message));
  }
};

// Delete a blog
export const deleteBlog = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadingState());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.delete(`/api/v1/blogs/${id}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(failureState(data.message));
      return;
    }

    dispatch(deleteBlogSuccess(id));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(failureState(message));
  }
};

// Fetch blogs with filters
export const fetchFilteredBlogs = (page: number, filter: object) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadingState());

    // Use params to build a structured query with filters
    const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blogs`, {
      params: {
        page,
        ...filter // Spread filter object into params
      }
    });

    if (!data.success) {
      dispatch(failureState(data.message));
      return;
    }
    dispatch(fetchBlogsSuccess(data));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(failureState(message)); // Fixed wrong failure dispatch
  }
};

export const likeBlog = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadingState());

    // Call the API to like/unlike the blog
    const { data }: { data: BlogResponse | ErrorResponse } = await axios.put(`/api/v1/blog/like/${id}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(failureState(data.message));
      return;
    }

    // Dispatch success action with updated blog
    dispatch(likeBlogSuccess(data.blog));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);

    // Dispatch failure state with the error message
    dispatch(failureState(message));
  }
};

export const sendQuery = createAsyncThunk(
  'blog/sendQuery',
  async (query: string, { dispatch }) => {
    try {
      dispatch(loadingState());
      const response = await axios.get(`/api/v1/blogs/search?q=${query}`);
      const data = response.data;

      if (data.success) {
        dispatch(searchBlogs(data.blogs));
      } else {
        dispatch(failureState(data.message));
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
      console.log('Error:', message);

      // Dispatch failure state with the error message
      dispatch(failureState(message));
    }
  }
);


// Clear errors action
export const clearBlogError = () => (dispatch: AppDispatch) => {
  dispatch(clearError());
};
