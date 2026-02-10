import { Avatar, Tooltip } from "@mui/material";

// HSL-based infinite color generator (no fixed palette)
function getColorFromEmail(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

export default function AvatarCircle({ name, email, size = 32 }) {
  const displayLabel =
    (name && name.trim()) ||
    (email && email.trim()) ||
    "?";

  const initial = displayLabel.charAt(0).toUpperCase();

  // 🔑 COLOR MUST COME FROM EMAIL (STABLE)
  const colorSeed = email || displayLabel;
  const bgColor = getColorFromEmail(colorSeed);

  return (
    <Tooltip title={displayLabel}>
      <Avatar
        sx={{
          bgcolor: bgColor,
          width: size,
          height: size,
          fontSize: size * 0.45,
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        {initial}
      </Avatar>
    </Tooltip>
  );
}
