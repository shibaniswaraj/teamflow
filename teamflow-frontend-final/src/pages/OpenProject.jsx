import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import KanbanBoard from "../components/kanban/KanbanBoard";
import BoardHeader from "../components/kanban/BoardHeader";
import CreateTask from "../components/CreateTaskModal";

import {
  fetchTasksByProject,
  moveTaskStatus
} from "../api/taskApi";

import {
  fetchProjectMembers,
  fetchProjectById
} from "../api/projectApi";

import { useAuth } from "../auth/useAuth";

export default function OpenProject() {
  const { projectId } = useParams();
  const { auth } = useAuth();

  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchProjectById(projectId)
      .then(p => setProjectName(p.name))
      .catch(console.error);

    fetchTasksByProject(projectId)
      .then(setTasks)
      .catch(console.error);

    fetchProjectMembers(projectId)
  .then(data => {
    console.log(data);
    setMembers(data);
  })

      .catch(console.error);
  }, [projectId]);

  const visibleTasks = selectedUserId
    ? tasks.filter(t => t.assignedUserId === selectedUserId)
    : tasks;

  const handleMoveTask = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      const updated = await moveTaskStatus(taskId, { status: newStatus });
      setTasks(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );
    } catch {
      fetchTasksByProject(projectId).then(setTasks);
    }
  };

  const handleEditTask = task => {
    setEditingTask(task);
    setOpenCreateTask(true);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <BoardHeader
        projectName={projectName}
        members={members}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ px: 2, mb: 2 }}>
        

        {auth.role === "MANAGER" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTask(null);
              setOpenCreateTask(true);
            }}
          >
            Create Task
          </Button>
        )}
      </Stack>

      {/* ✅ IMPORTANT FIX: bottom breathing space */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          pb: 6,           // 👈 THIS fixes the UX issue
          boxSizing: "border-box"
        }}
      >
        <KanbanBoard
          tasks={visibleTasks}
          onMove={handleMoveTask}
          onEdit={handleEditTask}
        />
      </Box>

      <CreateTask
        open={openCreateTask}
        projectId={projectId}
        members={members}
        task={editingTask}
        onClose={() => {
          setOpenCreateTask(false);
          setEditingTask(null);
        }}
        onCreated={updated =>
          setTasks(prev =>
            editingTask
              ? prev.map(t => (t.id === updated.id ? updated : t))
              : [...prev, updated]
          )
        }
      />
    </Box>
  );
}
