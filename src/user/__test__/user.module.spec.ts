import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user.module';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../bll/user.service';
import { UserRepository } from '../dal/user.repository';

describe('User Module', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getModelToken('User'))
      .useValue({})
      .compile();
  });

  it('Compilacion correcta del modulo', () => {
    expect(module).toBeDefined();
  });

  it('Validar inyeccion de user service', () => {
    const service = module.get<UserService>(UserService);
    expect(service).toBeDefined();
  });

  it('Validar inyeccion de user repository', () => {
    const repository = module.get<UserRepository>(UserRepository);
    expect(repository).toBeDefined();
  });
});
