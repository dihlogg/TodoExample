import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) //open cors cho fe
export class TodoGateway {
  @WebSocketServer()
  server: Server;

  //broadcast đến all clients khi có event
  handleTodoCreatedEvent(eventData: any) {
    this.server.emit('todo_created', eventData); //event name cho fe
  }

  @SubscribeMessage('join_todo_room') // option: để clients join room nếu cần specific notify
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
  }
}
