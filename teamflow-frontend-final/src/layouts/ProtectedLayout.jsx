// src/layouts/ProtectedLayout.jsx
import { Box, CircularProgress } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/useAuth";

export default function ProtectedLayout() {
  const { auth } = useAuth();

  // 🔄 Wait until auth state is resolved (/auth/me finished)
  if (auth.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1b1f3b 0%, #2b2f6c 50%, #1b1f3b 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 🔒 Not authenticated → kick to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → render protected UI
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #1b1f3b 0%, #2b2f6c 50%, #1b1f3b 100%)",
      }}
    >
      <Sidebar />

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
