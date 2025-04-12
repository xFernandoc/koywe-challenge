import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from 'src/types/common';
import { UserService } from 'src/user/bll/user.service';
import { UserEntity } from 'src/models/entities/user.entity';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET_JWT'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JWTPayload): Promise<UserEntity> {
    const { email } = payload;
    const user = await this.userService.getUserByEmail(email, false);
    if (!user) {
      throw new UnauthorizedException('Credentials not found');
    }
    return user;
  }
}
