import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { QuoteFacade } from './quote.facade';
import { CreateQuoteRequestDTO } from 'src/models/dtos/quote-request.dto';
import { JWTGuardCustom } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/request-user.decorator';
import { UserEntity } from 'src/models/entities/user.entity';
import { QuoteOwnershipGuard } from 'src/guards/quote.guard';

@UseGuards(JWTGuardCustom)
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteFacade: QuoteFacade) {}

  @Post('')
  async createQuote(
    @Body() quoteRequestApiDTO: CreateQuoteRequestDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.quoteFacade.registerQuote(quoteRequestApiDTO, user._id);
  }

  @Get('currency-available')
  async getCurrencyList() {
    return await this.quoteFacade.getCurrency();
  }

  @UseGuards(QuoteOwnershipGuard)
  @Get('/:id')
  async getQuote(@Param('id') id: string) {
    return await this.quoteFacade.getQuote(id);
  }
}
