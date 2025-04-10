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
      const mockUser: UserEntity = {
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@mail.com',
        password: 'pass-hashed',
        createdAt: new Date(),
        lastLogin: undefined,
        isActive: true,
      };
      const dto: CreateUserDTO = {
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@gmail.com',
        password: 'pass-hashed',
      };

      // simulamos la creacion de usuario con el retorno de un usuario
      const spyCreate = authFacade.create.mockResolvedValue(mockUser);

      // ejecutamos la creacion
      const result = await controller.create(dto);

      // comparamos el resultado
      expect(result).toEqual({
        message: 'Usuario creado correctamente',
        user: mockUser,
      });

      // comparamos el body recibido sea el adecuado
      expect(spyCreate).toHaveBeenCalledWith(dto);
    });

    it('Creando un usuario ya existente, deberia dar un error', async () => {
      const dto: CreateUserDTO = {
        firstName: 'Luis',
        lastName: 'Ñañez',
        email: 'lcolchon@gmail.com',
        password: 'pass-hashedv2',
      };

      // simulamos la creacion del usuario pero con erro ya que el usuario ya existe
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

      // simulamos login ok con retorno del token
      const spyLogin = authFacade.login.mockResolvedValue(mockToken);

      const result = await controller.login(mockUser);

      expect(result).toEqual(mockToken);

      expect(spyLogin).toHaveBeenCalledWith(mockUser);
    });
  });
});
