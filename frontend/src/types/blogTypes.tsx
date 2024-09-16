// types/blogTypes.ts

export interface UserId {
    _id?: string;
    username?: string;
    avatar?: string;
    blogs?: Blog[];
}

export interface Blog {
    body: ReactNode;
    _id?: string;
    userId?: UserId;
    title: string;
    content: string;
    image?: string;
    category: string;
    tags?: string[];
    isPublished?: boolean;
    claps?: number;
    comments?: Comment[];
    createdAt?: string;
  }
  
  export interface Comment {
    userId: string;
    content: string;
    createdAt: string;
  }

  export interface Pagination {
    totalBlogs: number;
    totalPages: number;
    currentPage: number
    perPage: number;
  }
  
  export interface BlogResponse {
    success: true;
    blog?: Blog;
    blogs?: Blog[] | null;
    pagination?: Pagination | null;
    message?: string;
  }
  
  export interface ErrorResponse {
    success: false;
    message: Error;
  }
  
  export interface Error {
    message: string;
  }

export interface BlogState {
    blogs: Blog[];
    currentBlog: Blog | null;
    pagination: Pagination | null;
    readyBlog: Blog | null;
    loading: boolean;
    error: Error | null;
}