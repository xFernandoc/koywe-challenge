import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/bll/auth.service';
import { UserService } from 'src/bll/user.service';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';
import { UserEntity } from 'src/models/entities/user.entity';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const getUserExist = await this.userService.getUserByEmail(
      createUserDTO.email,
    );
    if (getUserExist) {
      throw new BadRequestException('User already exists');
    }
    const passwordHash = await this.userService.generatePasswordHash(
      createUserDTO.password,
    );
    createUserDTO.password = passwordHash;
    await this.userService.createUser(createUserDTO);
  }

  async getUserByEmail(email: string) {
    const user = await this.userService.getUserByEmail(email, false);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async login(user: UserEntity) {
    return await this.authService.singIn(user);
  }
}
