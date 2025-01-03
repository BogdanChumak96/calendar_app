import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.schema';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    SharedModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
