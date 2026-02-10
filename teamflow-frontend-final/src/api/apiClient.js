const API_BASE_URL = "http://localhost:8080";

export async function apiFetch(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
    ...options,
  });

  if (response.status === 401) {
    // window.location.replace("/login");
    throw new Error("Session expired");
  }

  if (response.status === 403) {
    const text = await response.text();
    throw new Error(text);
  }

  return response;
}
