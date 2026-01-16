const BASE_URL = "http://127.0.0.1:8000";

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "API Error");
  }

  return response.json();
}
