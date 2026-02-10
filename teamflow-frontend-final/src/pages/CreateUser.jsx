import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userApi";

export default function CreateUser() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUser({
        name,
        email,
        role,
      });

      // ✅ Go back to user list after success
      navigate("/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 10,
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
          Create New User
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          A temporary password will be automatically generated
          and emailed to the user.
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="MEMBER">Member</MenuItem>
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
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
