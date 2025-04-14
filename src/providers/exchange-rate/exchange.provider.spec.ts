import { HttpService } from '@nestjs/axios';
import { ExchangeProvider } from './exchange.provider';
import { Test } from '@nestjs/testing';
import { PriceDataResponse } from './type/api-currency.entity';
import { of, throwError } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
import { CreateQuoteRequestDTO } from 'src/models/dtos/quote-request.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('Exchange provider', () => {
  let exchangeProvider: ExchangeProvider;
  let httpService: jest.Mocked<HttpService>;

  const mockCreateQuoteDTO: CreateQuoteRequestDTO = {
    from: 'BTC',
    to: 'USDT',
    amount: 100,
  };

  const mockResulCurrency: PriceDataResponse = {
    BTC: {
      price: '0.85',
      currency: 'USDT',
      timestamp: new Date().toISOString(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExchangeProvider,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    exchangeProvider = module.get(ExchangeProvider);
    httpService = module.get(HttpService);
  });

  describe('Obteniendo precio', () => {
    it('Obteniendo el precio correctamente', async () => {
      const mockResponse: AxiosResponse = {
        data: mockResulCurrency,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: null,
        },
      };
      httpService.get.mockReturnValue(of(mockResponse));

      const price = await exchangeProvider.getPrice(mockCreateQuoteDTO);

      expect(price).toEqual(mockResulCurrency[mockCreateQuoteDTO.from]);
    });

    it('Obteniendo el precio de una moneda inválida', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          USDT: {
            price: '0.85',
            currency: 'BTC',
            timestamp: new Date().toISOString(),
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: null,
        },
      };
      httpService.get.mockReturnValue(of(mockResponse));

      const responseCurrency =
        await exchangeProvider.getPrice(mockCreateQuoteDTO);

      expect(responseCurrency).toBeNull();
    });

    it('Obteniendo el precio de una moneda que no existe', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: null,
        },
      };
      httpService.get.mockReturnValue(of(mockResponse));

      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(BadRequestException);
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow('No existe precio para esta combinación de moneda.');
    });

    it('Mostrar errores axios de api 2002', async () => {
      const axiosError = new axios.AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
      );
      const currencyError = 'EUR';
      axiosError.response = {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {
          headers: null,
        },
        data: {
          timestamp: '2025-04-13T00:33:11.777Z',
          error: {
            description: `Try get /public/currency, to get list of all available currencies.`,
            code: 2002,
            message: `No such currency: ${currencyError}`,
          },
          path: '/api/3/public/price/rate?from=USDT&to=EUR',
          requestId: 'b1f7dfc8-105747848',
        },
      };
      httpService.get.mockReturnValue(throwError(() => axiosError));
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(BadRequestException);
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(
        `Moneda ${currencyError} no existe, consulta en /quote/currency-available`,
      );
    });
    it('Mostrar errores axios de api no conocido', async () => {
      const axiosError = new axios.AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
      );
      axiosError.response = {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {
          headers: null,
        },
        data: {
          timestamp: '2025-04-13T00:33:11.777Z',
          error: {
            description: `Try get /public/currency, to get list of all available currencies.`,
            code: 9999,
            message: `Error desconocido`,
          },
          path: '/api/3/public/price/rate?from=USDT&to=EUR',
          requestId: 'b1f7dfc8-105747848',
        },
      };
      httpService.get.mockReturnValue(throwError(() => axiosError));
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(BadRequestException);
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(`Error desconocido`);
    });
    it('Mostrar errores no axios de api no conocido', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('No conocido')),
      );
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        exchangeProvider.getPrice(mockCreateQuoteDTO),
      ).rejects.toThrow(`Error desconocido`);
    });
  });

  describe('Obteniendo monedas', () => {
    it('Listado correcto de las monedas', async () => {
      const mockResponse: AxiosResponse = {
        data: { ...mockResulCurrency },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: null,
        },
      };
      httpService.get.mockReturnValue(of(mockResponse));

      const currencys = await exchangeProvider.getCurrencys();
      const keysCurrency = Object.keys(mockResulCurrency);

      expect(currencys).toEqual(keysCurrency);
    });

    it('Mostrar errores axios de api no conocido', async () => {
      const axiosError = new axios.AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
      );
      axiosError.response = {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {
          headers: null,
        },
        data: {
          timestamp: '2025-04-13T00:33:11.777Z',
          error: {
            description: `Try get /public/currency, to get list of all available currencies.`,
            code: 9999,
            message: `Error desconocido`,
          },
          path: '/api/3/public/price/rate?from=USDT&to=EUR',
          requestId: 'b1f7dfc8-105747848',
        },
      };
      httpService.get.mockReturnValue(throwError(() => axiosError));
      await expect(exchangeProvider.getCurrencys()).rejects.toThrow(
        BadRequestException,
      );
      await expect(exchangeProvider.getCurrencys()).rejects.toThrow(
        `Error desconocido`,
      );
    });
    it('Mostrar errores no axios de api no conocido', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('No conocido')),
      );
      await expect(exchangeProvider.getCurrencys()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(exchangeProvider.getCurrencys()).rejects.toThrow(
        `Error desconocido`,
      );
    });
  });
});
