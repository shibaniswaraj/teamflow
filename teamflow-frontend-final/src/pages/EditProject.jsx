import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { fetchProjectById, updateProject } from "../api/projectApi";
import { fetchMembers, fetchUsers } from "../api/userApi";
import { useAuth } from "../auth/useAuth";

export default function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");

  const [managers, setManagers] = useState([]);   // ADMIN
  const [members, setMembers] = useState([]);     // MANAGER
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const project = await fetchProjectById(projectId);

        setName(project.name || "");
        setManagerId(project.managerId || "");
        setSelectedMembers(project.memberIds || []);

        // 👑 ADMIN → load managers
        if (auth.role === "ADMIN") {
          const res = await fetchUsers(0, 100);
          setManagers(res.content.filter(u => u.role === "MANAGER"));
        }

        // 🧑‍💼 MANAGER → load members
        if (auth.role === "MANAGER") {
          const memberList = await fetchMembers();
          setMembers(memberList);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId, auth.role]);

  // ===============================
  // VALIDATION
  // ===============================
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Project name is required";
    } else if (/^\d/.test(name)) {
      newErrors.name = "Project name must not start with a number";
    }

    if (auth.role === "ADMIN" && !managerId) {
      newErrors.managerId = "Project manager is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = { name };

      if (auth.role === "ADMIN") {
        payload.managerId = managerId;
      }

      if (auth.role === "MANAGER") {
        payload.memberIds = selectedMembers;
      }

      await updateProject(projectId, payload);
      navigate("/projects");
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ width: 520, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Edit Project
        </Typography>

        {/* Project Name */}
        <TextField
          label="Project Name"
          fullWidth
          required
          value={name}
          error={!!errors.name}
          helperText={errors.name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* 👑 ADMIN → Manager dropdown (NAME ONLY) */}
        {auth.role === "ADMIN" && (
          <>
            <Typography variant="subtitle2" mb={1}>
              Project Manager
            </Typography>

            <Select
              fullWidth
              value={managerId}
              error={!!errors.managerId}
              onChange={(e) => setManagerId(e.target.value)}
              sx={{ mb: 1 }}
            >
              {managers.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>

            {errors.managerId && (
              <Typography color="error" variant="caption">
                {errors.managerId}
              </Typography>
            )}
          </>
        )}

        {/* 🧑‍💼 MANAGER → Members multi-select */}
        {auth.role === "MANAGER" && (
          <>
            <Typography variant="subtitle2" mb={1}>
              Project Members
            </Typography>

            <Select
              multiple
              fullWidth
              value={selectedMembers}
              onChange={(e) => setSelectedMembers(e.target.value)}
              renderValue={(selected) =>
                members
                  .filter((m) => selected.includes(m.id))
                  .map((m) => m.name)
                  .join(", ")
              }
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  <Checkbox checked={selectedMembers.includes(member.id)} />
                  <ListItemText primary={member.name} />
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button onClick={() => navigate("/projects")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
