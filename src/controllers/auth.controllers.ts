import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/decorators/request-user.decorator";
import { AuthFacade } from "src/facades/auth/auth.facade";
import { LocalAuthGuard } from "src/guards/local.guard";
import { CreateUserDTO } from "src/models/dtos/user-created.dto";
import { UserEntity } from "src/models/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade : AuthFacade) {}

  @Post('create')
  async create(@Body() createUserDTO: CreateUserDTO) {
    await this.authFacade.create(createUserDTO);
    const user = await this.authFacade.getUserByEmail(createUserDTO.email);
    return {
        message: 'Usuario creado correctamente',
        user
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserEntity) {
    return await this.authFacade.login(user);
  }
}
