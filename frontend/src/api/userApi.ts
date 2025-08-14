interface UpdateUserData {
  username?: string;
  bio?: string;
  avatar?: string;
  theme?: 'light' | 'dark' | 'system';
  Language?: 'en' | 'fr' | 'ar';
  notification?: {
    like?: boolean;
    follow?: boolean;
    comment?: boolean;
    costume?: boolean;
  }
}

export const updateUser = async (updates: UpdateUserData) => {
  const res = await fetch('/api/v1/user/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error('Failed to update user data');
  }
}