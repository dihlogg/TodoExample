export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted?: boolean;
  createdAt: Date;
  completedAt?: string;
}
