import { QuoteRepository } from "src/quote/dal/quote.repository"
import { QuoteService } from "../quote.service";
import { Test } from "@nestjs/testing";
import { QuoteEntity } from "src/models/entities/quote.entity";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateQuoteRequestDTO } from "src/models/dtos/quote-request.dto";

describe('Quote service',() => {
    let quoteService: QuoteService
    let repository: jest.Mocked<QuoteRepository>;

    const mockQuoteTemplate : QuoteEntity = {
        id: 'SD23K21',
        from: 'BTC',
        to: 'USDT',
        amount: 100,
        rate: 0.85,
        convertedAmount: 85,
        user: '2312894123',
        timestamp: new Date()
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule((
            {
                providers : [
                    QuoteService,
                    {
                        provide : QuoteRepository,
                        useValue: {
                            create : jest.fn(),
                            findById : jest.fn(),
                            findByIdAndUser : jest.fn()
                        }
                    }
                ]
            }
        )).compile();

        quoteService = module.get(QuoteService);
        repository = module.get(QuoteRepository)
    })

    describe('Obtener cotización', () => {
        it('Obtener una cotización por id valido',async () => {
            repository.findById.mockResolvedValue(mockQuoteTemplate)

            const quoteFindById = await quoteService.getById(mockQuoteTemplate.id);

            expect(quoteFindById).toEqual(mockQuoteTemplate);
            expect(repository.findById).toHaveBeenCalledWith(mockQuoteTemplate.id)
        })

        it('Cotizacion no existe', async () => {
            repository.findById.mockResolvedValue(null);

            const quoteFindById = await quoteService.getById('id-bad');

            expect(quoteFindById).toBeNull()
            expect(repository.findById).toHaveBeenCalledWith('id-bad')
        })
    })

    describe('Crear una cotización',() => {
        it('Crear correctamente una cotizacion', async () => {
            repository.create.mockResolvedValue(mockQuoteTemplate);

            const quoteCreated = await quoteService.createQuote(mockQuoteTemplate);

            expect(quoteCreated).toEqual(mockQuoteTemplate);
            expect(repository.create).toHaveBeenCalledWith(mockQuoteTemplate);
        })

        it('Crear una cotizacion con error por indice duplicado',async() => {
            repository.create.mockRejectedValue(new Error('Error, indice duplicado'));

            await expect(quoteService.createQuote(mockQuoteTemplate)).rejects.toThrow('Error, indice duplicado')
        })
    })

    describe('Validar cotizacion', () => {
        it('Cotizacion correcta', async () => {
            const mockQuote = {
                ...mockQuoteTemplate,
                expiresAt : new Date(new Date().getTime() + (5 * 60 * 1000))
            }
            repository.findById.mockResolvedValue(mockQuote);

            const resultQuote = await quoteService.getValidQuoteByID(mockQuote.id);

            expect(resultQuote).toEqual(mockQuote);
            expect(repository.findById).toHaveBeenCalledWith(mockQuote.id);
        })

        it('Cotización no encontrada', async () => {
            repository.findById.mockResolvedValue(null);
            await expect(quoteService.getValidQuoteByID('id-bad')).rejects.toThrow(NotFoundException);
            await expect(quoteService.getValidQuoteByID('id-bad')).rejects.toThrow('Cotización no existe');
        })

        it('Cotización expirada', async () => {
            const mockExpired = {
                ...mockQuoteTemplate,
                expiresAt : new Date(new Date().getTime() - (5 * 60 * 1000))
            }
            repository.findById.mockResolvedValue(mockExpired);
            await expect(quoteService.getValidQuoteByID(mockExpired.id)).rejects.toThrow(NotFoundException);
            await expect(quoteService.getValidQuoteByID(mockExpired.id)).rejects.toThrow('Cotización expirada');
        })
    })

    describe('Validar propiedad de cotizacion', () => {
        it('Cotización pertenece a usuario',async () => {
            repository.findByIdAndUser.mockResolvedValue(mockQuoteTemplate);
            const resultQuote = await quoteService.validQuoteOwner(mockQuoteTemplate.id,mockQuoteTemplate.user as string);
            expect(resultQuote).toEqual(mockQuoteTemplate);
            expect(repository.findByIdAndUser).toHaveBeenCalledWith(mockQuoteTemplate.id,mockQuoteTemplate.user)
        })
        it('Cotización no pertenece a usuario',async() => {
            repository.findByIdAndUser.mockResolvedValue(null);
            await expect(quoteService.validQuoteOwner(mockQuoteTemplate.id,"id-bad")).rejects.toThrow(UnauthorizedException);
            await expect(quoteService.validQuoteOwner(mockQuoteTemplate.id,"id-bad")).rejects.toThrow('No tienes acceso a esta cotización');
            expect(repository.findByIdAndUser).toHaveBeenCalledWith(mockQuoteTemplate.id,"id-bad")
        })
    })

    describe('Servicios adicionales',() => {

        it('Validando calculo del valor convertido',() => {
            const amount = 200;
            const rate = 1.5;
            const resultExpected =  200 * 1.5;
            const calculateConvertValue = quoteService.calculateConvertValue(amount,rate);
            expect(calculateConvertValue).toEqual(resultExpected)
        })
        it('validando creación de entity quote', () => {
            const createQuoteDTO : CreateQuoteRequestDTO = {
                amount: 2000,
                from: "USDT",
                to: "BTC"
            }

            const quoteEntity = quoteService.createEntityQuote(createQuoteDTO,'user-id',2.5)
            expect(quoteEntity.convertedAmount).toEqual(5000);
            expect(quoteEntity.timestamp).toBeInstanceOf(Date);
        })
    })
})