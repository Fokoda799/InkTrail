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

export interface User {
    _id: string;
    fullName?: string;
    username: string;
    email: string;
    password?: string;
    withPassword: boolean;
    isVerified: boolean;
    avatar?: string;
    bio?: string;
    blogs?: Blog[];
    following: string[];
    followers: string[];
}

// User state types
export interface UserState {
    user: User | null;
	isAuthenticated: boolean;
	error: string | null,
	isLoading: boolean,
	isCheckingAuth: boolean,
	message: string | null,
}

// User response types
export interface AuthResponse {
    success: true;
    user: User;
    token: string;
}

export interface UserResponse {
    success: true;
    user: User;
    isFollowing: boolean;
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
