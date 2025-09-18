"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import { Todo } from "@/types/todo.type";
import { useEffect, useState } from "react";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTodos() {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_TODOS);
        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (err: any) {
        setError(err.message || "Failed to load todo");
      } finally {
        setLoading(false);
      }
    }
    loadTodos();
  }, []);
  return { todos, error, loading };
}
