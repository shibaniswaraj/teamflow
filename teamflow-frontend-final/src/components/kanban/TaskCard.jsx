import { Paper, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Draggable } from "@hello-pangea/dnd";
import AvatarCircle from "../AvatarCircle";
import { useAuth } from "../../auth/useAuth";

export default function TaskCard({ task, index, onEdit }) {
  const { auth } = useAuth();

  const canDrag = auth.role === "MANAGER" || auth.role === "MEMBER";
  const canEdit = auth.role === "MANAGER";

  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={!canDrag}   // ✅ THIS WAS MISSING
    >
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...(canDrag ? provided.dragHandleProps : {})}
          sx={{
            p: 1.5,
            mb: 1.5,
            borderRadius: 2,
            background: "#2A2B2E",
            minHeight: 110,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            cursor: canDrag ? "grab" : "default",
            opacity: canDrag ? 1 : 0.9
          }}
        >
          {/* ICON */}
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            sx={{ position: "absolute", top: 4, right: 4 }}
          >
            {canEdit ? (
              <EditIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" sx={{ color: "#4CAF50" }} />
            )}
          </IconButton>

          <Typography fontSize={14} fontWeight={600} color="white">
            {task.title}
          </Typography>

          {task.description && (
            <Typography
              fontSize={12}
              color="#B0BEC5"
              sx={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}
            >
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {task.assignedUserEmail && (
              <AvatarCircle
                name={task.assignedUserName}
                email={task.assignedUserEmail}
                size={28}
              />
            )}
          </Box>
        </Paper>
      )}
    </Draggable>
  );
}
