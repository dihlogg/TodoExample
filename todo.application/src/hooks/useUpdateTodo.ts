"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import { Todo } from "@/types/todo.type";

export function useUpdateTodo() {
  async function updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(`${API_ENDPOINTS.PUT_Todo}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update todo");
      }

      // Nếu BE trả về todo updated
      const data: Todo = await response.json();
      return data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to update todo");
    }
  }

  return { updateTodo };
}
