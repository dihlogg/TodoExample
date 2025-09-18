"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import { Todo } from "@/types/todo.type";

export function useCreateTodo() {
  async function createTodo(todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(API_ENDPOINTS.POST_Todo, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add todo");
      }

      const data: Todo = await response.json();
      return data;
    } catch (err: any) {
      throw new Error(err.message || "Failed to add todo");
    }
  }

  return { createTodo };
}
