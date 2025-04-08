import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

class EnviromentVariables {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_URL: string;

  @IsNotEmpty()
  @IsString()
  SECRET_JWT: string;
}

export function validate(config: Record<string, unknown>) {
  const validateConfig = plainToClass(EnviromentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validateConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validateConfig;
}
