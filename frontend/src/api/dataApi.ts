import { Blog, BlogInput, Comment, Like } from '../types/blogTypes';
import { apiUrl } from './api';

// Fetch all blogs
export const fetchBlogs = async (
  viewType: 'feeds' | 'following',
  page: number,
  sortBy: 'latest' | 'trending' | 'popular' | null
): Promise<Blog[]> => {
  const res = await fetch(apiUrl(`/blogs?viewType=${viewType}&page=${page}&sortBy=${sortBy || ''}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blogs');
  return data.data.blogs;
};

// Fetch blog by ID
export const fetchBlogById = async (id: string): Promise<Blog> => {
  const res = await fetch(apiUrl(`/blogs/${id}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blog');
  return data.blog;
};

// Create a new blog
export const createBlog = async (blogData: BlogInput): Promise<Blog> => {
  const res = await fetch(apiUrl('/blogs'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(blogData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create blog');
  return data;
};

// Update blog
export const updateBlog = async (id: string, blogData: BlogInput): Promise<Blog> => {
  const res = await fetch(apiUrl(`/blogs/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(blogData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update blog');
  return data;
};

// Delete blog
export const deleteBlog = async (id: string) => {
  const res = await fetch(apiUrl(`/blogs/${id}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete blog');
  }
};

// Toggle like/bookmark/etc. on blog
export const toggleAction = async (id: string, actionType: string): Promise<Blog> => {
  const res = await fetch(apiUrl(`/blogs/${id}/action`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ actionType }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle action');
  return data.blog;
};

// Comments class
export class CommentActions {
  static async getComments(blogId: string): Promise<Comment[]> {
    const res = await fetch(apiUrl(`/blogs/${blogId}/comments`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch comments');
    return data.comments;
  }

  static async getCommentCount(blogId: string): Promise<number> {
    const res = await fetch(apiUrl(`/blogs/${blogId}/comments/count`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch comment count');
    return data.count;
  }

  static async addComment(blogId: string, content: string, replyingTo?: string): Promise<Comment> {
    const res = await fetch(apiUrl(`/blogs/${blogId}/comments`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content, replyingTo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add comment');
    return data.comment;
  }

  static async updateComment(commentId: string, content: string): Promise<Comment> {
    const res = await fetch(apiUrl(`/blogs/comments/${commentId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update comment');
    return data.comment;
  }

  static async deleteComment(commentId: string) {
    const res = await fetch(apiUrl(`/blogs/comments/${commentId}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }
  }

  static async toggleCommentLike(commentId: string, blogId: string): Promise<Like> {
    const res = await fetch(apiUrl(`/blogs/comments/${commentId}/like`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ blogId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle comment like');
    return data;
  }
}

export const getBlogsByUsername = async (username: string, limit: number, offset: number): Promise<Blog[]> => {
  const res = await fetch(apiUrl(`/blogs/user/${username}?limit=${limit}&offset=${offset}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to get user blogs');
  return data.blogs;
};