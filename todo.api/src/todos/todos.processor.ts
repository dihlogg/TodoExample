import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TodoGateway } from './todos.gateway';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller()
export class TodoProcessor {
  constructor(private readonly todoGateway: TodoGateway) {}
  @EventPattern('todo_created')
  async handleTodoCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Received todo_created:', data);

    // emit realtime về FE qua websocket
    // this.todoGateway.server.emit('todo_created', data);
    this.todoGateway.emitTodoCreated({
      createdTodo: data,
      message: 'Todo Created Success'
    });

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @EventPattern('todo_status_changed')
  async handleTodoStatusChanged(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('Processing todo_status_changed event:', data);

    // this.todoGateway.server.emit('todo_status_changed', data);
    this.todoGateway.emitTodoStatusChanged({
      updatedTodo: data,
      message: 'Todo Updated Success'
    });
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
