import type { AppDispatch } from '../redux/store';
import type { Blog, BlogResponse, ErrorResponse } from '../types/blogTypes';
import axios from 'axios';
import {
  fetchBlogsStart, fetchBlogsSuccess, fetchBlogsFailure,
  fetchBlogByIdStart, fetchBlogByIdSuccess, fetchBlogByIdFailure,
  createBlogStart, createBlogSuccess, createBlogFailure,
  updateBlogStart, updateBlogSuccess, updateBlogFailure,
  deleteBlogStart, deleteBlogSuccess, deleteBlogFailure,
  clearError
} from '../redux/reducers/blogReducer';

// Fetch all blogs
export const fetchBlogs = (page: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchBlogsStart());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blogs?page=${page}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(fetchBlogsFailure(data.message));
      return;
    }

    dispatch(fetchBlogsSuccess(data)); // Use fallback if blogs is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(fetchBlogsFailure(message));
  }
};

// Fetch a single blog by ID
export const fetchBlogById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchBlogByIdStart());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blogs/${id}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(fetchBlogByIdFailure(data.message));
      return;
    }

    dispatch(fetchBlogByIdSuccess(data.blog)); // Use fallback if blog is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(fetchBlogByIdFailure(message));
  }
};

// Create a new blog
export const createBlog = (blogData: Blog) => async (dispatch: AppDispatch) => {
  try {
    dispatch(createBlogStart());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.post('/api/v1/blogs', blogData);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(createBlogFailure(data.message));
      return;
    }

    dispatch(createBlogSuccess(data.blog || null)); // Use fallback if blog is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(createBlogFailure(message));
  }
};

// Update an existing blog
export const updateBlog = (id: string, blogData: Blog) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateBlogStart());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.put(`/api/v1/blogs/${id}`, blogData);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(updateBlogFailure(data.message));
      return;
    }

    dispatch(updateBlogSuccess(data.blog || null)); // Use fallback if blog is null
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(updateBlogFailure(message));
  }
};

// Delete a blog
export const deleteBlog = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(deleteBlogStart());

    const { data }: { data: BlogResponse | ErrorResponse } = await axios.delete(`/api/v1/blogs/${id}`);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(deleteBlogFailure(data.message));
      return;
    }

    dispatch(deleteBlogSuccess(id));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(deleteBlogFailure(message));
  }
};

// Clear errors
export const clearBlogError = () => (dispatch: AppDispatch) => {
  dispatch(clearError());
};
