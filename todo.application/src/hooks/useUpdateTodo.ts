"use client";

import { API_ENDPOINTS } from "@/services/apiService";

export function useUpdateTodo() {
  async function completeTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.PUT_Todo}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete todo");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to complete todo");
    }
  }

  return { completeTodo };
}
