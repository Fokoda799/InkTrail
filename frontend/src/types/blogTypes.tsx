// types/blogTypes.ts

export interface Author {
  _id: string;
  username: string;
  avatar: string;
  bio?: string;
  follows?: string[];
  isFollowed?: boolean;
  isVerified?: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: Author;
  state: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  likes?: number;
  isLiked: boolean;
  bookmarks?: string[];
  isBookmarked?: boolean;
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
  readTime?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface Like {
  likeCount: number;
  liked: boolean;
}

export interface Comment {
  _id: string;
  user: Author;
  content: string;
  liked: boolean;
  likeCount: number;
  isAuthorLiked: boolean; // Indicates if the comment author has liked this comment
  isAuthor: boolean; // Indicates if the comment's author is the blog author
  replies: Comment[];
  repliesCount: number; // Total number of replies to this comment
  createdAt: string;
} 

// actions/actionTypes.ts
export const BLOGS_FETCHED = 'BLOGS_FETCHED';
