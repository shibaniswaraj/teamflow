import { Box } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import MemberDashboard from "../components/dashboard/MemberDashboard";
import { DASHBOARD_COLORS as C } from "../theme/dashboardTheme";

export default function Dashboard() {
  const { auth } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: C.bg,
        p: 4,
      }}
    >
      {auth.role === "ADMIN" && <AdminDashboard />}
      {auth.role === "MANAGER" && <ManagerDashboard />}
      {auth.role === "MEMBER" && <MemberDashboard />}
    </Box>
  );
}
