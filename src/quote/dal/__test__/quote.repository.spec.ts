import { QuoteEntity } from 'src/models/entities/quote.entity';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { QuoteRepository } from '../quote.repository';

describe('QuoteRepository', () => {
  let repository: QuoteRepository;
  let quotaModel: {
    create: jest.Mock;
    findOne: jest.Mock;
  };

  const mockQuote: QuoteEntity = {
    id: 'SD23K21',
    from: 'BTC',
    to: 'USDT',
    amount: 100,
    rate: 0.85,
    convertedAmount: 85,
    user: '2312894123',
    timestamp: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuoteRepository,
        {
          provide: getModelToken('Quote'),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();
    repository = module.get(QuoteRepository);
    quotaModel = module.get(getModelToken('Quote'));
  });

  describe('Crear usuario', () => {
    it('Crear usuario correctamente', async () => {
      quotaModel.create.mockResolvedValue(mockQuote);

      const userCreated = await repository.create(mockQuote);

      expect(quotaModel.create).toHaveBeenCalledWith(mockQuote);

      expect(userCreated).toEqual(mockQuote);
    });

    it('Crear un usuario con error en la información', async () => {
      quotaModel.create.mockRejectedValue(
        new Error('Error por indice duplicado'),
      );

      await expect(repository.create(mockQuote)).rejects.toThrow(
        'Error por indice duplicado',
      );
    });
  });

  describe('Buscar una cotizacion', () => {
    it('Buscar una cotizacion correctamente', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockQuote);
      const mockSelect = jest.fn().mockReturnValue({ exec: mockExec });
      quotaModel.findOne.mockReturnValue({ select: mockSelect });

      const quoteFindResult = await repository.findById(mockQuote.id);

      expect(quotaModel.findOne).toHaveBeenCalledWith({ id: mockQuote.id });
      expect(mockSelect).toHaveBeenCalledWith('-_id -__v');
      expect(quoteFindResult).toEqual(mockQuote);
    });

    it('Buscar una cotización que no existe ', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockSelect = jest.fn().mockReturnValue({ exec: mockExec });
      quotaModel.findOne.mockReturnValue({ select: mockSelect });
      const quoteFindResult = await repository.findById('id-quote-bad');

      expect(quotaModel.findOne).toHaveBeenCalledWith({ id: 'id-quote-bad' });
      expect(mockSelect).toHaveBeenCalledWith('-_id -__v');
      expect(quoteFindResult).toBeNull();
    });
  });

  describe('Buscar una cotizacion validando el usuario dueño', () => {
    it('Buscar una cotizacion correctamente', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockQuote);
      quotaModel.findOne.mockReturnValue({ exec: mockExec });

      const quoteUserFindResult = await repository.findByIdAndUser(
        mockQuote.id,
        mockQuote.user as string,
      );

      expect(quotaModel.findOne).toHaveBeenCalledWith({
        id: mockQuote.id,
        user: mockQuote.user as string,
      });
      expect(quoteUserFindResult).toEqual(mockQuote);
    });

    it('Buscar una cotización que no pertenece al usuario ', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      quotaModel.findOne.mockReturnValue({ exec: mockExec });

      const quoteUserFindResult = await repository.findByIdAndUser(
        mockQuote.id,
        'user-bad',
      );

      expect(quotaModel.findOne).toHaveBeenCalledWith({
        id: mockQuote.id,
        user: 'user-bad',
      });
      expect(quoteUserFindResult).toBeNull();
    });
  });
});
