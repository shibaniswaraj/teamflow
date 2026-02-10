import { apiFetch } from "./apiClient";

export async function fetchProjects(page = 0, size = 8) {
  const res = await apiFetch(`/projects?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchProjectById(projectId) {
  const res = await apiFetch(`/projects/${projectId}`);
  if (!res.ok) throw new Error("Failed to load project");
  return res.json();
}

export async function createProject(payload) {
  const res = await apiFetch("/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create project");
  return;
}

export async function updateProject(projectId, payload) {
  const res = await apiFetch(`/projects/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update project");

  // ✅ IMPORTANT: do NOT call res.json()
  return;
}
export async function fetchProjectMembers(projectId) {
  const res = await apiFetch(`/projects/${projectId}/members`);
  if (!res.ok) throw new Error("Failed to fetch project members");
  return res.json();
}
