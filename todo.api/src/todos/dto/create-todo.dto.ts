import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from '../todo.schema';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsEnum(Priority)
  @IsNotEmpty()
  @ApiProperty()
  priority: Priority;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isCompleted: boolean;

  @IsOptional()
  completedAt: Date | null;
}
