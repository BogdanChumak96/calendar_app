import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtModule } from '@nestjs/jwt';
import { Types } from 'mongoose';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secretKey',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        country: 'UA',
      };

      const result = {
        _id: new Types.ObjectId(),
        ...createUserDto,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(result);

      const response = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(response).toEqual(result);
    });
  });
});
