import { UserService } from 'src/user/bll/user.service';
import { AuthFacade } from '../auth/auth.facade';
import { AuthService } from 'src/auth/bll/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';
import { UserEntity } from 'src/models/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { JWTResponse } from 'src/types/common';

describe('authFacade', () => {
  let authFacade: AuthFacade;
  let userService: jest.Mocked<UserService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacade,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
            generatePasswordHash: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            singIn: jest.fn(),
          },
        },
      ],
    }).compile();
    authFacade = module.get<AuthFacade>(AuthFacade);
    userService = module.get(UserService);
    authService = module.get(AuthService);
  });

  describe('created', () => {
    it('Crear usuario correcto', async () => {
      const dto: CreateUserDTO = {
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@mail.com',
        password: '123456',
      };

      const hashedPassword = 'hashed123';
      const createdUser: UserEntity = {
        ...dto,
        password: hashedPassword,
        createdAt: new Date(),
        lastLogin: undefined,
        isActive: true,
      };

      const userServiceMail = userService.getUserByEmail
        .mockResolvedValueOnce(null) // validacion
        .mockResolvedValueOnce(createdUser); // creacion
      const userServicePassword =
        userService.generatePasswordHash.mockResolvedValue(hashedPassword);
      const userServiceCreated =
        userService.createUser.mockResolvedValue(undefined);

      const result = await authFacade.create(dto);

      expect(userServiceMail).toHaveBeenCalledWith(dto.email);
      expect(userServicePassword).toHaveBeenCalledWith('123456'); // ya que nuestro dto de entrada se modifca
      expect(userServiceCreated).toHaveBeenCalledWith({
        ...dto,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });

    it('Crear un usuario con un correo ya existente', async () => {
      const dto: CreateUserDTO = {
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@mail.com',
        password: '123456',
      };
      const userExists: UserEntity = {
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@mail.com',
        password: '123456',
        createdAt: new Date(),
        lastLogin: undefined,
        isActive: true,
      };
      userService.getUserByEmail.mockResolvedValue(userExists);
      await expect(authFacade.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('login correcto con devolucion del token', async () => {
      const user: UserEntity = {
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@mail.com',
        password: '123456',
        createdAt: new Date(),
        lastLogin: undefined,
        isActive: true,
      };
      const tokenMock: JWTResponse = {
        accessToken: 'token',
        expires: new Date(),
      };
      const authServiceSignIng =
        authService.singIn.mockResolvedValue(tokenMock);
      const result = await authFacade.login(user);
      expect(authServiceSignIng).toHaveBeenCalledWith(user);
      expect(result).toEqual(tokenMock);
    });
  });
});
