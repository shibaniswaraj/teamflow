import { apiFetch } from "./apiClient";

export async function fetchUsers(page = 0, size = 8) {
  const response = await apiFetch(`/users?page=${page}&size=${size}`);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to fetch users");
  }

  return response.json();
}

export async function createUser(payload) {
  const response = await apiFetch("/auth/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to create user");

  return data;
}

/* ✅ For project edit/create */
export async function fetchMembers() {
  const response = await apiFetch("/users/members");

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to fetch members");
  }

  return response.json();
}

// ===============================
// GET USER BY ID (ADMIN – EDIT)
// ===============================
export async function getUserById(userId) {
  const response = await apiFetch(`/users/${userId}`);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to load user");
  }

  return response.json();
}

// ===============================
// UPDATE USER (ADMIN)
// ===============================
export async function updateUser(userId, payload) {
  const response = await apiFetch(`/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Failed to update user";

    try {
      const text = await response.text();
      if (text) {
        const json = JSON.parse(text);
        message = json.error || message;
      }
    } catch (_) {}

    throw new Error(message);
  }

  return;
}

export async function fetchMyProfile() {
  const res = await apiFetch("/users/me");
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export async function updateMyProfile(payload) {
  const res = await apiFetch("/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}
