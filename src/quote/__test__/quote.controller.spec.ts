import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from '../quote.controller';
import { QuoteFacade } from '../quote.facade';
import { QuoteOwnershipGuard } from 'src/guards/quote.guard';
import { QuoteService } from 'src/quote/bll/quote.service';
import { CreateQuoteRequestDTO } from 'src/models/dtos/quote-request.dto';
import { QuoteEntity } from 'src/models/entities/quote.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('QuoteController', () => {
    let controller: QuoteController;
    let facade: jest.Mocked<QuoteFacade>;

    const mockQuoteTemplate: QuoteEntity = {
        id: 'SD23K21',
        from: 'BTC',
        to: 'USDT',
        amount: 100,
        rate: 0.85,
        convertedAmount: 85,
        user: '2312894123',
        timestamp: new Date()
    }

    const mockCreateQuoteDTO: CreateQuoteRequestDTO = {
        from: 'BTC',
        to: 'USDT',
        amount: 100,
    }

    const mockUserSession: UserEntity ={
        firstName: 'Luis',
        lastName: 'Colchon',
        email: 'lcolchon@gmail.com',
        password: 'pass-hashed',
        createdAt: new Date(),
        lastLogin: undefined,
        isActive: true,
    }

    const listCurrency = [
        "USDT",
        "PEN",
        "BTC"
]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuoteController],
            providers: [
                {
                    provide: QuoteFacade,
                    useValue: {
                        registerQuote: jest.fn(),
                        getCurrency: jest.fn(),
                        getQuote: jest.fn(),
                    },
                },
                {
                    provide: QuoteService,
                    useValue: {}
                },
                {
                    provide: QuoteOwnershipGuard,
                    useValue: {
                        canActivate: jest.fn().mockResolvedValue(true)
                    }
                },
            ],
        }).compile();

        controller = module.get(QuoteController);
        facade = module.get(QuoteFacade);
    });

    describe('Creando cotizacion', () => {
        it('Creando una cotización correcta', async () => {
            facade.registerQuote.mockResolvedValue(mockQuoteTemplate);

            const quote = await controller.createQuote(mockCreateQuoteDTO,mockUserSession);

            expect(quote).toEqual(mockQuoteTemplate)
        })

        it('Creando una cotización pero con una moneda que no existe',async() => {
            const quotebBodyBad: CreateQuoteRequestDTO = {
                ...mockCreateQuoteDTO,
                from : 'NADA'
            }
        
            facade.registerQuote.mockRejectedValue(new NotFoundException('Moneda de busqueda no existe'))

            await expect(controller.createQuote(quotebBodyBad,mockUserSession)).rejects.toThrow(NotFoundException)
            await expect(controller.createQuote(quotebBodyBad,mockUserSession)).rejects.toThrow('Moneda de busqueda no existe')
        })
    })

    describe('Obteniendo una cotización', () => {
        it('Obteniendo una cotización correcta',async () => {
            facade.getQuote.mockResolvedValue(mockQuoteTemplate);

            const quote = await controller.getQuote(mockQuoteTemplate.id);

            expect(quote).toEqual(mockQuoteTemplate)
        })
    })

    describe('Obtener listado de monedas', () => {
        it('Listado de monedas',async() => {
            facade.getCurrency.mockResolvedValue(listCurrency);

            const currency = await controller.getCurrencyList();

            expect(currency).toEqual(listCurrency)
        })
    })
});
