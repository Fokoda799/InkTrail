const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Helper to build full API URL.
 */
export function apiUrl(path: string): string {
  console.log("API_BASE:", API_BASE);
  return `${API_BASE}${path}`;
}

/**
 * Core fetch wrapper that automatically attaches Authorization header.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. User must log in.");
  }

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    credentials: "include", // send cookies if needed
    ...options,
  };

  return fetch(apiUrl(path), defaultOptions);
}
