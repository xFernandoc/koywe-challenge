import { Test } from "@nestjs/testing"
import { QuoteFacade } from "../quote.facade";
import { ExchangeProvider } from "src/providers/exchange-rate/exchange.provider";
import { QuoteService } from "../bll/quote.service";
import { QuoteEntity } from "src/models/entities/quote.entity";
import { CreateQuoteRequestDTO } from "src/models/dtos/quote-request.dto";
import { CurrencyData, PriceDataResponse } from "src/providers/exchange-rate/type/api-currency.entity";
import { NotFoundException } from "@nestjs/common";

describe('Quote Facade', () => {

    let facade: QuoteFacade;
    let exchangeProvider: jest.Mocked<ExchangeProvider>
    let quoteService: jest.Mocked<QuoteService>

    const mockQuoteTemplate: QuoteEntity = {
        id: 'SD23K21',
        from: 'BTC',
        to: 'USDT',
        amount: 100,
        rate: 0.85,
        convertedAmount: 85,
        user: 'userid',
        timestamp: new Date()
    }

    const mockCreateQuoteDTO: CreateQuoteRequestDTO = {
        from: 'BTC',
        to: 'USDT',
        amount: 100
    }

    const listCurrency = [
        "USDT",
        "PEN",
        "BTC"
    ]

    const mockResulCurrency: CurrencyData = {
        price: "0.85",
        currency: 'USDT',
        timestamp: new Date().toISOString()
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                QuoteFacade,
                {
                    provide: ExchangeProvider,
                    useValue: {
                        getPrice: jest.fn(),
                        getCurrencys: jest.fn()
                    }
                },
                {
                    provide: QuoteService,
                    useValue: {
                        createEntityQuote: jest.fn(),
                        createQuote: jest.fn(),
                        getById: jest.fn(),
                        getValidQuoteByID: jest.fn()
                    }
                }
            ]
        }).compile()
        quoteService = module.get(QuoteService);
        facade = module.get(QuoteFacade);
        exchangeProvider = module.get(ExchangeProvider);
    })

    describe('Registrar cotizacion', () => {
        it('Crear cotizacion correctamente', async () => {

            exchangeProvider.getPrice.mockResolvedValue(mockResulCurrency);
            quoteService.createEntityQuote.mockReturnValue(mockQuoteTemplate);
            quoteService.createQuote.mockResolvedValue(mockQuoteTemplate);
            quoteService.getById.mockResolvedValue(mockQuoteTemplate);

            const resultQuote = await facade.registerQuote(mockCreateQuoteDTO, 'userid')

            expect(resultQuote).toEqual(mockQuoteTemplate);
            expect(exchangeProvider.getPrice).toHaveBeenCalledWith(mockCreateQuoteDTO)
            expect(quoteService.createEntityQuote).toHaveBeenCalledWith(mockCreateQuoteDTO, 'userid', parseFloat(mockResulCurrency.price));
            expect(quoteService.createQuote).toHaveBeenCalledWith(mockQuoteTemplate)
            expect(quoteService.getById).toHaveBeenCalledWith(mockQuoteTemplate.id)
        })

        it('Crear cotizacion pero no existe moneda', async () => {
            exchangeProvider.getPrice.mockResolvedValue(null);
            await expect(facade.registerQuote(mockCreateQuoteDTO, 'userid')).rejects.toThrow(NotFoundException)
            await expect(facade.registerQuote(mockCreateQuoteDTO, 'userid')).rejects.toThrow('Moneda de busqueda no existe')
        })
    })

    describe('Obtener monedas', () => {
        it('Obtener litado de monedas', async () => {
            exchangeProvider.getCurrencys.mockResolvedValue(listCurrency)
            const currency = await facade.getCurrency();

            expect(currency.length).toEqual(listCurrency.length)
        })
    })

    describe('Obtener cotizacion', () => {
        it('Obtener una cotización correcta', async () => {
            quoteService.getValidQuoteByID.mockResolvedValue(mockQuoteTemplate)
            const quoteResult = await facade.getQuote(mockQuoteTemplate.id);

            expect(quoteResult).toEqual(mockQuoteTemplate);
        })

        it('Obtener una cotizacion vencida', async () => {
            quoteService.getValidQuoteByID.mockRejectedValue(new NotFoundException('Cotización no existe'))
            await expect(facade.getQuote(mockQuoteTemplate.id)).rejects.toThrow(NotFoundException)
            await expect(facade.getQuote(mockQuoteTemplate.id)).rejects.toThrow('Cotización no existe')
        })

        it('Obtener una cotizacion que no existe', async () => {
            quoteService.getValidQuoteByID.mockRejectedValue(new NotFoundException('Cotización expirada'))
            await expect(facade.getQuote(mockQuoteTemplate.id)).rejects.toThrow(NotFoundException)
            await expect(facade.getQuote(mockQuoteTemplate.id)).rejects.toThrow('Cotización expirada')
        })
    })
})