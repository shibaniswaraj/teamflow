import { Box, Typography } from "@mui/material";
import { DASHBOARD_COLORS as C } from "../../theme/dashboardTheme";

export default function ProjectTable({ projects }) {
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", mb: 1 }}>
        <Typography color={C.textMuted}>Project</Typography>
        <Typography color={C.textMuted}>Active Tasks</Typography>
        <Typography color={C.textMuted}>Users</Typography>
      </Box>

      {projects.map(p => (
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
          <Typography color={C.orange}>{p.activeTasks}</Typography>
          <Typography color={C.blue}>{p.totalUsers}</Typography>
        </Box>
      ))}
    </Box>
  );
}
