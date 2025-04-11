import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';
import { UserEntity } from 'src/models/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserEntity>) {}

  async create(data: CreateUserDTO) {
    await this.userModel.create(data);
  }

  async update(user: UserEntity) {
    return await this.userModel
      .updateOne({ _id: user._id }, { $set: user })
      .exec();
  }

  async findOneByEmail(
    email: string,
    forLogin = false,
  ): Promise<UserEntity | undefined> {
    return await this.userModel
      .findOne({ email, isActive: true })
      .select(forLogin ? '+password' : '-password')
      .exec();
  }
}
