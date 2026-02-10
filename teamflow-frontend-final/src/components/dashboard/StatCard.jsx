import { Paper, Typography } from "@mui/material";
import { DASHBOARD_COLORS as C } from "../../theme/dashboardTheme";

export default function StatCard({ title, value, color }) {
  return (
    <Paper
      sx={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        p: 3,
        minWidth: 200,
      }}
    >
      <Typography fontSize={13} color={C.textMuted}>
        {title}
      </Typography>
      <Typography fontSize={28} fontWeight={900} color={color}>
        {value}
      </Typography>
    </Paper>
  );
}
