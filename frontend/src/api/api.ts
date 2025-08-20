const API_BASE =
  import.meta.env.DEV_MODE === "development"
    ? import.meta.env.VITE_API_BASE || "http://localhost:8080/api/v1"
    : import.meta.env.VITE_API_BASE;

/**
 * Helper to build full API URL.
 */
export function apiUrl(path: string): string {
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
