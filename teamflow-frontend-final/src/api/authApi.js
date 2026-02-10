import { apiFetch } from "./apiClient";

export async function loginUser(email, password) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Login failed");
  }

  return response.json();
}

export async function logout() {
  const response = await apiFetch("/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}

export async function changePassword(payload) {
  const response = await apiFetch("/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Password change failed");
  }

  return response.json();
}

/* ===============================
   FORGOT PASSWORD
================================ */
export async function forgotPassword(email) {
  const response = await apiFetch("/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("This email is not registered.");
  }

  return response.json();
}

/* ===============================
   RESET PASSWORD (TOKEN)
================================ */
export async function resetPassword(payload) {
  const response = await apiFetch("/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Password reset failed");
  }

  return response.json();
}
