const API_BASE = 'https://inktrail.onrender.com/api/v1'; // your backend base URL


export function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export function defaultFetchOptions(): RequestInit {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. User must log in.');
  }
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    credentials: 'include', // send cookies/JWT cookies with every request
  };
}