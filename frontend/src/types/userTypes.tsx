
// User sign-up types
export interface FormData {
    fullName?: string;
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
    avatar?: string;
    bio?: string;
    blogs?: string[];
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
    fullName?: string;
    username: string;
    email: string;
    password?: string;
    avatar?: string;
}
