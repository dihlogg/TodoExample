"use client";

import { useEffect, useState } from "react";
import { Button, message, notification, Select, Upload } from "antd";
import { Todo } from "@/types/todo.type";
import { useCreateTodo } from "@/hooks/useCreateTodo";
import { useTodos } from "@/hooks/useTodos";
import { useUpdateTodo } from "@/hooks/useUpdateTodo";
import { UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { socketService } from "@/services/socket";
import { Notification } from "@/types/notification.type";

const { Option } = Select;

interface CreateTodoForm {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
}

export default function HomePage() {
  const [api, contextHolder] = notification.useNotification();
  const {
    todos: initialTodos,
    error: todosError,
    loading: todosLoading,
  } = useTodos();
  const { createTodo } = useCreateTodo();
  const { updateTodo } = useUpdateTodo();

  // Local state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<string>("");
  const [createLoading, setCreateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [form, setForm] = useState<CreateTodoForm>({
    title: "",
    description: "",
    priority: "low",
    isCompleted: false,
  });

  // WebSocket setup
  useEffect(() => {
    const socket = socketService.connect();

    // Listen for todo created events
    socket.on("todo_created", (todo: Todo) => {
      console.log("New todo created:", todo);
      setTodos((prev) => [todo, ...prev]);

      // Show notification
      api.success({
        message: "Todo Created",
        description: `"${todo.title}" has been created successfully!`,
        placement: "topRight",
      });
    });

    // Listen for todo status changed events
    socket.on("todo_status_changed", (todo: Todo) => {
      console.log("Todo status changed:", todo);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));

      // Show notification
      api.info({
        message: "Todo Updated",
        description: `"${todo.title}" marked as ${todo.isCompleted}`,
        placement: "topRight",
      });
    });

    // Listen for general notifications
    socket.on("notification", (notification: Notification) => {
      console.log("Notification received:", notification);
      setNotifications((prev) => [
        { ...notification, timestamp: new Date(notification.timestamp) },
        ...prev.slice(0, 9), // Keep only latest 10 notifications
      ]);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [api]);

  // Handle create todo
  const handleCreateTodo = async () => {
    if (!form.title.trim()) {
      message.error("Please enter a title");
      return;
    }

    setCreateLoading(true);
    try {
      const newTodo = await createTodo({
        title: form.title,
        description: form.description,
        priority: form.priority,
        isCompleted: form.isCompleted,
      } as Todo);

      // Reset form
      setForm({
        title: "",
        description: "",
        priority: "low",
        isCompleted: false,
      });

      message.success("Todo created successfully!");
    } catch (error: any) {
      message.error(error.message || "Failed to create todo");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCompleteTodo = async () => {
    if (!selectedTodoId.trim()) {
      message.error("Please enter a todo ID");
      return;
    }

    setActionLoading(true);
    try {
      const todoToUpdate = todos.find((t) => t.id === selectedTodoId);

      if (!todoToUpdate) {
        message.error("Todo not found");
        return;
      }

      await updateTodo(selectedTodoId, {
        isCompleted: true,
      });

      // Cập nhật local state để UI đồng bộ ngay
      setTodos((prev) =>
        prev.map((t) =>
          t.id === selectedTodoId ? { ...t, isCompleted: true } : t
        )
      );

      message.success("Todo marked as completed!");
    } catch (err: any) {
      message.error(err.message || "Failed to complete todo");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (initialTodos) {
      console.log("Syncing initialTodos to todos:", initialTodos);
      setTodos(initialTodos);
    }
  }, [initialTodos]);
  // Handle refresh todos
  const handleRefresh = () => {
    window.location.reload(); // Simple refresh, or you can create a refresh function
  };

  // Get priority color
  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return "bg-gray-500";

    switch (priority.toLowerCase()) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center items-center min-h-screen bg-[#764ba2]">
        <div className="w-full max-w-6xl p-4 mt-2 space-y-6">
          <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
            <h2 className="w-full text-center pb-2 text-xl font-semibold text-gray-500 border-gray-400">
              Todo API - Real-time Client
            </h2>
            <h2 className="w-full text-center pb-2 text-xl font-semibold text-green-600 border-b border-gray-400">
              ✅ Connected to WebSocket ({todos.length} todos)
            </h2>

            <div className="flex flex-row gap-6 pt-1">
              {/* Left Column */}
              <div className="flex-col w-full px-8 gap-y-6 border-gray-200 rounded-lg sm:flex-row">
                {/* Create Todo Section */}
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
                      Create New Todo
                    </h2>

                    {/* Title */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="mb-1 text-sm text-gray-500">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter todo title"
                        className="w-full px-3 py-2 text-sm !text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="mb-1 text-sm text-gray-500">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter description (optional)"
                        className="w-full px-3 py-2 text-sm !text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400 resize-none"
                      />
                    </div>

                    {/* Priority */}
                    <div className="flex flex-col items-start mb-6">
                      <label className="mb-1 text-sm text-gray-500">
                        Priority
                      </label>
                      <Select
                        className="w-full"
                        value={form.priority}
                        onChange={(value) =>
                          setForm((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <Option value="low">Low</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="high">High</Option>
                      </Select>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleCreateTodo}
                      disabled={createLoading || !form.title.trim()}
                      className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {createLoading ? "CREATING..." : "CREATE TODO"}
                    </button>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
                      Quick Actions
                    </h2>

                    {/* Todo ID Input */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="mb-1 text-sm text-gray-500">
                        Todo ID *
                      </label>
                      <input
                        type="text"
                        value={selectedTodoId}
                        onChange={(e) => setSelectedTodoId(e.target.value)}
                        placeholder="Enter todo uuid for actions"
                        className="w-full !text-black px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex flex-row gap-x-6 items-start mb-4">
                      <button
                        onClick={handleCompleteTodo}
                        disabled={actionLoading || !selectedTodoId?.trim()}
                        className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {actionLoading ? "UPDATING..." : "COMPLETED"}
                      </button>

                      <button
                        onClick={handleRefresh}
                        className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-green-300 to-green-400 hover:from-green-400 hover:to-green-500 transition-all cursor-pointer"
                      >
                        REFRESH
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-col w-full px-8 gap-y-6 border-gray-200 rounded-lg sm:flex-row">
                {/* Current Todos Section */}
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md border-l-4 border-green-500">
                    <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
                      Current Todos ({todos.length})
                    </h2>

                    {todosLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading todos...</p>
                      </div>
                    ) : todos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No todos yet. Create your first one!
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto space-y-3 ">
                        {todos.slice(0, 5).map((todo) => (
                          <div
                            key={todo.id}
                            onClick={() => setSelectedTodoId(todo.id)}
                            className="w-full bg-white px-3 py-2 rounded-xl shadow-md border-l-4 border-purple-500 cursor-pointer"
                          >
                            <span className="text-base pt-2 font-bold text-gray-800 block">
                              {todo.title}
                            </span>
                            {todo.description && (
                              <span className="text-gray-600 text-sm block mt-1">
                                {todo.description}
                              </span>
                            )}

                            <div className="flex items-center justify-between py-2 gap-x-4">
                              <div className="flex items-center gap-x-2">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getPriorityColor(
                                    todo?.priority // ← Thêm optional chaining here
                                  )}`}
                                >
                                  {todo?.priority?.toUpperCase() || "UNKNOWN"}
                                </span>
                                <span className="text-xs font-semibold text-gray-500 block">
                                  {todo.isCompleted
                                    ? "Completed"
                                    : "Not Completed"}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    todo.isCompleted === true
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                ></span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(todo.createdAt)}
                              </span>
                            </div>

                            {/* ID - Clickable for easy copy */}
                            <span
                              className="text-xs text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(todo.id);
                                message.success("UUID copied to clipboard!");
                              }}
                              title="Click to copy UUID"
                            >
                              ID: {todo.id}
                            </span>
                          </div>
                        ))}
                        {todos.length > 5 && (
                          <div className="text-center py-2 text-gray-500 text-sm">
                            ... and {todos.length - 5} more todos
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Real-time Notifications Section */}
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
                      Real-time Notifications ({notifications.length})
                    </h2>

                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No notifications yet. Create or update a todo to see
                        real-time updates!
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto space-y-3">
                        {notifications.map((notification, index) => (
                          <div
                            key={index}
                            className="w-full bg-white px-3 py-2 rounded-xl shadow-md border-l-4 border-purple-500"
                          >
                            <div className="flex items-center justify-between py-1">
                              <span className="text-base font-bold text-gray-800">
                                {notification.type === "success"
                                  ? "✅"
                                  : notification.type === "info"
                                  ? "ℹ️"
                                  : "⚠️"}{" "}
                                {notification.type.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1">
                              <span className="text-gray-600 text-sm">
                                {notification.message}
                              </span>
                              {notification.todo && (
                                <span
                                  className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getPriorityColor(
                                    notification.todo.priority
                                  )}`}
                                >
                                  {notification.todo.priority?.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
