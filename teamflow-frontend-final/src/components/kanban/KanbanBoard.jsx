import { Box } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { TASK_STATUS } from "../../constants/taskStatus";
import { useAuth } from "../../auth/useAuth";

export default function KanbanBoard({ tasks, onMove, onEdit }) {
  const { auth } = useAuth();

  const handleDragEnd = (result) => {
    // ❌ ADMIN cannot drag | ✅ MANAGER & MEMBER can
    if (auth.role === "ADMIN") return;

    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onMove(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {TASK_STATUS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onEdit={onEdit}
          />
        ))}
      </Box>
    </DragDropContext>
  );
}
