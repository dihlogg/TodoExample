import { ApiProperty } from '@nestjs/swagger';

export class TodoCreatedEvent {
  id: string;

  title: string;

  description: string;

  createdAt: Date;
}
