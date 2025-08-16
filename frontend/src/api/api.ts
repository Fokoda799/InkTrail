const API_BASE = import.meta.env.DEV_MODE  === "development"
  ? import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'
  : import.meta.env.VITE_API_BASE;

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
    },
    credentials: 'include', // send cookies/JWT cookies with every request
  };
}