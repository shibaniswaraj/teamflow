import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { getUserById, updateUser } from "../api/userApi";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [roleOptions, setRoleOptions] = useState([]);

  // ===============================
  // LOAD USER
  // ===============================
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getUserById(id);

        setForm({
          name: user.name,
          email: user.email,
          role: user.role,
        });

        if (user.role === "MANAGER") {
          setRoleOptions(["ADMIN", "MANAGER"]);
        } else {
          setRoleOptions(["ADMIN", "MANAGER", "MEMBER"]);
        }
      } catch (err) {
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  // ===============================
  // FORM HANDLER
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // SAVE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!form.name.trim()) {
      setError("Name cannot be empty");
      setSaving(false);
      return;
    }

    if (!form.email.trim()) {
      setError("Email cannot be empty");
      setSaving(false);
      return;
    }

    try {
      await updateUser(id, form);
      navigate("/users");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ===============================
  // FIXED LAYOUT
  // ===============================
  return (
    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 8,
      }}
    >
      <Paper
        sx={{
          width: 560,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          Edit User
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Update user details and role.
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            required
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            required
            margin="normal"
            value={form.role}
            onChange={handleChange}
          >
            {roleOptions.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/users")}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
