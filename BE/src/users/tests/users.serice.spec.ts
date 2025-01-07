import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../model/user.schema';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findByEmail: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      country: 'USA',
    };

    const mockUser: User = {
      _id: new Types.ObjectId(),
      email: createUserDto.email,
      password: createUserDto.password,
      name: createUserDto.name,
      country: createUserDto.country,
    } as User;

    jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);

    const result = await usersService.create(createUserDto);

    expect(userRepository.createUser).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should find all users', async () => {
    const mockUsers: User[] = [
      {
        _id: new Types.ObjectId(),
        email: 'user1@example.com',
        password: 'password123',
        name: 'User One',
        country: 'USA',
      } as User,
      {
        _id: new Types.ObjectId(),
        email: 'user2@example.com',
        password: 'password123',
        name: 'User Two',
        country: 'Canada',
      } as User,
    ];

    jest.spyOn(userRepository, 'findAllUsers').mockResolvedValue(mockUsers);

    const result = await usersService.findAll();

    expect(userRepository.findAllUsers).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it('should find a user by email', async () => {
    const mockUser: User = {
      _id: new Types.ObjectId(),
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      country: 'USA',
    } as User;

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

    const result = await usersService.findByEmail('test@example.com');

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user not found by email', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    await expect(
      usersService.findByEmail('nonexistent@example.com'),
    ).rejects.toThrowError('User not found');
  });

  it('should update an existing user', async () => {
    const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
    const mockUser: User = {
      _id: new Types.ObjectId(),
      email: 'test@example.com',
      password: 'password123',
      name: 'Updated Name',
      country: 'USA',
    } as User;

    jest.spyOn(userRepository, 'updateUser').mockResolvedValue(mockUser);

    const result = await usersService.update('some-user-id', updateUserDto);

    expect(userRepository.updateUser).toHaveBeenCalledWith(
      'some-user-id',
      updateUserDto,
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException when user not found for update', async () => {
    jest.spyOn(userRepository, 'updateUser').mockResolvedValue(null);

    await expect(
      usersService.update('some-user-id', { name: 'New Name' }),
    ).rejects.toThrowError('User not found with id "some-user-id"');
  });

  it('should remove a user', async () => {
    const mockUser: User = {
      _id: new Types.ObjectId(),
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      country: 'USA',
    } as User;

    jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(mockUser);

    await expect(usersService.remove('some-user-id')).resolves.not.toThrow();
    expect(userRepository.deleteUser).toHaveBeenCalledWith('some-user-id');
  });

  it('should throw NotFoundException when user not found for removal', async () => {
    jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(null);

    await expect(usersService.remove('some-user-id')).rejects.toThrowError(
      'User not found with id "some-user-id"',
    );
  });
});
