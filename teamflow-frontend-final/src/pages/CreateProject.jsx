import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";
import { fetchUsers } from "../api/userApi";
import { useAuth } from "../auth/useAuth";

export default function CreateProject() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load managers (ADMIN only)
  useEffect(() => {
    if (auth.role === "ADMIN") {
      fetchUsers(0, 100).then((res) => {
        setManagers(res.content.filter((u) => u.role === "MANAGER"));
      });
    }
  }, [auth.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { name };

    if (auth.role === "ADMIN") {
      payload.managerId = managerId;
    }

    try {
      await createProject(payload);
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
      <Paper sx={{ width: 500, p: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Create Project
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {auth.role === "ADMIN" && (
            <TextField
              select
              label="Assign Project Manager"
              fullWidth
              required
              margin="normal"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            >
              {managers.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <Button onClick={() => navigate("/projects")}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              Create Project
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
