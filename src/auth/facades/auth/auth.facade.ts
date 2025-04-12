import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/bll/auth.service';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';
import { UserEntity } from 'src/models/entities/user.entity';
import { JWTResponse } from 'src/types/common';
import { UserService } from 'src/user/bll/user.service';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<UserEntity> {
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

    return await this.userService.getUserByEmail(createUserDTO.email, false);
  }

  async login(user: UserEntity): Promise<JWTResponse> {
    return await this.authService.singIn(user);
  }
}
