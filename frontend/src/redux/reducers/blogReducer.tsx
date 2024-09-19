import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { BlogState} from '../../types/blogTypes';

// Define the initial state using that type
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  pagination: null,
  readyBlog: null,
  selectedBlog: null,
  loading: false,
  likes: [],
  error: null,
};

// Define the blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    loadingState: (state) => {
      state.loading = true;
    },
    failureState: (state, action) => {
      state.loading = false;
      state.error = action.payload
    },
    fetchBlogsSuccess: (state, action) => {
      state.blogs = action.payload.blogs;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    fetchBlogByIdSuccess: (state, action) => {
      state.selectedBlog = action.payload;
      state.loading = false;
      state.error = null;
    },
    createBlogSuccess: (state, action) => {
      state.blogs.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateBlogSuccess: (state, action) => {
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteBlogSuccess: (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    likeBlogSuccess: (state, action) => {
      // Update likes only for the selectedBlog
      if (state.selectedBlog && state.selectedBlog._id === action.payload._id) {
        state.selectedBlog.likes = action.payload.likes; // Update likes of the selected blog
      }
    
      // Also update the corresponding blog in the blogs array if necessary
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index].likes = action.payload.likes; // Update likes for the blog in the list
      }
    
      state.loading = false;
      state.error = null;
    },
    publishBlog: (state, action) => {
      state.readyBlog = action.payload;
    },
    clearBlogs: (state) => {
      state.blogs = [];
      state.pagination = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

// Action creators
export const {
  fetchBlogsSuccess, fetchBlogByIdSuccess,
  createBlogSuccess, updateBlogSuccess,
  deleteBlogSuccess, loadingState, failureState,
  clearError, publishBlog, likeBlogSuccess, clearBlogs
} = blogSlice.actions;

// Selector to get blog state
export const selectBlogState = (state: RootState) => state.blog;

export default blogSlice.reducer;
