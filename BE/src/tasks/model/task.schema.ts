import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({
    type: String,
    enum: ['personal', 'work', 'holiday'],
    default: 'personal',
  })
  category: string;

  @Prop()
  tags?: string[];

  @Prop({ default: false })
  fixed: boolean;
}

export type TaskDocument = Task & Document;

export const TaskSchema = SchemaFactory.createForClass(Task);
