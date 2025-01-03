import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: Partial<User>): Promise<User> {
    console.log('Attempting to create user:', user);
    try {
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();
      console.log('User successfully saved:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('Error while creating user:', error);
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updates, { new: true })
      .exec();
  }

  async deleteUser(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
