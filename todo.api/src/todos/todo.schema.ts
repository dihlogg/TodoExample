import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
@Schema({ timestamps: true }) // mongo tự generate createAt và updateAt
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Priority, default: Priority.LOW })
  priority: Priority;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_: any, ret: any) => {
    return {
      id: ret._id.toString(),
      title: ret.title,
      description: ret.description,
      priority: ret.priority,
      isCompleted: ret.isCompleted,
      completedAt: ret.completedAt,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});
