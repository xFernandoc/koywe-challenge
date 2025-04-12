import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateQuoteRequestDTO } from 'src/models/dtos/quote-request.dto';
import { ExchangeProvider } from 'src/providers/exchange-rate/exchange.provider';
import { QuoteService } from './bll/quote.service';

@Injectable()
export class QuoteFacade {
  constructor(
    private readonly currencyProvider: ExchangeProvider,
    private readonly quoteService: QuoteService,
  ) {}

  async registerQuote(quoteRequestApiDTO: CreateQuoteRequestDTO, user: string) {
    const responseRate =
      await this.currencyProvider.getPrice(quoteRequestApiDTO);
    const data = responseRate[quoteRequestApiDTO.from];
    if (!data) {
      throw new InternalServerErrorException('Error al filtrar moneda');
    }

    const entityQuote = this.quoteService.createEntityQuote(
      quoteRequestApiDTO,
      user,
      parseFloat(data.price),
    );
    const entityCreated = await this.quoteService.createQuote(entityQuote);

    return await this.quoteService.getById(entityCreated.id);
  }

  async getCurrency() {
    return await this.currencyProvider.getCurrencys();
  }

  async getQuote(id: string) {
    return await this.quoteService.getValidQuoteByID(id);
  }
}
