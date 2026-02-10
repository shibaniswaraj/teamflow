import { Box, Typography } from "@mui/material";
import { DASHBOARD_COLORS as C } from "../../theme/dashboardTheme";

const STATUSES = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];

export default function TaskStatusGrid({ statusMap }) {
  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      {STATUSES.map(s => (
        <Box key={s}>
          <Typography fontSize={12} color={C.textMuted}>
            {s.replace("_", " ")}
          </Typography>
          <Typography color={C.textMain} fontWeight={700}>
            {statusMap[s] || 0}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
