import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { AuthController } from '../auth.controller';
import { AuthService } from '../bll/auth.service';
import { AuthFacade } from '../facades/auth/auth.facade';
import { LocalStrategy } from 'src/providers/auth/local.provider';

describe('authModule', () => {
  let testingModule: TestingModule;
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key === 'SECRET_JWT') return 'test-secret'; //dummy
          return null;
        },
      })
      .overrideProvider(getModelToken('User'))
      .useValue({})
      .compile();
  });

  it('Validando existencia de modulo', () => {
    const authModule = testingModule.get<AuthModule>(AuthModule);
    expect(authModule).toBeDefined();
  });

  it('Validando existencia de AuthController', () => {
    const authController = testingModule.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
  });

  it('Validando existencia de AuthService', () => {
    const authService = testingModule.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });

  it('Validando existencia de AuthFacade', () => {
    const authFacade = testingModule.get<AuthFacade>(AuthFacade);
    expect(authFacade).toBeDefined();
  });

  it('Validando existencia de LocalStrategy', () => {
    const localStrategy = testingModule.get<LocalStrategy>(LocalStrategy);
    expect(localStrategy).toBeDefined();
  });
});
