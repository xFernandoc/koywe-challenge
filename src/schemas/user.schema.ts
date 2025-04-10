import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEntity } from '../models/entities/user.entity';

@Schema()
export class User implements UserEntity {
  _id: string;

  @Prop({
    required: true,
    type: String,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
  })
  lastName: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    select: false,
  })
  password: string;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    required: false,
    type: Date,
  })
  lastLogin: Date;

  @Prop({
    required: false,
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
