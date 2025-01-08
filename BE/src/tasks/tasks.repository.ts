import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './model/task.schema';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async getTasksByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Task[]> {
    return this.taskModel
      .find({
        userId,
        dueDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .exec();
  }

  async getTasks(
    userId: string | Types.ObjectId,
    query?: string,
  ): Promise<Task[]> {
    const userIdObject =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const filter: any = { userId: userIdObject };

    if (query?.trim()) {
      filter.title = { $regex: query.trim(), $options: 'i' };
    }

    return this.taskModel.find(filter).exec();
  }

  async findTasksByUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async findTaskById(taskId: string): Promise<Task | null> {
    return this.taskModel.findById(taskId).exec();
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(taskId, updateTaskDto, { new: true })
      .exec();
  }

  async deleteTask(taskId: string): Promise<Task | null> {
    return this.taskModel.findByIdAndDelete(taskId).exec();
  }
}
