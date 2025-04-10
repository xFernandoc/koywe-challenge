import { UserEntity } from './user.entity';

export interface QuotaEntity {
  to: string;
  from: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  user: string | UserEntity;
  timestamp: Date;
  expiresAt: Date;
}
