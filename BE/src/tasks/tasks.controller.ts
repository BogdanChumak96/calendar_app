import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './model/task.schema';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('id') userId: string,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
  async getUserTasks(@GetUser('id') userId: string): Promise<Task[]> {
    return this.tasksService.getAllTasks(userId);
  }

  @Get('filter')
  async getTasksByDate(
    @GetUser('id') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Task[]> {
    return this.tasksService.getTasksByDateRange(userId, startDate, endDate);
  }

  @Get('user/:userId')
  async getTasksByUser(@Param('userId') userId: string): Promise<Task[]> {
    return this.tasksService.getTasksByUser(userId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
