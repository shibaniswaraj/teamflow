import { Box, Button, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../auth/useAuth";

import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/authApi";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      login(data.role);

      if (data.firstLogin) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      {/* LEFT */}
      <Box
        sx={{
          width: "40%",
          backgroundColor: "#010101",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <img src={logo} alt="TeamFlow" style={{ width: 480 }} />
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          Collaborate. Track. Deliver.
        </Typography>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          width: "60%",
          backgroundColor: "#442294",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            padding: 4,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={1}>
            Welcome back
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your TeamFlow account
          </Typography>

          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* 🔑 FORGOT PASSWORD */}
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 14,
                  color: "#5E35B1",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}