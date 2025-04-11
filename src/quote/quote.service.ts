import { Injectable } from '@nestjs/common';
import { QuoteRepository } from './dal/quote.repository';
import { QuoteEntity } from 'src/models/entities/quote.entity';

@Injectable()
export class QuoteService {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async createQuote(quoteEntity: QuoteEntity): Promise<QuoteEntity> {
    return await this.quoteRepository.create(quoteEntity);
  }

  async getById(id: string) {
    return await this.quoteRepository.findById(id);
  }
}
