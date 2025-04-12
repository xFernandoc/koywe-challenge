import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteEntity } from 'src/models/entities/quote.entity';
import { QuoteRepository } from '../dal/quote.repository';
import { CreateQuoteRequestDTO } from 'src/models/dtos/quote-request.dto';

@Injectable()
export class QuoteService {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  calculateConvertValue(amount: number, price: number): number {
    return amount * price;
  }

  createEntityQuote(
    quoteDTO: CreateQuoteRequestDTO,
    user: string,
    rate: number,
  ): QuoteEntity {
    return {
      ...quoteDTO,
      rate,
      convertedAmount: this.calculateConvertValue(quoteDTO.amount, rate),
      user,
      timestamp: new Date(),
    };
  }

  async getValidQuoteByID(id: string) {
    const quote = await this.getById(id);
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

  async createQuote(quoteEntity: QuoteEntity){
    return await this.quoteRepository.create(quoteEntity);
  }

  async getById(id: string) {
    return await this.quoteRepository.findById(id);
  }
}
