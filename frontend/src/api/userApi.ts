import { apiUrl } from './api';

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
  const res = await fetch(apiUrl('/user/me'), {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error('Failed to update user data');
  }
}