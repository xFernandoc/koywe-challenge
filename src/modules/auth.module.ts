import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/bll/auth.service';
import { UserService } from 'src/bll/user.service';
import { AuthController } from 'src/controllers/auth.controllers';
import { UserRepository } from 'src/dal/user.repository';
import { AuthFacade } from 'src/facades/auth/auth.facade';
import { LocalStrategy } from 'src/providers/auth/local.provider';
import { UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_JWT'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    MongooseModule.forFeature([{
      name: 'User', schema: UserSchema
    }])
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AuthFacade,
    UserService,
    UserRepository,
    AuthService
  ],
})
export class AuthModule { }
