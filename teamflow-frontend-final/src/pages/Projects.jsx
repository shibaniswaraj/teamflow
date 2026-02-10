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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { fetchProjects } from "../api/projectApi";

const PAGE_SIZE = 8;

export default function Projects() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  // ===============================
  // 🔹 LOAD PROJECTS (LAZY LOADING)
  // ===============================
  const loadProjects = async (reset = false) => {
    if (loading) return;
    if (!hasMore && !reset) return;

    setLoading(true);
    const currentPage = reset ? 0 : page;

    try {
      const data = await fetchProjects(currentPage, PAGE_SIZE);
      const content = Array.isArray(data.content) ? data.content : [];

      setProjects((prev) =>
        reset ? content : [...prev, ...content]
      );

      setHasMore(!data.last);
      setPage(currentPage + 1);
    } catch (err) {
      console.error("Failed to load projects:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(true);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      loadProjects();
    }
  };

  return (
    <Box>
      {/* ================= HEADER ================= */}
      <Typography variant="h4" fontWeight={700} color="white" mb={3}>
        Projects
      </Typography>

      {/* ================= CREATE BUTTON ================= */}
      {(auth.role === "ADMIN" || auth.role === "MANAGER") && (
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #4FC3F7, #29B6F6)",
            color: "#0B0F14",
            fontWeight: 700,
            px: 2.5,          // 👈 controls width (shorter)
            py: 0.8,
            mb: 2,
            borderRadius: 999, // 👈 pill-shaped
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #81D4FA, #4FC3F7)",
            },
          }}
          onClick={() => navigate("/projects/create")}
        >
          Create New Project
        </Button>

      )}

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
            gridTemplateColumns:
              auth.role === "ADMIN"
                ? "60px 3fr 3fr 2fr 1fr"
                : "60px 4fr 2fr 1fr",
            fontWeight: 700,
            px: 2,
            py: 1.5,
            color: "#64B5F6",
            fontSize: 16,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span>Sr. No</span>
          <span>Project Name</span>
          {auth.role === "ADMIN" && <span>Manager</span>}
          <span>Members</span>
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
          {projects.map((p, index) => (
            <Box
              key={p.id}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  auth.role === "ADMIN"
                    ? "60px 3fr 3fr 2fr 1fr"
                    : "60px 4fr 2fr 1fr",
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
                {p.name}
              </span>

              {auth.role === "ADMIN" && (
                <span style={{ color: "#B39DDB" }}>
                  {p.managerName}
                </span>
              )}

              <span style={{ color: "#4FC3F7" }}>
                {p.memberCount}
              </span>

              <Box sx={{ textAlign: "right" }}>
                {/* OPEN */}
                <IconButton
                  onClick={() => navigate(`/projects/${p.id}`)}
                  sx={{ color: "#4FC3F7" }}
                >
                  <OpenInNewIcon />
                </IconButton>

                {/* EDIT */}
                {(auth.role === "ADMIN" || auth.role === "MANAGER") && (
                  <IconButton
                    onClick={() => navigate(`/projects/${p.id}/edit`)}
                    sx={{ color: "#FFB74D" }}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                )}
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
