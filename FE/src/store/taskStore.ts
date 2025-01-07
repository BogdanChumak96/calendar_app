import { Task } from "@/common/types";
import { create } from "zustand";

interface TaskStore {
  taskMap: Map<string, Task>;
  setTaskMap: (taskMap: Map<string, Task>) => void;
  updateTask: (updatedTask: Task) => void;
  createTask: (newTask: Task) => void;
  deleteTask: (taskId: string) => void;
  setTaskCreation: (day: string | null, isCreating: boolean) => void;
  taskCreation: { day: string | null; isCreating: boolean };
}

export const useTaskStore = create<TaskStore>((set) => ({
  taskMap: new Map(),
  setTaskMap: (taskMap) => set({ taskMap }),
  updateTask: (updatedTask) =>
    set((state) => {
      const newMap = new Map(state.taskMap);
      newMap.set(updatedTask._id, updatedTask);
      return { taskMap: newMap };
    }),
  createTask: (newTask) =>
    set((state) => {
      const newMap = new Map(state.taskMap);
      newMap.set(newTask._id, newTask);
      return { taskMap: newMap };
    }),
  deleteTask: (taskId) =>
    set((state) => {
      const newMap = new Map(state.taskMap);
      newMap.delete(taskId);
      return { taskMap: newMap };
    }),
  setTaskCreation: (day, isCreating) => {
    set({ taskCreation: { day, isCreating } });
  },
  taskCreation: { day: null, isCreating: false },
}));
