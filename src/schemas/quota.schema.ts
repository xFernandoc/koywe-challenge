import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { QuoteEntity } from 'src/models/entities/quote.entity';
import { UserEntity } from 'src/models/entities/user.entity';

@Schema()
export class Quote implements QuoteEntity {
  _id: string;

  @Prop({
    unique: true,
    required: false,
    type: String,
    default: nanoid(8).toUpperCase(),
  })
  id?: string;

  @Prop({
    required: true,
    type: String,
  })
  to: string;

  @Prop({
    required: true,
    type: String,
  })
  from: string;

  @Prop({
    required: true,
    type: Number,
  })
  amount: number;

  @Prop({
    required: true,
    type: Number,
  })
  rate: number;

  @Prop({
    required: true,
    type: Number,
  })
  convertedAmount: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: string | UserEntity;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  timestamp: Date;

  @Prop({
    required: true,
    type: Date,
    default: function () {
      const minutesToAdd = parseInt(process.env.EXPIRATION_MIN || '5', 10);
      const now = new Date();
      const expirationTime = new Date(now.getTime() + minutesToAdd * 60 * 1000);
      return expirationTime;
    },
  })
  expiresAt: Date;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
