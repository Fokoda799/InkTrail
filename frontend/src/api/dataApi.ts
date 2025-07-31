import { Blog, BlogInput } from '../types/blogTypes';

export const fetchBlogs = async (viewType: 'feeds' | 'following', page: number, sortBy: 'latest' | 'trending' | 'popular' | null): Promise<Blog[]> => {
  const response = await fetch(`/api/v1/blogs?viewType=${viewType || "feeds"}&page=${page}&sortBy=${sortBy}`);

  const res = await response.json(); // ✅ parse once

  if (!response.ok) {
    if (res.status === 400) {
      console.log(res);
      localStorage.clear();
    }
    throw new Error(res.message || 'Failed to fetch blogs');
  }
  const { data } = res;

  console.log('Blogs:', data.blogs); // ✅ now data.blogs is accessible
  return data.blogs;
};


export const fetchBlogById = async (id: string): Promise<Blog> => {
  console.log('Fetching blog with ID:', id);
  try {
    const response = await fetch(`/api/v1/blogs/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch blog');
    }
    const { blog } = data;
    console.log('Fetched blog:', blog);
    return blog;
  } catch (err: any) {
    console.error('Error fetching blog:', err);
    throw new Error(err.message || 'Failed to fetch blog');
  }
}

export const createBlog = async(data: BlogInput): Promise<Blog> => {
  const response = await fetch('/api/v1/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error(response.statusText || 'Failed to create blog');
  return response.json();
}

export const updateBlog = async (id: string, data: BlogInput): Promise<Blog> => {
  const response = await fetch(`/api/v1/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error(response.statusText || 'Failed to update blog');
  console.log('Updated blog response:', response);
  return response.json();
}

export const deleteBlog = async (id: string): Promise<void> => {
  const response = await fetch(`api/v1/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error(response.statusText || 'Failed to delete blog');
}

export const toggleLike = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/blogs/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error(response.statusText || 'Failed to set like');
};