import { Controller, Injectable } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TodoGateway } from './todos.gateway';

@Controller()
export class TodoProcessor {
  constructor(private readonly todoGateway: TodoGateway) {}

  // @EventPattern('todo_created')
  // async handleTodoCreated(@Payload() data: any) {
  //   console.log('Processing todo_created event:', data);
    
  //   try {
  //     // Emit real-time event via WebSocket
  //     this.todoGateway.emitTodoCreated(data);
  //     console.log('Todo created event processed successfully');    
  //   } catch (error) {
  //     console.error('Error processing todo_created event:', error);
  //     throw error;
  //   }
  // }
@EventPattern('todo_created')
  async handleTodoCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Received todo_created:', data);

    // emit realtime về FE qua websocket
    this.todoGateway.server.emit('todo_created', data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @EventPattern('todo_status_changed')
  async handleTodoStatusChanged(@Payload() data: any) {
    console.log('Processing todo_status_changed event:', data);
    
    try {
      this.todoGateway.emitTodoStatusChanged(data);
      console.log('Todo status changed event processed successfully');
    } catch (error) {
      console.error('Error processing todo_status_changed event:', error);
      throw error;
    }
  }
}