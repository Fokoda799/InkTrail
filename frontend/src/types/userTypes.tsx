
// User sign-up types
export interface FormData {
    fullName?: string;
    username?: string;
    email: string;
    password: string;
};

// User state types
export interface UserState {
    currentUser: object | null;
    isAuth: boolean;
    loading: boolean;
    error: string | null;
}

// User response types
export interface AuthResponse {
    success: true;
    user: object;
    token: string;
}

// Erorr response types
export interface ErrorResponse {
    success: false;
    message: string;
}
