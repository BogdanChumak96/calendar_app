import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  userId?: Types.ObjectId;

  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
