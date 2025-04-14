import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/models/entities/user.entity';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';
import { BadRequestException } from '@nestjs/common';
import { JWTResponse } from 'src/types/common';
import { AuthController } from '../auth.controller';
import { AuthFacade } from '../facades/auth/auth.facade';

describe('AuthController', () => {
  let controller: AuthController;
  let authFacade: jest.Mocked<AuthFacade>;

  const mockUser: UserEntity = {
    firstName: 'Luis',
    lastName: 'Colchon',
    email: 'lcolchon@gmail.com',
    password: 'pass-hashed',
    createdAt: new Date(),
    lastLogin: undefined,
    isActive: true,
  };

  const createUserDtoOk: CreateUserDTO = {
    firstName: 'Luis',
    lastName: 'Colchon',
    email: 'lcolchon@gmail.com',
    password: 'pass-hashed',
  };

  const createUserDtoNotOk: CreateUserDTO = {
    firstName: 'Luis',
    lastName: 'Colchon',
    email: 'correo',
    password: 'pass-hashed',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authFacade = module.get(AuthFacade);
  });

  describe('create user', () => {
    it('Creando usuario y debería devolver el mensaje y el usuario creado', async () => {
      // simulamos la creacion de usuario con el retorno de un usuario
      authFacade.create.mockResolvedValue(mockUser);

      // ejecutamos la creacion
      const result = await controller.create(createUserDtoOk);

      expect(authFacade.create).toHaveBeenCalledWith(createUserDtoOk);

      // comparamos el resultado
      expect(result).toEqual({
        message: 'Usuario creado correctamente',
        user: mockUser,
      });
    });

    it('Creando usuario pero con información incorrecta', async () => {
      authFacade.create.mockRejectedValue(
        new BadRequestException('Email incorrect'),
      );
      await expect(controller.create(createUserDtoNotOk)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Creando un usuario ya existente, deberia dar un error', async () => {
      const dto: CreateUserDTO = {
        firstName: 'Luis',
        lastName: 'Ñañez',
        email: 'lcolchon@gmail.com',
        password: 'pass-hashedv2',
      };

      authFacade.create.mockRejectedValue(
        new BadRequestException('User already exists'),
      );

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login user', () => {
    it('Login exitoso y deberá devolver un access token', async () => {
      const mockUser = { email: 'lcolchon@gmail.com' } as UserEntity;
      const mockToken: JWTResponse = {
        accessToken: 'token',
        expires: new Date(),
      };

      authFacade.login.mockResolvedValue(mockToken);

      const result = await controller.login(mockUser);

      expect(result).toEqual(mockToken);

      expect(authFacade.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
