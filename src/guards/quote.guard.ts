import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/models/entities/user.entity';
import { QuoteService } from 'src/quote/bll/quote.service';

@Injectable()
export class QuoteOwnershipGuard implements CanActivate {
  constructor(private readonly quoteService: QuoteService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & { user?: UserEntity } = context
      .switchToHttp()
      .getRequest();
    const user = req.user;
    const quoteId = req.params.id;
    await this.quoteService.validQuoteOwner(quoteId, user._id);
    return true;
  }
}
