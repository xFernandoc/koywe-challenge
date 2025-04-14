import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthFacade } from 'src/auth/facades/auth/auth.facade';
import { LocalStrategy } from 'src/providers/auth/local.provider';
import { AuthController } from './auth.controller';
import { AuthService } from './bll/auth.service';
import { UserModule } from 'src/user/user.module';
import { JWTStrategy } from 'src/providers/auth/jwt.provider';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_JWT'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JWTStrategy, AuthFacade, AuthService],
})
export class AuthModule {}
