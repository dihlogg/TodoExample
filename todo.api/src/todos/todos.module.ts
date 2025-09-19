import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './todo.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoGateway } from './todos.gateway';
import { TodoProcessor } from './todos.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'todo_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TodosController, TodoProcessor],
  providers: [TodosService, TodoGateway],
  exports: [TodosService, TodoGateway],
})
export class TodosModule {}
