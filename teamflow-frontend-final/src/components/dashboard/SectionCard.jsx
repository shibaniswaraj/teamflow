import { Paper } from "@mui/material";
import { DASHBOARD_COLORS as C } from "../../theme/dashboardTheme";

export default function SectionCard({ children }) {
  return (
    <Paper
      sx={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        p: 3,
        mb: 4,
      }}
    >
      {children}
    </Paper>
  );
}
