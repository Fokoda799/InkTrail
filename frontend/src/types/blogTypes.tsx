// types/blogTypes.ts

export interface Author {
  _id?: string;
  username?: string;
  avatar?: string;
  blogs?: Blog[];
  followers?: string[];
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: {
    username: string;
    avatar?: string;
    isVerified?: boolean;
    bio?: string;
    followers?: string[];
    following?: string[];
  };
  state: 'draft' | 'published' | 'archived';
  createdAt: string;
  likes?: number;
  isLiked: boolean;
  bookmarks?: string[];
  comments?: number;
  readTime?: number;
  tags?: string[];
  coverImage?: string;
  views?: number;
  images?: string[];
}

export interface BlogInput {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  actionType?: string;
}

export interface Comment {
  _id?: string;
  author: Author;
  content: string;
  createdAt: string;
}

export interface Pagination {
  totalBlogs: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface BlogResponse {
  success: true;
  blog: Blog;
  blogs?: Blog[] | null;
  pagination?: Pagination | null;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string; // Changed from Error to string for consistency with the reducer
}

export interface LikesResponse {
  success: true;
  likes: string[];
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  pagination: Pagination | null;
  readyBlog: Blog | null;
  selectedBlog: Blog | null;
  items: Item[];
  likes: string[];
  loading: boolean;
  error: string | null; // Changed from Error to string to match the action payload
}

export interface Item {
  id: string;
  title: string;
}

export interface ItemsResponse {
  success: true;
  items: Item[];
}

// actions/actionTypes.ts
export const BLOGS_FETCHED = 'BLOGS_FETCHED';
