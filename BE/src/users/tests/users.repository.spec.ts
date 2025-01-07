import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserRepository } from '../user.repository';
import { User } from '../model/user.schema';
import { Model } from 'mongoose';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockUserModel: Model<User>;

  const mockUser = {
    _id: 'mockUserId',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const mockUserModelFactory = () => ({
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([mockUser]) }),
    findOne: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
    findByIdAndDelete: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModelFactory(),
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    mockUserModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const result = await repository.findAllUsers();

      expect(result).toEqual([mockUser]);
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const result = await repository.findByEmail('john.doe@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const updates = { name: 'Jane Doe' };
      const result = await repository.updateUser('mockUserId', updates);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockUserId',
        updates,
        { new: true },
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the deleted user', async () => {
      const result = await repository.deleteUser('mockUserId');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(
        'mockUserId',
      );
    });
  });
});
