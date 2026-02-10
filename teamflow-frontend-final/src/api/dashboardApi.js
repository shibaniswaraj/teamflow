import { apiFetch } from "./apiClient";

// ===============================
// ADMIN DASHBOARD
// ===============================
export async function fetchAdminDashboard() {
  const res = await apiFetch("/dashboard/admin", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to load admin dashboard");
  return res.json();
}

// ===============================
// MANAGER DASHBOARD
// ===============================
export async function fetchManagerDashboard() {
  const res = await apiFetch("/dashboard/manager", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to load manager dashboard");
  return res.json();
}

// ===============================
// MEMBER DASHBOARD
// ===============================
export async function fetchMemberDashboard() {
  const res = await apiFetch("/dashboard/member", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to load member dashboard");
  return res.json();
}
