import { UserRepository } from 'src/user/dal/user.repository';
import { UserService } from '../user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/models/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';

jest.mock('bcrypt');

describe('User Service', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const userMock: UserEntity = {
    firstName: 'Luis',
    lastName: 'Colchon',
    email: 'lcolchon@mail.com',
    password: 'pass-hashed',
    createdAt: new Date(),
    lastLogin: undefined,
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get(UserRepository);
  });

  it('Retornar usuario por correo', async () => {
    const userRepositoryFindByEmail = userRepository.findOneByEmail.mockResolvedValue(userMock);
    const result = await userService.getUserByEmail(userMock.email);
    expect(result).toBe(userMock);
    expect(userRepositoryFindByEmail).toHaveBeenCalledWith(
      userMock.email,
      false,
    );
  });

  it('Realizar el hash de la contraseña', async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt123');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    const result = await userService.generatePasswordHash('123456');
    expect(bcrypt.genSalt).toHaveBeenCalled(); // validamos primera parte del hash
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt123'); // validamos que el hash haya llevado la password y el salt
    expect(result).toBe('hashedPassword'); // resultado esperado
  });

  it('Validacion correcta de contraseña', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await userService.validatePassword(userMock, 'pass-hashed');
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('pass-hashed', 'pass-hashed');
  });

  it('Validacion incorrecta de contraseña', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await userService.validatePassword(
      userMock,
      'pass-hashedv2',
    );
    expect(result).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith('pass-hashedv2', 'pass-hashed');
  });

  it('Creación correcta de usuario', async () => {
    const dto: CreateUserDTO = {
      firstName: 'Luis',
      lastName: 'Colchon',
      email: 'lcolchon@mail.com',
      password: 'pass-hashed',
    };

    const result = await userService.createUser(dto);

    expect(result).toBe(undefined);
    expect(userRepository.create).toHaveBeenCalled();
  });

  it('Actualización correcta del último login del usuario', async () => {
    const result = await userService.setLastLogin(userMock);

    expect(result).toBe(undefined);

    expect(userRepository.update).toHaveBeenCalled();
  });
});
