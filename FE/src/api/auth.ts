import { AxiosError } from "axios";
import apiClient from "./client";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("auth/login", { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error logging in:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
  country: string
) => {
  try {
    const response = await apiClient.post("auth/register", {
      email,
      password,
      name,
      country,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      console.error("Error registering:", errorMessage);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post("auth/logout");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const response = await apiClient.get("auth/verify-token", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error verifying token:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
