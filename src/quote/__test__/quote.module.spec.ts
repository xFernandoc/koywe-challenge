import { Test, TestingModule } from "@nestjs/testing"
import { QuoteModule } from "../quote.module"
import { QuoteController } from "../quote.controller";
import { QuoteService } from "../bll/quote.service";
import { ExchangeProvider } from "src/providers/exchange-rate/exchange.provider";
import { QuoteFacade } from "../quote.facade";
import { getModelToken } from "@nestjs/mongoose";
import { QuoteRepository } from "../dal/quote.repository";

describe('Quote Module', () => {
    let moduleTesting: TestingModule;
    beforeAll(async () => {
        moduleTesting = await Test.createTestingModule({
            imports: [
                QuoteModule
            ]
        })
        .overrideProvider(getModelToken('Quote'))
        .useValue({})
        .compile()
    })

    it('Modulo definido', () => {
        expect(moduleTesting).toBeDefined();
    });

    it('Controlador inyectado correctamente', () => {
        const quoteController = moduleTesting.get<QuoteController>(QuoteController);
        expect(quoteController).toBeDefined();
    });

    it('Servicio de cotizacion inyectado correctamente', () => {
        const quoteService = moduleTesting.get<QuoteService>(QuoteService);
        expect(quoteService).toBeDefined();
    });

    it('Servicio de moneda inyectado correctamente', () => {
        const exchangeProvider = moduleTesting.get<ExchangeProvider>(ExchangeProvider);
        expect(exchangeProvider).toBeDefined();
    });

    it('Fachada inyectada correctamente', () => {
        const quoteFacade = moduleTesting.get<QuoteFacade>(QuoteFacade);
        expect(quoteFacade).toBeDefined();
    });

    it('Repositorio inyectado correctamente', () => {
        const quoteRepository = moduleTesting.get<QuoteRepository>(QuoteRepository);
        expect(quoteRepository).toBeDefined();
    });
})