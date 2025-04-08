import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "src/models/entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserEntity>) {}

  async create(data: any){
    console.log('Creating user:', data);
  }
  
  async findOneByEmail(email: string){
    console.log('Find user by email:', email);
  }
}