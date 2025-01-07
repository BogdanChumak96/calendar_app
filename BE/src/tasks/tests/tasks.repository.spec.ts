import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksRepository } from '../tasks.repository';
import { Task } from '../model/task.schema';
import { Types } from 'mongoose';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TasksRepository', () => {
  let repository: TasksRepository;
  let mockTaskModel: any;

  beforeEach(async () => {
    mockTaskModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksRepository,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    repository = module.get<TasksRepository>(TasksRepository);
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        userId: new Types.ObjectId().toString(),
        title: 'New Task',
        description: 'Test Description',
        dueDate: '2025-01-15',
        completed: false,
      };

      const createdTask = {
        _id: new Types.ObjectId(),
        ...createTaskDto,
      };

      const saveMock = jest.fn().mockResolvedValue(createdTask);
      mockTaskModel = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TasksRepository,
          {
            provide: getModelToken(Task.name),
            useValue: mockTaskModel,
          },
        ],
      }).compile();

      const repository = module.get<TasksRepository>(TasksRepository);

      const result = await repository.createTask(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(mockTaskModel).toHaveBeenCalledWith(createTaskDto);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTasksByDateRange', () => {
    it('should return tasks within a specific date range', async () => {
      const userId = new Types.ObjectId().toString();
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';

      const mockTasks = [
        {
          _id: new Types.ObjectId(),
          userId: new Types.ObjectId(userId),
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2025-01-10',
          completed: false,
        },
      ];

      mockTaskModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTasks),
      });

      const result = await repository.getTasksByDateRange(
        userId,
        startDate,
        endDate,
      );

      expect(result).toEqual(mockTasks);
      expect(mockTaskModel.find).toHaveBeenCalledWith({
        userId,
        dueDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
    });
  });

  describe('findTaskById', () => {
    it('should return a task by its ID', async () => {
      const taskId = new Types.ObjectId().toString();

      const mockTask = {
        _id: new Types.ObjectId(taskId),
        userId: new Types.ObjectId(),
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2025-01-10',
        completed: false,
      };

      mockTaskModel.findById().exec.mockResolvedValue(mockTask);

      const result = await repository.findTaskById(taskId);

      expect(result).toEqual(mockTask);
      expect(mockTaskModel.findById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('updateTask', () => {
    it('should update a task and return the updated task', async () => {
      const taskId = new Types.ObjectId().toString();
      const updateDto: UpdateTaskDto = {
        title: 'Updated Task',
        completed: true,
      };

      const updatedTask = {
        _id: new Types.ObjectId(taskId),
        userId: new Types.ObjectId(),
        title: 'Updated Task',
        description: 'Description 1',
        dueDate: '2025-01-10',
        completed: false,
      };

      mockTaskModel.findByIdAndUpdate().exec.mockResolvedValue(updatedTask);

      const result = await repository.updateTask(taskId, updateDto);

      expect(result).toEqual(updatedTask);
      expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        updateDto,
        { new: true },
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return the deleted task', async () => {
      const taskId = new Types.ObjectId().toString();

      const mockTask = {
        _id: new Types.ObjectId(taskId),
        userId: new Types.ObjectId(),
        title: 'Task to Delete',
        description: 'Description 1',
        dueDate: '2025-01-10',
        completed: false,
      };

      mockTaskModel.findByIdAndDelete().exec.mockResolvedValue(mockTask);

      const result = await repository.deleteTask(taskId);

      expect(result).toEqual(mockTask);
      expect(mockTaskModel.findByIdAndDelete).toHaveBeenCalledWith(taskId);
    });
  });
});
