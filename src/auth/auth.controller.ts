import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthFacade } from './facades/auth/auth.facade';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { CurrentUser } from 'src/decorators/request-user.decorator';
import { UserEntity } from 'src/models/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post('create')
  async create(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.authFacade.create(createUserDTO);
    return {
      message: 'Usuario creado correctamente',
      user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserEntity) {
    return await this.authFacade.login(user);
  }
}
