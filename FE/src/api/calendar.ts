import { AxiosError } from "axios";
import apiClient from "./client";

export const getUserTasks = async () => {
  try {
    const response = await apiClient.get("tasks");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getTaskById = async (taskId: string) => {
  try {
    const response = await apiClient.get(`tasks/${taskId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching task by ID:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getTasksByDateRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    const response = await apiClient.get("tasks/filter", {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching tasks by date range:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const createTask = async (task: {
  title: string;
  description: string;
  dueDate: string;
  category?: string;
  tags?: string[];
}) => {
  try {
    const response = await apiClient.post("tasks", task);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  taskUpdates: Partial<{
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    category: string;
    tags: string[];
  }>
) => {
  try {
    const response = await apiClient.patch(`tasks/${taskId}`, taskUpdates);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error updating task:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await apiClient.delete(`tasks/${taskId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error deleting task:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getHolidays = async (year: string) => {
  try {
    const response = await apiClient.get("tasks/holidays", {
      params: { year },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching holidays:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const searchTasks = async (query: string) => {
  try {
    const response = await apiClient.get("tasks/search", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error searching tasks:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
