import { FC, useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import {
  Delete as DeleteIcon,
  Check as CheckIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "@/api/calendar";
import { useSnackbarStore } from "@/store";
import { Task } from "@/common/types";

interface TaskItemProps {
  title: string;
  taskId: string;
  className?: string;
  isHoliday?: boolean;
  completed?: boolean;
}

export const TaskItem: FC<TaskItemProps> = ({
  title,
  taskId,
  className,
  isHoliday,
  completed,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const { mutate: updateTaskMutate } = useMutation({
    mutationFn: (taskData: { taskId: string; taskUpdates: Partial<Task> }) =>
      updateTask(taskData.taskId, taskData.taskUpdates),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSnackbar("Task updated successfully", "success");
    },

    onError: (error: Error) => {
      console.error("Error updating task:", error);
      showSnackbar("Error updating task", "error");
      setLocalTitle(title);
    },
  });

  const { mutate: deleteTaskMutate } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSnackbar("Successfully deleted task", "success");
    },
    onError: (error: Error) => {
      console.error("Error deleting task:", error);
      showSnackbar("Error deleting task", "error");
    },
  });

  const { mutate: markTaskAsCompletedMutate } = useMutation({
    mutationFn: (taskData: { taskId: string; taskUpdates: Partial<Task> }) =>
      updateTask(taskData.taskId, taskData.taskUpdates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSnackbar("Task marked as completed", "success");
    },
    onError: (error: Error) => {
      console.error("Error marking task as completed:", error);
      showSnackbar("Error marking task as completed", "error");
    },
  });

  const handleDoubleClick = () => {
    if (!isHoliday) setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
  };

  const handleBlur = () => {
    if (localTitle.trim() !== title && !isHoliday) {
      updateTaskMutate({ taskId, taskUpdates: { title: localTitle } });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && localTitle.trim() !== title && !isHoliday) {
      updateTaskMutate({ taskId, taskUpdates: { title: localTitle } });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (!isHoliday) deleteTaskMutate(taskId);
  };

  const handleMarkAsCompleted = () => {
    if (!isHoliday) {
      const updatedTask = { completed: !completed };
      markTaskAsCompletedMutate({ taskId, taskUpdates: updatedTask });
    }
  };

  return (
    <div
      className={`bg-primary/10 rounded-md px-2 mb-1 shadow-lg text-sm text-white dark:text-primary flex justify-between items-center hover:bg-primary/60 transition-all ${className}`}
      style={{
        minHeight: "30px",
        cursor: isHoliday ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => !isHoliday && setIsHovered(true)}
      onMouseLeave={() => !isHoliday && setIsHovered(false)}
    >
      {isEditing && !isHoliday ? (
        <input
          type='text'
          value={localTitle}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className='bg-primary/20 text-white rounded-md w-full border border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary'
        />
      ) : (
        <span
          className='truncate'
          title={localTitle}
          onDoubleClick={handleDoubleClick}
        >
          {localTitle}
        </span>
      )}

      {!isHoliday && (
        <div
          className='flex items-center gap-2'
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          <IconButton
            size='small'
            color='default'
            onClick={handleDoubleClick}
            sx={{
              color: "#fff",
              backgroundColor: "var(--bg-primary)",
              "&:hover": { backgroundColor: "var(--bg-secondary)" },
            }}
          >
            <EditIcon sx={{ fontSize: "0.7rem" }} />
          </IconButton>

          <IconButton
            size='small'
            color='default'
            onClick={handleMarkAsCompleted}
            sx={{
              color: "#fff",
              backgroundColor: "green",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            <CheckIcon sx={{ fontSize: "0.7rem" }} />
          </IconButton>

          <IconButton
            size='small'
            color='default'
            onClick={handleDelete}
            sx={{
              color: "#fff",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            <DeleteIcon sx={{ fontSize: "0.7rem" }} />
          </IconButton>
        </div>
      )}
    </div>
  );
};
