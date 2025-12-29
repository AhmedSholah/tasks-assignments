import type { CreateTaskData, UpdateTaskStatus } from "../types/task";
import api from "./api";

export const getTasks = (page: number = 1, limit: number = 9) => {
  return api.get("/tasks", {
    params: { page, limit },
  });
};

export const createTask = (data: CreateTaskData) => {
  return api.post("/tasks", data);
};

export const updateTask = (id: string, data: UpdateTaskStatus) => {
  return api.put(`/tasks/${id}`, data);
};

export const deleteTask = (id: string) => {
  return api.delete(`/tasks/${id}`);
};
