import { Injectable } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TodoCreatedEvent } from './dto/todo-created.event';
import { TodoGateway } from './todos.gateway';

@Injectable()
export class TodoEventHandler {
  constructor(private todoGateway: TodoGateway) {}

  @EventPattern('todo_created')
  handleTodoCreated(
    @Payload() data: TodoCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    //emit sang websocket
    console.log('Received todo_created event: ', data);
    this.todoGateway.handleTodoCreatedEvent(data);
  }
}
