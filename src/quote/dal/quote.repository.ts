import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuoteEntity } from 'src/models/entities/quote.entity';

@Injectable()
export class QuoteRepository {
  constructor(@InjectModel('Quote') private quotaModel: Model<QuoteEntity>) {}

  async create(quoteData: QuoteEntity): Promise<QuoteEntity> {
    return await this.quotaModel.create(quoteData);
  }

  async findById(id: string): Promise<QuoteEntity> {
    return await this.quotaModel.findOne({ id }).select('-_id -__v').exec();
  }

  async findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<QuoteEntity | null> {
    return await this.quotaModel.findOne({ id, user: userId }).exec();
  }
}
