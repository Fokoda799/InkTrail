import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { BlogState} from '../../types/blogTypes';

// Define the initial state using that type
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  pagination: null,
  readyBlog: null,
  loading: false,
  error: null,
};

// Define the blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    fetchBlogsStart: (state) => {
      state.loading = true;
    },
    fetchBlogsSuccess: (state, action) => {
      state.blogs = action.payload.blogs;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    fetchBlogsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchBlogByIdStart: (state) => {
      state.loading = true;
    },
    fetchBlogByIdSuccess: (state, action) => {
      state.currentBlog = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBlogByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createBlogStart: (state) => {
      state.loading = true;
    },
    createBlogSuccess: (state, action) => {
      state.blogs.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    createBlogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBlogStart: (state) => {
      state.loading = true;
    },
    updateBlogSuccess: (state, action) => {
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateBlogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBlogStart: (state) => {
      state.loading = true;
    },
    deleteBlogSuccess: (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    deleteBlogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    publishBlog: (state, action) => {
      state.readyBlog = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

// Action creators
export const {
  fetchBlogsStart, fetchBlogsSuccess, fetchBlogsFailure,
  fetchBlogByIdStart, fetchBlogByIdSuccess, fetchBlogByIdFailure,
  createBlogStart, createBlogSuccess, createBlogFailure,
  updateBlogStart, updateBlogSuccess, updateBlogFailure,
  deleteBlogStart, deleteBlogSuccess, deleteBlogFailure,
  clearError, publishBlog
} = blogSlice.actions;

// Selector to get blog state
export const selectBlogState = (state: RootState) => state.blog;

export default blogSlice.reducer;
