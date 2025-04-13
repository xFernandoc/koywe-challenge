import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { UserEntity } from 'src/models/entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDTO } from 'src/models/dtos/user-created.dto';

describe('User Repository', () => {
  let userRepository: UserRepository;
  let userModel: {
    findOne: jest.Mock,
    create: jest.Mock,
    updateOne: jest.Mock
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn()
          },
        },
      ],
    }).compile();
    userRepository = module.get(UserRepository);
    userModel = module.get(getModelToken('User'));
  });

  it('Crear un usuario', async () => {
    const dataCreateUser: CreateUserDTO = {
      email: 'fcolchon@gmail.com',
      password: '123456',
      firstName: 'Luis',
      lastName: 'Colchon',
    };
    await userRepository.create(dataCreateUser);
    expect(userModel.create).toHaveBeenCalledWith(dataCreateUser);
  });

  it('Buscar usuario por email sin logeo', async () => {
    const mockUser: UserEntity = {
      email: 'test@mail.com',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      isActive: true,
      lastLogin: undefined,
    };
    
    const execMock = jest.fn().mockResolvedValue(mockUser);
    const selectMock = jest.fn().mockReturnValue({ exec: execMock });

    userModel.findOne.mockReturnValue({select: selectMock})

    const result = await userRepository.findOneByEmail('test@mail.com');

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'test@mail.com',
      isActive: true,
    });
    expect(selectMock).toHaveBeenCalledWith('-password');
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('Buscar usuario por email con logeo', async () => {
    const mockUser: UserEntity = {
      email: 'test@mail.com',
      password: 'hashed',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      isActive: true,
      lastLogin: undefined,
    };
    
    const execMock = jest.fn().mockResolvedValue(mockUser);
    const selectMock = jest.fn().mockReturnValue({ exec: execMock });

    userModel.findOne.mockReturnValue({select: selectMock});

    const result = await userRepository.findOneByEmail('test@mail.com', true);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'test@mail.com',
      isActive: true,
    });
    expect(selectMock).toHaveBeenCalledWith('+password');
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('debería actualizar el lastLogin', async () => {
    const mockUpdate: UserEntity = {
      _id: 'user-id',
      email: 'test@mail.com',
      password: 'hashed',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      isActive: true,
      lastLogin: undefined,
    };

    const execMock = jest.fn().mockResolvedValue(null);

    userModel.updateOne.mockReturnValue({exec: execMock})

    await userRepository.update(mockUpdate);

    expect(userModel.updateOne).toHaveBeenCalledWith(
      { _id: mockUpdate._id },
      { $set: mockUpdate },
    );
  });
});
