import mongoose, { Model, model } from 'mongoose';
import { Quote, QuoteSchema } from '../quota.schema';

describe('Quote schema', () => {
  let QuoteModel: Model<Quote>;

  beforeEach(() => {
    QuoteModel = model('Quote', QuoteSchema);
  });

  it('Creando entidad de cotizacion con valores generados correctamente', async () => {
    const quote = new QuoteModel({
      to: 'BTC',
      from: 'USDT',
      amount: 100,
      rate: 1.5,
      convertedAmount: 150,
      user: new mongoose.Types.ObjectId(),
    });

    await quote.validate();

    expect(quote.id).toMatch(/^[A-Z0-9]{12}$/); // cualquier valor mayus combinado letras y numeros y que sean 12 digitos
    expect(quote.timestamp).toBeInstanceOf(Date);
    expect(quote.expiresAt).toBeInstanceOf(Date);
  });

  it('Campos incompletos, deberá fallar', async () => {
    const quote = new QuoteModel({
      to: 'BTC',
      amount: 100,
      rate: 1.5,
      convertedAmount: 150,
      user: new mongoose.Types.ObjectId(),
    });

    await expect(quote.validate()).rejects.toThrow();
  });
});
