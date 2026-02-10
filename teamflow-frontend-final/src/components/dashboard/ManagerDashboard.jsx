import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchManagerDashboard } from "../../api/dashboardApi";
import SectionCard from "./SectionCard";
import { DASHBOARD_COLORS as C } from "../../theme/dashboardTheme";

const STATUSES = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];

export default function ManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchManagerDashboard().then(setData);
  }, []);

  if (!data) return null;

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 64px)",
        overflowY: "auto",
        pr: 1,
      }}
    >
      <Typography fontSize={26} fontWeight={900} color={C.textMain} mb={3}>
        Manager Overview
      </Typography>

      {/* ================= PROJECTS YOU MANAGE ================= */}
      <SectionCard>
        <Typography fontWeight={700} color={C.textMain} mb={2}>
          Projects You Manage
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", mb: 1 }}>
          <Typography color={C.textMuted}>Project</Typography>
          <Typography color={C.textMuted}>Members</Typography>
          <Typography color={C.textMuted}>Active Tasks</Typography>
        </Box>

        {data.projects.map(p => {
          const activeTasks =
            Object.entries(p.taskStatusCounts)
              .filter(([k]) => k !== "DONE")
              .reduce((sum, [, v]) => sum + v, 0);

          return (
            <Box
              key={p.projectId}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                py: 1,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <Typography color={C.green}>{p.projectName}</Typography>
              <Typography color={C.blue}>{p.membersCount}</Typography>
              <Typography color={C.orange}>{activeTasks}</Typography>
            </Box>
          );
        })}
      </SectionCard>

      {/* ================= TASK STATUS BY PROJECT ================= */}
      <SectionCard>
        <Typography fontWeight={700} color={C.textMain} mb={2}>
          Task Status by Project
        </Typography>

        {data.projects.map(p => (
          <Box key={p.projectId} sx={{ mb: 3 }}>
            <Typography color={C.green} mb={1}>
              {p.projectName}
            </Typography>

            <Box sx={{ display: "flex", gap: 4 }}>
              {STATUSES.map(s => (
                <Box key={s}>
                  <Typography fontSize={12} color={C.textMuted}>
                    {s.replace("_", " ")}
                  </Typography>
                  <Typography fontWeight={700} color={C.textMain}>
                    {p.taskStatusCounts[s] || 0}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </SectionCard>
    </Box>
  );
}
