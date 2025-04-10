import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/bll/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.userService.getUserByEmail(username, true);
    if (!user) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const isValid = await this.userService.validatePassword(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    await this.userService.setLastLogin(user);
    user.password = undefined;
    return user;
  }
}
