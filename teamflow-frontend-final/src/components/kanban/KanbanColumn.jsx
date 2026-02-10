import { Box, Typography } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { STATUS_LABELS } from "../../constants/taskStatus";

export default function KanbanColumn({ status, tasks, onEdit }) {
  const isEmpty = tasks.length === 0;

  return (
    <Droppable droppableId={status}>
      {provided => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            width: 270,
            background: "#1E1F21",
            borderRadius: 2,
            p: 1.5,

            // 👇 KEY CHANGE
            minHeight: isEmpty ? 140 : 320,

            transition: "min-height 0.25s ease", // smooth resize
          }}
        >
          <Typography
            fontSize={13}
            fontWeight={700}
            color="#B0BEC5"
            mb={isEmpty ? 0.5 : 1}
          >
            {STATUS_LABELS[status]} ({tasks.length})
          </Typography>

          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={onEdit}
            />
          ))}

          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}
