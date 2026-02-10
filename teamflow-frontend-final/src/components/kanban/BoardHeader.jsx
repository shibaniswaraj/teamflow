import { Box, Stack, Typography } from "@mui/material";
import AvatarCircle from "../AvatarCircle";

export default function BoardHeader({
  projectName,
  members,
  selectedUserId,
  onSelectUser,
  rightAction // 👈 for Create button
}) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {/* LEFT: Project name + avatars */}
      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "#fff", mb: 1 }}
        >
          {projectName || "Project"}
        </Typography>

        {members.length > 0 && (
          <Stack direction="row" spacing={-0.5}>
            {members.map(m => (
              <Box
                key={m.id}
                onClick={() =>
                  onSelectUser(
                    selectedUserId === m.id ? null : m.id
                  )
                }
                sx={{
                  cursor: "pointer",
                  opacity:
                    selectedUserId && selectedUserId !== m.id
                      ? 0.4
                      : 1
                }}
              >
                <AvatarCircle
                  name={m.name}
                  email={m.email}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* RIGHT: Action button slot */}
      {rightAction}
    </Box>
  );
}
