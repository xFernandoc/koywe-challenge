import { QuoteService } from 'src/quote/bll/quote.service';
import { QuoteOwnershipGuard } from '../quote.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserEntity } from 'src/models/entities/user.entity';

describe('Quote Guard', () => {
  let guard: QuoteOwnershipGuard;
  let quoteService: jest.Mocked<QuoteService>;

  beforeEach(() => {
    // agregando servicio mockeado
    quoteService = {
      validQuoteOwner: jest.fn(),
    } as unknown as jest.Mocked<QuoteService>;
    guard = new QuoteOwnershipGuard(quoteService);
  });

  const createMockContext = (
    userId: string,
    quoteId: string,
  ): ExecutionContext => {
    const req = {
      user: { _id: userId } as UserEntity,
      params: { id: quoteId },
    } as unknown as Request & { user?: UserEntity };

    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  it('Usuario dueño de la cotizacion', async () => {
    quoteService.validQuoteOwner.mockResolvedValue(undefined);

    const context = createMockContext('user123', 'quote456');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(quoteService.validQuoteOwner).toHaveBeenCalledWith(
      'quote456',
      'user123',
    );
  });

  it('Usuario no dueño de la cotizacion', async () => {
    quoteService.validQuoteOwner.mockRejectedValue(
      new ForbiddenException('No autorizado'),
    );
    const context = createMockContext('user123', 'quote456');
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
