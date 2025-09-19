import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  //   async create(createTodoDto: CreateTodoDto): Promise<Todo> {
  //   const createdTodo = new this.todoModel(createTodoDto);
  //   const savedTodo = await createdTodo.save();

  //   // await this.rabbitClient.connect();

  //   //push event vào RabbitMQ queue
  //   this.rabbitClient.emit('todo_created', {
  //     createdTodo: savedTodo,
  //     message: `Todo "${savedTodo.title}" created successfully`
  //   });
  //   return savedTodo;
  // }
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    const savedTodo = await createdTodo.save();

    this.rabbitClient.emit('todo_created', savedTodo.toObject());

    // Trả về plain object
    return savedTodo.toObject();
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findOne({ id }).exec();
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
    if (!updatedTodo) throw new NotFoundException('Todo not found');

    // push event todo_status_changed
    this.rabbitClient.emit('todo_status_changed', {
      updatedTodo,
      message: `Todo "${updatedTodo.title}" status updated`,
    });

    return updatedTodo;
  }
}
