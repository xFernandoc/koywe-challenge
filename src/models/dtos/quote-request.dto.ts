import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class QuoteRequestApiDTO {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
}

export class CreateQuoteRequestDTO extends QuoteRequestApiDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
