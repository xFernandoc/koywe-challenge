import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/dal/user.repository";
import { CreateUserDTO } from "src/models/dtos/user-created.dto";
import * as bcrypt from 'bcrypt';
import { UserEntity } from "src/models/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async createUser(createUserDTO: CreateUserDTO) {
    await this.userRepository.create(createUserDTO);
  }

  async getUserByEmail(email: string,forLogin = false) {
    return await this.userRepository.findOneByEmail(email,forLogin);
  }

  async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(user: UserEntity, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async setLastLogin(user: UserEntity) {
    user.lastLogin = new Date();
    await this.userRepository.update(user);
  }
}