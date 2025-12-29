export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskStatus {
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}
