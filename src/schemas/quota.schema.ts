import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { QuotaEntity } from "src/models/entities/quota.entity";
import { UserEntity } from "src/models/entities/user.entity";

@Schema()
export class Quota implements QuotaEntity{
    _id: string;

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
            const daysToAdd = parseInt(process.env.EXPIRATION_DAYS || '5', 10);
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() + daysToAdd);
            return timestamp;
        }
    })
    expiresAt: Date;
}

export const QuotaSchema = SchemaFactory.createForClass(Quota);