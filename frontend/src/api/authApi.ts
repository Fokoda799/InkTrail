import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SignUpData, User } from "../types/userTypes";
import { app } from "../firebase";

const API_BASE_URL = 'https://inktrail.onrender.com';

export const getMe = async (): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
  });
  if (!res.ok) {
    console.error('Failed to fetch user data:', res.statusText);
    throw new Error('Failed to fetch user data');
  }

  const data = await res.json();
  return data.user;
}

export const signUp = async (userData: SignUpData) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json(); // 👈 Parse JSON response
    throw new Error(errorData.message || 'Something went wrong');
  }
  return res.json();
};

export const signIn = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json(); // 👈 Parse JSON response
    throw new Error(errorData.message || 'Something went wrong');
  }
  return res.json();
};

export const logOut = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: 'GET',
  });
  if (!res.ok) {
    console.error('Failed to log out:', res.statusText);
    throw new Error('Failed to log out');
  }
  return res.json();
}

export const verifyEmailToken = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const errorData = await res.json(); // 👈 Parse JSON response
    throw new Error(errorData.message || 'Something went wrong');
  }
  return res.json();
};

export const resendVerificationCode = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/resend-verification-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errorData = await res.json(); // 👈 Parse JSON response
    throw new Error(errorData.message || 'Something went wrong');
  }
  return res.json();
}

export const linkWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;
    const username = email?.split('@')[0];
    const avatar = result.user.photoURL;

    if (!email) throw new Error("Missing email from Google account.");

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, avatar }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "OAuth server error");
    }

    const data = await res.json();

    if (!data || typeof data !== 'object' || !data.user) {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (err: any) {
    if (err?.code === "auth/popup-closed-by-user") {
      throw new Error("Google sign-in was canceled or blocked.");
    }
    console.error("Unexpected error during Google OAuth:", err);
    throw new Error(err?.message || "Google sign-in failed.");
  }
};


export const getUser = async (username: string): Promise<User | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/profile/${username}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updatePassword = async (currentPassword: string | undefined, newPassword: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/update-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update password');
  }
  const data = await res.json();
  return data.user;
};

export const deleteAccount = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/delete-account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete account');
  }
}
