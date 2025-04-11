import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuoteRequestDTO } from 'src/models/dtos/quote-request.dto';
import { QuoteEntity } from 'src/models/entities/quote.entity';
import { ExchangeProvider } from 'src/providers/exchange-rate/exchange.provider';
import { QuoteService } from './quote.service';

@Injectable()
export class QuoteFacade {
  constructor(
    private readonly currencyProvider: ExchangeProvider,
    private readonly quoteService: QuoteService,
  ) {}

  async registerQuote(quoteRequestApiDTO: CreateQuoteRequestDTO, user: string) {
    // obteniendo cambio
    const responseRate =
      await this.currencyProvider.getPrice(quoteRequestApiDTO);
    const data = responseRate[quoteRequestApiDTO.from];
    if (!data) {
      throw new InternalServerErrorException('Error al filtrar moneda');
    }
    const convertedAmount = quoteRequestApiDTO.amount * parseFloat(data.price);
    const dataCreateQuote: QuoteEntity = {
      ...quoteRequestApiDTO,
      rate: parseFloat(data.price),
      convertedAmount,
      user,
      timestamp: new Date(),
    };
    const entityCreated = await this.quoteService.createQuote(dataCreateQuote);
    return await this.quoteService.getById(entityCreated.id);
  }

  async getCurrency() {
    const listCurrency = await this.currencyProvider.getCurrencys();
    const keysCurrency = Object.keys(listCurrency);
    return keysCurrency;
  }

  async getQuote(id: string) {
    const quote = await this.quoteService.getById(id);
    if (!quote) {
      throw new NotFoundException('Cotización no existe');
    }
    const now = new Date();
    const expirationDate = new Date(quote.expiresAt);
    if (expirationDate < now) {
      throw new NotFoundException('Cotización expirada');
    }
    return quote;
  }
}
