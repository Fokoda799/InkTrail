import { Blog, BlogInput, Comment, Like } from '../types/blogTypes';

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
  const response = await fetch(`/api/v1/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error(response.statusText || 'Failed to delete blog');
}

export const toggleAction = async (id: string, actionType: string): Promise<Blog> => {
  const response = await fetch(`/api/v1/blogs/${id}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ actionType }),
  });

  if (!response.ok) throw new Error(response.statusText || 'Failed to set like');
  const data = await response.json();
  console.log('Action response:', data.blog);
  return data.blog;
};

export class CommentActions {
  static async getComments(blogId: string): Promise<Comment[]> {
    const response = await fetch(`/api/v1/blogs/${blogId}/comments`);
    if (!response.ok) throw new Error(response.statusText || 'Failed to fetch comments');
    const data = await response.json();
    console.log('Fetched comments:', data.comments);
    return data.comments;
  }

  static async getCommentCount(blogId: string): Promise<number> {
    const response = await fetch(`/api/v1/blogs/${blogId}/comments/count`);
    if (!response.ok) throw new Error(response.statusText || 'Failed to fetch comment count');
    const data = await response.json();
    return data.count;
  }

  static async addComment(blogId: string, content: string, replyingTo?: string): Promise<Comment> {
    const response = await fetch(`/api/v1/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, replyingTo }),
    });

    if (!response.ok) throw new Error(response.statusText || 'Failed to add comment');
    const data = await response.json();
    console.log('Added comment:', data.comment);
    return data.comment;
  }

  static async updateComment(commentId: string, content: string): Promise<Comment> {
    const response = await fetch(`/api/v1/blogs/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error(response.statusText || 'Failed to update comment');
    const data = await response.json();
    return data.comment;
  }

  static async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`/api/v1/blogs/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(response.statusText || 'Failed to delete comment');
  }

  static async toggleCommentLike(commentId: string, blogId: string  ): Promise<Like> {
    const response = await fetch(`/api/v1/blogs/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blogId }),
    });

    if (!response.ok) throw new Error(response.statusText || 'Failed to toggle comment like');
    const data = await response.json();
    console.log('Toggled comment like:', data);
    return data;
  }
}

export const getBlogsByUsername = async (username: string, limit: number, offset: number): Promise<Blog[]> => {
  const response = await fetch(`/api/v1/blogs/user/${username}?limit=${limit}?offset${offset}`, { 
    method: 'GET',
  });

  if (!response.ok) throw new Error(response.statusText || 'Failed to get user blogs');
  const data = await response.json();
  return data.blogs;
}