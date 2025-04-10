import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/user/dal/user.repository';
import { AuthFacade } from 'src/auth/facades/auth/auth.facade';
import { LocalStrategy } from 'src/providers/auth/local.provider';
import { UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/bll/user.service';
import { AuthService } from './bll/auth.service';

@Module({
  imports: [
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
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AuthFacade,
    UserService,
    UserRepository,
    AuthService,
  ],
})
export class AuthModule {}
