import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../api/dashboardApi";
import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import ProjectTable from "./ProjectTable";
import { DASHBOARD_COLORS as C } from "../../theme/dashboardTheme";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAdminDashboard().then(setData);
  }, []);

  if (!data) return null;

  return (
    <Box>
      <Typography fontSize={26} fontWeight={900} color={C.textMain} mb={3}>
        Admin Overview
      </Typography>

      {/* SUMMARY */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <StatCard title="Total Projects" value={data.totalProjects} color={C.green} />
        <StatCard title="Total Users" value={data.totalUsers} color={C.blue} />
        <StatCard title="Managers" value={data.totalManagers} color={C.orange} />
        <StatCard title="Members" value={data.totalMembers} color={C.textMain} />
      </Box>

      {/* QUICK METRICS */}
      <SectionCard>
        <Typography fontWeight={700} color={C.textMain} mb={2}>
          Quick Metrics
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <StatCard title="Total Tasks" value={data.quickMetrics.totalTasks} color={C.blue} />
          <StatCard title="Completed Tasks" value={data.quickMetrics.completedTasks} color={C.green} />
          <StatCard title="Total Projects" value={data.quickMetrics.totalProjects} color={C.orange} />
        </Box>
      </SectionCard>

      {/* TOP PROJECTS */}
      <SectionCard>
        <Typography fontWeight={700} color={C.textMain} mb={2}>
          Top Projects (by Activity)
        </Typography>

        <ProjectTable projects={data.topProjects} />
      </SectionCard>
    </Box>
  );
}
