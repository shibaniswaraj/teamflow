import { apiFetch } from "./apiClient";

export async function fetchTasksByProject(projectId) {
  const res = await apiFetch(`/tasks/project/${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(payload) {
  const res = await apiFetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(taskId, payload) {
  const res = await apiFetch(`/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function moveTaskStatus(taskId, payload) {
  const res = await apiFetch(`/tasks/${taskId}/move`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to move task");
  return res.json();
}

export async function fetchBacklogTasks() {
  const res = await apiFetch("/tasks/backlog");
  if (!res.ok) throw new Error("Failed to fetch backlog tasks");
  return res.json();
}
