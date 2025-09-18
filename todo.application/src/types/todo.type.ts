export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: string;
  isCompleted?: boolean;
  createdAt: string;
  completedAt?: string;
}
