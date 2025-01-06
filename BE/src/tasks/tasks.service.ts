import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './model/task.schema';
import { Types } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const taskData = {
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
    };
    return this.tasksRepository.createTask(taskData);
  }

  async getTasksByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Task[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (startDate) {
      filter.dueDate = { $gte: new Date(startDate) };
    }

    if (endDate) {
      filter.dueDate = filter.dueDate
        ? { ...filter.dueDate, $lte: new Date(endDate) }
        : { $lte: new Date(endDate) };
    }

    return this.tasksRepository.getAllTasks(filter);
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    return this.tasksRepository.getAllTasks({ userId });
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository.findTasksByUser(userId);
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findTaskById(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return task;
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const updatedTask = await this.tasksRepository.updateTask(
      taskId,
      updateTaskDto,
    );
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    const deletedTask = await this.tasksRepository.deleteTask(taskId);
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
  }
}
