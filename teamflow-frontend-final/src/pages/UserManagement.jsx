import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../api/userApi";

const PAGE_SIZE = 8;

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  // ===============================
  // LOAD USERS (LAZY LOADING)
  // ===============================
  const loadUsers = async (reset = false) => {
    if (loading) return;
    if (!hasMore && !reset) return;

    setLoading(true);
    const currentPage = reset ? 0 : page;

    try {
      const data = await fetchUsers(currentPage, PAGE_SIZE);
      const content = Array.isArray(data.content) ? data.content : [];

      setUsers((prev) =>
        reset ? content : [...prev, ...content]
      );

      setHasMore(!data.last);
      setPage(currentPage + 1);
    } catch (err) {
      console.error("Failed to load users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(true);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      loadUsers();
    }
  };

  return (
    <Box>
      {/* ================= HEADER ================= */}
      <Typography variant="h4" fontWeight={700} color="white" mb={3}>
        User Management
      </Typography>

      {/* ================= ACTION BUTTONS ================= */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #4FC3F7, #29B6F6)",
            color: "#0B0F14",
            fontWeight: 700,
            px: 2.5,
            py: 0.8,
            borderRadius: 999,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #81D4FA, #4FC3F7)",
            },
          }}
          onClick={() => navigate("/users/create")}
        >
          Add New User
        </Button>

        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #FFB74D, #FFA726)",
            color: "#0B0F14",
            fontWeight: 700,
            px: 2.5,
            py: 0.8,
            borderRadius: 999,
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #FFD180, #FFB74D)",
            },
          }}
          onClick={() => {
            setUsers([]);
            setPage(0);
            setHasMore(true);
            loadUsers(true);
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* ================= TABLE ================= */}
      <Paper
        sx={{
          borderRadius: 3,
          p: 2,
          backgroundColor: "#121417",
          boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* -------- Header Row -------- */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "60px 2fr 3fr 2fr 1fr",
            fontWeight: 700,
            px: 2,
            py: 1.5,
            color: "#64B5F6",
            fontSize: 16,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span>Sr. No</span>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </Box>

        {/* -------- Scrollable Body -------- */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            maxHeight: 8 * 64,
            overflowY: "auto",
          }}
        >
          {users.map((u, index) => (
            <Box
              key={u.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 3fr 2fr 1fr",
                px: 2,
                py: 1.5,
                borderBottom: "1px dashed rgba(255,255,255,0.15)",
                fontSize: 15,
                color: "white",
              }}
            >
              <span style={{ color: "#80CBC4" }}>
                {index + 1}
              </span>

              <span style={{ color: "#A5D6A7", fontWeight: 600 }}>
                {u.name}
              </span>

              <span style={{ color: "#B0BEC5" }}>
                {u.email}
              </span>

              <span
                style={{
                  color:
                    u.role === "ADMIN"
                      ? "#CE93D8"
                      : u.role === "MANAGER"
                      ? "#4FC3F7"
                      : "#81C784",
                }}
              >
                {u.role}
              </span>

              <Box sx={{ textAlign: "right" }}>
                {/* EDIT */}
                <IconButton
                  onClick={() => navigate(`/users/${u.id}/edit`)}
                  sx={{ color: "#FFB74D" }}
                >
                  <EditOutlinedIcon />
                </IconButton>

                {/* DELETE (future-safe) */}
                {/* {u.role === "MANAGER" && (
                  <IconButton
                    sx={{ color: "#EF5350" }}
                    onClick={() => navigate(`/users/${u.id}/delete`)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )} */}
              </Box>
            </Box>
          ))}

          {/* -------- Loader -------- */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={28} sx={{ color: "#4FC3F7" }} />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
