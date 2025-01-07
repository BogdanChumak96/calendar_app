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
import { GetUser } from '../users/decorators/get-user.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';

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
  async getUserTasks(
    @GetUser() user: { id: string; country: string },
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(user.id);
  }

  @Get('search')
  async searchTasks(
    @GetUser('id') userId: string,
    @Query('query') query: string,
  ): Promise<Task[]> {
    return this.tasksService.searchTasks(userId, query);
  }

  //can be put into a separate service by SOLID
  @Get('holidays')
  async getHolydays(
    @GetUser() user: { id: string; country: string },
    @Query('year') year: string,
  ) {
    return this.tasksService.getHolidays(year, user.country);
  }

  @Get('filter')
  async getTasksByDate(
    @GetUser('id') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Task[]> {
    return this.tasksService.getTasksByDateRange(userId, startDate, endDate);
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
