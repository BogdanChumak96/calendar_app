import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface User {
  email: string;
  password: string;
  name: string;
  country: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      email: 'boggdan21test@gmail.com',
      password: 'Test4234!',
      name: 'Bohdan',
      country: 'USA',
    },
    {
      email: 'john.doe@example.com',
      password: 'Password123!',
      name: 'John Doe',
      country: 'Canada',
    },
    {
      email: 'jane.smith@example.com',
      password: 'SecurePass456!',
      name: 'Jane Smith',
      country: 'United Kingdom',
    },
  ];
  create(createUserDto: CreateUserDto) {
    const newUser: User = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      country: createUserDto.country,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOneByEmail(email: string): any {
    //TODO: add mongo schema
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      throw new NotFoundException(`User not found with email "${email}"`);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a user #${updateUserDto.name}`;
  }

  remove(id: number) {
    return `This action removes a user with id #${id}`;
  }
}
