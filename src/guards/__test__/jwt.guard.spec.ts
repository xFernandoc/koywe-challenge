import { UnauthorizedException } from '@nestjs/common';
import { JWTGuardCustom } from '../jwt.guard';
import { UserEntity } from 'src/models/entities/user.entity';

describe('JWTGuardCustom', () => {
  let guard: JWTGuardCustom;

  const mockUser: UserEntity = {
    firstName: 'Luis',
    lastName: 'Colchon',
    email: 'lcolchon@gmail.com',
    password: 'pass-hashed',
    createdAt: new Date(),
    lastLogin: undefined,
    isActive: true,
  };

  beforeEach(() => {
    guard = new JWTGuardCustom();
  });

  describe('Inicio de validacion de jwt', () => {
    it('Retorna un usuario si es valido', () => {
      const result = guard.handleRequest<UserEntity>(null, mockUser, null);
      expect(result).toEqual(mockUser);
    });

    it('Lanzar un error de no autorizado', () => {
      expect(() => guard.handleRequest<Error>(null, null, null)).toThrow(
        UnauthorizedException,
      );
    });

    it('Error por token expirado', () => {
      const mockError = new Error('Token expired');
      expect(() => guard.handleRequest<Error>(null, null, mockError)).toThrow(
        new UnauthorizedException('Token expired'),
      );
    });

    it('Error por no enviar token', () => {
      expect(() =>
        guard.handleRequest<Error>(null, null, 'not-an-error'),
      ).toThrow(new UnauthorizedException('Without token'));
    });
  });
});
