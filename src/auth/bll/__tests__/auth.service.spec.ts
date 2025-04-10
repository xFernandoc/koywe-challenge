import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/models/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  const user: UserEntity = {
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
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  it('singIn - Creación de token con payload entregado', async () => {
    const mockToken = 'jwt_hashed';
    const jwtServiceSignAsync =
      jwtService.signAsync.mockResolvedValue(mockToken);
    const result = await authService.singIn(user);
    expect(jwtServiceSignAsync).toHaveBeenCalledWith({
      email: user.email,
      isActive: user.isActive,
    });
    expect(result.accessToken).toBe(mockToken);
    expect(result.expires instanceof Date).toBe(true);
  });
});
