import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } }) //open cors cho fe
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`CLient disconnected: ${client.id}`);
  }
  @WebSocketServer()
  server: Server;

  // Emit đến all clients khi có event
  emitTodoCreated(eventData: any) {
    this.server.emit('todo_created', eventData.createdTodo);
    this.server.emit('notification', {
      type: 'success',
      message: eventData.message,
      timestamp: new Date(),
      todo: eventData.createdTodo,
    });
  }

  // Emit todo status changed event
  emitTodoStatusChanged(eventData: any) {
    this.server.emit('todo_status_changed', eventData.updatedTodo);
    this.server.emit('notification', {
      type: 'info',
      message: eventData.message,
      timestamp: new Date(),
      todo: eventData.updatedTodo,
    });
  }

  //emit notifications
  emitNotification(notify: any) {
    this.server.emit('notification', notify);
  }

  @SubscribeMessage('join_todo_room') // option: để clients join room nếu cần specific notify
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
  }
}
