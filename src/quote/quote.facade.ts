import { Injectable, NotFoundException } from '@nestjs/common';
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
    const responseRate = await this.currencyProvider.getPrice(quoteRequestApiDTO);
    if (!responseRate) {
      throw new NotFoundException('Moneda de busqueda no existe');
    }

    const entityQuote = this.quoteService.createEntityQuote(
      quoteRequestApiDTO,
      user,
      parseFloat(responseRate.price),
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
