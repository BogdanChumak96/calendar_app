import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './model/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser({
      email: createUserDto.email,
      password: createUserDto.password,
      name: createUserDto.name,
      country: createUserDto.country,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(
      userId,
      updateUserDto,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User not found with id "${userId}"`);
    }
    return updatedUser;
  }

  async remove(userId: string): Promise<void> {
    const user = await this.userRepository.deleteUser(userId);
    if (!user) {
      throw new NotFoundException(`User not found with id "${userId}"`);
    }
  }
}
