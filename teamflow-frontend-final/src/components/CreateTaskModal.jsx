import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { createTask, updateTask } from "../api/taskApi";
import { TASK_STATUS, STATUS_LABELS } from "../constants/taskStatus";
import { useAuth } from "../auth/useAuth";

export default function CreateTaskModal({
  open,
  onClose,
  projectId,
  members,
  onCreated,
  task
}) {
  const { auth } = useAuth();

  const isEdit = Boolean(task);
  const isReadOnly = auth.role === "ADMIN" || auth.role === "MEMBER";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [status, setStatus] = useState("TODO");
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setAssignedUserId(task.assignedUserId || "");
      setStatus(task.status || "TODO");
    } else {
      setTitle("");
      setDescription("");
      setAssignedUserId("");
      setStatus("TODO");
    }
    setTitleError(false);
  }, [task, open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const payload = {
      title,
      description,
      assignedUserId,
      status
    };

    const result = isEdit
      ? await updateTask(task.id, payload)
      : await createTask({ ...payload, projectId });

    onCreated(result);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {isReadOnly ? "View Task" : isEdit ? "Edit Task" : "Create Task"}
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          required
          margin="normal"
          value={title}
          disabled={isReadOnly}
          error={titleError}
          helperText={titleError ? "Title is required" : ""}
          onChange={e => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          disabled={isReadOnly}
          onChange={e => setDescription(e.target.value)}
        />

        <TextField
          select
          label="Assign to"
          fullWidth
          margin="normal"
          value={assignedUserId}
          disabled={isReadOnly}
          onChange={e => setAssignedUserId(e.target.value)}
        >
          {members.map(m => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          value={status}
          disabled={isReadOnly}
          onChange={e => setStatus(e.target.value)}
        >
          {TASK_STATUS.map(s => (
            <MenuItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>

        {!isReadOnly && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {isEdit ? "Save Changes" : "Create"}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
