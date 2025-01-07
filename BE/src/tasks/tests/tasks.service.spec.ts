import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { TasksRepository } from '../tasks.repository';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: TasksRepository;

  const mockRepository = {
    createTask: jest.fn(),
    searchTasks: jest.fn(),
    getAllTasks: jest.fn(),
    findTasksByUser: jest.fn(),
    findTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TasksRepository>(TasksRepository);
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const userId = new Types.ObjectId().toString();
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Task Description',
        dueDate: '2025-01-10',
      };

      const createdTask = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(userId),
        ...createTaskDto,
      };

      mockRepository.createTask.mockResolvedValue(createdTask);

      const result = await service.createTask(createTaskDto, userId);

      expect(result).toEqual(createdTask);
      expect(repository.createTask).toHaveBeenCalledWith({
        ...createTaskDto,
        userId: new Types.ObjectId(userId),
      });
    });
  });

  describe('searchTasks', () => {
    it('should return tasks matching the query', async () => {
      const userId = new Types.ObjectId().toString();
      const query = 'Test';
      const mockTasks = [
        {
          _id: new Types.ObjectId(),
          userId: new Types.ObjectId(userId),
          title: 'Test Task',
          description: 'Description',
          dueDate: '2025-01-10',
          completed: false,
        },
      ];

      mockRepository.searchTasks.mockResolvedValue(mockTasks);

      const result = await service.searchTasks(userId, query);

      expect(result).toEqual(mockTasks);
      expect(repository.searchTasks).toHaveBeenCalledWith(userId, query);
    });
  });

  describe('getTasksByDateRange', () => {
    it('should return tasks within the specified date range', async () => {
      const userId = new Types.ObjectId().toString();
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      const mockTasks = [
        {
          _id: new Types.ObjectId(),
          userId: new Types.ObjectId(userId),
          title: 'Task 1',
          description: 'Description',
          dueDate: '2025-01-10',
          completed: false,
        },
      ];

      mockRepository.getAllTasks.mockResolvedValue(mockTasks);

      const result = await service.getTasksByDateRange(
        userId,
        startDate,
        endDate,
      );

      expect(result).toEqual(mockTasks);
      expect(repository.getAllTasks).toHaveBeenCalledWith({
        userId: new Types.ObjectId(userId),
        dueDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by its ID', async () => {
      const taskId = new Types.ObjectId().toString();
      const mockTask = {
        _id: new Types.ObjectId(taskId),
        title: 'Task',
        description: 'Description',
        dueDate: '2025-01-10',
        completed: false,
      };

      mockRepository.findTaskById.mockResolvedValue(mockTask);

      const result = await service.getTaskById(taskId);

      expect(result).toEqual(mockTask);
      expect(repository.findTaskById).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = new Types.ObjectId().toString();

      mockRepository.findTaskById.mockResolvedValue(null);

      await expect(service.getTaskById(taskId)).rejects.toThrow(
        new NotFoundException(`Task with ID "${taskId}" not found`),
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task and return the updated task', async () => {
      const taskId = new Types.ObjectId().toString();
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        completed: true,
      };

      const updatedTask = {
        _id: new Types.ObjectId(taskId),
        title: 'Updated Task',
        description: 'Description',
        dueDate: '2025-01-10',
        completed: true,
      };

      mockRepository.updateTask.mockResolvedValue(updatedTask);

      const result = await service.updateTask(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(repository.updateTask).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = new Types.ObjectId().toString();
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        completed: true,
      };

      mockRepository.updateTask.mockResolvedValue(null);

      await expect(service.updateTask(taskId, updateTaskDto)).rejects.toThrow(
        new NotFoundException(`Task with ID "${taskId}" not found`),
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = new Types.ObjectId().toString();
      const mockTask = {
        _id: new Types.ObjectId(taskId),
        title: 'Task to delete',
        description: 'Description',
        dueDate: '2025-01-10',
        completed: false,
      };

      mockRepository.deleteTask.mockResolvedValue(mockTask);

      await service.deleteTask(taskId);

      expect(repository.deleteTask).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = new Types.ObjectId().toString();

      mockRepository.deleteTask.mockResolvedValue(null);

      await expect(service.deleteTask(taskId)).rejects.toThrow(
        new NotFoundException(`Task with ID "${taskId}" not found`),
      );
    });
  });
});
