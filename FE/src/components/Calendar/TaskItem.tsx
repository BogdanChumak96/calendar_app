import { FC, useState } from "react";
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
  const [newTitle, setNewTitle] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const queryClient = useQueryClient();

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

  const { mutate: updateTaskMutate } = useMutation({
    mutationFn: (taskData: { taskId: string; taskUpdates: Partial<Task> }) =>
      updateTask(taskData.taskId, taskData.taskUpdates),
    onMutate: (variables) => {
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return [];
        return oldTasks.map((task) =>
          task._id === taskId
            ? { ...task, title: variables.taskUpdates.title }
            : task
        );
      });
      return variables;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSnackbar("Task updated successfully", "success");
    },
    onError: (error: Error) => {
      console.error("Error updating task:", error);
      showSnackbar("Error updating task", "error");
    },
  });

  const { mutate: markTaskAsCompletedMutate } = useMutation({
    mutationFn: (taskData: { taskId: string; taskUpdates: Partial<Task> }) =>
      updateTask(taskData.taskId, taskData.taskUpdates),
    onMutate: (variables) => {
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return [];
        return oldTasks.map((task) =>
          task._id === taskId
            ? { ...task, completed: variables.taskUpdates.completed }
            : task
        );
      });
      return variables;
    },
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
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleBlur = () => {
    if (newTitle.trim() !== title) {
      updateTaskMutate({ taskId, taskUpdates: { title: newTitle } });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (newTitle.trim() && newTitle.trim() !== title) {
        updateTaskMutate({ taskId, taskUpdates: { title: newTitle } });
      }
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteTaskMutate(taskId);
  };

  const handleMarkAsCompleted = () => {
    const updatedTask = { completed: !completed };
    markTaskAsCompletedMutate({ taskId, taskUpdates: updatedTask });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      className={`bg-primary/40 rounded-md p-1 mb-1 shadow text-xs text-white dark:text-primary-foreground flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative" }}
    >
      {isEditing ? (
        <input
          type='text'
          value={newTitle}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span onDoubleClick={handleDoubleClick}>{title}</span>
      )}

      {!isEditing && !isHoliday && isHovered && (
        <div style={{ display: "flex", alignItems: "center", width: "120px" }}>
          <IconButton
            size='small'
            color='default'
            onClick={handleEditClick}
            sx={{
              position: "absolute",
              right: 60,
              fontSize: "0.75rem",
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            size='small'
            color='default'
            onClick={handleMarkAsCompleted}
            sx={{
              position: "absolute",
              right: 30,
              fontSize: "0.75rem",
            }}
          >
            <CheckIcon />
          </IconButton>

          <IconButton
            size='small'
            color='default'
            onClick={handleDelete}
            sx={{
              position: "absolute",
              right: 1,
              fontSize: "0.75rem",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};
