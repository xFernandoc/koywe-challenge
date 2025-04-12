import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { ExchangeProvider } from 'src/providers/exchange-rate/exchange.provider';
import { HttpModule } from '@nestjs/axios';
import { QuoteFacade } from './quote.facade';
import { QuoteRepository } from './dal/quote.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteSchema } from 'src/schemas/quota.schema';
import { QuoteService } from './bll/quote.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'Quote',
        schema: QuoteSchema,
      },
    ]),
  ],
  controllers: [QuoteController],
  providers: [QuoteService, ExchangeProvider, QuoteFacade, QuoteRepository],
})
export class QuoteModule {}
