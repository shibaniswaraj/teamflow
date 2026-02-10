// src/components/Sidebar.jsx
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { logout } from "../api/authApi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: useAuth ONLY ONCE
  const { auth, logout: clearAuth } = useAuth();
  const role = auth.role;
  console.log("role123", role);
  const iconStyle = (path) => ({
    width: 48,
    height: 48,
    color:
      location.pathname === path
        ? "#8f8cff"
        : "rgba(255,255,255,0.7)",
    backgroundColor:
      location.pathname === path
        ? "rgba(143,140,255,0.15)"
        : "transparent",
    mb: 1,
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  });

  // ✅ FIX: safe & atomic logout
  const handleLogout = async () => {
    try {
      console.log("123");
      await logout(); // backend logout
    } catch (err) {
      console.warn("Backend logout failed, clearing local auth anyway",err);
    } finally {
      clearAuth(); // frontend logout
      navigate("/login", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        width: 80,
        py: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      {/* TOP ICONS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tooltip title="Dashboard" placement="right">
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={iconStyle("/dashboard")}
          >
            <DashboardIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Projects" placement="right">
          <IconButton
            onClick={() => navigate("/projects")}
            sx={iconStyle("/projects")}
          >
            <FolderIcon />
          </IconButton>
        </Tooltip>

        {/* ADMIN ONLY */}
        {role === "ADMIN" && (
          <Tooltip title="User Management" placement="right">
            <IconButton
              onClick={() => navigate("/users")}
              sx={iconStyle("/users")}
            >
              <GroupIcon />
            </IconButton>
          </Tooltip>
        )}

        <Divider
          sx={{
            my: 2,
            width: "40%",
            bgcolor: "rgba(255,255,255,0.2)",
          }}
        />

        <Tooltip title="Settings" placement="right">
          <IconButton
            onClick={() => navigate("/settings")}
            sx={iconStyle("/settings")}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* LOGOUT */}
      <Box>
        <Divider
          sx={{
            mb: 1,
            width: "40%",
            bgcolor: "rgba(255,255,255,0.2)",
            mx: "auto",
          }}
        />

        <Tooltip title="Logout" placement="right">
          <IconButton
            onClick={handleLogout}
            sx={{
              width: 48,
              height: 48,
              color: "#E57373",
              "&:hover": {
                backgroundColor: "rgba(229,115,115,0.15)",
              },
            }}
          >
            <LogoutOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
