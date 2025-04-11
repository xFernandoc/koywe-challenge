import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { QuoteRequestApiDTO } from 'src/models/dtos/quote-request.dto';
import {
  CurrencyListResponse,
  PriceDataResponse,
} from './type/api-currency.entity';
import { DataErrorResponseApi } from './type/api-errors.entity';
import { AxiosError } from 'axios';

@Injectable()
export class ExchangeProvider {
  private readonly BASE_URL = process.env.BASE_URL_API_CURRENCY;
  constructor(private readonly httpService: HttpService) {}

  async getPrice({ from, to }: QuoteRequestApiDTO) {
    try {
      const urlPrice = process.env.API_CURRENCY_SERVICE_GET_PRICE;
      const requestObs = this.httpService.get<PriceDataResponse>(
        `${this.BASE_URL}${urlPrice}?from=${encodeURI(from)}&to=${encodeURI(to)}`,
      );
      const responsePrice = await lastValueFrom(requestObs);
      if (Object.keys(responsePrice.data).length == 0) {
        throw new BadRequestException(
          'No existe precio para esta combinación de moneda.',
        );
      }
      return responsePrice.data;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        if (error.response && error.response.data) {
          const dataErrorApi = error.response.data as DataErrorResponseApi;
          if (dataErrorApi.error.code == 2002) {
            const currency = dataErrorApi.error.message.split(':')[1];
            throw new BadRequestException(
              `Moneda ${currency.trim()} no existe, consulta en /quote/currency-available`,
            );
          }
          throw new BadRequestException(dataErrorApi.error.message);
        }
      } else {
        if (error instanceof BadRequestException) {
          throw new BadRequestException(error.message);
        }
        throw new InternalServerErrorException('Error desconocido');
      }
    }
  }

  async getCurrencys() {
    try {
      const urlCurrency = process.env.API_CURRENCY_SERVICE_GET_CURRENCY;
      const requestObs = this.httpService.get<CurrencyListResponse>(
        `${this.BASE_URL}${urlCurrency}`,
      );
      const responsePrice = await lastValueFrom(requestObs);
      return responsePrice.data;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        if (error.response && error.response.data) {
          const dataErrorApi = error.response.data as DataErrorResponseApi;
          throw new BadRequestException(dataErrorApi.error.message);
        }
      } else {
        throw new InternalServerErrorException('Error desconocido');
      }
    }
  }
}
