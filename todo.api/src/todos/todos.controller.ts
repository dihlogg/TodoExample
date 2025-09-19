import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
  Inject,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.schema';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ToDos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('GetAllTodos')
  async findAll(): Promise<Todo[]> {
    return await this.todosService.findAll();
  }
  @Get('GetTodoById/:id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }
  @Put('PutTodo/:id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }
  
  @Post('PostTodo')
  async create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }
}
