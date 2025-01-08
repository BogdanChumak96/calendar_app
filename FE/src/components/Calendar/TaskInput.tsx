import React, { FC, useState, useEffect, ChangeEvent } from "react";
import { useTaskStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/calendar";
import { useSnackbarStore } from "@/store";

const TaskInput: FC<{ day: string }> = ({ day }) => {
  const [taskName, setTaskName] = useState("");
  const { setTaskCreation, taskCreation: taskState } = useTaskStore();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();

  const { mutate: createTaskMutate } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showSnackbar("Task created successfully", "success");
      setTaskCreation(null, false);
      setTaskName("");
    },
    onError: (error: Error) => {
      console.error("Error creating task:", error);
      showSnackbar("Error creating task", "error");
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleCreateTask = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && taskName.trim()) {
      await createTaskMutate({
        title: taskName,
        description: "",
        dueDate: day,
      });
    }
  };

  const handleEscape = () => {
    setTaskCreation(null, false);
    setTaskName("");
  };

  useEffect(() => {
    if (taskState.isCreating && taskState.day === day) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleEscape();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [taskState.isCreating, taskState.day, day, handleEscape]);

  return (
    <div>
      {taskState.isCreating && taskState.day === day && (
        <input
          type='text'
          value={taskName}
          onChange={handleInputChange}
          onKeyDown={handleCreateTask}
          autoFocus
          placeholder='Enter task'
          className='mb-2 rounded-md border bg-primary/40 text-dark-text pl-1'
        />
      )}
    </div>
  );
};

export default TaskInput;
