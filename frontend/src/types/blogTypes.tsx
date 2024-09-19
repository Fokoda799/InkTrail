// types/blogTypes.ts

export interface UserId {
  _id?: string;
  username?: string;
  avatar?: string;
  blogs?: Blog[];
}

export interface Blog {
  _id?: string;
  userId: UserId;
  title: string;
  content: string;
  image?: string;
  category: string;
  tags?: string[];
  isPublished?: boolean;
  likes?: string[];
  comments?: Comment[];
  createdAt?: string;
}

export interface Comment {
  _id?: string;
  userId: UserId;
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
  likes: string[];
  loading: boolean;
  error: string | null; // Changed from Error to string to match the action payload
}
