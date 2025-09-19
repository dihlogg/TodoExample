import { Todo } from "./todo.type";

export interface Notification {
  type: "success" | "info" | "warning" | "error";
  message: string;
  timestamp: Date;
  todo?: Todo;
}
