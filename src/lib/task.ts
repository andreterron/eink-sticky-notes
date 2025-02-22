export type TaskStatus = "active" | "ready" | "waiting" | "backlog" | "done";

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: number;
}
