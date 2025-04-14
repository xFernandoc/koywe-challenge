import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/bll/user.service';
import { JWTPayload } from 'src/types/common';
import { UserEntity } from 'src/models/entities/user.entity';
import { JWTStrategy } from '../jwt.provider';
import { Test, TestingModule } from '@nestjs/testing';

describe('JWTStrategy', () => {
  let strategy: JWTStrategy;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTStrategy,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('my-secret-jwt'),
          },
        },
      ],
    }).compile();
    strategy = module.get<JWTStrategy>(JWTStrategy);
    userService = module.get(UserService);
  });

  it('Retornar usuario correcto', async () => {
    const mockUser: UserEntity = {
      firstName: 'Luis',
      lastName: 'Colchon',
      email: 'lcolchon@gmail.com',
      password: 'pass-hashed',
      createdAt: new Date(),
      lastLogin: undefined,
      isActive: true,
    };

    userService.getUserByEmail.mockResolvedValue(mockUser);

    const payload: JWTPayload = {
      email: 'lcolchon@gmail.com',
      isActive: true,
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual(mockUser);
    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      'lcolchon@gmail.com',
      false,
    );
  });

  it('En caso no exista', async () => {
    userService.getUserByEmail.mockResolvedValue(null);

    const payload: JWTPayload = {
      email: 'notfound@example.com',
      isActive: false,
    };

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
