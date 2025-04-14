import 'reflect-metadata';

import { validate } from 'src/env.validation';

describe('Validacion de ambiente', () => {
  it('Valida el ingreso de todas las variables', () => {
    const validEnv = {
      PORT: 3000,
      DB_URL: 'mongodb://localhost:27017/test',
      SECRET_JWT: 'abckoywe',
      EXPIRATION_MIN: '60',
      BASE_URL_API_CURRENCY: 'https://api.example.com',
      API_CURRENCY_SERVICE_GET_PRICE: '/get-price',
    };

    const result = validate(validEnv);
    expect(result.PORT).toBe(3000);
    expect(result.EXPIRATION_MIN).toBe(60);
    expect(result.DB_URL).toBe(validEnv.DB_URL);
  });

  it('En caso falte alguna variable deberá dar error', () => {
    const invalidEnv = {
      PORT: '3000',
      DB_URL: 'mongodb://localhost:27017/test',
    };

    expect(() => validate(invalidEnv)).toThrow(Error);
  });

  it('En caso no sea el tipo correcto de la variable', () => {
    const invalidEnv = {
      PORT: 'texto',
      DB_URL: 'mongodb://localhost:27017/test',
      SECRET_JWT: 'abckoywe',
      EXPIRATION_MIN: '60',
      BASE_URL_API_CURRENCY: 'https://api.example.com',
      API_CURRENCY_SERVICE_GET_PRICE: '/get-price',
    };

    expect(() => validate(invalidEnv)).toThrow(Error);
  });
});
