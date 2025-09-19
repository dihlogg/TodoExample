// services/socket.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private readonly serverUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        transports: ["websocket"],
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("✅ Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Disconnected from WebSocket server");
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Connection error:", error);
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 Socket disconnected");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Helper methods for specific events
  onTodoCreated(callback: (todo: any) => void): void {
    if (this.socket) {
      this.socket.on("todo_created", callback);
    }
  }

  onTodoStatusChanged(callback: (todo: any) => void): void {
    if (this.socket) {
      this.socket.on("todo_status_changed", callback);
    }
  }

  onNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  // Remove specific listeners
  offTodoCreated(): void {
    if (this.socket) {
      this.socket.off("todo_created");
    }
  }

  offTodoStatusChanged(): void {
    if (this.socket) {
      this.socket.off("todo_status_changed");
    }
  }

  offNotification(): void {
    if (this.socket) {
      this.socket.off("notification");
    }
  }
}

export const socketService = new SocketService();
