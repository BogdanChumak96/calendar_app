import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../shared/guards/auth.guard');

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            createTask: jest.fn().mockResolvedValue({
              _id: 'mockId',
              title: 'Test Task',
              description: 'Test Task Description',
              userId: 'mockUserId',
            }),
            getAllTasks: jest.fn().mockResolvedValue([
              {
                _id: 'mockId1',
                title: 'Test Task 1',
                description: 'Description 1',
              },
              {
                _id: 'mockId2',
                title: 'Test Task 2',
                description: 'Description 2',
              },
            ]),
            getTaskById: jest.fn().mockResolvedValue({
              _id: 'mockId1',
              title: 'Test Task 1',
              description: 'Description 1',
              userId: 'mockUserId',
            }),
            updateTask: jest.fn().mockResolvedValue({
              _id: 'mockId1',
              title: 'Updated Task',
              description: 'Updated Description',
              userId: 'mockUserId',
            }),
            deleteTask: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should create a new task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Task Description',
      dueDate: '',
    };

    const userId = 'mockUserId';

    const result = await controller.createTask(createTaskDto, userId);

    expect(result).toEqual({
      _id: 'mockId',
      title: 'Test Task',
      description: 'Test Task Description',
      userId: 'mockUserId',
    });

    expect(service.createTask).toHaveBeenCalledWith(createTaskDto, userId);
  });

  it('should get all tasks for the user', async () => {
    const user = { id: 'mockUserId', country: 'US' };

    const result = await controller.getUserTasks(user);

    expect(result).toEqual([
      { _id: 'mockId1', title: 'Test Task 1', description: 'Description 1' },
      { _id: 'mockId2', title: 'Test Task 2', description: 'Description 2' },
    ]);

    expect(service.getAllTasks).toHaveBeenCalledWith(user.id);
  });

  it('should get a specific task by id', async () => {
    const result = await controller.getTaskById('mockId1');

    expect(result).toEqual({
      _id: 'mockId1',
      title: 'Test Task 1',
      description: 'Description 1',
      userId: 'mockUserId',
    });

    expect(service.getTaskById).toHaveBeenCalledWith('mockId1');
  });

  it('should update an existing task', async () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: '',
      completed: false,
    };

    const result = await controller.updateTask('mockId1', updateTaskDto);

    expect(result).toEqual({
      _id: 'mockId1',
      title: 'Updated Task',
      description: 'Updated Description',
      userId: 'mockUserId',
    });

    expect(service.updateTask).toHaveBeenCalledWith('mockId1', updateTaskDto);
  });

  it('should throw NotFoundException when trying to update a non-existing task', async () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: '',
      completed: false,
    };

    jest
      .spyOn(service, 'updateTask')
      .mockRejectedValue(new NotFoundException());

    await expect(
      controller.updateTask('invalidId', updateTaskDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a task', async () => {
    const result = await controller.deleteTask('mockId1');

    expect(result).toBeUndefined();

    expect(service.deleteTask).toHaveBeenCalledWith('mockId1');
  });

  it('should throw NotFoundException when trying to delete a non-existing task', async () => {
    jest
      .spyOn(service, 'deleteTask')
      .mockRejectedValue(new NotFoundException());

    await expect(controller.deleteTask('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });
});
