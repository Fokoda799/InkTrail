import { Blog } from './blogTypes';


// User sign-up types
export interface FormData {
    username?: string;
    email: string;
    password: string;
};

export interface UpdateData {
    username: string;
    bio: string;
    avatar: string |  undefined;
}

interface User {
    fullName?: string;
    username: string;
    email: string;
    password?: string;
    withPassword: boolean;
    avatar?: string;
    bio?: string;
    blogs?: Blog[];
}

// User state types
export interface UserState {
    currentUser: User | null;
    isAuth: boolean;
    loading: boolean;
    error: string | null;
}

// User response types
export interface AuthResponse {
    success: true;
    user: User;
    token: string;
}

// Erorr response types
export interface ErrorResponse {
    success: false;
    message: string;
}

export interface SignInData {
    email: string;
    password: string;
}
  
export interface SignUpData {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
}

export interface UserAction {
    type: string;
    payload: User | null;
}

export interface ErrorAction {
    type: string;
    payload: string;
}
