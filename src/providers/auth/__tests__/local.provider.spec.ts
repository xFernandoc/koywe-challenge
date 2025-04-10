import { UserService } from 'src/user/bll/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/models/entities/user.entity';
import { LocalStrategy } from '../local.provider';

describe('localStrategy', () => {
  let localStrategy: LocalStrategy;
  let userService: jest.Mocked<UserService>;

  const userMock: UserEntity = {
    firstName: 'Luis',
    lastName: 'Colchon',
    password: 'password',
    createdAt: new Date(),
    email: 'lcolchon@gmail.com',
    isActive: true,
    lastLogin: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
            validatePassword: jest.fn(),
            setLastLogin: jest.fn(),
          },
        },
      ],
    }).compile();
    localStrategy = module.get(LocalStrategy);
    userService = module.get(UserService);
  });

  it('Usuario no existe, deberá dar un error 401.', async () => {
    // simulamos funcion que devolvera un null
    userService.getUserByEmail.mockResolvedValue(null);
    await expect(
      localStrategy.validate('lcolchon@gmail.com', 'password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('Credenciales incorrectas, deberá dar un error de 401', async () => {
    userService.getUserByEmail.mockResolvedValue(userMock);
    userService.validatePassword.mockResolvedValue(false);
    await expect(
      localStrategy.validate('test@mail.com', 'wrongpass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('Credenciales correctas y deberá retornar el usuario', async () => {
    userService.getUserByEmail.mockResolvedValue(userMock);
    userService.validatePassword.mockResolvedValue(true);
    userService.setLastLogin.mockResolvedValue(undefined);
    const result = await localStrategy.validate(userMock.email, 'password');
    expect(result).toEqual({ ...userMock, password: undefined });
  });
});
