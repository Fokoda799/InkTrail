import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SignUpData, User } from "../types/userTypes";
import { app } from "../firebase";
import { defaultFetchOptions, apiUrl } from "./api";

export const getMe = async (): Promise<User> => {
  const res = await fetch(apiUrl('/auth/me'), {
    method: 'GET',
    ...defaultFetchOptions,
  });
  if (!res.ok) {
    console.error('Failed to fetch user data:', res.statusText);
    throw new Error('Failed to fetch user data');
  }

  const data = await res.json();
  return data.user;
}

export const signUp = async (userData: SignUpData) => {
  const res = await fetch(apiUrl('/auth/sign-up'), {
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
  const res = await fetch(apiUrl('/auth/sign-in'), {
    method: 'POST',
    ...defaultFetchOptions,
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json(); // 👈 Parse JSON response
    throw new Error(errorData.message || 'Something went wrong');
  }
  return res.json();
};

export const logOut = async () => {
  const res = await fetch(apiUrl('/auth/logout'), {
    method: 'GET',
    ...defaultFetchOptions,
  });
  if (!res.ok) {
    console.error('Failed to log out:', res.statusText);
    throw new Error('Failed to log out');
  }
  return res.json();
}

export const verifyEmailToken = async (token: string) => {
  const res = await fetch(apiUrl('/auth/verify-email'), {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const errorData = await res.json(); // 👈 Parse JSON response
    throw new Error(errorData.message || 'Something went wrong');
  }
  return res.json();
};

export const resendVerificationCode = async (email: string) => {
  const res = await fetch(apiUrl('/auth/resend-verification-email'), {
    method: 'POST',
    ...defaultFetchOptions,
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

    const res = await fetch(apiUrl('/auth/google'), {
      method: 'POST',
      ...defaultFetchOptions,
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
    const res = await fetch(apiUrl(`/user/profile/${username}`), {
      method: 'GET',
      ...defaultFetchOptions,
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
  const res = await fetch(apiUrl('/auth/update-password'), {
    method: 'PUT',
    ...defaultFetchOptions,
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
  const res = await fetch(apiUrl('/auth/delete-account'), {
    method: 'DELETE',
    ...defaultFetchOptions,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete account');
  }
}
