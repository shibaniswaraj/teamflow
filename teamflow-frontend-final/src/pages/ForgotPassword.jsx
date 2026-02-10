import { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await forgotPassword(email);
      setMessage("Password reset link sent to your email");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ width: 420, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Forgot Password
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your email to receive a reset link.
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="success.main">{message}</Typography>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Send Reset Link
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}